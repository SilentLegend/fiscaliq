import { createClient } from '@/lib/supabase/server';
import type { Invoice, InvoiceWithItems, InvoiceStatus } from '@/lib/types/database';

export interface InvoiceFilters {
  status?: InvoiceStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export async function getInvoices(
  userId: string,
  filters?: InvoiceFilters,
): Promise<Invoice[]> {
  const supabase = await createClient();

  let query = supabase
    .from('invoices')
    .select(`
      *,
      client:client_id(name, city)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `invoice_number.ilike.%${filters.search}%,client.name.ilike.%${filters.search}%`,
    );
  }

  if (filters?.dateFrom) {
    query = query.gte('invoice_date', filters.dateFrom);
  }

  if (filters?.dateTo) {
    query = query.lte('invoice_date', filters.dateTo);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch invoices: ${error.message}`);

  // Flatten joined client data
  return (data ?? []).map((invoice: Record<string, unknown>) => ({
    ...invoice,
    client_name: (invoice.client as { name?: string } | null)?.name ?? '',
    client_city: (invoice.client as { city?: string } | null)?.city ?? '',
  })) as Invoice[];
}

export async function getInvoiceById(
  id: string,
  userId: string,
): Promise<InvoiceWithItems | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:client_id(*),
      line_items(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return null;

  return {
    ...data,
    client_name: data.client?.name ?? '',
    client_city: data.client?.city ?? '',
  } as unknown as InvoiceWithItems;
}

export interface DashboardStats {
  totalInvoices: number;
  totalPaid: number;
  totalOutstanding: number;
  draftCount: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('status, total')
    .eq('user_id', userId);

  if (error) {
    return { totalInvoices: 0, totalPaid: 0, totalOutstanding: 0, draftCount: 0 };
  }

  return {
    totalInvoices: invoices.length,
    totalPaid: invoices
      .filter((i) => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total), 0),
    totalOutstanding: invoices
      .filter((i) => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + Number(i.total), 0),
    draftCount: invoices.filter((i) => i.status === 'draft').length,
  };
}
