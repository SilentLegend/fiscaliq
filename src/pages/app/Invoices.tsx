import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { eur, nlDate } from "@/lib/format";
import { Plus, FileText } from "lucide-react";

const statusStyle: Record<string, string> = {
  concept: "bg-muted text-muted-foreground",
  verzonden: "bg-info/10 text-info",
  betaald: "bg-success/10 text-success",
  vervallen: "bg-destructive/10 text-destructive",
  geannuleerd: "bg-muted text-muted-foreground",
};

export default function Invoices() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices")
        .select("id, invoice_number, issue_date, due_date, total, status, clients(name)")
        .order("issue_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Verkoop</div>
          <h1 className="font-serif text-3xl mt-2">Facturen</h1>
        </div>
        <Button asChild><Link to="/app/facturen/nieuw"><Plus className="h-4 w-4 mr-1.5" /> Nieuwe factuur</Link></Button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Laden…</div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center">
            <FileText className="h-10 w-10 mx-auto mb-4 text-muted-foreground/40" />
            <div className="text-muted-foreground mb-4">Nog geen facturen</div>
            <Button asChild><Link to="/app/facturen/nieuw"><Plus className="h-4 w-4 mr-1.5" /> Eerste factuur maken</Link></Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium p-4">Nummer</th>
                <th className="text-left font-medium p-4">Klant</th>
                <th className="text-left font-medium p-4 hidden md:table-cell">Datum</th>
                <th className="text-left font-medium p-4 hidden lg:table-cell">Vervaldatum</th>
                <th className="text-left font-medium p-4">Status</th>
                <th className="text-right font-medium p-4">Bedrag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((r: Record<string, unknown>) => (
                <tr key={r.id} className="hover:bg-muted/30 cursor-pointer">
                  <td className="p-4"><Link to={`/app/facturen/${r.id}`} className="font-medium hover:text-primary">{r.invoice_number}</Link></td>
                  <td className="p-4 text-muted-foreground">{r.clients?.name ?? "—"}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{nlDate(r.issue_date)}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell">{nlDate(r.due_date)}</td>
                  <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs capitalize ${statusStyle[r.status] ?? ""}`}>{r.status}</span></td>
                  <td className="p-4 text-right font-medium">{eur(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
