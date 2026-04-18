-- SQL-schema voor Fiscaliq facturen (MVP)
-- Voer dit uit in Supabase: Project > SQL editor

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  customer_name text not null,
  description text,
  issue_date date not null default current_date,
  due_date date,
  amount_excl numeric(12,2) not null,
  vat_rate numeric(5,2) not null,
  amount_incl numeric(12,2) not null,
  status text not null default 'concept',
  created_at timestamptz not null default now()
);

-- Basis RLS: elke gebruiker ziet alleen zijn eigen facturen
alter table public.invoices enable row level security;

create policy "Users can manage own invoices" on public.invoices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
