import { createClient } from '@/lib/supabase/server';
import { getClients } from '@/lib/queries/clients.queries';
import { NewInvoiceForm } from './NewInvoiceForm';

export default async function NewInvoicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const clients = await getClients(user.id);

  return <NewInvoiceForm clients={clients} />;
}
