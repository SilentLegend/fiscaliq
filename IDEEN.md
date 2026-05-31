# Ideeën & Feature Requests

## ✅ AFGEROND
| # | Idee | Notities |
|---|------|----------|
| 1 | Dynamische begroeting (tijd van de dag) | Goedemorgen/Goedemiddag/Goedenavond op dashboard |
| 2 | Volledige regel klikbaar in facturenlijst | Hele rij navigeert naar detail |
| 3 | Download knop facturen (PDF) | Knop aanwezig op overzicht + detail, toont toast 'binnenkort beschikbaar' |
| 4 | Verwijder knop facturen | Confirm + verwijder uit DB met toast |
| 5 | Bewerk knop bonnetjes | Potlood opent dialog met vooringevulde waarden |
| 6 | Instellingen uitbreiden | Dark mode toggle + CSS animatie, notificatie switches, extra bedrijfsvelden |
| 7 | Roadmap hardcoded | Developer-managed roadmap, niet door gebruiker aanpasbaar |
| 8 | Dark mode persistent | Inline script in index.html, geen flash bij reload |

## 🔄 IN ONTWIKKELING
| # | Idee | Notities |
|---|------|----------|
| 9 | Dashboard grafiek (instelbaar) | recharts lijn/staafgrafiek met week/maand/kwartaal/jaar selector |

## 📋 TODO
| # | Idee | Fase | Notities |
|---|------|------|----------|
| 10 | PDF-export facturen | Must-have | jsPDF/html2pdf — bepalen layout met gebruiker |
| 11 | E-mail versturen (Resend) | Must-have | Factuur direct mailen vanuit app |
| 12 | BTW-aangifte export (XML) | Must-have | XML voor Belastingdienst upload |
| 13 | Jaaroverzicht / boekhouder export | Must-have | CSV + ZIP met alle PDFs |
| 14 | Save-before-leave InvoiceEditor | Must-have | onbeforeunload + useBlocker |
| 15 | Fix Settings DB velden | Bugfix | phone, website, default_vat_rate, payment_terms, invoice_footer toevoegen aan profiles |
| 16 | Lettertypes laden (Fraunces/Inter) | Bugfix | Google Fonts link werkt niet — fixen |
| 17 | Live PSD2 bankkoppeling | Groeien | GoCardless requisition flow |
| 18 | Betaallink op facturen | Groeien | Mollie/Stripe betaalknop in factuurmail |
| 19 | Automatische herinneringen | Groeien | Cronjob edge function voor openstaande facturen |
| 20 | Recurring/abonnement facturen | Groeien | Maandelijkse automatische facturen |
| 21 | Auto-matching bank ↔ facturen | Groeien | Op IBAN + bedrag + referentie |
| 22 | Zoeken/filteren op tabellen | UX | Inline search voor facturen, klanten, bonnetjes |
| 23 | Pagination op lijsten | UX | Server-side pagination i.p.v. alles laden |
| 24 | Loading skeletons | UX | Vervang "Laden…" text door skeletons |
| 25 | AlertDialog i.p.v. confirm() | UX | shadcn AlertDialog voor delete confirmaties |
| 26 | Wachtwoord vergeten flow | UX | Password reset op auth pagina |
| 27 | Client detail pagina | UX | Aparte pagina met klantgegevens + facturen + score |
| 28 | Batch acties facturen | UX | Selecteer meerdere → status wijzigen |
| 29 | Status "betaald" direct vanuit lijst | UX | Inline markeren zonder editor te openen |
| 30 | Zoekbare klant-selector | UX | Command/combobox i.p.v. native select |
| 31 | Dashboard perioden-vergelijking | UX | "+12% vs vorige maand" bij KPI's |
| 32 | Openstaande facturen herinnering | UX | Waarschuwing op dashboard bij vervallen facturen |
| 33 | Grafiek BTW (verschuldigd vs aftrekbaar) | UX | Extra lijn in dashboard chart |
| 34 | Klantportaal | Blijven | Klant online inzien + betalen |
| 35 | Tijdregistratie → factuur | Blijven | Uren schrijven → 1 klik factuur |
| 36 | Offertes maken | Blijven | Offerte → factuur conversie |
| 37 | PWA (installeerbaar) | Blijven | Mobile-first, offline support |
| 38 | OCR bonnetjes | Blijven | Automatisch leverancier/bedrag uit foto |
| 39 | Dispatch rule voor BTW op facturen | Verbetering | Incl./excl. BTW toggle per regel of factuur |
| 40 | Korting op factuurregels | Verbetering | Regelkorting of totaalkorting |
| 41 | Factuur kopiëren/dupliceren | Verbetering | Snelle herhaling voor vaste klanten |
| 42 | Bedrijfslogo upload | Verbetering | Voor PDF facturen |
| 43 | Notificatie voorkeuren naar DB | Verbetering | Sync over meerdere devices |
| 44 | Route-level code splitting | Performance | React.lazy per route |
| 45 | Multi-user (boekhouder) | Uitbreiding | Boekhouder kan meekijken |
| 46 | API + Zapier integratie | Uitbreiding | Externe connecties |
| 47 | Error boundaries | Stabiliteit | Per-feature error catching |
| 48 | Mobiele app (native) | Uitbreiding | Bonnetjes scannen onderweg |
