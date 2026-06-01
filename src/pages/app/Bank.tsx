import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Landmark, Upload, ShieldCheck, RefreshCw, Link2, Plus,
  CheckCircle2, X, FileText, Loader2, ExternalLink,
} from "lucide-react";
import { eur, nlDate } from "@/lib/format";
import { toast } from "sonner";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadCsv, validateCsvFile } from "@/lib/csvImport";

const dutchBanks = [
  { id: "KNAB_KNABNL2H", name: "Knab", aspsp: "KNAB" },
  { id: "ING_INGBNL2A", name: "ING", aspsp: "ING" },
  { id: "RABO_RABONL2U", name: "Rabobank", aspsp: "RABOBANK_NL" },
  { id: "ABNAMRO_ABNANL2A", name: "ABN AMRO", aspsp: "ABN_AMRO" },
  { id: "BUNQ_BUNQNL2A", name: "bunq", aspsp: "BUNQ" },
  { id: "TRIODOS_TRIONL2U", name: "Triodos", aspsp: "TRIODOS" },
  { id: "ASN_ASNBNL21", name: "ASN Bank", aspsp: "ASN" },
  { id: "SNS_SNSBNL2A", name: "SNS Bank", aspsp: "SNS" },
];

const EB_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bank-connect`;

async function ebCall(action: string, body: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Niet ingelogd");
  const res = await fetch(EB_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...body }),
  });
  return res.json();
}

export default function Bank() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);
  const [psd2Open, setPsd2Open] = useState(false);
  const [bank, setBank] = useState(dutchBanks[0].id);
  const [psd2Busy, setPsd2Busy] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [iban, setIban] = useState("");
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pickFile, setPickFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Verwerk callback van Enable Banking
  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");
    if (error) {
      toast.error("Bankkoppeling geannuleerd of mislukt");
      navigate("/app/bank", { replace: true });
      return;
    }
    if (code && state) {
      (async () => {
        try {
          const result = await ebCall("callback", { code, state });
          if (result.ok) {
            toast.success("Bank succesvol gekoppeld!");
            qc.invalidateQueries({ queryKey: ["bank_connections"] });
            qc.invalidateQueries({ queryKey: ["bank_transactions"] });
          } else {
            toast.error(result.error || "Koppeling mislukt");
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Koppeling mislukt");
        }
        navigate("/app/bank", { replace: true });
      })();
    }
  }, [searchParams, qc, navigate]);

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

  const startPsd2Connect = async () => {
    const bankInfo = dutchBanks.find(b => b.id === bank);
    if (!bankInfo) return;
    setPsd2Busy(true);
    try {
      const result = await ebCall("connect", {
        aspsp_name: bankInfo.aspsp,
        aspsp_country: "NL",
      });
      if (result.url) {
        window.location.href = result.url;
      } else if (result.setup_required) {
        toast.info("PSD2 nog niet ingesteld", { description: result.message });
        setPsd2Open(false);
      } else {
        toast.error(result.error || "Koppeling starten mislukt");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Koppeling starten mislukt");
    } finally {
      setPsd2Busy(false);
    }
  };

  const syncTransactions = async (connectionId: string) => {
    setSyncing(connectionId);
    try {
      const result = await ebCall("sync", { connection_id: connectionId });
      if (result.ok) {
        toast.success(`${result.synced} transacties gesynchroniseerd`);
        qc.invalidateQueries({ queryKey: ["bank_transactions"] });
        qc.invalidateQueries({ queryKey: ["bank_connections"] });
      } else {
        toast.error(result.error || "Sync mislukt");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync mislukt");
    } finally {
      setSyncing(null);
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
          <Dialog open={psd2Open} onOpenChange={setPsd2Open}>
            <DialogTrigger asChild>
              <Button><Link2 className="h-4 w-4 mr-1.5" /> Bank koppelen (PSD2)</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-serif text-2xl">Koppel je bank</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground">Kies je bank en wordt doorgestuurd om veilig in te loggen — net zoals bij iDEAL. We slaan nooit je wachtwoord op.</p>
              <div className="space-y-3 mt-4">
                <div className="space-y-1.5">
                  <Label>Bank</Label>
                  <select value={bank} onChange={e => setBank(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    {dutchBanks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={startPsd2Connect} disabled={psd2Busy}>
                  {psd2Busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ExternalLink className="h-4 w-4 mr-2" />}
                  {psd2Busy ? "Bezig..." : "Verder naar bank"}
                </Button>
              </DialogFooter>
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
              Upload een CSV-export van je bank of koppel direct via PSD2.
              Transacties worden veilig verwerkt en automatisch gematcht aan facturen en bonnetjes.
            </p>
            <div className="mt-6 grid md:grid-cols-3 gap-3">
              {[
                { i: Upload, t: "CSV uploaden", d: "Exporteer uit je bank en upload" },
                { i: ShieldCheck, t: "PSD2 koppeling", d: "Direct lezen via API, read-only" },
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

          {/* PSD2 hint */}
          <div className="mt-6 p-4 rounded-lg bg-info/10 border border-info/20 text-sm flex gap-3">
            <ShieldCheck className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div>
              <strong>PSD2 directe koppeling:</strong> Klik op <strong>"Bank koppelen (PSD2)"</strong> om je bank direct te koppelen — je wordt doorgestuurd naar je eigen bankomgeving om veilig in te loggen.
            </div>
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
                    {c.provider === "enable_banking" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => syncTransactions(c.id as string)}
                        disabled={syncing === c.id}
                      >
                        {syncing === c.id ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <RefreshCw className="h-3 w-3 mr-1" />}
                        Sync
                      </Button>
                    )}
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
                  {c.provider === "enable_banking" ? <ShieldCheck className="h-3 w-3" /> : c.provider === "csv" ? <Upload className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  {c.provider === "enable_banking" ? "PSD2" : c.provider === "csv" ? "CSV import" : "Demo"}
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
              <h2 className="font-serif text-xl">Recente transacties</h2>
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
                        : <Button size="sm" variant="ghost" className="h-7 text-xs">Koppelen</Button>}
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
