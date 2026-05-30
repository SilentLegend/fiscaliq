'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { createClientSchema, updateClientSchema } from '@/lib/types/forms';
import type { ActionResult } from '@/lib/types/forms';

export async function createClient(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const parsed = createClientSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    address_line1: formData.get('address_line1'),
    address_line2: formData.get('address_line2'),
    postal_code: formData.get('postal_code'),
    city: formData.get('city'),
    kvk_number: formData.get('kvk_number'),
    btw_number: formData.get('btw_number'),
  });

  if (!parsed.success) {
    return {
      error: 'Controleer de invoer',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.from('clients').insert({
    user_id: user.id,
    ...parsed.data,
  });

  if (error) {
    return { error: 'Klant opslaan mislukt: ' + error.message };
  }

  revalidatePath('/clients');
  return { data: 'Klant aangemaakt!' };
}

export async function updateClient(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const parsed = updateClientSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    address_line1: formData.get('address_line1'),
    address_line2: formData.get('address_line2'),
    postal_code: formData.get('postal_code'),
    city: formData.get('city'),
    kvk_number: formData.get('kvk_number'),
    btw_number: formData.get('btw_number'),
  });

  if (!parsed.success) {
    return {
      error: 'Controleer de invoer',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from('clients')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Klant bijwerken mislukt: ' + error.message };
  }

  revalidatePath('/clients');
  return { data: 'Klant bijgewerkt!' };
}

export async function deleteClient(
  id: string,
): Promise<ActionResult> {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Verwijderen mislukt: ' + error.message };
  }

  revalidatePath('/clients');
  return { data: 'Klant verwijderd' };
}
