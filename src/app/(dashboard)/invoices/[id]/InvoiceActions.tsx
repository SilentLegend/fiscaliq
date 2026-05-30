'use client';

import { useRouter } from 'next/navigation';
import { updateInvoiceStatus, deleteInvoice } from '@/lib/actions/invoice.actions';
import type { InvoiceStatus } from '@/lib/types/database';
import { INVOICE_STATUS_LABELS } from '@/lib/constants';

const STATUS_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['sent', 'cancelled'],
  sent: ['paid', 'overdue', 'cancelled'],
  paid: [],
  overdue: ['paid', 'cancelled'],
  cancelled: [],
};

export function InvoiceActions({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const router = useRouter();
  const transitions = STATUS_TRANSITIONS[currentStatus] || [];

  const handleStatusChange = async (newStatus: InvoiceStatus) => {
    const result = await updateInvoiceStatus(invoiceId, newStatus);
    if (result.error) {
      alert(result.error);
    }
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je deze factuur wilt verwijderen?')) return;
    const result = await deleteInvoice(invoiceId);
    if (result.error) {
      alert(result.error);
    } else {
      router.push('/invoices');
    }
  };

  return (
    <>
      {transitions.map((status) => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          className="btn-secondary"
        >
          Markeer als {INVOICE_STATUS_LABELS[status]?.toLowerCase() ?? status}
        </button>
      ))}
      <button onClick={handleDelete} className="btn-danger">
        Verwijderen
      </button>
    </>
  );
}
