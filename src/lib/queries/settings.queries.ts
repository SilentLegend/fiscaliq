import { createClient } from '@/lib/supabase/server';
import type { InvoiceSettings } from '@/lib/types/database';

export async function getInvoiceSettings(
  userId: string,
): Promise<InvoiceSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('invoice_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}
