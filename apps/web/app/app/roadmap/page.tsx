'use client';

const phases = [
  {
***REMOVED***title: 'Fundament',
***REMOVED***status: 'done',
***REMOVED***items: [
***REMOVED***  'Supabase auth en basis app shell',
***REMOVED***  'Facturen CRUD + regels + PDF export',
***REMOVED***  'Klantenbeheer met uitgebreide facturatievelden',
***REMOVED***],
  },
  {
***REMOVED***title: 'Nu in ontwikkeling',
***REMOVED***status: 'active',
***REMOVED***items: [
***REMOVED***  'Factuurflow met aanmaakdatum + automatische vervaldatum',
***REMOVED***  'Slimme factuurnummering per bedrijf en jaar',
***REMOVED***  'In-browser preview en delen (e-mail/WhatsApp)',
***REMOVED***],
  },
  {
***REMOVED***title: 'Volgende stap',
***REMOVED***status: 'next',
***REMOVED***items: [
***REMOVED***  'Versturen vanuit app (mail provider integratie)',
***REMOVED***  'Betalingsstatus en herinneringsautomatisering',
***REMOVED***  'Betaallink per factuur + online betaling',
***REMOVED***],
  },
  {
***REMOVED***title: 'Eindfase',
***REMOVED***status: 'future',
***REMOVED***items: [
***REMOVED***  'Bankkoppeling + automatische matching',
***REMOVED***  'BTW-aangifte assistent',
***REMOVED***  'Rapportages (P&L, cashflow, openstaande posten)',
***REMOVED***],
  },
];

function statusPill(status: string) {
  if (status === 'done') return 'bg-emerald-100 text-emerald-700';
  if (status === 'active') return 'bg-primary/15 text-primary';
  if (status === 'next') return 'bg-amber-100 text-amber-700';
  return 'bg-surface-offset text-muted';
}

function statusText(status: string) {
  if (status === 'done') return 'Klaar';
  if (status === 'active') return 'Actief';
  if (status === 'next') return 'Hierna';
  return 'Later';
}

export default function RoadmapPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header>
***REMOVED******REMOVED***<h1 className="text-lg font-semibold tracking-tight text-text">Roadmap</h1>
***REMOVED******REMOVED***<p className="mt-1 text-sm text-muted">
***REMOVED******REMOVED***  Overzicht van waar je staat in het project en wat de volgende logische stappen zijn.
***REMOVED******REMOVED***</p>
***REMOVED***  </header>

***REMOVED***  <section className="grid gap-4 lg:grid-cols-2">
***REMOVED******REMOVED***{phases.map((phase) => (
***REMOVED******REMOVED***  <article key={phase.title} className="rounded-2xl border border-border bg-surface p-4">
***REMOVED******REMOVED******REMOVED***<div className="mb-3 flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***  <h2 className="text-sm font-semibold text-text">{phase.title}</h2>
***REMOVED******REMOVED******REMOVED***  <span
***REMOVED******REMOVED******REMOVED******REMOVED***className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusPill(
***REMOVED******REMOVED******REMOVED******REMOVED***  phase.status,
***REMOVED******REMOVED******REMOVED******REMOVED***)}`}
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***{statusText(phase.status)}
***REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<ul className="space-y-2 text-xs text-muted">
***REMOVED******REMOVED******REMOVED***  {phase.items.map((item) => (
***REMOVED******REMOVED******REMOVED******REMOVED***<li key={item} className="rounded-xl border border-border/70 bg-bg px-3 py-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  {item}
***REMOVED******REMOVED******REMOVED******REMOVED***</li>
***REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED***</ul>
***REMOVED******REMOVED***  </article>
***REMOVED******REMOVED***))}
***REMOVED***  </section>
***REMOVED***</div>
  );
}
