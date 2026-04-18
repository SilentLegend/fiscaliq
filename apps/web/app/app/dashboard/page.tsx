'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface InvoiceRow {
  id: string;
  issue_date: string;
  due_date: string | null;
  amount_excl: number;
  amount_incl: number;
  vat_rate: number;
  status: string;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('nl-NL', {
***REMOVED***style: 'currency',
***REMOVED***currency: 'EUR',
***REMOVED***minimumFractionDigits: 2,
***REMOVED***maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
***REMOVED***async function loadInvoices() {
***REMOVED***  setLoading(true);
***REMOVED***  setError(null);
***REMOVED***  const { data, error } = await supabase
***REMOVED******REMOVED***.from('invoices')
***REMOVED******REMOVED***.select('id, issue_date, due_date, amount_excl, amount_incl, vat_rate, status')
***REMOVED******REMOVED***.order('issue_date', { ascending: true });

***REMOVED***  if (error) {
***REMOVED******REMOVED***console.error('Kon facturen voor dashboard niet ophalen:', error);
***REMOVED******REMOVED***setError('Kon gegevens voor het dashboard niet laden.');
***REMOVED******REMOVED***setLoading(false);
***REMOVED******REMOVED***return;
***REMOVED***  }

***REMOVED***  setInvoices((data as InvoiceRow[]) ?? []);
***REMOVED***  setLoading(false);
***REMOVED***}

***REMOVED***loadInvoices();
  }, []);

  const today = new Date();
  const todayLabel = today.toLocaleDateString('nl-NL', {
***REMOVED***day: 'numeric',
***REMOVED***month: 'long',
***REMOVED***year: 'numeric',
  });

  const kpis = useMemo(() => {
***REMOVED***if (!invoices.length) {
***REMOVED***  return {
***REMOVED******REMOVED***omzetMaand: 0,
***REMOVED******REMOVED***omzetMaandCount: 0,
***REMOVED******REMOVED***openAmount: 0,
***REMOVED******REMOVED***openCount: 0,
***REMOVED******REMOVED***btwQuarter: 0,
***REMOVED******REMOVED***btwQuarterCount: 0,
***REMOVED***  };
***REMOVED***}

***REMOVED***const now = new Date();
***REMOVED***const year = now.getFullYear();
***REMOVED***const monthIndex = now.getMonth(); // 0-11
***REMOVED***const startOfMonth = new Date(year, monthIndex, 1);
***REMOVED***const quarterIndex = Math.floor(monthIndex / 3); // 0-3
***REMOVED***const startOfQuarter = new Date(year, quarterIndex * 3, 1);

***REMOVED***const monthInvoices = invoices.filter((inv) => {
***REMOVED***  const d = new Date(inv.issue_date);
***REMOVED***  return d >= startOfMonth && d <= now;
***REMOVED***});

***REMOVED***const omzetMaand = monthInvoices.reduce((acc, inv) => acc + (inv.amount_incl || 0), 0);

***REMOVED***// Voor nu: alles wat niet 'betaald' is, telt als openstaand.
***REMOVED***const openInvoices = invoices.filter((inv) => inv.status !== 'betaald');
***REMOVED***const openAmount = openInvoices.reduce((acc, inv) => acc + (inv.amount_incl || 0), 0);
***REMOVED***const openCount = openInvoices.length;

***REMOVED***const quarterInvoices = invoices.filter((inv) => {
***REMOVED***  const d = new Date(inv.issue_date);
***REMOVED***  return d >= startOfQuarter && d <= now;
***REMOVED***});
***REMOVED***const btwQuarter = quarterInvoices.reduce(
***REMOVED***  (acc, inv) => acc + ((inv.amount_incl || 0) - (inv.amount_excl || 0)),
***REMOVED***  0,
***REMOVED***);

***REMOVED***return {
***REMOVED***  omzetMaand,
***REMOVED***  omzetMaandCount: monthInvoices.length,
***REMOVED***  openAmount,
***REMOVED***  openCount,
***REMOVED***  btwQuarter,
***REMOVED***  btwQuarterCount: quarterInvoices.length,
***REMOVED***};
  }, [invoices]);

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***Overzicht van je omzet, openstaande facturen en btw-reservering.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="flex flex-wrap gap-3 text-xs text-muted">
***REMOVED******REMOVED***  <span className="rounded-full border border-border bg-bg px-3 py-1">Vandaag: {todayLabel}</span>
***REMOVED******REMOVED***  <span className="rounded-full border border-border bg-bg px-3 py-1">Alle facturen</span>
***REMOVED******REMOVED***</div>
***REMOVED***  </header>

***REMOVED***  {error && (
***REMOVED******REMOVED***<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED***  {error}
***REMOVED******REMOVED***</div>
***REMOVED***  )}

***REMOVED***  <section className="grid gap-4 md:grid-cols-3">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED***Omzet deze maand
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
***REMOVED******REMOVED******REMOVED***{formatCurrency(kpis.omzetMaand)}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">
***REMOVED******REMOVED******REMOVED***{kpis.omzetMaandCount === 0
***REMOVED******REMOVED******REMOVED***  ? 'Nog geen facturen deze maand'
***REMOVED******REMOVED******REMOVED***  : `${kpis.omzetMaandCount} factuur${kpis.omzetMaandCount === 1 ? '' : 'en'} deze maand`}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED***Openstaande facturen
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
***REMOVED******REMOVED******REMOVED***{formatCurrency(kpis.openAmount)}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">
***REMOVED******REMOVED******REMOVED***{kpis.openCount === 0
***REMOVED******REMOVED******REMOVED***  ? 'Geen openstaande facturen'
***REMOVED******REMOVED******REMOVED***  : `${kpis.openCount} openstaand${kpis.openCount === 1 ? '' : 'e'}`}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED***Btw-reservering (dit kwartaal)
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
***REMOVED******REMOVED******REMOVED***{formatCurrency(kpis.btwQuarter)}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">
***REMOVED******REMOVED******REMOVED***{kpis.btwQuarterCount === 0
***REMOVED******REMOVED******REMOVED***  ? 'Nog geen facturen dit kwartaal'
***REMOVED******REMOVED******REMOVED***  : `Gebaseerd op ${kpis.btwQuarterCount} factuur${
***REMOVED******REMOVED******REMOVED******REMOVED***  kpis.btwQuarterCount === 1 ? '' : 'en'
***REMOVED******REMOVED******REMOVED******REMOVED***}`}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <h2 className="text-lg font-semibold tracking-tight">Cashflow trend</h2>
***REMOVED******REMOVED******REMOVED***  <p className="text-sm text-muted">Rustig dashboard, direct te begrijpen.</p>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="text-xs font-semibold text-muted">Jan - Jun</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-6 flex h-56 items-end gap-3">
***REMOVED******REMOVED******REMOVED***{[34, 42, 39, 58, 66, 81].map((height, index) => (
***REMOVED******REMOVED******REMOVED***  <div key={index} className="flex flex-1 flex-col items-center gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED***  className="w-full rounded-t-2xl bg-primary/90"
***REMOVED******REMOVED******REMOVED******REMOVED***  style={{ height: `${height}%` }}
***REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-xs text-muted">{['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun'][index]}</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <h2 className="text-lg font-semibold tracking-tight">Openstaande acties</h2>
***REMOVED******REMOVED******REMOVED***  <p className="text-sm text-muted">Wat vandaag aandacht vraagt.</p>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-5 space-y-3">
***REMOVED******REMOVED******REMOVED***{[
***REMOVED******REMOVED******REMOVED***  ['Stuur btw-overzicht naar boekhouder', 'Deze week'],
***REMOVED******REMOVED******REMOVED***  ['Herinnering naar 2 klanten', 'Binnen 2 dagen'],
***REMOVED******REMOVED******REMOVED***  ['3 bonnetjes koppelen aan kosten', 'Vandaag'],
***REMOVED******REMOVED******REMOVED***].map(([title, time]) => (
***REMOVED******REMOVED******REMOVED***  <div key={title} className="rounded-2xl border border-border bg-white p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-medium text-text">{title}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="mt-1 text-sm text-muted">{time}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Open
***REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
