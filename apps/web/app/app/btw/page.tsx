const kwartalen = [
  ['Q1 2026', '€ 3.120', '€ 640', 'Ingediend'],
  ['Q2 2026', '€ 2.800', '€ 588', 'Concept'],
  ['Q3 2026', '€ 0', '€ 0', 'Nog starten'],
];

export default function BtwPage() {
  return (
<div className="space-y-6">
  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
<div>
  <h1 className="text-3xl font-semibold tracking-tight">BTW-overzicht</h1>
  <p className="mt-1 text-sm text-muted">Bekijk per kwartaal hoeveel btw je moet afdragen.</p>
</div>
<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark">
  Exporteer aangifte
</button>
  </header>

  <section className="rounded-3xl border border-border bg-bg p-5">
<div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[.9fr_1fr_1fr_.9fr]">
  <span>Kwartaal</span>
  <span>Belastbare omzet</span>
  <span>BTW bedrag</span>
  <span>Status</span>
</div>
<div className="mt-3 divide-y divide-border">
  {kwartalen.map(([kwartaal, omzet, btw, status]) => (
<div
  key={kwartaal}
  className="grid gap-3 py-3 text-sm md:grid-cols-[.9fr_1fr_1fr_.9fr] md:items-center"
>
  <div className="font-medium text-text">{kwartaal}</div>
  <div className="text-muted">{omzet}</div>
  <div className="text-muted">{btw}</div>
  <div>
<span className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">{status}</span>
  </div>
</div>
  ))}
</div>
  </section>
</div>
  );
}
