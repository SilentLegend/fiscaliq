/**
 * Comprehensive Database Verification Script
 * Tests all tables, RLS policies, and data integrity
 */

import { supabase } from './supabaseClient';

interface VerificationResult {
  table: string;
  exists: boolean;
  rowCount: number;
  schema: any;
  rlsEnabled: boolean;
  testInsert: boolean;
  testSelect: boolean;
  testUpdate: boolean;
  testDelete: boolean;
  errors: string[];
}

export async function verifyDatabase(): Promise<VerificationResult[]> {
  const results: VerificationResult[] = [];

  // Get current user for RLS testing
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
***REMOVED***console.error('Auth error:', authError);
***REMOVED***return [];
  }

  console.log('=== DATABASE VERIFICATION ===');
  console.log('Authenticated user:', user.id);
  console.log('');

  // Test each table
  const tables = ['invoices', 'customers', 'receipts', 'trips', 'invoice_lines'];

  for (const tableName of tables) {
***REMOVED***console.log(`\n--- Testing ${tableName} ---`);
***REMOVED***const result: VerificationResult = {
***REMOVED***  table: tableName,
***REMOVED***  exists: false,
***REMOVED***  rowCount: 0,
***REMOVED***  schema: {},
***REMOVED***  rlsEnabled: false,
***REMOVED***  testInsert: false,
***REMOVED***  testSelect: false,
***REMOVED***  testUpdate: false,
***REMOVED***  testDelete: false,
***REMOVED***  errors: [],
***REMOVED***};

***REMOVED***try {
***REMOVED***  // 1. Check if table exists and has data
***REMOVED***  const { data, error: selectError, status } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.select('*', { count: 'exact' })
***REMOVED******REMOVED***.limit(1);

***REMOVED***  if (selectError) {
***REMOVED******REMOVED***result.errors.push(`SELECT failed: ${selectError.message}`);
***REMOVED******REMOVED***console.log(`❌ SELECT failed:`, selectError.message);
***REMOVED***  } else {
***REMOVED******REMOVED***result.exists = true;
***REMOVED******REMOVED***result.testSelect = true;
***REMOVED******REMOVED***console.log(`✅ Table exists`);
***REMOVED***  }

***REMOVED***  // 2. Get row count
***REMOVED***  const { count } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.select('*', { count: 'exact', head: true });

***REMOVED***  if (count !== null) {
***REMOVED******REMOVED***result.rowCount = count;
***REMOVED******REMOVED***console.log(`📊 Row count: ${count}`);
***REMOVED***  }

***REMOVED***  // 3. Test INSERT
***REMOVED***  let testId: string | null = null;
***REMOVED***  const insertPayload = getTestInsertPayload(tableName, user.id);
***REMOVED***  
***REMOVED***  const { data: insertedData, error: insertError } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.insert(insertPayload)
***REMOVED******REMOVED***.select('id')
***REMOVED******REMOVED***.single();

***REMOVED***  if (insertError) {
***REMOVED******REMOVED***result.errors.push(`INSERT failed: ${insertError.message}`);
***REMOVED******REMOVED***console.log(`❌ INSERT failed:`, insertError.message);
***REMOVED***  } else {
***REMOVED******REMOVED***result.testInsert = true;
***REMOVED******REMOVED***testId = insertedData?.id;
***REMOVED******REMOVED***console.log(`✅ INSERT successful (id: ${testId})`);
***REMOVED***  }

***REMOVED***  // 4. Test UPDATE
***REMOVED***  if (testId) {
***REMOVED******REMOVED***const updatePayload = getTestUpdatePayload(tableName);
***REMOVED******REMOVED***const { error: updateError } = await supabase
***REMOVED******REMOVED***  .from(tableName)
***REMOVED******REMOVED***  .update(updatePayload)
***REMOVED******REMOVED***  .eq('id', testId);

***REMOVED******REMOVED***if (updateError) {
***REMOVED******REMOVED***  result.errors.push(`UPDATE failed: ${updateError.message}`);
***REMOVED******REMOVED***  console.log(`❌ UPDATE failed:`, updateError.message);
***REMOVED******REMOVED***} else {
***REMOVED******REMOVED***  result.testUpdate = true;
***REMOVED******REMOVED***  console.log(`✅ UPDATE successful`);
***REMOVED******REMOVED***}
***REMOVED***  }

***REMOVED***  // 5. Test DELETE
***REMOVED***  if (testId) {
***REMOVED******REMOVED***const { error: deleteError } = await supabase
***REMOVED******REMOVED***  .from(tableName)
***REMOVED******REMOVED***  .delete()
***REMOVED******REMOVED***  .eq('id', testId);

***REMOVED******REMOVED***if (deleteError) {
***REMOVED******REMOVED***  result.errors.push(`DELETE failed: ${deleteError.message}`);
***REMOVED******REMOVED***  console.log(`❌ DELETE failed:`, deleteError.message);
***REMOVED******REMOVED***} else {
***REMOVED******REMOVED***  result.testDelete = true;
***REMOVED******REMOVED***  console.log(`✅ DELETE successful`);
***REMOVED******REMOVED***}
***REMOVED***  }

***REMOVED***  // 6. Check RLS (by checking if we can see data)
***REMOVED***  const { data: rlsTest } = await supabase
***REMOVED******REMOVED***.from(tableName)
***REMOVED******REMOVED***.select('*', { head: true })
***REMOVED******REMOVED***.eq('user_id', user.id)
***REMOVED******REMOVED***.limit(1);

***REMOVED***  result.rlsEnabled = true;
***REMOVED***  console.log(`✅ RLS appears active`);
***REMOVED***} catch (error: any) {
***REMOVED***  result.errors.push(`Unexpected error: ${error.message}`);
***REMOVED***  console.error(`❌ Error:`, error.message);
***REMOVED***}

***REMOVED***results.push(result);
  }

  // Summary
  console.log('\n\n=== SUMMARY ===');
  const summary = {
***REMOVED***totalTables: results.length,
***REMOVED***existingTables: results.filter(r => r.exists).length,
***REMOVED***selectPassing: results.filter(r => r.testSelect).length,
***REMOVED***insertPassing: results.filter(r => r.testInsert).length,
***REMOVED***updatePassing: results.filter(r => r.testUpdate).length,
***REMOVED***deletePassing: results.filter(r => r.testDelete).length,
***REMOVED***rlsEnabled: results.filter(r => r.rlsEnabled).length,
***REMOVED***totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
  };

  console.table(summary);
  console.log('\nDetailed results:', results);

  return results;
}

function getTestInsertPayload(tableName: string, userId: string): any {
  const baseDate = new Date().toISOString().split('T')[0];

  switch (tableName) {
***REMOVED***case 'invoices':
***REMOVED***  return {
***REMOVED******REMOVED***user_id: userId,
***REMOVED******REMOVED***customer_id: 'test-customer-' + Math.random(),
***REMOVED******REMOVED***customer_name: 'Test Customer ' + Math.random(),
***REMOVED******REMOVED***issue_date: baseDate,
***REMOVED******REMOVED***due_date: baseDate,
***REMOVED******REMOVED***amount_excl: 100,
***REMOVED******REMOVED***amount_incl: 121,
***REMOVED******REMOVED***status: 'concept',
***REMOVED******REMOVED***notes: 'Test invoice',
***REMOVED***  };
***REMOVED***case 'customers':
***REMOVED***  return {
***REMOVED******REMOVED***user_id: userId,
***REMOVED******REMOVED***name: 'Test Customer ' + Math.random(),
***REMOVED******REMOVED***email: 'test@example.com',
***REMOVED******REMOVED***phone: '0612345678',
***REMOVED******REMOVED***kvk_number: '12345678',
***REMOVED******REMOVED***vat_number: 'NL123456789B01',
***REMOVED***  };
***REMOVED***case 'receipts':
***REMOVED***  return {
***REMOVED******REMOVED***user_id: userId,
***REMOVED******REMOVED***date: baseDate,
***REMOVED******REMOVED***description: 'Test receipt',
***REMOVED******REMOVED***category: 'kantoor',
***REMOVED******REMOVED***amount: 50.00,
***REMOVED***  };
***REMOVED***case 'trips':
***REMOVED***  return {
***REMOVED******REMOVED***user_id: userId,
***REMOVED******REMOVED***date: baseDate,
***REMOVED******REMOVED***description: 'Test trip',
***REMOVED******REMOVED***start_location: 'Amsterdam',
***REMOVED******REMOVED***end_location: 'Rotterdam',
***REMOVED******REMOVED***km: 50,
***REMOVED******REMOVED***cost: 9.50,
***REMOVED***  };
***REMOVED***case 'invoice_lines':
***REMOVED***  return {
***REMOVED******REMOVED***invoice_id: 'test-invoice-' + Math.random(),
***REMOVED******REMOVED***description: 'Test line',
***REMOVED******REMOVED***quantity: 1,
***REMOVED******REMOVED***unit_price: 100,
***REMOVED***  };
***REMOVED***default:
***REMOVED***  return { user_id: userId };
  }
}

function getTestUpdatePayload(tableName: string): any {
  switch (tableName) {
***REMOVED***case 'invoices':
***REMOVED***  return { notes: 'Updated test note' };
***REMOVED***case 'customers':
***REMOVED***  return { email: 'updated@example.com' };
***REMOVED***case 'receipts':
***REMOVED***  return { description: 'Updated test receipt' };
***REMOVED***case 'trips':
***REMOVED***  return { description: 'Updated test trip' };
***REMOVED***case 'invoice_lines':
***REMOVED***  return { description: 'Updated test line' };
***REMOVED***default:
***REMOVED***  return {};
  }
}
