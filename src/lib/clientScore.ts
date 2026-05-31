// Automatische klantscore op basis van betaalgedrag.
// Score 0-100. Hoger = betere klant.
//
// Weegfactoren:
//   - % facturen op tijd betaald   : 50 punten
//   - gemiddelde dagen te laat     : 20 punten (afgetrokken naar rato)
//   - aantal facturen (volume)     : 15 punten
//   - totale omzet                 : 15 punten
//
// Klanten zonder verzonden facturen krijgen score `null` → "Nog geen data".

export type InvoiceForScore = {
  status: string;
  total: number | string | null;
  due_date: string;
  paid_at: string | null;
};

export type ClientScore = {
  score: number | null;
  label: "uitstekend" | "goed" | "gemiddeld" | "let op" | "risico" | "onbekend";
  paidOnTimeRate: number;
  avgDaysLate: number;
  invoiceCount: number;
  totalRevenue: number;
};

const today = () => new Date();

export function computeClientScore(invoices: InvoiceForScore[]): ClientScore {
  const relevant = invoices.filter(i => i.status !== "concept" && i.status !== "geannuleerd");

  if (relevant.length === 0) {
    return {
      score: null,
      label: "onbekend",
      paidOnTimeRate: 0,
      avgDaysLate: 0,
      invoiceCount: 0,
      totalRevenue: 0,
    };
  }

  let onTime = 0;
  let totalDaysLate = 0;
  let lateCount = 0;
  let totalRevenue = 0;

  for (const inv of relevant) {
    const total = Number(inv.total ?? 0);
    totalRevenue += total;

    const due = new Date(inv.due_date);
    const ref = inv.paid_at ? new Date(inv.paid_at) : today();
    const diffDays = Math.floor((ref.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

    if (inv.status === "betaald") {
      if (diffDays <= 0) onTime++;
      else {
        totalDaysLate += diffDays;
        lateCount++;
      }
    } else if (inv.status === "vervallen" || (inv.status === "verzonden" && diffDays > 0)) {
      // openstaand en al voorbij due date
      totalDaysLate += Math.max(diffDays, 0);
      lateCount++;
    } else if (inv.status === "verzonden") {
      // nog niet vervallen → telt als 'op tijd' tot nu
      onTime++;
    }
  }

  const paidOnTimeRate = onTime / relevant.length; // 0..1
  const avgDaysLate = lateCount > 0 ? totalDaysLate / lateCount : 0;

  // Sub-scores
  const punctuality = paidOnTimeRate * 50; // 0..50
  const latenessPenalty = Math.max(0, 20 - Math.min(avgDaysLate, 20)); // 0..20
  const volumeScore = Math.min(relevant.length / 10, 1) * 15; // 10+ facturen = max
  const revenueScore = Math.min(totalRevenue / 10000, 1) * 15; // €10k+ = max

  const score = Math.round(punctuality + latenessPenalty + volumeScore + revenueScore);

  let label: ClientScore["label"];
  if (score >= 85) label = "uitstekend";
  else if (score >= 70) label = "goed";
  else if (score >= 50) label = "gemiddeld";
  else if (score >= 30) label = "let op";
  else label = "risico";

  return {
    score,
    label,
    paidOnTimeRate,
    avgDaysLate,
    invoiceCount: relevant.length,
    totalRevenue,
  };
}

export const scoreColor: Record<ClientScore["label"], string> = {
  uitstekend: "bg-emerald-100 text-emerald-800 border-emerald-200",
  goed: "bg-green-100 text-green-800 border-green-200",
  gemiddeld: "bg-amber-100 text-amber-800 border-amber-200",
  "let op": "bg-orange-100 text-orange-800 border-orange-200",
  risico: "bg-red-100 text-red-800 border-red-200",
  onbekend: "bg-muted text-muted-foreground border-border",
};
