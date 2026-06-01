import { supabase } from "@/integrations/supabase/client";

export async function sendInvoiceEmail(invoiceId: string): Promise<{ ok: boolean; message: string }> {
  const { data, error } = await supabase.functions.invoke("send-invoice", {
    body: { invoiceId },
  });

  if (error) {
    if (error.message?.includes("RESEND_API_KEY")) {
      return { ok: false, message: "Resend API key nog niet ingesteld — voeg toe in Cloud Secrets" };
    }
    return { ok: false, message: error.message || "Versturen mislukt" };
  }

  if (data?.setup_required) {
    return { ok: false, message: data.message || "Resend API key nog niet ingesteld" };
  }

  if (!data?.ok) {
    return { ok: false, message: data?.error || "Versturen mislukt" };
  }

  return { ok: true, message: data.message || "E-mail verzonden" };
}
