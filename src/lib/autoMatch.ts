import { supabase } from "@/integrations/supabase/client";

export async function autoMatchTransactions(transactionId?: string): Promise<{ matched: number; total: number }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Niet ingelogd");

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/auto-match`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction_id: transactionId }),
    },
  );

  const result = await res.json();
  if (!result.ok) throw new Error(result.error || "Matching mislukt");
  return result;
}
