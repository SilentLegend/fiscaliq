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
date: new Date().toISOString().slice(0, 10),
description: '',
category: 'overige' as Category,
amount: '',
  });

  useEffect(() => {
loadReceipts();
  }, []);

  async function loadReceipts() {
setLoading(true);
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  setLoading(false);
  return;
}

const { data, error: loadError } = await supabase
  .from('receipts')
  .select('*')
  .eq('user_id', user.id)
  .order('date', { ascending: false });

if (!loadError && data) {
  setReceipts(
(data as any[]).map((r) => ({
  id: r.id,
  date: r.date,
  description: r.description,
  category: r.category as Category,
  amount: r.amount,
  file_url: r.file_url,
  created_at: r.created_at,
}))
  );
}
setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setError(null);
setSaving(true);

if (!form.description.trim()) {
  setError('Omschrijving is verplicht.');
  setSaving(false);
  return;
}

const amount = parseFloat(form.amount.replace(',', '.'));
if (isNaN(amount) || amount <= 0) {
  setError('Bedrag moet een positief getal zijn.');
  setSaving(false);
  return;
}

try {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
setError('Niet ingelogd. Ververs de pagina.');
setSaving(false);
return;
  }

  const { error: insertError } = await supabase.from('receipts').insert({
user_id: user.id,
date: form.date,
description: form.description,
category: form.category,
amount: amount,
  });

  if (insertError) {
console.error('Bonnetje insert error:', insertError);
setError('Kon bonnetje niet opslaan: ' + (insertError.message || 'Onbekende fout'));
  } else {
setForm({
  date: new Date().toISOString().slice(0, 10),
  description: '',
  category: 'overige',
  amount: '',
});
setShowForm(false);
await loadReceipts();
  }
} catch (err) {
  setError('Er ging iets mis. Probeer het opnieuw.');
}

setSaving(false);
  }

  async function handleDelete(id: string) {
const { error: deleteError } = await supabase.from('receipts').delete().eq('id', id);
if (!deleteError) {
  await loadReceipts();
}
  }

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
<div className="space-y-6">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
<div>
  <h1 className="text-lg font-semibold tracking-tight text-text">Bonnetjes</h1>
  <p className="mt-1 text-sm text-muted">Registreer je kosten en bonnen voor de belasting.</p>
</div>
<button
  type="button"
  onClick={() => setShowForm(true)}
  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark transition"
>
  Bonnetje toevoegen
</button>
  </header>

  {error && (
<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
  {error}
</div>
  )}

  <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
<div className="rounded-3xl border border-border bg-bg p-5">
  {loading ? (
<div className="py-12 text-center text-sm text-muted">Bonnetjes laden...</div>
  ) : receipts.length === 0 ? (
<div className="py-12 text-center">
  <div className="text-sm text-muted">Geen bonnetjes geregistreerd.</div>
  <button
type="button"
onClick={() => setShowForm(true)}
className="mt-3 text-sm font-medium text-primary hover:text-primaryDark"
  >
Voeg je eerste bonnetje toe
  </button>
</div>
  ) : (
<>
  <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[1fr_1.2fr_1fr_.8fr_.4fr]">
<span>Datum</span>
<span>Omschrijving</span>
<span>Categorie</span>
<span>Bedrag</span>
<span className="text-right">Actie</span>
  </div>
  <div className="mt-3 divide-y divide-border">
{receipts.map((receipt) => (
  <div
key={receipt.id}
className="grid gap-3 py-3 text-sm md:grid-cols-[1fr_1.2fr_1fr_.8fr_.4fr] md:items-center"
  >
<div className="text-muted">{receipt.date}</div>
<div className="font-medium text-text">{receipt.description}</div>
<div>
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${categoryColors[receipt.category]}`}>
{categoryLabels[receipt.category]}
  </span>
</div>
<div className="font-semibold text-text">
  {`€ ${receipt.amount.toFixed(2).replace('.', ',')}`}
</div>
<div className="text-right">
  <button
type="button"
onClick={() => handleDelete(receipt.id)}
className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-rose-600 hover:bg-rose-50 transition"
  >
Verwijderen
  </button>
</div>
  </div>
))}
  </div>
</>
  )}
</div>

<div className="rounded-3xl border border-border bg-bg p-5">
  <div>
<div className="text-sm font-semibold text-text">Totaal deze maand</div>
<div className="mt-2 text-3xl font-bold text-text">
  {`€ ${totalAmount.toFixed(2).replace('.', ',')}`}
</div>
<div className="mt-3 text-xs text-muted">{receipts.length} bonnetjes geregistreerd</div>
  </div>

  <div className="mt-6 border-t border-border pt-6">
<div className="text-sm font-semibold text-text">Per categorie</div>
<div className="mt-3 space-y-2">
  {Object.entries(categoryLabels).map(([cat, label]) => {
const categoryTotal = receipts
  .filter((r) => r.category === cat)
  .reduce((sum, r) => sum + r.amount, 0);
if (categoryTotal === 0) return null;
return (
  <div key={cat} className="flex items-center justify-between text-sm">
<span className="text-muted">{label}</span>
<span className="font-semibold text-text">
  {`€ ${categoryTotal.toFixed(2).replace('.', ',')}`}
</span>
  </div>
);
  })}
</div>
  </div>
</div>
  </div>

  {showForm && (
<div
  className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6"
  onClick={(e) => {
if (e.target === e.currentTarget) {
  setShowForm(false);
}
  }}
>
  <div className="w-full max-w-md rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft">
<div className="mb-4 flex items-center justify-between">
  <h2 className="text-sm font-semibold text-text">Bonnetje toevoegen</h2>
  <button
type="button"
onClick={() => setShowForm(false)}
className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
  >
✕
  </button>
</div>

<form onSubmit={handleSubmit} className="space-y-4">
  <div>
<label className="block text-xs font-medium text-text mb-1" htmlFor="date">
  Datum
</label>
<input
  id="date"
  type="date"
  required
  value={form.date}
  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>

  <div>
<label className="block text-xs font-medium text-text mb-1" htmlFor="description">
  Omschrijving
</label>
<input
  id="description"
  type="text"
  required
  placeholder="Bijv. Kantoor benodigdheden"
  value={form.description}
  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>

  <div>
<label className="block text-xs font-medium text-text mb-1" htmlFor="category">
  Categorie
</label>
<select
  id="category"
  value={form.category}
  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category }))}
  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
>
  {Object.entries(categoryLabels).map(([cat, label]) => (
<option key={cat} value={cat}>
  {label}
</option>
  ))}
</select>
  </div>

  <div>
<label className="block text-xs font-medium text-text mb-1" htmlFor="amount">
  Bedrag (EUR)
</label>
<input
  id="amount"
  type="text"
  required
  placeholder="0,00"
  value={form.amount}
  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>

  <div className="flex gap-2 pt-4">
<button
  type="button"
  onClick={() => setShowForm(false)}
  className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset transition"
>
  Annuleren
</button>
<button
  type="submit"
  disabled={saving}
  className="flex-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primaryDark transition disabled:opacity-50"
>
  {saving ? 'Opslaan...' : 'Opslaan'}
</button>
  </div>
</form>
  </div>
</div>
  )}
</div>
  );
}
