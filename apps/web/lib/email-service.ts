import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ReminderEmailOptions {
  toEmail: string
  customerName: string
  invoiceNumber: string
  dueDate: string
  amount: number
  currency: string
  companyName: string
  companyEmail: string
}

export async function sendReminderEmail(options: ReminderEmailOptions) {
  const { toEmail, customerName, invoiceNumber, dueDate, amount, currency, companyName, companyEmail } = options

  const formattedAmount = new Intl.NumberFormat('nl-NL', {
***REMOVED***style: 'currency',
***REMOVED***currency: currency || 'EUR',
  }).format(amount)

  const dueDateFormatted = new Intl.DateTimeFormat('nl-NL', {
***REMOVED***year: 'numeric',
***REMOVED***month: 'long',
***REMOVED***day: 'numeric',
  }).format(new Date(dueDate))

  const emailHtml = `
***REMOVED***<!DOCTYPE html>
***REMOVED***<html lang="nl">
***REMOVED***<head>
***REMOVED***  <meta charset="UTF-8">
***REMOVED***  <meta name="viewport" content="width=device-width, initial-scale=1.0">
***REMOVED***  <title>Betalingsherinnering</title>
***REMOVED***  <style>
***REMOVED******REMOVED***body {
***REMOVED******REMOVED***  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
***REMOVED******REMOVED***  line-height: 1.6;
***REMOVED******REMOVED***  color: #333;
***REMOVED******REMOVED***  background-color: #f9fafb;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.container {
***REMOVED******REMOVED***  max-width: 600px;
***REMOVED******REMOVED***  margin: 0 auto;
***REMOVED******REMOVED***  background-color: #ffffff;
***REMOVED******REMOVED***  border-radius: 12px;
***REMOVED******REMOVED***  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
***REMOVED******REMOVED***  overflow: hidden;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.header {
***REMOVED******REMOVED***  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
***REMOVED******REMOVED***  color: white;
***REMOVED******REMOVED***  padding: 32px 24px;
***REMOVED******REMOVED***  text-align: center;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.header h1 {
***REMOVED******REMOVED***  margin: 0;
***REMOVED******REMOVED***  font-size: 24px;
***REMOVED******REMOVED***  font-weight: 600;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.content {
***REMOVED******REMOVED***  padding: 32px 24px;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.greeting {
***REMOVED******REMOVED***  font-size: 16px;
***REMOVED******REMOVED***  margin-bottom: 20px;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.invoice-details {
***REMOVED******REMOVED***  background-color: #f0f9ff;
***REMOVED******REMOVED***  border-left: 4px solid #3b82f6;
***REMOVED******REMOVED***  padding: 16px;
***REMOVED******REMOVED***  border-radius: 8px;
***REMOVED******REMOVED***  margin: 24px 0;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.detail-row {
***REMOVED******REMOVED***  display: flex;
***REMOVED******REMOVED***  justify-content: space-between;
***REMOVED******REMOVED***  margin: 12px 0;
***REMOVED******REMOVED***  font-size: 14px;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.detail-label {
***REMOVED******REMOVED***  font-weight: 500;
***REMOVED******REMOVED***  color: #666;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.detail-value {
***REMOVED******REMOVED***  font-weight: 600;
***REMOVED******REMOVED***  color: #000;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.amount {
***REMOVED******REMOVED***  font-size: 20px;
***REMOVED******REMOVED***  color: #dc2626;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.cta-button {
***REMOVED******REMOVED***  display: inline-block;
***REMOVED******REMOVED***  background-color: #3b82f6;
***REMOVED******REMOVED***  color: white;
***REMOVED******REMOVED***  padding: 12px 32px;
***REMOVED******REMOVED***  text-decoration: none;
***REMOVED******REMOVED***  border-radius: 8px;
***REMOVED******REMOVED***  font-weight: 600;
***REMOVED******REMOVED***  margin-top: 24px;
***REMOVED******REMOVED***  transition: background-color 0.3s;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.cta-button:hover {
***REMOVED******REMOVED***  background-color: #2563eb;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.footer {
***REMOVED******REMOVED***  background-color: #f9fafb;
***REMOVED******REMOVED***  padding: 24px;
***REMOVED******REMOVED***  text-align: center;
***REMOVED******REMOVED***  font-size: 12px;
***REMOVED******REMOVED***  color: #666;
***REMOVED******REMOVED***  border-top: 1px solid #e5e7eb;
***REMOVED******REMOVED***}
***REMOVED******REMOVED***.footer p {
***REMOVED******REMOVED***  margin: 6px 0;
***REMOVED******REMOVED***}
***REMOVED***  </style>
***REMOVED***</head>
***REMOVED***<body>
***REMOVED***  <div class="container">
***REMOVED******REMOVED***<div class="header">
***REMOVED******REMOVED***  <h1>Betalingsherinnering</h1>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***<div class="content">
***REMOVED******REMOVED***  <p class="greeting">Hallo <strong>${customerName}</strong>,</p>
***REMOVED******REMOVED***  
***REMOVED******REMOVED***  <p>Dit is een vriendelijke herinnering dat factuur <strong>#${invoiceNumber}</strong> nog niet is betaald.</p>
***REMOVED******REMOVED***  
***REMOVED******REMOVED***  <div class="invoice-details">
***REMOVED******REMOVED******REMOVED***<div class="detail-row">
***REMOVED******REMOVED******REMOVED***  <span class="detail-label">Factuurnummer:</span>
***REMOVED******REMOVED******REMOVED***  <span class="detail-value">${invoiceNumber}</span>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div class="detail-row">
***REMOVED******REMOVED******REMOVED***  <span class="detail-label">Verschuldigde bedrag:</span>
***REMOVED******REMOVED******REMOVED***  <span class="detail-value amount">${formattedAmount}</span>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED***<div class="detail-row">
***REMOVED******REMOVED******REMOVED***  <span class="detail-label">Vervaldatum:</span>
***REMOVED******REMOVED******REMOVED***  <span class="detail-value">${dueDateFormatted}</span>
***REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***  </div>

***REMOVED******REMOVED***  <p>Wij verzoeken u vriendelijk om deze factuur zo spoedig mogelijk te betalen. Als u deze betaling al heeft gedaan, kunt u dit bericht negeren.</p>

***REMOVED******REMOVED***  <p style="text-align: center;">
***REMOVED******REMOVED******REMOVED***<a href="${companyEmail}" class="cta-button">Contact opnemen</a>
***REMOVED******REMOVED***  </p>

***REMOVED******REMOVED***  <p style="color: #666; font-size: 13px; margin-top: 24px;">
***REMOVED******REMOVED******REMOVED***Hartelijk dank voor uw aandacht en bedrijf.<br>
***REMOVED******REMOVED******REMOVED***Met vriendelijke groeten,<br>
***REMOVED******REMOVED******REMOVED***<strong>${companyName}</strong>
***REMOVED******REMOVED***  </p>
***REMOVED******REMOVED***</div>
***REMOVED******REMOVED***
***REMOVED******REMOVED***<div class="footer">
***REMOVED******REMOVED***  <p>Dit is een automatische herinnering van FiscalIQ</p>
***REMOVED******REMOVED***  <p>Kunt u deze factuur niet vinden? <a href="mailto:${companyEmail}">Neem contact op</a></p>
***REMOVED******REMOVED***</div>
***REMOVED***  </div>
***REMOVED***</body>
***REMOVED***</html>
  `

  try {
***REMOVED***const response = await resend.emails.send({
***REMOVED***  from: `${companyName} <noreply@fiscaliq.nl>`,
***REMOVED***  to: toEmail,
***REMOVED***  subject: `Betalingsherinnering: Factuur #${invoiceNumber}`,
***REMOVED***  html: emailHtml,
***REMOVED***  reply_to: companyEmail,
***REMOVED***})

***REMOVED***return {
***REMOVED***  success: true,
***REMOVED***  messageId: response.data?.id,
***REMOVED***  error: null,
***REMOVED***}
  } catch (error) {
***REMOVED***console.error('Error sending reminder email:', error)
***REMOVED***return {
***REMOVED***  success: false,
***REMOVED***  messageId: null,
***REMOVED***  error: error instanceof Error ? error.message : 'Unknown error',
***REMOVED***}
  }
}
