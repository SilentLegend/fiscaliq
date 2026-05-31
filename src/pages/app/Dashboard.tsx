import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { eur, nlDate, quarterOf } from "@/lib/format";
import { ArrowUpRight, Clock, Receipt as ReceiptIcon, Wallet, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
  const qStart = new Date(today.getFullYear(), (quarterOf(today) - 1) * 3, 1).toISOString().slice(0, 10);
  const greeting = today.getHours() < 12 ? "Goedemorgen" : today.getHours() < 18 ? "Goedemiddag" : "Goedenavond";

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [invMonth, openInv, qInv, qExp] = await Promise.all([
        supabase.from("invoices").select("total").gte("issue_date", monthStart).neq("status", "concept"),
        supabase.from("invoices").select("id,total,due_date,client_id").in("status", ["verzonden", "vervallen"]),
        supabase.from("invoices").select("vat_amount").gte("issue_date", qStart).neq("status", "concept"),
        supabase.from("expenses").select("vat_amount").gte("expense_date", qStart),
      ]);
      const revenueMonth = (invMonth.data ?? []).reduce((s: number, r: Record<string, unknown>) => s + Number(r.total || 0), 0);
      const openTotal = (openInv.data ?? []).reduce((s: number, r: Record<string, unknown>) => s + Number(r.total || 0), 0);
      const vatOut = (qInv.data ?? []).reduce((s: number, r: Record<string, unknown>) => s + Number(r.vat_amount || 0), 0);
      const vatIn = (qExp.data ?? []).reduce((s: number, r: Record<string, unknown>) => s + Number(r.vat_amount || 0), 0);
      return {
        revenueMonth,
        openTotal,
        openCount: openInv.data?.length ?? 0,
        vatReserve: Math.max(0, vatOut - vatIn),
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["recent-invoices"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices")
        .select("id, invoice_number, total, status, issue_date, clients(name)")
        .order("created_at", { ascending: false }).limit(5);
      return data ?? [];
    },
  });

  const stats = [
    { label: "Omzet deze maand", value: eur(data?.revenueMonth), hint: "Verzonden + betaald", icon: Wallet },
    { label: "Openstaande facturen", value: eur(data?.openTotal), hint: `${data?.openCount ?? 0} facturen`, icon: Clock },
    { label: "BTW reservering", value: eur(data?.vatReserve), hint: `Kwartaal ${quarterOf(today)}`, icon: ReceiptIcon },
  ];

  return (
    <div className="space-y-10">
      <div>
        <div className="label-eyebrow">Vandaag · {nlDate(today)}</div>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">{greeting}</h1>
        <p className="text-muted-foreground mt-1">Een rustig overzicht van je administratie.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div className="label-eyebrow">{s.label}</div>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="font-serif text-3xl mt-3">{isLoading ? "—" : s.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="label-eyebrow">Recente facturen</div>
              <h2 className="font-serif text-xl mt-1">Laatste activiteit</h2>
            </div>
            <Link to="/app/facturen" className="text-sm text-primary hover:underline flex items-center gap-1">
              Alles bekijken <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {(recent ?? []).length === 0 && (
              <div className="py-12 text-center text-muted-foreground text-sm">
                <FileText className="h-8 w-8 mx-auto mb-3 opacity-40" />
                Nog geen facturen. <Link to="/app/facturen/nieuw" className="text-primary hover:underline">Maak je eerste factuur</Link>.
              </div>
            )}
            {(recent ?? []).map((r: Record<string, unknown>) => (
              <Link key={r.id} to={`/app/facturen/${r.id}`} className="flex items-center justify-between py-3 hover:bg-muted/40 -mx-2 px-2 rounded-md">
                <div>
                  <div className="font-medium">{r.invoice_number} <span className="text-muted-foreground font-normal">· {r.clients?.name ?? "—"}</span></div>
                  <div className="text-xs text-muted-foreground">{nlDate(r.issue_date)}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{eur(r.total)}</div>
                  <div className="text-xs capitalize text-muted-foreground">{r.status}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="label-eyebrow">Snelle acties</div>
          <h2 className="font-serif text-xl mt-1 mb-5">Aan de slag</h2>
          <div className="space-y-2.5">
            {[
              { to: "/app/facturen/nieuw", label: "Nieuwe factuur" },
              { to: "/app/klanten", label: "Klant toevoegen" },
              { to: "/app/bonnetjes", label: "Bon uploaden" },
              { to: "/app/bank", label: "Bank koppelen" },
            ].map(a => (
              <Link key={a.to} to={a.to} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors group">
                <span className="text-sm font-medium">{a.label}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
