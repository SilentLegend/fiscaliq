import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, CheckCircle2, Circle, PlayCircle, Lightbulb, GripVertical } from "lucide-react";
import { toast } from "sonner";

type Item = {
  id: string;
  title: string;
  description: string | null;
  phase: "nu" | "binnenkort" | "later" | "idee";
  status: "idee" | "gepland" | "bezig" | "klaar";
  priority: number;
};

const phases: { key: Item["phase"]; label: string; sub: string }[] = [
  { key: "nu",         label: "Nu",         sub: "Waar je deze week aan werkt" },
  { key: "binnenkort", label: "Binnenkort", sub: "Volgende sprint" },
  { key: "later",      label: "Later",      sub: "Gepland voor de toekomst" },
  { key: "idee",       label: "Ideeën",     sub: "Brainstorm & backlog" },
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
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Item> | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["roadmap"],
    queryFn: async () => {
      const { data } = await supabase.from("roadmap_items")
        .select("*")
        .order("phase", { ascending: true })
        .order("priority", { ascending: false })
        .order("position", { ascending: true });
      return (data ?? []) as Item[];
    },
  });

  const grouped = phases.map(p => ({
    ...p,
    items: items.filter(i => i.phase === p.key),
  }));

  const totalDone = items.filter(i => i.status === "klaar").length;
  const totalActive = items.filter(i => i.status === "bezig").length;
  const progress = items.length > 0 ? Math.round((totalDone / items.length) * 100) : 0;

  const save = async () => {
    if (!editing?.title) { toast.error("Titel is verplicht"); return; }
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;

    const payload = {
      title: editing.title,
      description: editing.description ?? null,
      phase: editing.phase ?? "idee",
      status: editing.status ?? "idee",
      priority: editing.priority ?? 0,
      user_id: user.id,
    };

    const { error } = editing.id
      ? await supabase.from("roadmap_items").update(payload).eq("id", editing.id)
      : await supabase.from("roadmap_items").insert(payload);

    if (error) { toast.error(error.message); return; }
    toast.success(editing.id ? "Bijgewerkt" : "Toegevoegd");
    setOpen(false);
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["roadmap"] });
  };

  const updateStatus = async (id: string, status: Item["status"]) => {
    await supabase.from("roadmap_items").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["roadmap"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Verwijderen?")) return;
    await supabase.from("roadmap_items").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["roadmap"] });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="label-eyebrow">Project</div>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Roadmap</h1>
          <p className="text-muted-foreground mt-1">Jouw persoonlijke planning voor Fiscaliq.</p>
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ phase: "idee", status: "idee" })}>
              <Plus className="h-4 w-4 mr-2" /> Nieuw item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editing?.id ? "Item bewerken" : "Nieuw roadmap-item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Titel</Label>
                <Input value={editing?.title ?? ""} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Bv. PDF-export voor facturen" />
              </div>
              <div className="space-y-1.5">
                <Label>Beschrijving</Label>
                <Textarea rows={3} value={editing?.description ?? ""} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Optioneel: details, links, ideeën..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Fase</Label>
                  <Select value={editing?.phase ?? "idee"} onValueChange={(v: Item["phase"]) => setEditing({ ...editing, phase: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {phases.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={editing?.status ?? "idee"} onValueChange={(v: Item["status"]) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idee">Idee</SelectItem>
                      <SelectItem value="gepland">Gepland</SelectItem>
                      <SelectItem value="bezig">Bezig</SelectItem>
                      <SelectItem value="klaar">Klaar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Prioriteit (0-10)</Label>
                <Input type="number" min={0} max={10} value={editing?.priority ?? 0} onChange={e => setEditing({ ...editing, priority: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); }}>Annuleren</Button>
              <Button onClick={save}>Opslaan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Voortgang */}
      <div className="grid md:grid-cols-3 gap-5">
        <div className="stat-card">
          <div className="label-eyebrow">Voortgang</div>
          <div className="font-serif text-3xl mt-3">{progress}%</div>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-2">{totalDone} van {items.length} klaar</div>
        </div>
        <div className="stat-card">
          <div className="label-eyebrow">Nu in uitvoering</div>
          <div className="font-serif text-3xl mt-3">{totalActive}</div>
          <div className="text-xs text-muted-foreground mt-2">items met status "bezig"</div>
        </div>
        <div className="stat-card">
          <div className="label-eyebrow">Backlog</div>
          <div className="font-serif text-3xl mt-3">{items.filter(i => i.phase === "idee").length}</div>
          <div className="text-xs text-muted-foreground mt-2">ideeën verzameld</div>
        </div>
      </div>

      {/* Kolommen per fase */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
        {grouped.map(col => (
          <div key={col.key} className="stat-card">
            <div className="mb-4">
              <div className="label-eyebrow">{col.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{col.sub}</div>
            </div>
            <div className="space-y-2.5 min-h-[100px]">
              {isLoading && <div className="text-sm text-muted-foreground">Laden…</div>}
              {!isLoading && col.items.length === 0 && (
                <div className="text-xs text-muted-foreground italic py-6 text-center border border-dashed rounded-md">
                  Nog geen items
                </div>
              )}
              {col.items.map(it => {
                const Icon = statusIcon[it.status];
                return (
                  <div key={it.id} className="group p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                      <button onClick={() => updateStatus(it.id, it.status === "klaar" ? "bezig" : "klaar")} className="flex-shrink-0 mt-0.5">
                        <Icon className={`h-4 w-4 ${statusColor[it.status]}`} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button onClick={() => { setEditing(it); setOpen(true); }} className="text-left w-full">
                          <div className={`text-sm font-medium ${it.status === "klaar" ? "line-through text-muted-foreground" : ""}`}>
                            {it.title}
                          </div>
                          {it.description && (
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{it.description}</div>
                          )}
                        </button>
                        <div className="flex items-center gap-2 mt-2">
                          <Select value={it.status} onValueChange={(v: Item["status"]) => updateStatus(it.id, v)}>
                            <SelectTrigger className="h-6 text-[11px] w-auto px-2 border-none bg-muted/60 hover:bg-muted">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="idee">Idee</SelectItem>
                              <SelectItem value="gepland">Gepland</SelectItem>
                              <SelectItem value="bezig">Bezig</SelectItem>
                              <SelectItem value="klaar">Klaar</SelectItem>
                            </SelectContent>
                          </Select>
                          {it.priority > 0 && (
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">P{it.priority}</span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => remove(it.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
