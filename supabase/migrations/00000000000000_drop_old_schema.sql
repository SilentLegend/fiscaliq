-- Drop all old tables from the previous Next.js schema
-- Order matters: drop dependent tables first, then referenced tables

DROP TABLE IF EXISTS vat_returns CASCADE;
DROP TABLE IF EXISTS transaction_matches CASCADE;
DROP TABLE IF EXISTS line_items CASCADE;
DROP TABLE IF EXISTS invoice_settings CASCADE;
DROP TABLE IF EXISTS bank_transactions CASCADE;
DROP TABLE IF EXISTS bank_connections CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS expense_status CASCADE;
DROP TYPE IF EXISTS vat_return_status CASCADE;
DROP TYPE IF EXISTS transaction_category CASCADE;
DROP TYPE IF EXISTS match_type CASCADE;

-- Drop old functions
DROP FUNCTION IF EXISTS update_updated_at CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS calculate_line_total CASCADE;

-- Drop old storage policies for receipts
DROP POLICY IF EXISTS "receipts read own" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "receipts insert own" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "receipts delete own" ON storage.objects CASCADE;
DROP POLICY IF EXISTS "receipts update own" ON storage.objects CASCADE;
