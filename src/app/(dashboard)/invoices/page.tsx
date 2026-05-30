import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getInvoices } from '@/lib/queries/invoices.queries';
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS, formatCurrency, formatDate } from '@/lib/constants';
import type { InvoiceStatus } from '@/lib/types/database';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const params = await searchParams;
  const filters = {
    status: (params.status as InvoiceStatus) || undefined,
    search: params.search || undefined,
  };

  const invoices = await getInvoices(user.id, filters);

  const statuses: (InvoiceStatus | 'all')[] = ['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Facturen</h1>
        <Link href="/invoices/new" className="btn-primary">
          Nieuwe factuur
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto" role="tablist" aria-label="Factuur status filter">
        {statuses.map((status) => {
          const href = status === 'all' ? '/invoices' : `/invoices?status=${status}`;
          const isActive = status === 'all'
            ? !params.status
            : params.status === status;

          return (
            <Link
              key={status}
              href={href}
              role="tab"
              aria-selected={isActive}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {status === 'all' ? 'Alle' : INVOICE_STATUS_LABELS[status]}
            </Link>
          );
        })}
      </div>

      {invoices.length === 0 ? (
        <div className="card text-center py-12">
          <svg
            className="mx-auto w-12 h-12 text-neutral-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-neutral-700 mb-2">
            Nog geen facturen
          </h2>
          <p className="text-neutral-500 mb-6">
            Maak je eerste factuur om te beginnen.
          </p>
          <Link href="/invoices/new" className="btn-primary">
            Eerste factuur maken
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="table-header" scope="col">Factuur</th>
                  <th className="table-header hidden sm:table-cell" scope="col">Klant</th>
                  <th className="table-header hidden md:table-cell" scope="col">Datum</th>
                  <th className="table-header" scope="col">Status</th>
                  <th className="table-header text-right" scope="col">Totaal</th>
                  <th className="table-header" scope="col">
                    <span className="sr-only">Acties</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="table-cell font-medium">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {invoice.invoice_number}
                      </Link>
                    </td>
                    <td className="table-cell hidden sm:table-cell text-neutral-500">
                      {invoice.client_name || '-'}
                    </td>
                    <td className="table-cell hidden md:table-cell text-neutral-500">
                      {formatDate(invoice.invoice_date)}
                    </td>
                    <td className="table-cell">
                      <span
                        className={`badge ${INVOICE_STATUS_COLORS[invoice.status] || 'badge-draft'}`}
                      >
                        {INVOICE_STATUS_LABELS[invoice.status] || invoice.status}
                      </span>
                    </td>
                    <td className="table-cell text-right font-mono font-medium">
                      {formatCurrency(invoice.total)}
                    </td>
                    <td className="table-cell text-right">
                      <Link
                        href={`/invoices/${invoice.id}/pdf`}
                        className="btn-ghost text-sm"
                        target="_blank"
                      >
                        PDF
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
