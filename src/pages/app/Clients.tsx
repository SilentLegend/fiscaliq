import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Mail, Trash2, Pencil, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { computeClientScore, scoreColor, type InvoiceForScore } from "@/lib/clientScore";
import { eur } from "@/lib/format";

type Client = {
  id: string; name: string; email: string | null; phone: string | null;
  address: string | null; postal_code: string | null; city: string | null;
  kvk_number: string | null; vat_number: string | null; notes: string | null;
};

const empty: Partial<Client> = { name: "", email: "", phone: "", address: "", postal_code: "", city: "", kvk_number: "", vat_number: "", notes: "" };

export default function Clients() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Client> | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("name");
      if (error) throw error;
      return data as Client[];
    },
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ["invoices-for-scores"],
    queryFn: async () => {
      const { data } = await supabase.from("invoices").select("client_id, status, total, due_date, paid_at");
      return data ?? [];
    },
  });

  const scoresByClient = useMemo(() => {
    const map = new Map<string, ReturnType<typeof computeClientScore>>();
    for (const c of clients) {
      const clientInvoices = invoices.filter((i: InvoiceForScore) => i.client_id === c.id) as InvoiceForScore[];
      map.set(c.id, computeClientScore(clientInvoices));
    }
    return map;
  }, [clients, invoices]);

  const save = async () => {
    if (!editing?.name) { toast.error("Naam is verplicht"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const payload = { ...editing, user_id: user.id };
    const { error } = editing.id
      ? await supabase.from("clients").update(payload).eq("id", editing.id)
      : await supabase.from("clients").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Klant bijgewerkt" : "Klant toegevoegd");
    qc.invalidateQueries({ queryKey: ["clients"] });
    setOpen(false); setEditing(null);
  };

  const remove = async (id: string) => {
    if (!confirm("Klant verwijderen?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Verwijderd");
    qc.invalidateQueries({ queryKey: ["clients"] });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Relaties</div>
          <h1 className="font-serif text-3xl mt-2">Klanten</h1>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(empty)}>
              <Plus className="h-4 w-4 mr-1.5" /> Nieuwe klant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-serif text-2xl">{editing?.id ? "Klant bewerken" : "Nieuwe klant"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                <Field label="Naam *"><Input value={editing.name ?? ""} onChange={e => setEditing({ ...editing, name: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="E-mail"><Input type="email" value={editing.email ?? ""} onChange={e => setEditing({ ...editing, email: e.target.value })} /></Field>
                  <Field label="Telefoon"><Input value={editing.phone ?? ""} onChange={e => setEditing({ ...editing, phone: e.target.value })} /></Field>
                </div>
                <Field label="Adres"><Input value={editing.address ?? ""} onChange={e => setEditing({ ...editing, address: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Postcode"><Input value={editing.postal_code ?? ""} onChange={e => setEditing({ ...editing, postal_code: e.target.value })} /></Field>
                  <Field label="Plaats"><Input value={editing.city ?? ""} onChange={e => setEditing({ ...editing, city: e.target.value })} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="KVK"><Input value={editing.kvk_number ?? ""} onChange={e => setEditing({ ...editing, kvk_number: e.target.value })} /></Field>
                  <Field label="BTW-nummer"><Input value={editing.vat_number ?? ""} onChange={e => setEditing({ ...editing, vat_number: e.target.value })} /></Field>
                </div>
                <Field label="Notities"><Textarea value={editing.notes ?? ""} onChange={e => setEditing({ ...editing, notes: e.target.value })} /></Field>
              </div>
            )}
            <DialogFooter><Button onClick={save}>Opslaan</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Laden…</div>
        ) : clients.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-muted-foreground mb-4">Nog geen klanten</div>
            <Button onClick={() => { setEditing(empty); setOpen(true); }}><Plus className="h-4 w-4 mr-1.5" /> Eerste klant toevoegen</Button>
          </div>
        ) : (
          <TooltipProvider delayDuration={200}>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium p-4">Naam</th>
                <th className="text-left font-medium p-4">Klantscore</th>
                <th className="text-left font-medium p-4 hidden md:table-cell">E-mail</th>
                <th className="text-left font-medium p-4 hidden lg:table-cell">Plaats</th>
                <th className="text-right font-medium p-4">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map(c => {
                const s = scoresByClient.get(c.id);
                return (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">
                    {s && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${scoreColor[s.label]}`}>
                            <TrendingUp className="h-3 w-3" />
                            {s.score === null ? "Nog geen data" : `${s.score} · ${s.label}`}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs space-y-1">
                          <div><b>{s.invoiceCount}</b> facturen, omzet {eur(s.totalRevenue)}</div>
                          <div>{Math.round(s.paidOnTimeRate * 100)}% op tijd betaald</div>
                          {s.avgDaysLate > 0 && <div>Gem. {Math.round(s.avgDaysLate)} dagen te laat</div>}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{c.email ? <a href={`mailto:${c.email}`} className="hover:text-primary inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{c.email}</a> : "—"}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{c.city || "—"}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5"><Label>{label}</Label>{children}</div>
);
