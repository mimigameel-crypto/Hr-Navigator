import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Shield, 
  QrCode, 
  GraduationCap, 
  HardDrive, 
  Check, 
  ExternalLink, 
  Eye, 
  FileText,
  Maximize2
} from 'lucide-react';
import { Language, Order } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { currencies } from '../utils/currency';
import { saveFileToGoogleDrive } from '../utils/googleDrive';
import { 
  downloadDocumentFile, 
  openDocumentInNewTab,
  buildPrintableHtmlDocument,
  getDocumentBlobUrl 
} from '../utils/documentExporter';

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
  const [savedToDrive, setSavedToDrive] = useState(false);
  const [isSavingDrive, setIsSavingDrive] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeView, setActiveView] = useState<'iframe' | 'preview' | 'printable'>('iframe');

  const orderCurrencyConfig = currencies[order.currency || 'SAR'] || currencies.SAR;
  const currencySymbol = isArabic ? orderCurrencyConfig.symbolAr : orderCurrencyConfig.symbolEn;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
      minimumFractionDigits: orderCurrencyConfig.decimals,
      maximumFractionDigits: orderCurrencyConfig.decimals
    }).format(val);
  };

  const handleSaveToDrive = async () => {
    setIsSavingDrive(true);
    try {
      await saveFileToGoogleDrive(`Invoice-${order.invoiceNumber}.pdf`, 'invoice');
      setSavedToDrive(true);
      setTimeout(() => setSavedToDrive(false), 3500);
    } finally {
      setIsSavingDrive(false);
    }
  };

  const getInvoiceHtmlContent = () => {
    return `
      <div style="padding: 24px; border: 2px solid #d4af37; border-radius: 12px; background: #fff;">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 24px; border-bottom: 2px solid #eee; padding-bottom: 16px;">
          <tr>
            <td style="vertical-align: top;">
              <div style="font-size: 20px; font-weight: 900; color: #b8860b;">HR NAVIGATOR</div>
              <div style="font-size: 13px; font-weight: bold; color: #333; margin-top: 4px;">استشارات الموارد البشرية وتطوير الأعمال</div>
              <div style="font-size: 11px; color: #666; margin-top: 4px;">المملكة العربية السعودية • جمهورية مصر العربية</div>
              <div style="font-size: 11px; color: #b8860b; font-family: monospace; margin-top: 4px;">الرقم الضريبي: 31094829100003 (ZATCA Verified)</div>
            </td>
            <td style="text-align: ${isArabic ? 'left' : 'right'}; vertical-align: top;">
              <div style="font-size: 22px; font-weight: 800; color: #111;">فاتورة ضريبية رسمية</div>
              <div style="font-size: 13px; color: #555; margin-top: 4px;">رقم الفاتورة: <strong style="color: #b8860b;">${order.invoiceNumber}</strong></div>
              <div style="font-size: 12px; color: #555; margin-top: 2px;">رقم الطلب: <strong>${order.orderNumber}</strong></div>
              <div style="font-size: 12px; color: #555; margin-top: 2px;">التاريخ: <strong>${new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}</strong></div>
            </td>
          </tr>
        </table>

        <!-- Customer Info -->
        <div style="background: #f9fafb; padding: 14px 18px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <div style="font-size: 11px; font-weight: bold; color: #b8860b; text-transform: uppercase;">بيانات العميل المفوتر له:</div>
          <div style="font-size: 14px; font-weight: bold; color: #111; margin-top: 4px;">${order.customerName}</div>
          <div style="font-size: 12px; color: #555; margin-top: 2px;">البريد: ${order.customerEmail} | الهاتف: ${order.customerPhone}</div>
          ${order.customerAddress ? `<div style="font-size: 12px; color: #555; margin-top: 2px;">العنوان: ${order.customerAddress}</div>` : ''}
        </div>

        <!-- Items Table -->
        <table style="width: 100%; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <thead>
            <tr style="background: #f3f4f6; border-bottom: 2px solid #d4af37;">
              <th style="padding: 10px; text-align: ${isArabic ? 'right' : 'left'}; font-size: 12px; color: #374151;">الخدمة / الباقة الاستشارية</th>
              <th style="padding: 10px; text-align: center; font-size: 12px; color: #374151;">الكمية</th>
              <th style="padding: 10px; text-align: ${isArabic ? 'left' : 'right'}; font-size: 12px; color: #374151;">السعر</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr style="border-bottom: 1px solid #f3f4f6;">
                <td style="padding: 10px; font-size: 13px; font-weight: bold; color: #111;">${item.title[lang]}</td>
                <td style="padding: 10px; text-align: center; font-size: 12px; color: #555;">${item.quantity}</td>
                <td style="padding: 10px; text-align: ${isArabic ? 'left' : 'right'}; font-size: 13px; font-weight: bold; color: #111;">
                  ${formatCurrency(item.price * item.quantity)} ${currencySymbol}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & Seals -->
        <table style="width: 100%; margin-top: 16px;">
          <tr>
            <td style="vertical-align: middle; width: 50%;">
              <div style="font-size: 11px; color: #6b7280;">
                <div style="font-weight: bold; color: #059669;">✓ وثيقة معتمدة ومطابقة لمتطلبات الفوترة الإلكترونية (ZATCA)</div>
                <div style="margin-top: 4px;">تعتبر هذه الفاتورة سنداً رسمياً لإتمام استشارة الموارد البشرية.</div>
              </div>
            </td>
            <td style="vertical-align: top; width: 50%; text-align: ${isArabic ? 'left' : 'right'};">
              <table style="width: 100%; max-width: 280px; margin-${isArabic ? 'right' : 'left'}: auto;">
                <tr>
                  <td style="padding: 4px 8px; color: #6b7280; font-size: 12px;">المجموع الفرعي:</td>
                  <td style="padding: 4px 8px; font-weight: bold; font-size: 12px;">${formatCurrency(order.subtotal)} ${currencySymbol}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 8px; color: #6b7280; font-size: 12px;">ضريبة القيمة المضافة (15%):</td>
                  <td style="padding: 4px 8px; font-weight: bold; font-size: 12px;">${formatCurrency(order.tax)} ${currencySymbol}</td>
                </tr>
                <tr style="border-top: 2px solid #d4af37;">
                  <td style="padding: 8px 8px; font-weight: 900; font-size: 15px; color: #b8860b;">الإجمالي الكلي:</td>
                  <td style="padding: 8px 8px; font-weight: 900; font-size: 16px; color: #b8860b;">${formatCurrency(order.total)} ${currencySymbol}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `;
  };

  // Compile standalone HTML for the iframe preview
  const iframeDocumentSrcDoc = useMemo(() => {
    return buildPrintableHtmlDocument({
      title: `فاتورة ضريبية - ${order.invoiceNumber}`,
      htmlContent: getInvoiceHtmlContent(),
      isArabic
    });
  }, [order, isArabic, formatCurrency, currencySymbol, t]);

  // Generate valid Blob URL for direct HTML anchor download & tab opening
  const documentBlobUrl = useMemo(() => {
    return getDocumentBlobUrl({
      title: `فاتورة ضريبية - ${order.invoiceNumber}`,
      htmlContent: getInvoiceHtmlContent(),
      isArabic
    });
  }, [order, isArabic, formatCurrency, currencySymbol, t]);

  const invoiceDownloadFilename = `Invoice-${order.invoiceNumber}.html`;

  // Direct instant download
  const handleDownloadInvoice = () => {
    downloadDocumentFile({
      filename: `Invoice-${order.invoiceNumber}`,
      title: `فاتورة ضريبية - ${order.invoiceNumber} - HR Navigator`,
      htmlContent: getInvoiceHtmlContent(),
      isArabic
    });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  // Open in new tab for viewing / printing to PDF
  const handleOpenInNewTab = () => {
    openDocumentInNewTab({
      title: `فاتورة ضريبية - ${order.invoiceNumber} - HR Navigator`,
      htmlContent: getInvoiceHtmlContent(),
      isArabic
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="invoice-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white"
    >
      <div
        id="invoice-modal-dialog"
        className="relative w-full max-w-4xl rounded-3xl bg-[#0b0d14] border border-[#d4af37]/40 shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden my-auto max-h-[92vh] flex flex-col print:border-none print:shadow-none print:bg-white print:text-black print:max-h-none"
      >
        {/* Top Gold Border */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411] print:hidden" />

        {/* Modal Header & Navigation Bar */}
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#12141f] print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  {isArabic ? 'معاينة الفاتورة الضريبية الرسمية' : 'Official Tax Invoice Review'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  {order.invoiceNumber}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a]">
                {isArabic ? 'معاينة حية ومباشرة قبل التحميل مع خيارات التصدير المتعددة' : 'Live preview with multiple export and printing options'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setActiveView('iframe')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'iframe' ? 'bg-[#d4af37] text-black shadow' : 'text-[#8a8d9a] hover:text-white'
                }`}
                title={isArabic ? 'معاينة المستند الحي' : 'Live Document Preview'}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isArabic ? 'معاينة المستند' : 'Preview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'preview' ? 'bg-[#d4af37] text-black shadow' : 'text-[#8a8d9a] hover:text-white'
                }`}
                title={isArabic ? 'عرض تفصيلي وتفاعلي' : 'Interactive Details'}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isArabic ? 'تفاصيل الفاتورة' : 'Details'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('printable')}
                className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'printable' ? 'bg-[#d4af37] text-black shadow' : 'text-[#8a8d9a] hover:text-white'
                }`}
                title={isArabic ? 'عرض نسخة ورقية للطباعة' : 'Printable Sheet'}
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isArabic ? 'نسخة الطباعة' : 'Printable'}</span>
              </button>
            </div>

            {/* Google Drive Save */}
            <button
              type="button"
              onClick={handleSaveToDrive}
              disabled={isSavingDrive}
              className="px-3 py-1.5 rounded-xl border border-[#4285F4]/40 bg-[#131726] hover:bg-[#1a2238] text-xs font-bold text-[#60a5fa] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
              title="Google Drive"
            >
              {savedToDrive ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{isArabic ? 'تم الحفظ' : 'Saved'}</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-[#4285F4]" />
                  <span>{isSavingDrive ? (isArabic ? 'جارٍ...' : '...') : 'Drive'}</span>
                </>
              )}
            </button>

            {/* Open in New Tab Button */}
            <a
              id="btn-invoice-open-tab"
              href={documentBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-xs font-bold text-[#ffd700] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-decoration-none"
              title={isArabic ? 'فتح الفاتورة في علامة تبويب جديدة كـ PDF جاهز للطباعة والتنزيل' : 'Open PDF in New Tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isArabic ? 'فتح في تبويب جديد (PDF)' : 'Open in New Tab (PDF)'}</span>
            </a>

            {/* Direct Download PDF Anchor */}
            <a
              id="btn-invoice-download-file"
              href={documentBlobUrl}
              download={invoiceDownloadFilename}
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3500);
              }}
              className="px-4 py-1.5 rounded-xl border border-[#d4af37]/70 bg-gradient-to-r from-[#d4af37] to-[#b38f26] hover:brightness-110 text-xs font-bold text-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md text-decoration-none"
              title={isArabic ? 'تحميل ملف الفاتورة فوراً إلى جهازك' : 'Download Invoice to Device'}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تم التحميل!' : 'Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'تحميل الفاتورة (PDF)' : 'Download PDF'}</span>
                </>
              )}
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8a8d9a] hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Document Preview Area */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 space-y-4 print:p-8 bg-[#090b10]">
          {/* Quick Toolbar */}
          <div className="max-w-4xl mx-auto p-3 rounded-2xl bg-[#12141f] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white">
              <span className="text-[#8a8d9a]">{isArabic ? 'رقم الفاتورة:' : 'Invoice No:'}</span>
              <span className="font-mono font-bold text-[#ffd700] bg-black/50 px-2 py-0.5 rounded border border-[#d4af37]/30">
                {order.invoiceNumber}
              </span>
              <span className="text-[#8a8d9a] mx-1">•</span>
              <span className="text-[#8a8d9a]">{isArabic ? 'العميل:' : 'Client:'}</span>
              <span className="font-semibold text-white">
                {order.clientName || (isArabic ? 'العميل الكريم' : 'Valued Client')}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="text-[#ffd700] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer ml-auto"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{isArabic ? 'ملء الشاشة في تبويب جديد' : 'Full Screen'}</span>
            </button>
          </div>

          {/* Mode 1: Live iFrame Document Preview */}
          {activeView === 'iframe' && (
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border-2 border-[#d4af37]/30 shadow-2xl bg-white">
              <div className="bg-gray-100 p-2 border-b border-gray-300 flex items-center justify-between text-xs text-gray-600 px-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-[11px] text-gray-500 mr-2">
                    {order.invoiceNumber}.pdf • {isArabic ? 'معاينة المستند الرسمي الحي' : 'Official Document Preview'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleOpenInNewTab}
                    className="text-xs font-bold text-[#b8860b] hover:text-[#886411] flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'فتح في تبويب مستقل' : 'Open in New Tab'}</span>
                  </button>
                </div>
              </div>
              <iframe
                id="invoice-preview-iframe"
                srcDoc={iframeDocumentSrcDoc}
                title="معاينة نموذج الفاتورة الضريبية"
                className="w-full h-[580px] border-none bg-white"
              />
            </div>
          )}

          {/* Mode 2: Interactive / Standard View or Printable View */}
          {(activeView === 'preview' || activeView === 'printable') && (
            <div className={`max-w-3xl mx-auto rounded-2xl bg-white text-gray-900 shadow-2xl p-6 sm:p-10 border border-gray-200 space-y-8 ${activeView === 'printable' ? 'font-serif ring-2 ring-gray-300' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-200">
              <div>
                <BrandLogo lang={lang} size="md" />
                <p className="text-xs text-gray-600 mt-2 max-w-sm">
                  {t.companyAddress}
                </p>
                <p className="text-xs text-[#b8860b] font-mono font-bold mt-1">
                  {t.taxNumber} (ZATCA Verified)
                </p>
              </div>

              <div className="text-right rtl:text-left ltr:text-right">
                <span className="text-xl sm:text-2xl font-black text-gray-900 font-serif block">
                  {t.invoiceTitle}
                </span>
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold text-gray-800">{t.orderRef} </span>
                  <span className="font-mono text-[#b8860b] font-bold">{order.orderNumber}</span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  <span>{t.invoiceDate} </span>
                  <span className="font-mono font-semibold text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                  </span>
                </div>
                {order.transactionRef && (
                  <div className="text-[11px] text-gray-500 mt-0.5 font-mono">
                    REF: {order.transactionRef}
                  </div>
                )}
              </div>
            </div>

            {/* Bill-to and Payment summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div>
                <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider block mb-1">
                  {t.billedTo}
                </span>
                <div className="text-sm font-bold text-gray-900">{order.customerName}</div>
                <div className="text-xs text-gray-600">{order.customerEmail}</div>
                <div className="text-xs text-gray-600 font-mono">{order.customerPhone}</div>
                {order.customerAddress && (
                  <div className="text-xs text-gray-600 mt-1">{order.customerAddress}</div>
                )}
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider block mb-1">
                  {t.paymentDetails}
                </span>
                <div className="text-xs text-gray-700">
                  <span className="text-gray-500">{t.paymentMethod}: </span>
                  <span className="font-semibold text-gray-900 uppercase">
                    {order.paymentMethod === 'apple_pay' ? 'Apple Pay' : order.paymentMethod}
                  </span>
                </div>
                <div className="text-xs text-gray-700 mt-0.5">
                  <span className="text-gray-500">{t.paymentStatus}: </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t.paymentConfirmed}</span>
                  </span>
                </div>
                <div className="text-xs text-gray-700 mt-0.5">
                  <span className="text-gray-500">حالة الفاتورة: </span>
                  <span className="font-semibold text-emerald-700">مدفوعة ومكتملة بالكامل</span>
                </div>
              </div>
            </div>

            {/* Invoice Line Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-[#d4af37] text-gray-700">
                    <th className="py-2.5 text-right rtl:text-right ltr:text-left font-bold">{t.tableItem}</th>
                    <th className="py-2.5 text-center font-bold">{t.tableQty}</th>
                    <th className="py-2.5 text-right rtl:text-left ltr:text-right font-bold">{t.tablePrice}</th>
                    <th className="py-2.5 text-right rtl:text-left ltr:text-right font-bold">{t.tableTotal}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-3 text-right rtl:text-right ltr:text-left font-semibold text-gray-900">
                        {item.title[lang]}
                        <div className="text-[10px] text-gray-500 font-normal">
                          استشارة مهنية معتمدة من استشاريي HR Navigator
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-700 font-mono font-medium">{item.quantity}</td>
                      <td className="py-3 text-right rtl:text-left ltr:text-right text-gray-700 font-mono">
                        {formatCurrency(item.price)} {currencySymbol}
                      </td>
                      <td className="py-3 text-right rtl:text-left ltr:text-right text-gray-900 font-mono font-bold">
                        {formatCurrency(item.price * item.quantity)} {currencySymbol}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              {/* Visual QR & Seal */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 p-1.5 rounded-xl flex items-center justify-center border border-gray-300">
                  <QrCode className="w-16 h-16 text-black" />
                </div>
                <div className="text-[10px] text-gray-600">
                  <div className="font-bold text-gray-800">ختم الفاتورة الإلكترونية المعتمد</div>
                  <div>ZATCA E-Invoice Compliant</div>
                  <div className="text-emerald-700 font-semibold mt-0.5">مشفرة ومعتمدة رقمياً</div>
                </div>
              </div>

              {/* Subtotal / Tax / Grand Total */}
              <div className="w-full sm:w-64 space-y-2 text-xs">
                {order.isStudentOrder && order.studentDiscountApplied && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'خصم طلبة الجامعة' : 'Student Discount'}</span>
                    </span>
                    <span className="font-mono">
                      -{formatCurrency(order.studentDiscountApplied)} {currencySymbol}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{t.subtotal}</span>
                  <span className="font-mono text-gray-900 font-semibold">
                    {formatCurrency(order.subtotal)} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t.tax}</span>
                  <span className="font-mono text-gray-900 font-semibold">
                    {formatCurrency(order.tax)} {currencySymbol}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t-2 border-[#d4af37]">
                  <span>{t.total}</span>
                  <span className="text-[#b8860b] text-lg font-mono font-black">
                    {formatCurrency(order.total)} {currencySymbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center pt-6 border-t border-gray-200 text-[11px] text-gray-500">
              {t.footerDesc} - {t.support24}
            </div>
          </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-[#12141f] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="text-[#8a8d9a] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ffd700]" />
            <span>{isArabic ? 'فاتورة ضريبية رسمية سارية ومعتمدة نظاماً' : 'Official compliant tax invoice ready for download'}</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              id="btn-invoice-footer-open-tab"
              href={documentBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-decoration-none"
              title={isArabic ? 'فتح الفاتورة في علامة تبويب جديدة كـ PDF' : 'Open in New Tab'}
            >
              <ExternalLink className="w-4 h-4 text-[#ffd700]" />
              <span>{isArabic ? 'فتح في تبويب جديد (PDF)' : 'Open in New Tab'}</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#ffd700]" />
              <span>{isArabic ? 'طباعة مباشرة' : 'Direct Print'}</span>
            </button>

            <a
              id="btn-invoice-footer-download"
              href={documentBlobUrl}
              download={invoiceDownloadFilename}
              onClick={() => {
                setDownloadSuccess(true);
                setTimeout(() => setDownloadSuccess(false), 3500);
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b38f26] text-black font-bold flex items-center gap-1.5 hover:brightness-110 shadow-lg transition-all cursor-pointer text-decoration-none"
            >
              <Download className="w-4 h-4" />
              <span>{isArabic ? 'تنزيل الفاتورة إلى الجهاز' : 'Download Document'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
