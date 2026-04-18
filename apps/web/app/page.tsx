const features = [
  {
***REMOVED***title: 'Facturen zonder gedoe',
***REMOVED***body: 'Maak offertes, zet ze om naar facturen en stuur herinneringen vanuit één rustige flow.',
  },
  {
***REMOVED***title: 'Bonnetjes en kosten',
***REMOVED***body: 'Upload bonnetjes, categoriseer kosten en houd grip op je administratie zonder losse tools.',
  },
  {
***REMOVED***title: 'BTW overzicht',
***REMOVED***body: 'Zie direct wat je moet reserveren en werk rustig toe naar je kwartaal-aangifte.',
  },
  {
***REMOVED***title: 'Bankkoppeling klaar voor later',
***REMOVED***body: 'De frontend is voorbereid op PSD2-koppelingen en automatische matching van transacties.',
  },
];

const invoices = [
  ['Website sprint', 'Studio Veer', '€ 850', 'Verzonden'],
  ['Onderhoud april', 'Noord Digital', '€ 125', 'Betaald'],
  ['Fotoshoot dagdeel', 'Mika Visuals', '€ 480', 'Concept'],
  ['SEO advies', 'Buro Zuid', '€ 320', 'Herinnering'],
];

const nav = ['Product', 'Functies', 'Dashboard', 'Prijzen', 'Contact'];

export default function HomePage() {
  return (
***REMOVED***<main className="min-h-screen bg-bg text-text">
***REMOVED***  <header className="sticky top-0 z-50 border-b border-border/80 bg-bg/90 backdrop-blur">
***REMOVED******REMOVED***<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
***REMOVED******REMOVED***  <div className="flex items-center gap-3">
***REMOVED******REMOVED******REMOVED***<div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-surface shadow-soft">
***REMOVED******REMOVED******REMOVED***  <span className="text-lg font-bold text-primary">F</span>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-lg font-semibold tracking-tight">Fiscaliq</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-xs text-muted">boekhouden voor zzp’ers</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <nav className="hidden items-center gap-7 md:flex">
***REMOVED******REMOVED******REMOVED***{nav.map((item) => (
***REMOVED******REMOVED******REMOVED***  <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted transition hover:text-text">
***REMOVED******REMOVED******REMOVED******REMOVED***{item}
***REMOVED******REMOVED******REMOVED***  </a>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </nav>
***REMOVED******REMOVED***  <div className="flex items-center gap-3">
***REMOVED******REMOVED******REMOVED***<button className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text md:inline-flex">
***REMOVED******REMOVED******REMOVED***  Demo bekijken
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark">
***REMOVED******REMOVED******REMOVED***  Start gratis
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </header>

***REMOVED***  <section id="product" className="mx-auto grid max-w-7xl gap-10 px-6 pb-14 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-20 lg:pt-20">
***REMOVED******REMOVED***<div className="flex flex-col justify-center">
***REMOVED******REMOVED***  <div className="mb-5 inline-flex w-fit items-center rounded-full bg-highlight px-4 py-2 text-sm font-semibold text-primary">
***REMOVED******REMOVED******REMOVED***Eerlijk geprijsd • strak ontworpen • gemaakt voor kleine zzp’ers
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-text sm:text-6xl lg:text-7xl">
***REMOVED******REMOVED******REMOVED***Boekhouden zonder chaos. Gewoon overzicht, rust en grip.
***REMOVED******REMOVED***  </h1>
***REMOVED******REMOVED***  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
***REMOVED******REMOVED******REMOVED***Fiscaliq is ontworpen als een modern, minimalistisch boekhoudplatform voor zelfstandigen die hun administratie snel willen regelen,
***REMOVED******REMOVED******REMOVED***zonder overvolle schermen, onduidelijke pakketten of dure verrassingen.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***  <div className="mt-8 flex flex-wrap gap-4">
***REMOVED******REMOVED******REMOVED***<button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark">
***REMOVED******REMOVED******REMOVED***  Vraag early access aan
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***<button className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-text transition hover:bg-white">
***REMOVED******REMOVED******REMOVED***  Bekijk de interface
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***<span className="rounded-full border border-border bg-surface px-4 py-2">Facturen & offertes</span>
***REMOVED******REMOVED******REMOVED***<span className="rounded-full border border-border bg-surface px-4 py-2">BTW-overzicht</span>
***REMOVED******REMOVED******REMOVED***<span className="rounded-full border border-border bg-surface px-4 py-2">Bonnetjes</span>
***REMOVED******REMOVED******REMOVED***<span className="rounded-full border border-border bg-surface px-4 py-2">Bankkoppeling voorbereid</span>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="rounded-[2rem] border border-border bg-surface p-4 shadow-float lg:p-5">
***REMOVED******REMOVED***  <div className="overflow-hidden rounded-[1.6rem] border border-border bg-white">
***REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between border-b border-border px-5 py-4">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold text-text">Dashboard</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-xs text-muted">Vandaag • 18 april 2026</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div className="rounded-full bg-highlight px-3 py-1 text-xs font-semibold text-primary">Alles plan</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="grid gap-4 p-4 lg:grid-cols-[220px_1fr]">
***REMOVED******REMOVED******REMOVED***  <aside className="rounded-3xl border border-border bg-bg p-3">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Werkruimte</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  {['Dashboard', 'Facturen', 'Klanten', 'Bonnetjes', 'BTW', 'Instellingen'].map((item, i) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  key={item}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className={`rounded-2xl px-4 py-3 text-sm font-medium ${
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***i === 0 ? 'bg-highlight text-primary' : 'text-muted'
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {item}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </aside>
***REMOVED******REMOVED******REMOVED***  <div className="space-y-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 sm:grid-cols-3">
***REMOVED******REMOVED******REMOVED******REMOVED***  {[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['Omzet deze maand', '€ 6.420', '+12% vs vorige maand'],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['Openstaande facturen', '€ 1.180', '4 klanten wachten nog'],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['BTW reservering', '€ 1.041', 'Klaar voor kwartaal'],
***REMOVED******REMOVED******REMOVED******REMOVED***  ].map(([label, amount, note]) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div key={label} className="rounded-3xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="text-sm text-muted">{label}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-2 text-3xl font-semibold tracking-tight text-text">{amount}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-2 text-sm text-primary">{note}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-lg font-semibold tracking-tight">Cashflow trend</h2>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-sm text-muted">Rustig dashboard, direct te begrijpen</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="text-xs font-semibold text-muted">Jan - Jun</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="mt-6 flex h-56 items-end gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {[34, 42, 39, 58, 66, 81].map((height, index) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div key={index} className="flex flex-1 flex-col items-center gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="w-full rounded-t-2xl bg-primary/90"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{ height: `${height}%` }}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-xs text-muted">{['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun'][index]}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="rounded-3xl border border-border bg-bg p-5">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex items-center justify-between">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-lg font-semibold tracking-tight">Openstaande acties</h2>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-sm text-muted">Wat vandaag aandacht vraagt</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div className="mt-5 space-y-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  {[
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['BTW check kwartaal 2', 'Vandaag', 'bg-amber-100 text-amber-700'],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['Herinnering naar 2 klanten', 'Binnen 2 dagen', 'bg-rose-100 text-rose-700'],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***['3 bonnetjes nog te koppelen', 'Nu open', 'bg-emerald-100 text-emerald-700'],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ].map(([title, time, color]) => (
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div key={title} className="rounded-2xl border border-border bg-white p-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="flex items-center justify-between gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">{title}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-1 text-sm text-muted">{time}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>Open</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  <section id="functies" className="border-y border-border/70 bg-surface py-20">
***REMOVED******REMOVED***<div className="mx-auto max-w-7xl px-6 lg:px-8">
***REMOVED******REMOVED***  <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Functies</div>
***REMOVED******REMOVED******REMOVED***  <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED******REMOVED***Alles wat een kleine zzp’er nodig heeft. Niets wat afleidt.
***REMOVED******REMOVED******REMOVED***  </h2>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<p className="max-w-xl text-base leading-7 text-muted">
***REMOVED******REMOVED******REMOVED***  De interface is bewust strak en rustig opgezet: duidelijke blokken, veel witruimte en altijd één logische volgende stap.
***REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
***REMOVED******REMOVED******REMOVED***{features.map((feature, index) => (
***REMOVED******REMOVED******REMOVED***  <article key={feature.title} className="rounded-[1.75rem] border border-border bg-bg p-6 shadow-soft">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-highlight text-sm font-bold text-primary">
***REMOVED******REMOVED******REMOVED******REMOVED***  0{index + 1}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="text-xl font-semibold tracking-tight text-text">{feature.title}</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="mt-3 text-sm leading-7 text-muted">{feature.body}</p>
***REMOVED******REMOVED******REMOVED***  </article>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  <section id="dashboard" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
***REMOVED******REMOVED***<div className="mb-12 max-w-3xl">
***REMOVED******REMOVED***  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Facturen</div>
***REMOVED******REMOVED***  <h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED***Een facturatie-overzicht dat direct vertrouwen geeft.
***REMOVED******REMOVED***  </h2>
***REMOVED******REMOVED***  <p className="mt-4 text-base leading-8 text-muted">
***REMOVED******REMOVED******REMOVED***Geen rommelige tabellen, maar een moderne lijstweergave met duidelijke statuskleuren, bedragen en klantnamen.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="overflow-hidden rounded-[2rem] border border-border bg-surface shadow-float">
***REMOVED******REMOVED***  <div className="flex flex-col gap-4 border-b border-border px-6 py-5 md:flex-row md:items-center md:justify-between">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-xl font-semibold tracking-tight text-text">Facturen</div>
***REMOVED******REMOVED******REMOVED***  <div className="text-sm text-muted">12 totaal • 4 openstaand • 6 betaald</div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div className="flex flex-wrap gap-3">
***REMOVED******REMOVED******REMOVED***  <button className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text">Filter</button>
***REMOVED******REMOVED******REMOVED***  <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white">Nieuwe factuur</button>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <div className="divide-y divide-border">
***REMOVED******REMOVED******REMOVED***{invoices.map(([title, client, amount, status]) => (
***REMOVED******REMOVED******REMOVED***  <div key={title} className="grid gap-4 px-6 py-5 md:grid-cols-[1.2fr_1fr_.7fr_.6fr] md:items-center">
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="font-semibold text-text">{title}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-1 text-sm text-muted">{client}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-sm text-muted">Factuurdatum · 18 april 2026</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-lg font-semibold tracking-tight text-text">{amount}</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="rounded-full bg-highlight px-3 py-1.5 text-xs font-semibold text-primary">{status}</span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  <section id="prijzen" className="bg-surface py-20">
***REMOVED******REMOVED***<div className="mx-auto max-w-5xl px-6 lg:px-8">
***REMOVED******REMOVED***  <div className="rounded-[2.2rem] border border-border bg-bg p-8 shadow-float sm:p-10">
***REMOVED******REMOVED******REMOVED***<div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Prijsmodel</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED******REMOVED***  Eén pakket. Alles erin. Gewoon eerlijk.
***REMOVED******REMOVED******REMOVED******REMOVED***</h2>
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="mt-4 max-w-2xl text-base leading-8 text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Geen onduidelijke lagen, geen psychologische upsells, geen “essentiële feature alleen in premium”. Fiscaliq is gemaakt om te helpen,
***REMOVED******REMOVED******REMOVED******REMOVED***  niet om klanten door prijsmuren te duwen.
***REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <div className="rounded-[1.8rem] border border-border bg-white p-7 shadow-soft">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Fiscaliq alles</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="mt-3 text-6xl font-semibold tracking-tight text-text">€9,95</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="mt-2 text-sm text-muted">per maand · opzegbaar</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<ul className="mt-6 space-y-3 text-sm text-text">
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Facturen en offertes</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Bonnetjes en kosten</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ BTW-overzicht</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Dashboard en rapportages</li>
***REMOVED******REMOVED******REMOVED******REMOVED***  <li>✓ Voorbereid op bankkoppeling</li>
***REMOVED******REMOVED******REMOVED******REMOVED***</ul>
***REMOVED******REMOVED******REMOVED******REMOVED***<button className="mt-8 w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
***REMOVED******REMOVED******REMOVED******REMOVED***  Ik wil early access
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  <section id="contact" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
***REMOVED******REMOVED***<div className="grid gap-8 rounded-[2rem] border border-border bg-surface p-8 shadow-soft lg:grid-cols-[1.1fr_.9fr] lg:p-10">
***REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED***<div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-muted">Launch</div>
***REMOVED******REMOVED******REMOVED***<h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED***  Klaar om vertrouwen op te bouwen vanaf dag één.
***REMOVED******REMOVED******REMOVED***</h2>
***REMOVED******REMOVED******REMOVED***<p className="mt-4 max-w-2xl text-base leading-8 text-muted">
***REMOVED******REMOVED******REMOVED***  Deze frontend is de eerste publieke basis voor fiscaliq.nl: modern, minimalistisch en ontworpen om meteen professioneel over te komen.
***REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <form className="grid gap-4 rounded-[1.5rem] border border-border bg-white p-5">
***REMOVED******REMOVED******REMOVED***<input className="h-12 rounded-2xl border border-border bg-bg px-4 outline-none transition focus:border-primary" placeholder="Naam" />
***REMOVED******REMOVED******REMOVED***<input className="h-12 rounded-2xl border border-border bg-bg px-4 outline-none transition focus:border-primary" placeholder="E-mailadres" />
***REMOVED******REMOVED******REMOVED***<textarea className="min-h-[140px] rounded-2xl border border-border bg-bg px-4 py-3 outline-none transition focus:border-primary" placeholder="Vertel kort wat je zoekt" />
***REMOVED******REMOVED******REMOVED***<button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primaryDark">
***REMOVED******REMOVED******REMOVED***  Meld mij aan voor early access
***REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***  </form>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>
***REMOVED***</main>
  );
}
