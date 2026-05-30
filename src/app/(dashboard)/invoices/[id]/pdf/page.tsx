import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getInvoiceById } from '@/lib/queries/invoices.queries';
import {
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  formatCurrency,
  formatDate,
} from '@/lib/constants';

export default async function InvoicePdfPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { id } = await params;
  const invoice = await getInvoiceById(id, user.id);

  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-neutral-100 print:bg-white">
      {/* Toolbar - hidden when printing */}
      <div className="no-print bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/invoices/${invoice.id}`}
            className="btn-ghost"
          >
            ← Terug
          </Link>
          <span className="font-semibold">{invoice.invoice_number}</span>
          <span
            className={`badge ${INVOICE_STATUS_COLORS[invoice.status] || 'badge-draft'}`}
          >
            {INVOICE_STATUS_LABELS[invoice.status] || invoice.status}
          </span>
        </div>
        <div className="flex gap-2">
          <a
            href={`/api/pdf/${invoice.id}`}
            className="btn-primary"
            download={`factuur-${invoice.invoice_number}.pdf`}
          >
            Download PDF
          </a>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            Printen
          </button>
        </div>
      </div>

      {/* Invoice preview (printable) */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-card my-8 p-10 print:shadow-none print:my-0 print:p-10 print-area">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">FACTUUR</h1>
            <p className="text-sm text-neutral-500 mt-1">
              {invoice.invoice_number}
            </p>
          </div>
          <div className="text-right text-sm">
            {/* Company info would come from settings */}
          </div>
        </div>

        {/* Client */}
        <div className="mb-6">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Factuur aan
          </p>
          <p className="font-bold text-base">
            {invoice.client?.name ?? invoice.client_name}
          </p>
          {invoice.client?.address_line1 && (
            <p className="text-sm text-neutral-600">{invoice.client.address_line1}</p>
          )}
          {invoice.client?.postal_code && invoice.client?.city && (
            <p className="text-sm text-neutral-600">
              {invoice.client.postal_code} {invoice.client.city}
            </p>
          )}
          {invoice.client?.kvk_number && (
            <p className="text-sm text-neutral-600">KVK: {invoice.client.kvk_number}</p>
          )}
        </div>

        {/* Dates */}
        <div className="flex gap-8 mb-8 text-sm">
          <div>
            <span className="text-neutral-500">Factuurdatum:</span>{' '}
            <span className="font-semibold">{formatDate(invoice.invoice_date)}</span>
          </div>
          <div>
            <span className="text-neutral-500">Vervaldatum:</span>{' '}
            <span className="font-semibold">{formatDate(invoice.due_date)}</span>
          </div>
        </div>

        {/* Line items */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-neutral-300">
              <th className="text-left py-2 text-sm font-semibold text-neutral-600" scope="col">Omschrijving</th>
              <th className="text-right py-2 text-sm font-semibold text-neutral-600" scope="col">Aantal</th>
              <th className="text-right py-2 text-sm font-semibold text-neutral-600" scope="col">Prijs</th>
              <th className="text-right py-2 text-sm font-semibold text-neutral-600" scope="col">BTW%</th>
              <th className="text-right py-2 text-sm font-semibold text-neutral-600" scope="col">Totaal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.line_items.map((item) => (
              <tr key={item.id} className="border-b border-neutral-200">
                <td className="py-3 text-sm">{item.description}</td>
                <td className="py-3 text-sm text-right">{item.quantity}</td>
                <td className="py-3 text-sm text-right">{formatCurrency(item.unit_price)}</td>
                <td className="py-3 text-sm text-right">{item.vat_percentage}%</td>
                <td className="py-3 text-sm text-right font-mono">{formatCurrency(item.line_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="ml-auto w-64 space-y-1 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Subtotaal (excl. BTW)</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">BTW totaal</span>
            <span className="font-mono">{formatCurrency(invoice.vat_total)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t-2 border-neutral-300 pt-1">
            <span>Totaal</span>
            <span className="font-mono">{formatCurrency(invoice.total)}</span>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-neutral-600 mb-1">Notities</h3>
            <p className="text-sm text-neutral-500 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Payment instructions */}
        {invoice.payment_instructions && (
          <div className="border-t border-neutral-200 pt-4">
            <h3 className="text-sm font-semibold text-neutral-600 mb-1">Betaalinstructies</h3>
            <p className="text-sm text-neutral-500 whitespace-pre-wrap">{invoice.payment_instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
