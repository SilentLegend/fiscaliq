'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { jsPDF } from 'jspdf';

interface Customer {
  id: string;
  name: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  vat_number: string | null;
  kvk: string | null;
  email: string | null;
  phone: string | null;
  payment_term_days: number | null;
  vat_rate_preference: string | null;
  currency: string | null;
}

interface InvoiceLineForm {
  description: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceForm {
  customerId: string;
  customerName: string;
  vatRate: string;
  currency: string;
  issueDate: string;
  paymentTermDays: string;
  lines: InvoiceLineForm[];
}

interface InvoiceRow {
  id: string;
  invoice_number: string | null;
  customer_name: string;
  issue_date: string;
  due_date: string | null;
  amount_excl: number;
  vat_rate: number;
  amount_incl: number;
  currency: string | null;
  status: string;
}

interface InvoiceLineRow {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount_excl: number;
}

type QuarterFilter = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4';

interface CompanySettings {
  company_name: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  kvk: string | null;
  vat_number: string | null;
  iban: string | null;
  email: string | null;
  website: string | null;
}

export default function FacturenPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [linesByInvoice, setLinesByInvoice] = useState<Record<string, InvoiceLineRow[]>>({});
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceRow | null>(null);
  const [shareTarget, setShareTarget] = useState<InvoiceRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterFilter>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [form, setForm] = useState<InvoiceForm>({
customerId: '',
customerName: '',
vatRate: '21',
currency: 'EUR',
issueDate: new Date().toISOString().slice(0, 10),
paymentTermDays: '30',
lines: [{ description: '', quantity: '1', unitPrice: '' }],
  });

  useEffect(() => {
async function loadData() {
  setLoading(true);

  const [invRes, custRes, compRes] = await Promise.all([
supabase.from('invoices').select('*').order('issue_date', { ascending: false }),
supabase.from('customers').select('*').order('name', { ascending: true }),
supabase.from('company_settings').select('*').single(),
  ]);

  if (invRes.error) {
setError('Kon facturen niet ophalen.');
setLoading(false);
return;
  }

  const invoicesTyped = (invRes.data as InvoiceRow[]) ?? [];
  setInvoices(invoicesTyped);

  if (!custRes.error && custRes.data) {
setCustomers(custRes.data as Customer[]);
  }

  if (!compRes.error && compRes.data) {
const d = compRes.data as any;
setCompanySettings({
  company_name: d.company_name ?? '',
  street: d.street ?? null,
  postal_code: d.postal_code ?? null,
  city: d.city ?? null,
  kvk: d.kvk ?? null,
  vat_number: d.vat_number ?? null,
  iban: d.iban ?? null,
  email: d.email ?? null,
  website: d.website ?? null,
});
  }

  if (invoicesTyped.length > 0) {
const ids = invoicesTyped.map((i) => i.id);
const { data: lineData, error: lineError } = await supabase
  .from('invoice_lines')
  .select('*')
  .in('invoice_id', ids);

if (!lineError && lineData) {
  const grouped: Record<string, InvoiceLineRow[]> = {};
  (lineData as InvoiceLineRow[]).forEach((l) => {
if (!grouped[l.invoice_id]) grouped[l.invoice_id] = [];
grouped[l.invoice_id].push(l);
  });
  setLinesByInvoice(grouped);
}
  }

  setLoading(false);
}
loadData();
  }, []);

  useEffect(() => {
if (!deleteTarget) return;
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') setDeleteTarget(null);
  if (e.key === 'Enter') {
e.preventDefault();
handleDeleteConfirm();
  }
};
window.addEventListener('keydown', onKeyDown);
return () => window.removeEventListener('keydown', onKeyDown);
  }, [deleteTarget]);

  const formTotals = useMemo(() => {
let totalExcl = 0;
form.lines.forEach((line) => {
  const q = Number(line.quantity.replace(',', '.')) || 0;
  const p = Number(line.unitPrice.replace(',', '.')) || 0;
  totalExcl += q * p;
});
const vat = Number(form.vatRate) || 0;
const totalIncl = totalExcl * (1 + vat / 100);
return { totalExcl, totalIncl, vat };
  }, [form.lines, form.vatRate]);

  const quarterFilteredInvoices = useMemo(() => {
const sorted = [...invoices].sort(
  (a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime(),
);
return sorted.filter((inv) => {
  const d = new Date(inv.issue_date);
  if (Number.isNaN(d.getTime())) return false;
  if (d.getFullYear() !== selectedYear) return false;
  if (selectedQuarter === 'all') return true;
  const month = d.getMonth() + 1;
  if (selectedQuarter === 'Q1') return month >= 1 && month <= 3;
  if (selectedQuarter === 'Q2') return month >= 4 && month <= 6;
  if (selectedQuarter === 'Q3') return month >= 7 && month <= 9;
  return month >= 10 && month <= 12;
});
  }, [invoices, selectedQuarter, selectedYear]);

  const invoiceYears = useMemo(() => {
const years = new Set<number>();
invoices.forEach((inv) => {
  const y = new Date(inv.issue_date).getFullYear();
  if (Number.isFinite(y)) years.add(y);
});
if (!years.size) years.add(new Date().getFullYear());
return [...years].sort((a, b) => b - a);
  }, [invoices]);

  function formatDateNl(value: string | null | undefined): string {
if (!value) return '-';
const d = new Date(value);
if (Number.isNaN(d.getTime())) return '-';
return d.toLocaleDateString('nl-NL');
  }

  function formatCurrencyNl(value: number, code?: string | null): string {
return `${currencySymbol(code)} ${value.toFixed(2).replace('.', ',')}`;
  }

  function currencySymbol(code: string | null | undefined): string {
switch (code) {
  case 'USD':
return '$';
  case 'GBP':
return '£';
  case 'EUR':
  default:
return '€';
}
  }

  function invoiceLabel(inv: InvoiceRow): string {
return inv.invoice_number || inv.id.slice(0, 8).toUpperCase();
  }

  function buildCompanySlug(name: string): string {
const cleaned = name
  .trim()
  .replace(/[^a-zA-Z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');
if (!cleaned) return 'KLANT';
const [first] = cleaned.split('_');
return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  }

  async function buildNextInvoiceNumber(customerName: string, issueDate: string): Promise<string> {
const prefix = buildCompanySlug(customerName);
const year = new Date(issueDate).getFullYear() || new Date().getFullYear();
const pattern = `${prefix}_${year}_`;
const { data, error: seqError } = await supabase
  .from('invoices')
  .select('invoice_number')
  .ilike('invoice_number', `${pattern}%`);

if (seqError || !data) {
  return `${prefix}_${year}_01`;
}

const used = new Set(
  data
.map((row) => row.invoice_number)
.filter((v): v is string => !!v)
.map((v) => Number(v.split('_').pop()))
.filter((n) => Number.isFinite(n)),
);

let next = 1;
while (used.has(next)) next += 1;
return `${prefix}_${year}_${String(next).padStart(2, '0')}`;
  }

  async function shareInvoice(inv: InvoiceRow, channel: 'email' | 'whatsapp' | 'native') {
const label = invoiceLabel(inv);
const customer = customers.find((c) => c.name === inv.customer_name);
const message = `Factuur ${label} voor ${inv.customer_name} (${formatCurrencyNl(
  inv.amount_incl,
  inv.currency,
)}) met vervaldatum ${formatDateNl(inv.due_date)}.`;

if (channel === 'email') {
  const to = customer?.email ? `${encodeURIComponent(customer.email)}` : '';
  const href = `mailto:${to}?subject=${encodeURIComponent(
`Factuur ${label}`,
  )}&body=${encodeURIComponent(message)}`;
  window.open(href, '_blank');
  setShareTarget(null);
  return;
}
if (channel === 'whatsapp') {
  const cleaned = (customer?.phone || '').replace(/[^\d+]/g, '');
  const phone = cleaned ? cleaned.replace(/^0/, '31') : '';
  const url = phone
? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
: `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
  setShareTarget(null);
  return;
}
if (navigator.share) {
  await navigator.share({ title: `Factuur ${label}`, text: message });
  setShareTarget(null);
} else {
  setError('Delen wordt op dit apparaat niet ondersteund. Gebruik e-mail of WhatsApp.');
}
  }

  const effectiveDueDate = useMemo(() => {
const baseDate = new Date(form.issueDate || new Date().toISOString().slice(0, 10));
if (Number.isNaN(baseDate.getTime())) return new Date().toISOString().slice(0, 10);
baseDate.setDate(baseDate.getDate() + (Number(form.paymentTermDays) || 30));
const d = baseDate;
return d.toISOString().slice(0, 10);
  }, [form.issueDate, form.paymentTermDays]);

  function resetForm() {
setEditingId(null);
setForm({
  customerId: '',
  customerName: '',
  vatRate: '21',
  currency: 'EUR',
  issueDate: new Date().toISOString().slice(0, 10),
  paymentTermDays: '30',
  lines: [{ description: '', quantity: '1', unitPrice: '' }],
});
  }

  function addLine() {
setForm((f) => ({
  ...f,
  lines: [...f.lines, { description: '', quantity: '1', unitPrice: '' }],
}));
  }

  function removeLine(index: number) {
setForm((f) => ({
  ...f,
  lines: f.lines.filter((_, i) => i !== index),
}));
  }

  function statusLabel(inv: InvoiceRow): string {
if (!inv.due_date) return 'Zonder vervaldatum';
const today = new Date();
const due = new Date(inv.due_date);
const diffMs = due.getTime() - new Date(today.toDateString()).getTime();
const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
if (days > 0) return `Verloopt over ${days} dagen`;
if (days === 0) return 'Vervalt vandaag';
return `Achterstallig ${Math.abs(days)} dagen`;
  }

  async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setError(null);
setSaving(true);

if (form.lines.length === 0) {
  setError('Voeg minimaal één regel toe.');
  setSaving(false);
  return;
}

const maxAmount = 9999999999.99; // numeric(12,2)
let totalExclLocal = 0;
const parsedLines = form.lines.map((line) => {
  const quantity = Number(line.quantity.replace(',', '.')) || 0;
  const unitPrice = Number(line.unitPrice.replace(',', '.')) || 0;
  const amount = quantity * unitPrice;
  return { line, quantity, unitPrice, amount };
});

for (const { quantity, unitPrice, amount } of parsedLines) {
  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
setError('Gebruik alleen geldige getallen voor aantal en prijs.');
setSaving(false);
return;
  }
  totalExclLocal += amount;
  if (
Math.abs(quantity) > maxAmount ||
Math.abs(unitPrice) > maxAmount ||
Math.abs(amount) > maxAmount ||
Math.abs(totalExclLocal) > maxAmount
  ) {
setError('Bedragen zijn te groot om op te slaan. Verklein de bedragen.');
setSaving(false);
return;
  }
}

const vat = Number(form.vatRate) || 0;
const totalInclLocal = totalExclLocal * (1 + vat / 100);

const computedDueDate = effectiveDueDate;

try {
  if (!editingId) {
const generatedInvoiceNumber = await buildNextInvoiceNumber(form.customerName, form.issueDate);
const { data: inserted, error: invError } = await supabase
  .from('invoices')
  .insert({
invoice_number: generatedInvoiceNumber,
customer_name: form.customerName,
issue_date: form.issueDate,
amount_excl: totalExclLocal,
vat_rate: vat,
amount_incl: totalInclLocal,
currency: form.currency,
due_date: computedDueDate || null,
status: 'concept',
  })
  .select('id')
  .single();

if (invError || !inserted) {
  setError(
invError?.message?.includes('invoices_user_invoice_number_uidx')
  ? 'Factuurnummer bestaat al, probeer opnieuw.'
  : 'Kon factuur niet opslaan.',
  );
  setSaving(false);
  return;
}

const invoiceId = inserted.id as string;

const payloadWithInvoice = parsedLines.map(({ line, quantity, unitPrice, amount }) => ({
  invoice_id: invoiceId,
  description: line.description,
  quantity,
  unit_price: unitPrice,
  amount_excl: amount,
}));

if (payloadWithInvoice.length > 0) {
  const { error: lineError } = await supabase
.from('invoice_lines')
.insert(payloadWithInvoice);
  if (lineError) {
console.error('Kon factuurregels niet opslaan, factuur wordt verwijderd:', lineError);
await supabase.from('invoices').delete().eq('id', invoiceId);
setError('Factuurregels konden niet worden opgeslagen. De factuur is niet bewaard.');
setSaving(false);
return;
  }
}
  } else {
const { error: invError } = await supabase
  .from('invoices')
  .update({
customer_name: form.customerName,
issue_date: form.issueDate,
amount_excl: totalExclLocal,
vat_rate: vat,
amount_incl: totalInclLocal,
currency: form.currency,
due_date: computedDueDate || null,
  })
  .eq('id', editingId);
if (invError) {
  setError('Kon factuur niet bijwerken.');
  setSaving(false);
  return;
}

await supabase.from('invoice_lines').delete().eq('invoice_id', editingId);

const payloadWithInvoice = parsedLines.map(({ line, quantity, unitPrice, amount }) => ({
  invoice_id: editingId,
  description: line.description,
  quantity,
  unit_price: unitPrice,
  amount_excl: amount,
}));

if (payloadWithInvoice.length > 0) {
  const { error: lineError } = await supabase
.from('invoice_lines')
.insert(payloadWithInvoice);
  if (lineError) {
console.error('Kon factuurregels niet opslaan bij bijwerken:', lineError);
setError('Factuur is bijgewerkt, maar regels konden niet worden opgeslagen.');
  }
}
  }

  const { data: invData } = await supabase
.from('invoices')
.select('*')
.order('issue_date', { ascending: false });
  const invoicesTyped = (invData as InvoiceRow[]) ?? [];
  setInvoices(invoicesTyped);

  if (invoicesTyped.length > 0) {
const ids = invoicesTyped.map((i) => i.id);
const { data: lineData, error: lineError } = await supabase
  .from('invoice_lines')
  .select('*')
  .in('invoice_id', ids);
if (!lineError && lineData) {
  const grouped: Record<string, InvoiceLineRow[]> = {};
  (lineData as InvoiceLineRow[]).forEach((l) => {
if (!grouped[l.invoice_id]) grouped[l.invoice_id] = [];
grouped[l.invoice_id].push(l);
  });
  setLinesByInvoice(grouped);
}
  }

  resetForm();
  setShowForm(false);
} catch (err) {
  console.error(err);
  setError('Er ging iets mis bij het opslaan. Probeer het opnieuw.');
}

setSaving(false);
  }

  async function startEdit(inv: InvoiceRow) {
let lines: InvoiceLineRow[] = [];
const { data: lineData, error: lineError } = await supabase
  .from('invoice_lines')
  .select('*')
  .eq('invoice_id', inv.id);

if (!lineError && lineData) {
  lines = lineData as InvoiceLineRow[];
  setLinesByInvoice((prev) => ({ ...prev, [inv.id]: lines }));
}

let paymentTermDays = '30';
if (inv.issue_date && inv.due_date) {
  const issue = new Date(inv.issue_date);
  const due = new Date(inv.due_date);
  if (!Number.isNaN(issue.getTime()) && !Number.isNaN(due.getTime())) {
const diffMs = due.getTime() - issue.getTime();
const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
if (diffDays === 14 || diffDays === 30 || diffDays === 60 || diffDays === 90) {
  paymentTermDays = String(diffDays);
}
  }
}

setEditingId(inv.id);
setForm({
  customerId: '',
  customerName: inv.customer_name,
  vatRate: String(inv.vat_rate),
  currency: inv.currency ?? 'EUR',
  issueDate: inv.issue_date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  paymentTermDays,
  lines:
lines.length > 0
  ? lines.map((l) => ({
  description: l.description,
  quantity: String(l.quantity),
  unitPrice: String(l.unit_price),
}))
  : [{ description: '', quantity: '1', unitPrice: '' }],
});
setShowForm(true);
  }

  async function handleDeleteConfirm() {
if (!deleteTarget) return;
const target = deleteTarget;
setDeleteTarget(null);
await supabase.from('invoices').delete().eq('id', target.id);
setInvoices((prev) => prev.filter((i) => i.id !== target.id));
setLinesByInvoice((prev) => {
  const copy = { ...prev };
  delete copy[target.id];
  return copy;
});
  }

  function generateInvoicePdf(inv: InvoiceRow, lines: InvoiceLineRow[]) {
const doc = new jsPDF();
const pageHeight = doc.internal.pageSize.getHeight();

const leftX = 20;
const rightX = 125;
const contentRight = 190;
let cursorY = 24;

const customer = customers.find((c) => c.name === inv.customer_name);

const issueDateText = formatDateNl(inv.issue_date);
const dueDateText = formatDateNl(inv.due_date);

const issueDate = inv.issue_date ? new Date(inv.issue_date) : null;
const dueDate = inv.due_date ? new Date(inv.due_date) : null;

let paymentTermDaysNumeric = 30;
if (issueDate && dueDate && !Number.isNaN(issueDate.getTime()) && !Number.isNaN(dueDate.getTime())) {
  const diffMs = dueDate.getTime() - issueDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 14 || diffDays === 30 || diffDays === 60 || diffDays === 90) {
paymentTermDaysNumeric = diffDays;
  }
}

const formatCurrency = (value: number) =>
  `${currencySymbol(inv.currency)} ${value.toFixed(2).replace('.', ',')}`;

const drawLabelValue = (label: string, value: string, y: number) => {
  doc.setFont('helvetica', 'normal');
  doc.text(label, leftX, y);
  doc.text(`: ${value}`, leftX + 36, y);
};

const drawRightAligned = (text: string, x: number, y: number) => {
  doc.text(text, x, y, { align: 'right' });
};

doc.setFont('helvetica', 'normal');
doc.setFontSize(11);

// Klant linksboven (was rechts)
let leftCursorY = 24;
doc.setFont('helvetica', 'bold');
doc.text(customer?.name || inv.customer_name || '-', leftX, leftCursorY);
leftCursorY += 8;

doc.setFont('helvetica', 'normal');
if (customer?.street) {
  doc.text(customer.street, leftX, leftCursorY);
  leftCursorY += 6;
}

const customerCityLine = `${customer?.postal_code ?? ''} ${customer?.city ?? ''}`.trim();
if (customerCityLine) {
  doc.text(customerCityLine, leftX, leftCursorY);
  leftCursorY += 10;
}

if (customer?.kvk) {
  doc.text(`KvK-nummer: ${customer.kvk}`, leftX, leftCursorY);
  leftCursorY += 6;
}

if (customer?.vat_number) {
  doc.text(`BTW-id: ${customer.vat_number}`, leftX, leftCursorY);
  leftCursorY += 6;
}

doc.setDrawColor(190);
doc.line(leftX, leftCursorY + 2, 82, leftCursorY + 2);

// Bedrijf rechtsboven (was linksboven)
let rightCursorY = 24;
if (companySettings) {
  doc.setFont('helvetica', 'bold');
  doc.text(companySettings.company_name || '-', rightX, rightCursorY);
  rightCursorY += 8;

  doc.setFont('helvetica', 'normal');
  if (companySettings.street) {
doc.text(companySettings.street, rightX, rightCursorY);
rightCursorY += 6;
  }

  const companyCityLine = `${companySettings.postal_code ?? ''} ${companySettings.city ?? ''}`.trim();
  if (companyCityLine) {
doc.text(companyCityLine, rightX, rightCursorY);
rightCursorY += 6;
  }

  if (companySettings.kvk) {
doc.text(`KvK: ${companySettings.kvk}`, rightX, rightCursorY);
rightCursorY += 6;
  }

  if (companySettings.vat_number) {
doc.text(`BTW-id: ${companySettings.vat_number}`, rightX, rightCursorY);
rightCursorY += 6;
  }

  doc.setDrawColor(190);
  doc.line(rightX, rightCursorY + 2, contentRight, rightCursorY + 2);
}

// Titelblok
cursorY = 92;
doc.setFont('helvetica', 'normal');
doc.setFontSize(22);
doc.text('Factuur', leftX, cursorY);

doc.setDrawColor(190);
doc.line(leftX, cursorY + 4, contentRight, cursorY + 4);

cursorY += 14;
doc.setFontSize(11);
drawLabelValue('Factuurnummer', invoiceLabel(inv), cursorY);
cursorY += 7;
drawLabelValue('Factuurdatum', issueDateText, cursorY);
cursorY += 7;
drawLabelValue('Vervaldatum', dueDateText, cursorY);

// Tabelkop
cursorY += 14;
const colDesc = leftX;
const colQty = 118;
const colAmount = 146;
const colVat = 162;
const colTotal = 189;

doc.setFont('helvetica', 'bold');
doc.text('Omschrijving', colDesc, cursorY);
drawRightAligned('Aantal', colQty, cursorY);
drawRightAligned('Bedrag', colAmount, cursorY);
drawRightAligned('BTW', colVat, cursorY);
drawRightAligned('Totaal', colTotal, cursorY);

cursorY += 5;
doc.setDrawColor(120);
doc.line(leftX, cursorY, contentRight, cursorY);

// Regels
doc.setFont('helvetica', 'normal');
const vatMultiplier = 1 + (inv.vat_rate ?? 0) / 100;

lines.forEach((line) => {
  cursorY += 8;

  if (cursorY > 235) {
doc.addPage();
cursorY = 20;

doc.setFont('helvetica', 'bold');
doc.text('Omschrijving', colDesc, cursorY);
drawRightAligned('Aantal', colQty, cursorY);
drawRightAligned('Bedrag', colAmount, cursorY);
drawRightAligned('BTW', colVat, cursorY);
drawRightAligned('Totaal', colTotal, cursorY);

cursorY += 5;
doc.setDrawColor(120);
doc.line(leftX, cursorY, contentRight, cursorY);
doc.setFont('helvetica', 'normal');
cursorY += 3;
  }

  const descriptionLines = doc.splitTextToSize(line.description || '-', 92);
  const lineVatRate = `${(inv.vat_rate ?? 0).toFixed(0)}%`;
  const lineTotal = line.amount_excl * vatMultiplier;
  const startY = cursorY;

  doc.text(descriptionLines, colDesc, startY);
  drawRightAligned(String(line.quantity), colQty, startY);
  drawRightAligned(formatCurrency(line.amount_excl), colAmount, startY);
  drawRightAligned(lineVatRate, colVat, startY);
  drawRightAligned(formatCurrency(lineTotal), colTotal, startY);

  cursorY = startY + descriptionLines.length * 6;
  doc.setDrawColor(220);
  doc.line(leftX, cursorY, contentRight, cursorY);
});

// Totalen
const totalExcl = inv.amount_excl ?? 0;
const vatAmount = (inv.amount_incl ?? 0) - totalExcl;
const totalIncl = inv.amount_incl ?? 0;

cursorY += 10;
const totalsLabelX = 116;
const totalsValueX = 189;

doc.setFont('helvetica', 'bold');
doc.text('Totaal exclusief BTW:', totalsLabelX, cursorY);
drawRightAligned(formatCurrency(totalExcl), totalsValueX, cursorY);

cursorY += 8;
doc.setFont('helvetica', 'normal');
doc.text(`BTW (${(inv.vat_rate ?? 0).toFixed(0)}%):`, totalsLabelX, cursorY);
drawRightAligned(formatCurrency(vatAmount), totalsValueX, cursorY);

cursorY += 8;
doc.setFont('helvetica', 'bold');
doc.text('Totaal:', totalsLabelX, cursorY);
drawRightAligned(formatCurrency(totalIncl), totalsValueX, cursorY);

doc.setDrawColor(150);
doc.line(totalsLabelX, cursorY + 2, totalsValueX, cursorY + 2);

// Onderste vakken
const boxY = pageHeight - 52;
const boxH = 18;
const boxW = 58;
const gap = 6;
const box1X = 24;
const box2X = box1X + boxW + gap;
const box3X = box2X + boxW + gap;

doc.setDrawColor(80);
doc.rect(box1X, boxY, boxW, boxH);
doc.rect(box2X, boxY, boxW, boxH);
doc.rect(box3X, boxY, boxW, boxH);

doc.setFontSize(9);
doc.setFont('helvetica', 'normal');

doc.text('IBAN-nummer', box1X + boxW / 2, boxY + 7, { align: 'center' });
doc.setFont('helvetica', 'bold');
doc.text(companySettings?.iban || '-', box1X + boxW / 2, boxY + 13, { align: 'center' });

doc.setFont('helvetica', 'normal');
doc.text('Factuurnummer', box2X + boxW / 2, boxY + 7, { align: 'center' });
doc.setFont('helvetica', 'bold');
doc.text(invoiceLabel(inv), box2X + boxW / 2, boxY + 13, { align: 'center' });

doc.setFont('helvetica', 'normal');
doc.text('Factuurbedrag', box3X + boxW / 2, boxY + 7, { align: 'center' });
doc.setFont('helvetica', 'bold');
doc.text(formatCurrency(totalIncl), box3X + boxW / 2, boxY + 13, { align: 'center' });

// Betaaltekst
const paymentText = `Het openstaande bedrag van ${formatCurrency(
  totalIncl,
)} dient binnen ${paymentTermDaysNumeric} dagen overgemaakt te zijn op rekeningnummer ${
  companySettings?.iban || '-'
} onder vermelding van het factuurnummer ${invoiceLabel(inv)}.`;

doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
const paymentLines = doc.splitTextToSize(paymentText, 165);
doc.text(paymentLines, 24, pageHeight - 18);

return doc;
  }

  function handleDownloadPdf(inv: InvoiceRow) {
const lines = linesByInvoice[inv.id] ?? [];
const doc = generateInvoicePdf(inv, lines);
doc.save(`factuur-${invoiceLabel(inv)}.pdf`);
  }

  const previewPdfDataUri = useMemo(() => {
try {
  const previewLines: InvoiceLineRow[] = form.lines.map((line, idx) => {
const quantity = Number(line.quantity.replace(',', '.')) || 0;
const unitPrice = Number(line.unitPrice.replace(',', '.')) || 0;
return {
  id: `preview-${idx}`,
  invoice_id: 'preview',
  description: line.description || '-',
  quantity,
  unit_price: unitPrice,
  amount_excl: quantity * unitPrice,
};
  });
  const previewInvoice: InvoiceRow = {
id: editingId || 'preview',
invoice_number: editingId
  ? invoices.find((inv) => inv.id === editingId)?.invoice_number ?? null
  : `${buildCompanySlug(form.customerName || 'Klant')}_${new Date(
  form.issueDate || new Date().toISOString().slice(0, 10),
).getFullYear()}_..`,
customer_name: form.customerName || 'Klantnaam',
issue_date: form.issueDate || new Date().toISOString().slice(0, 10),
due_date: effectiveDueDate,
amount_excl: formTotals.totalExcl,
vat_rate: Number(form.vatRate) || 0,
amount_incl: formTotals.totalIncl,
currency: form.currency,
status: 'concept',
  };
  const doc = generateInvoicePdf(previewInvoice, previewLines);
  return doc.output('datauristring');
} catch (err) {
  console.error('Error generating preview PDF:', err);
  return '';
}
  }, [
editingId,
invoices,
form.customerName,
form.issueDate,
form.vatRate,
form.currency,
form.lines,
effectiveDueDate,
formTotals.totalExcl,
formTotals.totalIncl,
companySettings,
customers,
  ]);

  return (
<div className="space-y-6">
  <div className="flex flex-wrap items-center justify-between gap-3">
<div>
  <h1 className="text-lg font-semibold tracking-tight text-text">Facturen</h1>
  <p className="mt-1 text-sm text-muted">
Overzicht van je verstuurde en conceptfacturen.
  </p>
</div>
<button
  type="button"
  onClick={() => {
resetForm();
setShowForm(true);
  }}
  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
>
  <span className="text-base leading-none">＋</span>
  Nieuwe factuur
</button>
  </div>

  {error && (
<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
  {error}
</div>
  )}

  <div className="flex flex-wrap items-center justify-between gap-3">
<div className="flex flex-wrap gap-2">
  {(['all', 'Q1', 'Q2', 'Q3', 'Q4'] as QuarterFilter[]).map((q) => (
<button
  key={q}
  type="button"
  onClick={() => setSelectedQuarter(q)}
  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
selectedQuarter === q
  ? 'bg-primary text-white'
  : 'border border-border bg-surface text-text hover:bg-surface-offset'
  }`}
>
  {q === 'all' ? 'Alle kwartalen' : q}
</button>
  ))}
</div>
<select
  value={selectedYear}
  onChange={(e) => setSelectedYear(Number(e.target.value))}
  className="h-9 rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
>
  {invoiceYears.map((y) => (
<option key={y} value={y}>
  {y}
</option>
  ))}
</select>
  </div>

  <div className="overflow-hidden rounded-2xl border border-border bg-surface">
<table className="min-w-full text-left text-sm">
  <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
<tr>
  <th className="px-4 py-3">Factuur</th>
  <th className="px-4 py-3">Klant</th>
  <th className="px-4 py-3">Aanmaakdatum</th>
  <th className="px-4 py-3">Vervaldatum</th>
  <th className="px-4 py-3 text-right">Totaal (incl. btw)</th>
  <th className="px-4 py-3">Status</th>
  <th className="px-4 py-3 text-right">Acties</th>
</tr>
  </thead>
  <tbody>
{loading ? (
  <tr>
<td className="px-4 py-6 text-center text-xs text-muted" colSpan={7}>
  Facturen laden…
</td>
  </tr>
) : quarterFilteredInvoices.length === 0 ? (
  <tr>
<td className="px-4 py-6 text-center text-xs text-muted" colSpan={7}>
  Geen facturen in deze kwartaalweergave.
</td>
  </tr>
) : (
  quarterFilteredInvoices.map((inv) => (
<tr key={inv.id} className="border-t border-border/60 align-top">
  <td className="px-4 py-3 text-xs font-medium text-text">
{invoiceLabel(inv)}
  </td>
  <td className="px-4 py-3 text-xs text-text">{inv.customer_name}</td>
  <td className="px-4 py-3 text-xs text-muted">
{formatDateNl(inv.issue_date)}
  </td>
  <td className="px-4 py-3 text-xs text-muted">
{formatDateNl(inv.due_date)}
  </td>
  <td className="px-4 py-3 text-right text-xs text-text">
{`${currencySymbol(inv.currency)} ${inv.amount_incl
  .toFixed(2)
  .replace('.', ',')}`}
  </td>
  <td className="px-4 py-3 text-xs">
<span className="inline-flex rounded-full bg-surface-offset px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
  {statusLabel(inv)}
</span>
  </td>
  <td className="px-4 py-3 text-right text-xs">
<button
  type="button"
  onClick={() => startEdit(inv)}
  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[10px] text-text hover:bg-surface-offset"
  aria-label="Factuur bewerken"
>
  <svg
aria-hidden
viewBox="0 0 24 24"
className="h-3.5 w-3.5 stroke-current"
fill="none"
strokeWidth={1.8}
  >
<path d="M5 19h3.2L19 8.2 15.8 5 5 15.8V19z" />
<path d="M14.2 5 19 9.8" />
  </svg>
</button>
<button
  type="button"
  onClick={() => handleDownloadPdf(inv)}
  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[10px] text-text hover:bg-surface-offset"
  aria-label="Factuur downloaden als PDF"
>
  <svg
aria-hidden
viewBox="0 0 24 24"
className="h-3.5 w-3.5 stroke-current"
fill="none"
strokeWidth={1.8}
  >
<path d="M12 3v14" />
<path d="M8 13l4 4 4-4" />
<path d="M5 19h14" />
  </svg>
</button>
<button
  type="button"
  onClick={() => setShareTarget(inv)}
  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[10px] text-text hover:bg-surface-offset"
  aria-label="Factuur delen"
>
  <svg
aria-hidden
viewBox="0 0 24 24"
className="h-3.5 w-3.5 stroke-current"
fill="none"
strokeWidth={1.8}
  >
<circle cx="18" cy="5" r="2.3" />
<circle cx="6" cy="12" r="2.3" />
<circle cx="18" cy="19" r="2.3" />
<path d="M8 11 16 6.2" />
<path d="m8 13 8 4.8" />
  </svg>
</button>
<button
  type="button"
  onClick={() => setDeleteTarget(inv)}
  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 text-[10px] text-rose-700 hover:bg-rose-50"
  aria-label="Factuur verwijderen"
>
  <svg
aria-hidden
viewBox="0 0 24 24"
className="h-3.5 w-3.5 stroke-current"
fill="none"
strokeWidth={1.8}
  >
<path d="M9 4h6" />
<path d="M5 7h14" />
<path d="M8 7v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" />
<path d="M10 10v6" />
<path d="M14 10v6" />
  </svg>
</button>
  </td>
</tr>
  ))
)}
  </tbody>
</table>
  </div>

  {showForm && (
<div
  className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6 overflow-y-auto"
  onClick={(e) => {
if (e.target === e.currentTarget) {
  setShowForm(false);
  resetForm();
}
  }}
>
  <div className="w-full max-w-6xl rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft my-6">
<div className="mb-4 flex items-center justify-between">
  <div>
<h2 className="text-sm font-semibold text-text">
  {editingId ? 'Factuur bewerken' : 'Nieuwe factuur'}
</h2>
<p className="text-xs text-muted">Kies een klant en vul de regels in.</p>
  </div>
  <button
type="button"
onClick={() => {
  setShowForm(false);
  resetForm();
}}
className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
  >
✕
  </button>
</div>

<form onSubmit={handleSubmit} className="grid gap-6 text-sm lg:grid-cols-[1.2fr_.8fr]">
  <div className="space-y-4">
<div className="grid gap-4 md:grid-cols-2">
<div>
  <label className="text-xs font-medium text-text" htmlFor="customerId">
Klant
  </label>
  <select
id="customerId"
value={form.customerId}
onChange={(e) => {
  const id = e.target.value;
  const found = customers.find((c) => c.id === id);
  setForm((f) => ({
...f,
customerId: id,
customerName: found ? found.name : '',
vatRate:
  found?.vat_rate_preference && !Number.isNaN(Number(found.vat_rate_preference))
? found.vat_rate_preference
: f.vatRate,
paymentTermDays:
  found?.payment_term_days && [14, 30, 60, 90].includes(found.payment_term_days)
? String(found.payment_term_days)
: f.paymentTermDays,
currency: found?.currency || f.currency,
  }));
}}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  >
<option value="">Klant kiezen of zelf invullen…</option>
{customers.map((c) => (
  <option key={c.id} value={c.id}>
{c.name}
  </option>
))}
  </select>
  <p className="mt-1 text-[10px] text-muted">
Staat je klant er nog niet tussen? Vul hieronder een naam in, later komt er een klantenbeheer.
  </p>
</div>
<div className="md:col-span-1">
  <label className="text-xs font-medium text-text" htmlFor="customerName">
Klantnaam (op factuur)
  </label>
  <input
id="customerName"
type="text"
required
value={form.customerName}
onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div>
  <label className="text-xs font-medium text-text" htmlFor="vatRate">
Btw-tarief (%)
  </label>
  <input
id="vatRate"
type="number"
min={0}
max={21}
step={1}
required
value={form.vatRate}
onChange={(e) => setForm((f) => ({ ...f, vatRate: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div>
  <label className="text-xs font-medium text-text" htmlFor="currency">
Factuurvaluta
  </label>
  <select
id="currency"
value={form.currency}
onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  >
<option value="EUR">EUR (€)</option>
<option value="USD">USD ($)</option>
<option value="GBP">GBP (£)</option>
  </select>
</div>
<div>
  <label className="text-xs font-medium text-text" htmlFor="issueDate">
Aanmaakdatum
  </label>
  <input
id="issueDate"
type="date"
value={form.issueDate}
onChange={(e) => setForm((f) => ({ ...f, issueDate: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
  <p className="mt-1 text-[10px] text-muted">
Vervaldatum wordt automatisch berekend: {formatDateNl(effectiveDueDate)}
  </p>
</div>
<div>
  <label className="text-xs font-medium text-text" htmlFor="paymentTermDays">
Betalingstermijn
  </label>
  <select
id="paymentTermDays"
value={form.paymentTermDays}
onChange={(e) => setForm((f) => ({ ...f, paymentTermDays: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  >
<option value="14">14 dagen</option>
<option value="30">30 dagen</option>
<option value="60">60 dagen</option>
<option value="90">90 dagen</option>
  </select>
</div>
  </div>

  <div className="mt-2 space-y-3 rounded-2xl border border-border bg-surface-2 p-3">
<div className="flex items-center justify-between">
  <span className="text-xs font-medium text-text">Regels</span>
</div>
<div className="max-h-64 space-y-2 overflow-y-auto pr-1">
  {form.lines.map((line, index) => (
<div
  key={index}
  className="grid gap-2 rounded-2xl bg-surface px-3 py-2 text-xs md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
>
  <div className="md:col-span-1">
<label className="block text-[11px] font-medium text-text">
  Omschrijving
</label>
<input
  type="text"
  value={line.description}
  onChange={(e) => {
const value = e.target.value;
setForm((f) => ({
  ...f,
  lines: f.lines.map((l, i) =>
i === index ? { ...l, description: value } : l,
  ),
}));
  }}
  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
/>
  </div>
  <div>
<label className="block text-[11px] font-medium text-text">
  Aantal
</label>
<input
  type="text"
  inputMode="decimal"
  value={line.quantity}
  onChange={(e) => {
const value = e.target.value;
setForm((f) => ({
  ...f,
  lines: f.lines.map((l, i) =>
i === index ? { ...l, quantity: value } : l,
  ),
}));
  }}
  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
/>
  </div>
  <div>
<label className="block text-[11px] font-medium text-text">
  Prijs per stuk
</label>
<input
  type="text"
  inputMode="decimal"
  value={line.unitPrice}
  onChange={(e) => {
const value = e.target.value;
setForm((f) => ({
  ...f,
  lines: f.lines.map((l, i) =>
i === index ? { ...l, unitPrice: value } : l,
  ),
}));
  }}
  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
/>
  </div>
  <div className="flex items-center justify-between md:flex-col md:items-end">
<span className="text-[11px] text-muted">
  {currencySymbol(form.currency)}{' '}
  {(() => {
const q = Number(line.quantity.replace(',', '.')) || 0;
const p = Number(line.unitPrice.replace(',', '.')) || 0;
return (q * p).toFixed(2).replace('.', ',');
  })()}
</span>
{form.lines.length > 1 && (
  <button
type="button"
onClick={() => removeLine(index)}
className="mt-1 text-[10px] text-rose-700 hover:underline"
  >
Verwijderen
  </button>
)}
  </div>
</div>
  ))}
</div>
<button
  type="button"
  onClick={addLine}
  className="mt-1 inline-flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-3 py-2 text-[11px] font-medium text-text hover:bg-surface-offset"
>
  + Regel toevoegen
</button>
<div className="flex flex-col items-end gap-1 text-[11px] text-muted md:flex-row md:justify-end md:gap-4">
  <div className="flex min-w-[260px] items-center justify-between whitespace-nowrap">
<span>Subtotaal:</span>
<span className="font-mono font-medium text-text">
  {formatCurrencyNl(formTotals.totalExcl, form.currency)}
</span>
  </div>
  <div className="flex min-w-[260px] items-center justify-between whitespace-nowrap">
<span>Totaal incl. btw:</span>
<span className="font-mono font-medium text-text">
  {formatCurrencyNl(formTotals.totalIncl, form.currency)}
</span>
  </div>
</div>
  </div>

  <div className="mt-2 flex items-center justify-end gap-2">
<button
  type="button"
  onClick={() => {
setShowForm(false);
resetForm();
  }}
  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset"
>
  Annuleren
</button>
<button
  type="submit"
  disabled={saving}
  className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
>
  {saving ? 'Opslaan…' : editingId ? 'Wijzigingen opslaan' : 'Factuur opslaan'}
</button>
  </div>
  </div>

  <aside className="rounded-2xl border border-border bg-bg p-4">
<div className="mb-3 flex items-center justify-between">
  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
Live preview
  </h3>
  <span className="rounded-full bg-surface-offset px-2 py-0.5 text-[10px] text-muted">
{editingId ? 'Bewerken' : 'Nieuw'}
  </span>
</div>
<div className="overflow-hidden rounded-2xl border border-border bg-surface">
  <iframe
title="Factuur PDF preview"
src={previewPdfDataUri}
className="h-[640px] w-full bg-white"
  />
</div>
  </aside>
</form>
  </div>
</div>
  )}

  {shareTarget && (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6"
  onClick={(e) => {
if (e.target === e.currentTarget) {
  setShareTarget(null);
}
  }}
>
  <div className="w-full max-w-sm rounded-[1.6rem] border border-border bg-surface p-5 shadow-soft">
<h2 className="text-sm font-semibold text-text">Factuur delen</h2>
<p className="mt-2 text-xs text-muted">
  Deel <span className="font-mono text-text">{invoiceLabel(shareTarget)}</span> voor{' '}
  <span className="font-medium text-text">{shareTarget.customer_name}</span>.
</p>
<div className="mt-4 grid grid-cols-2 gap-2 text-xs">
  <button
type="button"
onClick={() => shareInvoice(shareTarget, 'whatsapp')}
className="rounded-full border border-border px-3 py-2 text-text hover:bg-surface-offset"
  >
WhatsApp
  </button>
  <button
type="button"
onClick={() => shareInvoice(shareTarget, 'email')}
className="rounded-full border border-border px-3 py-2 text-text hover:bg-surface-offset"
  >
E-mail
  </button>
  <button
type="button"
onClick={() => shareInvoice(shareTarget, 'native')}
className="col-span-2 rounded-full border border-border px-3 py-2 text-text hover:bg-surface-offset"
  >
Deel via apparaat
  </button>
</div>
<div className="mt-3 flex justify-end">
  <button
type="button"
onClick={() => setShareTarget(null)}
className="rounded-full border border-border px-4 py-2 text-xs text-text hover:bg-surface-offset"
  >
Sluiten
  </button>
</div>
  </div>
</div>
  )}

  {deleteTarget && (
<div
  className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6"
  onClick={(e) => {
if (e.target === e.currentTarget) {
  setDeleteTarget(null);
}
  }}
>
  <div className="w-full max-w-sm rounded-[1.6rem] border border-border bg-surface p-5 shadow-soft">
<h2 className="text-sm font-semibold text-text">Factuur verwijderen</h2>
<p className="mt-2 text-xs text-muted">
  Weet je zeker dat je factuur{' '}
  <span className="font-mono text-text">
{invoiceLabel(deleteTarget)}
  </span>{' '}
  voor <span className="font-medium text-text">{deleteTarget.customer_name}</span> wilt
  verwijderen?
</p>
<p className="mt-1 text-[11px] text-muted">Enter = bevestigen, Esc = annuleren.</p>
<div className="mt-4 flex items-center justify-end gap-2 text-xs">
  <button
type="button"
onClick={() => setDeleteTarget(null)}
className="rounded-full border border-border px-4 py-2 text-text hover:bg-surface-offset"
  >
Annuleren
  </button>
  <button
type="button"
onClick={handleDeleteConfirm}
className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-100"
  >
Ja, verwijderen
  </button>
</div>
  </div>
</div>
  )}
</div>
  );
}
