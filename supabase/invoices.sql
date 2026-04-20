-- SQL-schema voor Fiscaliq facturen (MVP)
-- Voer dit uit in Supabase: Project > SQL editor

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  invoice_number text,
  customer_name text not null,
  description text,
  issue_date date not null default current_date,
  due_date date,
  amount_excl numeric(12,2) not null,
  vat_rate numeric(5,2) not null,
  amount_incl numeric(12,2) not null,
  currency text not null default 'EUR',
  status text not null default 'concept',
  created_at timestamptz not null default now()
);

alter table public.invoices
  add column if not exists invoice_number text;

alter table public.invoices
  add column if not exists currency text not null default 'EUR';

create unique index if not exists invoices_user_invoice_number_uidx
  on public.invoices(user_id, invoice_number)
  where invoice_number is not null and invoice_number <> '';

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit_price numeric(12,2) not null,
  amount_excl numeric(12,2) not null,
  created_at timestamptz not null default now()
);

-- Basis RLS: elke gebruiker ziet alleen zijn eigen facturen en regels
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;

create policy "Users can manage own invoices" on public.invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage invoice lines via invoices" on public.invoice_lines
  for all using (
***REMOVED***exists (
***REMOVED***  select 1 from public.invoices i
***REMOVED***  where i.id = invoice_id and i.user_id = auth.uid()
***REMOVED***)
  ) with check (
***REMOVED***exists (
***REMOVED***  select 1 from public.invoices i
***REMOVED***  where i.id = invoice_id and i.user_id = auth.uid()
***REMOVED***)
  );
