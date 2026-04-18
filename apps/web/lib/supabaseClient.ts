import { createClient } from '@supabase/supabase-js';

// Ondersteunt zowel NEXT_PUBLIC_* (aanbevolen) als SUPABASE_* (Vercel/Supabase connector)
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We loggen alleen een waarschuwing zodat de build niet crasht.
  // In ontwikkel- of preview-omgevingen merk je het pas wanneer je auth gebruikt.
  console.warn(
***REMOVED***'Supabase env vars ontbreken. Stel NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (of SUPABASE_URL / SUPABASE_ANON_KEY) in.'
  );
}

// In "echte" omgevingen (Vercel, lokaal met .env.local) horen deze variabelen gezet te zijn.
// Als ze ontbreken, is supabaseClient nog steeds bruikbaar, maar aanroepen zullen op runtime fout geven
// in plaats van tijdens de build.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
);
