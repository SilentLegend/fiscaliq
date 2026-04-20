-- SQL-schema uitbreiding voor klanten (volledige facturatieprofielen)
-- Idempotent: veilig meerdere keren uit te voeren.

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  street text,
  postal_code text,
  city text,
  vat_number text,
  kvk text,
  email text,
  phone text,
  created_at timestamptz default now()
);

alter table public.customers
  add column if not exists customer_number text,
  add column if not exists legal_form text,
  add column if not exists website text,
  add column if not exists contact_name text,
  add column if not exists department text,
  add column if not exists country text default 'Nederland',
  add column if not exists payment_term_days integer default 30,
  add column if not exists currency text default 'EUR',
  add column if not exists vat_rate_preference text default '21',
  add column if not exists iban text,
  add column if not exists delivery_method text default 'email',
  add column if not exists notes text,
  add column if not exists status text default 'actief',
  add column if not exists updated_at timestamptz default now();

create unique index if not exists customers_user_customer_number_uidx
  on public.customers(user_id, customer_number)
  where customer_number is not null and customer_number <> '';

do $$
begin
  if not exists (
***REMOVED***select 1
***REMOVED***from pg_constraint
***REMOVED***where conname = 'customers_delivery_method_check'
  ) then
***REMOVED***alter table public.customers
***REMOVED***  add constraint customers_delivery_method_check
***REMOVED***  check (delivery_method in ('email', 'post'));
  end if;
end $$;

do $$
begin
  if not exists (
***REMOVED***select 1
***REMOVED***from pg_constraint
***REMOVED***where conname = 'customers_status_check'
  ) then
***REMOVED***alter table public.customers
***REMOVED***  add constraint customers_status_check
***REMOVED***  check (status in ('actief', 'inactief'));
  end if;
end $$;

alter table public.customers enable row level security;

do $$
begin
  if not exists (
***REMOVED***select 1 from pg_policies
***REMOVED***where schemaname = 'public'
***REMOVED***  and tablename = 'customers'
***REMOVED***  and policyname = 'Users can manage own customers'
  ) then
***REMOVED***create policy "Users can manage own customers" on public.customers
***REMOVED***  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
