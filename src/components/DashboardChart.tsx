import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Period = "week" | "maand" | "kwartaal" | "jaar";

const periodOptions: { key: Period; label: string }[] = [
  { key: "week", label: "Week" },
  { key: "maand", label: "Maand" },
  { key: "kwartaal", label: "Kwartaal" },
  { key: "jaar", label: "Jaar" },
];

function getDateRange(period: Period): { start: string; labelFn: (d: Date) => string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  switch (period) {
    case "week": {
      const start = new Date(now);
      start.setDate(now.getDate() - 27);
      return {
        start: start.toISOString().slice(0, 10),
        labelFn: (d: Date) => {
          const days = ["zo", "ma", "di", "wo", "do", "vr", "za"];
          return `${d.getDate()} ${days[d.getDay()]}`;
        },
      };
    }
    case "maand": {
      const start = new Date(y, m - 5, 1);
      return {
        start: start.toISOString().slice(0, 10),
        labelFn: (d: Date) => {
          const months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
          return months[d.getMonth()];
        },
      };
    }
    case "kwartaal": {
      const start = new Date(y - 1, 0, 1);
      return {
        start: start.toISOString().slice(0, 10),
        labelFn: (d: Date) => `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear().toString().slice(2)}`,
      };
    }
    case "jaar": {
      const start = new Date(y - 3, 0, 1);
      return {
        start: start.toISOString().slice(0, 10),
        labelFn: (d: Date) => `${d.getFullYear()}`,
      };
    }
  }
}

function groupByPeriod(
  rows: { date: string; amount: number }[],
  period: Period,
  labelFn: (d: Date) => string,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const r of rows) {
    const d = new Date(r.date);
    let key: string;
    switch (period) {
      case "week": {
        const day = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - ((day + 6) % 7));
        key = mon.toISOString().slice(0, 10);
        break;
      }
      case "maand":
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        break;
      case "kwartaal":
        key = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
        break;
      case "jaar":
        key = `${d.getFullYear()}`;
        break;
    }
    map.set(key, (map.get(key) ?? 0) + r.amount);
  }
  return map;
}

function generateKeys(period: Period): string[] {
  const now = new Date();
  const keys: string[] = [];
  switch (period) {
    case "week": {
      for (let i = 27; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        const day = d.getDay();
        const mon = new Date(d);
        mon.setDate(d.getDate() - ((day + 6) % 7));
        keys.push(mon.toISOString().slice(0, 10));
      }
      break;
    }
    case "maand": {
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
      }
      break;
    }
    case "kwartaal": {
      const startQ = Math.floor((now.getMonth()) / 3) + 1;
      for (let i = 4; i >= 0; i--) {
        const q = ((startQ - i - 1 + 4) % 4) + 1;
        const y = now.getFullYear() - Math.floor((i - (startQ - 1) + 4) / 4);
        keys.push(`${y}-Q${q}`);
      }
      break;
    }
    case "jaar": {
      for (let i = 3; i >= 0; i--) {
        keys.push(`${now.getFullYear() - i}`);
      }
      break;
    }
  }
  return [...new Set(keys)];
}

function formatLabel(key: string, period: Period, labelFn: (d: Date) => string): string {
  switch (period) {
    case "week": {
      const d = new Date(key);
      return labelFn(d);
    }
    case "maand": {
      const [y, m] = key.split("-").map(Number);
      return labelFn(new Date(y, m - 1));
    }
    case "kwartaal": {
      const [yStr, qStr] = key.split("-");
      const q = parseInt(qStr.slice(1));
      return `Q${q} ${yStr.slice(2)}`;
    }
    case "jaar": {
      return key;
    }
  }
}

const tooltipFormatter = (value: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);

export default function DashboardChart() {
  const [period, setPeriod] = useState<Period>("maand");

  const { start, labelFn } = getDateRange(period);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-chart", period, start],
    queryFn: async () => {
      const [inv, exp] = await Promise.all([
        supabase.from("invoices").select("issue_date,total").gte("issue_date", start).neq("status", "concept"),
        supabase.from("expenses").select("expense_date,amount").gte("expense_date", start),
      ]);
      return { invoices: inv.data ?? [], expenses: exp.data ?? [] };
    },
  });

  const invMap = groupByPeriod(
    (data?.invoices ?? []).map(r => ({ date: r.issue_date, amount: Number(r.total) })),
    period,
    labelFn,
  );
  const expMap = groupByPeriod(
    (data?.expenses ?? []).map(r => ({ date: r.expense_date, amount: Number(r.amount) })),
    period,
    labelFn,
  );

  const keys = generateKeys(period);
  const chartData = keys.map(key => ({
    label: formatLabel(key, period, labelFn),
    Omzet: invMap.get(key) ?? 0,
    Uitgaven: expMap.get(key) ?? 0,
  }));

  return (
    <div className="stat-card">
      <div className="mb-6">
        <h2 className="font-serif text-xl">Omzet &amp; uitgaven</h2>
        <div className="flex gap-1 mt-3">
          {periodOptions.map(opt => (
            <button
              key={opt.key}
              onClick={() => setPeriod(opt.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === opt.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-[250px] grid place-items-center text-muted-foreground text-sm">Laden...</div>
      ) : chartData.every(d => d.Omzet === 0 && d.Uitgaven === 0) ? (
        <div className="h-[250px] grid place-items-center text-muted-foreground text-sm">
          Nog geen data voor deze periode
        </div>
      ) : (
        <div className="h-[280px] sm:h-[300px] overflow-visible">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={2} margin={{ bottom: 24, left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                interval={chartData.length > 8 ? "preserveStartEnd" : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => v >= 1000 ? `€${(v / 1000).toFixed(0)}k` : `€${v}`}
              />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: 12,
                }}
                cursor={{ fill: "hsl(var(--primary-soft))", opacity: 0.5 }}
              />
              <Bar dataKey="Omzet" fill="hsl(var(--chart-revenue))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Uitgaven" fill="hsl(var(--chart-expenses))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
