import { z } from 'zod';

// ─── Action result type ─────────────────────────────────────────────────────
export type ActionResult = {
  data?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

// ─── Client forms ───────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  name: z.string().min(1, 'Naam is verplicht').max(200),
  email: z.string().email('Ongeldig e-mailadres').optional().or(z.literal('')),
  address_line1: z.string().max(200).optional().or(z.literal('')),
  address_line2: z.string().max(200).optional().or(z.literal('')),
  postal_code: z.string().max(20).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  kvk_number: z.string().max(50).optional().or(z.literal('')),
  btw_number: z.string().max(50).optional().or(z.literal('')),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema;
export type UpdateClientInput = CreateClientInput;

// ─── Invoice forms ──────────────────────────────────────────────────────────

export const lineItemSchema = z.object({
  description: z
    .string()
    .min(1, 'Omschrijving is verplicht')
    .max(500, 'Omschrijving mag maximaal 500 tekens bevatten'),
  quantity: z.coerce
    .number()
    .positive('Aantal moet positief zijn')
    .default(1),
  unit_price: z.coerce
    .number()
    .min(0, 'Prijs mag niet negatief zijn'),
  vat_percentage: z.coerce
    .number()
    .min(0)
    .max(100)
    .default(21),
});

export const createInvoiceSchema = z.object({
  client_id: z.string().min(1, 'Klant is verplicht'),
  invoice_date: z.string().min(1, 'Factuurdatum is verplicht'),
  due_date: z.string().min(1, 'Vervaldatum is verplicht'),
  status: z
    .enum(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
    .default('draft'),
  notes: z.string().max(2000).optional().or(z.literal('')),
  payment_instructions: z.string().max(2000).optional().or(z.literal('')),
  line_items: z
    .array(lineItemSchema)
    .min(1, 'Minstens één factuurregel is verplicht'),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;

export const updateInvoiceSchema = createInvoiceSchema.extend({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

// ─── Settings forms ─────────────────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  default_vat_percentage: z.coerce.number().min(0).max(100),
  default_payment_term_days: z.coerce.number().int().min(1).max(365),
  company_name: z.string().max(200).optional().or(z.literal('')),
  address_line1: z.string().max(200).optional().or(z.literal('')),
  address_line2: z.string().max(200).optional().or(z.literal('')),
  postal_code: z.string().max(20).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  kvk_number: z.string().max(50).optional().or(z.literal('')),
  btw_number: z.string().max(50).optional().or(z.literal('')),
  iban: z.string().max(50).optional().or(z.literal('')),
  payment_instructions: z.string().max(2000).optional().or(z.literal('')),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

// ─── Auth forms ─────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
  password: z
    .string()
    .min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
});

export const registerSchema = z
  .object({
    email: z.string().email('Ongeldig e-mailadres'),
    password: z
      .string()
      .min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
    confirmPassword: z
      .string()
      .min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'Wachtwoorden komen niet overeen',
      path: ['confirmPassword'],
    },
  );

export const magicLinkSchema = z.object({
  email: z.string().email('Ongeldig e-mailadres'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
