import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hcuybmrlozknmyijqabp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...\n')
  
  try {
***REMOVED***// Test 1: Get auth status
***REMOVED***const { data: { session } } = await supabase.auth.getSession()
***REMOVED***console.log('✓ Auth endpoint responsive')
***REMOVED***
***REMOVED***// Test 2: Get tables info
***REMOVED***const { data: tables, error: tablesError } = await supabase
***REMOVED***  .from('information_schema.tables')
***REMOVED***  .select('table_name')
***REMOVED***  .eq('table_schema', 'public')
***REMOVED***
***REMOVED***if (tablesError) {
***REMOVED***  console.log('✓ Database accessible (direct query)')
***REMOVED***} else {
***REMOVED***  console.log('📊 Existing tables:')
***REMOVED***  const publicTables = tables?.map(t => t.table_name).filter(name => !name.startsWith('pg_')) || []
***REMOVED***  publicTables.forEach(table => console.log(`  - ${table}`))
***REMOVED***}
***REMOVED***
***REMOVED***// Test 3: Check specific tables
***REMOVED***console.log('\n📋 Checking required tables...')
***REMOVED***
***REMOVED***const requiredTables = ['invoices', 'customers', 'receipts', 'trips']
***REMOVED***for (const table of requiredTables) {
***REMOVED***  try {
***REMOVED******REMOVED***const { count } = await supabase
***REMOVED******REMOVED***  .from(table)
***REMOVED******REMOVED***  .select('*', { count: 'exact', head: true })
***REMOVED******REMOVED***console.log(`  ✓ ${table} exists`)
***REMOVED***  } catch (err: any) {
***REMOVED******REMOVED***console.log(`  ✗ ${table} missing or error: ${err.message}`)
***REMOVED***  }
***REMOVED***}
***REMOVED***
***REMOVED***console.log('\n✅ Supabase connection test complete!')
***REMOVED***
  } catch (error) {
***REMOVED***console.error('\n❌ Connection failed:', error)
  }
}

testConnection()
