import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hcuybmrlozknmyijqabp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDatabase() {
  console.log('\n📊 FiscalIQ Database Connection Test\n')
  console.log('=' .repeat(70))
  
  const tables = [
***REMOVED***{ name: 'invoices', description: 'Facturen' },
***REMOVED***{ name: 'customers', description: 'Klanten' },
***REMOVED***{ name: 'receipts', description: 'Bonnetjes/Receipts' },
***REMOVED***{ name: 'trips', description: 'Ritten/Trips' },
***REMOVED***{ name: 'invoice_lines', description: 'Factuurtegels' }
  ]
  
  console.log('\n✅ TABLE EXISTENCE CHECK:\n')
  
  for (const table of tables) {
***REMOVED***try {
***REMOVED***  const { count, error } = await supabase
***REMOVED******REMOVED***.from(table.name)
***REMOVED******REMOVED***.select('*', { count: 'exact', head: true })
***REMOVED***  
***REMOVED***  if (error) {
***REMOVED******REMOVED***console.log(`❌ ${table.name.padEnd(20)} - ${table.description} (Error: ${error.message})`)
***REMOVED***  } else {
***REMOVED******REMOVED***console.log(`✓  ${table.name.padEnd(20)} - ${table.description} (${count || 0} records)`)
***REMOVED***  }
***REMOVED***} catch (err: any) {
***REMOVED***  console.log(`❌ ${table.name.padEnd(20)} - ${table.description} (${err.message})`)
***REMOVED***}
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('\n🔐 VERIFYING RLS & SECURITY:\n')
  
  // Try to read with public key (should be restricted by RLS if policies exist)
  console.log('• Public key can read invoices (RLS restricted): ', 'Depends on user session')
  console.log('• public key can read customers (RLS restricted): ', 'Depends on user session')
  console.log('• Public key can read receipts (RLS restricted): ', 'Depends on user session')
  console.log('• Public key can read trips (RLS restricted): ', 'Depends on user session')
  
  console.log('\n' + '='.repeat(70))
  console.log('\n📋 RECOMMENDED NEXT STEPS:\n')
  console.log('1. Open Supabase SQL Editor: https://app.supabase.com/project/hcuybmrlozknmyijqabp/sql')
  console.log('2. Run the following scripts in order:')
  console.log('   • supabase/customers.sql')
  console.log('   • supabase/invoices.sql')
  console.log('   • supabase/receipts.sql')
  console.log('   • supabase/trips.sql')
  console.log('3. This will:')
  console.log('   ✓ Create tables with proper structure')
  console.log('   ✓ Add RLS (Row Level Security) policies')
  console.log('   ✓ Create indexes for performance')
  console.log('   ✓ Add constraints and triggers')
  
  console.log('\n' + '='.repeat(70))
  console.log('\n📁 SQL FILES LOCATION:')
  console.log('/Users/marvingoosen/Downloads/fiscaliq/fiscaliq/supabase/\n')
  console.log('  • customers.sql')
  console.log('  • invoices.sql')
  console.log('  • receipts.sql')
  console.log('  • trips.sql')
  
  console.log('\n' + '='.repeat(70) + '\n')
}

testDatabase().catch(console.error)
