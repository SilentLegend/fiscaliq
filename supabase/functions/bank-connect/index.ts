import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const EB_API = "https://api.enablebanking.com";

function base64Url(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(s: string): Uint8Array {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

function pemToBinary(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, "")
    .replace(/-----END [A-Z ]+-----/g, "")
    .replace(/\s/g, "");
  return base64UrlDecode(b64).buffer;
}

const encoder = new TextEncoder();

async function createJwt(appId: string, pemPrivateKey: string): Promise<string> {
  const header = { typ: "JWT", alg: "RS256", kid: appId };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: "enablebanking.com",
    aud: "api.enablebanking.com",
    iat: now,
    exp: now + 3600,
  };

  const headerB64 = base64Url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64Url(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const keyData = pemToBinary(pemPrivateKey);
  const privateKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    encoder.encode(signingInput),
  );

  return `${signingInput}.${base64Url(signature)}`;
}

async function ebFetch(path: string, jwt: string, options: RequestInit = {}): Promise<Response> {
  const url = `${EB_API}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${jwt}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) throw new Error("No auth");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Niet ingelogd");

    const APP_ID = Deno.env.get("ENABLE_BANKING_APP_ID");
    const PRIVATE_KEY = Deno.env.get("ENABLE_BANKING_PRIVATE_KEY");
    const CALLBACK_URL = Deno.env.get("ENABLE_BANKING_CALLBACK_URL") || "https://www.fiscaliq.nl/app/bank";

    if (!APP_ID || !PRIVATE_KEY) {
      return new Response(JSON.stringify({
        ok: false,
        setup_required: true,
        message: "Voeg ENABLE_BANKING_APP_ID en ENABLE_BANKING_PRIVATE_KEY toe in Supabase Secrets (zie docs).",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, ...params } = await req.json();

    const jwt = await createJwt(APP_ID, PRIVATE_KEY);

    if (action === "status") {
      const appRes = await ebFetch("/application", jwt);
      const appData = await appRes.json();
      return new Response(JSON.stringify({ ok: true, app: appData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "test") {
      const aspspRes = await ebFetch(`/aspsps?country=NL`, jwt);
      const aspspData = await aspspRes.json();
      const aspsps = aspspData?.aspsps || aspspData || [];
      const knab = Array.isArray(aspsps) ? aspsps.find(
        (a: Record<string, unknown>) => (a.name as string || "").toLowerCase().includes("knab"),
      ) : null;
      return new Response(JSON.stringify({
        ok: true,
        jwt_works: aspspRes.ok,
        knab_aspsp: knab || null,
        aspsp_count: Array.isArray(aspsps) ? aspsps.length : 0,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "aspsps") {
      const country = params.country || "NL";
      const res = await ebFetch(`/aspsps?country=${encodeURIComponent(country)}`, jwt);
      const data = await res.json();
      return new Response(JSON.stringify({ ok: true, aspsps: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "connect") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name")
        .eq("id", user.id)
        .maybeSingle();

      const psuType = profile?.company_name ? "business" : "personal";

      const state = crypto.randomUUID();

      // Zoek de juiste ASPSP naam op bij Enable Banking
      const aspspRes = await ebFetch(`/aspsps?country=${encodeURIComponent(params.aspsp_country || "NL")}`, jwt);
      const aspspData = await aspspRes.json();
      const aspsps = aspspData?.aspsps || aspspData || [];
      const aspsp = Array.isArray(aspsps) ? aspsps.find(
        (a: Record<string, unknown>) =>
          (a.name as string || "").toLowerCase().includes((params.aspsp_name || "").toLowerCase()),
      ) : null;
      const aspspName = aspsp?.name as string || params.aspsp_name;

      const body = {
        access: { valid_until: new Date(Date.now() + 90 * 86400000).toISOString() },
        aspsp: { name: aspspName, country: params.aspsp_country || "NL" },
        state,
        redirect_url: CALLBACK_URL,
        psu_type: psuType,
      };

      const res = await ebFetch("/auth", jwt, {
        method: "POST",
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(JSON.stringify({ eb_error: data, aspsp_used: aspspName }));

      // Sla de state + authorization_id op voor de callback
      await supabase.from("bank_connections").insert({
        user_id: user.id,
        bank_name: params.aspsp_name || "Bank",
        provider: "enable_banking_pending",
        provider_institution_id: data.authorization_id,
        provider_requisition_id: state,
        status: "pending",
        iban: "",
        last_sync_at: null,
      });

      return new Response(JSON.stringify({
        ok: true,
        url: data.url,
        state,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "callback") {
      const { code, state } = params;
      if (!code || !state) throw new Error("Geen code of state ontvangen");

      // Vind pending verbinding via state
      const { data: connections } = await supabase
        .from("bank_connections")
        .select("id")
        .eq("provider_requisition_id", state)
        .limit(1);

      // Probeer sessie aan te maken
      const res = await ebFetch("/sessions", jwt, {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error_description || data.detail || "Fout bij ophalen sessie");

      const sessionId = data.session_id;
      const accounts = data.accounts || [];

      // Als sessie geen accounts geeft, probeer via /application
      if (accounts.length === 0) {
        const appRes = await ebFetch("/application", jwt);
        if (appRes.ok) {
          const appData = await appRes.json();
          const linked = appData.accounts || appData.linked_accounts || [];
          for (const a of linked) {
            accounts.push({
              uid: a.uid || a.id,
              account_id: { iban: a.account_id?.iban || a.iban || "" },
              name: a.name || "",
            });
          }
        }
      }

      const connectionId = connections?.[0]?.id;

      for (const acct of accounts) {
        const iban = acct.account_id?.iban || "";
        const name = acct.name || iban;

        if (connectionId) {
          await supabase
            .from("bank_connections")
            .update({
              provider: "enable_banking",
              status: "active",
              iban,
              bank_name: name,
              provider_institution_id: sessionId,
              last_sync_at: new Date().toISOString(),
            })
            .eq("id", connectionId);
        } else {
          // Geen pending verbinding gevonden, maak nieuwe aan
          await supabase.from("bank_connections").insert({
            user_id: user.id,
            bank_name: name,
            provider: "enable_banking",
            provider_institution_id: sessionId,
            status: "active",
            iban,
            last_sync_at: new Date().toISOString(),
          });
        }
      }

      return new Response(JSON.stringify({
        ok: true,
        session_id: sessionId,
        accounts: accounts.map((a: Record<string, unknown>) => ({
          uid: a.uid,
          iban: (a.account_id as Record<string, unknown>)?.iban || "",
          name: a.name,
        })),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "debug") {
      const appRes = await ebFetch("/application", jwt);
      const appData = await appRes.json();
      return new Response(JSON.stringify({ ok: true, app: appData }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "sync") {
      const { connection_id } = params;
      if (!connection_id) throw new Error("Geen connection_id");

      const { data: conn } = await supabase
        .from("bank_connections")
        .select("*")
        .eq("id", connection_id)
        .eq("user_id", user.id)
        .single();

      if (!conn) throw new Error("Verbinding niet gevonden");
      if (conn.provider !== "enable_banking") throw new Error("Alleen voor Enable Banking verbindingen");

      const sessionId = conn.provider_institution_id;

      // Probeer via sessie
      const sessRes = await ebFetch(`/sessions/${sessionId}`, jwt);
      let accountUids: string[] = [];

      if (sessRes.ok) {
        const sessData = await sessRes.json();
        accountUids = (sessData.accounts_data || []).map(
          (a: Record<string, unknown>) => a.uid,
        );
        if (sessData.accounts) {
          accountUids = [...new Set([...accountUids, ...(sessData.accounts as string[])])];
        }
      }

      // Als sessie geen accounts geeft, probeer via /application (restricted mode)
      if (accountUids.length === 0) {
        const appRes = await ebFetch("/application", jwt);
        if (appRes.ok) {
          const appData = await appRes.json();
          const linked = appData.accounts || appData.linked_accounts || [];
          accountUids = linked.map((a: Record<string, unknown>) => a.uid || a.id).filter(Boolean);
        }
      }

      let totalFetched = 0;

      for (const uid of accountUids) {
        // Transacties ophalen (laatste 90 dagen)
        const dateFrom = new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10);
        const txRes = await ebFetch(
          `/accounts/${uid}/transactions?date_from=${dateFrom}&strategy=fetchIfNewer`,
          jwt,
        );
        const txData = await txRes.json();
        if (!txRes.ok) continue;

        const transactions = txData.transactions || [];

        for (const tx of transactions) {
          const amount = parseFloat(tx.transaction_amount?.amount || "0");
          const isCredit = tx.credit_debit_indicator === "CRDT";
          const signedAmount = isCredit ? Math.abs(amount) : -Math.abs(amount);

          const counterparty = isCredit
            ? (tx.debtor?.name || tx.debtor_account?.iban || "")
            : (tx.creditor?.name || tx.creditor_account?.iban || "");

          const description = (tx.remittance_information || []).join(" ") ||
            tx.bank_transaction_code?.description ||
            "";

          const bookingDate = tx.booking_date || tx.value_date || "";
          if (!bookingDate) continue;

          const providerTxId = tx.transaction_id || tx.entry_reference ||
            `${uid}-${bookingDate}-${signedAmount}-${Math.random().toString(36).slice(2, 8)}`;

          const { error: insertError } = await supabase
            .from("bank_transactions")
            .upsert({
              user_id: user.id,
              connection_id,
              provider_transaction_id: providerTxId,
              booking_date: bookingDate,
              amount: signedAmount,
              counterparty_name: counterparty.slice(0, 500) || null,
              counterparty_iban: (tx.debtor_account?.iban || tx.creditor_account?.iban || null),
              description: description.slice(0, 1000) || null,
            }, {
              onConflict: "connection_id, provider_transaction_id",
              ignoreDuplicates: true,
            });

          if (!insertError) totalFetched++;
        }
      }

      // Update last_sync_at
      await supabase
        .from("bank_connections")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", connection_id);

      return new Response(JSON.stringify({
        ok: true,
        synced: totalFetched,
        accounts: accountUids.length,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: false, error: "Onbekende action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
