import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hcuybmrlozknmyijqabp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60'

const supabase = createClient(supabaseUrl, supabaseKey)

interface ColumnInfo {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

interface ConstraintInfo {
  constraint_name: string
  constraint_type: string
}

interface PolicyInfo {
  policyname: string
  permissive: string
  cmd: string
}

async function verifySchema() {
  console.log('🔍 Verifying FiscalIQ Database Schema\n')
  console.log('=' .repeat(60))
  
  const tables = ['invoices', 'customers', 'receipts', 'trips']
  
  for (const tableName of tables) {
***REMOVED***console.log(`\n📋 ${tableName.toUpperCase()}`)
***REMOVED***console.log('-'.repeat(60))
***REMOVED***
***REMOVED***try {
***REMOVED***  // Get columns from information_schema
***REMOVED***  const { data: columns, error: colError } = await supabase
***REMOVED******REMOVED***.from('information_schema.columns')
***REMOVED******REMOVED***.select('column_name, data_type, is_nullable, column_default')
***REMOVED******REMOVED***.eq('table_schema', 'public')
***REMOVED******REMOVED***.eq('table_name', tableName)
***REMOVED******REMOVED***.order('ordinal_position')
***REMOVED***  
***REMOVED***  if (columns && Array.isArray(columns)) {
***REMOVED******REMOVED***console.log('Columns:')
***REMOVED******REMOVED***columns.forEach((col: ColumnInfo) => {
***REMOVED******REMOVED***  const nullable = col.is_nullable === 'YES' ? 'nullable' : 'NOT NULL'
***REMOVED******REMOVED***  const defaultVal = col.column_default ? ` = ${col.column_default}` : ''
***REMOVED******REMOVED***  console.log(`  • ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`)
***REMOVED******REMOVED***})
***REMOVED***  }

***REMOVED***  // Get constraints
***REMOVED***  const { data: constraints } = await supabase
***REMOVED******REMOVED***.from('information_schema.table_constraints')
***REMOVED******REMOVED***.select('constraint_name, constraint_type')
***REMOVED******REMOVED***.eq('table_schema', 'public')
***REMOVED******REMOVED***.eq('table_name', tableName)
***REMOVED***  
***REMOVED***  if (constraints && constraints.length > 0) {
***REMOVED******REMOVED***console.log('\nConstraints:')
***REMOVED******REMOVED***constraints.forEach((c: ConstraintInfo) => {
***REMOVED******REMOVED***  console.log(`  • ${c.constraint_name} (${c.constraint_type})`)
***REMOVED******REMOVED***})
***REMOVED***  }

***REMOVED***  // Get RLS policies
***REMOVED***  const { data: policies } = await supabase
***REMOVED******REMOVED***.from('pg_policies')
***REMOVED******REMOVED***.select('policyname, permissive, cmd')
***REMOVED******REMOVED***.eq('tablename', tableName)
***REMOVED***  
***REMOVED***  if (policies && policies.length > 0) {
***REMOVED******REMOVED***console.log('\nRLS Policies:')
***REMOVED******REMOVED***policies.forEach((p: PolicyInfo) => {
***REMOVED******REMOVED***  console.log(`  • ${p.policyname} (${p.cmd}, ${p.permissive})`)
***REMOVED******REMOVED***})
***REMOVED***  } else {
***REMOVED******REMOVED***console.log('\n⚠️  No RLS policies found')
***REMOVED***  }

***REMOVED***  // Get indexes
***REMOVED***  const { data: indexes } = await supabase
***REMOVED******REMOVED***.from('pg_indexes')
***REMOVED******REMOVED***.select('indexname, indexdef')
***REMOVED******REMOVED***.eq('tablename', tableName)
***REMOVED***  
***REMOVED***  if (indexes && indexes.length > 0) {
***REMOVED******REMOVED***console.log('\nIndexes:')
***REMOVED******REMOVED***indexes.forEach((idx: any) => {
***REMOVED******REMOVED***  console.log(`  • ${idx.indexname}`)
***REMOVED******REMOVED***})
***REMOVED***  }

***REMOVED***} catch (error) {
***REMOVED***  console.error(`❌ Error checking ${tableName}:`, error)
***REMOVED***}
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Schema verification complete!\n')
}

verifySchema()
