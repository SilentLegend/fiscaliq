import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

const features = [
  { title: "Facturen zonder gedoe", body: "Maak offertes, zet ze om naar facturen en stuur herinneringen vanuit één rustige flow." },
  { title: "Bonnetjes en kosten", body: "Upload bonnetjes, categoriseer kosten en houd grip op je administratie zonder losse tools." },
  { title: "BTW overzicht", body: "Zie direct wat je moet reserveren en werk rustig toe naar je kwartaal-aangifte." },
  { title: "Bankkoppeling klaar", body: "Voorbereid op PSD2-koppelingen en automatische matching van transacties met facturen." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-serif text-lg">F</div>
            <div className="leading-tight">
              <div className="font-serif text-lg">Fiscaliq</div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">boekhouden voor zzp'ers</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            <a href="#functies" className="hover:text-foreground">Functies</a>
            <a href="#prijzen" className="hover:text-foreground">Prijzen</a>
            <Link to="/auth" className="hover:text-foreground">Inloggen</Link>
          </nav>
          <Button asChild size="sm">
            <Link to="/auth?mode=signup">Start gratis</Link>
          </Button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-primary-soft text-primary text-xs font-medium tracking-wide">
            Eerlijk geprijsd • strak ontworpen • voor kleine zzp'ers
          </span>
          <h1 className="mt-6 font-serif text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Boekhouden zonder chaos. Gewoon overzicht, rust en grip.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Fiscaliq is een modern, minimalistisch boekhoudplatform voor zelfstandigen die hun administratie snel willen regelen — zonder overvolle schermen of dure verrassingen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/auth?mode=signup">Maak gratis account <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/auth">Inloggen</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Facturen & offertes","BTW-overzicht","Bonnetjes","Bankkoppeling voorbereid"].map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_30px_80px_-30px_hsl(174_72%_18%_/_0.25)]">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div>
              <div className="font-medium text-foreground">Dashboard</div>
              <div className="text-xs">Vandaag</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-primary-soft text-primary text-xs">Alles in één plan</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Omzet deze maand", v: "€ 6.420", s: "+12%" },
              { l: "Openstaand", v: "€ 1.180", s: "4 klanten" },
              { l: "BTW reservering", v: "€ 1.041", s: "Q2" },
            ].map(c => (
              <div key={c.l} className="rounded-xl border border-border p-4">
                <div className="label-eyebrow">{c.l}</div>
                <div className="font-serif text-xl mt-2">{c.v}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.s}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-border p-4">
            <div className="label-eyebrow">Cashflow trend</div>
            <div className="mt-3 flex items-end gap-2 h-24">
              {[40,55,38,72,60,85].map((h,i) => (
                <div key={i} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {["Jan","Feb","Mrt","Apr","Mei","Jun"].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section id="functies" className="border-t border-border bg-muted/40 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="label-eyebrow">Wat Fiscaliq doet</div>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl max-w-2xl">Alles wat je nodig hebt, niets wat je niet nodig hebt.</h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl bg-card border border-border p-6">
                <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary grid place-items-center mb-4">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="prijzen" className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="label-eyebrow">Eerlijk geprijsd</div>
          <h2 className="mt-3 font-serif text-3xl md:text-4xl">Eén plan. Alles inbegrepen.</h2>
          <div className="mt-10 rounded-2xl border border-border bg-card p-8 text-left">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl">€ 12</span>
              <span className="text-muted-foreground">/ maand, excl. BTW</span>
            </div>
            <ul className="mt-6 space-y-2.5 text-sm">
              {["Onbeperkt facturen & offertes","BTW-aangifte assistent","Bonnetjes uploaden","Bankkoppeling (zodra beschikbaar in jouw bank)","E-mail support"].map(x =>
                <li key={x} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {x}</li>
              )}
            </ul>
            <Button asChild size="lg" className="w-full mt-8">
              <Link to="/auth?mode=signup">Begin nu — 14 dagen gratis</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Fiscaliq</div>
          <div className="flex gap-6">
            <a href="#">Privacy</a><a href="#">Voorwaarden</a><a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
