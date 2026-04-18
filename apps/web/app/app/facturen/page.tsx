'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface InvoiceForm {
  customerName: string;
  description: string;
  amountExcl: string;
  vatRate: string;
  dueDate: string;
}

interface InvoiceRow {
  id: string;
  customer_name: string;
  description: string | null;
  issue_date: string;
  due_date: string | null;
  amount_excl: number;
  vat_rate: number;
  amount_incl: number;
  status: string;
}

export default function FacturenPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<InvoiceForm>({
***REMOVED***customerName: '',
***REMOVED***description: '',
***REMOVED***amountExcl: '',
***REMOVED***vatRate: '21',
***REMOVED***dueDate: '',
  });

  useEffect(() => {
***REMOVED***async function loadInvoices() {
***REMOVED***  setLoading(true);
***REMOVED***  const { data, error } = await supabase
***REMOVED******REMOVED***.from('invoices')
***REMOVED******REMOVED***.select('*')
***REMOVED******REMOVED***.order('issue_date', { ascending: false });
***REMOVED***  if (error) {
***REMOVED******REMOVED***setError('Kon facturen niet ophalen.');
***REMOVED***  } else {
***REMOVED******REMOVED***setInvoices((data as InvoiceRow[]) ?? []);
***REMOVED***  }
***REMOVED***  setLoading(false);
***REMOVED***}
***REMOVED***loadInvoices();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setError(null);
***REMOVED***setSaving(true);

***REMOVED***const amountExcl = Number(form.amountExcl.replace(',', '.'));
***REMOVED***const vatRate = Number(form.vatRate);
***REMOVED***if (Number.isNaN(amountExcl) || Number.isNaN(vatRate)) {
***REMOVED***  setError('Bedrag of btw-tarief is ongeldig.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const amountIncl = amountExcl * (1 + vatRate / 100);

***REMOVED***const { error } = await supabase.from('invoices').insert({
***REMOVED***  customer_name: form.customerName,
***REMOVED***  description: form.description,
***REMOVED***  amount_excl: amountExcl,
***REMOVED***  vat_rate: vatRate,
***REMOVED***  amount_incl: amountIncl,
***REMOVED***  due_date: form.dueDate || null,
***REMOVED***  status: 'concept',
***REMOVED***});

***REMOVED***if (error) {
***REMOVED***  setError('Kon factuur niet opslaan. Controleer je invoer.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***// Refresh lijst
***REMOVED***const { data } = await supabase
***REMOVED***  .from('invoices')
***REMOVED***  .select('*')
***REMOVED***  .order('issue_date', { ascending: false });
***REMOVED***setInvoices((data as InvoiceRow[]) ?? []);

***REMOVED***setForm({
***REMOVED***  customerName: '',
***REMOVED***  description: '',
***REMOVED***  amountExcl: '',
***REMOVED***  vatRate: '21',
***REMOVED***  dueDate: '',
***REMOVED***});
***REMOVED***setSaving(false);
***REMOVED***setShowForm(false);
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
***REMOVED******REMOVED***  onClick={() => setShowForm(true)}
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
***REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED***  </thead>
***REMOVED******REMOVED***  <tbody>
***REMOVED******REMOVED******REMOVED***{loading ? (
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-6 text-center text-xs text-muted" colSpan={6}>
***REMOVED******REMOVED******REMOVED******REMOVED***  Facturen laden…
***REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***) : invoices.length === 0 ? (
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-6 text-center text-xs text-muted" colSpan={6}>
***REMOVED******REMOVED******REMOVED******REMOVED***  Nog geen facturen. Maak je eerste factuur aan om te beginnen.
***REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***) : (
***REMOVED******REMOVED******REMOVED***  invoices.map((inv) => (
***REMOVED******REMOVED******REMOVED******REMOVED***<tr key={inv.id} className="border-t border-border/60">
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{inv.id.slice(0, 8).toUpperCase()}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{inv.customer_name}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {inv.status}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED******REMOVED***  ))
***REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED***  </tbody>
***REMOVED******REMOVED***</table>
***REMOVED***  </div>

***REMOVED***  {showForm && (
***REMOVED******REMOVED***<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6">
***REMOVED******REMOVED***  <div className="w-full max-w-lg rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft">
***REMOVED******REMOVED******REMOVED***<div className="mb-4 flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-sm font-semibold text-text">Nieuwe factuur</h2>
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-xs text-muted">Vul de basisgegevens in. Details kun je later uitbreiden.</p>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setShowForm(false)}
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
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="amountExcl">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Bedrag excl. btw
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="amountExcl"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***inputMode="decimal"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder="0,00"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.amountExcl}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, amountExcl: e.target.value }))}
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
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="md:col-span-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="text-xs font-medium text-text" htmlFor="description">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Omschrijving (optioneel)
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <textarea
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="description"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rows={3}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.description}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 w-full rounded-2xl border border-border bg-bg px-3 py-2 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="mt-2 flex items-center justify-end gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => setShowForm(false)}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  Annuleren
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="submit"
***REMOVED******REMOVED******REMOVED******REMOVED***  disabled={saving}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  {saving ? 'Opslaan…' : 'Factuur opslaan'}
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</form>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}
***REMOVED***</div>
  );
}
