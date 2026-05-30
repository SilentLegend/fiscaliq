// ─── Generic JSON type (PostgreSQL JSON/JSONB) ──────────────────────────────
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Profile ────────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postal_code: string | null;
  city: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  iban: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Client ─────────────────────────────────────────────────────────────────
export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postal_code: string | null;
  city: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Invoice ────────────────────────────────────────────────────────────────
export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled';

export interface Invoice {
  id: string;
  user_id: string;
  client_id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  vat_total: number;
  total: number;
  notes: string | null;
  payment_instructions: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields (optional, populated via queries)
  client_name?: string;
  client_city?: string;
}

// ─── LineItem ───────────────────────────────────────────────────────────────
export interface LineItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_percentage: number;
  line_total: number;
  created_at: string;
}

// ─── Invoice with nested relations ──────────────────────────────────────────
export interface InvoiceWithItems extends Invoice {
  line_items: LineItem[];
  client?: Client;
}

// ─── InvoiceSettings ────────────────────────────────────────────────────────
export interface InvoiceSettings {
  id: string;
  user_id: string;
  default_vat_percentage: number;
  default_payment_term_days: number;
  company_name: string | null;
  address_line1: string | null;
  address_line2: string | null;
  postal_code: string | null;
  city: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  iban: string | null;
  payment_instructions: string | null;
  next_invoice_number: number;
  created_at: string;
  updated_at: string;
}
