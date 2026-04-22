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
company_name: '',
street: '',
postal_code: '',
city: '',
kvk: '',
vat_number: '',
iban: '',
email: '',
website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enableClientScore, setEnableClientScore] = useState(false);

  useEffect(() => {
async function loadSettings() {
  setLoading(true);
  const { data, error } = await supabase.from('company_settings').select('*').single();
  if (!error && data) {
const d = data as any;
setSettings({
  company_name: d.company_name ?? '',
  street: d.street ?? '',
  postal_code: d.postal_code ?? '',
  city: d.city ?? '',
  kvk: d.kvk ?? '',
  vat_number: d.vat_number ?? '',
  iban: d.iban ?? '',
  email: d.email ?? '',
  website: d.website ?? '',
});
  }
  setLoading(false);
}
loadSettings();
  }, []);

  useEffect(() => {
const raw = localStorage.getItem('fiscaliq.featureFlags.v1');
if (!raw) return;
try {
  const parsed = JSON.parse(raw) as {
enableClientScore?: boolean;
  };
  setEnableClientScore(Boolean(parsed.enableClientScore));
} catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent) {
e.preventDefault();
setSaving(true);
setError(null);
setMessage(null);

try {
  const { error } = await supabase.from('company_settings').upsert(settings, {
onConflict: 'user_id',
  });
  if (error) {
console.error(error);
setError('Kon bedrijfsgegevens niet opslaan.');
  } else {
setMessage('Bedrijfsgegevens opgeslagen.');
  }
} catch (err) {
  console.error(err);
  setError('Er ging iets mis bij het opslaan.');
}

setSaving(false);
  }

  function persistFlags(next: { enableClientScore: boolean }) {
localStorage.setItem('fiscaliq.featureFlags.v1', JSON.stringify(next));
window.dispatchEvent(new StorageEvent('storage', { key: 'fiscaliq.featureFlags.v1' }));
  }

  return (
<div className="space-y-6">
  <header>
<h1 className="text-3xl font-semibold tracking-tight">Instellingen</h1>
<p className="mt-1 text-sm text-muted">Basisinstellingen voor je account en bedrijf.</p>
  </header>

  <section className="grid gap-6 lg:grid-cols-2">
<div className="rounded-3xl border border-border bg-bg p-5">
  <h2 className="text-lg font-semibold tracking-tight">Bedrijfsgegevens</h2>
  <p className="mt-1 text-xs text-muted">
Deze gegevens komen bovenaan je facturen te staan.
  </p>

  {error && (
<div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
  {error}
</div>
  )}
  {message && (
<div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
  {message}
</div>
  )}

  <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
<div>
  <label className="font-medium text-text" htmlFor="company_name">
Bedrijfsnaam
  </label>
  <input
id="company_name"
type="text"
required
value={settings.company_name}
onChange={(e) => setSettings((s) => ({ ...s, company_name: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div>
  <label className="font-medium text-text" htmlFor="street">
Straat + huisnummer
  </label>
  <input
id="street"
type="text"
value={settings.street}
onChange={(e) => setSettings((s) => ({ ...s, street: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>
<div className="grid gap-3 md:grid-cols-[1.2fr_2fr]">
  <div>
<label className="font-medium text-text" htmlFor="postal_code">
  Postcode
</label>
<input
  id="postal_code"
  type="text"
  value={settings.postal_code}
  onChange={(e) => setSettings((s) => ({ ...s, postal_code: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
  <div>
<label className="font-medium text-text" htmlFor="city">
  Plaats
</label>
<input
  id="city"
  type="text"
  value={settings.city}
  onChange={(e) => setSettings((s) => ({ ...s, city: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
</div>
<div className="grid gap-3 md:grid-cols-2">
  <div>
<label className="font-medium text-text" htmlFor="kvk">
  KVK-nummer
</label>
<input
  id="kvk"
  type="text"
  value={settings.kvk}
  onChange={(e) => setSettings((s) => ({ ...s, kvk: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
  <div>
<label className="font-medium text-text" htmlFor="vat_number">
  Btw-nummer
</label>
<input
  id="vat_number"
  type="text"
  value={settings.vat_number}
  onChange={(e) => setSettings((s) => ({ ...s, vat_number: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
</div>
<div className="grid gap-3 md:grid-cols-2">
  <div>
<label className="font-medium text-text" htmlFor="iban">
  IBAN
</label>
<input
  id="iban"
  type="text"
  value={settings.iban}
  onChange={(e) => setSettings((s) => ({ ...s, iban: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
  <div>
<label className="font-medium text-text" htmlFor="email">
  E-mailadres op factuur
</label>
<input
  id="email"
  type="email"
  value={settings.email}
  onChange={(e) => setSettings((s) => ({ ...s, email: e.target.value }))}
  className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
/>
  </div>
</div>
<div>
  <label className="font-medium text-text" htmlFor="website">
Website (optioneel)
  </label>
  <input
id="website"
type="text"
value={settings.website}
onChange={(e) => setSettings((s) => ({ ...s, website: e.target.value }))}
className="mt-1 h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary"
  />
</div>

<div className="mt-3 flex justify-end">
  <button
type="submit"
disabled={saving || loading}
className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
  >
{saving ? 'Opslaan…' : 'Opslaan'}
  </button>
</div>
  </form>
</div>

<div className="rounded-3xl border border-border bg-bg p-5">
  <h2 className="text-lg font-semibold tracking-tight">Account & abonnement</h2>
  <div className="mt-4 space-y-3 text-sm text-muted">
<div>
  <div className="font-medium text-text">Account</div>
  <div>Naam en e-mailadres komen later via een profielpagina.</div>
</div>
<div>
  <div className="font-medium text-text">Abonnement</div>
  <div>Fiscaliq alles-in-één — €9,99 per maand na de proefperiode.</div>
</div>
<div>
  <div className="font-medium text-text">Support</div>
  <div>Vragen? Stuur gerust een e-mail, link volgt later in de app.</div>
</div>
<div className="rounded-2xl border border-border bg-surface p-3">
  <div className="font-medium text-text">Experimentele features</div>
  <div className="mt-2 space-y-2">
<label className="flex items-center justify-between gap-3 text-xs">
  <span>Klantscore-tabblad</span>
  <input
type="checkbox"
checked={enableClientScore}
onChange={(e) => {
  const next = {
enableClientScore: e.target.checked,
  };
  setEnableClientScore(next.enableClientScore);
  persistFlags(next);
}}
  />
</label>
  </div>
</div>
  </div>
</div>
  </section>
</div>
  );
}
