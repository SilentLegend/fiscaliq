import { CheckCircle2, Circle, PlayCircle, Lightbulb } from "lucide-react";

type Phase = "nu" | "binnenkort" | "later" | "idee";
type Status = "idee" | "gepland" | "bezig" | "klaar";

type Item = {
  title: string;
  description: string;
  phase: Phase;
  status: Status;
};

const items: Item[] = [
  { title: "Dashboard overzicht", description: "Omzet, openstaand, BTW reservering met realtime data", phase: "nu", status: "klaar" },
  { title: "Dashboard grafiek (instelbaar)", description: "Lijn-/staafgrafiek met week/maand/kwartaal/jaar selector", phase: "nu", status: "klaar" },
  { title: "Facturen beheren", description: "Aanmaken, bewerken, verwijderen en statusbeheer van facturen", phase: "nu", status: "klaar" },
  { title: "Factuur detail pagina", description: "Aparte detailweergave met download PDF knop", phase: "nu", status: "klaar" },
  { title: "Klantenbeheer", description: "CRUD voor klanten met adres- en contactgegevens", phase: "nu", status: "klaar" },
  { title: "Bonnetjes & uitgaven", description: "Uploaden, categoriseren en BTW-berekening van bonnetjes", phase: "nu", status: "klaar" },
  { title: "Bonnetjes bewerken", description: "Potlood-knop opent dialog met vooringevulde waarden", phase: "nu", status: "klaar" },
  { title: "BTW-overzicht", description: "Kwartaaloverzicht van verschuldigde en terug te vorderen BTW", phase: "nu", status: "klaar" },
  { title: "Bankkoppeling (demo)", description: "Demo-koppeling met voorbeeldtransacties", phase: "nu", status: "klaar" },
  { title: "Roadmap-pagina", description: "Hardcoded roadmap met fases nu/binnenkort/later/idee", phase: "nu", status: "klaar" },
  { title: "Instellingen (weergave + notificaties)", description: "Dark mode toggle, notificatie voorkeuren (localStorage)", phase: "nu", status: "klaar" },
  { title: "Instellingen (bedrijfsgegevens)", description: "Telefoon, website, email, standaard BTW, betalingscondities, voettekst", phase: "nu", status: "klaar" },
  { title: "Dynamische begroeting", description: "Goedemorgen/Goedemiddag/Goedenavond op dashboard", phase: "nu", status: "klaar" },
  { title: "Dark mode persistent", description: "Inline script in index.html, geen flash bij reload", phase: "nu", status: "klaar" },
  { title: "Volledige regel klikbaar", description: "Hele rij in facturenlijst navigeert naar detail", phase: "nu", status: "klaar" },
  { title: "Verwijder knop met confirm", description: "Confirm + verwijder uit DB met toast feedback", phase: "nu", status: "klaar" },
  { title: "PDF-export facturen", description: "5 templates (klassiek/modern/minimaal/compact/kleurrijk) met html2pdf.js", phase: "nu", status: "klaar" },
  { title: "Template keuze in Instellingen", description: "Kaartpreview, full dialog preview, localStorage persistente selectie", phase: "nu", status: "klaar" },
  { title: "E-mail facturen verzenden", description: "Facturen direct naar klanten mailen via Resend", phase: "binnenkort", status: "gepland" },
  { title: "BTW-aangifte export (XML)", description: "XML voor upload naar Belastingdienst", phase: "binnenkort", status: "gepland" },
  { title: "Jaaroverzicht / boekhouder export", description: "CSV + ZIP met alle PDFs voor de boekhouder", phase: "binnenkort", status: "gepland" },
  { title: "Save-before-leave editor", description: "Waarschuwing bij verlaten van factuureditor met onbewaarde wijzigingen", phase: "binnenkort", status: "gepland" },
  { title: "Lettertypes correct laden", description: "Google Fonts (Fraunces/Inter) werken in preview en PDF", phase: "binnenkort", status: "klaar" },
  { title: "Live PSD2 bankkoppeling", description: "Echte bankkoppeling via GoCardless requisition flow", phase: "binnenkort", status: "gepland" },
  { title: "Betaallink op facturen", description: "Mollie/Stripe betaalknop in factuurmail", phase: "later", status: "gepland" },
  { title: "Automatische herinneringen", description: "Cronjob edge function voor openstaande facturen", phase: "later", status: "gepland" },
  { title: "Recurring/abonnement facturen", description: "Maandelijkse automatische herhalingsfacturen", phase: "later", status: "gepland" },
  { title: "Auto-matching bank transacties", description: "Op IBAN + bedrag + referentie matchen aan facturen", phase: "later", status: "gepland" },
  { title: "Zoeken/filteren op tabellen", description: "Inline search voor facturen, klanten en bonnetjes", phase: "later", status: "idee" },
  { title: "Pagination op lijsten", description: "Server-side pagination i.p.v. alles in één keer laden", phase: "later", status: "idee" },
  { title: "Loading skeletons", description: "Vervang 'Laden…' tekst door nette skeletons", phase: "later", status: "idee" },
  { title: "AlertDialog i.p.v. confirm()", description: "shadcn AlertDialog voor delete confirmaties", phase: "later", status: "idee" },
  { title: "Wachtwoord vergeten flow", description: "Password reset op auth-pagina", phase: "later", status: "idee" },
  { title: "Client detail pagina", description: "Aparte pagina met klantgegevens, facturen en score", phase: "later", status: "idee" },
  { title: "Batch acties facturen", description: "Selecteer meerdere facturen → bulk status wijzigen", phase: "later", status: "idee" },
  { title: "Status betaald direct vanuit lijst", description: "Inline markeren zonder editor te openen", phase: "later", status: "idee" },
  { title: "Zoekbare klant-selector", description: "Command/combobox i.p.v. native select", phase: "later", status: "idee" },
  { title: "Dashboard perioden-vergelijking", description: "+12% vs vorige maand bij KPI-kaarten", phase: "later", status: "idee" },
  { title: "Openstaande facturen herinnering", description: "Waarschuwing op dashboard bij vervallen facturen", phase: "later", status: "idee" },
  { title: "Meerdere BTW-tarieven per regel", description: "Gemengde BTW-tarieven op één factuur (dispatch rule)", phase: "later", status: "idee" },
  { title: "Korting op factuurregels", description: "Regelkorting of totaalkorting op factuur", phase: "idee", status: "idee" },
  { title: "Factuur kopiëren/dupliceren", description: "Snelle herhaling voor vaste klanten", phase: "idee", status: "idee" },
  { title: "Bedrijfslogo upload", description: "Eigen logo voor PDF-facturen", phase: "idee", status: "idee" },
  { title: "Notificatie voorkeuren naar DB", description: "Sync over meerdere apparaten", phase: "idee", status: "idee" },
  { title: "Route-level code splitting", description: "React.lazy per route voor snellere laadtijd", phase: "idee", status: "idee" },
  { title: "Klantportaal", description: "Klant kan factuur online inzien + betalen", phase: "idee", status: "idee" },
  { title: "Tijdregistratie → factuur", description: "Uren schrijven en in één klik omzetten naar factuur", phase: "idee", status: "idee" },
  { title: "Offertes maken", description: "Offertes met conversie naar factuur", phase: "idee", status: "idee" },
  { title: "Grafiek BTW (verschuldigd vs aftrekbaar)", description: "Extra lijn in dashboard chart", phase: "idee", status: "idee" },
  { title: "PWA (installeerbaar)", description: "Mobile-first met offline support", phase: "idee", status: "idee" },
  { title: "OCR bonnetjes", description: "Automatisch leverancier/bedrag uit foto herkennen", phase: "idee", status: "idee" },
  { title: "Error boundaries", description: "Per-feature error catching in plaats van witte scherm", phase: "idee", status: "idee" },
  { title: "Multi-user (boekhouder)", description: "Boekhouder kan meekijken in de administratie", phase: "idee", status: "idee" },
  { title: "API + Zapier integratie", description: "Externe connecties en automatiseringen", phase: "idee", status: "idee" },
  { title: "Mobiele app (native)", description: "Bonnetjes scannen onderweg via native app", phase: "idee", status: "idee" },
];

const phases: { key: Phase; label: string; sub: string }[] = [
  { key: "nu",         label: "Nu",         sub: "Live in de app" },
  { key: "binnenkort", label: "Binnenkort", sub: "In ontwikkeling" },
  { key: "later",      label: "Later",      sub: "Op de planning" },
  { key: "idee",       label: "Ideeën",     sub: "Toekomstige functies" },
];

const statusIcon = {
  idee:    Lightbulb,
  gepland: Circle,
  bezig:   PlayCircle,
  klaar:   CheckCircle2,
};

const statusColor = {
  idee:    "text-muted-foreground",
  gepland: "text-blue-600",
  bezig:   "text-amber-600",
  klaar:   "text-emerald-600",
};

export default function Roadmap() {
  const grouped = phases.map(p => ({
    ...p,
    items: items.filter(i => i.phase === p.key),
  }));

  const totalDone = items.filter(i => i.status === "klaar").length;
  const totalActive = items.filter(i => i.status === "bezig").length;
  const progress = Math.round((totalDone / items.length) * 100);

  return (
    <div className="space-y-8">
      <div>
        <div className="label-eyebrow">Project</div>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Roadmap</h1>
        <p className="text-muted-foreground mt-1">Fiscaliq — wat er is geweest, komt en op de planning staat.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        <div className="stat-card">
          <div className="label-eyebrow">Voortgang</div>
          <div className="font-serif text-3xl mt-3">{progress}%</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2">{totalDone} van {items.length} gerealiseerd</div>
        </div>
        <div className="stat-card">
          <div className="label-eyebrow">In uitvoering</div>
          <div className="font-serif text-3xl mt-3">{totalActive}</div>
          <div className="text-xs text-muted-foreground mt-2">features met status "bezig"</div>
        </div>
        <div className="stat-card">
          <div className="label-eyebrow">Backlog</div>
          <div className="font-serif text-3xl mt-3">{items.filter(i => i.phase === "idee").length}</div>
          <div className="text-xs text-muted-foreground mt-2">ideeën voor de toekomst</div>
        </div>
        <div className="stat-card">
          <div className="label-eyebrow">Gepland</div>
          <div className="font-serif text-3xl mt-3">{items.filter(i => i.status === "gepland").length}</div>
          <div className="text-xs text-muted-foreground mt-2">features klaar om te bouwen</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {grouped.map(col => (
          <div key={col.key} className="stat-card">
            <div className="mb-4">
              <div className="label-eyebrow">{col.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{col.sub}</div>
            </div>
            <div className="space-y-2.5 min-h-[100px]">
              {col.items.length === 0 && (
                <div className="text-xs text-muted-foreground italic py-6 text-center border border-dashed rounded-md">
                  Nog geen items
                </div>
              )}
              {col.items.map((it, i) => {
                const Icon = statusIcon[it.status];
                return (
                  <div key={i} className="p-3 rounded-lg border border-border hover:border-primary/40 transition">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className={`h-4 w-4 ${statusColor[it.status]}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${it.status === "klaar" ? "line-through text-muted-foreground" : ""}`}>
                          {it.title}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{it.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
