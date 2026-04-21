import { handleReminderEmails } from '@/lib/reminder-handler'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
***REMOVED***const response = await handleReminderEmails(req)
***REMOVED***return response
  } catch (error) {
***REMOVED***console.error('API error:', error)
***REMOVED***return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // For testing - only in development
  if (process.env.NODE_ENV !== 'development') {
***REMOVED***return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
***REMOVED***const response = await handleReminderEmails(req)
***REMOVED***return response
  } catch (error) {
***REMOVED***console.error('API error:', error)
***REMOVED***return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
