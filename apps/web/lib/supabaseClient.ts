import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In een echte app kun je dit loggen naar monitoring, voor nu is een error genoeg.
  throw new Error(
***REMOVED***'Supabase environment variables ontbreken. Zet NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in je .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
