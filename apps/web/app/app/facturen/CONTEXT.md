# CONTEXT.md — FiscalIQ Project

## Wat is FiscalIQ?

FiscalIQ is een Nederlandse boekhoudwebapp gebouwd door SilentLegend. Het is een Next.js 14 frontend gekoppeld aan een Supabase PostgreSQL database, gehost op Vercel. De app is bedoeld voor ZZP'ers en kleine bedrijven om facturen, klanten en financiën bij te houden.

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
***REMOVED******REMOVED***│   │   └── dashboard/
***REMOVED******REMOVED***│   │***REMOVED***   └── page.tsx
***REMOVED******REMOVED***│   └── layout.tsx
***REMOVED******REMOVED***├── lib/
***REMOVED******REMOVED***│   └── supabaseClient.ts   ← Supabase client initialisatie
***REMOVED******REMOVED***├── package.json
***REMOVED******REMOVED***└── tsconfig.json
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
