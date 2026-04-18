const kwartalen = [
  ['Q1 2026', '€ 3.120', '€ 640', 'Ingediend'],
  ['Q2 2026', '€ 2.800', '€ 588', 'Concept'],
  ['Q3 2026', '€ 0', '€ 0', 'Nog starten'],
];

export default function BtwPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">BTW-overzicht</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Bekijk per kwartaal hoeveel btw je moet afdragen.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark">
***REMOVED******REMOVED***  Exporteer aangifte
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  <section className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***<div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[.9fr_1fr_1fr_.9fr]">
***REMOVED******REMOVED***  <span>Kwartaal</span>
***REMOVED******REMOVED***  <span>Belastbare omzet</span>
***REMOVED******REMOVED***  <span>BTW bedrag</span>
***REMOVED******REMOVED***  <span>Status</span>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="mt-3 divide-y divide-border">
***REMOVED******REMOVED***  {kwartalen.map(([kwartaal, omzet, btw, status]) => (
***REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED***  key={kwartaal}
***REMOVED******REMOVED******REMOVED***  className="grid gap-3 py-3 text-sm md:grid-cols-[.9fr_1fr_1fr_.9fr] md:items-center"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">{kwartaal}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{omzet}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{btw}</div>
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">{status}</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  ))}
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
