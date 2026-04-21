import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hcuybmrlozknmyijqabp.supabase.co'
const supabaseKey = 'your-secret-key-here'

export const supabase = createClient(supabaseUrl, supabaseKey)