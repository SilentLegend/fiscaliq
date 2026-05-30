import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { InvoiceWithItems, InvoiceSettings } from '@/lib/types/database';
import { formatCurrency, formatDate, APP_NAME } from '@/lib/constants';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#171717',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  titleSection: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#737373',
    marginTop: 4,
  },
  companySection: {
    alignItems: 'flex-end',
    fontSize: 10,
    color: '#404040',
  },
  companyLine: {
    marginBottom: 2,
  },
  clientSection: {
    marginBottom: 20,
  },
  clientLabel: {
    fontSize: 9,
    color: '#737373',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientLine: {
    fontSize: 10,
    color: '#404040',
    marginBottom: 2,
  },
  datesSection: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  dateBlock: {
    marginRight: 30,
  },
  dateLabel: {
    fontSize: 9,
    color: '#737373',
    textTransform: 'uppercase',
  },
  dateValue: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  table: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e5e5',
    paddingBottom: 6,
    marginBottom: 6,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#737373',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingVertical: 6,
  },
  tableCell: {
    fontSize: 10,
    color: '#404040',
  },
  descriptionCol: { width: '40%' },
  qtyCol: { width: '12%', textAlign: 'right' },
  priceCol: { width: '18%', textAlign: 'right' },
  vatCol: { width: '10%', textAlign: 'right' },
  totalCol: { width: '20%', textAlign: 'right' },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: '#737373',
    width: 120,
    textAlign: 'right',
    marginRight: 8,
  },
  totalValue: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    width: 100,
    textAlign: 'right',
  },
  grandTotalRow: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#e5e5e5',
    paddingTop: 4,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 120,
    textAlign: 'right',
    marginRight: 8,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    width: 100,
    textAlign: 'right',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 9,
    color: '#737373',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 10,
    color: '#404040',
  },
  paymentSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
  paymentLabel: {
    fontSize: 9,
    color: '#737373',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 10,
    color: '#404040',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#a3a3a3',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
});

export function InvoicePdfDocument({
  invoice,
  settings,
}: {
  invoice: InvoiceWithItems;
  settings?: InvoiceSettings | null;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>FACTUUR</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoice_number}</Text>
          </View>
          <View style={styles.companySection}>
            {settings?.company_name && (
              <Text style={styles.companyLine}>{settings.company_name}</Text>
            )}
            {settings?.address_line1 && (
              <Text style={styles.companyLine}>{settings.address_line1}</Text>
            )}
            {settings?.postal_code && settings?.city && (
              <Text style={styles.companyLine}>
                {settings.postal_code} {settings.city}
              </Text>
            )}
            {settings?.kvk_number && (
              <Text style={styles.companyLine}>KVK: {settings.kvk_number}</Text>
            )}
            {settings?.btw_number && (
              <Text style={styles.companyLine}>BTW: {settings.btw_number}</Text>
            )}
            {settings?.iban && (
              <Text style={styles.companyLine}>IBAN: {settings.iban}</Text>
            )}
          </View>
        </View>

        {/* Client */}
        <View style={styles.clientSection}>
          <Text style={styles.clientLabel}>Factuur aan</Text>
          <Text style={styles.clientName}>
            {invoice.client?.name ?? invoice.client_name}
          </Text>
          {invoice.client?.address_line1 && (
            <Text style={styles.clientLine}>{invoice.client.address_line1}</Text>
          )}
          {invoice.client?.postal_code && invoice.client?.city && (
            <Text style={styles.clientLine}>
              {invoice.client.postal_code} {invoice.client.city}
            </Text>
          )}
          {invoice.client?.kvk_number && (
            <Text style={styles.clientLine}>KVK: {invoice.client.kvk_number}</Text>
          )}
          {invoice.client?.btw_number && (
            <Text style={styles.clientLine}>BTW: {invoice.client.btw_number}</Text>
          )}
        </View>

        {/* Dates */}
        <View style={styles.datesSection}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Factuurdatum</Text>
            <Text style={styles.dateValue}>
              {formatDate(invoice.invoice_date)}
            </Text>
          </View>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Vervaldatum</Text>
            <Text style={styles.dateValue}>
              {formatDate(invoice.due_date)}
            </Text>
          </View>
        </View>

        {/* Line items */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.descriptionCol]}>Omschrijving</Text>
            <Text style={[styles.tableHeaderCell, styles.qtyCol]}>Aantal</Text>
            <Text style={[styles.tableHeaderCell, styles.priceCol]}>Prijs</Text>
            <Text style={[styles.tableHeaderCell, styles.vatCol]}>BTW%</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>Totaal</Text>
          </View>

          {invoice.line_items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.descriptionCol]}>
                {item.description}
              </Text>
              <Text style={[styles.tableCell, styles.qtyCol]}>
                {item.quantity}
              </Text>
              <Text style={[styles.tableCell, styles.priceCol]}>
                {formatCurrency(item.unit_price)}
              </Text>
              <Text style={[styles.tableCell, styles.vatCol]}>
                {item.vat_percentage}%
              </Text>
              <Text style={[styles.tableCell, styles.totalCol]}>
                {formatCurrency(item.line_total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotaal (excl. BTW)</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>BTW totaal</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.vat_total)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Totaal</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notities</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Payment instructions */}
        {invoice.payment_instructions && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentLabel}>Betaalinstructies</Text>
            <Text style={styles.paymentText}>{invoice.payment_instructions}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          {APP_NAME} — {settings?.company_name || APP_NAME} — KVK:{' '}
          {settings?.kvk_number || '-'} — BTW: {settings?.btw_number || '-'}
        </Text>
      </Page>
    </Document>
  );
}
