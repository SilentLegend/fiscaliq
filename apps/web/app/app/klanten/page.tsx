'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

type CustomerStatus = 'actief' | 'inactief';
type DeliveryMethod = 'email' | 'post';

interface CustomerRecord {
  id: string;
  customerNumber: string;
  companyName: string;
  legalForm: string;
  kvkNumber: string;
  vatNumber: string;
  website: string;
  contactName: string;
  email: string;
  phone: string;
  department: string;
  streetAndNumber: string;
  postalCode: string;
  city: string;
  country: string;
  paymentTermDays: string;
  currency: string;
  vatRate: string;
  iban: string;
  deliveryMethod: DeliveryMethod;
  notes: string;
  createdAt: string;
  status: CustomerStatus;
}

interface DbCustomer {
  id: string;
  name: string;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  vat_number: string | null;
  kvk: string | null;
  email: string | null;
  phone: string | null;
  created_at: string | null;
  customer_number: string | null;
  legal_form: string | null;
  website: string | null;
  contact_name: string | null;
  department: string | null;
  country: string | null;
  payment_term_days: number | null;
  currency: string | null;
  vat_rate_preference: string | null;
  iban: string | null;
  delivery_method: DeliveryMethod | null;
  notes: string | null;
  status: CustomerStatus | null;
}

function makeCustomerNumber() {
  return `KL-${Date.now().toString().slice(-6)}`;
}

function makeEmptyForm(): Omit<CustomerRecord, 'id'> {
  return {
***REMOVED***customerNumber: makeCustomerNumber(),
***REMOVED***companyName: '',
***REMOVED***legalForm: '',
***REMOVED***kvkNumber: '',
***REMOVED***vatNumber: '',
***REMOVED***website: '',
***REMOVED***contactName: '',
***REMOVED***email: '',
***REMOVED***phone: '',
***REMOVED***department: '',
***REMOVED***streetAndNumber: '',
***REMOVED***postalCode: '',
***REMOVED***city: '',
***REMOVED***country: 'Nederland',
***REMOVED***paymentTermDays: '30',
***REMOVED***currency: 'EUR',
***REMOVED***vatRate: '21',
***REMOVED***iban: '',
***REMOVED***deliveryMethod: 'email',
***REMOVED***notes: '',
***REMOVED***createdAt: new Date().toISOString().slice(0, 10),
***REMOVED***status: 'actief',
  };
}

export default function KlantenPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<Omit<CustomerRecord, 'id'>>(makeEmptyForm());

  useEffect(() => {
***REMOVED***loadCustomers();
  }, []);

  async function loadCustomers() {
***REMOVED***setLoading(true);
***REMOVED***const { data, error: loadError } = await supabase
***REMOVED***  .from('customers')
***REMOVED***  .select('*')
***REMOVED***  .order('created_at', { ascending: false });

***REMOVED***if (loadError) {
***REMOVED***  setError('Kon klanten niet ophalen uit de database.');
***REMOVED***  setLoading(false);
***REMOVED***  return;
***REMOVED***}

***REMOVED***const rows = (data as DbCustomer[]) ?? [];
***REMOVED***setCustomers(
***REMOVED***  rows.map((row) => ({
***REMOVED******REMOVED***id: row.id,
***REMOVED******REMOVED***customerNumber: row.customer_number ?? '',
***REMOVED******REMOVED***companyName: row.name ?? '',
***REMOVED******REMOVED***legalForm: row.legal_form ?? '',
***REMOVED******REMOVED***kvkNumber: row.kvk ?? '',
***REMOVED******REMOVED***vatNumber: row.vat_number ?? '',
***REMOVED******REMOVED***website: row.website ?? '',
***REMOVED******REMOVED***contactName: row.contact_name ?? '',
***REMOVED******REMOVED***email: row.email ?? '',
***REMOVED******REMOVED***phone: row.phone ?? '',
***REMOVED******REMOVED***department: row.department ?? '',
***REMOVED******REMOVED***streetAndNumber: row.street ?? '',
***REMOVED******REMOVED***postalCode: row.postal_code ?? '',
***REMOVED******REMOVED***city: row.city ?? '',
***REMOVED******REMOVED***country: row.country ?? 'Nederland',
***REMOVED******REMOVED***paymentTermDays: row.payment_term_days ? String(row.payment_term_days) : '30',
***REMOVED******REMOVED***currency: row.currency ?? 'EUR',
***REMOVED******REMOVED***vatRate: row.vat_rate_preference ?? '21',
***REMOVED******REMOVED***iban: row.iban ?? '',
***REMOVED******REMOVED***deliveryMethod: row.delivery_method ?? 'email',
***REMOVED******REMOVED***notes: row.notes ?? '',
***REMOVED******REMOVED***createdAt: row.created_at ? row.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
***REMOVED******REMOVED***status: row.status ?? 'actief',
***REMOVED***  })),
***REMOVED***);
***REMOVED***setLoading(false);
  }

  const filteredCustomers = useMemo(() => {
***REMOVED***const q = query.trim().toLowerCase();
***REMOVED***if (!q) return customers;
***REMOVED***return customers.filter((c) =>
***REMOVED***  [c.companyName, c.contactName, c.customerNumber, c.city, c.email, c.kvkNumber]
***REMOVED******REMOVED***.join(' ')
***REMOVED******REMOVED***.toLowerCase()
***REMOVED******REMOVED***.includes(q),
***REMOVED***);
  }, [customers, query]);

  function resetForm() {
***REMOVED***setEditingId(null);
***REMOVED***setForm(makeEmptyForm());
  }

  function openCreate() {
***REMOVED***resetForm();
***REMOVED***setError(null);
***REMOVED***setShowForm(true);
  }

  function startEdit(customer: CustomerRecord) {
***REMOVED***const { id, ...rest } = customer;
***REMOVED***setEditingId(id);
***REMOVED***setForm(rest);
***REMOVED***setError(null);
***REMOVED***setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
***REMOVED***e.preventDefault();
***REMOVED***setError(null);

***REMOVED***if (!form.companyName.trim()) {
***REMOVED***  setError('Bedrijfsnaam is verplicht.');
***REMOVED***  return;
***REMOVED***}
***REMOVED***if (!form.contactName.trim()) {
***REMOVED***  setError('Contactpersoon is verplicht.');
***REMOVED***  return;
***REMOVED***}
***REMOVED***if (!form.email.trim()) {
***REMOVED***  setError('E-mailadres is verplicht.');
***REMOVED***  return;
***REMOVED***}

***REMOVED***const customerNumberValue = form.customerNumber.trim().toLowerCase();
***REMOVED***const customerNumberInUse =
***REMOVED***  customerNumberValue.length > 0 &&
***REMOVED***  customers.some(
***REMOVED******REMOVED***(c) =>
***REMOVED******REMOVED***  c.customerNumber.trim().toLowerCase() === customerNumberValue && c.id !== editingId,
***REMOVED***  );
***REMOVED***if (customerNumberInUse) {
***REMOVED***  setError('Klantnummer bestaat al. Kies een uniek klantnummer.');
***REMOVED***  return;
***REMOVED***}

***REMOVED***const payload = {
***REMOVED***  customer_number: form.customerNumber || null,
***REMOVED***  name: form.companyName,
***REMOVED***  legal_form: form.legalForm || null,
***REMOVED***  kvk: form.kvkNumber || null,
***REMOVED***  vat_number: form.vatNumber || null,
***REMOVED***  website: form.website || null,
***REMOVED***  contact_name: form.contactName || null,
***REMOVED***  email: form.email || null,
***REMOVED***  phone: form.phone || null,
***REMOVED***  department: form.department || null,
***REMOVED***  street: form.streetAndNumber || null,
***REMOVED***  postal_code: form.postalCode || null,
***REMOVED***  city: form.city || null,
***REMOVED***  country: form.country || null,
***REMOVED***  payment_term_days: Number(form.paymentTermDays) || 30,
***REMOVED***  currency: form.currency || 'EUR',
***REMOVED***  vat_rate_preference: form.vatRate || '21',
***REMOVED***  iban: form.iban || null,
***REMOVED***  delivery_method: form.deliveryMethod,
***REMOVED***  notes: form.notes || null,
***REMOVED***  status: form.status,
***REMOVED***  created_at: form.createdAt || new Date().toISOString().slice(0, 10),
***REMOVED***  updated_at: new Date().toISOString(),
***REMOVED***};

***REMOVED***if (editingId) {
***REMOVED***  const { error: updateError } = await supabase
***REMOVED******REMOVED***.from('customers')
***REMOVED******REMOVED***.update(payload)
***REMOVED******REMOVED***.eq('id', editingId);
***REMOVED***  if (updateError) {
***REMOVED******REMOVED***setError('Kon klant niet bijwerken in de database.');
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***} else {
***REMOVED***  const { error: insertError } = await supabase.from('customers').insert(payload);
***REMOVED***  if (insertError) {
***REMOVED******REMOVED***setError(
***REMOVED******REMOVED***  insertError.message.includes('customers_user_customer_number_uidx')
***REMOVED******REMOVED******REMOVED***? 'Klantnummer bestaat al in de database.'
***REMOVED******REMOVED******REMOVED***: 'Kon klant niet opslaan in de database.',
***REMOVED******REMOVED***);
***REMOVED******REMOVED***return;
***REMOVED***  }
***REMOVED***}

***REMOVED***await loadCustomers();
***REMOVED***setShowForm(false);
***REMOVED***resetForm();
  }

  async function handleDelete(id: string) {
***REMOVED***const { error: deleteError } = await supabase.from('customers').delete().eq('id', id);
***REMOVED***if (deleteError) {
***REMOVED***  setError('Kon klant niet verwijderen.');
***REMOVED***  return;
***REMOVED***}
***REMOVED***await loadCustomers();
  }

  return (
***REMOVED***<div className="space-y-6">
***REMOVED***  <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
***REMOVED******REMOVED***<div>
***REMOVED******REMOVED***  <h1 className="text-lg font-semibold tracking-tight text-text">Klanten</h1>
***REMOVED******REMOVED***  <p className="mt-1 text-sm text-muted">
***REMOVED******REMOVED******REMOVED***Beheer alle facturatiegegevens per klant op één plek.
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<button
***REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED***  onClick={openCreate}
***REMOVED******REMOVED***  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
***REMOVED******REMOVED***>
***REMOVED******REMOVED***  Nieuwe klant
***REMOVED******REMOVED***</button>
***REMOVED***  </header>

***REMOVED***  <section className="rounded-2xl border border-border bg-surface p-4">
***REMOVED******REMOVED***<div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
***REMOVED******REMOVED***  <input
***REMOVED******REMOVED******REMOVED***type="text"
***REMOVED******REMOVED******REMOVED***value={query}
***REMOVED******REMOVED******REMOVED***onChange={(e) => setQuery(e.target.value)}
***REMOVED******REMOVED******REMOVED***placeholder="Zoek op bedrijfsnaam, contactpersoon, klantnummer..."
***REMOVED******REMOVED******REMOVED***className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs outline-none transition focus:border-primary md:max-w-md"
***REMOVED******REMOVED***  />
***REMOVED******REMOVED***  <div className="text-xs text-muted">
***REMOVED******REMOVED******REMOVED***{filteredCustomers.length} van {customers.length} klanten
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>

***REMOVED******REMOVED***<div className="overflow-hidden rounded-2xl border border-border">
***REMOVED******REMOVED***  <table className="min-w-full text-left text-sm">
***REMOVED******REMOVED******REMOVED***<thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
***REMOVED******REMOVED******REMOVED***  <tr>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Klant</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Klantnummer</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Contact</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Plaats</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3">Status</th>
***REMOVED******REMOVED******REMOVED******REMOVED***<th className="px-4 py-3 text-right">Acties</th>
***REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED***</thead>
***REMOVED******REMOVED******REMOVED***<tbody>
***REMOVED******REMOVED******REMOVED***  {loading ? (
***REMOVED******REMOVED******REMOVED******REMOVED***<tr>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-6 text-center text-xs text-muted" colSpan={6}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Klanten laden...
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED******REMOVED***  ) : filteredCustomers.length === 0 ? (
***REMOVED******REMOVED******REMOVED******REMOVED***<tr>
***REMOVED******REMOVED******REMOVED******REMOVED***  <td className="px-4 py-6 text-center text-xs text-muted" colSpan={6}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Nog geen klanten. Voeg je eerste klant toe.
***REMOVED******REMOVED******REMOVED******REMOVED***  </td>
***REMOVED******REMOVED******REMOVED******REMOVED***</tr>
***REMOVED******REMOVED******REMOVED***  ) : (
***REMOVED******REMOVED******REMOVED******REMOVED***filteredCustomers.map((customer) => (
***REMOVED******REMOVED******REMOVED******REMOVED***  <tr key={customer.id} className="border-t border-border/60 align-top">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="font-medium text-text">{customer.companyName}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div className="mt-0.5 text-muted">{customer.legalForm || '—'}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-xs font-mono text-text">{customer.customerNumber}</td>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-xs text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>{customer.contactName}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <div>{customer.email}</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-xs text-muted">{customer.city || '—'}</td>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <span className="inline-flex rounded-full bg-surface-offset px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{customer.status}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<td className="px-4 py-3 text-right text-xs">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => startEdit(customer)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="mr-2 rounded-full border border-border px-3 py-1.5 text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Bewerken
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => handleDelete(customer.id)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="rounded-full border border-rose-200 px-3 py-1.5 text-rose-700 hover:bg-rose-50"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Verwijderen
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</td>
***REMOVED******REMOVED******REMOVED******REMOVED***  </tr>
***REMOVED******REMOVED******REMOVED******REMOVED***))
***REMOVED******REMOVED******REMOVED***  )}
***REMOVED******REMOVED******REMOVED***</tbody>
***REMOVED******REMOVED***  </table>
***REMOVED******REMOVED***</div>
***REMOVED***  </section>

***REMOVED***  {showForm && (
***REMOVED******REMOVED***<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4 py-6">
***REMOVED******REMOVED***  <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[1.8rem] border border-border bg-surface p-6 shadow-soft">
***REMOVED******REMOVED******REMOVED***<div className="mb-4 flex items-center justify-between">
***REMOVED******REMOVED******REMOVED***  <div>
***REMOVED******REMOVED******REMOVED******REMOVED***<h2 className="text-sm font-semibold text-text">
***REMOVED******REMOVED******REMOVED******REMOVED***  {editingId ? 'Klant bewerken' : 'Nieuwe klant'}
***REMOVED******REMOVED******REMOVED******REMOVED***</h2>
***REMOVED******REMOVED******REMOVED******REMOVED***<p className="text-xs text-muted">Vul alle facturatiegegevens van de klant in.</p>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***  <button
***REMOVED******REMOVED******REMOVED******REMOVED***type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***onClick={() => {
***REMOVED******REMOVED******REMOVED******REMOVED***  setShowForm(false);
***REMOVED******REMOVED******REMOVED******REMOVED***  resetForm();
***REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border text-[11px] text-muted hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED***  >
***REMOVED******REMOVED******REMOVED******REMOVED***✕
***REMOVED******REMOVED******REMOVED***  </button>
***REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED***{error && (
***REMOVED******REMOVED******REMOVED***  <div className="mb-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
***REMOVED******REMOVED******REMOVED******REMOVED***{error}
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***)}

***REMOVED******REMOVED******REMOVED***<form onSubmit={handleSave} className="space-y-4 text-sm">
***REMOVED******REMOVED******REMOVED***  <div className="rounded-2xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Bedrijfsgegevens
***REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Bedrijfsnaam" required>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.companyName}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Rechtsvorm">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.legalForm}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, legalForm: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  placeholder="Bijv. BV, VOF, Eenmanszaak"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="KVK-nummer">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.kvkNumber}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, kvkNumber: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="BTW-nummer">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.vatNumber}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, vatNumber: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Website">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.website}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="rounded-2xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Contactgegevens
***REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Voornaam + achternaam contactpersoon" required>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.contactName}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="E-mailadres" required>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="email"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  required
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.email}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Telefoonnummer">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.phone}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Afdeling / functietitel">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.department}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="rounded-2xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Factuuradres
***REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Straat + huisnummer">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.streetAndNumber}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, streetAndNumber: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Postcode">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.postalCode}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Stad">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.city}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Land">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.country}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="rounded-2xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Factuurinstellingen
***REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Standaard betaaltermijn">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.paymentTermDays}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, paymentTermDays: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="14">14 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="30">30 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="60">60 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="90">90 dagen</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Factuurvaluta">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.currency}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="EUR">EUR (€)</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="USD">USD ($)</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="GBP">GBP (£)</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="BTW-tarief">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.vatRate}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, vatRate: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="21">21%</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="9">9%</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="0">0%</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="vrijgesteld">Vrijgesteld</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="IBAN / bankrekeningnummer">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.iban}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, iban: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Factuur verzenden via">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.deliveryMethod}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) =>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setForm((f) => ({ ...f, deliveryMethod: e.target.value as DeliveryMethod }))
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="email">E-mail</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="post">Post</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="rounded-2xl border border-border bg-bg p-4">
***REMOVED******REMOVED******REMOVED******REMOVED***<h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
***REMOVED******REMOVED******REMOVED******REMOVED***  Overige velden
***REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED***<div className="grid gap-4 md:grid-cols-2">
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Klantnummer (uniek ID)">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="text"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.customerNumber}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, customerNumber: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs font-mono"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Aanmaakdatum klant">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<input
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  type="date"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.createdAt}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, createdAt: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Status">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<select
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.status}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) =>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setForm((f) => ({ ...f, status: e.target.value as CustomerStatus }))
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  }
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="h-9 w-full rounded-2xl border border-border bg-bg px-3 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="actief">Actief</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  <option value="inactief">Inactief</option>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</select>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***  <Field label="Notities / opmerkingen">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<textarea
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  value={form.notes}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  rows={3}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***  className="w-full rounded-2xl border border-border bg-bg px-3 py-2 text-xs"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***  </Field>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***  </div>

***REMOVED******REMOVED******REMOVED***  <div className="mt-2 flex items-center justify-end gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="button"
***REMOVED******REMOVED******REMOVED******REMOVED***  onClick={() => {
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setShowForm(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***resetForm();
***REMOVED******REMOVED******REMOVED******REMOVED***  }}
***REMOVED******REMOVED******REMOVED******REMOVED***  className="rounded-full border border-border px-4 py-2 text-xs font-medium text-text hover:bg-surface-offset"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  Annuleren
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED***  type="submit"
***REMOVED******REMOVED******REMOVED******REMOVED***  className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:bg-primaryDark"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED***  {editingId ? 'Wijzigingen opslaan' : 'Klant opslaan'}
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED***  </div>
***REMOVED******REMOVED******REMOVED***</form>
***REMOVED******REMOVED***  </div>
***REMOVED******REMOVED***</div>
***REMOVED***  )}
***REMOVED***</div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
***REMOVED***<label className="block">
***REMOVED***  <span className="mb-1 block text-xs font-medium text-text">
***REMOVED******REMOVED***{label}
***REMOVED******REMOVED***{required ? ' *' : ''}
***REMOVED***  </span>
***REMOVED***  {children}
***REMOVED***</label>
  );
}
