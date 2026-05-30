'use client';

import { useActionState } from 'react';
import { updateSettings } from '@/lib/actions/settings.actions';
import type { ActionResult } from '@/lib/types/forms';
import type { InvoiceSettings } from '@/lib/types/database';

const initialState: ActionResult = {};

export function SettingsForm({
  settings,
}: {
  settings: InvoiceSettings | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateSettings,
    initialState,
  );

  return (
    <form action={formAction} noValidate>
      {state.data && (
        <div
          className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm mb-4"
          role="status"
          aria-live="polite"
        >
          {state.data}
        </div>
      )}

      {state.error && (
        <div
          className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm mb-4"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="company_name" className="input-label">Bedrijfsnaam</label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            className="input-field"
            defaultValue={settings?.company_name ?? ''}
            placeholder="Janssen Administraties"
          />
        </div>
        <div>
          <label htmlFor="iban" className="input-label">IBAN</label>
          <input
            id="iban"
            name="iban"
            type="text"
            className="input-field"
            defaultValue={settings?.iban ?? ''}
            placeholder="NL00 INGB 0000 0000 00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="default_vat_percentage" className="input-label">
            Standaard BTW-tarief (%)
          </label>
          <select
            id="default_vat_percentage"
            name="default_vat_percentage"
            className="input-field"
            defaultValue={settings?.default_vat_percentage ?? 21}
          >
            <option value="0">0%</option>
            <option value="9">9%</option>
            <option value="21">21%</option>
          </select>
        </div>
        <div>
          <label htmlFor="default_payment_term_days" className="input-label">
            Betalingstermijn (dagen)
          </label>
          <select
            id="default_payment_term_days"
            name="default_payment_term_days"
            className="input-field"
            defaultValue={settings?.default_payment_term_days ?? 30}
          >
            <option value="14">14 dagen</option>
            <option value="30">30 dagen</option>
            <option value="60">60 dagen</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="address_line1" className="input-label">Adres</label>
        <input
          id="address_line1"
          name="address_line1"
          type="text"
          className="input-field"
          defaultValue={settings?.address_line1 ?? ''}
          placeholder="Straat + huisnummer"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="postal_code" className="input-label">Postcode</label>
          <input
            id="postal_code"
            name="postal_code"
            type="text"
            className="input-field"
            defaultValue={settings?.postal_code ?? ''}
            placeholder="1234 AB"
          />
        </div>
        <div className="col-span-2">
          <label htmlFor="city" className="input-label">Plaats</label>
          <input
            id="city"
            name="city"
            type="text"
            className="input-field"
            defaultValue={settings?.city ?? ''}
            placeholder="Amsterdam"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="kvk_number" className="input-label">KVK-nummer</label>
          <input
            id="kvk_number"
            name="kvk_number"
            type="text"
            className="input-field"
            defaultValue={settings?.kvk_number ?? ''}
            placeholder="12345678"
          />
        </div>
        <div>
          <label htmlFor="btw_number" className="input-label">BTW-nummer</label>
          <input
            id="btw_number"
            name="btw_number"
            type="text"
            className="input-field"
            defaultValue={settings?.btw_number ?? ''}
            placeholder="NL00 0000 000 B 00"
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="payment_instructions" className="input-label">
          Betaalinstructies
        </label>
        <textarea
          id="payment_instructions"
          name="payment_instructions"
          className="input-field"
          rows={3}
          defaultValue={settings?.payment_instructions ?? ''}
          placeholder="Gelieve het bedrag binnen 30 dagen over te maken..."
        />
        <p className="text-xs text-neutral-400 mt-1">
          Deze tekst verschijnt onderaan elke factuur.
        </p>
      </div>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? 'Bezig...' : 'Instellingen opslaan'}
      </button>
    </form>
  );
}
