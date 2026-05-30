'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { updateSettingsSchema } from '@/lib/types/forms';
import type { ActionResult } from '@/lib/types/forms';

export async function updateSettings(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Niet ingelogd' };
  }

  const parsed = updateSettingsSchema.safeParse({
    default_vat_percentage: formData.get('default_vat_percentage'),
    default_payment_term_days: formData.get('default_payment_term_days'),
    company_name: formData.get('company_name'),
    address_line1: formData.get('address_line1'),
    address_line2: formData.get('address_line2'),
    postal_code: formData.get('postal_code'),
    city: formData.get('city'),
    kvk_number: formData.get('kvk_number'),
    btw_number: formData.get('btw_number'),
    iban: formData.get('iban'),
    payment_instructions: formData.get('payment_instructions'),
  });

  if (!parsed.success) {
    return {
      error: 'Controleer de invoer',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase
    .from('invoice_settings')
    .upsert({
      user_id: user.id,
      ...parsed.data,
    })
    .eq('user_id', user.id);

  if (error) {
    return { error: 'Instellingen opslaan mislukt: ' + error.message };
  }

  revalidatePath('/settings');
  return { data: 'Instellingen opgeslagen!' };
}
