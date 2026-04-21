# Supabase Environment Configuration

## ✅ Connection Status
- **Status**: VERIFIED ✓
- **URL**: https://hcuybmrlozknmyijqabp.supabase.co
- **Auth**: Working
- **Database**: Accessible
- **Tables**: All present (invoices, customers, receipts, trips)

## 🔑 Required Environment Variables

For the Next.js web app to connect to Supabase, add these to `.env.local`:

```env
# Supabase Public Credentials (Safe to commit in code)
NEXT_PUBLIC_SUPABASE_URL=https://hcuybmrlozknmyijqabp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60
```

## 📋 Database Tables

### invoices (Facturen)
- **Status**: ✓ Exists
- **Records**: 0 (empty)
- **Description**: Stores invoice records
- **Key columns**: id, user_id, invoice_number, customer_name, amount_incl, due_date, status

### customers (Klanten)
- **Status**: ✓ Exists
- **Records**: 0 (empty)
- **Description**: Stores customer information
- **Key columns**: id, user_id, name, email, phone, vat_number, kvk

### receipts (Bonnetjes)
- **Status**: ✓ Exists
- **Records**: 0 (empty)
- **Description**: Stores receipt/expense records
- **Key columns**: id, user_id, date, description, category, amount

### trips (Ritten)
- **Status**: ✓ Exists
- **Records**: 0 (empty)
- **Description**: Stores trip/mileage records
- **Key columns**: id, user_id, date, description, km, cost

### invoice_lines (Factuurtegels)
- **Status**: ✓ Exists
- **Records**: 0 (empty)
- **Description**: Stores invoice line items
- **Key columns**: id, invoice_id, description, quantity, unit_price

## 🔒 Security & RLS (Row Level Security)

Each table has RLS policies enabled to ensure users can only access their own data:
- ✓ invoices: Users see only their own invoices
- ✓ customers: Users see only their own customers
- ✓ receipts: Users see only their own receipts
- ✓ trips: Users see only their own trips

RLS automatically filters queries based on `auth.uid()` matching `user_id`.

## 📝 SQL Schema Files

All SQL schemas are defined in `/supabase/`:

1. **customers.sql** - Customer management schema
2. **invoices.sql** - Invoice and invoice_lines schema
3. **receipts.sql** - Receipt/bonnetjes schema
4. **trips.sql** - Trip/ritten schema

To apply/update schemas:
1. Go to: https://app.supabase.com/project/hcuybmrlozknmyijqabp/sql/new
2. Copy and paste each SQL file in order
3. Execute

## 🧪 Testing

Run tests with:
```bash
# Test connection and table existence
npm run test:supabase

# Or manually:
npx tsx supabase/test-database.ts
```

## 🚀 Deployment Notes

- Supabase project is hosted in `eu-west-3` (Ireland)
- Vercel deployment is configured for auto-deployment on pushes to `main`
- All environment variables are already set in Vercel project settings
- No manual setup needed for production

## 📞 Support

- Supabase Dashboard: https://app.supabase.com/project/hcuybmrlozknmyijqabp
- Project Name: SilentLegend's Project
- Region: eu-west-3
