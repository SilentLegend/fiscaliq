import { supabase } from "@/integrations/supabase/client";

export interface CsvImportResult {
  success: boolean;
  imported: number;
  total: number;
  format: string;
  skipped: number;
  error?: string;
}

export async function uploadCsv(file: File): Promise<CsvImportResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Niet ingelogd");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Niet ingelogd");

  const formData = new FormData();
  formData.append("file", file);

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/csv-import`;

  const res = await fetch(functionUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.access_token}` },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Fout bij uploaden (${res.status})`);
  }

  return res.json();
}

export function validateCsvFile(file: File): string | null {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) return "Bestand is te groot (max 5MB)";
  if (!file.name.endsWith(".csv")) return "Alleen .csv bestanden worden ondersteund";
  return null;
}
