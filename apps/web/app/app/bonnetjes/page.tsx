const kosten = [
  ['2026-04-10', 'Trein naar klant', 'Reiskosten', '€ 23,40'],
  ['2026-04-07', 'Adobe abonnement', 'Software', '€ 31,99'],
  ['2026-04-05', 'Lunch overleg', 'Relatiekosten', '€ 18,20'],
];

export default function BonnetjesPage() {
  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-3xl font-semibold tracking-tight">Bonnetjes</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">Upload en beheer je kostenbonnen.</p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-primaryDark">
***REMOVED******REMOVED***  Bonnetje uploaden
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <div className="grid gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted md:grid-cols-[.9fr_1.1fr_.9fr_.6fr]">
***REMOVED******REMOVED******REMOVED***<span>Datum</span>
***REMOVED******REMOVED******REMOVED***<span>Omschrijving</span>
***REMOVED******REMOVED******REMOVED***<span>Categorie</span>
***REMOVED******REMOVED******REMOVED***<span>Bedrag</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-3 divide-y divide-border">
***REMOVED******REMOVED******REMOVED***{kosten.map(([datum, omschrijving, categorie, bedrag]) => (
***REMOVED******REMOVED******REMOVED***  <div
***REMOVED******REMOVED******REMOVED******REMOVED***key={omschrijving}
***REMOVED******REMOVED******REMOVED******REMOVED***className="grid gap-3 py-3 text-sm md:grid-cols-[.9fr_1.1fr_.9fr_.6fr] md:items-center"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-muted">{datum}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-medium text-text">{omschrijving}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-muted">{categorie}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="font-semibold text-text">{bedrag}</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED***  <h2 className="text-lg font-semibold tracking-tight">Snel bonnetjes vastleggen</h2>
***REMOVED******REMOVED***  <p className="mt-2 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***In de echte app scan je hier bonnetjes met je telefoon, koppel je ze direct aan een categorie en is je administratie altijd bij.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***  <div className="mt-4 grid gap-3 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***<span>• Sleep bestanden hierheen of klik om te uploaden</span>
***REMOVED******REMOVED******REMOVED***<span>• Ondersteunde formaten: JPG, PNG, PDF</span>
***REMOVED******REMOVED******REMOVED***<span>• Automatische datum- en bedragherkenning (roadmap)</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</div>
  );
}
