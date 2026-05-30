import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDashboardStats, getInvoices } from '@/lib/queries/invoices.queries';
import { formatCurrency, formatDate, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '@/lib/constants';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const stats = await getDashboardStats(user.id);
  const recentInvoices = (await getInvoices(user.id)).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Welkom bij Fiscaliq
        </h1>
        <p className="text-neutral-500 mt-1">
          Overzicht van je facturen
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="text-sm text-neutral-500 mb-1">Totaal facturen</p>
          <p className="text-2xl font-bold text-neutral-900">{stats.totalInvoices}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500 mb-1">Openstaand bedrag</p>
          <p className="text-2xl font-bold text-warning-600">
            {formatCurrency(stats.totalOutstanding)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500 mb-1">Betaald</p>
          <p className="text-2xl font-bold text-success-600">
            {formatCurrency(stats.totalPaid)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-500 mb-1">Concepten</p>
          <p className="text-2xl font-bold text-neutral-900">{stats.draftCount}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 mb-8">
        <Link href="/invoices/new" className="btn-primary">
          Nieuwe factuur
        </Link>
        <Link href="/clients/new" className="btn-secondary">
          Nieuwe klant
        </Link>
        <Link href="/invoices?status=overdue" className="btn-secondary">
          Bekijk openstaand
        </Link>
      </div>

      {/* Recent invoices */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-neutral-800">Recente facturen</h2>
          <Link href="/invoices" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Bekijk alle
          </Link>
        </div>

        {recentInvoices.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-500 mb-4">Nog geen facturen</p>
            <Link href="/invoices/new" className="btn-primary">
              Maak je eerste factuur
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="table-header" scope="col">Factuur</th>
                  <th className="table-header hidden sm:table-cell" scope="col">Klant</th>
                  <th className="table-header hidden md:table-cell" scope="col">Datum</th>
                  <th className="table-header" scope="col">Status</th>
                  <th className="table-header text-right" scope="col">Totaal</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="table-cell">
                      <Link href={`/invoices/${invoice.id}`} className="text-primary-600 hover:text-primary-700">
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
                      <span className={`badge ${INVOICE_STATUS_COLORS[invoice.status] || 'badge-draft'}`}>
                        {INVOICE_STATUS_LABELS[invoice.status] || invoice.status}
                      </span>
                    </td>
                    <td className="table-cell text-right font-mono">
                      {formatCurrency(invoice.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
