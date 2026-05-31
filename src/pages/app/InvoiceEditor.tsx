import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";
import { eur } from "@/lib/format";
import { toast } from "sonner";

type Item = { id?: string; description: string; quantity: number; unit_price: number; vat_rate: number; position: number };

export default function InvoiceEditor() {
  const { id } = useParams();
  const isNew = !id || id === "nieuw";
  const nav = useNavigate();
  const qc = useQueryClient();

  const [clientId, setClientId] = useState<string>("");
  const [number, setNumber] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10));
  const [status, setStatus] = useState<"concept" | "verzonden" | "betaald" | "vervallen" | "geannuleerd">("concept");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<Item[]>([{ description: "", quantity: 1, unit_price: 0, vat_rate: 21, position: 0 }]);
  const [saving, setSaving] = useState(false);

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => (await supabase.from("clients").select("id,name").order("name")).data ?? [],
  });

  const { data: existing } = useQuery({
    queryKey: ["invoice", id],
    enabled: !isNew,
    queryFn: async () => {
      const [inv, its] = await Promise.all([
        supabase.from("invoices").select("*").eq("id", id!).maybeSingle(),
        supabase.from("invoice_items").select("*").eq("invoice_id", id!).order("position"),
      ]);
      return { inv: inv.data, items: its.data ?? [] };
    },
  });

  useEffect(() => {
    if (existing?.inv) {
      const i = existing.inv;
      setClientId(i.client_id ?? "");
      setNumber(i.invoice_number);
      setIssueDate(i.issue_date);
      setDueDate(i.due_date);
      setStatus(i.status);
      setNotes(i.notes ?? "");
      if (existing.items.length) {
        setItems(existing.items.map((it: Record<string, unknown>, idx: number) => ({
          id: it.id, description: it.description, quantity: Number(it.quantity),
          unit_price: Number(it.unit_price), vat_rate: Number(it.vat_rate), position: idx,
        })));
      }
    }
  }, [existing]);

  useEffect(() => {
    if (isNew && !number) {
      const y = new Date().getFullYear();
      supabase.from("invoices").select("invoice_number").like("invoice_number", `${y}-%`).order("invoice_number", { ascending: false }).limit(1)
        .then(({ data }) => {
          const last = data?.[0]?.invoice_number?.split("-")[1];
          const next = last ? String(parseInt(last) + 1).padStart(4, "0") : "0001";
          setNumber(`${y}-${next}`);
        });
    }
  }, [isNew, number]);

  const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
  const vat = items.reduce((s, it) => s + (it.quantity * it.unit_price * it.vat_rate) / 100, 0);
  const total = subtotal + vat;

  const updateItem = (idx: number, patch: Partial<Item>) => {
    setItems(items.map((it, i) => i === idx ? { ...it, ...patch } : it));
  };

  const save = async () => {
    if (!number) return toast.error("Factuurnummer is verplicht");
    if (!clientId) return toast.error("Kies een klant");
    if (items.some(i => !i.description)) return toast.error("Alle regels moeten een omschrijving hebben");
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");
      const payload = {
        user_id: user.id, client_id: clientId, invoice_number: number,
        issue_date: issueDate, due_date: dueDate, status, notes,
        subtotal, vat_amount: vat, total,
      };
      let invoiceId = id;
      if (isNew) {
        const { data, error } = await supabase.from("invoices").insert(payload).select("id").single();
        if (error) throw error;
        invoiceId = data.id;
      } else {
        const { error } = await supabase.from("invoices").update(payload).eq("id", id!);
        if (error) throw error;
        await supabase.from("invoice_items").delete().eq("invoice_id", id!);
      }
      const itemsPayload = items.map((it, idx) => ({
        invoice_id: invoiceId!, user_id: user.id,
        description: it.description, quantity: it.quantity,
        unit_price: it.unit_price, vat_rate: it.vat_rate, position: idx,
      }));
      const { error: itErr } = await supabase.from("invoice_items").insert(itemsPayload);
      if (itErr) throw itErr;
      toast.success("Opgeslagen");
      qc.invalidateQueries({ queryKey: ["invoices"] });
      nav("/app/facturen");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Er ging iets mis");
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => nav("/app/facturen")}><ArrowLeft className="h-4 w-4 mr-2" /> Terug</Button>
        <Button onClick={save} disabled={saving}><Save className="h-4 w-4 mr-2" /> {saving ? "Opslaan…" : "Opslaan"}</Button>
      </div>

      <div>
        <div className="label-eyebrow">{isNew ? "Nieuw" : "Bewerken"}</div>
        <h1 className="font-serif text-3xl mt-2">Factuur {number}</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Klant *</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Kies klant" /></SelectTrigger>
              <SelectContent>
                {clients.map((c: Record<string, unknown>) => <SelectItem key={c.id as string} value={c.id as string}>{c.name as string}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: string) => setStatus(v as typeof status)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["concept","verzonden","betaald","vervallen","geannuleerd"].map(s =>
                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Factuurnummer</Label>
            <Input value={number} onChange={e => setNumber(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Datum</Label><Input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Vervaldatum</Label><Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Regels</h2>
          <Button variant="outline" size="sm" onClick={() => setItems([...items, { description: "", quantity: 1, unit_price: 0, vat_rate: 21, position: items.length }])}>
            <Plus className="h-4 w-4 mr-1.5" /> Regel
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-start">
              <Input className="col-span-12 md:col-span-5" placeholder="Omschrijving" value={it.description} onChange={e => updateItem(idx, { description: e.target.value })} />
              <Input className="col-span-3 md:col-span-1" type="number" step="0.01" placeholder="Aantal" value={it.quantity} onChange={e => updateItem(idx, { quantity: parseFloat(e.target.value) || 0 })} />
              <Input className="col-span-4 md:col-span-2" type="number" step="0.01" placeholder="Prijs" value={it.unit_price} onChange={e => updateItem(idx, { unit_price: parseFloat(e.target.value) || 0 })} />
              <Select value={String(it.vat_rate)} onValueChange={v => updateItem(idx, { vat_rate: parseFloat(v) })}>
                <SelectTrigger className="col-span-3 md:col-span-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[0, 9, 21].map(r => <SelectItem key={r} value={String(r)}>{r}% BTW</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="col-span-2 md:col-span-1 text-right py-2 text-sm font-medium">{eur(it.quantity * it.unit_price * (1 + it.vat_rate / 100))}</div>
              <Button variant="ghost" size="icon" className="col-span-12 md:col-span-1" onClick={() => setItems(items.filter((_, i) => i !== idx))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-1 max-w-xs ml-auto text-sm">
          <Row label="Subtotaal" value={eur(subtotal)} />
          <Row label="BTW" value={eur(vat)} />
          <div className="border-t border-border pt-2 mt-2"><Row label="Totaal" value={eur(total)} bold /></div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-1.5">
        <Label>Notities op de factuur</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Bijv. betaalinstructies, referentie…" />
      </div>
    </div>
  );
}

const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
  <div className={`flex justify-between ${bold ? "font-serif text-lg" : ""}`}>
    <span className="text-muted-foreground">{label}</span><span>{value}</span>
  </div>
);
