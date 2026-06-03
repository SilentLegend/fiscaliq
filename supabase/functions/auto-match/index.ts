import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) throw new Error("Geen autorisatie");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Niet ingelogd");

    const { transaction_id } = await req.json();

    let query = supabase
      .from("bank_transactions")
      .select("id, amount, description, counterparty_name, booking_date, matched")
      .eq("user_id", user.id)
      .eq("matched", false)
      .order("booking_date", { ascending: false });

    if (transaction_id) {
      query = query.eq("id", transaction_id);
    }

    const { data: transactions, error: txErr } = await query;
    if (txErr) throw new Error(txErr.message);

    if (!transactions || transactions.length === 0) {
      return new Response(JSON.stringify({ ok: true, matched: 0, total: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: invoices } = await supabase
      .from("invoices")
      .select("id, invoice_number, total, status, client_id")
      .eq("user_id", user.id)
      .neq("status", "concept")
      .neq("status", "geannuleerd");

    const { data: clients } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id);

    let matchedCount = 0;

    for (const tx of transactions) {
      if (!invoices || invoices.length === 0) break;

      const absAmount = Math.abs(Number(tx.amount));
      const desc = (tx.description || "").toLowerCase();
      const counterparty = (tx.counterparty_name || "").toLowerCase();

      let bestMatch: Record<string, unknown> | null = null;
      let matchType = "";

      for (const inv of invoices) {
        const invNum = (inv.invoice_number as string || "").toLowerCase();
        const total = Number(inv.total);

        // Strategy 1: amount match (exact)
        if (absAmount > 0 && absAmount === total) {
          bestMatch = inv;
          matchType = "amount";
          break;
        }

        // Strategy 2: invoice number in description
        if (desc && (desc.includes(invNum) || desc.includes(invNum.replace("-", "")))) {
          bestMatch = inv;
          matchType = "reference";
          break;
        }

        // Strategy 3: invoice number in counterparty name
        if (counterparty && (counterparty.includes(invNum) || counterparty.includes(invNum.replace("-", "")))) {
          bestMatch = inv;
          matchType = "reference";
          break;
        }
      }

      if (!bestMatch && clients) {
        for (const cl of clients) {
          const clientName = (cl.name as string || "").toLowerCase();
          if (counterparty && counterparty.includes(clientName)) {
            // Find the most recent invoice for this client
            const clientInvoices = invoices.filter(
              (inv) => inv.client_id === cl.id,
            );
            if (clientInvoices.length > 0) {
              // Pick the one with closest amount
              const absAmount2 = Math.abs(Number(tx.amount));
              let closest = clientInvoices[0];
              let closestDiff = Math.abs(Number(closest.total) - absAmount2);
              for (const ci of clientInvoices) {
                const diff = Math.abs(Number(ci.total) - absAmount2);
                if (diff < closestDiff) {
                  closest = ci;
                  closestDiff = diff;
                }
              }
              bestMatch = closest;
              matchType = "client";
              break;
            }
          }
        }
      }

      if (bestMatch) {
        const { error: insertErr } = await supabase
          .from("transaction_matches")
          .insert({
            user_id: user.id,
            transaction_id: tx.id,
            invoice_id: bestMatch.id,
          });

        if (!insertErr) {
          await supabase
            .from("bank_transactions")
            .update({ matched: true })
            .eq("id", tx.id);

          if (bestMatch.status === "verzonden") {
            await supabase
              .from("invoices")
              .update({
                status: "betaald",
                paid_at: new Date().toISOString().slice(0, 10),
              })
              .eq("id", bestMatch.id);
          }

          matchedCount++;
        }
      }
    }

    return new Response(JSON.stringify({
      ok: true,
      matched: matchedCount,
      total: transactions.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
