'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setError(null);
***REMOVED***setSuccess(null);
***REMOVED***setLoading(true);

***REMOVED***const { error: signUpError } = await supabase.auth.signUp({
***REMOVED***  email,
***REMOVED***  password,
***REMOVED***});

***REMOVED***setLoading(false);

***REMOVED***if (signUpError) {
***REMOVED***  setError(signUpError.message);
***REMOVED***  return;
***REMOVED***}

***REMOVED***setSuccess('Account aangemaakt. Controleer je e-mail om je account te bevestigen.');

***REMOVED***// Optioneel: direct naar dashboard als e-mailbevestiging uit staat
***REMOVED***// router.push('/app/dashboard');
  }

  return (
***REMOVED***<div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
***REMOVED***  <div className="w-full max-w-md rounded-[1.8rem] border border-border bg-surface p-8 shadow-soft">
***REMOVED******REMOVED***<h1 className="text-2xl font-semibold tracking-tight text-text">Account aanmaken</h1>
***REMOVED******REMOVED***<p className="mt-2 text-sm text-muted">
***REMOVED******REMOVED***  Start met Fiscaliq en houd je administratie rustig en overzichtelijk.
***REMOVED******REMOVED***</p>

***REMOVED******REMOVED***<form onSubmit={handleSubmit} className="mt-6 space-y-4">
***REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED***<label className="text-sm font-medium text-text" htmlFor="email">
***REMOVED******REMOVED******REMOVED***  E-mailadres
***REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED***  id="email"
***REMOVED******REMOVED******REMOVED***  type="email"
***REMOVED******REMOVED******REMOVED***  autoComplete="email"
***REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED***  value={email}
***REMOVED******REMOVED******REMOVED***  onChange={(e) => setEmail(e.target.value)}
***REMOVED******REMOVED******REMOVED***  className="mt-2 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED***<label className="text-sm font-medium text-text" htmlFor="password">
***REMOVED******REMOVED******REMOVED***  Wachtwoord
***REMOVED******REMOVED******REMOVED***</label>
***REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED***  id="password"
***REMOVED******REMOVED******REMOVED***  type="password"
***REMOVED******REMOVED******REMOVED***  autoComplete="new-password"
***REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED***  minLength={8}
***REMOVED******REMOVED******REMOVED***  value={password}
***REMOVED******REMOVED******REMOVED***  onChange={(e) => setPassword(e.target.value)}
***REMOVED******REMOVED******REMOVED***  className="mt-2 h-11 w-full rounded-2xl border border-border bg-bg px-3 text-sm outline-none transition focus:border-primary"
***REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED***<p className="mt-1 text-xs text-muted">Minimaal 8 tekens.</p>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  {error && (
***REMOVED******REMOVED******REMOVED***<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED******REMOVED***  {error}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  )}
***REMOVED******REMOVED***  {success && (
***REMOVED******REMOVED******REMOVED***<div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
***REMOVED******REMOVED******REMOVED***  {success}
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  )}

***REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED***type="submit"
***REMOVED******REMOVED******REMOVED***disabled={loading}
***REMOVED******REMOVED******REMOVED***className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark disabled:cursor-not-allowed disabled:opacity-70"
***REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED***{loading ? 'Account aanmaken…' : 'Account aanmaken'}
***REMOVED******REMOVED***  </button>
***REMOVED******REMOVED***</form>

***REMOVED******REMOVED***<p className="mt-5 text-center text-xs text-muted">
***REMOVED******REMOVED***  Heb je al een account?{' '}
***REMOVED******REMOVED***  <a href="/login" className="font-semibold text-primary hover:underline">
***REMOVED******REMOVED******REMOVED***Log dan in
***REMOVED******REMOVED***  </a>
***REMOVED******REMOVED***</p>
***REMOVED***  </div>
***REMOVED***</div>
  );
}
