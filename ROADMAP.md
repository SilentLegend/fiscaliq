# FiscalIQ Roadmap

> **Last updated:** 21 april 2026  
> **Current status:** MVP complete - Core features working, email reminders deferred to Phase 1

## Project Status Overview

### ✅ Completed Features (MVP)
- Factuur management (CRUD): Aanmaken, bewerken, verwijderen, PDF export
- Klanten management: Volledige CRUD met contactgegevens
- Bonnetjes/Receipts: Volledige CRUD met categorieën en totalen
- Ritregistratie/Trips: Volledige CRUD met automatische kilometervergoeding
- Klantscore: Betaalbehavior analyse per klant
- PDF factuurgeneratie: Custom layout met jsPDF
- Instellingen: Bedrijfsgegevens opslaan
- Dashboard: Basic KPI's en overzichten
- Database: Supabase PostgreSQL met RLS policies
- Authentication: Supabase Auth (email/password)
- Deployment: Vercel auto-deploy op main branch

### 🔧 In Progress
- Error logging & debugging (database issues diagnose)
- Database integrity verification tool
- PDF layout improvements (ZZP'er info positioning)

### ⏸️ On Hold / To Do
- Email reminder system (moved to Phase 1)
- API backend
- Tax filing integration
- Payment integration (iDEAL)

---

## Roadmap Timeline

### Phase 1: Polish & Automation (Q2 2026)
**Goal:** Stabiel MVP met automation basis  
**Duration:** 2-3 weken

**Features:**
- [x] Database error logging & debugging
- [ ] Email reminders voor vervallen facturen (Resend API)
- [ ] PDF layout improvements: ZZP'er info rechts, klant links
- [ ] Default quarter selector in facturen (current quarter)
- [ ] Improved error messages in UI
- [ ] Email field optional for customers
- [ ] Database backup & recovery docs

**Acceptance Criteria:**
- All 5 database tables working perfectly
- Error messages are clear and actionable
- Email reminders tested with real data
- PDF layout matches specification
- Zero build errors

---

### Phase 2: Bonnetjes & Ritten Enhancement (Q3 2026)
**Goal:** Richer receipt & trip management  
**Duration:** 2-3 weken

**Features:**
- [ ] Receipt image upload to Supabase Storage
- [ ] File preview/download for receipts
- [ ] Trip categories (klantbezoek, leverancy, werkplaats, overig)
- [ ] Trip report generation (CSV export)
- [ ] Receipt total breakdown per category chart
- [ ] Recurring receipts (monthly/quarterly)
- [ ] Bulk operations (delete multiple receipts)

**Acceptance Criteria:**
- Upload/download workflow tested
- Charts render correctly
- Export files are properly formatted
- Performance acceptable with 1000+ items

---

### Phase 3: Tax & Compliance (Q3-Q4 2026)
**Goal:** Tax filing automation  
**Duration:** 4-6 weken

**Features:**
- [ ] ICP-aangifte data preparation
- [ ] BTW-aangifte per quarter
- [ ] JsJu-rapport generation
- [ ] Tax calendar with filing dates
- [ ] Deduction suggestions based on categories
- [ ] Multi-currency support (EUR, USD, GBP)

**Acceptance Criteria:**
- Generated reports pass validation
- Tax professionals can review/approve
- Export to .xml for tax software
- Historical data preserved

---

### Phase 4: Payment Integration (Q4 2026)
**Goal:** Frictionless payment tracking  
**Duration:** 3-4 weken

**Features:**
- [ ] iDEAL payment button in invoice view
- [ ] Automatic status update on payment
- [ ] Payment webhook handling
- [ ] Bank transaction import (Plaid/Openbanking)
- [ ] Reconciliation tool
- [ ] Payment reminder emails (customizable)

**Acceptance Criteria:**
- iDEAL test transactions flow end-to-end
- Status updates happen within 5 minutes
- Bank import matches invoice records
- Payment history is auditable

---

### Phase 5: API & Webhooks (Q1 2027)
**Goal:** Programmable, extensible platform  
**Duration:** 3-4 weken

**Features:**
- [ ] REST API with OpenAPI docs
- [ ] API key management
- [ ] Webhook subscriptions (invoice.created, payment.received)
- [ ] Postman collection
- [ ] Rate limiting & quota system
- [ ] Zapier/Make templates

**Acceptance Criteria:**
- API fully documented
- Example integrations working
- Webhook delivery tested
- Error responses are helpful

---

### Phase 6: Advanced Analytics (Q2 2027)
**Goal:** Insights & forecasting  
**Duration:** 3-4 weken

**Features:**
- [ ] Revenue trends graph (monthly/yearly)
- [ ] Profit margin analysis
- [ ] Customer lifetime value (CLV)
- [ ] Payment behavior analysis
- [ ] Expense breakdown dashboard
- [ ] Cashflow forecast
- [ ] Email reports (weekly/monthly)

**Acceptance Criteria:**
- Graphs render correctly with large datasets
- Forecasts are statistically sound
- Emails are properly formatted
- Performance under load tested

---

### Phase 7: Multi-user & Teams (Q2-Q3 2027)
**Goal:** Collaborate securely  
**Duration:** 4-6 weken

**Features:**
- [ ] User invitation system
- [ ] Role-based access control (RBAC)
  - Admin (full access)
  - Accountant (view/create/edit)
  - Viewer (read-only)
- [ ] Audit log (who, what, when)
- [ ] Workspace settings
- [ ] Bulk user management

**Acceptance Criteria:**
- Permissions enforced at database level
- Audit log is tamper-proof
- Email invitations work
- Regressions in single-user mode are zero

---

### Phase 8: Mobile App (Q3-Q4 2027)
**Goal:** On-the-go access  
**Duration:** 6-8 weken

**Features:**
- [ ] React Native iOS & Android apps
- [ ] Offline-first data sync
- [ ] Camera integration for receipt photos
- [ ] Push notifications
- [ ] Touch ID / Face ID auth
- [ ] Dark mode support

**Acceptance Criteria:**
- Apps available on App Store & Play Store
- Offline mode fully functional
- Sync conflicts handled gracefully
- Performance on older devices tested

---

## Future Ideas (Low Priority / Wishlist)

### Nice-to-haves
- [ ] Invoice templates per customer type
- [ ] Time tracking & hourly billing
- [ ] Project/contract management
- [ ] Custom branding (logo, colors)
- [ ] White-label option for agencies
- [ ] Multi-language support (EN, FR, DE, ES)

### Advanced Features
- [ ] Subscription invoicing (recurring)
- [ ] Proposal generation
- [ ] Contract templates
- [ ] Expense categorization via AI
- [ ] Smart client suggestions based on history
- [ ] CRM integration (Pipedrive, HubSpot)

### Integration Partners
- [ ] Accounting software (Exact, Moneybird)
- [ ] Payment gateway (Stripe, Adyen)
- [ ] Document storage (Dropbox, OneDrive)
- [ ] Email provider (Gmail, Outlook integration)

---

## Known Issues & Tech Debt

### Current Issues
- [ ] Bonnetjes/Ritten save errors need real error logging (in progress)
- [ ] Klantscore needs thorough testing with real data
- [ ] PDF layout needs visual refinement

### Tech Debt
- [ ] Add comprehensive test suite (unit + integration)
- [ ] Improve error boundary handling
- [ ] Optimize database queries (add more indexes)
- [ ] Refactor large components (facturen page ~500 lines)
- [ ] Document API/database schemas with OpenAPI/SwaggerUI

---

## Success Metrics

### Phase 1 Goals
- ✅ Zero build errors
- ✅ Email features fully functional
- ✅ Error messages helpful & actionable
- ✅ All database operations working

### Phase 2+ Goals
- 99.9% uptime
- < 100ms API response time
- 1000+ active users
- 50+ 5-star reviews

---

## Dependencies & Blockers

### External Dependencies
- Supabase (database & auth) - ✅ stable
- Vercel (hosting) - ✅ stable
- Resend (emails) - ⏸️ optional in Phase 1
- jsPDF (PDF generation) - ✅ working

### Internal Blockers
- None currently

---

## Release Schedule (Tentative)

- **v1.0.0** (MVP): End of April 2026 ✅
- **v1.1.0** (Phase 1): Mid-May 2026
- **v2.0.0** (Phase 2): Mid-July 2026
- **v2.1.0** (Phase 3): End of September 2026
- **v3.0.0** (Phase 4): End of December 2026
- **v4.0.0** (Phase 5): End of March 2027
- **v5.0.0** (Phase 6): End of June 2027
- **v6.0.0** (Phase 7): End of September 2027
- **v7.0.0** (Phase 8): End of December 2027

---

## Testing Strategy

### Phase 1 Testing
- [ ] Manual user acceptance testing (UAT)
- [ ] Database stress test (10K+ records)
- [ ] Email delivery verification
- [ ] PDF rendering on different devices

### Future Testing
- [ ] Automated unit tests (Jest)
- [ ] Integration tests (Playwright)
- [ ] Load testing (k6)
- [ ] Security audit (OWASP)

---

## Budget & Resources

### Current Team
- Solo developer (SilentLegend)

### Scaling Strategy
- Phase 2: Consider hiring frontend developer
- Phase 4: Consider hiring backend/DevOps engineer
- Phase 7: Consider hiring UX designer & QA

---

## Feedback & Changes

> This roadmap is subject to change based on user feedback and market conditions.  
> Last significant update: 21 april 2026

**How to contribute:**
1. Open issue on GitHub with feature request
2. Vote on existing feature requests
3. Email: (contact info to be added)

---
