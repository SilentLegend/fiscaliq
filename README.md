# Fiscaliq 💼

> Betaalbaar, eerlijk en volledig boekhoudplatform voor kleine zzp'ers in Nederland.

## Wat is Fiscaliq?

Fiscaliq is een SaaS-boekhoudplatform gebouwd voor kleine dienstverlenende zzp'ers die geen zin hebben in ingewikkelde, dure software. Één plan, alles erin, voor een eerlijke prijs.

## Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** PostgreSQL via Supabase
- **Auth:** Supabase Auth
- **Payments:** Mollie
- **Hosting:** Vercel (web) + Railway (api)

## Projectstructuur

```
fiscaliq/
├── apps/
│   ├── web/***REMOVED******REMOVED***  # Next.js frontend
│   └── api/***REMOVED******REMOVED***  # FastAPI backend
├── packages/
│   ├── ui/***REMOVED******REMOVED***   # Gedeelde UI-componenten
│   └── types/***REMOVED******REMOVED***# Gedeelde TypeScript types
├── docs/***REMOVED******REMOVED******REMOVED*** # Documentatie & beslissingen
└── .github/
***REMOVED***└── workflows/***REMOVED***# CI/CD pipelines
```

## Aan de slag

```bash
# Clone de repo
git clone https://github.com/SilentLegend/fiscaliq.git
cd fiscaliq

# Frontend starten
cd apps/web
npm install
npm run dev

# Backend starten
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Roadmap

- [x] Project opzetten
- [ ] Authenticatie & registratie
- [ ] Dashboard
- [ ] Klantenbeheer
- [ ] Facturen & offertes
- [ ] Bonnetjes uploaden
- [ ] BTW-overzicht
- [ ] CSV bankimport
- [ ] Mollie betalingen
- [ ] PSD2 bankkoppeling

## Licentie

Privé — alle rechten voorbehouden © 2026 Fiscaliq
