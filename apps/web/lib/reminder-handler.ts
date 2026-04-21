import { createClient } from '@supabase/supabase-js'
import { sendReminderEmail } from '@/lib/email-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
***REMOVED***autoRefreshToken: false,
***REMOVED***persistSession: false,
  },
})

interface OverdueInvoice {
  id: string
  invoice_number: string
  customer_name: string
  amount_incl: number
  due_date: string
  currency: string
  user_id: string
}

interface CustomerWithEmail {
  customer_name: string
  email: string
  invoices: OverdueInvoice[]
}

export async function handleReminderEmails(req: Request) {
  // Verify the request comes from Vercel Cron (optional but recommended)
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
***REMOVED***return new Response('Unauthorized', { status: 401 })
  }

  try {
***REMOVED***console.log('Starting reminder email job at', new Date().toISOString())

***REMOVED***// Get all company settings (for company name in emails)
***REMOVED***const { data: settings, error: settingsError } = await supabase
***REMOVED***  .from('company_settings')
***REMOVED***  .select('*')

***REMOVED***if (settingsError) {
***REMOVED***  console.error('Error fetching company settings:', settingsError)
***REMOVED***  return new Response(
***REMOVED******REMOVED***JSON.stringify({ error: 'Failed to fetch settings', details: settingsError }),
***REMOVED******REMOVED***{ status: 500, headers: { 'Content-Type': 'application/json' } }
***REMOVED***  )
***REMOVED***}

***REMOVED***// Get all overdue invoices that haven't had a reminder sent today
***REMOVED***const today = new Date().toISOString().split('T')[0]
***REMOVED***const { data: overdueInvoices, error: invoicesError } = await supabase
***REMOVED***  .from('invoices')
***REMOVED***  .select(
***REMOVED******REMOVED***`
***REMOVED******REMOVED***id,
***REMOVED******REMOVED***invoice_number,
***REMOVED******REMOVED***customer_name,
***REMOVED******REMOVED***amount_incl,
***REMOVED******REMOVED***due_date,
***REMOVED******REMOVED***currency,
***REMOVED******REMOVED***user_id
***REMOVED***  `,
***REMOVED******REMOVED***{ count: 'exact' }
***REMOVED***  )
***REMOVED***  .eq('status', 'open')
***REMOVED***  .not('due_date', 'is', null)
***REMOVED***  .lt('due_date', today)

***REMOVED***if (invoicesError) {
***REMOVED***  console.error('Error fetching invoices:', invoicesError)
***REMOVED***  return new Response(
***REMOVED******REMOVED***JSON.stringify({ error: 'Failed to fetch invoices', details: invoicesError }),
***REMOVED******REMOVED***{ status: 500, headers: { 'Content-Type': 'application/json' } }
***REMOVED***  )
***REMOVED***}

***REMOVED***if (!overdueInvoices || overdueInvoices.length === 0) {
***REMOVED***  console.log('No overdue invoices found')
***REMOVED***  return new Response(
***REMOVED******REMOVED***JSON.stringify({ message: 'No overdue invoices found', sent: 0 }),
***REMOVED******REMOVED***{ status: 200, headers: { 'Content-Type': 'application/json' } }
***REMOVED***  )
***REMOVED***}

***REMOVED***// Group by customer
***REMOVED***const customerMap = new Map<string, CustomerWithEmail>()

***REMOVED***for (const invoice of overdueInvoices as OverdueInvoice[]) {
***REMOVED***  // Get customer email
***REMOVED***  const { data: customer, error: customerError } = await supabase
***REMOVED******REMOVED***.from('customers')
***REMOVED******REMOVED***.select('email')
***REMOVED******REMOVED***.eq('name', invoice.customer_name)
***REMOVED******REMOVED***.eq('user_id', invoice.user_id)
***REMOVED******REMOVED***.single()

***REMOVED***  if (customerError || !customer?.email) {
***REMOVED******REMOVED***console.warn(`No email found for customer: ${invoice.customer_name}`)
***REMOVED******REMOVED***continue
***REMOVED***  }

***REMOVED***  // Get company info
***REMOVED***  const userSettings = settings?.find((s: any) => s.user_id === invoice.user_id)
***REMOVED***  const companyName = userSettings?.company_name || 'FiscalIQ'
***REMOVED***  const companyEmail = userSettings?.email || 'info@fiscaliq.nl'

***REMOVED***  const key = `${customer.email}|${invoice.user_id}`
***REMOVED***  if (!customerMap.has(key)) {
***REMOVED******REMOVED***customerMap.set(key, {
***REMOVED******REMOVED***  customer_name: invoice.customer_name,
***REMOVED******REMOVED***  email: customer.email,
***REMOVED******REMOVED***  invoices: [],
***REMOVED******REMOVED***})
***REMOVED***  }

***REMOVED***  customerMap.get(key)!.invoices.push(invoice)
***REMOVED***}

***REMOVED***// Send emails and log
***REMOVED***let sent = 0
***REMOVED***let failed = 0
***REMOVED***const emailLogs: any[] = []

***REMOVED***for (const [, customerData] of customerMap) {
***REMOVED***  const userSettings = settings?.find((s: any) =>
***REMOVED******REMOVED***customerData.invoices.some((inv: any) => inv.user_id === s.user_id)
***REMOVED***  )

***REMOVED***  const companyName = userSettings?.company_name || 'FiscalIQ'
***REMOVED***  const companyEmail = userSettings?.email || 'info@fiscaliq.nl'

***REMOVED***  for (const invoice of customerData.invoices) {
***REMOVED******REMOVED***const result = await sendReminderEmail({
***REMOVED******REMOVED***  toEmail: customerData.email,
***REMOVED******REMOVED***  customerName: customerData.customer_name,
***REMOVED******REMOVED***  invoiceNumber: invoice.invoice_number || invoice.id,
***REMOVED******REMOVED***  dueDate: invoice.due_date,
***REMOVED******REMOVED***  amount: invoice.amount_incl,
***REMOVED******REMOVED***  currency: invoice.currency || 'EUR',
***REMOVED******REMOVED***  companyName,
***REMOVED******REMOVED***  companyEmail,
***REMOVED******REMOVED***})

***REMOVED******REMOVED***emailLogs.push({
***REMOVED******REMOVED***  user_id: invoice.user_id,
***REMOVED******REMOVED***  invoice_id: invoice.id,
***REMOVED******REMOVED***  customer_email: customerData.email,
***REMOVED******REMOVED***  customer_name: customerData.customer_name,
***REMOVED******REMOVED***  invoice_number: invoice.invoice_number,
***REMOVED******REMOVED***  amount: invoice.amount_incl,
***REMOVED******REMOVED***  sent_at: new Date().toISOString(),
***REMOVED******REMOVED***  message_id: result.messageId,
***REMOVED******REMOVED***  success: result.success,
***REMOVED******REMOVED***  error: result.error,
***REMOVED******REMOVED***})

***REMOVED******REMOVED***if (result.success) {
***REMOVED******REMOVED***  sent++
***REMOVED******REMOVED***} else {
***REMOVED******REMOVED***  failed++
***REMOVED******REMOVED***}
***REMOVED***  }
***REMOVED***}

***REMOVED***// Store email logs in database
***REMOVED***if (emailLogs.length > 0) {
***REMOVED***  const { error: logError } = await supabase.from('email_logs').insert(emailLogs)

***REMOVED***  if (logError) {
***REMOVED******REMOVED***console.error('Error storing email logs:', logError)
***REMOVED***  }
***REMOVED***}

***REMOVED***console.log(`Reminder email job completed. Sent: ${sent}, Failed: ${failed}`)

***REMOVED***return new Response(
***REMOVED***  JSON.stringify({
***REMOVED******REMOVED***message: 'Reminder emails sent',
***REMOVED******REMOVED***sent,
***REMOVED******REMOVED***failed,
***REMOVED******REMOVED***total: emailLogs.length,
***REMOVED***  }),
***REMOVED***  { status: 200, headers: { 'Content-Type': 'application/json' } }
***REMOVED***)
  } catch (error) {
***REMOVED***console.error('Reminder email job error:', error)
***REMOVED***return new Response(
***REMOVED***  JSON.stringify({
***REMOVED******REMOVED***error: 'Internal server error',
***REMOVED******REMOVED***details: error instanceof Error ? error.message : 'Unknown error',
***REMOVED***  }),
***REMOVED***  { status: 500, headers: { 'Content-Type': 'application/json' } }
***REMOVED***)
  }
}
