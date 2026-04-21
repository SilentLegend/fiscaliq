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
***REMOVED***date: new Date().toISOString().slice(0, 10),
***REMOVED***description: '',
***REMOVED***start_location: '',
***REMOVED***end_location: '',
***REMOVED***km: '',
***REMOVED***cost: '',
***REMOVED***notes: '',
  });

  const KM_RATE = 0.19; // Nederlandse kilometervergoeding 2026

  useEffect(() => {
***REMOVED***loadTrips();
  }, []);

  async function loadTrips() {
***REMOVED***setLoading(true);
***REMOVED***const { data: { user } } = await supabase.auth.getUser();
***REMOVED***
***REMOVED***if (!user) {
***REMOVED***  setLoading(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const { data, error: loadError } = await supabase
***REMOVED***  .from('trips')
***REMOVED***  .select('*')
***REMOVED***  .eq('user_id', user.id)
***REMOVED***  .order('date', { ascending: false });

***REMOVED***if (!loadError && data) {
***REMOVED***  setTrips(data as Trip[]);
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

***REMOVED***if (!form.start_location.trim() || !form.end_location.trim()) {
***REMOVED***  setError('Vertrekpunt en bestemmning zijn verplicht.');
***REMOVED***  setSaving(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const km = parseFloat(form.km);
***REMOVED***if (isNaN(km) || km <= 0) {
***REMOVED***  setError('Aantal km moet een positief getal zijn.');
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

***REMOVED***  const costValue = form.cost ? parseFloat(form.cost.replace(',', '.')) : km * KM_RATE;

***REMOVED***  const { error: insertError } = await supabase.from('trips').insert({
***REMOVED******REMOVED***user_id: user.id,
***REMOVED******REMOVED***date: form.date,
***REMOVED******REMOVED***description: form.description,
***REMOVED******REMOVED***start_location: form.start_location,
***REMOVED******REMOVED***end_location: form.end_location,
***REMOVED******REMOVED***km: km,
***REMOVED******REMOVED***cost: costValue,
***REMOVED******REMOVED***notes: form.notes || null,
***REMOVED***  });

***REMOVED***  if (insertError) {
***REMOVED******REMOVED***console.error('Trip insert error:', insertError);
***REMOVED******REMOVED***setError('Kon rit niet opslaan: ' + (insertError.message || 'Onbekende fout'));
***REMOVED***  } else {
***REMOVED******REMOVED***setForm({
***REMOVED******REMOVED***  date: new Date().toISOString().slice(0, 10),
***REMOVED******REMOVED***  description: '',
***REMOVED******REMOVED***  start_location: '',
***REMOVED******REMOVED***  end_location: '',
***REMOVED******REMOVED***  km: '',
***REMOVED******REMOVED***  cost: '',
***REMOVED******REMOVED***  notes: '',
***REMOVED******REMOVED***});
***REMOVED******REMOVED***setShowForm(false);
***REMOVED******REMOVED***await loadTrips();
***REMOVED***  }
***REMOVED***} catch (err) {
***REMOVED***  setError('Er ging iets mis. Probeer het opnieuw.');
***REMOVED***}

***REMOVED***setSaving(false);
  }

  async function handleDelete(id: string) {
***REMOVED***const { error: deleteError } = await supabase.from('trips').delete().eq('id', id);
***REMOVED***if (!deleteError) {
***REMOVED***  await loadTrips();
***REMOVED***}
  }

  const totalKm = trips.reduce((sum, t) => sum + t.km, 0);
  const totalCost = trips.reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-lg font-semibold tracking-tight text-text">Ritregistratie</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Registreer je zakelijke ritten en bereken vergoedingen.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button
***REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED***  onClick={() => setShowForm(true)}
***REMOVED******REMOVED***  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark transition"
***REMOVED******REMOVED***>
***REMOVED******REMOVED***  Rit toevoegen
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
***REMOVED******REMOVED******REMOVED***<div className="py-12 text-center text-sm text-muted">Ritten laden...</div>
***REMOVED******REMOVED***  ) : trips.length === 0 ? (
***REMOVED******REMOVED******REMOVED***<div className="py-12 text-center">
***REMOVED******REMOVED******REMOVED***  <div className="text-sm text-muted">Geen ritten geregistreerd.</div>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => setShowForm(true)}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-3 text-sm font-medium text-primary hover:text-primaryDark"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***Voeg je eerste rit toe
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  ) : (
***REMOVED******REMOVED******REMOVED***<>
***REMOVED******REMOVED******REMOVED***  <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[.8fr_1.2fr_.8fr_.7fr_.5fr]">
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Datum</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Route</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>KM</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span>Vergoeding</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-right">Actie</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-3 divide-y divide-border">
***REMOVED******REMOVED******REMOVED******REMOVED***{trips.map((trip) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key={trip.id}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="grid gap-3 py-3 text-sm md:grid-cols-[.8fr_1.2fr_.8fr_.7fr_.5fr] md:items-center"
***REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-muted">{trip.date}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-medium text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>{trip.start_location} → {trip.end_location}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="text-xs text-muted mt-1">{trip.description}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-semibold text-text">{trip.km} km</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-semibold text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {`€ ${(trip.cost || 0).toFixed(2).replace('.', ',')}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-right">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => handleDelete(trip.id)}
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

***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5 space-y-6">
***REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold text-text">Totale km</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-2 text-3xl font-bold text-text">{totalKm} km</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-3 text-xs text-muted">{trips.length} ritten</div>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  <div className="border-t border-border pt-6">
***REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold text-text">Totale vergoeding</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-2 text-3xl font-bold text-primary">
***REMOVED******REMOVED******REMOVED***  {`€ ${totalCost.toFixed(2).replace('.', ',')}`}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="mt-2 text-xs text-muted">
***REMOVED******REMOVED******REMOVED***  Tegen 0,19 EUR/km (wettelijk tarief 2026)
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  <div className="rounded-2xl bg-highlight/40 p-4 border border-border">
***REMOVED******REMOVED******REMOVED***<div className="text-xs font-semibold text-primary mb-2">Informatie</div>
***REMOVED******REMOVED******REMOVED***<ul className="space-y-1 text-xs text-text">
***REMOVED******REMOVED******REMOVED***  <li>- Kosten worden automatisch berekend</li>
***REMOVED******REMOVED******REMOVED***  <li>- Lees de rit-omschrijving in</li>
***REMOVED******REMOVED******REMOVED***  <li>- Je kunt kosten handmatig aanpassen</li>
***REMOVED******REMOVED******REMOVED***  <li>- Deze vergoedingen zijn aftrekbaar</li>
***REMOVED******REMOVED******REMOVED***</ul>
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
***REMOVED******REMOVED******REMOVED***  <h2 className="text-sm font-semibold text-text">Rit toevoegen</h2>
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
***REMOVED******REMOVED******REMOVED******REMOVED***  Beschrijving
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="description"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED***  placeholder="Bijv. Klantbezoek Amsterdam"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.description}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="grid gap-3 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="block text-xs font-medium text-text mb-1" htmlFor="start">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Vertrekpunt
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="start"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder="Amsterdam"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.start_location}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, start_location: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="block text-xs font-medium text-text mb-1" htmlFor="end">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Bestemming
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="end"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder="Rotterdam"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.end_location}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, end_location: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="grid gap-3 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="block text-xs font-medium text-text mb-1" htmlFor="km">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Aantal km
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="km"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder="0"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.km}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, km: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <label className="block text-xs font-medium text-text mb-1" htmlFor="cost">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Vergoeding (optioneel)
***REMOVED******REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id="cost"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***placeholder="Auto berekenen"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***value={form.cost}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="block text-xs font-medium text-text mb-1" htmlFor="notes">
***REMOVED******REMOVED******REMOVED******REMOVED***  Notities
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<textarea
***REMOVED******REMOVED******REMOVED******REMOVED***  id="notes"
***REMOVED******REMOVED******REMOVED******REMOVED***  placeholder="Bijv. Afrekening met klant"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={form.notes}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  rows={2}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="w-full rounded-2xl border border-border bg-bg px-3 py-2 text-xs outline-none transition focus:border-primary"
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
