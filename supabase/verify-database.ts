#!/usr/bin/env node
/**
 * Database Connection Verification Script
 * Tests Supabase connection and all tables
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔍 Database Verification');
console.log('========================\n');
console.log('SUPABASE_URL:', SUPABASE_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface TableCheck {
  name: string;
  exists: boolean;
  rowCount: number;
  error?: string;
}

async function verifyDatabase() {
  const results: TableCheck[] = [];
  const tables = ['invoices', 'customers', 'receipts', 'trips', 'invoice_lines'];

  console.log('\n📊 Checking Tables:\n');

  for (const tableName of tables) {
***REMOVED***try {
***REMOVED***  const { data, error, count } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.select('*', { count: 'exact', head: true });

***REMOVED***  if (error) {
***REMOVED******REMOVED***results.push({
***REMOVED******REMOVED***  name: tableName,
***REMOVED******REMOVED***  exists: false,
***REMOVED******REMOVED***  rowCount: 0,
***REMOVED******REMOVED***  error: error.message,
***REMOVED******REMOVED***});
***REMOVED******REMOVED***console.log(`❌ ${tableName}: ${error.message}`);
***REMOVED***  } else {
***REMOVED******REMOVED***results.push({
***REMOVED******REMOVED***  name: tableName,
***REMOVED******REMOVED***  exists: true,
***REMOVED******REMOVED***  rowCount: count || 0,
***REMOVED******REMOVED***});
***REMOVED******REMOVED***console.log(`✅ ${tableName}: ${count || 0} rows`);
***REMOVED***  }
***REMOVED***} catch (error: any) {
***REMOVED***  results.push({
***REMOVED******REMOVED***name: tableName,
***REMOVED******REMOVED***exists: false,
***REMOVED******REMOVED***rowCount: 0,
***REMOVED******REMOVED***error: error.message,
***REMOVED***  });
***REMOVED***  console.log(`❌ ${tableName}: ${error.message}`);
***REMOVED***}
  }

  console.log('\n📋 Summary:');
  console.log('===========');
  
  const successful = results.filter(r => r.exists).length;
  const total = results.length;
  
  console.log(`✓ Tables found: ${successful}/${total}`);
  console.log(`✓ Total rows across all tables: ${results.reduce((sum, r) => sum + r.rowCount, 0)}`);
  
  if (successful === total) {
***REMOVED***console.log('\n✅ All tables are accessible!');
  } else {
***REMOVED***console.log('\n⚠️  Some tables are missing or inaccessible');
  }

  return results;
}

// Run verification
verifyDatabase()
  .then((results) => {
***REMOVED***console.log('\n✓ Verification complete');
***REMOVED***process.exit(results.filter(r => r.exists).length === results.length ? 0 : 1);
  })
  .catch((error) => {
***REMOVED***console.error('\n❌ Verification failed:', error.message);
***REMOVED***process.exit(1);
  });
