import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Landmark, Upload, Plus,
  CheckCircle2, X, FileText, Loader2, Magnet,
} from "lucide-react";
import { eur, nlDate } from "@/lib/format";
import { toast } from "sonner";
import { useState, useRef, useCallback } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCsv, validateCsvFile } from "@/lib/csvImport";
import { autoMatchTransactions } from "@/lib/autoMatch";

const dutchBanks = [
  { id: "KNAB", name: "Knab" },
  { id: "ING", name: "ING" },
  { id: "RABO", name: "Rabobank" },
  { id: "ABNAMRO", name: "ABN AMRO" },
  { id: "BUNQ", name: "bunq" },
  { id: "TRIODOS", name: "Triodos" },
  { id: "ASN", name: "ASN Bank" },
  { id: "SNS", name: "SNS Bank" },
];

export default function Bank() {
  const qc = useQueryClient();
  const [demoOpen, setDemoOpen] = useState(false);
  const [bank, setBank] = useState(dutchBanks[0].id);
  const [iban, setIban] = useState("");
  const [importing, setImporting] = useState(false);
  const [matching, setMatching] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pickFile, setPickFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: connections = [] } = useQuery({
    queryKey: ["bank_connections"],
    queryFn: async () =>
      (await supabase.from("bank_connections").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["bank_transactions"],
    queryFn: async () =>
      (await supabase.from("bank_transactions").select("*").order("booking_date", { ascending: false }).limit(50))
        .data ?? [],
  });

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setPickFile(f);
  }, []);

  const handleImport = async () => {
    const file = pickFile || fileRef.current?.files?.[0];
    if (!file) return toast.error("Selecteer een CSV bestand");
    const err = validateCsvFile(file);
    if (err) return toast.error(err);
    setImporting(true);
    try {
      const result = await uploadCsv(file);
      if (result.success) {
        toast.success(`${result.imported} transacties geïmporteerd`);
        qc.invalidateQueries({ queryKey: ["bank_connections"] });
        qc.invalidateQueries({ queryKey: ["bank_transactions"] });
        autoMatchTransactions().then((mr) => {
          if (mr.matched > 0) {
            toast.success(`${mr.matched} transacties automatisch gematcht`);
            qc.invalidateQueries({ queryKey: ["bank_transactions"] });
          }
        }).catch(() => {});
      } else {
        toast.error(result.error || "Import mislukt");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import mislukt");
    } finally {
      setImporting(false);
      setPickFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addDemo = async () => {
    if (!iban) return toast.error("Vul een IBAN in");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const bankInfo = dutchBanks.find(b => b.id === bank)!;
    const { data: conn, error } = await supabase
      .from("bank_connections")
      .insert({
        user_id: user.id, bank_name: bankInfo.name, iban, status: "active",
        provider: "demo", last_sync_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) return toast.error(error.message);
    const sample = [
      { d: -1, a: 1210, c: "Acme B.V.", desc: "Factuur 2026-0012" },
      { d: -3, a: -42.5, c: "AH to go", desc: "Lunch klantbezoek" },
      { d: -5, a: -19.95, c: "Adobe", desc: "Creative Cloud" },
      { d: -7, a: 845, c: "Studio Helder", desc: "Factuur 2026-0011" },
      { d: -10, a: -129, c: "KPN Zakelijk", desc: "Mobiel abonnement" },
    ];
    await supabase.from("bank_transactions").insert(
      sample.map((t, i) => ({
        user_id: user.id, connection_id: conn.id,
        provider_transaction_id: `demo-${conn.id}-${i}`,
        booking_date: new Date(Date.now() + t.d * 864e5).toISOString().slice(0, 10),
        amount: t.a, counterparty_name: t.c, description: t.desc,
      })),
    );
    toast.success("Demo-bank gekoppeld");
    qc.invalidateQueries({ queryKey: ["bank_connections"] });
    qc.invalidateQueries({ queryKey: ["bank_transactions"] });
    setDemoOpen(false);
    setIban("");
  };

  const handleAutoMatch = async () => {
    setMatching(true);
    try {
      const result = await autoMatchTransactions();
      if (result.matched > 0) {
        toast.success(`${result.matched} transacties gematcht`);
      } else {
        toast.info("Geen matches gevonden");
      }
      qc.invalidateQueries({ queryKey: ["bank_transactions"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Matching mislukt");
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="label-eyebrow">Bankkoppeling</div>
          <h1 className="font-serif text-3xl mt-2">Transacties importeren</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><Plus className="h-4 w-4 mr-1.5" /> Demo koppeling</Button>
            </DialogTrigger>
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
                <div className="space-y-1.5">
                  <Label>IBAN</Label>
                  <Input placeholder="NL00XXXX0000000000" value={iban} onChange={e => setIban(e.target.value.toUpperCase())} />
                </div>
              </div>
              <DialogFooter><Button onClick={addDemo}>Toevoegen</Button></DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10">
          <div className="max-w-2xl">
            <Landmark className="h-10 w-10 text-primary mb-4" />
            <h2 className="font-serif text-2xl">Importeer je transacties</h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Upload een CSV-export van je bank.
              Transacties worden veilig verwerkt en automatisch gematcht aan facturen en bonnetjes.
            </p>
            <div className="mt-6 grid md:grid-cols-3 gap-3">
              {[
                { i: Upload, t: "CSV uploaden", d: "Exporteer uit je bank en upload" },
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
          </div>

          {/* CSV Upload */}
          <div className="mt-8 p-4 rounded-lg bg-muted/40 border border-border">
            <h3 className="font-serif text-lg mb-3">CSV import</h3>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => setPickFile(e.target.files?.[0] ?? null)} />
              {pickFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{pickFile.name}</div>
                    <div className="text-xs text-muted-foreground">{(pickFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={e => { e.stopPropagation(); setPickFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <div className="text-sm font-medium">{dragOver ? "Laat los om te uploaden" : "Sleep CSV hierheen of klik om te bladeren"}</div>
                  <div className="text-xs text-muted-foreground mt-1">Ondersteund: ABN AMRO, ING, Rabobank, bunq, Revolut</div>
                </>
              )}
            </div>
            <Button size="lg" className="w-full mt-4" onClick={handleImport} disabled={importing || !pickFile}>
              {importing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              {importing ? "Bezig met importeren..." : "Importeer transacties"}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {connections.map((c: Record<string, unknown>) => (
              <div key={c.id as string} className="stat-card">
                <div className="flex items-start justify-between">
                  <Landmark className="h-5 w-5 text-primary" />
                  <div className="flex gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>
                      {c.status as string}
                    </span>
                  </div>
                </div>
                <div className="font-serif text-xl mt-3">{c.bank_name as string}</div>
                <div className="text-sm text-muted-foreground font-mono mt-1">{c.iban as string}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                  {c.provider === "csv" ? <Upload className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {c.provider === "csv" ? "CSV import" : "Demo"}
                  <span className="mx-1">·</span>
                  Laatst: {c.last_sync_at ? nlDate(c.last_sync_at as string) : "nooit"}
                </div>
              </div>
            ))}
          </div>

          {/* CSV Upload (als er al verbindingen zijn) */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-serif text-lg mb-3">Nieuwe CSV uploaden</h3>
            <div
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
              }`}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => setPickFile(e.target.files?.[0] ?? null)} />
              {pickFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <div className="font-medium">{pickFile.name}</div>
                    <div className="text-xs text-muted-foreground">{(pickFile.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={e => { e.stopPropagation(); setPickFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Upload className="h-5 w-5" />
                  <span>Nieuwe CSV uploaden — sleep bestand hierheen of klik</span>
                </div>
              )}
            </div>
            {pickFile && (
              <Button className="w-full mt-3" onClick={handleImport} disabled={importing}>
                {importing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {importing ? "Bezig met importeren..." : "Importeer transacties"}
              </Button>
            )}
          </div>

          {/* Transacties */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl">Recente transacties</h2>
                {transactions.some((t: Record<string, unknown>) => !t.matched) && (
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleAutoMatch} disabled={matching}>
                    {matching ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Magnet className="h-3 w-3 mr-1" />}
                    {matching ? "Bezig..." : "Match automatisch"}
                  </Button>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{transactions.length} transacties</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium p-4">Datum</th>
                  <th className="text-left font-medium p-4">Tegenpartij</th>
                  <th className="text-left font-medium p-4 hidden md:table-cell">Omschrijving</th>
                  <th className="text-left font-medium p-4 hidden sm:table-cell">Match</th>
                  <th className="text-right font-medium p-4">Bedrag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((t: Record<string, unknown>) => (
                  <tr key={t.id as string} className="hover:bg-muted/30">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{nlDate(t.booking_date as string)}</td>
                    <td className="p-4 font-medium">{t.counterparty_name ?? "—"}</td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{(t.description as string) ?? ""}</td>
                    <td className="p-4 hidden sm:table-cell">
                      {t.matched
                        ? <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-success/10 text-success"><CheckCircle2 className="h-3 w-3" /> Gematcht</span>
                        : <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={async () => {
                            try {
                              const r = await autoMatchTransactions(t.id as string);
                              if (r.matched > 0) {
                                toast.success("Transactie gematcht");
                                qc.invalidateQueries({ queryKey: ["bank_transactions"] });
                              } else {
                                toast.info("Geen match gevonden");
                              }
                            } catch { toast.error("Matching mislukt"); }
                          }}>Koppelen</Button>}
                    </td>
                    <td className={`p-4 text-right font-medium ${Number(t.amount) < 0 ? "text-destructive" : "text-success"}`}>
                      {eur(t.amount as number)}
                    </td>
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
