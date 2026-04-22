'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface Trip {
  id: string;
  date: string;
  description: string;
  start_location: string;
  end_location: string;
  km: number;
  cost?: number;
  notes?: string;
  created_at: string;
}

export default function RittenPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
date: new Date().toISOString().slice(0, 10),
description: '',
start_location: '',
end_location: '',
km: '',
cost: '',
notes: '',
  });

  const KM_RATE = 0.19; // Nederlandse kilometervergoeding 2026

  useEffect(() => {
loadTrips();
  }, []);

  async function loadTrips() {
setLoading(true);
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  setLoading(false);
  return;
}

const { data, error: loadError } = await supabase
  .from('trips')
  .select('*')
  .eq('user_id', user.id)
  .order('date', { ascending: false });

if (!loadError && data) {
  setTrips(data as Trip[]);
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

if (!form.start_location.trim() || !form.end_location.trim()) {
  setError('Vertrekpunt en bestemmning zijn verplicht.');
  setSaving(false);
  return;
}

const km = parseFloat(form.km);
if (isNaN(km) || km <= 0) {
  setError('Aantal km moet een positief getal zijn.');
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

  const costValue = form.cost ? parseFloat(form.cost.replace(',', '.')) : km * KM_RATE;

  const { error: insertError } = await supabase.from('trips').insert({
user_id: user.id,
date: form.date,
description: form.description,
start_location: form.start_location,
end_location: form.end_location,
km: km,
cost: costValue,
notes: form.notes || null,
  });

  if (insertError) {
console.error('Trip insert error:', insertError);
setError('Kon rit niet opslaan: ' + (insertError.message || 'Onbekende fout'));
  } else {
setForm({
  date: new Date().toISOString().slice(0, 10),
  description: '',
  start_location: '',
  end_location: '',
  km: '',
  cost: '',
  notes: '',
});
setShowForm(false);
await loadTrips();
  }
} catch (err) {
  setError('Er ging iets mis. Probeer het opnieuw.');
}

setSaving(false);
  }

  async function handleDelete(id: string) {
const { error: deleteError } = await supabase.from('trips').delete().eq('id', id);
if (!deleteError) {
  await loadTrips();
}
  }

  const totalKm = trips.reduce((sum, t) => sum + t.km, 0);
  const totalCost = trips.reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
<div className="space-y-6">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
<div>
  <h1 className="text-lg font-semibold tracking-tight text-text">Ritregistratie</h1>
  <p className="mt-1 text-sm text-muted">Registreer je zakelijke ritten en bereken vergoedingen.</p>
</div>
<button
  type="button"
  onClick={() => setShowForm(true)}
  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark transition"
>
  Rit toevoegen
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
<div className="py-12 text-center text-sm text-muted">Ritten laden...</div>
  ) : trips.length === 0 ? (
<div className="py-12 text-center">
  <div className="text-sm text-muted">Geen ritten geregistreerd.</div>
  <button
type="button"
onClick={() => setShowForm(true)}
className="mt-3 text-sm font-medium text-primary hover:text-primaryDark"
  >
Voeg je eerste rit toe
  </button>
</div>
  ) : (
<>
  <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[.8fr_1.2fr_.8fr_.7fr_.5fr]">
<span>Datum</span>
<span>Route</span>
<span>KM</span>
<span>Vergoeding</span>
<span className="text-right">Actie</span>
  </div>
  <div className="mt-3 divide-y divide-border">
{trips.map((trip) => (
  <div
key={trip.id}
className="grid gap-3 py-3 text-sm md:grid-cols-[.8fr_1.2fr_.8fr_.7fr_.5fr] md:items-center"
  >
<div className="text-muted">{trip.date}</div>
<div className="font-medium text-text">
  <div>{trip.start_location} → {trip.end_location}</div>
  <div className="text-xs text-muted mt-1">{trip.description}</div>
</div>
<div className="font-semibold text-text">{trip.km} km</div>
<div className="font-semibold text-text">
  {`€ ${(trip.cost || 0).toFixed(2).replace('.', ',')}`}
</div>
<div className="text-right">
  <button
type="button"
onClick={() => handleDelete(trip.id)}
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

<div className="rounded-3xl border border-border bg-bg p-5 space-y-6">
  <div>
<div className="text-sm font-semibold text-text">Totale km</div>
<div className="mt-2 text-3xl font-bold text-text">{totalKm} km</div>
<div className="mt-3 text-xs text-muted">{trips.length} ritten</div>
  </div>

  <div className="border-t border-border pt-6">
<div className="text-sm font-semibold text-text">Totale vergoeding</div>
<div className="mt-2 text-3xl font-bold text-primary">
  {`€ ${totalCost.toFixed(2).replace('.', ',')}`}
</div>
<div className="mt-2 text-xs text-muted">
  Tegen 0,19 EUR/km (wettelijk tarief 2026)
</div>
  </div>

  <div className="rounded-2xl bg-highlight/40 p-4 border border-border">
<div className="text-xs font-semibold text-primary mb-2">Informatie</div>
<ul className="space-y-1 text-xs text-text">
  <li>- Kosten worden automatisch berekend</li>
  <li>- Lees de rit-omschrijving in</li>
  <li>- Je kunt kosten handmatig aanpassen</li>
  <li>- Deze vergoedingen zijn aftrekbaar</li>
</ul>
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
  <h2 className="text-sm font-semibold text-text">Rit toevoegen</h2>
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
  Beschrijving
</label>
<input
  id="description"
  type="text"
  required
  placeholder="Bijv. Klantbezoek Amsterdam"
  value={form.description}
  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>

  <div className="grid gap-3 md:grid-cols-2">
<div>
  <label className="block text-xs font-medium text-text mb-1" htmlFor="start">
Vertrekpunt
  </label>
  <input
id="start"
type="text"
required
placeholder="Amsterdam"
value={form.start_location}
onChange={(e) => setForm((f) => ({ ...f, start_location: e.target.value }))}
className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div>
  <label className="block text-xs font-medium text-text mb-1" htmlFor="end">
Bestemming
  </label>
  <input
id="end"
type="text"
required
placeholder="Rotterdam"
value={form.end_location}
onChange={(e) => setForm((f) => ({ ...f, end_location: e.target.value }))}
className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
  </div>

  <div className="grid gap-3 md:grid-cols-2">
<div>
  <label className="block text-xs font-medium text-text mb-1" htmlFor="km">
Aantal km
  </label>
  <input
id="km"
type="text"
required
placeholder="0"
value={form.km}
onChange={(e) => setForm((f) => ({ ...f, km: e.target.value }))}
className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div>
  <label className="block text-xs font-medium text-text mb-1" htmlFor="cost">
Vergoeding (optioneel)
  </label>
  <input
id="cost"
type="text"
placeholder="Auto berekenen"
value={form.cost}
onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
  </div>

  <div>
<label className="block text-xs font-medium text-text mb-1" htmlFor="notes">
  Notities
</label>
<textarea
  id="notes"
  placeholder="Bijv. Afrekening met klant"
  value={form.notes}
  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
  rows={2}
  className="w-full rounded-2xl border border-border bg-bg px-3 py-2 text-xs outline-none transition focus:border-primary"
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
