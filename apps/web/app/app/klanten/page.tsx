'use client';

import { useEffect, useMemo, useState } from 'react';

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

const STORAGE_KEY = 'fiscaliq.customers.v1';

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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<Omit<CustomerRecord, 'id'>>(makeEmptyForm());

  useEffect(() => {
***REMOVED***try {
***REMOVED***  const raw = localStorage.getItem(STORAGE_KEY);
***REMOVED***  if (!raw) return;
***REMOVED***  const parsed = JSON.parse(raw) as CustomerRecord[];
***REMOVED***  if (Array.isArray(parsed)) setCustomers(parsed);
***REMOVED***} catch (err) {
***REMOVED***  console.error('Kon klanten niet laden uit localStorage:', err);
***REMOVED***}
  }, []);

  useEffect(() => {
***REMOVED***try {
***REMOVED***  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
***REMOVED***} catch (err) {
***REMOVED***  console.error('Kon klanten niet opslaan in localStorage:', err);
***REMOVED***}
  }, [customers]);

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

  function handleSave(e: React.FormEvent) {
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

***REMOVED***const customerNumberInUse = customers.some(
***REMOVED***  (c) =>
***REMOVED******REMOVED***c.customerNumber.trim().toLowerCase() === form.customerNumber.trim().toLowerCase() &&
***REMOVED******REMOVED***c.id !== editingId,
***REMOVED***);
***REMOVED***if (customerNumberInUse) {
***REMOVED***  setError('Klantnummer bestaat al. Kies een uniek klantnummer.');
***REMOVED***  return;
***REMOVED***}

***REMOVED***if (editingId) {
***REMOVED***  setCustomers((prev) =>
***REMOVED******REMOVED***prev.map((c) =>
***REMOVED******REMOVED***  c.id === editingId
***REMOVED******REMOVED******REMOVED***? {
***REMOVED******REMOVED******REMOVED******REMOVED***...c,
***REMOVED******REMOVED******REMOVED******REMOVED***...form,
***REMOVED******REMOVED******REMOVED***  }
***REMOVED******REMOVED******REMOVED***: c,
***REMOVED******REMOVED***),
***REMOVED***  );
***REMOVED***} else {
***REMOVED***  setCustomers((prev) => [
***REMOVED******REMOVED***{
***REMOVED******REMOVED***  id: crypto.randomUUID(),
***REMOVED******REMOVED***  ...form,
***REMOVED******REMOVED***},
***REMOVED******REMOVED***...prev,
***REMOVED***  ]);
***REMOVED***}

***REMOVED***setShowForm(false);
***REMOVED***resetForm();
  }

  function handleDelete(id: string) {
***REMOVED***setCustomers((prev) => prev.filter((c) => c.id !== id));
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
***REMOVED******REMOVED******REMOVED***  {filteredCustomers.length === 0 ? (
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
