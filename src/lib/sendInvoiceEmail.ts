import { supabase } from "@/integrations/supabase/client";

export async function sendInvoiceEmail(invoiceId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("send-invoice", {
    body: { invoiceId },
  });

  if (error) throw new Error(error.message || "Versturen mislukt");

  if (data?.setup_required) throw new Error(data.message || "Resend API key nog niet ingesteld");

  if (!data?.ok) throw new Error(data?.error || "Versturen mislukt");

  return data.message || "E-mail verzonden";
}
