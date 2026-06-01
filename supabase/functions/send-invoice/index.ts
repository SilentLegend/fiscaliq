import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function eur(v: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
}

function nlDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function quoteHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildEmailHtml(invoice: Record<string, unknown>, items: Record<string, unknown>[], client: Record<string, unknown>, profile: Record<string, unknown>): string {
  const company = (profile.company_name as string) || "Fiscaliq";
  const clientEmail = client.email as string | null;
  const iban = profile.iban as string | null;
  const invNum = invoice.invoice_number as string;
  const issueDate = nlDate(invoice.issue_date as string);
  const dueDate = nlDate(invoice.due_date as string);
  const total = invoice.total as number;
  const status = invoice.status as string;
  const notes = invoice.notes as string | null;

  const itemsRows = items.map((it, i) => {
    const qty = it.quantity as number;
    const price = it.unit_price as number;
    const rate = it.vat_rate as number;
    const lineTotal = qty * price * (1 + rate / 100);
    return `<tr>
      <td style="padding:10px 12px;text-align:center;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;">${i + 1}</td>
      <td style="padding:10px 12px;font-size:13px;border-bottom:1px solid #e5e7eb;">${quoteHtml(it.description as string)}</td>
      <td style="padding:10px 12px;text-align:center;font-size:13px;border-bottom:1px solid #e5e7eb;">${qty}</td>
      <td style="padding:10px 12px;text-align:right;font-size:13px;border-bottom:1px solid #e5e7eb;">${eur(price)}</td>
      <td style="padding:10px 12px;text-align:center;font-size:13px;border-bottom:1px solid #e5e7eb;">${rate}%</td>
      <td style="padding:10px 12px;text-align:right;font-size:13px;border-bottom:1px solid #e5e7eb;font-weight:600;">${eur(lineTotal)}</td>
    </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',-apple-system,sans-serif; color:#1a1a1a; font-size:14px; line-height:1.5; }
  .wrap { max-width:600px; margin:0 auto; padding:32px 24px; }
  .hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px; }
  .brand { font-size:20px; font-weight:700; color:#0d4f48; }
  .intro { font-size:15px; color:#4b5563; margin-bottom:28px; }
  .cta { display:inline-block; background:#0d4f48; color:#fff; padding:12px 28px; border-radius:8px; font-size:14px; font-weight:600; margin:16px 0 28px 0; }
  table.w { width:100%; border-collapse:collapse; margin-bottom:24px; }
  table.w th { background:#0d4f48; color:#fff; font-size:11px; text-transform:uppercase; letter-spacing:1px; padding:10px 12px; text-align:left; }
  table.w th:first-child { border-radius:6px 0 0 0; }
  table.w th:last-child { border-radius:0 6px 0 0; text-align:right; }
  .tot { width:240px; margin-left:auto; margin-bottom:24px; }
  .tot td { padding:5px 0; font-size:14px; }
  .tot td:last-child { text-align:right; font-weight:500; }
  .tot .gr td { font-size:18px; font-weight:700; color:#0d4f48; border-top:2px solid #0d4f48; padding-top:8px; }
  .pb { background:#f3f4f6; border-radius:8px; padding:16px 20px; margin-bottom:24px; font-size:13px; line-height:1.6; }
  .pb strong { color:#0d4f48; }
  .ft { font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:16px; margin-top:24px; }
  .ft strong { color:#4b5563; }
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <div class="brand">Fiscaliq</div>
    <div style="text-align:right;font-size:13px;color:#6b7280;">
      <strong>${quoteHtml(company)}</strong><br>
      ${quoteHtml(profile.address as string || "")}${profile.address ? "<br>" : ""}
      ${[profile.postal_code, profile.city].filter(Boolean).join(" ")}
    </div>
  </div>

  <div class="intro">Beste ${quoteHtml(client.name as string)},<br><br>Hierbij ontvang je de factuur ${invNum} van ${quoteHtml(company)}.</div>

  <div style="margin-bottom:24px;">
    <div style="display:flex;gap:32px;">
      <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Factuurdatum</div><div style="font-size:14px;font-weight:500;">${issueDate}</div></div>
      <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Vervaldatum</div><div style="font-size:14px;font-weight:500;">${dueDate}</div></div>
      <div><div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Totaal</div><div style="font-size:14px;font-weight:700;color:#0d4f48;">${eur(total)}</div></div>
    </div>
  </div>

  <table class="w">
    <thead><tr><th style="width:36px;">#</th><th>Omschrijving</th><th style="width:60px;text-align:center;">Aantal</th><th style="width:100px;text-align:right;">Prijs</th><th style="width:60px;text-align:center;">BTW</th><th style="width:110px;text-align:right;">Totaal</th></tr></thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="tot"><table style="width:100%;border-collapse:collapse;">
    <tr><td style="color:#6b7280;">Subtotaal</td><td>${eur(invoice.subtotal as number)}</td></tr>
    <tr><td style="color:#6b7280;">BTW</td><td>${eur(invoice.vat_amount as number)}</td></tr>
    <tr class="gr"><td>Totaal</td><td>${eur(total)}</td></tr>
  </table></div>

  ${iban ? `<div class="pb"><strong>Betaalinformatie</strong><br>IBAN: ${iban}<br>o.v.v. factuurnummer <strong>${invNum}</strong><br>t.n.v. ${quoteHtml(company)}</div>` : ""}

  ${notes ? `<div style="font-size:13px;color:#4b5563;line-height:1.6;margin-bottom:20px;">${quoteHtml(notes).replace(/\n/g, "<br>")}</div>` : ""}

  <div class="ft">
    <strong>${quoteHtml(company)}</strong><br>
    ${profile.email ? `${profile.email}<br>` : ""}
    KVK: ${profile.kvk_number as string || "—"} | BTW: ${profile.vat_number as string || "—"}
    ${iban ? `| IBAN: ${iban}` : ""}
  </div>
</div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const auth = req.headers.get("Authorization");
    if (!auth) throw new Error("Geen autorisatie");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: auth } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) throw new Error("Niet ingelogd");

    const { invoiceId } = await req.json();
    if (!invoiceId) throw new Error("Geen factuur ID");

    const [invRes, profileRes] = await Promise.all([
      supabase.from("invoices").select("*").eq("id", invoiceId).single(),
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    ]);
    if (invRes.error) throw new Error("Factuur niet gevonden");
    const invoice = invRes.data as Record<string, unknown>;

    const [itemsRes, clientRes] = await Promise.all([
      supabase.from("invoice_items").select("*").eq("invoice_id", invoiceId).order("position"),
      supabase.from("clients").select("*").eq("id", invoice.client_id as string).single(),
    ]);
    const items = (itemsRes.data ?? []) as Record<string, unknown>[];
    const client = clientRes.data as Record<string, unknown>;
    const clientEmail = client.email as string | null;
    if (!clientEmail) throw new Error("Klant heeft geen e-mailadres");

    const profile = (profileRes.data ?? { company_name: "Fiscaliq", kvk_number: null, vat_number: null, address: null, postal_code: null, city: null, iban: null, email: null }) as Record<string, unknown>;

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({
        ok: false, setup_required: true,
        message: "Voeg RESEND_API_KEY toe in Cloud → Secrets om e-mail te versturen.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const html = buildEmailHtml(invoice, items, client, profile);
    const fromDomain = Deno.env.get("RESEND_DOMAIN") || "fiscaliq.nl";
    const fromName = (profile.company_name as string) || "Fiscaliq";

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <facturen@${fromDomain}>`,
        to: clientEmail,
        subject: `Factuur ${invoice.invoice_number} van ${fromName}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      throw new Error(`Resend fout: ${resendRes.status} ${errBody}`);
    }

    await supabase.from("invoices").update({ status: "verzonden" }).eq("id", invoiceId);

    return new Response(JSON.stringify({ ok: true, message: `Factuur verzonden naar ${clientEmail}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
