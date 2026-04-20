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

const nav = [
  { label: 'Product', href: '#product' },
  { label: 'Functies', href: '#functies' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Prijzen', href: '#prijzen' },
  { label: 'Contact', href: '#contact' },
  { label: 'App', href: '/app/dashboard' },
];

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
***REMOVED******REMOVED******REMOVED***  <a
***REMOVED******REMOVED******REMOVED******REMOVED***key={item.label}
***REMOVED******REMOVED******REMOVED******REMOVED***href={item.href}
***REMOVED******REMOVED******REMOVED******REMOVED***className="text-sm font-medium text-muted transition hover:text-text"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***{item.label}
***REMOVED******REMOVED******REMOVED***  </a>
***REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED***  </nav>
***REMOVED******REMOVED***  <div className="flex items-center gap-3">
***REMOVED******REMOVED******REMOVED***<a
***REMOVED******REMOVED******REMOVED***  href="/app/dashboard"
***REMOVED******REMOVED******REMOVED***  className="hidden rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text md:inline-flex"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  Naar de app
***REMOVED******REMOVED******REMOVED***</a>
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
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div key={label} className="min-w-0 rounded-3xl border border-border bg-bg px-4 py-3">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted break-words">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{label}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-2 text-2xl font-semibold tracking-tight text-text">{amount}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-1 text-xs font-semibold text-primary">{note}</div>
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

***REMOVED***  {/* Features section */}

***REMOVED***  <section id="functies" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
***REMOVED******REMOVED***<div className="mb-12 text-center">
***REMOVED******REMOVED***  <div className="mb-4 inline-flex items-center rounded-full bg-highlight px-4 py-2 text-sm font-semibold text-primary">
***REMOVED******REMOVED******REMOVED***Wat Fiscaliq doet
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***  <h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED***Alles wat je nodig hebt, niets wat je niet nodig hebt
***REMOVED******REMOVED***  </h2>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="grid gap-8 md:grid-cols-2">
***REMOVED******REMOVED***  {features.map((feature) => (
***REMOVED******REMOVED******REMOVED***<div key={feature.title} className="rounded-3xl border border-border bg-surface p-8">
***REMOVED******REMOVED******REMOVED***  <h3 className="text-xl font-semibold text-text">{feature.title}</h3>
***REMOVED******REMOVED******REMOVED***  <p className="mt-3 text-base text-muted leading-relaxed">{feature.body}</p>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  ))}
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  {/* Pricing section */}

***REMOVED***  <section id="prijzen" className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
***REMOVED******REMOVED***<div className="mb-12 text-center">
***REMOVED******REMOVED***  <h2 className="text-4xl font-semibold tracking-tight text-text sm:text-5xl">
***REMOVED******REMOVED******REMOVED***Simpel en eerlijk geprijsd
***REMOVED******REMOVED***  </h2>
***REMOVED******REMOVED***  <p className="mt-4 text-lg text-muted">
***REMOVED******REMOVED******REMOVED***Geen verborgen kosten, geen verwarrende pakketten. Eenduidelijk model.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="mx-auto max-w-md">
***REMOVED******REMOVED***  <div className="rounded-3xl border-2 border-primary bg-surface p-8 shadow-soft">
***REMOVED******REMOVED******REMOVED***<div className="text-center">
***REMOVED******REMOVED******REMOVED***  <div className="inline-flex items-center rounded-full bg-highlight px-4 py-2 text-sm font-semibold text-primary mb-4">
***REMOVED******REMOVED******REMOVED******REMOVED***Enig pakket
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <h3 className="text-3xl font-bold text-text">Fiscaliq</h3>
***REMOVED******REMOVED******REMOVED***  <p className="mt-3 text-sm text-muted">Alles voor één vaste prijs</p>

***REMOVED******REMOVED******REMOVED***  <div className="mt-8 text-center">
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-5xl font-bold text-text">9,99</span>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="text-lg text-muted">/maand</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <p className="mt-2 text-xs text-muted">Na gratis proefperiode van 30 dagen</p>

***REMOVED******REMOVED******REMOVED***  <button className="mt-8 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark">
***REMOVED******REMOVED******REMOVED******REMOVED***Start nu gratis
***REMOVED******REMOVED******REMOVED***  </button>

***REMOVED******REMOVED******REMOVED***  <div className="mt-8 space-y-3 border-t border-border pt-8 text-left">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="text-sm text-text font-medium">Inbegrepen:</div>
***REMOVED******REMOVED******REMOVED******REMOVED***{[
***REMOVED******REMOVED******REMOVED******REMOVED***  'Onbeperkt facturen & offertes',
***REMOVED******REMOVED******REMOVED******REMOVED***  'Klantenbeheer',
***REMOVED******REMOVED******REMOVED******REMOVED***  'BTW-berekening per kwartaal',
***REMOVED******REMOVED******REMOVED******REMOVED***  'Bonnetjesupload (5GB)',
***REMOVED******REMOVED******REMOVED******REMOVED***  'PDF-export alles',
***REMOVED******REMOVED******REMOVED******REMOVED***  'Herinneringen versturen',
***REMOVED******REMOVED******REMOVED******REMOVED***  'Basisrapportage',
***REMOVED******REMOVED******REMOVED******REMOVED***  'Support via email',
***REMOVED******REMOVED******REMOVED******REMOVED***].map((item) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <div key={item} className="flex items-center gap-3 text-sm text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<svg className="h-4 w-4 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</svg>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item}
***REMOVED******REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  {/* CTA section */}

***REMOVED***  <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
***REMOVED******REMOVED***<div className="rounded-3xl border border-border bg-surface p-12 text-center">
***REMOVED******REMOVED***  <h2 className="text-4xl font-semibold tracking-tight text-text">Klaar om je boekhouden te vereenvoudigen?</h2>
***REMOVED******REMOVED***  <p className="mt-4 text-lg text-muted">Geen creditcard nodig. Begin nu gratis.</p>
***REMOVED******REMOVED***  <div className="mt-8 flex flex-wrap justify-center gap-4">
***REMOVED******REMOVED******REMOVED***<a
***REMOVED******REMOVED******REMOVED***  href="/register"
***REMOVED******REMOVED******REMOVED***  className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  Maak account aan
***REMOVED******REMOVED******REMOVED***</a>
***REMOVED******REMOVED******REMOVED***<a
***REMOVED******REMOVED******REMOVED***  href="/app/dashboard"
***REMOVED******REMOVED******REMOVED***  className="rounded-full border border-border bg-bg px-8 py-3 text-sm font-semibold text-text transition hover:bg-white"
***REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED***  Demo bekijken
***REMOVED******REMOVED******REMOVED***</a>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  {/* Footer */}

***REMOVED***  <footer className="border-t border-border/40 bg-bg/50">
***REMOVED******REMOVED***<div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
***REMOVED******REMOVED***  <div className="grid gap-12 md:grid-cols-4">
***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="flex items-center gap-3">
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface shadow-soft">
***REMOVED******REMOVED******REMOVED******REMOVED***  <span className="text-base font-bold text-primary">F</span>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***<span className="font-semibold text-text">Fiscaliq</span>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <p className="mt-3 text-sm text-muted">Boekhouden voor zzp'ers, simpel en eerlijk.</p>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-sm font-semibold text-text">Product</div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-4 space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED***{['Functies', 'Prijzen', 'Dashboard', 'Interface'].map((item) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <a key={item} href="#" className="block text-sm text-muted transition hover:text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item}
***REMOVED******REMOVED******REMOVED******REMOVED***  </a>
***REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-sm font-semibold text-text">Bedrijf</div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-4 space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED***{['Over', 'Blog', 'Vacatures', 'Contact'].map((item) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <a key={item} href="#" className="block text-sm text-muted transition hover:text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item}
***REMOVED******REMOVED******REMOVED******REMOVED***  </a>
***REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED***  <div className="text-sm font-semibold text-text">Juridisch</div>
***REMOVED******REMOVED******REMOVED***  <div className="mt-4 space-y-2">
***REMOVED******REMOVED******REMOVED******REMOVED***{['Privacy', 'Terms', 'Cookie policy'].map((item) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <a key={item} href="#" className="block text-sm text-muted transition hover:text-text">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item}
***REMOVED******REMOVED******REMOVED******REMOVED***  </a>
***REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  <div className="mt-12 border-t border-border/40 pt-8">
***REMOVED******REMOVED******REMOVED***<p className="text-center text-sm text-muted">
***REMOVED******REMOVED******REMOVED***  © 2026 Fiscaliq. Gebouwd door ZZP'ers, voor ZZP'ers.
***REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  </footer>

***REMOVED***</main>
  );
}
