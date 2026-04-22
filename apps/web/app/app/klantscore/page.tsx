'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface InvoiceRow {
  id: string;
  customer_name: string;
  due_date: string | null;
  amount_incl: number;
  status: string;
  issue_date: string;
}

interface CustomerScore {
  customerName: string;
  totalInvoices: number;
  overdueInvoices: number;
  overdueAmount: number;
  averageDaysLate: number;
  score: number;
}

export default function KlantscorePage() {
  const [scores, setScores] = useState<CustomerScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
loadScores();
  }, []);

  async function loadScores() {
setLoading(true);

// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('Auth user:', user?.id);

const { data: invoices, error: invoicesError } = await supabase
  .from('invoices')
  .select('*')
  .order('due_date', { ascending: false });

if (invoicesError) {
  console.error('Error loading invoices:', invoicesError);
  setLoading(false);
  return;
}

if (!invoices) {
  console.log('No invoices returned');
  setLoading(false);
  return;
}

console.log('Loaded invoices:', invoices.length, invoices);

const now = new Date();
const customerData: { [key: string]: InvoiceRow[] } = {};

(invoices as InvoiceRow[]).forEach((invoice) => {
  if (!customerData[invoice.customer_name]) {
customerData[invoice.customer_name] = [];
  }
  customerData[invoice.customer_name].push(invoice);
});

const calculatedScores: CustomerScore[] = Object.entries(customerData).map(
  ([customerName, invoices]) => {
const openInvoices = invoices.filter((inv) => inv.status !== 'concept');
const overdueInvoices = openInvoices.filter((inv) => {
  if (!inv.due_date) return false;
  const dueDate = new Date(inv.due_date);
  return dueDate < now;
});

const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.amount_incl || 0), 0);
const daysLate = overdueInvoices
  .map((inv) => {
const dueDate = new Date(inv.due_date || new Date());
const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
return Math.max(0, daysOverdue);
  });

const averageDaysLate =
  daysLate.length > 0 ? Math.round(daysLate.reduce((a, b) => a + b, 0) / daysLate.length) : 0;

// Score: 100 = perfect, lowers based on overdue invoices
const overdueRatio = invoices.length > 0 ? overdueInvoices.length / invoices.length : 0;
const score = Math.max(0, Math.round(100 - overdueRatio * 40 - averageDaysLate * 0.5));

return {
  customerName,
  totalInvoices: invoices.length,
  overdueInvoices: overdueInvoices.length,
  overdueAmount,
  averageDaysLate,
  score,
};
  },
);

setScores(calculatedScores.sort((a, b) => b.score - a.score));
setLoading(false);
  }

  const scoreColor = (score: number) => {
if (score >= 80) return 'text-emerald-600 bg-emerald-50';
if (score >= 60) return 'text-yellow-600 bg-yellow-50';
return 'text-rose-600 bg-rose-50';
  };

  return (
<div className="space-y-6">
  <header>
<h1 className="text-lg font-semibold tracking-tight text-text">Klantscore</h1>
<p className="mt-1 text-sm text-muted">
  Betaalgedrag per klant gebaseerd op verzonden facturen.
</p>
  </header>

  {loading ? (
<div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
  Scores laden...
</div>
  ) : scores.length === 0 ? (
<div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
  Geen facturen gevonden. Voeg facturen toe om scores te zien.
</div>
  ) : (
<section className="rounded-2xl border border-border bg-surface overflow-hidden">
  <table className="min-w-full text-left text-sm">
<thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
  <tr>
<th className="px-4 py-3">Klant</th>
<th className="px-4 py-3 text-center">Totaal facturen</th>
<th className="px-4 py-3 text-center">Vervallen</th>
<th className="px-4 py-3 text-right">Openstaand bedrag</th>
<th className="px-4 py-3 text-center">Gem. dagen te laat</th>
<th className="px-4 py-3 text-center">Score</th>
  </tr>
</thead>
<tbody>
  {scores.map((score, idx) => (
<tr
  key={idx}
  className="border-t border-border/60 hover:bg-surface-offset/50 transition"
>
  <td className="px-4 py-3 text-xs font-medium text-text">{score.customerName}</td>
  <td className="px-4 py-3 text-xs text-center text-muted">{score.totalInvoices}</td>
  <td className="px-4 py-3 text-xs text-center">
{score.overdueInvoices > 0 ? (
  <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 font-medium">
{score.overdueInvoices}
  </span>
) : (
  <span className="text-emerald-600">—</span>
)}
  </td>
  <td className="px-4 py-3 text-xs text-right font-mono text-text">
{score.overdueAmount > 0 ? (
  <span className="text-rose-600 font-medium">
€{score.overdueAmount.toFixed(2).replace('.', ',')}
  </span>
) : (
  '—'
)}
  </td>
  <td className="px-4 py-3 text-xs text-center text-muted">
{score.averageDaysLate > 0 ? `${score.averageDaysLate} dagen` : '—'}
  </td>
  <td className="px-4 py-3 text-xs text-center">
<span
  className={`inline-flex rounded-full px-3 py-1 font-semibold ${scoreColor(
score.score,
  )}`}
>
  {score.score}
</span>
  </td>
</tr>
  ))}
</tbody>
  </table>
</section>
  )}

  <section className="rounded-2xl border border-border bg-surface p-4 text-xs text-muted">
<div className="font-medium text-text mb-2">Hoe werkt de klantscore?</div>
<ul className="space-y-1 ml-4 list-disc">
  <li><strong>Score 80-100:</strong> Betrouwbare klant (weinig tot geen vervallen facturen)</li>
  <li><strong>Score 60-79:</strong> Matig betaalprofiel (enkele vervallen facturen)</li>
  <li><strong>Score &lt;60:</strong> Riskant betaalprofiel (meerdere vervallen facturen)</li>
  <li><strong>Vervallen:</strong> Aantal openstaande facturen voorbij vervaldatum</li>
  <li><strong>Gem. dagen te laat:</strong> Gemiddeld aantal dagen dat klant achter staat</li>
</ul>
  </section>
</div>
  );
}
