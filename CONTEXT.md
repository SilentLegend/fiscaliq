# Fiscaliq — Project Context

> Persoonlijke boekhouding voor Nederlandse ZZP'ers.
> Gebouwd met Lovable + Supabase (via Lovable Cloud).

---

## 🎯 Visie

Een **rustige, mooi vormgegeven** boekhoudtool voor ZZP'ers en kleine ondernemers
in Nederland. Geen Excel-aanvoelen zoals e-Boekhouden, geen overkill zoals Exact,
geen abonnementsdruk zoals MoneyMonk. Focus op:

- Snel facturen maken en versturen
- Bonnetjes uploaden en automatisch BTW bijhouden
- Bankkoppeling (PSD2) zodat transacties auto-matchen met facturen
- Een fris dashboard dat in één oogopslag laat zien hoe het ervoor staat

---

## 🏗 Architectuur

```
Frontend  →  React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui
State     →  TanStack Query (React Query)
Backend   →  Supabase (via Lovable Cloud)
              - Postgres database met RLS
              - Auth (email/wachtwoord)
              - Storage bucket 'receipts' voor bonnetjes
              - Edge Functions (Deno) voor PSD2-koppeling
Deploy    →  Vercel (via GitHub sync)
```

### Database-tabellen

| Tabel                | Doel                                                |
| -------------------- | --------------------------------------------------- |
| `profiles`           | Bedrijfsgegevens van de gebruiker (KVK, IBAN, BTW)  |
| `clients`            | Klantenbeheer                                       |
| `invoices`           | Facturen met status (concept/verzonden/betaald/...) |
| `invoice_items`      | Regels per factuur                                  |
| `expenses`           | Bonnetjes/uitgaven met BTW                          |
| `bank_connections`   | PSD2-bankkoppelingen (GoCardless)                   |
| `bank_transactions`  | Geïmporteerde banktransacties                       |
| `transaction_matches`| Koppeling transactie ↔ factuur/bon                 |
| `roadmap_items`      | Persoonlijke project-roadmap                        |
| `client_tags`        | Optionele tags per klant                            |

Alle tabellen hebben **Row-Level Security**: je ziet alleen je eigen data.

---

## ✅ Wat is er klaar

### Foundation
- [x] Authenticatie (signup/login + protected routes)
- [x] Profiel/bedrijfsgegevens beheer
- [x] Sidebar-navigatie met Fiscaliq-branding
- [x] Landingpagina met hero + features + pricing
- [x] Volledige design-system (semantic tokens, serif headings)

### Boekhoud-core
- [x] Klantenbeheer (CRUD)
- [x] Factuur-editor met regels, BTW-berekening, statussen
- [x] Facturen-overzicht
- [x] Bonnetjes uploaden naar storage + BTW bijhouden
- [x] BTW-overzicht per kwartaal (verschuldigd/aftrekbaar)
- [x] Dashboard met KPI's (omzet maand, openstaand, BTW-reservering)

### Bank
- [x] Bank-pagina UI met "demo"-koppeling (handmatige IBAN + sample transacties)
- [x] Edge function `bank-connect` als skeleton voor GoCardless PSD2

### Project-management
- [x] Persoonlijke roadmap-tool in de app
- [x] Automatische klantscore op basis van betaalgedrag
- [x] CONTEXT.md (dit bestand)

---

## 🚧 Wat staat op de roadmap

### Hoge prioriteit
- [ ] **PDF-export voor facturen** (jsPDF of html2pdf) — kunnen versturen via mail
- [ ] **E-mail versturen** vanuit de app (factuur direct naar klant via Resend)
- [ ] **GoCardless PSD2 echt aansluiten** — institutions, requisitions, fetch transactions
- [ ] **Auto-matching** banktransactie ↔ factuur (op IBAN + bedrag + referentie)

### Medium
- [ ] Recurring/abonnement-facturen (maandelijkse herhaling)
- [ ] Herinneringen voor openstaande facturen (cronjob via edge function)
- [ ] Klant-portal: klant kan factuur online inzien + betalen (Mollie/Stripe)
- [ ] Jaaroverzicht / export naar boekhouder (CSV + ZIP met PDFs)
- [ ] OCR op bonnetjes — automatisch leverancier/bedrag herkennen

### Nice to have
- [ ] Donker thema
- [ ] Mobile-app (PWA-installable)
- [ ] Tijdregistratie (urenboekje → factuur)
- [ ] Offerte-module (van offerte naar factuur)
- [ ] Multi-user (boekhouder kan meekijken)
- [ ] API + Zapier-integratie

---

## 🔐 Secrets / environment

Runtime secrets in Lovable Cloud (al geconfigureerd):
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (auto)
- `LOVABLE_API_KEY` (voor AI-features)

Nog toevoegen voor productie:
- `GOCARDLESS_SECRET_ID` + `GOCARDLESS_SECRET_KEY` (voor PSD2)
- `RESEND_API_KEY` (voor e-mail versturen)
- `MOLLIE_API_KEY` (voor klant-betalingen)

---

## 🚀 Lokaal draaien / deployen

```bash
# Lokaal
npm install
npm run dev

# Deploy naar Vercel
# 1. Verbind GitHub-repo met Vercel
# 2. Voeg env vars toe (zie .env)
# 3. Push naar main → auto-deploy
```

---

## 📊 Eerlijke marktinschatting

**Concurrenten in NL:** MoneyMonk (€15/mnd), e-Boekhouden (€8/mnd), Tellow,
Jortt, Informer. Markt is volwassen — dat is het slechte nieuws. Het goede
nieuws: veel ZZP'ers vinden bestaande tools te bureaucratisch of te lelijk.

**Realistische kansen:**
- ✅ Design + UX kan écht een differentiator zijn (de meeste tools zien er
  uit als jaren-2010 SaaS)
- ✅ Doelgroep "creatieve ZZP'ers / freelancers" die mooie tools waarderen
  (denk aan ontwerpers, fotografen, developers) is bereid te betalen voor iets
  dat goed voelt
- ⚠️ Boekhoud-software is een trust-product — gebruikers stappen niet snel over
- ⚠️ Echte adoptie vereist: 1) accountant-export, 2) bankkoppelingen die werken,
  3) BTW-aangifte direct vanuit de app
- ⚠️ Compliance/wetgeving (Belastingdienst) verandert — onderhoud is een ding

**Eerlijk:** als product-MVP voor je portfolio, side-project of klein klantenbestand
is dit absoluut levensvatbaar en je zit er nu al heel netjes uit. Voor een serieus
SaaS-bedrijf moet je er nog 6-12 maanden vol op zitten (vooral PSD2,
PDF/e-mail, en accountant-integratie). Begin met **één enthousiaste
testgebruiker** en luister naar wat hij/zij echt mist.

---

_Laatst bijgewerkt: zie git log_
