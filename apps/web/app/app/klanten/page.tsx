const klanten = [
  ['Studio Veer', 'Design studio', 'Amsterdam'],
  ['Noord Digital', 'Webbureau', 'Groningen'],
  ['Mika Visuals', 'Fotografie', 'Rotterdam'],
  ['Buro Zuid', 'Marketing', 'Utrecht'],
];

export default function KlantenPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">Klanten</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Je vaste opdrachtgevers en recent toegevoegde klanten.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark">
***REMOVED******REMOVED***  Nieuwe klant
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  <section className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***<div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[1.2fr_.8fr_.8fr]">
***REMOVED******REMOVED***  <span>Naam</span>
***REMOVED******REMOVED***  <span>Type</span>
***REMOVED******REMOVED***  <span>Locatie</span>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="mt-3 divide-y divide-border">
***REMOVED******REMOVED***  {klanten.map(([naam, type, locatie]) => (
***REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED***  key={naam}
***REMOVED******REMOVED******REMOVED***  className="grid gap-3 py-3 text-sm md:grid-cols-[1.2fr_.8fr_.8fr] md:items-center"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">{naam}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{type}</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-muted">{locatie}</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  ))}
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
