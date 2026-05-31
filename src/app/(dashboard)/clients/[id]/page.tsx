'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { updateClient, deleteClient } from '@/lib/actions/client.actions';
import type { ActionResult } from '@/lib/types/forms';
import type { Client } from '@/lib/types/database';

const initialState: ActionResult = {};

export default function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setClientId(id);
      const supabase = createClient();
      supabase.from('clients').select('*').eq('id', id).single().then(
        ({ data, error }) => {
          if (error || !data) {
            router.push('/clients');
            return;
          }
          setClient(data);
          setLoading(false);
        },
      );
    });
  }, [params, router]);

  const [state, formAction, pending] = useActionState(
    (prev: ActionResult, formData: FormData) => {
      if (!clientId) return { error: 'Geen client ID' };
      return updateClient(clientId, prev, formData);
    },
    initialState,
  );

  const handleDelete = async () => {
    if (!clientId) return;
    if (!confirm('Weet je zeker dat je deze klant wilt verwijderen?')) return;
    const result = await deleteClient(clientId);
    if (result.error) {
      alert(result.error);
    } else {
      router.push('/clients');
    }
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="btn-ghost p-1" aria-label="Terug naar klanten">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="skeleton h-8 w-48 rounded-lg" />
        </div>
        <div className="card max-w-2xl">
          <div className="space-y-4">
            <div className="skeleton h-10 w-full rounded-lg" />
            <div className="skeleton h-10 w-full rounded-lg" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!client) return null;

  if (state.data) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="btn-ghost p-1" aria-label="Terug naar klanten">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900">Klant bewerken</h1>
        </div>
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
        <h1 className="text-2xl font-bold text-neutral-900">
          {client.name} bewerken
        </h1>
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
              defaultValue={client.name}
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
              defaultValue={client.email ?? ''}
              placeholder="factuur@voorbeeld.nl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="address_line1" className="input-label">Adres</label>
              <input id="address_line1" name="address_line1" type="text" className="input-field" defaultValue={client.address_line1 ?? ''} />
            </div>
            <div>
              <label htmlFor="address_line2" className="input-label">Adres (regel 2)</label>
              <input id="address_line2" name="address_line2" type="text" className="input-field" defaultValue={client.address_line2 ?? ''} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="postal_code" className="input-label">Postcode</label>
              <input id="postal_code" name="postal_code" type="text" className="input-field" defaultValue={client.postal_code ?? ''} />
            </div>
            <div className="col-span-2 sm:col-span-2">
              <label htmlFor="city" className="input-label">Plaats</label>
              <input id="city" name="city" type="text" className="input-field" defaultValue={client.city ?? ''} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="kvk_number" className="input-label">KVK-nummer</label>
              <input id="kvk_number" name="kvk_number" type="text" className="input-field" defaultValue={client.kvk_number ?? ''} />
            </div>
            <div>
              <label htmlFor="btw_number" className="input-label">BTW-nummer</label>
              <input id="btw_number" name="btw_number" type="text" className="input-field" defaultValue={client.btw_number ?? ''} />
            </div>
          </div>

          <div className="flex gap-3 justify-between">
            <div className="flex gap-3">
              <button type="submit" disabled={pending} className="btn-primary">
                {pending ? 'Bezig...' : 'Opslaan'}
              </button>
              <Link href="/clients" className="btn-secondary">
                Annuleren
              </Link>
            </div>
            <button type="button" onClick={handleDelete} className="btn-danger">
              Verwijderen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
