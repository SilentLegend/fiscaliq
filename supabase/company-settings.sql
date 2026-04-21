-- Company settings table for storing user/company preferences
CREATE TABLE IF NOT EXISTS public.company_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  street TEXT,
  postal_code TEXT,
  city TEXT,
  country TEXT DEFAULT 'Nederland',
  kvk TEXT,
  vat_number TEXT,
  iban TEXT,
  email TEXT,
  website TEXT,
  enable_auto_reminders BOOLEAN DEFAULT TRUE,
  reminder_days_before INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own company settings"
  ON public.company_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own company settings"
  ON public.company_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own company settings"
  ON public.company_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Email logs for tracking sent reminders
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  invoice_number TEXT,
  amount NUMERIC(12, 2),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  message_id TEXT,
  success BOOLEAN DEFAULT TRUE,
  error TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own email logs"
  ON public.email_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX email_logs_user_id_sent_at_idx ON public.email_logs(user_id, sent_at DESC);
CREATE INDEX email_logs_invoice_id_idx ON public.email_logs(invoice_id);

-- Update invoices table to track last reminder sent
ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS last_reminder_sent_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS reminder_count INTEGER DEFAULT 0;
