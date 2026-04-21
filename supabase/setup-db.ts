import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🔧 Starting Supabase Database Setup...\n');

  // SQL Scripts
  const receiptsSql = `
CREATE TABLE IF NOT EXISTS public.receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('reiskosten', 'eten-drinken', 'kantoor', 'software', 'overige')),
  amount NUMERIC(10, 2) NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT amount_positive CHECK (amount > 0)
);

ALTER TABLE IF EXISTS public.receipts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can insert their own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can delete their own receipts" ON public.receipts;
DROP POLICY IF EXISTS "Users can update their own receipts" ON public.receipts;

CREATE POLICY "Users can view their own receipts"
  ON public.receipts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own receipts"
  ON public.receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own receipts"
  ON public.receipts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own receipts"
  ON public.receipts FOR DELETE
  USING (auth.uid() = user_id);

DROP INDEX IF EXISTS receipts_user_id_date_idx;
CREATE INDEX receipts_user_id_date_idx ON public.receipts(user_id, date DESC);
  `;

  const tripsSql = `
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  km NUMERIC(8, 2) NOT NULL,
  cost NUMERIC(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT km_positive CHECK (km > 0),
  CONSTRAINT cost_positive CHECK (cost IS NULL OR cost > 0)
);

ALTER TABLE IF EXISTS public.trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can insert their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can update their own trips" ON public.trips;
DROP POLICY IF EXISTS "Users can delete their own trips" ON public.trips;

CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

DROP INDEX IF EXISTS trips_user_id_date_idx;
CREATE INDEX trips_user_id_date_idx ON public.trips(user_id, date DESC);
  `;

  try {
***REMOVED***console.log('⏳ Setting up Receipts table...');
***REMOVED***const { error: receiptsError } = await supabase.sql`${receiptsSql}`;
***REMOVED***
***REMOVED***if (receiptsError) {
***REMOVED***  console.error('❌ Receipts error:', receiptsError.message);
***REMOVED***} else {
***REMOVED***  console.log('✅ Receipts table created successfully\n');
***REMOVED***}
  } catch (err: any) {
***REMOVED***console.error('❌ Error creating receipts:', err.message);
  }

  try {
***REMOVED***console.log('⏳ Setting up Trips table...');
***REMOVED***const { error: tripsError } = await supabase.sql`${tripsSql}`;
***REMOVED***
***REMOVED***if (tripsError) {
***REMOVED***  console.error('❌ Trips error:', tripsError.message);
***REMOVED***} else {
***REMOVED***  console.log('✅ Trips table created successfully\n');
***REMOVED***}
  } catch (err: any) {
***REMOVED***console.error('❌ Error creating trips:', err.message);
  }

  console.log('🔍 Verifying tables...\n');

  // Verify tables exist
  const tables = ['receipts', 'trips'];
  for (const tableName of tables) {
***REMOVED***try {
***REMOVED***  const { data, error, count } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.select('*', { count: 'exact', head: true });

***REMOVED***  if (error) {
***REMOVED******REMOVED***console.log(`❌ ${tableName}: ${error.message}`);
***REMOVED***  } else {
***REMOVED******REMOVED***console.log(`✅ ${tableName}: EXISTS (${count} rows)`);
***REMOVED***  }
***REMOVED***} catch (err: any) {
***REMOVED***  console.log(`❌ ${tableName}: ${err.message}`);
***REMOVED***}
  }

  console.log('\n✨ Database setup complete!');
}

setupDatabase().catch(console.error);
