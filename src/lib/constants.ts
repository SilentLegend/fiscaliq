// ─── BTW (VAT) percentages ──────────────────────────────────────────────────
export const BTW_PERCENTAGES = [0, 9, 21] as const satisfies readonly number[];
export type BtwPercentage = (typeof BTW_PERCENTAGES)[number];

// ─── Payment terms in days ──────────────────────────────────────────────────
export const PAYMENT_TERMS = [14, 30, 60] as const satisfies readonly number[];
export type PaymentTerm = (typeof PAYMENT_TERMS)[number];

// ─── Defaults ───────────────────────────────────────────────────────────────
export const DEFAULT_PAYMENT_TERM = 30 satisfies PaymentTerm;
export const DEFAULT_VAT_PERCENTAGE = 21 satisfies BtwPercentage;
export const DEFAULT_LOCALE = 'nl-NL' as const;
export const DEFAULT_CURRENCY = 'EUR' as const;

// ─── Invoice status labels (NL) ─────────────────────────────────────────────
export const INVOICE_STATUS_LABELS = {
  draft: 'Concept',
  sent: 'Verzonden',
  paid: 'Betaald',
  overdue: 'Openstaand',
  cancelled: 'Geannuleerd',
} as const satisfies Record<string, string>;

// ─── Invoice status TailwindCSS color classes ───────────────────────────────
export const INVOICE_STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500 line-through',
} as const satisfies Record<string, string>;

// ─── App info ───────────────────────────────────────────────────────────────
export const APP_NAME = 'Fiscaliq' as const;
export const APP_DOMAIN = 'fiscaliq.nl' as const;
export const APP_DESCRIPTION = "Fiscaal boekhouden voor ZZP'ers" as const;

// ─── Invoice numbering ──────────────────────────────────────────────────────
export const INVOICE_NUMBER_PREFIX = 'JV' as const;

// ─── Format helpers ─────────────────────────────────────────────────────────

/**
 * Format a number as EUR currency using Dutch locale.
 *
 * @example formatCurrency(1250.5) // "€ 1.250,50"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: DEFAULT_CURRENCY,
  }).format(amount);
}

/**
 * Format a date to a Dutch human-readable string.
 *
 * @example formatDate('2026-05-30') // "30 mei 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Build a formatted invoice number string.
 *
 * @example formatInvoiceNumber('JV', 2026, 1) // "JV-2026-0001"
 */
export function formatInvoiceNumber(
  prefix: string,
  year: number,
  number: number,
): string {
  return `${prefix}-${year}-${String(number).padStart(4, '0')}`;
}

/**
 * Alias for `formatInvoiceNumber` — generates the next invoice number.
 */
export function generateInvoiceNumber(
  prefix: string,
  year: number,
  nextNumber: number,
): string {
  return formatInvoiceNumber(prefix, year, nextNumber);
}
