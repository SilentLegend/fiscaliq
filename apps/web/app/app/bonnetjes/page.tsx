'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type Category = 'reiskosten' | 'eten-drinken' | 'kantoor' | 'software' | 'overige';

interface Receipt {
  id: string;
  date: string;
  description: string;
  category: Category;
  amount: number;
  file_url?: string;
  created_at: string;
}

const categoryLabels: Record<Category, string> = {
  'reiskosten': 'Reiskosten',
  'eten-drinken': 'Eten & drinken',
  'kantoor': 'Kantoor',
  'software': 'Software',
  'overige': 'Overige',
};

const categoryColors: Record<Category, string> = {
  'reiskosten': 'text-blue-600 bg-blue-50',
  'eten-drinken': 'text-amber-600 bg-amber-50',
  'kantoor': 'text-purple-600 bg-purple-50',
  'software': 'text-emerald-600 bg-emerald-50',
  'overige': 'text-gray-600 bg-gray-50',
};

export default function BonnetjesPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
***REMOVED***date: new Date().toISOString().slice(0, 10),
***REMOVED***description: '',
***REMOVED***category: 'overige' as Category,
***REMOVED***amount: '',
  });

  useEffect(() => {
***REMOVED***loadReceipts();
  }, []);

  async function loadReceipts() {
***REMOVED***setLoading(true);
***REMOVED***const { data: { user } } = await supabase.auth.getUser();
***REMOVED***
***REMOVED***if (!user) {
***REMOVED***  setLoading(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const { data, error: loadError } = await supabase
***REMOVED***  .from('receipts')
***REMOVED***  .select('*')
***REMOVED***  .eq('user_id', user.id)
***REMOVED***  .order('date', { ascending: false });

***REMOVED***if (!loadError && data) {
***REMOVED***  setReceipts(
***REMOVED******REMOVED***(data as any[]).map((r) => ({
***REMOVED******REMOVED***  id: r.id,
***REMOVED******REMOVED***  date: r.date,
***REMOVED******REMOVED***  description: r.description,
***REMOVED******REMOVED***  category: r.category as Category,
***REMOVED******REMOVED***  amount: r.amount,
***REMOVED******REMOVED***  file_url: r.file_url,
***REMOVED******REMOVED***  created_at: r.created_at,
***REMOVED******REMOVED***}))
***REMOVED***  );
***REMOVED***}
***REMOVED***setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setError(null);
***REMOVED***setSaving(true);

***REMOVED***if (!form.description.trim()) {
***REMOVED***  setError('Omschrijving is verplicht.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const amount = parseFloat(form.amount.replace(',', '.'));
***REMOVED***if (isNaN(amount) || amount <= 0) {
***REMOVED***  setError('Bedrag moet een positief getal zijn.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***try {
***REMOVED***  const { data: { user } } = await supabase.auth.getUser();
***REMOVED***  if (!user) {
***REMOVED******REMOVED***setError('Niet ingelogd. Ververs de pagina.');
***REMOVED******REMOVED***setSaving(false);
***REMOVED******REMOVED***return;
***REMOVED***  }

***REMOVED***  const { error: insertError } = await supabase.from('receipts').insert({
***REMOVED******REMOVED***user_id: user.id,
***REMOVED******REMOVED***date: form.date,
***REMOVED******REMOVED***description: form.description,
***REMOVED******REMOVED***category: form.category,
***REMOVED******REMOVED***amount: amount,
***REMOVED***  });

***REMOVED***  if (insertError) {
***REMOVED******REMOVED***console.error('Bonnetje insert error:', insertError);
***REMOVED******REMOVED***setError('Kon bonnetje niet opslaan: ' + (insertError.message || 'Onbekende fout'));
***REMOVED***  } else {
***REMOVED******REMOVED***setForm({
***REMOVED******REMOVED***  date: new Date().toISOString().slice(0, 10),
***REMOVED******REMOVED***  description: '',
***REMOVED******REMOVED***  category: 'overige',
***REMOVED******REMOVED***  amount: '',
***REMOVED******REMOVED***});
***REMOVED******REMOVED***setShowForm(false);
***REMOVED******REMOVED***await loadReceipts();
***REMOVED***  }
***REMOVED***} catch (err) {
***REMOVED***  setError('Er ging iets mis. Probeer het opnieuw.');
***REMOVED***}

***REMOVED***setSaving(false);
  }

  async function handleDelete(id: string) {
***REMOVED***const { error: deleteError } = await supabase.from('receipts').delete().eq('id', id);
***REMOVED***if (!deleteError) {
***REMOVED***  await loadReceipts();
***REMOVED***}
  }

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-lg font-semibold tracking-tight text-text">Bonnetjes</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Registreer je kosten en bonnen voor de belasting.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button
***REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED***  onClick={() => setShowForm(true)}
***REMOVED******REMOVED***  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark transition"
***REMOVED******REMOVED***>
***REMOVED******REMOVED***  Bonnetje toevoegen
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  {error && (
***REMOVED******REMOVED***<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED***  {error}
***REMOVED******REMOVED***</div>
***REMOVED***  )}

***REMOVED***  <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  {loading ? (
***REMOVED******REMOVED******REMOVED***<div className="py-12 text-center text-sm text-muted">Bonnetjes laden...</div>
***REMOVED******REMOVED***  ) : receipts.length === 0 ? (
***REMOVED******REMOVED******REMOVED***<div className="py-12 text-center">
***REMOVED******REMOVED******REMOVED***  <div className="text-sm text-muted">Geen bonnetjes geregistreerd.</div>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setShowForm(true)}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-3 text-sm font-medium text-primary hover:text-primaryDark"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***Voeg je eerste bonnetje toe
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  ) : (
***REMOVED******REMOVED******REMOVED***<>
***REMOVED******REMOVED******REMOVED***  <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[1fr_1.2fr_1fr_.8fr_.4fr]">
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Datum</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Omschrijving</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Categorie</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Bedrag</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-right">Actie</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-3 divide-y divide-border">
***REMOVED******REMOVED******REMOVED******REMOVED***{receipts.map((receipt) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key={receipt.id}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="grid gap-3 py-3 text-sm md:grid-cols-[1fr_1.2fr_1fr_.8fr_.4fr] md:items-center"
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-muted">{receipt.date}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-medium text-text">{receipt.description}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${categoryColors[receipt.category]}`}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{categoryLabels[receipt.category]}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-semibold text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {`€ ${receipt.amount.toFixed(2).replace('.', ',')}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-right">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => handleDelete(receipt.id)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-rose-600 hover:bg-rose-50 transition"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Verwijderen
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</>
***REMOVED******REMOVED***  )}
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold text-text">Totaal deze maand</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-2 text-3xl font-bold text-text">
***REMOVED******REMOVED******REMOVED***  {`€ ${totalAmount.toFixed(2).replace('.', ',')}`}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-3 text-xs text-muted">{receipts.length} bonnetjes geregistreerd</div>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  <div className="mt-6 border-t border-border pt-6">
***REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold text-text">Per categorie</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-3 space-y-2">
***REMOVED******REMOVED******REMOVED***  {Object.entries(categoryLabels).map(([cat, label]) => {
***REMOVED******REMOVED******REMOVED******REMOVED***const categoryTotal = receipts
***REMOVED******REMOVED******REMOVED******REMOVED***  .filter((r) => r.category === cat)
***REMOVED******REMOVED******REMOVED******REMOVED***  .reduce((sum, r) => sum + r.amount, 0);
***REMOVED******REMOVED******REMOVED******REMOVED***if (categoryTotal === 0) return null;
***REMOVED******REMOVED******REMOVED******REMOVED***return (
***REMOVED******REMOVED******REMOVED******REMOVED***  <div key={cat} className="flex items-center justify-between text-sm">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-muted">{label}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className="font-semibold text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {`€ ${categoryTotal.toFixed(2).replace('.', ',')}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED***  })}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </div>

***REMOVED***  {showForm && (
***REMOVED******REMOVED***<div
***REMOVED******REMOVED***  className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6"
***REMOVED******REMOVED***  onClick={(e) => {
***REMOVED******REMOVED******REMOVED***if (e.target === e.currentTarget) {
***REMOVED******REMOVED******REMOVED***  setShowForm(false);
***REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***  }}
***REMOVED******REMOVED***>
***REMOVED******REMOVED***  <div className="w-full max-w-md rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft">
***REMOVED******REMOVED******REMOVED***<div className="mb-4 flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***  <h2 className="text-sm font-semibold text-text">Bonnetje toevoegen</h2>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setShowForm(false)}
***REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***✕
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<form onSubmit={handleSubmit} className="space-y-4">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-xs font-medium text-text mb-1" htmlFor="date">
***REMOVED******REMOVED******REMOVED******REMOVED***  Datum
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="date"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="date"
***REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.date}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-xs font-medium text-text mb-1" htmlFor="description">
***REMOVED******REMOVED******REMOVED******REMOVED***  Omschrijving
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="description"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED***  placeholder="Bijv. Kantoor benodigdheden"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.description}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-xs font-medium text-text mb-1" htmlFor="category">
***REMOVED******REMOVED******REMOVED******REMOVED***  Categorie
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED***  id="category"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.category}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  {Object.entries(categoryLabels).map(([cat, label]) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<option key={cat} value={cat}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {label}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</option>
***REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-xs font-medium text-text mb-1" htmlFor="amount">
***REMOVED******REMOVED******REMOVED******REMOVED***  Bedrag (EUR)
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="amount"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED***  placeholder="0,00"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.amount}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="flex gap-2 pt-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => setShowForm(false)}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset transition"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  Annuleren
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="submit"
***REMOVED******REMOVED******REMOVED******REMOVED***  disabled={saving}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark transition disabled:opacity-50"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  {saving ? 'Opslaan...' : 'Opslaan'}
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</form>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}
***REMOVED***</div>
  );
}
