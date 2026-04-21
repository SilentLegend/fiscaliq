# 📧 FiscalIQ Herinneringsmail - Setup Guide

## Overview
Automatische herinneringsmails voor vervallen facturen zijn nu volledig geïntegreerd in FiscalIQ!

## What's Been Implemented

### ✅ Email Service
- **Provider**: Resend (resend.com) - modern email API voor developers
- **Location**: `apps/web/lib/email-service.ts`
- **Features**:
  - Professional HTML email templates
  - Formatted dates and amounts (NL locale)
  - Reply-to company email
  - Error handling and logging

### ✅ Backend Infrastructure
- **API Endpoint**: `/api/reminders` (POST & GET)
- **Handler**: `apps/web/lib/reminder-handler.ts`
- **Database Tables**:
  - `company_settings` - Store company info
  - `email_logs` - Track all sent reminders

### ✅ Scheduled Jobs
- **Scheduler**: Vercel Cron (free tier)
- **Schedule**: Daily at 09:00 UTC (11:00 Amsterdam time)
- **Config**: `apps/web/vercel.json`
- **Manual Testing**: Test button in Settings page

### ✅ Frontend Integration
- **Settings Page**: Toggle + test button
- **Feature Flag**: `enableAutoReminders` in localStorage
- **User Experience**: Real-time feedback on test runs

## Setup Instructions

### Step 1: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up (free tier available)
3. Create API key
4. Copy the key

### Step 2: Configure Environment Variables

Add to your `.env.local`:
```env
# Supabase Service Role (for server operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend Email API
RESEND_API_KEY=re_your_api_key_here

# Cron Job Security
CRON_SECRET=your_secret_key_here
```

### Step 3: Create Database Tables

Go to Supabase SQL Editor and run:
```bash
supabase/company-settings.sql
```

This creates:
- `company_settings` table
- `email_logs` table
- RLS policies
- Indexes for performance

### Step 4: Update Company Settings

Users need to set their company email in the Settings page so replies go to the right place.

### Step 5: Deploy to Vercel

Vercel handles cron jobs automatically:
1. Push to main branch
2. Set env variables in Vercel project settings
3. Cron jobs will start automatically

### Step 6: Test the Feature

1. Open FiscalIQ Settings page
2. Enable "Automatische herinneringen"
3. Click "Test" button
4. Check your inbox for test emails
5. Check email logs in database

## How It Works

### Daily Automated Process

```
Daily at 09:00 UTC
***REMOVED***↓
Vercel Cron Job triggered
***REMOVED***↓
Finds all open invoices with due_date < today
***REMOVED***↓
Groups by unique customer + user
***REMOVED***↓
For each customer:
  - Get email from customers table
  - Generate professional HTML email
  - Send via Resend API
  - Log result in email_logs table
***REMOVED***↓
Email appears in customer inbox with payment details
```

### Manual Testing

```
User clicks "Test" in Settings
***REMOVED***↓
Browser calls /api/reminders
***REMOVED***↓
Same process as above (doesn't repeat logged emails)
***REMOVED***↓
Results shown to user
```

## Email Content

The reminder email includes:
- Professional header with company branding
- Customer name personalization
- Invoice number, amount, due date
- Clear call-to-action
- Company contact info
- Reply-to address

Example: "Betalingsherinnering: Factuur #INV-2026-001"

## Database Schema

### email_logs Table
```sql
id***REMOVED******REMOVED******REMOVED***  UUID
user_id***REMOVED******REMOVED*** UUID (references auth.users)
invoice_id***REMOVED***  UUID (references invoices)
customer_email  TEXT
customer_name   TEXT
invoice_number  TEXT
amount***REMOVED******REMOVED***  NUMERIC
sent_at***REMOVED******REMOVED*** TIMESTAMP
message_id***REMOVED***  TEXT (from Resend)
success***REMOVED******REMOVED*** BOOLEAN
error***REMOVED******REMOVED***   TEXT (if failed)
opened_at***REMOVED***   TIMESTAMP (for future tracking)
```

### company_settings Table
```sql
id***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  UUID
user_id***REMOVED******REMOVED******REMOVED******REMOVED*** UUID (unique, references auth.users)
company_name***REMOVED******REMOVED******REMOVED***TEXT
email***REMOVED******REMOVED******REMOVED******REMOVED***   TEXT (used as reply-to)
enable_auto_reminders   BOOLEAN (default: true)
reminder_days_before***REMOVED***INTEGER (default: 0)
... other company fields
```

## Configuration Options

### Reminder Timing
Currently set to send daily at 09:00 UTC. To change, edit `vercel.json`:

```json
"schedule": "0 9 * * *"  // Cron expression
```

### Retry Logic
- Automatically retries failed sends once per day
- Logs all attempts in database
- Admin can manually trigger via test button

### Email Customization
Edit email template in `lib/email-service.ts` to:
- Change colors, fonts, layout
- Add company logo
- Modify message text
- Change from address

## Monitoring

### Check Email Logs
Query the `email_logs` table to see:
- How many emails sent per day
- Success/failure rate
- Which invoices have been reminded
- Customer responses

### Test Results
Settings page shows immediate feedback:
- Number of emails that would be sent
- Success/failure details
- Any error messages

## Troubleshooting

### Emails not sending
1. Check `.env.local` has `RESEND_API_KEY`
2. Check Resend account has credits
3. Verify customer has email in database
4. Check email_logs table for errors

### Feature not appearing
1. Check `enableAutoReminders` flag in localStorage
2. Clear browser cache
3. Restart dev server
4. Check console for JavaScript errors

### Wrong email recipients
1. Verify customer.email is set correctly
2. Check which user_id the invoice belongs to
3. Verify company_settings has correct email

## Next Steps

1. **Logo Integration**: Add company logo to email template
2. **Custom Templates**: Let users create custom email text
3. **Reminder Rules**: Set frequency (daily, weekly, on due date)
4. **Payment Tracking**: Auto-mark as paid when payment received
5. **Webhook Integration**: Connect bank APIs for auto-reconciliation
6. **Email Analytics**: Track opens and clicks

## Files Created/Modified

| File | Purpose |
|------|---------|
| `lib/email-service.ts` | Email sending logic |
| `lib/reminder-handler.ts` | Core reminder logic |
| `app/api/reminders/route.ts` | API endpoint |
| `supabase/company-settings.sql` | Database schema |
| `vercel.json` | Cron schedule config |
| `.env.local.example` | Environment setup |
| `app/app/instellingen/page.tsx` | UI integration |
| `package.json` | Added Resend dependency |

## Support

- Resend Docs: https://resend.com/docs
- GitHub: https://github.com/SilentLegend/fiscaliq
- Test API: `POST /api/reminders` (development only)
