# Status — Fiscaliq MVP

## Fase: Code Review

### Voortgang
| Laag | Status | Details |
|------|--------|---------|
| Laag 1: Fundering | ✅ VOLTOOID | |
| Laag 2: Auth + Layout | ✅ VOLTOOID | |
| Laag 3: Data laag | ✅ VOLTOOID | |
| Laag 4: Facturen feature | ✅ VOLTOOID | |
| **Code Review** | 🔄 BEZIG | |
| DevOps Check | ⏳ Na review | |

### Voltooide bestanden (40+)
- `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` — Supabase setup
- `src/proxy.ts` — Auth middleware (Next.js 16)
- `src/app/(auth)/login/page.tsx`, `register/page.tsx` — Auth pages
- `src/app/(dashboard)/layout.tsx` — Protected dashboard layout
- `src/components/Sidebar.tsx`, `Header.tsx` — Navigation
- `src/lib/actions/auth.actions.ts`, `client.actions.ts`, `invoice.actions.ts`, `settings.actions.ts` — Server Actions
- `src/lib/queries/clients.queries.ts`, `invoices.queries.ts`, `settings.queries.ts` — Data queries
- `src/app/(dashboard)/invoices/page.tsx` — Invoice list with filters
- `src/app/(dashboard)/invoices/new/page.tsx` + `NewInvoiceForm.tsx` — Invoice create
- `src/app/(dashboard)/invoices/[id]/page.tsx` — Invoice detail
- `src/app/(dashboard)/invoices/[id]/pdf/page.tsx` — PDF preview
- `src/app/api/pdf/[id]/route.tsx` — PDF download API
- `src/app/(dashboard)/clients/page.tsx`, `new/page.tsx` — Clients CRUD
- `src/app/(dashboard)/settings/page.tsx`, `SettingsForm.tsx` — Settings
- `src/app/(dashboard)/page.tsx` — Dashboard with stats
- `src/app/page.tsx` — Root redirect
- `supabase/migrations/001_schema.sql` — Database schema (5 tabellen, RLS, triggers)
- `src/lib/types/database.ts`, `forms.ts` — TypeScript types + Zod schemas
- `src/lib/constants.ts` — App constants
- `src/lib/utils/cn.ts` — className utility
- `src/lib/utils/pdf.tsx` — PDF document component
- `tailwind.config.ts` (v3 → v4 via CSS) + `globals.css` met component classes
