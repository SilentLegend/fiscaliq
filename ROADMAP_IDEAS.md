# 🚀 FiscalIQ - Volgende Implementaties Roadmap

## Huidige Status
✅ Database & Supabase: Volledig operationeel  
✅ Klantscore: Live en werkend  
✅ Herinneringsmail: Net geïmplementeerd  

---

## 🎯 Feature Ideas voor Volgende Sprint

### Tier 1: Quick Wins (1-2 dagen)

#### 1. **Payment Status Tracking** 
- **Problem**: Nu hebben facturen alleen 'open' of 'concept' status
- **Solve**: Add payment status workflow
  - `draft` → `sent` → `overdue` → `paid` → `archived`
- **Impact**: Dashboard kan payment stats tonen, reminders worden smarter
- **Database**: Migrate invoices.status enum, add paid_date column
- **UI**: Status badges per invoice, filter by status
- **Effort**: 1 dag

#### 2. **Email Log Dashboard**
- **Problem**: No visibility into sent reminders
- **Solve**: Create email_logs viewer page
  - Tabel met alle verzonden emails
  - Filters: date range, customer, status, success/failed
  - Retry failed sends
- **Impact**: Full audit trail of communications
- **UI**: New page `/app/email-logs`
- **Effort**: 1 dag

#### 3. **Invoice PDF Improvements**
- **Problem**: PDF is basic, no company branding
- **Solve**: 
  - Add company logo/header
  - Better layout & styling
  - Payment instructions prominently displayed
  - QR code for payment link
- **UI**: Settings for logo upload, invoice template selection
- **Database**: Store logo in S3/Supabase storage
- **Effort**: 1.5 dagen

---

### Tier 2: High Value (3-5 dagen)

#### 4. **Invoice Automation & Templates**
- **Problem**: Users create similar invoices from scratch
- **Solve**: Invoice templates + auto-filling
  - Save invoice as template
  - One-click duplicate with new date
  - Auto-fill customer info
  - Recurring invoices (monthly, yearly)
- **Database**: Add invoices_templates table
- **UI**: Template manager, schedule recurring
- **Impact**: 10x faster invoice creation
- **Effort**: 4 dagen

#### 5. **Multi-Currency Support**
- **Problem**: Only EUR, but users may work internationally
- **Solve**: 
  - Currency selector per invoice
  - Live exchange rates (free API: exchangerate-api.com)
  - Currency conversion tracking
  - Dashboard in multiple currencies
- **Database**: Store currency_rate, base_currency per transaction
- **Impact**: Expand to international users
- **Effort**: 3 dagen

#### 6. **Bank Import / Auto-Reconciliation**
- **Problem**: Manual payment tracking is tedious
- **Solve**: Connect to bank account
  - Plaid integration for bank access
  - Auto-import transactions
  - Match paid invoices automatically
  - Mark invoices paid automatically
- **Database**: Add bank_connections, transactions tables
- **Impact**: 80% reduction in manual work
- **Effort**: 5 dagen (complex)

#### 7. **Customer Portal**
- **Problem**: Customers have no visibility into their invoices
- **Solve**: Public portal where customers can:
  - View their invoices
  - Download PDFs
  - See payment status
  - Pay online (integrate Stripe/Mollie)
  - View invoice history
- **Auth**: Token-based, no login required
- **Database**: Add invoice_tokens, customer_portal_settings
- **Impact**: Reduce back-and-forth communication
- **Effort**: 4 dagen

---

### Tier 3: Scalability (1-2 weeks)

#### 8. **Expense & Receipt Management** (Already partially done)
- **Status**: Receipts table exists, bonnetjes page functional
- **Enhance**:
  - Receipt OCR (read amount/date from photo)
  - Expense categorization AI
  - Receipt matching to invoices (cost allocation)
  - Monthly expense reports
- **AI**: Google Vision API or Tesseract OCR
- **Impact**: Better expense tracking, tax deductions
- **Effort**: 5 dagen

#### 9. **Tax & Accounting Reports**
- **Problem**: No automated tax reports
- **Solve**: Generate tax reports automatically
  - Monthly VAT summary (NL: MRB, BB)
  - Quarterly/yearly income summaries
  - Expense categorization by tax code
  - Export to accounting software (Exact Online, MoneyMonk)
  - PDF reports ready for tax consultant
- **Database**: Add tax_settings, tax_reports tables
- **Impact**: Huge for accountants, simplifies tax prep
- **Effort**: 1 week

#### 10. **Team/Multiple User Accounts**
- **Problem**: Only one user per account
- **Solve**: 
  - Invite team members
  - Role-based access (admin, accountant, viewer)
  - Activity logs
  - Bulk operations
- **Database**: Add team_members, roles, activity_logs tables
- **RLS**: Update all policies for team awareness
- **Impact**: Enable agencies, accounting firms
- **Effort**: 1 week

#### 11. **Stripe/Mollie Payment Integration**
- **Problem**: Can't accept online payments
- **Solve**:
  - Generate payment link for each invoice
  - Customer can pay online
  - Auto-mark invoice as paid
  - Fees handled properly
  - Recurring payment support
- **Webhooks**: Listen for payment confirmation
- **Database**: Add payment_methods, stripe_accounts tables
- **Impact**: Faster cash flow, better UX
- **Effort**: 4 dagen

#### 12. **Analytics & Dashboard Upgrades**
- **Problem**: Basic dashboard, no insights
- **Solve**: Advanced analytics
  - Revenue charts over time
  - Customer lifetime value (LTV)
  - Payment trends (time to payment)
  - Top customers by revenue
  - Projected cash flow
  - KPIs (invoiced, paid, overdue amounts)
- **Charts**: Use Chart.js or Recharts
- **Impact**: Better business insights
- **Effort**: 3 dagen

---

### Tier 4: Advanced (Nice to Have)

#### 13. **SMS Reminders**
- Extension of email reminders
- Integrate Twilio for SMS
- Send SMS for critical overdue invoices
- Option to disable SMS per customer

#### 14. **Late Fee Automation**
- Automatically add late fees after X days
- Configurable percentage or fixed amount
- Send updated invoice to customer
- Track as new line item

#### 15. **Invoice Signing** (E-signature)
- Integrate DocuSign or similar
- For contracts/terms
- Customer must sign to validate
- Audit trail

#### 16. **Subscription Management**
- Track recurring revenue
- Subscription invoicing
- Auto-bill on schedule
- Trial period management
- Churn prediction

#### 17. **Webhook System for Partners**
- Allow integrations (Zapier, Make.com)
- Trigger events: invoice created, paid, overdue
- Custom workflows
- API for partners

#### 18. **Mobile App**
- React Native app for iOS/Android
- Offline support
- Mobile invoice viewing
- Quick expense logging with camera

---

## 🎯 Recommended Next 3 Items

Based on **impact/effort ratio**:

### Immediate (This Week)
1. **Payment Status Tracking** - Enables many other features
2. **Email Log Dashboard** - Critical for operations

### Short Term (Next 2 Weeks)
3. **Invoice Templates** - Big UX improvement, 4x faster
4. **Tax Reports** - Major value for Dutch ZZP'ers

### Medium Term (Month)
5. **Bank Import** - Biggest timesaver
6. **Customer Portal** - Reduces communication overhead

---

## Implementation Strategy

### Development Order Recommendation
1. **Week 1**: Payment tracking + Email logs → Stable foundation
2. **Week 2**: Invoice templates + Multi-currency → Feature richness  
3. **Week 3**: Bank import (Plaid) → Automation
4. **Week 4**: Customer portal + Payment integration (Mollie) → Revenue
5. **Week 5**: Tax reports → Enterprise
6. **Week 6+**: Team management, mobile, advanced features

### Quick Wins to Do Today
✅ **Payment Status Tracking** (Payment field migrations)
✅ **Email Log Dashboard** (Simple CRUD page)

Both are straightforward database + UI work.

---

## Dependencies & Integrations Needed

| Feature | Service | Cost | Integration |
|---------|---------|------|-------------|
| Bank Import | Plaid | $0-99/mo | SDK |
| SMS | Twilio | $0.0075/SMS | API |
| Payments | Stripe/Mollie | 1.4-2.9% + fee | Webhooks |
| OCR | Google Vision | $0.6-1.5/1k requests | API |
| Signatures | DocuSign | $10-40/mo | API |
| Exchange Rates | API | Free | REST |
| Charts | Chart.js | Free | NPM |

---

## Questions for You

1. **What's highest priority for your users?** (Payments, Tax, Templates, etc.)
2. **Do you want to monetize?** (Premium features, tiered pricing)
3. **Team support needed soon?** (Multi-user, or solo for now)
4. **International expansion?** (Multi-currency, multi-language)
5. **Mobile app?** (Mobile-first or web-first for now)

---

## Next Steps

Would you like me to implement:
1. Payment Status Tracking + Email Dashboard (quick wins)
2. Invoice Templates (high impact)
3. Bank Import (automation)
4. Something else entirely?

Let me know what to build next! 🚀
