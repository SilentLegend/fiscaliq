'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { login, loginWithMagicLink } from '@/lib/actions/auth.actions';
import type { ActionResult } from '@/lib/types/forms';

const initialState: ActionResult = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [magicState, magicAction, magicPending] = useActionState(
    loginWithMagicLink,
    initialState,
  );

  const ActionForm = useMagicLink
    ? LoginWithMagicLinkForm
    : LoginWithPasswordForm;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800">Fiscaliq</h1>
          <p className="text-neutral-500 mt-1">Fiscaal boekhouden voor ZZP&apos;ers</p>
        </div>

        <div className="card">
          {/* Toggle */}
          <div className="flex mb-6 border border-neutral-200 rounded-lg overflow-hidden" role="tablist" aria-label="Inlogmethode">
            <button
              type="button"
              role="tab"
              aria-selected={!useMagicLink}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                !useMagicLink
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={() => setUseMagicLink(false)}
            >
              Wachtwoord
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={useMagicLink}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                useMagicLink
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={() => setUseMagicLink(true)}
            >
              Magic Link
            </button>
          </div>

          <ActionForm
            state={useMagicLink ? magicState : state}
            formAction={useMagicLink ? magicAction : formAction}
            pending={useMagicLink ? magicPending : pending}
          />

          <p className="text-center text-sm text-neutral-500 mt-6">
            Nog geen account?{' '}
            <Link
              href="/register"
              className="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Registreer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginWithPasswordForm({
  state,
  formAction,
  pending,
}: {
  state: ActionResult;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  return (
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
        <label htmlFor="email" className="input-label">
          E-mailadres
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input-field"
          placeholder="jan@voorbeeld.nl"
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby={state.fieldErrors?.email ? 'email-error' : undefined}
        />
        {state.fieldErrors?.email && (
          <p id="email-error" className="input-error" role="alert">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="input-label">
          Wachtwoord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="input-field"
          placeholder="••••••••"
          aria-invalid={!!state.fieldErrors?.password}
          aria-describedby={
            state.fieldErrors?.password ? 'password-error' : undefined
          }
        />
        {state.fieldErrors?.password && (
          <p id="password-error" className="input-error" role="alert">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Bezig met inloggen...' : 'Inloggen'}
      </button>
    </form>
  );
}

function LoginWithMagicLinkForm({
  state,
  formAction,
  pending,
}: {
  state: ActionResult;
  formAction: (payload: FormData) => void;
  pending: boolean;
}) {
  return (
    <form action={formAction} noValidate>
      {state.error && (
        <div
          className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm mb-4"
          role="alert"
          aria-live="polite"
        >
          {state.error}
        </div>
      )}

      {state.data && (
        <div
          className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm mb-4"
          role="status"
          aria-live="polite"
        >
              {state.data ?? ''}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="magic-email" className="input-label">
          E-mailadres
        </label>
        <input
          id="magic-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input-field"
          placeholder="jan@voorbeeld.nl"
          aria-invalid={!!state.fieldErrors?.email}
          aria-describedby={state.fieldErrors?.email ? 'magic-email-error' : undefined}
        />
        {state.fieldErrors?.email && (
          <p id="magic-email-error" className="input-error" role="alert">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? 'Versturen...' : 'Verstuur magic link'}
      </button>
    </form>
  );
}
