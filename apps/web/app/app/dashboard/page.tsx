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
style: 'currency',
currency: 'EUR',
minimumFractionDigits: 2,
maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
async function loadInvoices() {
  setLoading(true);
  setError(null);
  const { data, error } = await supabase
.from('invoices')
.select('id, issue_date, due_date, amount_excl, amount_incl, vat_rate, status')
.order('issue_date', { ascending: true });

  if (error) {
console.error('Kon facturen voor dashboard niet ophalen:', error);
setError('Kon gegevens voor het dashboard niet laden.');
setLoading(false);
return;
  }

  setInvoices((data as InvoiceRow[]) ?? []);
  setLoading(false);
}

loadInvoices();
  }, []);

  const today = new Date();
  const todayLabel = today.toLocaleDateString('nl-NL', {
day: 'numeric',
month: 'long',
year: 'numeric',
  });

  const kpis = useMemo(() => {
if (!invoices.length) {
  return {
omzetMaandBruto: 0,
omzetMaandNetto: 0,
omzetMaandCount: 0,
openAmount: 0,
openCount: 0,
btwQuarter: 0,
btwQuarterCount: 0,
  };
}

const now = new Date();
const year = now.getFullYear();
const monthIndex = now.getMonth(); // 0-11
const startOfMonth = new Date(year, monthIndex, 1);
const quarterIndex = Math.floor(monthIndex / 3); // 0-3
const startOfQuarter = new Date(year, quarterIndex * 3, 1);

const monthInvoices = invoices.filter((inv) => {
  const d = new Date(inv.issue_date);
  return d >= startOfMonth && d <= now;
});

const omzetMaandBruto = monthInvoices.reduce((acc, inv) => acc + (inv.amount_incl || 0), 0);
const omzetMaandNetto = monthInvoices.reduce((acc, inv) => acc + (inv.amount_excl || 0), 0);

// Voor nu: alles wat niet 'betaald' is, telt als openstaand.
const openInvoices = invoices.filter((inv) => inv.status !== 'betaald');
const openAmount = openInvoices.reduce((acc, inv) => acc + (inv.amount_incl || 0), 0);
const openCount = openInvoices.length;

const quarterInvoices = invoices.filter((inv) => {
  const d = new Date(inv.issue_date);
  return d >= startOfQuarter && d <= now;
});
const btwQuarter = quarterInvoices.reduce(
  (acc, inv) => acc + ((inv.amount_incl || 0) - (inv.amount_excl || 0)),
  0,
);

return {
  omzetMaandBruto,
  omzetMaandNetto,
  omzetMaandCount: monthInvoices.length,
  openAmount,
  openCount,
  btwQuarter,
  btwQuarterCount: quarterInvoices.length,
};
  }, [invoices]);

  return (
<div className="space-y-6">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
<div>
  <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
  <p className="mt-1 text-sm text-muted">
Overzicht van je omzet, openstaande facturen en btw-reservering.
  </p>
</div>
<div className="flex flex-wrap gap-3 text-xs text-muted">
  <span className="rounded-full border border-border bg-bg px-3 py-1">Vandaag: {todayLabel}</span>
  <span className="rounded-full border border-border bg-bg px-3 py-1">Alle facturen</span>
</div>
  </header>

  {error && (
<div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
  {error}
</div>
  )}

  <section className="grid gap-4 md:grid-cols-3">
<div className="rounded-3xl border border-border bg-bg px-4 py-3">
  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
Omzet deze maand (excl. btw)
  </div>
  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
{formatCurrency(kpis.omzetMaandNetto)}
  </div>
  <div className="mt-1 text-xs font-semibold text-primary">
{`Incl. btw: ${formatCurrency(kpis.omzetMaandBruto)} • `}
{kpis.omzetMaandCount === 0
  ? 'Nog geen facturen deze maand'
  : `${kpis.omzetMaandCount} factuur${kpis.omzetMaandCount === 1 ? '' : 'en'} deze maand`}
  </div>
</div>
<div className="rounded-3xl border border-border bg-bg px-4 py-3">
  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
Openstaande facturen
  </div>
  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
{formatCurrency(kpis.openAmount)}
  </div>
  <div className="mt-1 text-xs font-semibold text-primary">
{kpis.openCount === 0
  ? 'Geen openstaande facturen'
  : `${kpis.openCount} openstaand${kpis.openCount === 1 ? '' : 'e'}`}
  </div>
</div>
<div className="rounded-3xl border border-border bg-bg px-4 py-3">
  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
Btw-reservering (dit kwartaal)
  </div>
  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">
{formatCurrency(kpis.btwQuarter)}
  </div>
  <div className="mt-1 text-xs font-semibold text-primary">
{kpis.btwQuarterCount === 0
  ? 'Nog geen facturen dit kwartaal'
  : `Gebaseerd op ${kpis.btwQuarterCount} factuur${
  kpis.btwQuarterCount === 1 ? '' : 'en'
}`}
  </div>
</div>
  </section>

  <section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
<div className="rounded-3xl border border-border bg-bg p-5">
  <div className="flex items-center justify-between">
<div>
  <h2 className="text-lg font-semibold tracking-tight">Cashflow trend</h2>
  <p className="text-sm text-muted">Rustig dashboard, direct te begrijpen.</p>
</div>
<div className="text-xs font-semibold text-muted">Jan - Jun</div>
  </div>
  <div className="mt-6 flex h-56 items-end gap-3">
{[34, 42, 39, 58, 66, 81].map((height, index) => (
  <div key={index} className="flex flex-1 flex-col items-center gap-2">
<div
  className="w-full rounded-t-2xl bg-primary/90"
  style={{ height: `${height}%` }}
/>
<span className="text-xs text-muted">{['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun'][index]}</span>
  </div>
))}
  </div>
</div>
<div className="rounded-3xl border border-border bg-bg p-5">
  <div className="flex items-center justify-between">
<div>
  <h2 className="text-lg font-semibold tracking-tight">Openstaande acties</h2>
  <p className="text-sm text-muted">Wat vandaag aandacht vraagt.</p>
</div>
  </div>
  <div className="mt-5 space-y-3">
{[
  ['Stuur btw-overzicht naar boekhouder', 'Deze week'],
  ['Herinnering naar 2 klanten', 'Binnen 2 dagen'],
  ['3 bonnetjes koppelen aan kosten', 'Vandaag'],
].map(([title, time]) => (
  <div key={title} className="rounded-2xl border border-border bg-white p-4">
<div className="flex items-center justify-between gap-3">
  <div>
<div className="font-medium text-text">{title}</div>
<div className="mt-1 text-sm text-muted">{time}</div>
  </div>
  <span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">
Open
  </span>
</div>
  </div>
))}
  </div>
</div>
  </section>
</div>
  );
}
