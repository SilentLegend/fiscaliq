import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Upload, Receipt as ReceiptIcon, Paperclip } from "lucide-react";
import { eur, nlDate } from "@/lib/format";
import { toast } from "sonner";

const categories = ["Kantoorbenodigdheden", "Software & abonnementen", "Reiskosten", "Eten & verblijf", "Marketing", "Hardware", "Overig"];

export default function Expenses() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [supplier, setSupplier] = useState("");
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState("21");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const { data = [], isLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await supabase.from("expenses").select("*").order("expense_date", { ascending: false })).data ?? [],
  });

  const totals = (data as Record<string, unknown>[]).reduce((acc: { excl: number; incl: number; vat: number }, e: Record<string, unknown>) => ({
    excl: acc.excl + Number(e.amount) - Number(e.vat_amount),
    incl: acc.incl + Number(e.amount), vat: acc.vat + Number(e.vat_amount),
  }), { excl: 0, incl: 0, vat: 0 });

  const reset = () => { setDate(new Date().toISOString().slice(0, 10)); setSupplier(""); setAmount(""); setVatRate("21"); setCategory(categories[0]); setDescription(""); setFile(null); };

  const save = async () => {
    if (!supplier || !amount) return toast.error("Vul leverancier en bedrag in");
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Niet ingelogd");
      const total = parseFloat(amount);
      const rate = parseFloat(vatRate);
      const vatAmount = +(total - total / (1 + rate / 100)).toFixed(2);
      let receiptUrl: string | null = null;
      if (file) {
        const path = `${user.id}/${Date.now()}-${file.name}`;
        const { error: upErr } = await supabase.storage.from("receipts").upload(path, file);
        if (upErr) throw upErr;
        receiptUrl = path;
      }
      const { error } = await supabase.from("expenses").insert({
        user_id: user.id, expense_date: date, supplier, description,
        category, amount: total, vat_amount: vatAmount, vat_rate: rate, receipt_url: receiptUrl,
      });
      if (error) throw error;
      toast.success("Bonnetje toegevoegd");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      setOpen(false); reset();
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Er ging iets mis"); } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Bonnetje verwijderen?")) return;
    await supabase.from("expenses").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["expenses"] });
  };

  const openReceipt = async (path: string) => {
    const { data } = await supabase.storage.from("receipts").createSignedUrl(path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Uitgaven</div>
          <h1 className="font-serif text-3xl mt-2">Bonnetjes</h1>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1.5" /> Bon toevoegen</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-serif text-2xl">Nieuwe uitgave</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Datum</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Bedrag (incl. BTW)</Label><Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} /></div>
              </div>
              <div className="space-y-1.5"><Label>Leverancier</Label><Input value={supplier} onChange={e => setSupplier(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Categorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>BTW</Label>
                  <Select value={vatRate} onValueChange={setVatRate}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["0","9","21"].map(r => <SelectItem key={r} value={r}>{r}%</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Omschrijving</Label><Input value={description} onChange={e => setDescription(e.target.value)} /></div>
              <div className="space-y-1.5">
                <Label>Bon (foto/PDF)</Label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/40">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{file?.name ?? "Bestand kiezen"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
            </div>
            <DialogFooter><Button onClick={save} disabled={saving}>{saving ? "Opslaan…" : "Opslaan"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="stat-card"><div className="label-eyebrow">Totaal incl.</div><div className="font-serif text-2xl mt-2">{eur(totals.incl)}</div></div>
        <div className="stat-card"><div className="label-eyebrow">Totaal excl.</div><div className="font-serif text-2xl mt-2">{eur(totals.excl)}</div></div>
        <div className="stat-card"><div className="label-eyebrow">BTW (terug te vorderen)</div><div className="font-serif text-2xl mt-2">{eur(totals.vat)}</div></div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? <div className="p-12 text-center text-muted-foreground">Laden…</div>
          : data.length === 0 ? (
            <div className="p-16 text-center">
              <ReceiptIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground/40" />
              <div className="text-muted-foreground">Nog geen bonnetjes</div>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="text-left font-medium p-4">Datum</th>
                  <th className="text-left font-medium p-4">Leverancier</th>
                  <th className="text-left font-medium p-4 hidden md:table-cell">Categorie</th>
                  <th className="text-right font-medium p-4">BTW</th>
                  <th className="text-right font-medium p-4">Bedrag</th>
                  <th className="text-right font-medium p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.map((e: Record<string, unknown>) => (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="p-4 text-muted-foreground">{nlDate(e.expense_date)}</td>
                    <td className="p-4 font-medium">
                      {e.supplier}
                      {e.receipt_url && <button onClick={() => openReceipt(e.receipt_url)} className="ml-2 text-primary"><Paperclip className="h-3.5 w-3.5 inline" /></button>}
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{e.category ?? "—"}</td>
                    <td className="p-4 text-right text-muted-foreground">{eur(e.vat_amount)}</td>
                    <td className="p-4 text-right font-medium">{eur(e.amount)}</td>
                    <td className="p-4 text-right"><Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
}
