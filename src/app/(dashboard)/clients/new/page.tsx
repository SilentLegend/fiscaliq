'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/actions/client.actions';
import type { ActionResult } from '@/lib/types/forms';

const initialState: ActionResult = {};

export default function NewClientPage() {
  const [state, formAction, pending] = useActionState(createClient, initialState);

  if (state.data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">Klant toevoegen</h1>
        <div className="card text-center py-12">
          <div
            className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm mb-4 inline-block"
            role="status"
            aria-live="polite"
          >
            {state.data}
          </div>
          <div className="flex gap-3 justify-center mt-4">
            <Link href="/clients" className="btn-primary">
              Terug naar overzicht
            </Link>
            <Link href="/clients/new" className="btn-secondary">
              Nog een toevoegen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/clients"
          className="btn-ghost p-1"
          aria-label="Terug naar klanten"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Nieuwe klant</h1>
      </div>

      <div className="card max-w-2xl">
        <form action={formAction} noValidate>
          {state.error && !state.fieldErrors && (
            <div
              className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm mb-4"
              role="alert"
              aria-live="polite"
            >
              {state.error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="input-label">
              Naam <span className="text-danger-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="input-field"
              placeholder="Bedrijfsnaam of volledige naam"
              aria-invalid={!!state.fieldErrors?.name}
            />
            {state.fieldErrors?.name && (
              <p className="input-error" role="alert">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="input-label">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              className="input-field"
              placeholder="factuur@voorbeeld.nl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address_line1" className="input-label">Adres</label>
              <input id="address_line1" name="address_line1" type="text" className="input-field" placeholder="Straat + huisnummer" />
            </div>
            <div>
              <label htmlFor="address_line2" className="input-label">Adres (regel 2)</label>
              <input id="address_line2" name="address_line2" type="text" className="input-field" placeholder="Toevoeging" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="postal_code" className="input-label">Postcode</label>
              <input id="postal_code" name="postal_code" type="text" className="input-field" placeholder="1234 AB" />
            </div>
            <div className="col-span-2 sm:col-span-2">
              <label htmlFor="city" className="input-label">Plaats</label>
              <input id="city" name="city" type="text" className="input-field" placeholder="Amsterdam" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="kvk_number" className="input-label">KVK-nummer</label>
              <input id="kvk_number" name="kvk_number" type="text" className="input-field" placeholder="12345678" />
            </div>
            <div>
              <label htmlFor="btw_number" className="input-label">BTW-nummer</label>
              <input id="btw_number" name="btw_number" type="text" className="input-field" placeholder="NL00 0000 000 B 00" />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={pending} className="btn-primary">
              {pending ? 'Bezig...' : 'Klant opslaan'}
            </button>
            <Link href="/clients" className="btn-secondary">
              Annuleren
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
