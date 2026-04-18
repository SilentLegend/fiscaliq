'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface InvoiceLineForm {
  description: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceForm {
  customerName: string;
  vatRate: string;
  dueDate: string;
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

export default function FacturenPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [linesByInvoice, setLinesByInvoice] = useState<Record<string, InvoiceLineRow[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InvoiceForm>({
***REMOVED***customerName: '',
***REMOVED***vatRate: '21',
***REMOVED***dueDate: '',
***REMOVED***lines: [{ description: '', quantity: '1', unitPrice: '' }],
  });

  useEffect(() => {
***REMOVED***async function loadData() {
***REMOVED***  setLoading(true);
***REMOVED***  const { data: invData, error: invError } = await supabase
***REMOVED******REMOVED***.from('invoices')
***REMOVED******REMOVED***.select('*')
***REMOVED******REMOVED***.order('issue_date', { ascending: false });

***REMOVED***  if (invError) {
***REMOVED******REMOVED***setError('Kon facturen niet ophalen.');
***REMOVED******REMOVED***setLoading(false);
***REMOVED******REMOVED***return;
***REMOVED***  }

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

***REMOVED***  setLoading(false);
***REMOVED***}
***REMOVED***loadData();
  }, []);

  function resetForm() {
***REMOVED***setEditingId(null);
***REMOVED***setForm({
***REMOVED***  customerName: '',
***REMOVED***  vatRate: '21',
***REMOVED***  dueDate: '',
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

***REMOVED***const { totalExcl, totalIncl, vat } = formTotals;

***REMOVED***try {
***REMOVED***  if (!editingId) {
***REMOVED******REMOVED***const { data: inserted, error } = await supabase
***REMOVED******REMOVED***  .from('invoices')
***REMOVED******REMOVED***  .insert({
***REMOVED******REMOVED******REMOVED***customer_name: form.customerName,
***REMOVED******REMOVED******REMOVED***amount_excl: totalExcl,
***REMOVED******REMOVED******REMOVED***vat_rate: vat,
***REMOVED******REMOVED******REMOVED***amount_incl: totalIncl,
***REMOVED******REMOVED******REMOVED***due_date: form.dueDate || null,
***REMOVED******REMOVED******REMOVED***status: 'concept',
***REMOVED******REMOVED***  })
***REMOVED******REMOVED***  .select('id')
***REMOVED******REMOVED***  .single();

***REMOVED******REMOVED***if (error || !inserted) throw error;

***REMOVED******REMOVED***const invoiceId = inserted.id as string;

***REMOVED******REMOVED***const linePayload = form.lines.map((line) => {
***REMOVED******REMOVED***  const q = Number(line.quantity.replace(',', '.')) || 0;
***REMOVED******REMOVED***  const p = Number(line.unitPrice.replace(',', '.')) || 0;
***REMOVED******REMOVED***  return {
***REMOVED******REMOVED******REMOVED***invoice_id: invoiceId,
***REMOVED******REMOVED******REMOVED***description: line.description,
***REMOVED******REMOVED******REMOVED***quantity: q,
***REMOVED******REMOVED******REMOVED***unit_price: p,
***REMOVED******REMOVED******REMOVED***amount_excl: q * p,
***REMOVED******REMOVED***  };
***REMOVED******REMOVED***});

***REMOVED******REMOVED***const { error: lineError } = await supabase.from('invoice_lines').insert(linePayload);
***REMOVED******REMOVED***if (lineError) throw lineError;
***REMOVED***  } else {
***REMOVED******REMOVED***const { error } = await supabase
***REMOVED******REMOVED***  .from('invoices')
***REMOVED******REMOVED***  .update({
***REMOVED******REMOVED******REMOVED***customer_name: form.customerName,
***REMOVED******REMOVED******REMOVED***amount_excl: totalExcl,
***REMOVED******REMOVED******REMOVED***vat_rate: vat,
***REMOVED******REMOVED******REMOVED***amount_incl: totalIncl,
***REMOVED******REMOVED******REMOVED***due_date: form.dueDate || null,
***REMOVED******REMOVED***  })
***REMOVED******REMOVED***  .eq('id', editingId);
***REMOVED******REMOVED***if (error) throw error;

***REMOVED******REMOVED***// Delete oude regels en voeg nieuwe in
***REMOVED******REMOVED***await supabase.from('invoice_lines').delete().eq('invoice_id', editingId);

***REMOVED******REMOVED***const linePayload = form.lines.map((line) => {
***REMOVED******REMOVED***  const q = Number(line.quantity.replace(',', '.')) || 0;
***REMOVED******REMOVED***  const p = Number(line.unitPrice.replace(',', '.')) || 0;
***REMOVED******REMOVED***  return {
***REMOVED******REMOVED******REMOVED***invoice_id: editingId,
***REMOVED******REMOVED******REMOVED***description: line.description,
***REMOVED******REMOVED******REMOVED***quantity: q,
***REMOVED******REMOVED******REMOVED***unit_price: p,
***REMOVED******REMOVED******REMOVED***amount_excl: q * p,
***REMOVED******REMOVED***  };
***REMOVED******REMOVED***});
***REMOVED******REMOVED***const { error: lineError } = await supabase.from('invoice_lines').insert(linePayload);
***REMOVED******REMOVED***if (lineError) throw lineError;
***REMOVED***  }

***REMOVED***  // Refresh data
***REMOVED***  const { data: invData } = await supabase
***REMOVED******REMOVED***.from('invoices')
***REMOVED******REMOVED***.select('*')
***REMOVED******REMOVED***.order('issue_date', { ascending: false });
***REMOVED***  const invoicesTyped = (invData as InvoiceRow[]) ?? [];
***REMOVED***  setInvoices(invoicesTyped);

***REMOVED***  if (invoicesTyped.length > 0) {
***REMOVED******REMOVED***const ids = invoicesTyped.map((i) => i.id);
***REMOVED******REMOVED***const { data: lineData } = await supabase
***REMOVED******REMOVED***  .from('invoice_lines')
***REMOVED******REMOVED***  .select('*')
***REMOVED******REMOVED***  .in('invoice_id', ids);
***REMOVED******REMOVED***const grouped: Record<string, InvoiceLineRow[]> = {};
***REMOVED******REMOVED***(lineData as InvoiceLineRow[] | null)?.forEach((l) => {
***REMOVED******REMOVED***  if (!grouped[l.invoice_id]) grouped[l.invoice_id] = [];
***REMOVED******REMOVED***  grouped[l.invoice_id].push(l);
***REMOVED******REMOVED***});
***REMOVED******REMOVED***setLinesByInvoice(grouped);
***REMOVED***  }

***REMOVED***  resetForm();
***REMOVED***  setShowForm(false);
***REMOVED***} catch (err) {
***REMOVED***  setError('Kon factuur niet opslaan. Controleer je invoer.');
***REMOVED***}

***REMOVED***setSaving(false);
  }

  function startEdit(inv: InvoiceRow) {
***REMOVED***const lines = linesByInvoice[inv.id] ?? [];
***REMOVED***setEditingId(inv.id);
***REMOVED***setForm({
***REMOVED***  customerName: inv.customer_name,
***REMOVED***  vatRate: String(inv.vat_rate),
***REMOVED***  dueDate: inv.due_date ?? '',
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

  async function handleDelete(inv: InvoiceRow) {
***REMOVED***const ok = window.confirm('Weet je zeker dat je deze factuur wilt verwijderen?');
***REMOVED***if (!ok) return;
***REMOVED***await supabase.from('invoices').delete().eq('id', inv.id);
***REMOVED***setInvoices((prev) => prev.filter((i) => i.id !== inv.id));
***REMOVED***setLinesByInvoice((prev) => {
***REMOVED***  const copy = { ...prev };
***REMOVED***  delete copy[inv.id];
***REMOVED***  return copy;
***REMOVED***});
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{inv.issue_date?.slice(0, 10) || '-'}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{inv.due_date?.slice(0, 10) || '-'}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-right text-xs text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***€ {inv.amount_incl.toFixed(2)}
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="mr-2 rounded-full border border-border px-2 py-1 text-[10px] text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Bewerken
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => handleDelete(inv)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="rounded-full border border-rose-200 px-2 py-1 text-[10px] text-rose-700 hover:bg-rose-50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Verwijderen
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
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-xs text-muted">Vul de regels voor deze factuur in.</p>
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
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="md:col-span-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="customerName">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Klantnaam
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
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="mt-2 space-y-3 rounded-2xl border border-border bg-surface-2 p-3">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-xs font-medium text-text">Regels</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={addLine}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="text-[11px] font-medium text-primary hover:underline"
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***+ Regel toevoegen
***REMOVED******REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="space-y-2 max-h-64 overflow-y-auto pr-1">
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, description: value } : l
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, quantity: value } : l
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === index ? { ...l, unitPrice: value } : l
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
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-end gap-4 text-[11px] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  <span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Subtotaal: <span className="font-medium text-text">€ {formTotals.totalExcl.toFixed(2)}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED***  <span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Totaal incl. btw: <span className="font-medium text-text">€ {formTotals.totalIncl.toFixed(2)}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </span>
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
***REMOVED***</div>
  );
}
