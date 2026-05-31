# Decisions — Fiscaliq (Facturatie voor ZZP'ers)

## Tech Stack
- **Framework:** Next.js 16 (App Router) via Turbopack
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS v4 + `clsx` + `tailwind-merge`
- **Font:** Inter (via next/font)
- **Database:** Supabase PostgreSQL (gratis tier, project: hcuybmrlozknmyijqabp)
- **Auth:** Supabase Auth (email + wachtwoord, magic link)
- **PDF:** @react-pdf/renderer v4 (server-side, dynamisch geïmporteerd in Route Handler)
- **Validation:** Zod v4 (client + server)
- **Hosting:** Vercel (gratis tier, git-gekoppeld aan GitHub)
- **Domein:** fiscaliq.nl (TransIP DNS naar Vercel)

## Architectuur Keuzes
1. **Server Components** waar mogelijk, Client Components alleen waar interactie nodig is
2. **Server Actions** voor alle data mutaties (CRUD) — `'use server'` in `src/lib/actions/`
3. **Route Handlers** alleen voor PDF generatie (`src/app/api/pdf/[id]/route.tsx`)
4. **Supabase SSR** (`@supabase/ssr`) voor auth cookies met middleware
5. **Multi-tenant via RLS** — elke rij heeft `user_id`, policies filteren op `auth.uid()`
6. **Factuurnummer formaat:** `JV-YYYY-NNNN` (bijv. JV-2026-0001)
7. **PDF server-side** gegenereerd via @react-pdf/renderer in Route Handler
8. **Geen e-mail API in MVP** — gebruiker downloadt PDF en mailt zelf
9. **Settings formulier gesplitst** in twee secties: factuurinstellingen (BTW, termijn) en bedrijfsgegevens

## Database Schema
- `profiles` — 1:1 met auth.users, bedrijfsgegevens gebruiker
- `clients` — Klanten per gebruiker
- `invoices` — Facturen per gebruiker per client
- `line_items` — Factuurregels per factuur
- `invoice_settings` — 1:1 per gebruiker, standaardwaarden + bedrijfsinfo
- Alle tabellen hebben RLS enabled met policies op `auth.uid() = user_id`
- Trigger `handle_new_user()` op `auth.users INSERT` → maakt `profiles` + `invoice_settings` aan
- Trigger `calculate_line_total()` op `line_items INSERT/UPDATE` — berekent automatisch `line_total`

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
- WCAG AAA compliance (skip-to-content, focus rings, aria-labels)
- Nederlands als voertaal
- Responsive (mobile-first met sidebar toggle)
- Loading states, error states, empty states voor alle pagina's
- Print stylesheet voor A4 factuur afdrukken
