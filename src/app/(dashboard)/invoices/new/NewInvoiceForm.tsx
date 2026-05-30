'use client';

import { useActionState, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createInvoice } from '@/lib/actions/invoice.actions';
import { formatCurrency, DEFAULT_VAT_PERCENTAGE } from '@/lib/constants';
import type { ActionResult } from '@/lib/types/forms';
import type { Client } from '@/lib/types/database';

const initialState: ActionResult = {};

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatPercentage: number;
}

export function NewInvoiceForm({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createInvoice, initialState);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, vatPercentage: DEFAULT_VAT_PERCENTAGE },
  ]);
  const [dueDateDefault] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (state.data && typeof state.data === 'string' && state.data.length > 10) {
      router.push(`/invoices/${state.data}`);
    }
  }, [state.data, router]);

  const addLineItem = useCallback(() => {
    setLineItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatPercentage: DEFAULT_VAT_PERCENTAGE,
      },
    ]);
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setLineItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const updateLineItem = useCallback(
    (id: string, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
      setLineItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      );
    },
    [],
  );

  // Calculate totals
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const vatTotal = lineItems.reduce(
    (sum, item) =>
      sum + item.quantity * item.unitPrice * (item.vatPercentage / 100),
    0,
  );
  const total = subtotal + vatTotal;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/invoices"
          className="btn-ghost p-1"
          aria-label="Terug naar facturen"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          Nieuwe factuur
        </h1>
      </div>

      <form action={formAction} className="space-y-6 max-w-4xl" noValidate>
        {state.error && (
          <div
            className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm"
            role="alert"
            aria-live="polite"
          >
            {state.error}
          </div>
        )}

        {/* Client + Dates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="client_id" className="input-label">
              Klant <span className="text-danger-500">*</span>
            </label>
            {clients.length > 0 ? (
              <select
                id="client_id"
                name="client_id"
                required
                className="input-field"
                defaultValue=""
              >
                <option value="" disabled>Selecteer een klant...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}{client.city ? ` (${client.city})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-neutral-500 py-2">
                Nog geen klanten.{' '}
                <Link href="/clients/new" className="text-primary-600 underline">
                  Maak er een aan
                </Link>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="invoice_date" className="input-label">
              Factuurdatum <span className="text-danger-500">*</span>
            </label>
            <input
              id="invoice_date"
              name="invoice_date"
              type="date"
              required
              className="input-field"
              defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label htmlFor="due_date" className="input-label">
              Vervaldatum <span className="text-danger-500">*</span>
            </label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              required
              className="input-field"
              defaultValue={dueDateDefault}
            />
          </div>
        </div>

        {/* Line items table */}
        <div className="card p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
            <h2 className="font-semibold text-neutral-800">Factuurregels</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="table-header w-2/5" scope="col">Omschrijving</th>
                  <th className="table-header w-[80px]" scope="col">Aantal</th>
                  <th className="table-header w-[120px]" scope="col">Prijs/stuk</th>
                  <th className="table-header w-[80px]" scope="col">BTW%</th>
                  <th className="table-header text-right w-[120px]" scope="col">Regeltotaal</th>
                  <th className="table-header w-[40px]" scope="col">
                    <span className="sr-only">Verwijder</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => {
                  const lineTotal = item.quantity * item.unitPrice * (1 + item.vatPercentage / 100);
                  return (
                    <tr key={item.id} className="border-b border-neutral-100">
                      <td className="table-cell">
                        <input
                          name="line_description"
                          type="text"
                          className="input-field text-sm"
                          placeholder="Omschrijving"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(item.id, 'description', e.target.value)
                          }
                          required
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          name="line_quantity"
                          type="number"
                          className="input-field text-sm w-full"
                          min="0.01"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(item.id, 'quantity', Number(e.target.value))
                          }
                          required
                        />
                      </td>
                      <td className="table-cell">
                        <input
                          name="line_unit_price"
                          type="number"
                          className="input-field text-sm w-full"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateLineItem(item.id, 'unitPrice', Number(e.target.value))
                          }
                          required
                        />
                      </td>
                      <td className="table-cell">
                        <select
                          name="line_vat_percentage"
                          className="input-field text-sm"
                          value={item.vatPercentage}
                          onChange={(e) =>
                            updateLineItem(item.id, 'vatPercentage', Number(e.target.value))
                          }
                        >
                          <option value="0">0%</option>
                          <option value="9">9%</option>
                          <option value="21">21%</option>
                        </select>
                      </td>
                      <td className="table-cell text-right font-mono text-sm">
                        {lineTotal > 0 ? formatCurrency(lineTotal) : '€ 0,00'}
                      </td>
                      <td className="table-cell">
                        <button
                          type="button"
                          onClick={() => removeLineItem(item.id)}
                          className="btn-ghost p-1 text-danger-500"
                          aria-label="Regel verwijderen"
                          disabled={lineItems.length <= 1}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={addLineItem}
              className="btn-ghost text-primary-600"
            >
              + Regel toevoegen
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="card ml-auto max-w-xs">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotaal (excl. BTW)</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">BTW totaal</span>
              <span className="font-mono">{formatCurrency(vatTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-neutral-200 pt-2">
              <span>Totaal</span>
              <span className="font-mono">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notes + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="notes" className="input-label">Notities</label>
            <textarea
              id="notes"
              name="notes"
              className="input-field"
              rows={3}
              placeholder="Optionele notities..."
            />
          </div>
          <div>
            <label htmlFor="payment_instructions" className="input-label">Betaalinstructies</label>
            <textarea
              id="payment_instructions"
              name="payment_instructions"
              className="input-field"
              rows={3}
              placeholder="Gelieve het bedrag over te maken op..."
            />
          </div>
        </div>

        <input type="hidden" name="status" value="draft" />

        <div className="flex gap-3">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? 'Bezig...' : 'Concept opslaan'}
          </button>
          <Link href="/invoices" className="btn-secondary">
            Annuleren
          </Link>
        </div>
      </form>
    </div>
  );
}
