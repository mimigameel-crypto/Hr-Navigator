import React from 'react';
import { X, Printer, CheckCircle, Shield, QrCode } from 'lucide-react';
import { Language, Order } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { currencies } from '../utils/currency';

interface InvoiceModalProps {
  order: Order | null;
  lang: Language;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  order,
  lang,
  onClose
}) => {
  if (!order) return null;

  const t = translations[lang];
  const isArabic = lang === 'ar';

  const orderCurrencyConfig = currencies[order.currency || 'SAR'] || currencies.SAR;
  const currencySymbol = isArabic ? orderCurrencyConfig.symbolAr : orderCurrencyConfig.symbolEn;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: orderCurrencyConfig.decimals,
      maximumFractionDigits: orderCurrencyConfig.decimals
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="invoice-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white"
    >
      <div
        id="invoice-modal-dialog"
        className="relative w-full max-w-3xl rounded-2xl bg-[#0e0f16] border border-[#d4af37]/40 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden my-8 print:border-none print:shadow-none print:bg-white print:text-black"
      >
        {/* Top Gold Border */}
        <div className="h-2 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411] print:hidden" />

        {/* Action Header */}
        <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ffd700]">
            <CheckCircle className="w-4 h-4 text-[#d4af37]" />
            <span>{t.invoiceDue}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg border border-[#d4af37]/50 bg-[#161722] hover:bg-[#202230] text-xs font-bold text-[#ffd700] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.printInvoice}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a8d9a] hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-10 space-y-8 print:p-8">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/10 print:border-gray-300">
            <div>
              <BrandLogo lang={lang} size="lg" />
              <p className="text-xs text-[#8a8d9a] mt-2 max-w-sm print:text-gray-600">
                {t.companyAddress}
              </p>
              <p className="text-xs text-[#d4af37] font-mono mt-1 print:text-black">
                {t.taxNumber}
              </p>
            </div>

            <div className="text-right rtl:text-left ltr:text-right">
              <span className="text-xl sm:text-2xl font-bold gold-gradient-text font-serif block print:text-black">
                {t.invoiceTitle}
              </span>
              <div className="text-xs text-[#8a8d9a] mt-1 print:text-gray-600">
                <span className="font-semibold text-white print:text-black">{t.orderRef} </span>
                <span className="font-mono text-[#ffd700] font-bold print:text-black">{order.orderNumber}</span>
              </div>
              <div className="text-xs text-[#8a8d9a] mt-0.5 print:text-gray-600">
                <span>{t.invoiceDate} </span>
                <span className="font-mono text-white print:text-black">
                  {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                </span>
              </div>
              {order.transactionRef && (
                <div className="text-[11px] text-[#8a8d9a] mt-0.5 print:text-gray-600 font-mono">
                  REF: {order.transactionRef}
                </div>
              )}
            </div>
          </div>

          {/* Bill-to and Payment summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#141520] border border-[#d4af37]/20 print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block mb-1 print:text-black">
                {t.billedTo}
              </span>
              <div className="text-sm font-bold text-white print:text-black">{order.customerName}</div>
              <div className="text-xs text-[#9ea3b5] print:text-gray-600">{order.customerEmail}</div>
              <div className="text-xs text-[#9ea3b5] font-mono print:text-gray-600">{order.customerPhone}</div>
              {order.customerAddress && (
                <div className="text-xs text-[#9ea3b5] mt-1 print:text-gray-600">{order.customerAddress}</div>
              )}
            </div>

            <div className="text-right rtl:text-left ltr:text-right sm:border-l sm:border-[#d4af37]/20 sm:rtl:border-l-0 sm:rtl:border-r sm:rtl:pr-4 sm:ltr:pl-4 print:border-gray-200">
              <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block mb-1 print:text-black">
                {t.paymentCol}
              </span>
              <div className="text-xs font-semibold text-white uppercase print:text-black">
                {order.paymentMethod === 'instapay'
                  ? (isArabic ? 'انستاباي مصر (mimigameel2025@instapay)' : 'InstaPay Egypt (mimigameel2025@instapay)')
                  : order.paymentMethod === 'knet'
                  ? (isArabic ? 'كي نت الكويت K-Net' : 'K-Net Kuwait')
                  : order.paymentMethod === 'google_pay'
                  ? 'Google Pay™'
                  : order.paymentMethod === 'apple_pay'
                  ? 'Apple Pay'
                  : order.paymentMethod === 'card'
                  ? (isArabic ? 'بطاقة بنكية (Visa / MasterCard)' : 'Credit Card (Visa / MasterCard)')
                  : order.paymentMethod.replace('_', ' ')}
              </div>
              <div className="text-xs text-[#34d399] font-semibold mt-1 flex items-center gap-1 justify-end rtl:justify-start ltr:justify-end print:text-green-700">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.invoiceDue}</span>
              </div>
            </div>
          </div>

          {/* Consultation Appointment Details if scheduled */}
          {order.consultationAppointment && (
            <div className="mb-6 p-4 rounded-xl bg-[#141724] border border-[#d4af37]/30 text-xs print:border-gray-300 print:bg-gray-50">
              <div className="flex items-center gap-2 text-white font-bold mb-2 print:text-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{isArabic ? 'موعد الجلسة الاستشارية المحجوز:' : 'Scheduled Consultation Session:'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#9ea3b5] print:text-gray-700">
                <div>
                  <span className="font-semibold text-white print:text-black">{isArabic ? 'التاريخ: ' : 'Date: '}</span>
                  <span className="font-mono">{order.consultationAppointment.date}</span>
                </div>
                <div>
                  <span className="font-semibold text-white print:text-black">{isArabic ? 'التوقيت: ' : 'Time: '}</span>
                  <span className="font-mono">{order.consultationAppointment.timeSlot}</span>
                </div>
                <div>
                  <span className="font-semibold text-white print:text-black">{isArabic ? 'القاعة: ' : 'Platform: '}</span>
                  <span>Google Meet</span>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
              <thead>
                <tr className="border-b border-white/10 text-[#8a8d9a] print:border-gray-300 print:text-gray-600">
                  <th className="py-3 px-2 font-bold">{t.serviceCol}</th>
                  <th className="py-3 px-2 text-center font-bold">الكمية / Qty</th>
                  <th className="py-3 px-2 font-bold text-left rtl:text-left ltr:text-right">السعر / Unit</th>
                  <th className="py-3 px-2 font-bold text-left rtl:text-left ltr:text-right">{t.amountCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 print:divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="text-[#e2e4ea] print:text-black">
                    <td className="py-3.5 px-2 font-medium">
                      {isArabic ? item.titleAr : item.titleEn}
                    </td>
                    <td className="py-3.5 px-2 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3.5 px-2 font-mono text-left rtl:text-left ltr:text-right">
                      {formatCurrency(item.price)} {currencySymbol}
                    </td>
                    <td className="py-3.5 px-2 font-mono font-bold text-[#ffd700] text-left rtl:text-left ltr:text-right print:text-black">
                      {formatCurrency(item.price * item.quantity)} {currencySymbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Breakdown */}
          <div className="pt-4 border-t border-white/10 flex justify-between items-end print:border-gray-300">
            {/* Visual QR & Seal */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white p-1 rounded-lg flex items-center justify-center shadow-inner">
                <QrCode className="w-16 h-16 text-black" />
              </div>
              <div className="text-[10px] text-[#8a8d9a] print:text-gray-500">
                <div>ختم الفاتورة الإلكترونية المعتمد</div>
                <div>ZATCA E-Invoice Compliant</div>
              </div>
            </div>

            {/* Subtotal / Tax / Grand Total */}
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-[#8a8d9a] print:text-gray-600">
                <span>{t.subtotal}</span>
                <span className="font-mono text-white print:text-black">
                  {formatCurrency(order.subtotal)} {currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-[#8a8d9a] print:text-gray-600">
                <span>{t.tax}</span>
                <span className="font-mono text-white print:text-black">
                  {formatCurrency(order.tax)} {currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10 print:border-gray-300 print:text-black">
                <span>{t.total}</span>
                <span className="gold-gradient-text text-lg font-mono font-extrabold print:text-black">
                  {formatCurrency(order.total)} {currencySymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-6 border-t border-white/5 text-[11px] text-[#717585] print:text-gray-500">
            {t.footerDesc} - {t.support24}
          </div>
        </div>
      </div>
    </div>
  );
};
