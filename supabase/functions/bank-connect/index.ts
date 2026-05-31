// Edge function stub voor PSD2 bankkoppeling.
// Wanneer je een echte koppeling wilt activeren:
// 1. Maak een gratis account bij GoCardless Bank Account Data (https://bankaccountdata.gocardless.com/)
// 2. Voeg secrets toe in Lovable Cloud: GOCARDLESS_SECRET_ID en GOCARDLESS_SECRET_KEY
// 3. Implementeer de drie acties hieronder (institutions, requisitions, accounts)

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
    if (!auth) throw new Error("No auth");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Niet ingelogd");

    const { action } = await req.json();
    const SECRET_ID = Deno.env.get("GOCARDLESS_SECRET_ID");
    const SECRET_KEY = Deno.env.get("GOCARDLESS_SECRET_KEY");

    if (!SECRET_ID || !SECRET_KEY) {
      return new Response(JSON.stringify({
        ok: false,
        setup_required: true,
        message: "Voeg GOCARDLESS_SECRET_ID en GOCARDLESS_SECRET_KEY toe in Cloud → Secrets om de bankkoppeling te activeren.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // TODO: action === "list_institutions" → GET /institutions/?country=NL
    // TODO: action === "create_requisition" → POST /requisitions/ → return link
    // TODO: action === "fetch_transactions" → GET /accounts/{id}/transactions/

    return new Response(JSON.stringify({ ok: true, action }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
