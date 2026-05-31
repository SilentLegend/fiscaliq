# Status — Fiscaliq (Facturatie voor ZZP'ers)

## Fase: ✅ Voltooid — Wacht op Vercel deploy

### Voortgang
| Taak | Status | Details |
|------|--------|---------|
| Database reset + migratie | ✅ VOLTOOID | Oude tabellen gedropt, nieuwe schema (profiles, clients, invoices, line_items, invoice_settings) met RLS, triggers, indices |
| Code review + fixes | ✅ VOLTOOID | ESLint 0 errors, TypeScript strict, build slaagt |
| Settings pagina fix | ✅ VOLTOOID | Dubbele form gesplitst in factuurinstellingen + bedrijfsgegevens |
| Imports cleanup | ✅ VOLTOOID | Dubbele React imports in clients/[id]/page.tsx opgelost |
| Env vars in next.config | ✅ VOLTOOID | PUBLIC env vars als fallback voor Vercel deployment |
| GitHub push | ✅ VOLTOOID | Code gepusht naar main |
| Vercel deployment | ⏳ NODIG | Zie instructies hieronder |

### Wat er nog moet gebeuren voor deploy
1. **Ga naar [Vercel dashboard](https://vercel.com/silentlegend/fiscaliq)** (of https://vercel.com)
2. **Zet de volgende environment variables** in het project:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://hcuybmrlozknmyijqabp.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdXlibXJsb3prbm15aWpxYWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0ODYzMjIsImV4cCI6MjA5MjA2MjMyMn0.EiOFYCByHhd7WCPtVYpw0lCOz7l_agJSARSU_uqDj60`
   - `NEXT_PUBLIC_SITE_URL` = `https://fiscaliq.vercel.app`
3. **Herdeploy de `main` branch** via Vercel dashboard (Deployments → ... → Redeploy)
4. Na deploy: de app is live op **https://fiscaliq.vercel.app**
