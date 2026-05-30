import { createClient } from '@/lib/supabase/server';
import type { Client } from '@/lib/types/database';

export async function getClients(userId: string): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) throw new Error(`Failed to fetch clients: ${error.message}`);
  return data ?? [];
}

export async function getClientById(
  id: string,
  userId: string,
): Promise<Client | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function getClientCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw new Error(`Failed to count clients: ${error.message}`);
  return count ?? 0;
}
