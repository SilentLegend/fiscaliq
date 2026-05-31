# Errors — Fiscaliq (Facturatie voor ZZP'ers)

## Opgeloste fouten
| Fout | Oplossing |
|------|-----------|
| Oude database tabellen conflicteerden met nieuw schema | Oude tabellen (`invoices`, `invoice_lines`, `company_settings`, `customers`, `receipts`, `trips`) gedropt via Supabase Management API; nieuwe migratie gerund |
| Settings pagina toonde twee identieke formulieren | SettingsForm gesplitst met `mode` prop: `"invoice"` voor factuurinstellingen, `"company"` voor bedrijfsgegevens |
| Dubbele React imports in clients/[id]/page.tsx | `useActionState` en `useEffect/useState` samengevoegd in één import |
| `NEXT_PUBLIC_SITE_URL` stond op localhost:3000 | Fallback naar `https://fiscaliq.vercel.app` via VERCEL_URL in next.config.ts |
| Ontbrekende env vars op Vercel | Publieke vars als fallback in next.config.ts gezet via `env` field |

## Huidige bekende issues
| Issue | Status |
|-------|--------|
| Vercel deployment wacht op env vars | Moet handmatig gezet worden in Vercel dashboard → Settings → Environment Variables |
| Auth callback URL werkt nog niet op Vercel | Is `NEXT_PUBLIC_SITE_URL` nodig — moet gezet worden op Vercel |
| De oude marketing site staat nog live op fiscaliq.vercel.app | Nieuwe deployment zal deze vervangen |
