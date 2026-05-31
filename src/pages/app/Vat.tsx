import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { eur } from "@/lib/format";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const yearNow = new Date().getFullYear();
const years = [yearNow, yearNow - 1, yearNow - 2];

export default function Vat() {
  const [year, setYear] = useState(yearNow);

  const { data } = useQuery({
    queryKey: ["vat", year],
    queryFn: async () => {
      const start = `${year}-01-01`, end = `${year}-12-31`;
      const [inv, exp] = await Promise.all([
        supabase.from("invoices").select("issue_date, vat_amount, status").gte("issue_date", start).lte("issue_date", end).neq("status", "concept"),
        supabase.from("expenses").select("expense_date, vat_amount").gte("expense_date", start).lte("expense_date", end),
      ]);
      const quarters = [1, 2, 3, 4].map(q => ({ q, vatOut: 0, vatIn: 0 }));
      (inv.data ?? []).forEach((r: Record<string, unknown>) => {
        const q = Math.floor(new Date(r.issue_date as string).getMonth() / 3);
        (quarters[q]!).vatOut += Number(r.vat_amount || 0);
      });
      (exp.data ?? []).forEach((r: Record<string, unknown>) => {
        const q = Math.floor(new Date(r.expense_date as string).getMonth() / 3);
        (quarters[q]!).vatIn += Number(r.vat_amount || 0);
      });
      return quarters;
    },
  });

  const totalDue = (data ?? []).reduce((s, q) => s + Math.max(0, q.vatOut - q.vatIn), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <div className="label-eyebrow">Belasting</div>
          <h1 className="font-serif text-3xl mt-2">BTW overzicht</h1>
        </div>
        <Select value={String(year)} onValueChange={v => setYear(parseInt(v))}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="label-eyebrow">Totaal te betalen {year}</div>
        <div className="font-serif text-4xl mt-2">{eur(totalDue)}</div>
        <p className="text-sm text-muted-foreground mt-2">Op basis van facturen verzonden en uitgaven met bon.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {(data ?? []).map(q => {
          const due = Math.max(0, q.vatOut - q.vatIn);
          return (
            <div key={q.q} className="stat-card">
              <div className="label-eyebrow">Kwartaal {q.q}</div>
              <div className="font-serif text-3xl mt-2">{eur(due)}</div>
              <div className="border-t border-border mt-4 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">BTW omzet</span><span>{eur(q.vatOut)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">BTW inkoop</span><span>−{eur(q.vatIn)}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
        <strong className="text-foreground">Let op:</strong> dit overzicht is een hulpmiddel. De definitieve aangifte doe je via Mijn Belastingdienst Zakelijk.
      </div>
    </div>
  );
}
