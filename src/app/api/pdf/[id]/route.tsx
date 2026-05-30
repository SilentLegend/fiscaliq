import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getInvoiceById } from '@/lib/queries/invoices.queries';
import { getInvoiceSettings } from '@/lib/queries/settings.queries';

// Dynamic route — no caching
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await getInvoiceById(id, user.id);

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const settings = await getInvoiceSettings(user.id);

    // Dynamically import @react-pdf/renderer (it uses Node.js APIs)
    const { renderToStream } = await import('@react-pdf/renderer');
    const { InvoicePdfDocument } = await import('@/lib/utils/pdf');

    const pdfStream = await renderToStream(
      <InvoicePdfDocument invoice={invoice} settings={settings} />,
    );

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk as Uint8Array);
    }
    const pdfBuffer = Buffer.concat(chunks);

    const filename = `factuur-${invoice.invoice_number}.pdf`;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF generatie mislukt' },
      { status: 500 },
    );
  }
}
