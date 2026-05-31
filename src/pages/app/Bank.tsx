import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Landmark, Link2, ShieldCheck, RefreshCw, Plus, AlertCircle } from "lucide-react";
import { eur, nlDate } from "@/lib/format";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const dutchBanks = [
  { id: "ING_INGBNL2A", name: "ING" },
  { id: "RABO_RABONL2U", name: "Rabobank" },
  { id: "ABNAMRO_ABNANL2A", name: "ABN AMRO" },
  { id: "BUNQ_BUNQNL2A", name: "bunq" },
  { id: "KNAB_KNABNL2H", name: "Knab" },
  { id: "TRIODOS_TRIONL2U", name: "Triodos" },
  { id: "ASN_ASNBNL21", name: "ASN Bank" },
  { id: "SNS_SNSBNL2A", name: "SNS Bank" },
];

export default function Bank() {
  const qc = useQueryClient();
  const [demoOpen, setDemoOpen] = useState(false);
  const [bank, setBank] = useState(dutchBanks[0].id);
  const [iban, setIban] = useState("");

  const { data: connections = [] } = useQuery({
    queryKey: ["bank_connections"],
    queryFn: async () => (await supabase.from("bank_connections").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["bank_transactions"],
    queryFn: async () => (await supabase.from("bank_transactions").select("*").order("booking_date", { ascending: false }).limit(50)).data ?? [],
  });

  const startConnect = async () => {
    toast.info("PSD2 koppeling start binnenkort beschikbaar", {
      description: "De infrastructuur staat klaar — voor live koppeling is een PSD2 provider nodig (bv. GoCardless Bank Account Data of Tink). Voeg de API key toe in Cloud → Secrets en activeer de edge function 'bank-connect'.",
    });
  };

  const addDemo = async () => {
    if (!iban) return toast.error("Vul een IBAN in");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const bankInfo = dutchBanks.find(b => b.id === bank)!;
    const { data: conn, error } = await supabase.from("bank_connections").insert({
      user_id: user.id, bank_name: bankInfo.name, bank_bic: bankInfo.id.split("_")[1],
      iban, account_holder: user.email, status: "active",
      provider: "demo", provider_institution_id: bankInfo.id, last_sync_at: new Date().toISOString(),
    }).select("id").single();
    if (error) return toast.error(error.message);
    // demo transacties
    const sample = [
      { d: -1, a: 1210, c: "Acme B.V.", desc: "Factuur 2026-0012" },
      { d: -3, a: -42.5, c: "AH to go", desc: "Lunch klantbezoek" },
      { d: -5, a: -19.95, c: "Adobe", desc: "Creative Cloud" },
      { d: -7, a: 845, c: "Studio Helder", desc: "Factuur 2026-0011" },
      { d: -10, a: -129, c: "KPN Zakelijk", desc: "Mobiel abonnement" },
    ];
    await supabase.from("bank_transactions").insert(sample.map((t, i) => ({
      user_id: user.id, connection_id: conn.id,
      provider_transaction_id: `demo-${conn.id}-${i}`,
      booking_date: new Date(Date.now() + t.d * 864e5).toISOString().slice(0, 10),
      amount: t.a, counterparty_name: t.c, description: t.desc,
    })));
    toast.success("Demo-bank gekoppeld");
    qc.invalidateQueries({ queryKey: ["bank_connections"] });
    qc.invalidateQueries({ queryKey: ["bank_transactions"] });
    setDemoOpen(false); setIban("");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-eyebrow">PSD2</div>
          <h1 className="font-serif text-3xl mt-2">Bankkoppeling</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
            <DialogTrigger asChild><Button variant="outline"><Plus className="h-4 w-4 mr-1.5" /> Demo koppeling</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-serif text-2xl">Demo bank toevoegen</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Voor testen — voegt een bank en voorbeeld-transacties toe zonder echte verbinding.</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Bank</Label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {dutchBanks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5"><Label>IBAN</Label><Input placeholder="NL00XXXX0000000000" value={iban} onChange={e => setIban(e.target.value.toUpperCase())} /></div>
              </div>
              <DialogFooter><Button onClick={addDemo}>Toevoegen</Button></DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={startConnect}><Link2 className="h-4 w-4 mr-1.5" /> Bank koppelen (PSD2)</Button>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10">
          <div className="max-w-2xl">
            <Landmark className="h-10 w-10 text-primary mb-4" />
            <h2 className="font-serif text-2xl">Koppel je zakelijke bankrekening</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Via PSD2 lezen we transacties veilig in en matchen we ze automatisch aan je facturen en bonnetjes. We schrijven nooit af en bewaren geen inloggegevens van je bank.
            </p>
            <div className="mt-6 grid md:grid-cols-3 gap-3">
              {[
                { i: ShieldCheck, t: "PSD2 gecertificeerd", d: "Read-only via gelicenseerde provider" },
                { i: RefreshCw, t: "Dagelijkse sync", d: "Nieuwe transacties automatisch binnen" },
                { i: Link2, t: "Slim matchen", d: "Koppelt aan facturen en bonnen" },
              ].map(f => (
                <div key={f.t} className="p-4 rounded-xl border border-border">
                  <f.i className="h-5 w-5 text-primary" />
                  <div className="font-medium mt-2">{f.t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.d}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-2">
              {dutchBanks.map(b => (
                <div key={b.id} className="aspect-square rounded-lg border border-border grid place-items-center text-xs text-muted-foreground bg-muted/30 p-2 text-center">{b.name}</div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-warning/10 border border-warning/20 text-sm flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <strong>Setup-stap nodig:</strong> live PSD2-koppeling vereist een API key van een provider (bv. GoCardless Bank Account Data — gratis t/m 5 banken). Klik op "Bank koppelen" voor instructies, of begin met een demo-koppeling.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {connections.map((c: Record<string, unknown>) => (
              <div key={c.id} className="stat-card">
                <div className="flex items-start justify-between">
                  <Landmark className="h-5 w-5 text-primary" />
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                </div>
                <div className="font-serif text-xl mt-3">{c.bank_name}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">{c.iban}</div>
                <div className="text-xs text-muted-foreground mt-3">Laatst gesynced: {c.last_sync_at ? nlDate(c.last_sync_at) : "nooit"}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-xl">Recente transacties</h2>
              <span className="text-sm text-muted-foreground">{transactions.length} transacties</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr><th className="text-left font-medium p-4">Datum</th><th className="text-left font-medium p-4">Tegenpartij</th><th className="text-left font-medium p-4 hidden md:table-cell">Omschrijving</th><th className="text-left font-medium p-4">Match</th><th className="text-right font-medium p-4">Bedrag</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t: Record<string, unknown>) => (
                  <tr key={t.id} className="hover:bg-muted/30">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{nlDate(t.booking_date)}</td>
                    <td className="p-4 font-medium">{t.counterparty_name ?? "—"}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{t.description ?? ""}</td>
                    <td className="p-4">
                      {t.matched
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">Gematcht</span>
                        : <Button size="sm" variant="ghost" className="h-7 text-xs">Koppelen</Button>}
                    </td>
                    <td className={`p-4 text-right font-medium ${Number(t.amount) < 0 ? "text-destructive" : "text-success"}`}>{eur(t.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
