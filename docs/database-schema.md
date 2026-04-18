# Database schema — Fiscaliq

## Tabellen (eerste versie)

```sql
-- Gebruikers
users
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  email***REMOVED******REMOVED*** TEXT UNIQUE NOT NULL
  naam***REMOVED******REMOVED***  TEXT
  kvk_nummer***REMOVED***TEXT
  btw_nummer***REMOVED***TEXT
  created_at***REMOVED***TIMESTAMP
  subscription  TEXT DEFAULT 'actief'

-- Klanten
klanten
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  user_id***REMOVED***   UUID REFERENCES users(id)
  naam***REMOVED******REMOVED***  TEXT NOT NULL
  email***REMOVED******REMOVED*** TEXT
  adres***REMOVED******REMOVED*** TEXT
  postcode***REMOVED***  TEXT
  stad***REMOVED******REMOVED***  TEXT
  land***REMOVED******REMOVED***  TEXT DEFAULT 'NL'
  btw_nummer***REMOVED***TEXT
  created_at***REMOVED***TIMESTAMP

-- Facturen
facturen
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  user_id***REMOVED***   UUID REFERENCES users(id)
  klant_id***REMOVED***  UUID REFERENCES klanten(id)
  factuurnummer TEXT NOT NULL
  datum***REMOVED******REMOVED*** DATE
  vervaldatum   DATE
  status***REMOVED******REMOVED***TEXT DEFAULT 'concept'  -- concept | verzonden | betaald | verlopen
  subtotaal***REMOVED*** NUMERIC(10,2)
  btw_bedrag***REMOVED***NUMERIC(10,2)
  totaal***REMOVED******REMOVED***NUMERIC(10,2)
  notities***REMOVED***  TEXT
  created_at***REMOVED***TIMESTAMP

-- Factuurregels
factuurregels
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  factuur_id***REMOVED***UUID REFERENCES facturen(id)
  omschrijving  TEXT NOT NULL
  aantal***REMOVED******REMOVED***NUMERIC(10,2)
  eenheidsprijs NUMERIC(10,2)
  btw_percentage NUMERIC(5,2) DEFAULT 21
  totaal***REMOVED******REMOVED***NUMERIC(10,2)

-- Bonnetjes / kosten
bonnetjes
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  user_id***REMOVED***   UUID REFERENCES users(id)
  omschrijving  TEXT
  bedrag***REMOVED******REMOVED***NUMERIC(10,2)
  btw_bedrag***REMOVED***NUMERIC(10,2)
  categorie***REMOVED*** TEXT
  datum***REMOVED******REMOVED*** DATE
  bestand_url   TEXT
  created_at***REMOVED***TIMESTAMP

-- Bankimport transacties
transacties
  id***REMOVED******REMOVED******REMOVED***UUID PRIMARY KEY
  user_id***REMOVED***   UUID REFERENCES users(id)
  datum***REMOVED******REMOVED*** DATE
  omschrijving  TEXT
  bedrag***REMOVED******REMOVED***NUMERIC(10,2)
  type***REMOVED******REMOVED***  TEXT  -- inkomst | uitgave
  factuur_id***REMOVED***UUID REFERENCES facturen(id)  -- optioneel: gematcht aan factuur
  created_at***REMOVED***TIMESTAMP
```
