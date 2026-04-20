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
***REMOVED***loadScores();
  }, []);

  async function loadScores() {
***REMOVED***setLoading(true);
***REMOVED***const { data: invoices, error: invoicesError } = await supabase
***REMOVED***  .from('invoices')
***REMOVED***  .select('*')
***REMOVED***  .order('due_date', { ascending: false });

***REMOVED***if (invoicesError || !invoices) {
***REMOVED***  console.error('Error loading invoices:', invoicesError);
***REMOVED***  setLoading(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const now = new Date();
***REMOVED***const customerData: { [key: string]: InvoiceRow[] } = {};

***REMOVED***(invoices as InvoiceRow[]).forEach((invoice) => {
***REMOVED***  if (!customerData[invoice.customer_name]) {
***REMOVED******REMOVED***customerData[invoice.customer_name] = [];
***REMOVED***  }
***REMOVED***  customerData[invoice.customer_name].push(invoice);
***REMOVED***});

***REMOVED***const calculatedScores: CustomerScore[] = Object.entries(customerData).map(
***REMOVED***  ([customerName, invoices]) => {
***REMOVED******REMOVED***const openInvoices = invoices.filter((inv) => inv.status !== 'concept');
***REMOVED******REMOVED***const overdueInvoices = openInvoices.filter((inv) => {
***REMOVED******REMOVED***  if (!inv.due_date) return false;
***REMOVED******REMOVED***  const dueDate = new Date(inv.due_date);
***REMOVED******REMOVED***  return dueDate < now;
***REMOVED******REMOVED***});

***REMOVED******REMOVED***const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + (inv.amount_incl || 0), 0);
***REMOVED******REMOVED***const daysLate = overdueInvoices
***REMOVED******REMOVED***  .map((inv) => {
***REMOVED******REMOVED******REMOVED***const dueDate = new Date(inv.due_date || new Date());
***REMOVED******REMOVED******REMOVED***const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
***REMOVED******REMOVED******REMOVED***return Math.max(0, daysOverdue);
***REMOVED******REMOVED***  });

***REMOVED******REMOVED***const averageDaysLate =
***REMOVED******REMOVED***  daysLate.length > 0 ? Math.round(daysLate.reduce((a, b) => a + b, 0) / daysLate.length) : 0;

***REMOVED******REMOVED***// Score: 100 = perfect, lowers based on overdue invoices
***REMOVED******REMOVED***const overdueRatio = invoices.length > 0 ? overdueInvoices.length / invoices.length : 0;
***REMOVED******REMOVED***const score = Math.max(0, Math.round(100 - overdueRatio * 40 - averageDaysLate * 0.5));

***REMOVED******REMOVED***return {
***REMOVED******REMOVED***  customerName,
***REMOVED******REMOVED***  totalInvoices: invoices.length,
***REMOVED******REMOVED***  overdueInvoices: overdueInvoices.length,
***REMOVED******REMOVED***  overdueAmount,
***REMOVED******REMOVED***  averageDaysLate,
***REMOVED******REMOVED***  score,
***REMOVED******REMOVED***};
***REMOVED***  },
***REMOVED***);

***REMOVED***setScores(calculatedScores.sort((a, b) => b.score - a.score));
***REMOVED***setLoading(false);
  }

  const scoreColor = (score: number) => {
***REMOVED***if (score >= 80) return 'text-emerald-600 bg-emerald-50';
***REMOVED***if (score >= 60) return 'text-yellow-600 bg-yellow-50';
***REMOVED***return 'text-rose-600 bg-rose-50';
  };

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header>
***REMOVED******REMOVED***<h1 className="text-lg font-semibold tracking-tight text-text">Klantscore</h1>
***REMOVED******REMOVED***<p className="mt-1 text-sm text-muted">
***REMOVED******REMOVED***  Betaalgedrag per klant gebaseerd op verzonden facturen.
***REMOVED******REMOVED***</p>
***REMOVED***  </header>

***REMOVED***  {loading ? (
***REMOVED******REMOVED***<div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
***REMOVED******REMOVED***  Scores laden...
***REMOVED******REMOVED***</div>
***REMOVED***  ) : scores.length === 0 ? (
***REMOVED******REMOVED***<div className="rounded-2xl border border-border bg-surface p-6 text-center text-sm text-muted">
***REMOVED******REMOVED***  Geen facturen gevonden. Voeg facturen toe om scores te zien.
***REMOVED******REMOVED***</div>
***REMOVED***  ) : (
***REMOVED******REMOVED***<section className="rounded-2xl border border-border bg-surface overflow-hidden">
***REMOVED******REMOVED***  <table className="min-w-full text-left text-sm">
***REMOVED******REMOVED******REMOVED***<thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Klant</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-center">Totaal facturen</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-center">Vervallen</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-right">Openstaand bedrag</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-center">Gem. dagen te laat</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-center">Score</th>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***</thead>
***REMOVED******REMOVED******REMOVED***<tbody>
***REMOVED******REMOVED******REMOVED***  {scores.map((score, idx) => (
***REMOVED******REMOVED******REMOVED******REMOVED***<tr
***REMOVED******REMOVED******REMOVED******REMOVED***  key={idx}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="border-t border-border/60 hover:bg-surface-offset/50 transition"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs font-medium text-text">{score.customerName}</td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-center text-muted">{score.totalInvoices}</td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{score.overdueInvoices > 0 ? (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-rose-700 font-medium">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{score.overdueInvoices}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***) : (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-emerald-600">—</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-right font-mono text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{score.overdueAmount > 0 ? (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-rose-600 font-medium">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***€{score.overdueAmount.toFixed(2).replace('.', ',')}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***) : (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  '—'
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-center text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{score.averageDaysLate > 0 ? `${score.averageDaysLate} dagen` : '—'}
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-3 text-xs text-center">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className={`inline-flex rounded-full px-3 py-1 font-semibold ${scoreColor(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***score.score,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  )}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {score.score}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED***</tbody>
***REMOVED******REMOVED***  </table>
***REMOVED******REMOVED***</section>
***REMOVED***  )}

***REMOVED***  <section className="rounded-2xl border border-border bg-surface p-4 text-xs text-muted">
***REMOVED******REMOVED***<div className="font-medium text-text mb-2">Hoe werkt de klantscore?</div>
***REMOVED******REMOVED***<ul className="space-y-1 ml-4 list-disc">
***REMOVED******REMOVED***  <li><strong>Score 80-100:</strong> Betrouwbare klant (weinig tot geen vervallen facturen)</li>
***REMOVED******REMOVED***  <li><strong>Score 60-79:</strong> Matig betaalprofiel (enkele vervallen facturen)</li>
***REMOVED******REMOVED***  <li><strong>Score &lt;60:</strong> Riskant betaalprofiel (meerdere vervallen facturen)</li>
***REMOVED******REMOVED***  <li><strong>Vervallen:</strong> Aantal openstaande facturen voorbij vervaldatum</li>
***REMOVED******REMOVED***  <li><strong>Gem. dagen te laat:</strong> Gemiddeld aantal dagen dat klant achter staat</li>
***REMOVED******REMOVED***</ul>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
