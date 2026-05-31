import html2pdf from "html2pdf.js";
import { supabase } from "@/integrations/supabase/client";

export type TemplateName = "klassiek" | "modern" | "minimaal";

type InvoiceItem = {
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
};

type InvoiceData = {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  status: string;
  subtotal: number;
  vat_amount: number;
  total: number;
  notes: string | null;
  client_id: string;
};

type Profile = {
  company_name: string;
  kvk_number: string | null;
  vat_number: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  iban: string | null;
  phone: string | null;
  website: string | null;
  email: string | null;
  payment_terms: number | null;
  invoice_footer: string | null;
};

type Client = {
  name: string;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  kvk_number: string | null;
  vat_number: string | null;
};

function nlDate(v: string): string {
  return new Date(v).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
}

function eur(v: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(v);
}

function vatSummary(items: InvoiceItem[]): { base: number; vat: number; rate: number }[] {
  const map = new Map<number, { base: number; vat: number }>();
  for (const it of items) {
    const base = it.quantity * it.unit_price;
    const vat = base * it.vat_rate / 100;
    const g = map.get(it.vat_rate) ?? { base: 0, vat: 0 };
    g.base += base;
    g.vat += vat;
    map.set(it.vat_rate, g);
  }
  return Array.from(map.entries()).sort(([a], [b]) => b - a).map(([rate, g]) => ({ rate, ...g }));
}

function itemsHtml(items: InvoiceItem[]): string {
  return items.map((it, i) => `
    <tr>
      <td style="padding:10px 12px;text-align:center;color:#6b7280;width:36px;font-size:13px;">${i + 1}</td>
      <td style="padding:10px 12px;font-size:13px;">${it.description}</td>
      <td style="padding:10px 12px;text-align:center;color:#6b7280;font-size:13px;width:60px;">${it.quantity}</td>
      <td style="padding:10px 12px;text-align:right;font-size:13px;width:100px;">${eur(it.unit_price)}</td>
      <td style="padding:10px 12px;text-align:center;color:#6b7280;font-size:13px;width:60px;">${it.vat_rate}%</td>
      <td style="padding:10px 12px;text-align:right;font-size:13px;width:110px;font-weight:600;">${eur(it.quantity * it.unit_price * (1 + it.vat_rate / 100))}</td>
    </tr>`).join("");
}

function vatRows(vats: { rate: number; base: number; vat: number }[]): string {
  return vats.map(v => `
    <tr>
      <td style="padding:5px 0;font-size:13px;color:#6b7280;">BTW ${v.rate}% over ${eur(v.base)}</td>
      <td style="padding:5px 0;text-align:right;font-size:13px;">${eur(v.vat)}</td>
    </tr>`).join("");
}

function statusBadge(status: string): string {
  const labels: Record<string, string> = { concept: "Concept", verzonden: "Verzonden", betaald: "Betaald", vervallen: "Vervallen", geannuleerd: "Geannuleerd" };
  return `<span style="display:inline-block;padding:3px 10px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;${
    status === "betaald" ? "background:#d1fae5;color:#065f46" :
    status === "verzonden" ? "background:#dbeafe;color:#1e40af" :
    status === "vervallen" ? "background:#fee2e2;color:#991b1b" :
    status === "concept" ? "background:#fef3c7;color:#92400e" :
    "background:#f3f4f6;color:#6b7280"
  }">${labels[status] || status}</span>`;
}

function klassiekHtml(invoice: InvoiceData, profile: Profile, client: Client, items: InvoiceItem[], vats: { rate: number; base: number; vat: number }[]): string {
  const hasNotes = invoice.notes || profile.invoice_footer;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',-apple-system,sans-serif; color:#1a1a1a; font-size:12px; line-height:1.5; }
    .page { width:210mm; min-height:297mm; padding:40px 48px; position:relative; }
    .accent { height:4px; background:#0d4f48; margin:-40px -48px 36px -48px; }
    .hdr { display:flex; justify-content:space-between; margin-bottom:40px; }
    .brand { font-size:22px; font-weight:700; color:#0d4f48; letter-spacing:-0.3px; }
    .co { text-align:right; font-size:12px; color:#4b5563; line-height:1.6; }
    .co strong { color:#1a1a1a; }
    .ts { margin-bottom:32px; }
    .tl { font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#9ca3af; margin-bottom:4px; }
    .tn { font-size:28px; font-weight:700; color:#0d4f48; letter-spacing:-0.5px; }
    .mg { display:flex; gap:40px; margin-bottom:36px; }
    .mi label { font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; display:block; margin-bottom:2px; }
    .mi span { font-size:13px; font-weight:500; }
    hr { border:none; border-top:1px solid #e5e7eb; margin:0 0 28px 0; }
    .cb { margin-bottom:32px; }
    .cl { font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:#9ca3af; margin-bottom:6px; }
    .cn { font-size:15px; font-weight:600; margin-bottom:4px; }
    .cd { font-size:12px; color:#4b5563; line-height:1.5; }
    table.it { width:100%; border-collapse:collapse; margin-bottom:24px; }
    table.it thead th { background:#0d4f48; color:#fff; font-size:10px; text-transform:uppercase; letter-spacing:1px; padding:10px 12px; text-align:left; font-weight:500; }
    table.it thead th:first-child { border-radius:6px 0 0 0; }
    table.it thead th:last-child { border-radius:0 6px 0 0; text-align:right; }
    table.it thead th:nth-child(3), table.it thead th:nth-child(5) { text-align:center; }
    table.it thead th:nth-child(4) { text-align:right; }
    table.it tbody tr:nth-child(even) { background:#f9fafb; }
    .tot { margin-left:auto; width:280px; margin-bottom:32px; }
    .tot table { width:100%; border-collapse:collapse; }
    .tot td { padding:6px 0; font-size:13px; }
    .tot td:last-child { text-align:right; font-weight:500; }
    .tot .gr td { font-size:18px; font-weight:700; color:#0d4f48; border-top:2px solid #0d4f48; padding-top:10px; }
    .ft { margin-top:40px; padding-top:20px; border-top:1px solid #e5e7eb; font-size:11px; color:#9ca3af; line-height:1.6; }
    .pb { background:#f3f4f6; border-radius:8px; padding:16px 20px; margin-bottom:28px; font-size:12px; line-height:1.6; }
    .pb strong { color:#0d4f48; }
  </style></head><body>
  <div class="page">
    <div class="accent"></div>
    <div class="hdr">
      <div class="brand">Fiscaliq</div>
      <div class="co"><strong>${profile.company_name || "Jouw bedrijf"}</strong><br>
        ${[profile.address, [profile.postal_code, profile.city].filter(Boolean).join(" ")].filter(Boolean).join("<br>")}
      </div>
    </div>
    <div class="ts">
      <div class="tl">Factuur</div>
      <div class="tn">${invoice.invoice_number}</div>
    </div>
    <div class="mg">
      <div class="mi"><label>Factuurdatum</label><span>${nlDate(invoice.issue_date)}</span></div>
      <div class="mi"><label>Vervaldatum</label><span>${nlDate(invoice.due_date)}</span></div>
      <div class="mi"><label>Status</label><span>${statusBadge(invoice.status)}</span></div>
    </div>
    <hr>
    <div class="cb">
      <div class="cl">Factuur voor</div>
      <div class="cn">${client.name}</div>
      ${client.address ? `<div class="cd">${client.address}</div>` : ""}
      <div class="cd">${[client.postal_code, client.city].filter(Boolean).join(" ")}</div>
      ${client.kvk_number ? `<div class="cd" style="margin-top:2px;">KVK: ${client.kvk_number}</div>` : ""}
      ${client.vat_number ? `<div class="cd">BTW: ${client.vat_number}</div>` : ""}
    </div>
    <table class="it">
      <thead><tr><th style="width:36px;">#</th><th>Omschrijving</th><th style="width:60px;text-align:center;">Aantal</th><th style="width:100px;text-align:right;">Prijs</th><th style="width:60px;text-align:center;">BTW</th><th style="width:110px;text-align:right;">Totaal</th></tr></thead>
      <tbody>${itemsHtml(items)}</tbody>
    </table>
    <div class="tot"><table>
      <tr><td style="color:#6b7280;">Subtotaal</td><td>${eur(invoice.subtotal)}</td></tr>
      ${vatRows(vats)}
      <tr class="gr"><td>Totaal</td><td>${eur(invoice.total)}</td></tr>
    </table></div>
    ${profile.iban ? `<div class="pb"><strong>Betaalinformatie</strong><br>IBAN: ${profile.iban}<br>o.v.v. factuurnummer <strong>${invoice.invoice_number}</strong><br>${profile.company_name ? `t.n.v. ${profile.company_name}` : ""}</div>` : ""}
    ${hasNotes ? `<div style="font-size:12px;color:#4b5563;line-height:1.6;margin-bottom:24px;">${invoice.notes ? `<p style="margin-bottom:8px;">${invoice.notes.replace(/\n/g, "<br>")}</p>` : ""}${profile.invoice_footer ? `<p style="color:#6b7280;font-size:11px;">${profile.invoice_footer.replace(/\n/g, "<br>")}</p>` : ""}</div>` : ""}
    <div class="ft"><strong>${profile.company_name || "Fiscaliq"}</strong><br>${profile.email ? `${profile.email}<br>` : ""}${profile.website ? `${profile.website}<br>` : ""}${profile.phone ? `${profile.phone}<br>` : ""}KVK: ${profile.kvk_number || "—"} | BTW: ${profile.vat_number || "—"} | IBAN: ${profile.iban || "—"}</div>
  </div></body></html>`;
}

function modernHtml(invoice: InvoiceData, profile: Profile, client: Client, items: InvoiceItem[], vats: { rate: number; base: number; vat: number }[]): string {
  const hasNotes = invoice.notes || profile.invoice_footer;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',-apple-system,sans-serif; color:#1f2937; font-size:11px; line-height:1.6; }
    .page { width:210mm; min-height:297mm; padding:36px 44px; position:relative; }
    .hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; padding-bottom:24px; border-bottom:1px solid #e5e7eb; }
    .brand { font-size:20px; font-weight:300; color:#111827; letter-spacing:2px; text-transform:uppercase; }
    .co { text-align:right; font-size:11px; color:#6b7280; line-height:1.6; }
    .co strong { color:#1f2937; font-weight:500; }
    .ts { margin-bottom:36px; }
    .tl { font-size:9px; text-transform:uppercase; letter-spacing:3px; color:#d1d5db; margin-bottom:6px; }
    .tn { font-size:30px; font-weight:300; color:#111827; letter-spacing:-0.5px; }
    .mg { display:flex; gap:48px; margin-bottom:40px; }
    .mi label { font-size:9px; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; display:block; margin-bottom:2px; }
    .mi span { font-size:12px; font-weight:500; color:#374151; }
    .cb { margin-bottom:36px; padding-left:0; }
    .cl { font-size:9px; text-transform:uppercase; letter-spacing:2px; color:#9ca3af; margin-bottom:8px; }
    .cn { font-size:16px; font-weight:500; margin-bottom:4px; color:#111827; }
    .cd { font-size:11px; color:#6b7280; line-height:1.6; }
    table.it { width:100%; border-collapse:collapse; margin-bottom:28px; }
    table.it thead th { border-bottom:1px solid #111827; padding:8px 8px; font-size:9px; text-transform:uppercase; letter-spacing:1.5px; color:#6b7280; font-weight:500; text-align:left; }
    table.it thead th:last-child { text-align:right; }
    table.it thead th:nth-child(3), table.it thead th:nth-child(5) { text-align:center; }
    table.it thead th:nth-child(4) { text-align:right; }
    table.it tbody td { padding:10px 8px; border-bottom:1px solid #f3f4f6; font-size:12px; }
    .tot { margin-left:auto; width:240px; margin-bottom:36px; }
    .tot table { width:100%; border-collapse:collapse; }
    .tot td { padding:5px 0; font-size:12px; color:#4b5563; }
    .tot td:last-child { text-align:right; font-weight:500; color:#1f2937; }
    .tot .gr td { font-size:16px; font-weight:600; color:#111827; border-top:1px solid #111827; padding-top:8px; }
    .pb { border:1px solid #e5e7eb; border-radius:0; padding:14px 18px; margin-bottom:32px; font-size:11px; line-height:1.6; color:#4b5563; }
    .pb strong { color:#111827; font-weight:500; }
    .ft { margin-top:48px; padding-top:16px; border-top:1px solid #e5e7eb; font-size:10px; color:#9ca3af; line-height:1.6; }
  </style></head><body>
  <div class="page">
    <div class="hdr">
      <div class="brand">${profile.company_name || "Fiscaliq"}</div>
      <div class="co"><strong>${profile.company_name || "Fiscaliq"}</strong><br>
        ${[profile.address, [profile.postal_code, profile.city].filter(Boolean).join(" ")].filter(Boolean).join("<br>")}
        ${profile.iban ? `<br>IBAN: ${profile.iban}` : ""}
      </div>
    </div>
    <div class="ts">
      <div class="tl">Factuur</div>
      <div class="tn">${invoice.invoice_number}</div>
    </div>
    <div class="mg">
      <div class="mi"><label>Factuurdatum</label><span>${nlDate(invoice.issue_date)}</span></div>
      <div class="mi"><label>Vervaldatum</label><span>${nlDate(invoice.due_date)}</span></div>
      <div class="mi"><label>Status</label><span>${statusBadge(invoice.status)}</span></div>
    </div>
    <div class="cb">
      <div class="cl">Factuur voor</div>
      <div class="cn">${client.name}</div>
      ${client.address ? `<div class="cd">${client.address}</div>` : ""}
      <div class="cd">${[client.postal_code, client.city].filter(Boolean).join(" ")}</div>
      ${client.kvk_number ? `<div class="cd" style="margin-top:2px;">KVK: ${client.kvk_number}</div>` : ""}
    </div>
    <table class="it">
      <thead><tr><th style="width:36px;">#</th><th>Omschrijving</th><th style="width:60px;text-align:center;">Aantal</th><th style="width:100px;text-align:right;">Prijs</th><th style="width:60px;text-align:center;">BTW</th><th style="width:110px;text-align:right;">Totaal</th></tr></thead>
      <tbody>${itemsHtml(items)}</tbody>
    </table>
    <div class="tot"><table>
      <tr><td>Subtotaal</td><td>${eur(invoice.subtotal)}</td></tr>
      ${vatRows(vats)}
      <tr class="gr"><td>Totaal</td><td>${eur(invoice.total)}</td></tr>
    </table></div>
    ${profile.iban ? `<div class="pb"><strong>Betaalinformatie</strong><br>IBAN: ${profile.iban} · o.v.v. factuurnummer <strong>${invoice.invoice_number}</strong></div>` : ""}
    ${hasNotes ? `<div style="font-size:11px;color:#6b7280;line-height:1.7;margin-bottom:24px;">${invoice.notes ? `<p style="margin-bottom:6px;">${invoice.notes.replace(/\n/g, "<br>")}</p>` : ""}${profile.invoice_footer ? `<p style="color:#9ca3af;">${profile.invoice_footer.replace(/\n/g, "<br>")}</p>` : ""}</div>` : ""}
    <div class="ft">${profile.email || ""}${profile.website ? ` · ${profile.website}` : ""}${profile.phone ? ` · ${profile.phone}` : ""} · KVK: ${profile.kvk_number || "—"} · BTW: ${profile.vat_number || "—"}</div>
  </div></body></html>`;
}

function minimaalHtml(invoice: InvoiceData, profile: Profile, client: Client, items: InvoiceItem[], vats: { rate: number; base: number; vat: number }[]): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Inter',-apple-system,sans-serif; color:#111827; font-size:10px; line-height:1.5; }
    .page { width:210mm; min-height:297mm; padding:48px 48px; position:relative; }
    .hdr { margin-bottom:56px; }
    .brand { font-size:13px; color:#9ca3af; font-weight:400; }
    .ts { margin-bottom:48px; }
    .tn { font-size:24px; font-weight:600; color:#111827; margin-bottom:16px; }
    .mg { display:flex; gap:32px; margin-bottom:40px; }
    .mi label { font-size:8px; text-transform:uppercase; letter-spacing:1px; color:#d1d5db; display:block; margin-bottom:2px; }
    .mi span { font-size:11px; color:#4b5563; }
    .sides { display:flex; justify-content:space-between; margin-bottom:40px; }
    .co, .cb { font-size:10px; color:#6b7280; line-height:1.7; }
    .co strong, .cn { font-size:12px; font-weight:500; color:#111827; }
    .cn { margin-bottom:4px; }
    .cl { font-size:8px; text-transform:uppercase; letter-spacing:1.5px; color:#d1d5db; margin-bottom:6px; }
    table.it { width:100%; border-collapse:collapse; margin-bottom:32px; }
    table.it thead th { border-bottom:1px solid #e5e7eb; padding:6px 6px; font-size:8px; text-transform:uppercase; letter-spacing:1px; color:#9ca3af; font-weight:500; text-align:left; }
    table.it thead th:last-child { text-align:right; }
    table.it thead th:nth-child(3), table.it thead th:nth-child(5) { text-align:center; }
    table.it thead th:nth-child(4) { text-align:right; }
    table.it tbody td { padding:8px 6px; border-bottom:1px solid #f3f4f6; font-size:11px; color:#374151; }
    .tot { margin-left:auto; width:200px; margin-bottom:40px; }
    .tot table { width:100%; border-collapse:collapse; }
    .tot td { padding:4px 0; font-size:11px; color:#6b7280; }
    .tot td:last-child { text-align:right; font-weight:500; color:#374151; }
    .tot .gr td { font-size:14px; font-weight:600; color:#111827; border-top:1px solid #111827; padding-top:6px; }
    .pb { font-size:10px; color:#6b7280; line-height:1.7; margin-bottom:32px; }
    .pb strong { color:#374151; }
    .ft { margin-top:48px; padding-top:12px; border-top:1px solid #f3f4f6; font-size:9px; color:#d1d5db; line-height:1.6; }
  </style></head><body>
  <div class="page">
    <div class="hdr">
      <div class="brand">${profile.company_name || "Fiscaliq"}</div>
    </div>
    <div class="ts">
      <div class="tn">${invoice.invoice_number}</div>
      <div class="mg">
        <div class="mi"><label>Datum</label><span>${nlDate(invoice.issue_date)}</span></div>
        <div class="mi"><label>Vervalt</label><span>${nlDate(invoice.due_date)}</span></div>
        <div class="mi"><label>Status</label><span>${statusBadge(invoice.status)}</span></div>
      </div>
    </div>
    <div class="sides">
      <div class="co">
        <strong>${profile.company_name || "Fiscaliq"}</strong><br>
        ${[profile.address, [profile.postal_code, profile.city].filter(Boolean).join(" ")].filter(Boolean).join("<br>")}
        ${profile.iban ? `<br>IBAN: ${profile.iban}` : ""}
        ${profile.kvk_number ? `<br>KVK: ${profile.kvk_number}` : ""}
      </div>
      <div class="cb" style="text-align:right;">
        <div class="cl">Voor</div>
        <div class="cn">${client.name}</div>
        ${client.address ? `${client.address}<br>` : ""}
        ${[client.postal_code, client.city].filter(Boolean).join(" ")}
        ${client.kvk_number ? `<br>KVK: ${client.kvk_number}` : ""}
      </div>
    </div>
    <table class="it">
      <thead><tr><th style="width:24px;">#</th><th>Omschrijving</th><th style="width:48px;text-align:center;">Aantal</th><th style="width:80px;text-align:right;">Prijs</th><th style="width:48px;text-align:center;">BTW</th><th style="width:90px;text-align:right;">Totaal</th></tr></thead>
      <tbody>${itemsHtml(items)}</tbody>
    </table>
    <div class="tot"><table>
      <tr><td>Subtotaal</td><td>${eur(invoice.subtotal)}</td></tr>
      ${vatRows(vats)}
      <tr class="gr"><td>Totaal</td><td>${eur(invoice.total)}</td></tr>
    </table></div>
    ${profile.iban ? `<div class="pb">Betaal naar <strong>${profile.iban}</strong> o.v.v. <strong>${invoice.invoice_number}</strong></div>` : ""}
    <div class="ft">${profile.email || ""}${profile.website ? ` · ${profile.website}` : ""}</div>
  </div></body></html>`;
}

const templates: Record<TemplateName, (invoice: InvoiceData, profile: Profile, client: Client, items: InvoiceItem[], vats: { rate: number; base: number; vat: number }[]) => string> = {
  klassiek: klassiekHtml,
  modern: modernHtml,
  minimaal: minimaalHtml,
};

export function getTemplatePreview(template: TemplateName): string {
  const dummyInvoice: InvoiceData = { id: "", invoice_number: "2026-0001", issue_date: "2026-05-31", due_date: "2026-06-30", status: "verzonden", subtotal: 1750, vat_amount: 367.50, total: 2117.50, notes: null, client_id: "" };
  const dummyProfile: Profile = { company_name: "Jouw Bedrijf B.V.", kvk_number: "12345678", vat_number: "NL123456789B01", address: "Voorbeeldstraat 42", postal_code: "1234 AB", city: "Amsterdam", iban: "NL12ABNA0123456789", phone: "+31 20 123 4567", website: "www.jouwbedrijf.nl", email: "info@jouwbedrijf.nl", payment_terms: 14, invoice_footer: null };
  const dummyClient: Client = { name: "Voorbeeld Klant B.V.", address: "Klantlaan 15", postal_code: "5678 CD", city: "Rotterdam", kvk_number: "87654321", vat_number: "NL87654321B01" };
  const dummyItems: InvoiceItem[] = [
    { description: "Advieswerkzaamheden — maand mei 2026", quantity: 10, unit_price: 125, vat_rate: 21 },
    { description: "Ontwikkeling dashboard module", quantity: 5, unit_price: 100, vat_rate: 21 },
  ];
  const vats = vatSummary(dummyItems);
  return templates[template](dummyInvoice, dummyProfile, dummyClient, dummyItems, vats);
}

export async function downloadInvoicePdf(invoiceId: string): Promise<void> {
  const template = (localStorage.getItem("fiscaliq_invoice_template") || "klassiek") as TemplateName;

  const [invRes, profileRes] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", invoiceId).single(),
    supabase.from("profiles").select("*").maybeSingle(),
  ]);
  if (invRes.error) throw invRes.error;
  const invoice = invRes.data as InvoiceData;

  const [itemsRes, clientRes] = await Promise.all([
    supabase.from("invoice_items").select("*").eq("invoice_id", invoiceId).order("position"),
    supabase.from("clients").select("name,address,postal_code,city,kvk_number,vat_number").eq("id", invoice.client_id).single(),
  ]);
  const items = (itemsRes.data ?? []) as InvoiceItem[];
  const client = clientRes.data as Client;
  const profile = (profileRes.data ?? { company_name: "Fiscaliq", kvk_number: null, vat_number: null, address: null, postal_code: null, city: null, iban: null, phone: null, website: null, email: null, payment_terms: 14, invoice_footer: null }) as Profile;

  const vats = vatSummary(items);
  const html = templates[template](invoice, profile, client, items, vats);
  const element = document.createElement("div");
  element.innerHTML = html;
  document.body.appendChild(element);

  try {
    await html2pdf().set({
      margin: [0, 0, 0, 0],
      filename: `factuur-${invoice.invoice_number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: "avoid-all" },
    }).from(element).save();
  } finally {
    document.body.removeChild(element);
  }
}

export const templateLabels: Record<TemplateName, string> = {
  klassiek: "Klassiek",
  modern: "Modern",
  minimaal: "Minimaal",
};
