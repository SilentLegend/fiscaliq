export default function DashboardPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Overzicht van je omzet, kosten en belangrijkste acties.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="flex flex-wrap gap-3 text-xs text-muted">
***REMOVED******REMOVED***  <span className="rounded-full border border-border bg-bg px-3 py-1">Vandaag: 18 april 2026</span>
***REMOVED******REMOVED***  <span className="rounded-full border border-border bg-bg px-3 py-1">Alles plan</span>
***REMOVED******REMOVED***</div>
***REMOVED***  </header>

***REMOVED***  <section className="grid gap-4 md:grid-cols-3">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Omzet deze maand</div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">€ 6.420</div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">+12% vs vorige maand</div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Openstaande facturen</div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">€ 1.180</div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">4 klanten wachten nog</div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED***  <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">BTW reservering</div>
***REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">€ 1.041</div>
***REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">Klaar voor kwartaal</div>
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
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">Open</span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
