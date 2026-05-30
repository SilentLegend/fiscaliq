'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { createInvoiceSchema } from '@/lib/types/forms';
import type { ActionResult } from '@/lib/types/forms';
import type { InvoiceStatus } from '@/lib/types/database';

export async function createInvoice(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  // Parse line items from form data
  const descriptions = formData.getAll('line_description');
  const quantities = formData.getAll('line_quantity');
  const unitPrices = formData.getAll('line_unit_price');
  const vatPercentages = formData.getAll('line_vat_percentage');

  const lineItems = descriptions.map((_, i) => ({
    description: descriptions[i] as string,
    quantity: Number(quantities[i] || 1),
    unit_price: Number(unitPrices[i] || 0),
    vat_percentage: Number(vatPercentages[i] || 21),
  }));

  const parsed = createInvoiceSchema.safeParse({
    client_id: formData.get('client_id'),
    invoice_date: formData.get('invoice_date'),
    due_date: formData.get('due_date'),
    status: formData.get('status') || 'draft',
    notes: formData.get('notes'),
    payment_instructions: formData.get('payment_instructions'),
    line_items: lineItems,
  });

  if (!parsed.success) {
    return {
      error: 'Controleer de invoer',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Generate invoice number
  const { data: settings } = await supabase
    .from('invoice_settings')
    .select('next_invoice_number')
    .eq('user_id', user.id)
    .single();

  const nextNumber = settings?.next_invoice_number ?? 1;
  const year = new Date().getFullYear();
  const invoiceNumber = `JV-${year}-${String(nextNumber).padStart(4, '0')}`;

  // Calculate totals
  const subtotal = parsed.data.line_items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );
  const vatTotal = parsed.data.line_items.reduce(
    (sum, item) =>
      sum + item.quantity * item.unit_price * (item.vat_percentage / 100),
    0,
  );
  const total = subtotal + vatTotal;

  // Insert invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({
      user_id: user.id,
      client_id: parsed.data.client_id,
      invoice_number: invoiceNumber,
      invoice_date: parsed.data.invoice_date,
      due_date: parsed.data.due_date,
      status: parsed.data.status as InvoiceStatus,
      subtotal: Math.round(subtotal * 100) / 100,
      vat_total: Math.round(vatTotal * 100) / 100,
      total: Math.round(total * 100) / 100,
      notes: parsed.data.notes || null,
      payment_instructions: parsed.data.payment_instructions || null,
    })
    .select('id')
    .single();

  if (invoiceError || !invoice) {
    return { error: 'Factuur opslaan mislukt: ' + (invoiceError?.message ?? '') };
  }

  // Insert line items
  const lineItemsToInsert = parsed.data.line_items.map((item) => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    vat_percentage: item.vat_percentage,
    line_total: Math.round(
      item.quantity * item.unit_price * (1 + item.vat_percentage / 100) * 100,
    ) / 100,
  }));

  const { error: itemsError } = await supabase
    .from('line_items')
    .insert(lineItemsToInsert);

  if (itemsError) {
    return { error: 'Factuurregels opslaan mislukt' };
  }

  // Update invoice number counter
  await supabase
    .from('invoice_settings')
    .update({ next_invoice_number: nextNumber + 1 })
    .eq('user_id', user.id);

  revalidatePath('/invoices');
  return { data: invoice.id }; // Return invoice ID for redirect
}

export async function updateInvoiceStatus(
  invoiceId: string,
  newStatus: InvoiceStatus,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const { error } = await supabase
    .from('invoices')
    .update({ status: newStatus })
    .eq('id', invoiceId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Status bijwerken mislukt' };
  }

  revalidatePath('/invoices');
  return { data: 'Status bijgewerkt' };
}

export async function deleteInvoice(
  invoiceId: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', invoiceId)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Verwijderen mislukt' };
  }

  revalidatePath('/invoices');
  return { data: 'Factuur verwijderd' };
}
