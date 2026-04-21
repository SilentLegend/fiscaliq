'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface CompanySettings {
  company_name: string;
  street: string;
  postal_code: string;
  city: string;
  kvk: string;
  vat_number: string;
  iban: string;
  email: string;
  website: string;
}

export default function InstellingenPage() {
  const [settings, setSettings] = useState<CompanySettings>({
***REMOVED***company_name: '',
***REMOVED***street: '',
***REMOVED***postal_code: '',
***REMOVED***city: '',
***REMOVED***kvk: '',
***REMOVED***vat_number: '',
***REMOVED***iban: '',
***REMOVED***email: '',
***REMOVED***website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enableClientScore, setEnableClientScore] = useState(false);

  useEffect(() => {
***REMOVED***async function loadSettings() {
***REMOVED***  setLoading(true);
***REMOVED***  const { data, error } = await supabase.from('company_settings').select('*').single();
***REMOVED***  if (!error && data) {
***REMOVED******REMOVED***const d = data as any;
***REMOVED******REMOVED***setSettings({
***REMOVED******REMOVED***  company_name: d.company_name ?? '',
***REMOVED******REMOVED***  street: d.street ?? '',
***REMOVED******REMOVED***  postal_code: d.postal_code ?? '',
***REMOVED******REMOVED***  city: d.city ?? '',
***REMOVED******REMOVED***  kvk: d.kvk ?? '',
***REMOVED******REMOVED***  vat_number: d.vat_number ?? '',
***REMOVED******REMOVED***  iban: d.iban ?? '',
***REMOVED******REMOVED***  email: d.email ?? '',
***REMOVED******REMOVED***  website: d.website ?? '',
***REMOVED******REMOVED***});
***REMOVED***  }
***REMOVED***  setLoading(false);
***REMOVED***}
***REMOVED***loadSettings();
  }, []);

  useEffect(() => {
***REMOVED***const raw = localStorage.getItem('fiscaliq.featureFlags.v1');
***REMOVED***if (!raw) return;
***REMOVED***try {
***REMOVED***  const parsed = JSON.parse(raw) as {
***REMOVED******REMOVED***enableClientScore?: boolean;
***REMOVED***  };
***REMOVED***  setEnableClientScore(Boolean(parsed.enableClientScore));
***REMOVED***} catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setSaving(true);
***REMOVED***setError(null);
***REMOVED***setMessage(null);

***REMOVED***try {
***REMOVED***  const { error } = await supabase.from('company_settings').upsert(settings, {
***REMOVED******REMOVED***onConflict: 'user_id',
***REMOVED***  });
***REMOVED***  if (error) {
***REMOVED******REMOVED***console.error(error);
***REMOVED******REMOVED***setError('Kon bedrijfsgegevens niet opslaan.');
***REMOVED***  } else {
***REMOVED******REMOVED***setMessage('Bedrijfsgegevens opgeslagen.');
***REMOVED***  }
***REMOVED***} catch (err) {
***REMOVED***  console.error(err);
***REMOVED***  setError('Er ging iets mis bij het opslaan.');
***REMOVED***}

***REMOVED***setSaving(false);
  }

  function persistFlags(next: { enableAutoReminders: boolean; enableClientScore: boolean }) {
***REMOVED***localStorage.setItem('fiscaliq.featureFlags.v1', JSON.stringify(next));
***REMOVED***window.dispatchEvent(new StorageEvent('storage', { key: 'fiscaliq.featureFlags.v1' }));
  }

  async function testReminder() {
***REMOVED***setTestingReminder(true);
***REMOVED***setMessage(null);
***REMOVED***setError(null);
***REMOVED***
***REMOVED***try {
***REMOVED***  // Call the reminder API endpoint
***REMOVED***  const response = await fetch('/api/reminders', {
***REMOVED******REMOVED***method: 'POST',
***REMOVED******REMOVED***headers: {
***REMOVED******REMOVED***  'Content-Type': 'application/json',
***REMOVED******REMOVED***},
***REMOVED******REMOVED***body: JSON.stringify({ test: true }),
***REMOVED***  });

***REMOVED***  if (!response.ok) {
***REMOVED******REMOVED***throw new Error(`API error: ${response.status}`);
***REMOVED***  }

***REMOVED***  const data = await response.json();

***REMOVED***  if (data.sent > 0) {
***REMOVED******REMOVED***setMessage(`Herinneringsmail verzonden! ${data.sent} klanten ontvangen een herinnering voor vervallen facturen.`);
***REMOVED***  } else if (data.sent === 0 && data.failed === 0) {
***REMOVED******REMOVED***setMessage('Geen vervallen facturen gevonden. Alle facturen zijn betaald of nog niet vervallen!');
***REMOVED***  } else {
***REMOVED******REMOVED***setMessage(`Test voltooid. ${data.sent} succesvol verzonden, ${data.failed} mislukt.`);
***REMOVED***  }
***REMOVED***} catch (err) {
***REMOVED***  console.error('Reminder test error:', err);
***REMOVED***  setError('Herinneringsmail test mislukt. Controleer of Resend API key is ingesteld.');
***REMOVED***}
***REMOVED***
***REMOVED***setTestingReminder(false);
  }

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header>
***REMOVED******REMOVED***<h1 className="text-3xl font-semibold tracking-tight">Instellingen</h1>
***REMOVED******REMOVED***<p className="mt-1 text-sm text-muted">Basisinstellingen voor je account en bedrijf.</p>
***REMOVED***  </header>

***REMOVED***  <section className="grid gap-6 lg:grid-cols-2">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <h2 className="text-lg font-semibold tracking-tight">Bedrijfsgegevens</h2>
***REMOVED******REMOVED***  <p className="mt-1 text-xs text-muted">
***REMOVED******REMOVED******REMOVED***Deze gegevens komen bovenaan je facturen te staan.
***REMOVED******REMOVED***  </p>

***REMOVED******REMOVED***  {error && (
***REMOVED******REMOVED******REMOVED***<div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED******REMOVED***  {error}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  )}
***REMOVED******REMOVED***  {message && (
***REMOVED******REMOVED******REMOVED***<div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
***REMOVED******REMOVED******REMOVED***  {message}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  )}

***REMOVED******REMOVED***  <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <label className="font-medium text-text" htmlFor="company_name">
***REMOVED******REMOVED******REMOVED******REMOVED***Bedrijfsnaam
***REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED***id="company_name"
***REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***required
***REMOVED******REMOVED******REMOVED******REMOVED***value={settings.company_name}
***REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setSettings((s) => ({ ...s, company_name: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <label className="font-medium text-text" htmlFor="street">
***REMOVED******REMOVED******REMOVED******REMOVED***Straat + huisnummer
***REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED***id="street"
***REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***value={settings.street}
***REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setSettings((s) => ({ ...s, street: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="grid gap-3 md:grid-cols-[1.2fr_2fr]">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="postal_code">
***REMOVED******REMOVED******REMOVED******REMOVED***  Postcode
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="postal_code"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.postal_code}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, postal_code: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="city">
***REMOVED******REMOVED******REMOVED******REMOVED***  Plaats
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="city"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.city}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, city: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="grid gap-3 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="kvk">
***REMOVED******REMOVED******REMOVED******REMOVED***  KVK-nummer
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="kvk"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.kvk}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, kvk: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="vat_number">
***REMOVED******REMOVED******REMOVED******REMOVED***  Btw-nummer
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="vat_number"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.vat_number}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, vat_number: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="grid gap-3 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="iban">
***REMOVED******REMOVED******REMOVED******REMOVED***  IBAN
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="iban"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.iban}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, iban: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="font-medium text-text" htmlFor="email">
***REMOVED******REMOVED******REMOVED******REMOVED***  E-mailadres op factuur
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED***  id="email"
***REMOVED******REMOVED******REMOVED******REMOVED***  type="email"
***REMOVED******REMOVED******REMOVED******REMOVED***  value={settings.email}
***REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <label className="font-medium text-text" htmlFor="website">
***REMOVED******REMOVED******REMOVED******REMOVED***Website (optioneel)
***REMOVED******REMOVED******REMOVED***  </label>
***REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED***id="website"
***REMOVED******REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED******REMOVED***value={settings.website}
***REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => setSettings((s) => ({ ...s, website: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED***className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<div className="mt-3 flex justify-end">
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="submit"
***REMOVED******REMOVED******REMOVED******REMOVED***disabled={saving || loading}
***REMOVED******REMOVED******REMOVED******REMOVED***className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***{saving ? 'Opslaan…' : 'Opslaan'}
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </form>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <h2 className="text-lg font-semibold tracking-tight">Account & abonnement</h2>
***REMOVED******REMOVED***  <div className="mt-4 space-y-3 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">Account</div>
***REMOVED******REMOVED******REMOVED***  <div>Naam en e-mailadres komen later via een profielpagina.</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">Abonnement</div>
***REMOVED******REMOVED******REMOVED***  <div>Fiscaliq alles-in-één — €9,99 per maand na de proefperiode.</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">Support</div>
***REMOVED******REMOVED******REMOVED***  <div>Vragen? Stuur gerust een e-mail, link volgt later in de app.</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="rounded-2xl border border-border bg-surface p-3">
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">Experimentele features</div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-2 space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<label className="flex items-center justify-between gap-3 text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED***  <span>Klantscore-tabblad</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="checkbox"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***checked={enableClientScore}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onChange={(e) => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  const next = {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***enableClientScore: e.target.checked,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  };
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  setEnableClientScore(next.enableClientScore);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  persistFlags(next);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
