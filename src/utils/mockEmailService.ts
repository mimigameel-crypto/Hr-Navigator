import { Order, Language } from '../types';
import { currencies } from './currency';

export interface EmailNotificationPayload {
  messageId: string;
  recipientEmail: string;
  recipientName: string;
  senderEmail: string;
  senderName: string;
  subjectAr: string;
  subjectEn: string;
  orderNumber: string;
  totalFormatted: string;
  currencyCode: string;
  itemsCount: number;
  itemsList: { title: string; price: string }[];
  sentAt: string;
  status: 'delivered' | 'sending';
}

/**
 * Mock Email Service simulating corporate transaction notification dispatch
 * (e.g. Resend, SendGrid, Amazon SES, or Postmark).
 */
export const triggerOrderConfirmationEmail = async (
  order: Order,
  lang: Language = 'ar'
): Promise<EmailNotificationPayload> => {
  // Simulate network dispatch latency (300ms)
  await new Promise(resolve => setTimeout(resolve, 300));

  const curr = currencies[order.currency] || currencies.SAR;
  const currSymbol = lang === 'ar' ? curr.symbolAr : curr.symbolEn;
  const formattedTotal = `${new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US', {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals
  }).format(order.total)} ${currSymbol}`;

  const items = order.items.map(i => ({
    title: lang === 'ar' ? i.titleAr : i.titleEn,
    price: `${new Intl.NumberFormat(lang === 'ar' ? 'ar-SA' : 'en-US').format(i.price * i.quantity)} ${currSymbol}`
  }));

  const payload: EmailNotificationPayload = {
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    recipientEmail: order.customerEmail || 'client@enterprise.com',
    recipientName: order.customerName,
    senderEmail: 'hrnavigatorconsultations@gmail.com',
    senderName: lang === 'ar' ? 'إتش آر نافيجيتور للاستشارات' : 'HR Navigator Consultations',
    subjectAr: `تأكيد حجز الاستشارة والفاتورة الضريبية #${order.orderNumber} - إتش آر نافيجيتور`,
    subjectEn: `Consultation Booking Confirmation & Tax Invoice #${order.orderNumber} - HR Navigator`,
    orderNumber: order.orderNumber,
    totalFormatted: formattedTotal,
    currencyCode: order.currency,
    itemsCount: order.items.length,
    itemsList: items,
    sentAt: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    status: 'delivered'
  };

  // Log in browser console for verification
  console.log('📧 [Mock Email Service] Order Confirmation Dispatched Successfully:', payload);

  return payload;
};
