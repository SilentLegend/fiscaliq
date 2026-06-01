import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function sanitize(val: string | null | undefined): string {
  if (!val) return "";
  const s = val.trim().slice(0, 500);
  if (s.startsWith("=") || s.startsWith("+") || s.startsWith("-") || s.startsWith("@") || s.startsWith("|")) {
    return "'" + s;
  }
  return s;
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        if (ch === "\r") i++;
        current.push(field);
        field = "";
        if (current.length > 0 && current.some(c => c.length > 0)) {
          rows.push(current);
        }
        current = [];
      } else if (ch === "\r") {
        current.push(field);
        field = "";
        if (current.length > 0 && current.some(c => c.length > 0)) {
          rows.push(current);
        }
        current = [];
      } else {
        field += ch;
      }
    }
  }
  if (field || current.length > 0) {
    current.push(field);
    if (current.some(c => c.length > 0)) rows.push(current);
  }
  return rows;
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "");
}

function detectFormat(headers: string[]): "abn" | "ing" | "rabo" | "bunq" | "revolut" | "generic" {
  const h = headers.map(normalizeHeader);
  const joined = h.join(" ");
  if (joined.includes("iban") && joined.includes("transaction")) return "abn";
  if (joined.includes("naam") && joined.includes("bedrag") && joined.includes("munt")) return "ing";
  if (joined.includes("tegenrekening") && joined.includes("bedrag") && joined.includes("valuta")) return "rabo";
  if (joined.includes("to account") || joined.includes("from account")) return "bunq";
  if (joined.includes("type") && joined.includes("product") && joined.includes("amount")) return "revolut";
  return "generic";
}

function parseTransactions(
  rows: string[][], format: "abn" | "ing" | "rabo" | "bunq" | "revolut" | "generic",
): { date: string; amount: number; counterparty: string; description: string; iban: string }[] {
  if (rows.length < 2) return [];
  const headerRow = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  const findCol = (aliases: string[]): number => {
    for (const a of aliases) {
      const idx = headerRow.findIndex(h => h.includes(a));
      if (idx >= 0) return idx;
    }
    return -1;
  };

  const dateCol = findCol(["datum", "date", "booking date", "valuta", "transaction date", "execution date"]);
  const amountCol = findCol(["bedrag", "amount", "euro", "value"]);
  const counterpartyCol = findCol(["naam", "tegenrekening", "tegenpartij", "counterparty", "name", "creditor", "from account", "to account", "beneficiary"]);
  const descCol = findCol(["omschrijving", "description", "transaction", "reference", "mededeling", "mutation"]);
  const ibanCol = findCol(["iban", "tegenrekening iban", "counterparty iban", "account"]);

  const results: { date: string; amount: number; counterparty: string; description: string; iban: string }[] = [];

  for (const row of dataRows) {
    try {
      let date = dateCol >= 0 ? sanitize(row[dateCol]) : "";
      let amountStr = amountCol >= 0 ? (row[amountCol] ?? "").trim() : "0";
      let counterparty = counterpartyCol >= 0 ? sanitize(row[counterpartyCol]) : "";
      let description = descCol >= 0 ? sanitize(row[descCol]) : "";
      let iban = ibanCol >= 0 ? sanitize(row[ibanCol]).replace(/\s/g, "").toUpperCase() : "";

      if (!date) continue;

      date = date.replace(/(\d{2})[-\/](\d{2})[-\/](\d{4})/, "$3-$2-$1");
      date = date.replace(/(\d{2})[-\/](\d{2})[-\/](\d{2})/, "20$3-$2-$1");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

      let amount = 0;
      if (format === "abn") {
        const creditMatch = row[amountCol]?.trim();
        const debitCol = findCol(["debet"]);
        const debitMatch = debitCol >= 0 ? (row[debitCol] ?? "").trim() : "";
        if (creditMatch && !isNaN(parseFloat(creditMatch.replace(",", ".")))) {
          amount = parseFloat(creditMatch.replace(",", "."));
        } else if (debitMatch && !isNaN(parseFloat(debitMatch.replace(",", ".")))) {
          amount = -Math.abs(parseFloat(debitMatch.replace(",", ".")));
        }
      } else {
        amountStr = amountStr.replace(/€\s*/g, "").replace(/\./g, "").replace(",", ".");
        if (amountStr.startsWith("+")) amountStr = amountStr.slice(1);
        if (amountStr.startsWith("-")) {
          amount = -Math.abs(parseFloat(amountStr.slice(1)));
        } else {
          amount = parseFloat(amountStr) || 0;
        }
      }

      if (isNaN(amount) || !isFinite(amount)) continue;
      if (Math.abs(amount) < 0.01) continue;

      results.push({ date, amount, counterparty, description, iban });
    } catch {
      continue;
    }
  }

  return results;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Geen autorisatie");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Ongeldige sessie");

    const { data: recentCount } = await supabase
      .from("bank_transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 3600000).toISOString());
    const importCount = recentCount?.count ?? 0;
    if (importCount > 200) {
      throw new Error("Te veel imports in het afgelopen uur (max 200 transacties)");
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") throw new Error("Geen CSV bestand gevonden");

    const fileObj = file as { name?: string; text: () => Promise<string> };
    const csvText = await fileObj.text();
    if (csvText.length > 5 * 1024 * 1024) throw new Error("CSV te groot (max 5MB)");
    if (!csvText.trim()) throw new Error("CSV is leeg");

    const rows = parseCSV(csvText);
    if (rows.length < 2) throw new Error("Geen transacties gevonden in CSV");

    const format = detectFormat(rows[0]);
    const transactions = parseTransactions(rows, format);
    if (transactions.length === 0) throw new Error("Geen geldige transacties gevonden");

    const connectionQuery = await supabase
      .from("bank_connections")
      .select("id")
      .eq("user_id", user.id)
      .eq("provider", "csv")
      .limit(1)
      .maybeSingle();

    let connectionId = connectionQuery.data?.id;
    if (!connectionId) {
      const { data: newConn } = await supabase.from("bank_connections").insert({
        user_id: user.id,
        bank_name: "CSV Import",
        provider: "csv",
        status: "active",
        last_sync_at: new Date().toISOString(),
      }).select("id").single();
      connectionId = newConn?.id;
    } else {
      await supabase.from("bank_connections").update({ last_sync_at: new Date().toISOString() }).eq("id", connectionId);
    }

    if (!connectionId) throw new Error("Kon bankkoppeling niet aanmaken");

    let inserted = 0;
    const batchSize = 50;
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize).map(t => ({
        user_id: user.id,
        connection_id: connectionId,
        provider_transaction_id: `csv-${connectionId}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        booking_date: t.date,
        amount: t.amount,
        counterparty_name: t.counterparty || null,
        counterparty_iban: t.iban || null,
        description: t.description || null,
      }));

      const { error: insertError } = await supabase.from("bank_transactions").upsert(batch, {
        onConflict: "connection_id, provider_transaction_id",
        ignoreDuplicates: true,
      });
      if (insertError) {
        console.error("Insert error:", insertError);
        continue;
      }
      inserted += batch.length;
    }

    return new Response(JSON.stringify({
      success: true,
      imported: inserted,
      total: transactions.length,
      format: format,
      skipped: transactions.length - inserted,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Onbekende fout";
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
