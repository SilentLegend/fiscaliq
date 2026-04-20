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
  dueDate: string;
  paymentTermDays: string;
  lines: InvoiceLineForm[];
}

interface InvoiceRow {
  id: string;
  customer_name: string;
  issue_date: string;
  due_date: string | null;
  amount_excl: number;
  vat_rate: number;
  amount_incl: number;
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
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InvoiceForm>({
***REMOVED***customerId: '',
***REMOVED***customerName: '',
***REMOVED***vatRate: '21',
***REMOVED***dueDate: '',
***REMOVED***paymentTermDays: '30',
***REMOVED***lines: [{ description: '', quantity: '1', unitPrice: '' }],
  });

  useEffect(() => {
***REMOVED***async function loadData() {
***REMOVED***  setLoading(true);

***REMOVED***  const [invRes, custRes, compRes] = await Promise.all([
***REMOVED******REMOVED***supabase.from('invoices').select('*').order('issue_date', { ascending: false }),
***REMOVED******REMOVED***supabase.from('customers').select('*').order('name', { ascending: true }),
***REMOVED******REMOVED***supabase.from('company_settings').select('*').single(),
***REMOVED***  ]);

***REMOVED***  if (invRes.error) {
***REMOVED******REMOVED***setError('Kon facturen niet ophalen.');
***REMOVED******REMOVED***setLoading(false);
***REMOVED******REMOVED***return;
***REMOVED***  }

***REMOVED***  const invoicesTyped = (invRes.data as InvoiceRow[]) ?? [];
***REMOVED***  setInvoices(invoicesTyped);

***REMOVED***  if (!custRes.error && custRes.data) {
***REMOVED******REMOVED***setCustomers(custRes.data as Customer[]);
***REMOVED***  }

***REMOVED***  if (!compRes.error && compRes.data) {
***REMOVED******REMOVED***const d = compRes.data as any;
***REMOVED******REMOVED***setCompanySettings({
***REMOVED******REMOVED***  company_name: d.company_name ?? '',
***REMOVED******REMOVED***  street: d.street ?? null,
***REMOVED******REMOVED***  postal_code: d.postal_code ?? null,
***REMOVED******REMOVED***  city: d.city ?? null,
***REMOVED******REMOVED***  kvk: d.kvk ?? null,
***REMOVED******REMOVED***  vat_number: d.vat_number ?? null,
***REMOVED******REMOVED***  iban: d.iban ?? null,
***REMOVED******REMOVED***  email: d.email ?? null,
***REMOVED******REMOVED***  website: d.website ?? null,
***REMOVED******REMOVED***});
***REMOVED***  }

***REMOVED***  if (invoicesTyped.length > 0) {
***REMOVED******REMOVED***const ids = invoicesTyped.map((i) => i.id);
***REMOVED******REMOVED***const { data: lineData, error: lineError } = await supabase
***REMOVED******REMOVED***  .from('invoice_lines')
***REMOVED******REMOVED***  .select('*')
***REMOVED******REMOVED***  .in('invoice_id', ids);

***REMOVED******REMOVED***if (!lineError && lineData) {
***REMOVED******REMOVED***  const grouped: Record<string, InvoiceLineRow[]> = {};
***REMOVED******REMOVED***  (lineData as InvoiceLineRow[]).forEach((l) => {
***REMOVED******REMOVED******REMOVED***if (!grouped[l.invoice_id]) grouped[l.invoice_id] = [];
***REMOVED******REMOVED******REMOVED***grouped[l.invoice_id].push(l);
***REMOVED******REMOVED***  });
***REMOVED******REMOVED***  setLinesByInvoice(grouped);
***REMOVED******REMOVED***}
***REMOVED***  }

***REMOVED***  setLoading(false);
***REMOVED***}
***REMOVED***loadData();
  }, []);

  const formTotals = useMemo(() => {
***REMOVED***let totalExcl = 0;
***REMOVED***form.lines.forEach((line) => {
***REMOVED***  const q = Number(line.quantity.replace(',', '.')) || 0;
***REMOVED***  const p = Number(line.unitPrice.replace(',', '.')) || 0;
***REMOVED***  totalExcl += q * p;
***REMOVED***});
***REMOVED***const vat = Number(form.vatRate) || 0;
***REMOVED***const totalIncl = totalExcl * (1 + vat / 100);
***REMOVED***return { totalExcl, totalIncl, vat };
  }, [form.lines, form.vatRate]);

  function formatDateNl(value: string | null | undefined): string {
***REMOVED***if (!value) return '-';
***REMOVED***const d = new Date(value);
***REMOVED***if (Number.isNaN(d.getTime())) return '-';
***REMOVED***return d.toLocaleDateString('nl-NL');
  }

  function formatCurrencyNl(value: number): string {
***REMOVED***return `€ ${value.toFixed(2).replace('.', ',')}`;
  }

  const effectiveDueDate = useMemo(() => {
***REMOVED***if (form.dueDate) return form.dueDate;
***REMOVED***const d = new Date();
***REMOVED***d.setDate(d.getDate() + (Number(form.paymentTermDays) || 30));
***REMOVED***return d.toISOString().slice(0, 10);
  }, [form.dueDate, form.paymentTermDays]);

  function resetForm() {
***REMOVED***setEditingId(null);
***REMOVED***setForm({
***REMOVED***  customerId: '',
***REMOVED***  customerName: '',
***REMOVED***  vatRate: '21',
***REMOVED***  dueDate: '',
***REMOVED***  paymentTermDays: '30',
***REMOVED***  lines: [{ description: '', quantity: '1', unitPrice: '' }],
***REMOVED***});
  }

  function addLine() {
***REMOVED***setForm((f) => ({
***REMOVED***  ...f,
***REMOVED***  lines: [...f.lines, { description: '', quantity: '1', unitPrice: '' }],
***REMOVED***}));
  }

  function removeLine(index: number) {
***REMOVED***setForm((f) => ({
***REMOVED***  ...f,
***REMOVED***  lines: f.lines.filter((_, i) => i !== index),
***REMOVED***}));
  }

  function statusLabel(inv: InvoiceRow): string {
***REMOVED***if (!inv.due_date) return 'Zonder vervaldatum';
***REMOVED***const today = new Date();
***REMOVED***const due = new Date(inv.due_date);
***REMOVED***const diffMs = due.getTime() - new Date(today.toDateString()).getTime();
***REMOVED***const days = Math.round(diffMs / (1000 * 60 * 60 * 24));
***REMOVED***if (days > 0) return `Verloopt over ${days} dagen`;
***REMOVED***if (days === 0) return 'Vervalt vandaag';
***REMOVED***return `Achterstallig ${Math.abs(days)} dagen`;
  }

  async function handleSubmit(e: React.FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setError(null);
***REMOVED***setSaving(true);

***REMOVED***if (form.lines.length === 0) {
***REMOVED***  setError('Voeg minimaal één regel toe.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const maxAmount = 9999999999.99; // numeric(12,2)
***REMOVED***let totalExclLocal = 0;
***REMOVED***const parsedLines = form.lines.map((line) => {
***REMOVED***  const quantity = Number(line.quantity.replace(',', '.')) || 0;
***REMOVED***  const unitPrice = Number(line.unitPrice.replace(',', '.')) || 0;
***REMOVED***  const amount = quantity * unitPrice;
***REMOVED***  return { line, quantity, unitPrice, amount };
***REMOVED***});

***REMOVED***for (const { quantity, unitPrice, amount } of parsedLines) {
***REMOVED***  if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) {
***REMOVED******REMOVED***setError('Gebruik alleen geldige getallen voor aantal en prijs.');
***REMOVED******REMOVED***setSaving(false);
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***  totalExclLocal += amount;
***REMOVED***  if (
***REMOVED******REMOVED***Math.abs(quantity) > maxAmount ||
***REMOVED******REMOVED***Math.abs(unitPrice) > maxAmount ||
***REMOVED******REMOVED***Math.abs(amount) > maxAmount ||
***REMOVED******REMOVED***Math.abs(totalExclLocal) > maxAmount
***REMOVED***  ) {
***REMOVED******REMOVED***setError('Bedragen zijn te groot om op te slaan. Verklein de bedragen.');
***REMOVED******REMOVED***setSaving(false);
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***}

***REMOVED***const vat = Number(form.vatRate) || 0;
***REMOVED***const totalInclLocal = totalExclLocal * (1 + vat / 100);

***REMOVED***const computedDueDate = effectiveDueDate;

***REMOVED***try {
***REMOVED***  if (!editingId) {
***REMOVED******REMOVED***const { data: inserted, error: invError } = await supabase
***REMOVED******REMOVED***  .from('invoices')
***REMOVED******REMOVED***  .insert({
***REMOVED******REMOVED******REMOVED***customer_name: form.customerName,
***REMOVED******REMOVED******REMOVED***amount_excl: totalExclLocal,
***REMOVED******REMOVED******REMOVED***vat_rate: vat,
***REMOVED******REMOVED******REMOVED***amount_incl: totalInclLocal,
***REMOVED******REMOVED******REMOVED***due_date: computedDueDate || null,
***REMOVED******REMOVED******REMOVED***status: 'concept',
***REMOVED******REMOVED***  })
***REMOVED******REMOVED***  .select('id')
***REMOVED******REMOVED***  .single();

***REMOVED******REMOVED***if (invError || !inserted) {
***REMOVED******REMOVED***  setError('Kon factuur niet opslaan.');
***REMOVED******REMOVED***  setSaving(false);
***REMOVED******REMOVED***  return;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***const invoiceId = inserted.id as string;

***REMOVED******REMOVED***const payloadWithInvoice = parsedLines.map(({ line, quantity, unitPrice, amount }) => ({
***REMOVED******REMOVED***  invoice_id: invoiceId,
***REMOVED******REMOVED***  description: line.description,
***REMOVED******REMOVED***  quantity,
***REMOVED******REMOVED***  unit_price: unitPrice,
***REMOVED******REMOVED***  amount_excl: amount,
***REMOVED******REMOVED***}));

***REMOVED******REMOVED***if (payloadWithInvoice.length > 0) {
***REMOVED******REMOVED***  const { error: lineError } = await supabase
***REMOVED******REMOVED******REMOVED***.from('invoice_lines')
***REMOVED******REMOVED******REMOVED***.insert(payloadWithInvoice);
***REMOVED******REMOVED***  if (lineError) {
***REMOVED******REMOVED******REMOVED***console.error('Kon factuurregels niet opslaan, factuur wordt verwijderd:', lineError);
***REMOVED******REMOVED******REMOVED***await supabase.from('invoices').delete().eq('id', invoiceId);
***REMOVED******REMOVED******REMOVED***setError('Factuurregels konden niet worden opgeslagen. De factuur is niet bewaard.');
***REMOVED******REMOVED******REMOVED***setSaving(false);
***REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED***  }
***REMOVED******REMOVED***}
***REMOVED***  } else {
***REMOVED******REMOVED***const { error: invError } = await supabase
***REMOVED******REMOVED***  .from('invoices')
***REMOVED******REMOVED***  .update({
***REMOVED******REMOVED******REMOVED***customer_name: form.customerName,
***REMOVED******REMOVED******REMOVED***amount_excl: totalExclLocal,
***REMOVED******REMOVED******REMOVED***vat_rate: vat,
***REMOVED******REMOVED******REMOVED***amount_incl: totalInclLocal,
***REMOVED******REMOVED******REMOVED***due_date: computedDueDate || null,
***REMOVED******REMOVED***  })
***REMOVED******REMOVED***  .eq('id', editingId);
***REMOVED******REMOVED***if (invError) {
***REMOVED******REMOVED***  setError('Kon factuur niet bijwerken.');
***REMOVED******REMOVED***  setSaving(false);
***REMOVED******REMOVED***  return;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***await supabase.from('invoice_lines').delete().eq('invoice_id', editingId);

***REMOVED******REMOVED***const payloadWithInvoice = parsedLines.map(({ line, quantity, unitPrice, amount }) => ({
***REMOVED******REMOVED***  invoice_id: editingId,
***REMOVED******REMOVED***  description: line.description,
***REMOVED******REMOVED***  quantity,
***REMOVED******REMOVED***  unit_price: unitPrice,
***REMOVED******REMOVED***  amount_excl: amount,
***REMOVED******REMOVED***}));

***REMOVED******REMOVED***if (payloadWithInvoice.length > 0) {
***REMOVED******REMOVED***  const { error: lineError } = await supabase
***REMOVED******REMOVED******REMOVED***.from('invoice_lines')
***REMOVED******REMOVED******REMOVED***.insert(payloadWithInvoice);
***REMOVED******REMOVED***  if (lineError) {
***REMOVED******REMOVED******REMOVED***console.error('Kon factuurregels niet opslaan bij bijwerken:', lineError);
***REMOVED******REMOVED******REMOVED***setError('Factuur is bijgewerkt, maar regels konden niet worden opgeslagen.');
***REMOVED******REMOVED***  }
***REMOVED******REMOVED***}
***REMOVED***  }

***REMOVED***  const { data: invData } = await supabase
***REMOVED******REMOVED***.from('invoices')
***REMOVED******REMOVED***.select('*')
***REMOVED******REMOVED***.order('issue_date', { ascending: false });
***REMOVED***  const invoicesTyped = (invData as InvoiceRow[]) ?? [];
***REMOVED***  setInvoices(invoicesTyped);

***REMOVED***  if (invoicesTyped.length > 0) {
***REMOVED******REMOVED***const ids = invoicesTyped.map((i) => i.id);
***REMOVED******REMOVED***const { data: lineData, error: lineError } = await supabase
***REMOVED******REMOVED***  .from('invoice_lines')
***REMOVED******REMOVED***  .select('*')
***REMOVED******REMOVED***  .in('invoice_id', ids);
***REMOVED******REMOVED***if (!lineError && lineData) {
***REMOVED******REMOVED***  const grouped: Record<string, InvoiceLineRow[]> = {};
***REMOVED******REMOVED***  (lineData as InvoiceLineRow[]).forEach((l) => {
***REMOVED******REMOVED******REMOVED***if (!grouped[l.invoice_id]) grouped[l.invoice_id] = [];
***REMOVED******REMOVED******REMOVED***grouped[l.invoice_id].push(l);
***REMOVED******REMOVED***  });
***REMOVED******REMOVED***  setLinesByInvoice(grouped);
***REMOVED******REMOVED***}
***REMOVED***  }

***REMOVED***  resetForm();
***REMOVED***  setShowForm(false);
***REMOVED***} catch (err) {
***REMOVED***  console.error(err);
***REMOVED***  setError('Er ging iets mis bij het opslaan. Probeer het opnieuw.');
***REMOVED***}

***REMOVED***setSaving(false);
  }

  async function startEdit(inv: InvoiceRow) {
***REMOVED***let lines: InvoiceLineRow[] = [];
***REMOVED***const { data: lineData, error: lineError } = await supabase
***REMOVED***  .from('invoice_lines')
***REMOVED***  .select('*')
***REMOVED***  .eq('invoice_id', inv.id);

***REMOVED***if (!lineError && lineData) {
***REMOVED***  lines = lineData as InvoiceLineRow[];
***REMOVED***  setLinesByInvoice((prev) => ({ ...prev, [inv.id]: lines }));
***REMOVED***}

***REMOVED***let paymentTermDays = '30';
***REMOVED***if (inv.issue_date && inv.due_date) {
***REMOVED***  const issue = new Date(inv.issue_date);
***REMOVED***  const due = new Date(inv.due_date);
***REMOVED***  if (!Number.isNaN(issue.getTime()) && !Number.isNaN(due.getTime())) {
***REMOVED******REMOVED***const diffMs = due.getTime() - issue.getTime();
***REMOVED******REMOVED***const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
***REMOVED******REMOVED***if (diffDays === 30 || diffDays === 60 || diffDays === 90) {
***REMOVED******REMOVED***  paymentTermDays = String(diffDays);
***REMOVED******REMOVED***}
***REMOVED***  }
***REMOVED***}

***REMOVED***setEditingId(inv.id);
***REMOVED***setForm({
***REMOVED***  customerId: '',
***REMOVED***  customerName: inv.customer_name,
***REMOVED***  vatRate: String(inv.vat_rate),
***REMOVED***  dueDate: inv.due_date ?? '',
***REMOVED***  paymentTermDays,
***REMOVED***  lines:
***REMOVED******REMOVED***lines.length > 0
***REMOVED******REMOVED***  ? lines.map((l) => ({
***REMOVED******REMOVED******REMOVED***  description: l.description,
***REMOVED******REMOVED******REMOVED***  quantity: String(l.quantity),
***REMOVED******REMOVED******REMOVED***  unitPrice: String(l.unit_price),
***REMOVED******REMOVED******REMOVED***}))
***REMOVED******REMOVED***  : [{ description: '', quantity: '1', unitPrice: '' }],
***REMOVED***});
***REMOVED***setShowForm(true);
  }

  async function handleDeleteConfirm() {
***REMOVED***if (!deleteTarget) return;
***REMOVED***const target = deleteTarget;
***REMOVED***setDeleteTarget(null);
***REMOVED***await supabase.from('invoices').delete().eq('id', target.id);
***REMOVED***setInvoices((prev) => prev.filter((i) => i.id !== target.id));
***REMOVED***setLinesByInvoice((prev) => {
***REMOVED***  const copy = { ...prev };
***REMOVED***  delete copy[target.id];
***REMOVED***  return copy;
***REMOVED***});
  }

  function handleDownloadPdf(inv: InvoiceRow) {
***REMOVED***const lines = linesByInvoice[inv.id] ?? [];
***REMOVED***const doc = new jsPDF();
***REMOVED***const pageHeight = doc.internal.pageSize.getHeight();

***REMOVED***const leftX = 20;
***REMOVED***const rightX = 125;
***REMOVED***const contentRight = 190;
***REMOVED***let cursorY = 24;

***REMOVED***const customer = customers.find((c) => c.name === inv.customer_name);

***REMOVED***const issueDateText = formatDateNl(inv.issue_date);
***REMOVED***const dueDateText = formatDateNl(inv.due_date);

***REMOVED***const issueDate = inv.issue_date ? new Date(inv.issue_date) : null;
***REMOVED***const dueDate = inv.due_date ? new Date(inv.due_date) : null;

***REMOVED***let paymentTermDaysNumeric = 30;
***REMOVED***if (issueDate && dueDate && !Number.isNaN(issueDate.getTime()) && !Number.isNaN(dueDate.getTime())) {
***REMOVED***  const diffMs = dueDate.getTime() - issueDate.getTime();
***REMOVED***  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
***REMOVED***  if (diffDays === 30 || diffDays === 60 || diffDays === 90) {
***REMOVED******REMOVED***paymentTermDaysNumeric = diffDays;
***REMOVED***  }
***REMOVED***}

***REMOVED***const drawLabelValue = (label: string, value: string, y: number) => {
***REMOVED***  doc.setFont('helvetica', 'normal');
***REMOVED***  doc.text(label, leftX, y);
***REMOVED***  doc.text(`: ${value}`, leftX + 36, y);
***REMOVED***};

***REMOVED***const drawRightAligned = (text: string, x: number, y: number) => {
***REMOVED***  doc.text(text, x, y, { align: 'right' });
***REMOVED***};

***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***doc.setFontSize(11);

***REMOVED***// Bedrijf linksboven
***REMOVED***if (companySettings) {
***REMOVED***  doc.text(companySettings.company_name || '-', leftX, cursorY);
***REMOVED***  cursorY += 10;

***REMOVED***  if (companySettings.street) {
***REMOVED******REMOVED***doc.text(companySettings.street, leftX, cursorY);
***REMOVED******REMOVED***cursorY += 6;
***REMOVED***  }

***REMOVED***  const companyCityLine = `${companySettings.postal_code ?? ''} ${companySettings.city ?? ''}`.trim();
***REMOVED***  if (companyCityLine) {
***REMOVED******REMOVED***doc.text(companyCityLine, leftX, cursorY);
***REMOVED******REMOVED***cursorY += 6;
***REMOVED***  }

***REMOVED***  doc.setDrawColor(190);
***REMOVED***  doc.line(leftX, cursorY, 82, cursorY);
***REMOVED***}

***REMOVED***// Klant rechtsboven
***REMOVED***let rightCursorY = 24;
***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text(customer?.name || inv.customer_name || '-', rightX, rightCursorY);
***REMOVED***rightCursorY += 8;

***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***if (customer?.street) {
***REMOVED***  doc.text(customer.street, rightX, rightCursorY);
***REMOVED***  rightCursorY += 6;
***REMOVED***}

***REMOVED***const customerCityLine = `${customer?.postal_code ?? ''} ${customer?.city ?? ''}`.trim();
***REMOVED***if (customerCityLine) {
***REMOVED***  doc.text(customerCityLine, rightX, rightCursorY);
***REMOVED***  rightCursorY += 10;
***REMOVED***}

***REMOVED***if (customer?.kvk) {
***REMOVED***  doc.text(`KvK-nummer: ${customer.kvk}`, rightX, rightCursorY);
***REMOVED***  rightCursorY += 6;
***REMOVED***}

***REMOVED***if (customer?.vat_number) {
***REMOVED***  doc.text(`BTW-id: ${customer.vat_number}`, rightX, rightCursorY);
***REMOVED***  rightCursorY += 6;
***REMOVED***}

***REMOVED***doc.setDrawColor(190);
***REMOVED***doc.line(rightX, rightCursorY + 2, contentRight, rightCursorY + 2);

***REMOVED***// Titelblok
***REMOVED***cursorY = 92;
***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***doc.setFontSize(22);
***REMOVED***doc.text('Factuur', leftX, cursorY);

***REMOVED***doc.setDrawColor(190);
***REMOVED***doc.line(leftX, cursorY + 4, contentRight, cursorY + 4);

***REMOVED***cursorY += 14;
***REMOVED***doc.setFontSize(11);
***REMOVED***drawLabelValue('Factuurnummer', inv.id.slice(0, 8).toUpperCase(), cursorY);
***REMOVED***cursorY += 7;
***REMOVED***drawLabelValue('Factuurdatum', issueDateText, cursorY);
***REMOVED***cursorY += 7;
***REMOVED***drawLabelValue('Vervaldatum', dueDateText, cursorY);

***REMOVED***// Tabelkop
***REMOVED***cursorY += 14;
***REMOVED***const colDesc = leftX;
***REMOVED***const colQty = 118;
***REMOVED***const colAmount = 146;
***REMOVED***const colVat = 162;
***REMOVED***const colTotal = 189;

***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text('Omschrijving', colDesc, cursorY);
***REMOVED***drawRightAligned('Aantal', colQty, cursorY);
***REMOVED***drawRightAligned('Bedrag', colAmount, cursorY);
***REMOVED***drawRightAligned('BTW', colVat, cursorY);
***REMOVED***drawRightAligned('Totaal', colTotal, cursorY);

***REMOVED***cursorY += 5;
***REMOVED***doc.setDrawColor(120);
***REMOVED***doc.line(leftX, cursorY, contentRight, cursorY);

***REMOVED***// Regels
***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***const vatMultiplier = 1 + (inv.vat_rate ?? 0) / 100;

***REMOVED***lines.forEach((line) => {
***REMOVED***  cursorY += 8;

***REMOVED***  if (cursorY > 235) {
***REMOVED******REMOVED***doc.addPage();
***REMOVED******REMOVED***cursorY = 20;

***REMOVED******REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED******REMOVED***doc.text('Omschrijving', colDesc, cursorY);
***REMOVED******REMOVED***drawRightAligned('Aantal', colQty, cursorY);
***REMOVED******REMOVED***drawRightAligned('Bedrag', colAmount, cursorY);
***REMOVED******REMOVED***drawRightAligned('BTW', colVat, cursorY);
***REMOVED******REMOVED***drawRightAligned('Totaal', colTotal, cursorY);

***REMOVED******REMOVED***cursorY += 5;
***REMOVED******REMOVED***doc.setDrawColor(120);
***REMOVED******REMOVED***doc.line(leftX, cursorY, contentRight, cursorY);
***REMOVED******REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED******REMOVED***cursorY += 3;
***REMOVED***  }

***REMOVED***  const descriptionLines = doc.splitTextToSize(line.description || '-', 92);
***REMOVED***  const lineVatRate = `${(inv.vat_rate ?? 0).toFixed(0)}%`;
***REMOVED***  const lineTotal = line.amount_excl * vatMultiplier;
***REMOVED***  const startY = cursorY;

***REMOVED***  doc.text(descriptionLines, colDesc, startY);
***REMOVED***  drawRightAligned(String(line.quantity), colQty, startY);
***REMOVED***  drawRightAligned(formatCurrencyNl(line.amount_excl), colAmount, startY);
***REMOVED***  drawRightAligned(lineVatRate, colVat, startY);
***REMOVED***  drawRightAligned(formatCurrencyNl(lineTotal), colTotal, startY);

***REMOVED***  cursorY = startY + descriptionLines.length * 6;
***REMOVED***  doc.setDrawColor(220);
***REMOVED***  doc.line(leftX, cursorY, contentRight, cursorY);
***REMOVED***});

***REMOVED***// Totalen
***REMOVED***const totalExcl = inv.amount_excl ?? 0;
***REMOVED***const vatAmount = (inv.amount_incl ?? 0) - totalExcl;
***REMOVED***const totalIncl = inv.amount_incl ?? 0;

***REMOVED***cursorY += 10;
***REMOVED***const totalsLabelX = 116;
***REMOVED***const totalsValueX = 189;

***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text('Totaal exclusief BTW:', totalsLabelX, cursorY);
***REMOVED***drawRightAligned(formatCurrencyNl(totalExcl), totalsValueX, cursorY);

***REMOVED***cursorY += 8;
***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***doc.text(`BTW (${(inv.vat_rate ?? 0).toFixed(0)}%):`, totalsLabelX, cursorY);
***REMOVED***drawRightAligned(formatCurrencyNl(vatAmount), totalsValueX, cursorY);

***REMOVED***cursorY += 8;
***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text('Totaal:', totalsLabelX, cursorY);
***REMOVED***drawRightAligned(formatCurrencyNl(totalIncl), totalsValueX, cursorY);

***REMOVED***doc.setDrawColor(150);
***REMOVED***doc.line(totalsLabelX, cursorY + 2, totalsValueX, cursorY + 2);

***REMOVED***// Onderste vakken
***REMOVED***const boxY = pageHeight - 52;
***REMOVED***const boxH = 18;
***REMOVED***const boxW = 58;
***REMOVED***const gap = 6;
***REMOVED***const box1X = 24;
***REMOVED***const box2X = box1X + boxW + gap;
***REMOVED***const box3X = box2X + boxW + gap;

***REMOVED***doc.setDrawColor(80);
***REMOVED***doc.rect(box1X, boxY, boxW, boxH);
***REMOVED***doc.rect(box2X, boxY, boxW, boxH);
***REMOVED***doc.rect(box3X, boxY, boxW, boxH);

***REMOVED***doc.setFontSize(9);
***REMOVED***doc.setFont('helvetica', 'normal');

***REMOVED***doc.text('IBAN-nummer', box1X + boxW / 2, boxY + 7, { align: 'center' });
***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text(companySettings?.iban || '-', box1X + boxW / 2, boxY + 13, { align: 'center' });

***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***doc.text('Factuurnummer', box2X + boxW / 2, boxY + 7, { align: 'center' });
***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text(inv.id.slice(0, 8).toUpperCase(), box2X + boxW / 2, boxY + 13, { align: 'center' });

***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***doc.text('Factuurbedrag', box3X + boxW / 2, boxY + 7, { align: 'center' });
***REMOVED***doc.setFont('helvetica', 'bold');
***REMOVED***doc.text(formatCurrencyNl(totalIncl), box3X + boxW / 2, boxY + 13, { align: 'center' });

***REMOVED***// Betaaltekst
***REMOVED***const paymentText = `Het openstaande bedrag van ${formatCurrencyNl(
***REMOVED***  totalIncl,
***REMOVED***)} dient binnen ${paymentTermDaysNumeric} dagen overgemaakt te zijn op rekeningnummer ${
***REMOVED***  companySettings?.iban || '-'
***REMOVED***} onder vermelding van het factuurnummer ${inv.id.slice(0, 8).toUpperCase()}.`;

***REMOVED***doc.setFontSize(10);
***REMOVED***doc.setFont('helvetica', 'normal');
***REMOVED***const paymentLines = doc.splitTextToSize(paymentText, 165);
***REMOVED***doc.text(paymentLines, 24, pageHeight - 18);

***REMOVED***doc.save(`factuur-${inv.id.slice(0, 8)}.pdf`);
  }

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <div className="flex flex-wrap items-center justify-between gap-3">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-lg font-semibold tracking-tight text-text">Facturen</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***Overzicht van je verstuurde en conceptfacturen.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button
***REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED***  onClick={() => {
***REMOVED******REMOVED******REMOVED***resetForm();
***REMOVED******REMOVED******REMOVED***setShowForm(true);
***REMOVED******REMOVED***  }}
***REMOVED******REMOVED***  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
***REMOVED******REMOVED***>
***REMOVED******REMOVED***  <span className="text-base leading-none">＋</span>
***REMOVED******REMOVED***  Nieuwe factuur
***REMOVED******REMOVED***</button>
***REMOVED***  </div>

***REMOVED***  {error && (
***REMOVED******REMOVED***<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED***  {error}
***REMOVED******REMOVED***</div>
***REMOVED***  )}

***REMOVED***  <div className="overflow-hidden rounded-2xl border border-border bg-surface">
***REMOVED******REMOVED***<table className="min-w-full text-left text-sm">
***REMOVED******REMOVED***  <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
***REMOVED******REMOVED******REMOVED***<tr>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3">Factuur</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3">Klant</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3">Datum</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3">Vervaldatum</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3 text-right">Totaal (incl. btw)</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3">Status</th>
***REMOVED******REMOVED******REMOVED***  <th className="px-4 py-3 text-right">Acties</th>
***REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED***  </thead>
***REMOVED******REMOVED***  <tbody>
***REMOVED******REMOVED******REMOVED***{loading ? (
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-6 text-center text-xs text-muted" colSpan={7}>
***REMOVED******REMOVED******REMOVED******REMOVED***  Facturen laden…
***REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***) : invoices.length === 0 ? (
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-6 text-center text-xs text-muted" colSpan={7}>
***REMOVED******REMOVED******REMOVED******REMOVED***  Nog geen facturen. Maak je eerste factuur aan om te beginnen.
***REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***) : (
***REMOVED******REMOVED******REMOVED***  invoices.map((inv) => (
***REMOVED******REMOVED******REMOVED******REMOVED***<tr key={inv.id} className="border-t border-border/60 align-top">
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{inv.id.slice(0, 8).toUpperCase()}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-text">{inv.customer_name}</td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{formatDateNl(inv.issue_date)}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{formatDateNl(inv.due_date)}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-right text-xs text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{formatCurrencyNl(inv.amount_incl)}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="inline-flex rounded-full bg-surface-offset px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {statusLabel(inv)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-right text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => startEdit(inv)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[10px] text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  aria-label="Factuur bewerken"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <svg
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-hidden
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***viewBox="0 0 24 24"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-3.5 w-3.5 stroke-current"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***fill="none"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***strokeWidth={1.8}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M5 19h3.2L19 8.2 15.8 5 5 15.8V19z" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M14.2 5 19 9.8" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </svg>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => handleDownloadPdf(inv)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[10px] text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  aria-label="Factuur downloaden als PDF"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <svg
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-hidden
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***viewBox="0 0 24 24"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-3.5 w-3.5 stroke-current"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***fill="none"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***strokeWidth={1.8}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M12 3v14" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M8 13l4 4 4-4" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M5 19h14" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </svg>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => setDeleteTarget(inv)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-rose-200 text-[10px] text-rose-700 hover:bg-rose-50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  aria-label="Factuur verwijderen"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <svg
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-hidden
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***viewBox="0 0 24 24"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-3.5 w-3.5 stroke-current"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***fill="none"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***strokeWidth={1.8}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M9 4h6" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M5 7h14" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M8 7v11a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M10 10v6" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<path d="M14 10v6" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </svg>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED******REMOVED***  ))
***REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED***  </tbody>
***REMOVED******REMOVED***</table>
***REMOVED***  </div>

***REMOVED***  {showForm && (
***REMOVED******REMOVED***<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6">
***REMOVED******REMOVED***  <div className="w-full max-w-2xl rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft">
***REMOVED******REMOVED******REMOVED***<div className="mb-4 flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-sm font-semibold text-text">
***REMOVED******REMOVED******REMOVED******REMOVED***  {editingId ? 'Factuur bewerken' : 'Nieuwe factuur'}
***REMOVED******REMOVED******REMOVED******REMOVED***</h2>
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-xs text-muted">Kies een klant en vul de regels in.</p>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => {
***REMOVED******REMOVED******REMOVED******REMOVED***  setShowForm(false);
***REMOVED******REMOVED******REMOVED******REMOVED***  resetForm();
***REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***✕
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<form onSubmit={handleSubmit} className="space-y-4 text-sm">
***REMOVED******REMOVED******REMOVED***  <div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="customerId">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Klant
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="customerId"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.customerId}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  const id = e.target.value;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  const found = customers.find((c) => c.id === id);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  setForm((f) => ({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***...f,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***customerId: id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***customerName: found ? found.name : '',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<option value="">Klant kiezen of zelf invullen…</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{customers.map((c) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option key={c.id} value={c.id}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{c.name}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED******REMOVED***  </select>
***REMOVED******REMOVED******REMOVED******REMOVED***  <p className="mt-1 text-[10px] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Staat je klant er nog niet tussen? Vul hieronder een naam in, later komt er een klantenbeheer.
***REMOVED******REMOVED******REMOVED******REMOVED***  </p>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="md:col-span-1">
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="customerName">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Klantnaam (op factuur)
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="customerName"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.customerName}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="vatRate">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Btw-tarief (%)
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="vatRate"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="number"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***min={0}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***max={21}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***step={1}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.vatRate}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, vatRate: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="dueDate">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Vervaldatum
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="dueDate"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="date"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.dueDate}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***  {!form.dueDate && (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p className="mt-1 text-[10px] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Automatisch op basis van termijn: {formatDateNl(effectiveDueDate)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED***  )}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="paymentTermDays">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Betalingstermijn
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="paymentTermDays"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.paymentTermDays}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, paymentTermDays: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<option value="30">30 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<option value="60">60 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<option value="90">90 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED***  </select>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="mt-2 space-y-3 rounded-2xl border border-border bg-surface-2 p-3">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-xs font-medium text-text">Regels</span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="max-h-64 space-y-2 overflow-y-auto pr-1">
***REMOVED******REMOVED******REMOVED******REMOVED***  {form.lines.map((line, index) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  key={index}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="grid gap-2 rounded-2xl bg-surface px-3 py-2 text-xs md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="md:col-span-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-[11px] font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Omschrijving
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={line.description}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const value = e.target.value;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setForm((f) => ({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ...f,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  lines: f.lines.map((l, i) =>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, description: value } : l,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-[11px] font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Aantal
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  inputMode="decimal"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={line.quantity}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const value = e.target.value;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setForm((f) => ({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ...f,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  lines: f.lines.map((l, i) =>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, quantity: value } : l,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-[11px] font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Prijs per stuk
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  inputMode="decimal"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={line.unitPrice}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const value = e.target.value;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setForm((f) => ({
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ...f,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  lines: f.lines.map((l, i) =>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, unitPrice: value } : l,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}));
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-8 w-full rounded-2xl border border-border bg-bg px-2 text-[11px] outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="flex items-center justify-between md:flex-col md:items-end">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-[11px] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  €{' '}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {(() => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const q = Number(line.quantity.replace(',', '.')) || 0;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const p = Number(line.unitPrice.replace(',', '.')) || 0;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return (q * p).toFixed(2);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  })()}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{form.lines.length > 1 && (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => removeLine(index)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 text-[10px] text-rose-700 hover:underline"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Verwijderen
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***  onClick={addLine}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 inline-flex w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-3 py-2 text-[11px] font-medium text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  + Regel toevoegen
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex flex-col items-end gap-1 text-[11px] text-muted md:flex-row md:justify-end md:gap-4">
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="flex min-w-[260px] items-center justify-between whitespace-nowrap">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>Subtotaal:</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="font-mono font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  € {formTotals.totalExcl.toFixed(2)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="flex min-w-[260px] items-center justify-between whitespace-nowrap">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>Totaal incl. btw:</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="font-mono font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  € {formTotals.totalIncl.toFixed(2)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="mt-2 flex items-center justify-end gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setShowForm(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***resetForm();
***REMOVED******REMOVED******REMOVED******REMOVED***  }}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  Annuleren
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="submit"
***REMOVED******REMOVED******REMOVED******REMOVED***  disabled={saving}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  {saving ? 'Opslaan…' : editingId ? 'Wijzigingen opslaan' : 'Factuur opslaan'}
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</form>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}

***REMOVED***  {deleteTarget && (
***REMOVED******REMOVED***<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
***REMOVED******REMOVED***  <div className="w-full max-w-sm rounded-[1.6rem] border border-border bg-surface p-5 shadow-soft">
***REMOVED******REMOVED******REMOVED***<h2 className="text-sm font-semibold text-text">Factuur verwijderen</h2>
***REMOVED******REMOVED******REMOVED***<p className="mt-2 text-xs text-muted">
***REMOVED******REMOVED******REMOVED***  Weet je zeker dat je factuur{' '}
***REMOVED******REMOVED******REMOVED***  <span className="font-mono text-text">
***REMOVED******REMOVED******REMOVED******REMOVED***{deleteTarget.id.slice(0, 8).toUpperCase()}
***REMOVED******REMOVED******REMOVED***  </span>{' '}
***REMOVED******REMOVED******REMOVED***  voor <span className="font-medium text-text">{deleteTarget.customer_name}</span> wilt
***REMOVED******REMOVED******REMOVED***  verwijderen?
***REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED***<div className="mt-4 flex items-center justify-end gap-2 text-xs">
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setDeleteTarget(null)}
***REMOVED******REMOVED******REMOVED******REMOVED***className="rounded-full border border-border px-4 py-2 text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***Annuleren
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={handleDeleteConfirm}
***REMOVED******REMOVED******REMOVED******REMOVED***className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-100"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***Ja, verwijderen
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}
***REMOVED***</div>
  );
}
