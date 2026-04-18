const rows = [
  ['2026-04-12', 'FCT-2026-004', 'Studio Veer', '€ 850', 'Verzonden'],
  ['2026-04-08', 'FCT-2026-003', 'Noord Digital', '€ 125', 'Betaald'],
  ['2026-04-03', 'FCT-2026-002', 'Mika Visuals', '€ 480', 'Concept'],
  ['2026-03-27', 'FCT-2026-001', 'Buro Zuid', '€ 320', 'Herinnering'],
];

export default function FacturenPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">Facturen</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Overzicht van al je facturen, statussen en bedragen.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark">
***REMOVED******REMOVED***  Nieuwe factuur
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  <section className="overflow-hidden rounded-3xl border border-border bg-bg">
***REMOVED******REMOVED***<div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
***REMOVED******REMOVED***  <div className="text-sm font-medium text-muted">Laatste facturen</div>
***REMOVED******REMOVED***  <div className="flex flex-wrap gap-2 text-xs text-muted">
***REMOVED******REMOVED******REMOVED***<button className="rounded-full border border-border bg-surface px-3 py-1">Alle</button>
***REMOVED******REMOVED******REMOVED***<button className="rounded-full border border-border bg-surface px-3 py-1">Openstaand</button>
***REMOVED******REMOVED******REMOVED***<button className="rounded-full border border-border bg-surface px-3 py-1">Betaald</button>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="divide-y divide-border">
***REMOVED******REMOVED***  <div className="grid gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[1.1fr_.9fr_.9fr_.5fr_.7fr]">
***REMOVED******REMOVED******REMOVED***<span>Klant</span>
***REMOVED******REMOVED******REMOVED***<span>Factuur</span>
***REMOVED******REMOVED******REMOVED***<span>Datum</span>
***REMOVED******REMOVED******REMOVED***<span>Bedrag</span>
***REMOVED******REMOVED******REMOVED***<span>Status</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  {rows.map(([datum, nummer, klant, bedrag, status]) => (
***REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED***  key={nummer}
***REMOVED******REMOVED******REMOVED***  className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1.1fr_.9fr_.9fr_.5fr_.7fr] md:items-center"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">{klant}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{nummer}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{datum}</div>
***REMOVED******REMOVED******REMOVED***  <div className="font-semibold text-text">{bedrag}</div>
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
