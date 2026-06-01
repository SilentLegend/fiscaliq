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
  const iban = profile.iban as string | null;
  const invNum = invoice.invoice_number as string;
  const issueDate = nlDate(invoice.issue_date as string);
  const dueDate = nlDate(invoice.due_date as string);
  const total = invoice.total as number;
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

async function sendViaSmtp(to: string, subject: string, html: string, fromName: string): Promise<void> {
  const host = Deno.env.get("SMTP_HOST")!;
  const port = parseInt(Deno.env.get("SMTP_PORT") || "587");
  const user = Deno.env.get("SMTP_USER")!;
  const pass = Deno.env.get("SMTP_PASS")!;
  const fromAddr = Deno.env.get("SMTP_FROM") || user;

  const smtp = new SmtpClient();
  await smtp.connect(host, port, { useTls: port === 465 });
  await smtp.authLogin(user, pass);
  await smtp.send(fromAddr, fromName, to, subject, html);
  smtp.close();
}

async function sendViaResend(to: string, subject: string, html: string, fromName: string): Promise<void> {
  const key = Deno.env.get("RESEND_API_KEY")!;
  const domain = Deno.env.get("RESEND_DOMAIN") || "fiscaliq.nl";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${fromName} <facturen@${domain}>`,
      to,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend fout: ${res.status} ${body}`);
  }
}

function checkConfig(): "smtp" | "resend" | null {
  if (Deno.env.get("SMTP_HOST") && Deno.env.get("SMTP_USER") && Deno.env.get("SMTP_PASS")) return "smtp";
  if (Deno.env.get("RESEND_API_KEY")) return "resend";
  return null;
}

class SmtpClient {
  private conn: Deno.TcpConn | Deno.TlsConn | null = null;
  private reader: ReadableStreamDefaultReader<string> | null = null;
  private writer: WritableStreamDefaultWriter<string> | null = null;

  private buf = new Uint8Array(4096);
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();

  async connect(host: string, port: number, opts: { useTls?: boolean } = {}): Promise<void> {
    this.conn = opts.useTls
      ? await Deno.connectTls({ hostname: host, port })
      : await Deno.connect({ hostname: host, port });
    const r = this.conn.readable.pipeThrough(new TextDecoderStream()).getReader();
    const w = this.conn.writable.getWriter();
    this.reader = r;
    this.writer = w;
    await this.readReply(220);
    await this.sendCommand(`EHLO fiscaliq.local`);
    const ehloResp = await this.readReply(250);
    if (!opts.useTls && ehloResp.includes("STARTTLS")) {
      await this.sendCommand("STARTTLS");
      await this.readReply(220);
      this.conn = await Deno.startTls(this.conn, { hostname: host });
      const r2 = this.conn.readable.pipeThrough(new TextDecoderStream()).getReader();
      const w2 = this.conn.writable.getWriter();
      this.reader = r2;
      this.writer = w2;
      await this.sendCommand(`EHLO fiscaliq.local`);
      await this.readReply(250);
    }
  }

  async authLogin(user: string, pass: string): Promise<void> {
    await this.sendCommand("AUTH LOGIN");
    await this.readReply(334);
    await this.sendCommand(btoa(user));
    await this.readReply(334);
    await this.sendCommand(btoa(pass));
    await this.readReply(235);
  }

  async send(from: string, fromName: string, to: string, subject: string, html: string): Promise<void> {
    await this.sendCommand(`MAIL FROM:<${from}>`);
    await this.readReply(250);
    await this.sendCommand(`RCPT TO:<${to}>`);
    await this.readReply(250);
    await this.sendCommand("DATA");
    await this.readReply(354);

    const body = [
      `From: ${fromName} <${from}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      html,
    ].join("\r\n");

    await this.sendCommand(body + "\r\n.");
    await this.readReply(250);
  }

  close(): void {
    try { this.conn?.close(); } catch { /* ignore */ }
  }

  private async sendCommand(cmd: string): Promise<void> {
    await this.writer!.write(cmd + "\r\n");
  }

  private async readReply(expectedCode: number): Promise<string> {
    let resp = "";
    while (true) {
      const { value, done } = await this.reader!.read();
      if (done) throw new Error("SMTP verbinding verbroken");
      resp += value;
      if (resp.length > 2 && resp.slice(3, 4) === " " && resp.length >= 3) break;
      if (resp.length > 2 && resp.slice(3, 4) === "-") continue;
    }
    const code = parseInt(resp.slice(0, 3));
    if (code !== expectedCode) throw new Error(`SMTP fout: ${resp.trim()}`);
    return resp.trim();
  }
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
    const fromName = (profile.company_name as string) || "Fiscaliq";
    const subject = `Factuur ${invoice.invoice_number} van ${fromName}`;
    const html = buildEmailHtml(invoice, items, client, profile);

    const mode = checkConfig();
    if (!mode) {
      return new Response(JSON.stringify({
        ok: false, setup_required: true,
        message: "Geen e-mail configuratie. Stel SMTP_HOST, SMTP_USER, SMTP_PASS in voor eigen SMTP, of RESEND_API_KEY voor Resend.",
      }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (mode === "smtp") {
      await sendViaSmtp(clientEmail, subject, html, fromName);
    } else {
      await sendViaResend(clientEmail, subject, html, fromName);
    }

    await supabase.from("invoices").update({ status: "verzonden" }).eq("id", invoiceId);

    return new Response(JSON.stringify({ ok: true, message: `Factuur verzonden naar ${clientEmail}` }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
