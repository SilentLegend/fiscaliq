'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { register } from '@/lib/actions/auth.actions';
import type { ActionResult } from '@/lib/types/forms';

const initialState: ActionResult = {};

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800">Fiscaliq</h1>
          <p className="text-neutral-500 mt-1">Account aanmaken</p>
        </div>

        <div className="card">
          {state.data ? (
            <div className="text-center py-6">
              <div
                className="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg text-sm mb-4"
                role="status"
                aria-live="polite"
              >
                {state.data ?? ''}
              </div>
              <Link href="/login" className="btn-primary inline-block">
                Ga naar inloggen
              </Link>
            </div>
          ) : (
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
                  aria-describedby={
                    state.fieldErrors?.email ? 'email-error' : undefined
                  }
                />
                {state.fieldErrors?.email && (
                  <p id="email-error" className="input-error" role="alert">
                    {state.fieldErrors.email[0]}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="input-label">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                  placeholder="Minimaal 6 tekens"
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

              <div className="mb-6">
                <label htmlFor="confirmPassword" className="input-label">
                  Bevestig wachtwoord
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                  placeholder="Herhaal wachtwoord"
                  aria-invalid={!!state.fieldErrors?.confirmPassword}
                  aria-describedby={
                    state.fieldErrors?.confirmPassword
                      ? 'confirm-error'
                      : undefined
                  }
                />
                {state.fieldErrors?.confirmPassword && (
                  <p
                    id="confirm-error"
                    className="input-error"
                    role="alert"
                  >
                    {state.fieldErrors.confirmPassword[0]}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={pending}
                className="btn-primary w-full"
              >
                {pending ? 'Bezig...' : 'Account aanmaken'}
              </button>

              <p className="text-center text-sm text-neutral-500 mt-6">
                Heb je al een account?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  Inloggen
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
