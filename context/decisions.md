# Decisions — Fiscaliq MVP

## Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS + `clsx` + `tailwind-merge`
- **Font:** Inter (via next/font)
- **Database:** Supabase PostgreSQL (gratis tier)
- **Auth:** Supabase Auth (email + wachtwoord, magic link)
- **PDF:** @react-pdf/renderer v4 (server-side)
- **Validation:** Zod (client + server)
- **Hosting:** Vercel (gratis tier)
- **Domein:** fiscaliq.nl (TransIP DNS naar Vercel)

## Architectuur Keuzes
1. **Server Components** waar mogelijk, Client Components alleen waar interactie nodig is
2. **Server Actions** voor alle data mutaties (CRUD)
3. **Route Handlers** alleen voor PDF generatie (binair response)
4. **Supabase Auth** i.p.v. NextAuth.js — directe integratie met Supabase DB, eenvoudiger
5. **Multi-tenant via RLS** — elke rij heeft user_id, policies filteren op auth.uid()
6. **Factuurnummer formaat:** `JV-YYYY-NNNN` (bijv. JV-2026-0001)
7. **PDF server-side** gegenereerd via @react-pdf/renderer Route Handler
8. **Geen e-mail API in MVP** — gebruiker downloadt PDF en mailt zelf

## Database Conventies
- Alle tabellen hebben `id UUID PK DEFAULT gen_random_uuid()`
- Alle tabellen hebben `created_at TIMESTAMPTZ DEFAULT now()` en `updated_at TIMESTAMPTZ DEFAULT now()`
- Foreign keys hebben `ON DELETE CASCADE` of `ON DELETE RESTRICT` waar gepast
- RLS enabled op alle tabellen
- Trigger `handle_new_user()` op `auth.users INSERT` → `profiles INSERT`

## Nederlandse Factuurvereisten (PDF)
- Factuurnummer (uniek, oplopend)
- Factuurdatum en vervaldatum
- Bedrijfsnaam, adres, KVK-nummer, BTW-nummer
- Klantnaam en adres
- Gespecificeerde regels (hoeveelheid, omschrijving, prijs, BTW%)
- Subtotaal exclusief BTW, BTW bedrag per tarief, Totaal inclusief BTW
- IBAN-nummer
- Betalingsinstructies

## UI/UX Principes
- WCAG AAA compliance
- Nederlands als voertaal
- Responsive (mobile-first)
- Loading states, error states, empty states voor alle pagina's
- Focus management en aria-labels
