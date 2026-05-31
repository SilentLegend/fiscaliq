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
  { title: "Facturen beheren", description: "Aanmaken, bewerken, verwijderen en statusbeheer van facturen", phase: "nu", status: "klaar" },
  { title: "Klantenbeheer", description: "CRUD voor klanten met adres- en contactgegevens", phase: "nu", status: "klaar" },
  { title: "Bonnetjes & uitgaven", description: "Uploaden, categoriseren en BTW-berekening van bonnetjes", phase: "nu", status: "klaar" },
  { title: "BTW-overzicht", description: "Kwartaaloverzicht van verschuldigde en terug te vorderen BTW", phase: "nu", status: "klaar" },
  { title: "Bankkoppeling (demo)", description: "Demo-koppeling met voorbeeldtransacties", phase: "nu", status: "klaar" },
  { title: "PDF-export facturen", description: "Professionele PDF-facturen genereren met jouw logo", phase: "binnenkort", status: "bezig" },
  { title: "E-mail facturen verzenden", description: "Facturen direct naar klanten mailen vanuit de app", phase: "binnenkort", status: "gepland" },
  { title: "Live PSD2 bankkoppeling", description: "Echte bankkoppeling via GoCardless/Tink voor automatische transacties", phase: "binnenkort", status: "gepland" },
  { title: "Automatisch matchen", description: "Banktransacties automatisch matchen aan facturen en bonnetjes", phase: "later", status: "gepland" },
  { title: "Btw-aangifte export", description: "Exporteer btw-overzicht naar XML voor aangifte bij de Belastingdienst", phase: "later", status: "idee" },
  { title: "Meerdere btw-tarieven per regel", description: "Ondersteuning voor gemengde btw-tarieven op één factuur", phase: "later", status: "idee" },
  { title: "Dashboard grafieken", description: "Visuele grafieken voor omzetontwikkeling en uitgavenpatronen", phase: "later", status: "idee" },
  { title: "Jaaroverzicht", description: "Jaarcijfers export voor de belastingaangifte", phase: "idee", status: "idee" },
  { title: "Offerte module", description: "Offertes maken en omzetten naar facturen", phase: "idee", status: "idee" },
  { title: "Mobiele app", description: "Native mobiele app voor bonnetjes scannen onderweg", phase: "idee", status: "idee" },
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

      <div className="grid md:grid-cols-3 gap-5">
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