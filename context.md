# CONTEXT.md — FiscalIQ Project

## Wat is FiscalIQ?

FiscalIQ is een Nederlandse boekhoudwebapp gebouwd door SilentLegend. Het is een Next.js 14 frontend gekoppeld aan een Supabase PostgreSQL database, gehost op Vercel. De app is bedoeld voor ZZP'ers en kleine bedrijven om facturen, klanten en financiën bij te houden.

***

## Recente Updates (21 april 2026)

**Email Reminders Feature Removed:**
- Email reminder feature volledig verwijderd (gepland voor toekomstige versie)
- Verwijderd: `enableAutoReminders` state, `testReminder()` functie
- Verwijderd: email reminder UI toggle, Resend dependency
- Verwijderd: files `lib/email-service.ts`, `lib/reminder-handler.ts`, `app/api/reminders/route.ts`, `supabase/company-settings.sql`
- `vercel.json` leeggemaaktErrorLogger toegevoegd:
- Bonnetjes pagina: `console.error()` logs tonen nu werkelijke Supabase foutmeldingen
- Ritten pagina: `console.error()` logs tonen nu werkelijke Supabase foutmeldingen
- Klantscore pagina: Auth check en invoice count logging toegevoegd voor debugging

**Database Verification Tool:**
- Nieuw: `/apps/web/app/test-database` pagina met volledige database verificatie
- Test: SELECT, INSERT, UPDATE, DELETE operations per tabel
- Automatische schoonmaak van testrecords na verificatie
- RLS policies check geïmplementeerd

**Build Status:**
- Build succeeds zonder errors (✓)
- TypeScript path aliases werkend (@/lib imports)

## Volgende Work (Prioriteit)

1. ✅ DONE: Email reminder code verwijderen
2. ✅ DONE: Error logging toevoegen aan bonnetjes/ritten/klantscore
3. ✅ DONE: Database verificatie tool maken
4. TODO: Klantscore feature volledig testen en debuggen indien nodig
5. TODO: Database volledige integriteitscheck uitvoeren
6. TODO: context.md updaten met toekomstige features
7. TODO: ROADMAP.md aanmaken met feature roadmap
8. TODO: PDF layout verbeteren (ZZP'er info rechts, klant info links)

***

## Repository

- **GitHub:** `https://github.com/SilentLegend/fiscaliq`
- **Branch:** `main`
- **Vercel deployment:** automatisch bij elke push naar `main`

### Mapstructuur

```
fiscaliq/
└── apps/
***REMOVED***└── web/***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***← Next.js app
***REMOVED******REMOVED***├── app/
***REMOVED******REMOVED***│   ├── app/
***REMOVED******REMOVED***│   │   ├── facturen/
***REMOVED******REMOVED***│   │   │   └── page.tsx***REMOVED***← Facturenpagina (meest bewerkt)
***REMOVED******REMOVED***│   │   ├── klanten/
***REMOVED******REMOVED***│   │   │   └── page.tsx
***REMOVED******REMOVED***│   │   ├── bonnetjes/
***REMOVED******REMOVED***│   │   │   └── page.tsx***REMOVED***← Bonnetjes/receipts management
***REMOVED******REMOVED***│   │   ├── ritten/
***REMOVED******REMOVED***│   │   │   └── page.tsx***REMOVED***← Ritregistratie/trips management
***REMOVED******REMOVED***│   │   ├── dashboard/
***REMOVED******REMOVED***│   │   │   └── page.tsx
***REMOVED******REMOVED***│   │   └── layout.tsx***REMOVED***   ← Navigation sidebar met alle routes
***REMOVED******REMOVED***│   ├── lib/
***REMOVED******REMOVED***│   │   └── supabaseClient.ts   ← Supabase client initialisatie
***REMOVED******REMOVED***│   ├── page.tsx***REMOVED******REMOVED******REMOVED*** ← Publieke landingspagina
***REMOVED******REMOVED***│   ├── login/ en register/
***REMOVED******REMOVED***│   ├── package.json
***REMOVED******REMOVED***│   └── tsconfig.json
***REMOVED******REMOVED***└── supabase/
***REMOVED******REMOVED******REMOVED***├── customers.sql
***REMOVED******REMOVED******REMOVED***├── invoices.sql
***REMOVED******REMOVED******REMOVED***├── receipts.sql***REMOVED******REMOVED***← Bonnetjes schema
***REMOVED******REMOVED******REMOVED***└── trips.sql***REMOVED******REMOVED***   ← Ritten schema
```

***

## Tech Stack

| Onderdeel | Technologie | Versie |
|-----------|-------------|--------|
| Framework | Next.js | 14.2.35 |
| Taal | TypeScript | 5.6.3 |
| Styling | Tailwind CSS | 3.4.15 |
| Database | Supabase (PostgreSQL) | 2.48.0 |
| PDF generatie | jsPDF | 2.5.1 |
| Hosting | Vercel | — |

> **Belangrijk:** `jspdf` v2+ bundelt zijn eigen TypeScript types. Gebruik **nooit** `@types/jspdf` als devDependency — dat veroorzaakt een build-conflict. Die package is al verwijderd.

***

## Supabase Database

- **Project naam:** SilentLegend's Project
- **Regio:** eu-west-3
- **Status:** ACTIVE_HEALTHY

### Tabellen

#### `invoices`
| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `id` | uuid | Primary key |
| `customer_name` | text | Naam klant op factuur |
| `issue_date` | date | Factuurdatum |
| `due_date` | date | Vervaldatum |
| `amount_excl` | numeric(12,2) | Bedrag excl. BTW |
| `vat_rate` | numeric | BTW-percentage (bijv. 21) |
| `amount_incl` | numeric(12,2) | Bedrag incl. BTW |
| `status` | text | bijv. `concept` |

#### `invoice_lines`
| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `id` | uuid | Primary key |
| `invoice_id` | uuid | FK naar `invoices.id` |
| `description` | text | Omschrijving regel |
| `quantity` | numeric | Aantal |
| `unit_price` | numeric | Prijs per stuk |
| `amount_excl` | numeric | Totaal excl. BTW voor deze regel |

#### `customers`
| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `id` | uuid | Primary key |
| `name` | text | Bedrijfsnaam |
| `street` | text | Straat |
| `postal_code` | text | Postcode |
| `city` | text | Stad |
| `vat_number` | text | BTW-nummer |
| `kvk` | text | KVK-nummer |
| `email` | text | E-mailadres |
| `phone` | text | Telefoonnummer |

#### `company_settings`
Bevat de gegevens van de eigen onderneming (eenmalig record via `.single()`).

| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `company_name` | text | Eigen bedrijfsnaam |
| `street` | text | Eigen straat |
| `postal_code` | text | Eigen postcode |
| `city` | text | Eigen stad |
| `kvk` | text | Eigen KVK |
| `vat_number` | text | Eigen BTW-nummer |
| `iban` | text | Eigen IBAN |
| `email` | text | Eigen e-mail |
| `website` | text | Eigen website |

#### `receipts` (Bonnetjes)
Bonnetjes en kostenposten voor boekhouden.

| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK naar `auth.users.id` |
| `date` | date | Datum bonnetje |
| `description` | text | Omschrijving (bijv. "Kantoor benodigdheden") |
| `category` | text | Categorie: `reiskosten`, `eten-drinken`, `kantoor`, `software`, `overige` |
| `amount` | numeric(10,2) | Bedrag (EUR, positief) |
| `file_url` | text | URL naar gescande bonbon (optioneel) |
| `created_at` | timestamp | Aangemaakt op |

#### `trips` (Ritregistratie)
Zakelijke ritten met kilometervergoeding berekening.

| Kolom | Type | Omschrijving |
|-------|------|--------------|
| `id` | uuid | Primary key |
| `user_id` | uuid | FK naar `auth.users.id` |
| `date` | date | Datum rit |
| `description` | text | Omschrijving doel (bijv. "Klantbezoek Amsterdam") |
| `start_location` | text | Vertrekpunt |
| `end_location` | text | Bestemming |
| `km` | numeric(8,2) | Kilometers (positief) |
| `cost` | numeric(10,2) | Vergoeding (optioneel, standaard 0,19 EUR/km) |
| `notes` | text | Opmerkingen |
| `created_at` | timestamp | Aangemaakt op |

***

## PDF Factuur Layout

De PDF wordt gegenereerd met `jsPDF` in de functie `handleDownloadPdf(inv: InvoiceRow)` in `apps/web/app/app/facturen/page.tsx`.

### Gewenste/geïmplementeerde layout (gebaseerd op voorbeeld-PDF's):

```
┌─────────────────────────────────────────────────────┐
│  Eigen bedrijfsnaam***REMOVED******REMOVED***  Klantnaam (bold)***REMOVED******REMOVED***│
│  Straat***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  Straat***REMOVED******REMOVED******REMOVED******REMOVED***  │
│  Postcode Stad***REMOVED******REMOVED******REMOVED***   Postcode Stad***REMOVED******REMOVED***   │
│  ─────────────***REMOVED******REMOVED******REMOVED***   KvK-nummer: ...***REMOVED******REMOVED*** │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  BTW-id: ...***REMOVED******REMOVED******REMOVED*** │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  ──────────────────────  │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  │
│  Factuur***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*** │
│  ─────────────────────────────────────────────────   │
│  Factuurnummer  : XXXXXXXX***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***   │
│  Factuurdatum   : DD-MM-YYYY***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*** │
│  Vervaldatum***REMOVED***: DD-MM-YYYY***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*** │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  │
│  Omschrijving***REMOVED*** Aantal   Bedrag   BTW   Totaal***REMOVED*** │
│  ─────────────────────────────────────────────────   │
│  Regel 1***REMOVED******REMOVED******REMOVED*** 1***REMOVED***€ 25,50   21%  € 25,50***REMOVED*** │
│  ─────────────────────────────────────────────────   │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Totaal exclusief BTW:  € xxx,xx   │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***BTW (21%):***REMOVED******REMOVED******REMOVED*** € xxx,xx   │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Totaal:***REMOVED******REMOVED******REMOVED******REMOVED***€ xxx,xx   │
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐***REMOVED***│
│  │ IBAN-nummer │ │Factuurnummer│ │Factuurbedrag│***REMOVED***│
│  │ NL64 KNAB.. │ │  XXXXXXXX   │ │  € xxx,xx   │***REMOVED***│
│  └─────────────┘ └─────────────┘ └─────────────┘***REMOVED***│
│***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  │
│  Het openstaande bedrag van €x dient binnen 30***REMOVED***   │
│  dagen overgemaakt te zijn op rekeningnummer...***REMOVED***  │
└─────────────────────────────────────────────────────┘
```

### Betalingstermijn logica
- Formulier heeft een dropdown: **30 / 60 / 90 dagen**
- Als geen handmatige `dueDate` is ingevuld, wordt die automatisch berekend op basis van de geselecteerde termijn
- In de PDF wordt de termijn bepaald aan de hand van het verschil tussen `issue_date` en `due_date`

***

## Bekende Opgeloste Problemen

### 1. `Cannot find name 'jsPDF'` (TypeScript build error)
- **Oorzaak:** Ontbrekende `import` statement én aanwezigheid van `@types/jspdf` (verouderd, conflicteert met jspdf v2 eigen types)
- **Oplossing:**
  1. `@types/jspdf` verwijderd uit `devDependencies` in `package.json`
  2. Import toegevoegd bovenaan `page.tsx`: `import { jsPDF } from 'jspdf';`

***

## Formulier: Factuur aanmaken

Het formulier in `facturen/page.tsx` gebruikt de volgende `InvoiceForm` interface:

```typescript
interface InvoiceForm {
  customerId: string;***REMOVED******REMOVED***// UUID van geselecteerde klant (optioneel)
  customerName: string;***REMOVED***  // Naam op de factuur
  vatRate: string;***REMOVED******REMOVED***   // BTW-percentage als string, bijv. "21"
  dueDate: string;***REMOVED******REMOVED***   // Handmatige vervaldatum (optioneel)
  paymentTermDays: string;   // "30", "60" of "90"
  lines: InvoiceLineForm[];  // Factuurregels
}
```

***

## Stijlconventies

- Tailwind CSS utility classes
- Rounded corners: `rounded-2xl` / `rounded-full`
- Kleurenpalet: `primary`, `primaryDark`, `text`, `muted`, `border`, `surface`, `bg`
- Formulier inputs: `h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs`
- Knoppen primair: `rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white`
- Foutmeldingen: `rounded-2xl border border-rose-200 bg-rose-50 text-rose-700`

***

## MCP Tooling (voor AI-assistenten)

| Tool | Beschikbaar | Gebruik |
|------|-------------|---------|
| `supabase` MCP | ✅ Ja | Database queries, schema inzien |
| `vercel` MCP | ✅ Ja | Deployment status, logs |
| `github_mcp_direct` | ⚠️ Soms | Bestanden lezen/schrijven op GitHub — **check eerst of beschikbaar meld wanneer niet te bereiken en hoe we dat op kunnen lossen** |

> **Let op:** De GitHub MCP tool is niet altijd beschikbaar in elke sessie. Controleer vóór gebruik of de tool beschikbaar is. Als dat niet het geval is, geef de gebruiker de exacte code + instructies om het zelf via de GitHub web-editor te plakken.

***

## Handige Links

- **GitHub repo:** https://github.com/SilentLegend/fiscaliq
- **Vercel dashboard:** https://vercel.com/dashboard
- **Supabase dashboard:** https://supabase.com/dashboard/project/hcuybmrlozknmyijqabp
- **Facturen pagina (GitHub):** https://github.com/SilentLegend/fiscaliq/blob/main/apps/web/app/app/facturen/page.tsx

***

## Werkwijze voor AI-assistenten

1. **Lees eerst de relevante bestanden** via GitHub MCP of vraag de gebruiker om de inhoud te plakken
2. **Schrijf de volledige gecorrigeerde code** — geen halve patches
3. **Dubbel-check de code** vóór je uploadt: TypeScript types kloppen, imports aanwezig, interfaces compleet
4. **Upload via GitHub MCP** als die tool beschikbaar is — anders geef exacte code + stap-voor-stap GitHub web-editor instructies
5. **Nooit halve antwoorden geven** — altijd de complete fix in één keer

***

## Update 2026-04-20 (huidige stand)

### Facturen
- Facturenpagina gebruikt nu **aanmaakdatum (`issue_date`)** + **automatische vervaldatum** via betalingstermijn (14/30/60/90 dagen).
- Factuurnummering ondersteunt nu format:
  - `NAAMBEDRIJF_HUIDIGEJAAR_FACTUURNUMMER`
  - voorbeeld: `Dhl_2026_01`
- Database `invoices` heeft extra kolommen:
  - `currency` (default `EUR`)
  - `invoice_number` (met unieke index per `user_id`)
- In de factuurmodal is een **PDF-preview in browser** toegevoegd via een echte jsPDF-render, gelijk aan download-layout.
- Actieknoppen per factuur:
  - bewerken
  - downloaden
  - delen (WhatsApp, e-mail, native share)
  - verwijderen
- Factuuroverzicht heeft kwartaalfilters (`Q1` t/m `Q4`) + jaarselectie, met meest recente bovenaan binnen de selectie.
- Delete-confirm in facturen ondersteunt toetsen:
  - `Enter` = bevestigen
  - `Esc` = annuleren

### Klanten
- Klantenpagina is volledig CRUD gekoppeld aan Supabase (geen localStorage meer).
- `customers` tabel uitgebreid met volledige facturatievelden:
  - o.a. `customer_number`, `legal_form`, `contact_name`, `payment_term_days`, `currency`, `delivery_method`, `status`, `notes`, `updated_at`.
- Delete-confirm in klanten ondersteunt toetsen:
  - `Enter` = bevestigen
  - `Esc` = annuleren

### Navigatie & extra pagina's
- Nieuwe app-pagina: `/app/roadmap` met projectfases.
- Optionele app-pagina: `/app/klantscore` (via feature toggle).

### Instellingen / feature toggles
- In `Instellingen` staan experimentele toggles:
  - automatische herinneringen
  - klantscore-tabblad
- Flags worden lokaal opgeslagen onder `fiscaliq.featureFlags.v1`.

### Productrichting
- Doelgroep blijft: **ZZP'ers en kleine ondernemers**.
- Toekomstige kernfeature: **bankkoppeling** voor automatische betaalstatus per factuur.
- Publieke factuurpagina is **niet gewenst**; verzending loopt via bestaande kanalen (mail/WhatsApp) en betaling via reguliere bankoverschrijving.

### Bonnetjes (Receipts)
- Pagina: `/app/bonnetjes`
- Functionaliteit: Volledige CRUD voor bonnetjes/kostenposten
- Categorieën: `reiskosten`, `eten-drinken`, `kantoor`, `software`, `overige` (kleur-gecodeerd)
- Features:
  - Modal form voor toevoegen (datum, omschrijving, categorie, bedrag)
  - Tabel view met sorteer-optie (nieuwste eerst)
  - Delete-knop per rij
  - Zijbalk met: totaalbedrag, aantal bonnetjes, breakdown per categorie
  - Error handling voor validatie (omschrijving verplicht, bedrag positief)
  - Realtime update na insert/delete
- Database: `receipts` tabel met user_id-based RLS policies

### Ritregistratie (Trips)
- Pagina: `/app/ritten`
- Functionaliteit: Registreer zakelijke ritten met automatische kilometervergoeding
- Features:
  - Modal form voor toevoegen (datum, beschrijving, vertrekpunt, bestemming, km, optioneel bedrag, notities)
  - Tabel view met: datum, route (van → naar), km, vergoeding berekend
  - Automatische vergoedingsberekening: 0,19 EUR/km (Nederlands wetgeving 2026)
  - Mogelijkheid handmatig bedrag aan te passen
  - Zijbalk met: totale km, totale vergoeding, aantal ritten, info-box over vergoeding
  - Delete-functie per rit
  - Empty state met CTA
- Database: `trips` tabel met user_id-based RLS policies

### Navigatie update
- Sidebar nav items uitgebreid met:
  - Bonnetjes (icon: bonnetje/receipt)
  - Ritten (icon: route/compass)

***

## Toekomstige Features (Roadmap)

### Phase 1: Email Reminders & Automation
- **Email herinneringen:** Automatische mails naar klanten voor vervallen facturen
- **Integratie:** Resend API voor email verzending
- **Timing:** Dagelijks via Vercel Cron
- **User preference:** Toggle in instellingen

### Phase 2: Meer Bonnetjes & Ritten Features
- **Bonnetjes-upload:** Foto/scan van bonnetjes opslaan naar Supabase Storage
- **OCR optioneel:** Automatisch bedrag/datum uit foto extracten (low priority)
- **Ritten-categories:** Verschillende soorten ritten (klantbezoek, leverancy, etc.)
- **Rittenrapport:** CSV export per periode

### Phase 3: Tax Filing & Compliance
- **ICP-aangifte:** Automatische gegevensvoorbereiding voor belastingaangifte
- **BTW-aangifte:** BTW-rapportage per kwartaal
- **JsJu-rapport:** Jaarlijkse inkomstenstellingrapportage

### Phase 4: Payment Integration
- **iDEAL-betaling:** Directe betaling via iDEAL knop in factuuroverzicht
- **Automatische status:** Factuur status → "betaald" bij succesvolle payment
- **Bankkoppeling:** Importeer betalingen van bank (Plaid o.ï.d.)

### Phase 5: API & Automation
- **REST API:** Programmatisch facturen aanmaken/bijwerken
- **Webhook support:** Externe systemen kunnnen events ontvangen
- **Zapier/Make:** Integratie met populaire automation platforms
- **Auto-invoicing:** POST werktijden/inkomsten → automatische factuur

### Phase 6: Advanced Analytics & Insights
- **Dashboard-uitbreiding:** Inkomstengrafiek, winstmarge trends
- **Client insights:** Betaalgedrag analyseren per klant
- **Tax planning:** Voorstel voor reserveringen/belastingplanning
- **Export-opties:** PDF/Excel rapporten per periode

### Phase 7: Multi-user & Teams
- **User management:** Meerdere teamleden toevoegen met rollen
- **Permission system:** Admin / Accountant / Viewer rollen
- **Audit log:** Wie heeft wat en wanneer gewijzigd

### Phase 8: Mobile App
- **React Native app:** iOS & Android versie voor onderweg
- **Offline-first:** Werkt ook zonder internet (sync wanneer mogelijk)
- **Notifications:** Push notifications voor vervallen facturen

### Future Low-Priority Ideas
- **Templates:** Factuursjablonen per klanttype
- **Tijdregistratie:** Integratie met urenregistratie
- **Projecten:** Facturen linken aan projecten/contracten
- **Geldstroom:** Cashflow forecast gebaseerd op vervaldatums
- **Integrations:** Import klantgegevens uit externe CRM
- **Custom branding:** Logo en kleuren per account

***
