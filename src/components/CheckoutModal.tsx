import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Building2,
  Smartphone,
  FileText,
  Lock,
  Loader2,
  Coins,
  ArrowUpRight,
  Copy,
  Check,
  Zap,
  ExternalLink,
  Wallet,
  Landmark,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';
import { Language, Order, OrderItem, PaymentMethod, User, Currency } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { CurrencySelector } from './CurrencySelector';
import { formatCurrencyValue, convertFromSAR, currencies } from '../utils/currency';
import { triggerOrderConfirmationEmail, EmailNotificationPayload } from '../utils/mockEmailService';
import { ConsultationScheduler } from './ConsultationScheduler';

interface CheckoutModalProps {
  isOpen: boolean;
  lang: Language;
  currentCurrency: Currency;
  onSelectCurrency: (c: Currency) => void;
  items: OrderItem[];
  currentUser: User | null;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
  onViewInvoice: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  lang,
  currentCurrency,
  onSelectCurrency,
  items,
  currentUser,
  onClose,
  onOrderCompleted,
  onViewInvoice
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';

  const INSTAPAY_LINK = 'https://ipn.eg/S/mimigameel2025/instapay/8E32gp';
  const INSTAPAY_HANDLE = 'hrnavigator@instapay';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('instapay');
  const [customerName, setCustomerName] = useState(currentUser?.name || (isArabic ? 'شركة النيل للتطوير المؤسسي' : 'Nile Corporate Development LLC'));
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'hrnavigatorconsultations@gmail.com');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+20 10 92792321');
  const [deliveryAddress, setDeliveryAddress] = useState(isArabic ? 'القاهرة - التجمع الخامس' : 'Cairo - Fifth Settlement');
  const [notes, setNotes] = useState('');
  const [copiedHandle, setCopiedHandle] = useState(false);

  const handleCopyHandle = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(INSTAPAY_HANDLE);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  // Card details (Visa, Mastercard, Amex)
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');
  const [cardNumber, setCardNumber] = useState('4111 8892 0019 4521');
  const [cardHolder, setCardHolder] = useState(customerName.toUpperCase());
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('882');

  // K-Net Details (Kuwait National Debit Network)
  const [knetBank, setKnetBank] = useState('nbk');
  const [knetPrefix, setKnetPrefix] = useState('518391');
  const [knetCardNum, setKnetCardNum] = useState('88291044');
  const [knetMonth, setKnetMonth] = useState('11');
  const [knetYear, setKnetYear] = useState('28');
  const [knetPin, setKnetPin] = useState('7192');

  // Google Pay Details
  const [googlePayAccount] = useState('mimigameel@gmail.com');
  const [googlePaySelectedCard, setGooglePaySelectedCard] = useState('visa_4192');

  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [emailNotification, setEmailNotification] = useState<EmailNotificationPayload | null>(null);
  const [emailSending, setEmailSending] = useState(false);

  if (!isOpen) return null;

  // Calculate unit price in active currency with exactPrices support
  const getItemUnitPrice = (item: OrderItem): number => {
    if (item.exactPrices && item.exactPrices[currentCurrency] !== undefined) {
      return item.exactPrices[currentCurrency]!;
    }
    return convertFromSAR(item.price, currentCurrency);
  };

  const convertedTotal = items.reduce((sum, item) => sum + getItemUnitPrice(item) * item.quantity, 0);
  // Final price is all-inclusive (VAT included)
  const convertedTax = Math.round((convertedTotal * 0.15) / 1.15);
  const convertedSubtotal = convertedTotal;

  const formatAmount = (val: number) => {
    return formatCurrencyValue(0, currentCurrency, lang, val).displayWithSymbol;
  };

  const formatItemPrice = (item: OrderItem) => {
    const unit = getItemUnitPrice(item);
    return formatCurrencyValue(item.price, currentCurrency, lang, unit * item.quantity).displayWithSymbol;
  };

  // For KWD specific conversion (e.g. K-NET)
  const totalInKWD = items.reduce((sum, item) => {
    const unit = item.exactPrices?.['KWD'] !== undefined
      ? item.exactPrices['KWD']!
      : convertFromSAR(item.price, 'KWD');
    return sum + unit * item.quantity;
  }, 0);
  const formatKWD = formatCurrencyValue(0, 'KWD', lang, totalInKWD).displayWithSymbol;

  const handleProcessPayment = () => {
    setProcessing(true);
    setEmailNotification(null);

    if (paymentMethod === 'instapay') {
      window.open(INSTAPAY_LINK, '_blank', 'noopener,noreferrer');
    }

    setTimeout(async () => {
      const generatedOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `HRN-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customerName.trim() || (isArabic ? 'منشأة شريكة' : 'Partner Enterprise'),
        customerEmail: customerEmail.trim() || 'mimigameel@gmail.com',
        customerPhone: customerPhone.trim() || '+201092792321',
        customerAddress: deliveryAddress.trim(),
        items: items.map(i => ({
          ...i,
          price: getItemUnitPrice(i)
        })),
        subtotal: convertedSubtotal,
        tax: convertedTax,
        total: convertedTotal,
        currency: currentCurrency,
        paymentMethod: paymentMethod,
        paymentStatus: 'paid',
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: notes.trim(),
        transactionRef: `TXN-${paymentMethod.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      setCompletedOrder(generatedOrder);
      onOrderCompleted(generatedOrder);
      setProcessing(false);

      // Trigger Mock Email Notification Service
      try {
        setEmailSending(true);
        const emailResult = await triggerOrderConfirmationEmail(generatedOrder, lang);
        setEmailNotification(emailResult);
      } catch (err) {
        console.error('Failed to trigger email notification:', err);
      } finally {
        setEmailSending(false);
      }
    }, 1500);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="checkout-modal-dialog"
        className="relative w-full max-w-2xl rounded-2xl bg-[#0f1017] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.18)] overflow-hidden my-8"
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Payment Success View */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto mb-5 text-[#ffd700] shadow-[0_0_25px_rgba(212,175,55,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 font-serif">
              {t.paymentSuccessTitle}
            </h3>
            <p className="text-sm text-[#9ea3b5] max-w-md mx-auto mb-6">
              {t.paymentSuccessDesc}
            </p>

            {/* Receipt Box */}
            <div className="p-5 rounded-xl bg-[#141520] border border-[#d4af37]/30 max-w-md mx-auto text-right rtl:text-right ltr:text-left mb-5 space-y-2 text-xs">
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{t.orderRef}</span>
                <span className="font-mono font-bold text-[#ffd700] text-sm">{completedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{t.transactionId}</span>
                <span className="font-mono text-white">{completedOrder.transactionRef}</span>
              </div>
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{t.total}</span>
                <span className="font-bold text-white text-sm font-mono">
                  {new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US', {
                    minimumFractionDigits: (currencies[completedOrder.currency] || currencies.SAR).decimals,
                    maximumFractionDigits: (currencies[completedOrder.currency] || currencies.SAR).decimals
                  }).format(completedOrder.total)} {isArabic ? (currencies[completedOrder.currency] || currencies.SAR).symbolAr : (currencies[completedOrder.currency] || currencies.SAR).symbolEn}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#9ea3b5] pt-2 border-t border-white/5">
                <span>{t.dateCol}:</span>
                <span className="text-white">{new Date().toLocaleString(isArabic ? 'ar-SA' : 'en-US')}</span>
              </div>
            </div>

            {/* Mock Email Notification Dispatch Summary */}
            <div className="max-w-md mx-auto mb-6 rounded-xl border border-emerald-500/40 bg-gradient-to-br from-[#062117] via-[#0b1713] to-[#0d131f] p-4 text-right rtl:text-right ltr:text-left shadow-[0_4px_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {isArabic ? 'إشعار البريد الإلكتروني الفوري' : 'Automated Email Notification'}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isArabic ? 'تم الإرسال بنجاح' : 'Dispatched'}
                </span>
              </div>

              {emailNotification ? (
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center text-[#9ea3b5]">
                    <span>{isArabic ? 'إلى البريد المسجل:' : 'Recipient:'}</span>
                    <span className="font-mono text-emerald-300 font-semibold">{emailNotification.recipientEmail}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#9ea3b5]">
                    <span>{isArabic ? 'عنوان الرسالة:' : 'Subject:'}</span>
                    <span className="text-white font-medium truncate max-w-[240px]">
                      {isArabic ? emailNotification.subjectAr : emailNotification.subjectEn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#9ea3b5]">
                    <span>{isArabic ? 'رقم الإشعار المرجعي:' : 'Message ID:'}</span>
                    <span className="font-mono text-gray-400 text-[10px]">{emailNotification.messageId}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-400/90 font-medium">
                    <span>✓ {isArabic ? 'تم إرفاق الفاتورة الضريبية وتفاصيل استشارتك تلقائياً' : 'Tax invoice & consultation schedule attached'}</span>
                    <span className="font-mono text-gray-400">{emailNotification.sentAt}</span>
                  </div>
                </div>
              ) : emailSending ? (
                <div className="flex items-center justify-center gap-2 py-3 text-xs text-emerald-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isArabic ? 'جاري تجهيز وإرسال بريد التأكيد...' : 'Dispatching confirmation email...'}</span>
                </div>
              ) : (
                <div className="text-[11px] text-[#9ea3b5]">
                  {isArabic 
                    ? `تم إرسال نسخة من الفاتورة وتأكيد الحجز إلى: ${completedOrder.customerEmail}` 
                    : `Invoice & booking copy dispatched to: ${completedOrder.customerEmail}`}
                </div>
              )}
            </div>

            {/* Consultation Appointment Scheduling Component (Synced to Mock Calendar) */}
            <div className="max-w-md mx-auto mb-6">
              <ConsultationScheduler
                order={completedOrder}
                lang={lang}
                onAppointmentScheduled={(appointment) => {
                  setCompletedOrder({
                    ...completedOrder,
                    consultationAppointment: appointment
                  });
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={() => onViewInvoice(completedOrder)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0c0d12] font-extrabold text-xs shadow-md hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{t.viewInvoiceBtn}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl border border-white/10 hover:border-[#d4af37]/40 bg-white/5 text-white font-semibold text-xs cursor-pointer"
              >
                {t.continueShopping}
              </button>
            </div>
          </div>
        ) : (
          /* Checkout & Payment Form */
          <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t.checkoutTitle}
                </h2>
                <p className="text-xs text-[#9ea3b5]">
                  {t.checkoutSubtitle}
                </p>
              </div>
              <BrandLogo lang={lang} size="sm" showSubtitle={false} />
            </div>

            {/* Currency Switcher Bar within Checkout */}
            <div className="mb-5 p-3 rounded-xl bg-[#141520] border border-[#d4af37]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffd700]">
                <Coins className="w-4 h-4 text-[#d4af37]" />
                <span>{isArabic ? 'عملة سداد الاستشارة:' : 'Payment Currency:'}</span>
              </div>
              <CurrencySelector
                currentCurrency={currentCurrency}
                onSelectCurrency={onSelectCurrency}
                lang={lang}
                variant="pills"
              />
            </div>

            {/* Selected Items Summary */}
            <div className="mb-6 p-4 rounded-xl bg-[#141520] border border-[#d4af37]/20">
              <span className="text-xs font-bold text-[#ffd700] block mb-2">
                {t.cart} ({items.length})
              </span>
              <div className="divide-y divide-white/5 space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs pt-2">
                    <div>
                      <span className="text-white font-medium">
                        {isArabic ? item.titleAr : item.titleEn}
                      </span>
                      <span className="text-[#8a8d9a] mx-2">× {item.quantity}</span>
                    </div>
                    <div className="text-[#ffd700] font-bold font-mono">
                      {formatItemPrice(item)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1 text-xs">
                <div className="flex justify-between text-[#9ea3b5]">
                  <span>{t.subtotal}</span>
                  <span className="font-mono text-white">{formatAmount(convertedSubtotal)}</span>
                </div>
                <div className="flex justify-between text-[#8a8d9a]">
                  <span>{isArabic ? 'ضريبة القيمة المضافة (15% مشمولة):' : 'VAT (15% Included):'}</span>
                  <span className="font-mono text-[#8a8d9a]">{formatAmount(convertedTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1">
                  <span>{t.total} ({isArabic ? 'السعر النهائي' : 'Final Price'})</span>
                  <span className="gold-gradient-text text-base font-mono">
                    {formatAmount(convertedTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold text-[#c5c8d6] uppercase tracking-wider block">
                {t.stepCustomer}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t.fullName}
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={t.emailAddress}
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder={t.phoneNumber}
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  dir="ltr"
                  className="px-3.5 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none text-right rtl:text-left"
                />
                <input
                  type="text"
                  placeholder={t.deliveryAddress}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-[#14151f] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <span className="text-xs font-bold text-[#c5c8d6] uppercase tracking-wider block mb-2.5">
                {t.selectPaymentMethod}
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {[
                  { id: 'card', name: isArabic ? 'فيزا وماستركارد' : 'Visa / MC / Amex', icon: CreditCard, badge: isArabic ? 'عالمي' : 'Global', color: 'border-[#d4af37]' },
                  { id: 'knet', name: isArabic ? 'كي نت K-Net' : 'K-Net Kuwait', icon: Landmark, badge: '🇰🇼 الكويت', color: 'border-cyan-500' },
                  { id: 'google_pay', name: 'Google Pay™', icon: Wallet, badge: isArabic ? 'سريع' : 'Fast', color: 'border-blue-500' },
                  { id: 'apple_pay', name: 'Apple Pay', icon: Smartphone, badge: ' Pay', color: 'border-white/30' },
                  { id: 'instapay', name: isArabic ? 'انستاباي InstaPay' : 'InstaPay', icon: Zap, badge: '⚡ مصر', color: 'border-purple-500' },
                  { id: 'mada', name: isArabic ? 'مدى mada' : 'Mada Debit', icon: ShieldCheck, badge: '🇸🇦 مدى', color: 'border-emerald-500' },
                  { id: 'bank_transfer', name: isArabic ? 'تحويل بنكي' : 'Bank Wire', icon: Building2, badge: isArabic ? 'رسمي' : 'Wire', color: 'border-amber-500' }
                ].map(method => {
                  const Icon = method.icon;
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all text-xs font-semibold cursor-pointer relative ${
                        isSelected
                          ? method.id === 'instapay'
                            ? 'border-[#a855f7] bg-[#a855f7]/20 text-white shadow-[0_0_18px_rgba(168,85,247,0.35)]'
                            : method.id === 'knet'
                            ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]'
                            : method.id === 'google_pay'
                            ? 'border-blue-400 bg-blue-500/20 text-white shadow-[0_0_18px_rgba(59,130,246,0.35)]'
                            : 'border-[#d4af37] bg-[#d4af37]/15 text-[#ffd700] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                          : 'border-white/10 bg-[#14151f] text-[#8a8d9a] hover:border-white/25'
                      }`}
                    >
                      {method.badge && (
                        <span className={`absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                          isSelected ? 'bg-[#d4af37] text-black font-extrabold' : 'bg-white/10 text-[#c5c8d6]'
                        }`}>
                          {method.badge}
                        </span>
                      )}
                      <Icon className={`w-4 h-4 ${
                        isSelected 
                          ? method.id === 'instapay' ? 'text-[#c084fc]' : method.id === 'knet' ? 'text-cyan-400' : method.id === 'google_pay' ? 'text-blue-400' : 'text-[#d4af37]'
                          : 'text-[#8a8d9a]'
                      }`} />
                      <span className="text-center text-[10px] leading-tight font-medium line-clamp-1">{method.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* InstaPay Specific Gateway Panel */}
            {paymentMethod === 'instapay' && (
              <div className="mb-6 rounded-2xl bg-gradient-to-b from-[#17132a] via-[#10111d] to-[#0c0d14] border border-[#a855f7]/40 shadow-[0_8px_35px_rgba(168,85,247,0.25)] overflow-hidden">
                {/* Top Egyptian Central Bank / IPN Network Header */}
                <div className="px-5 py-3.5 bg-gradient-to-r from-[#2e1065]/80 via-[#1e1145]/60 to-[#0f172a]/80 border-b border-[#a855f7]/25 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a855f7] to-[#6b21a8] flex items-center justify-center text-white shadow-md">
                      <Zap className="w-4 h-4 fill-white text-white" />
                    </div>
                    <div className="text-right rtl:text-right ltr:text-left">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{isArabic ? 'شبكة المدفوعات اللحظية المصرية (IPN)' : 'Egyptian Instant Payment Network (IPN)'}</span>
                      </div>
                      <div className="text-[10px] text-[#c084fc] font-medium">
                        {isArabic ? 'معتمد ومراقب من البنك المركزي المصري' : 'Supervised by Central Bank of Egypt'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#a855f7]/20 text-[#e9d5ff] border border-[#a855f7]/30 font-bold">
                    InstaPay Direct
                  </span>
                </div>

                <div className="p-5 text-center">
                  {/* Digital Payment Card Mockup */}
                  <div className="max-w-md mx-auto p-4 rounded-xl bg-[#090a10] border border-[#a855f7]/30 shadow-inner mb-4 text-right rtl:text-right ltr:text-left">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                      <span className="text-[11px] text-[#9ea3b5]">
                        {isArabic ? 'المستفيد المعتمد:' : 'Verified Payee:'}
                      </span>
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                        {isArabic ? 'شركة إتش آر نافيجيتور للاستشارات' : 'HR Navigator Consultations'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[11px] text-[#9ea3b5]">
                        {isArabic ? 'قناة الدفع اللحظي (IPN):' : 'Payment Channel:'}
                      </span>
                      <div className="inline-flex items-center gap-1.5 bg-[#17142b] px-3 py-1.5 rounded-lg border border-[#a855f7]/50">
                        <Zap className="w-3.5 h-3.5 fill-[#a855f7] text-[#a855f7]" />
                        <span className="font-mono text-xs font-bold text-[#e9d5ff] tracking-wider">
                          INSTAPAY EGYPT
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                          {isArabic ? 'متصل' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-[11px] text-[#9ea3b5]">
                        {isArabic ? 'قيمة الاستشارة المستحقة:' : 'Consultation Fee Due:'}
                      </span>
                      <span className="font-mono text-sm font-extrabold text-[#ffd700]">
                        {formatAmount(convertedTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Main Action Link Button (Same Target URL) */}
                  <a
                    id="btn-instapay-payment-link"
                    href={INSTAPAY_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-md mx-auto py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] hover:from-[#9333ea] hover:to-[#5b21b6] text-white font-black text-sm shadow-[0_4px_25px_rgba(139,92,246,0.45)] flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] mb-3 cursor-pointer group"
                  >
                    <Zap className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                    <span>{isArabic ? 'الدفع الآمن الآن عبر InstaPay' : 'Pay Securely via InstaPay Now'}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform rtl:group-hover:-translate-x-0.5" />
                  </a>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#34d399] font-medium mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{isArabic ? 'تحويل فوري مباشر وآمن 100% إلى الحساب البنكي' : '100% Secure & Direct Instant Bank Transfer'}</span>
                  </div>

                  {/* Helper text */}
                  <p className="text-[10px] text-[#8a8d9a] leading-relaxed max-w-md mx-auto">
                    {isArabic 
                      ? 'سينقلك الزر أعلاه إلى بوابة InstaPay المعتمدة لتحويل الرسوم بدقة وأمان. بعد إتمام التحويل، اضغط على زر "تأكيد وإصدار الفاتورة" بالأسفل لاستلام فاتورتك الضريبية الموثقة.'
                      : 'The button securely opens the official InstaPay gateway to settle fees. After transferring, click the confirmation button below to generate your invoice.'}
                  </p>
                </div>
              </div>
            )}

            {/* K-Net Kuwait National Payment Gateway Panel */}
            {paymentMethod === 'knet' && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-b from-[#0c1824] via-[#101926] to-[#0a1017] border border-cyan-500/40 shadow-[0_4px_30px_rgba(6,182,212,0.15)] text-right rtl:text-right ltr:text-left">
                {/* K-Net Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 rounded bg-gradient-to-r from-[#006699] to-[#0099cc] text-white font-black text-xs tracking-wider flex items-center gap-1.5 shadow-sm">
                      <span>🇰🇼 K-NET</span>
                    </div>
                    <span className="text-xs font-bold text-white">
                      {isArabic ? 'بوابة الدفع الإلكتروني الكويتية' : 'Kuwait Electronic Payment Network'}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
                    {formatKWD}
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* Bank Selection */}
                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-200 mb-1">
                      {isArabic ? 'اختر البنك المصدر للبطاقة (البنوك الكويتية):' : 'Select Issuing Kuwaiti Bank:'}
                    </label>
                    <select
                      value={knetBank}
                      onChange={e => {
                        const b = e.target.value;
                        setKnetBank(b);
                        if (b === 'nbk') setKnetPrefix('518391');
                        else if (b === 'kfh') setKnetPrefix('521147');
                        else if (b === 'boubyan') setKnetPrefix('532644');
                        else if (b === 'gulf') setKnetPrefix('450778');
                        else if (b === 'burgan') setKnetPrefix('526206');
                        else if (b === 'warba') setKnetPrefix('537015');
                        else if (b === 'cbk') setKnetPrefix('531470');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#08121c] border border-cyan-500/30 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="nbk">بنك الكويت الوطني - NBK (National Bank of Kuwait)</option>
                      <option value="kfh">بيت التمويل الكويتي - KFH (Kuwait Finance House)</option>
                      <option value="boubyan">بنك بوبيان - Boubyan Bank</option>
                      <option value="gulf">بنك الخليج - Gulf Bank Kuwait</option>
                      <option value="burgan">بنك برقان - Burgan Bank</option>
                      <option value="warba">بنك وربة - Warba Bank</option>
                      <option value="cbk">البنك التجاري الكويتي - Commercial Bank</option>
                    </select>
                  </div>

                  {/* K-Net Card Number with Prefix */}
                  <div>
                    <label className="block text-[11px] font-semibold text-cyan-200 mb-1">
                      {isArabic ? 'رقم بطاقة K-Net:' : 'K-Net Card Number:'}
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="col-span-1 px-3 py-2 rounded-xl bg-[#060c13] border border-cyan-500/40 text-xs font-mono text-cyan-400 text-center font-bold">
                        {knetPrefix}
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          maxLength={10}
                          value={knetCardNum}
                          onChange={e => setKnetCardNum(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••• •••• ••"
                          className="w-full px-3 py-2 rounded-xl bg-[#08121c] border border-cyan-500/30 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expiration and PIN */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-cyan-200 mb-1">
                        {isArabic ? 'تاريخ الانتهاء (شهر / سنة):' : 'Expiry (MM / YY):'}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          maxLength={2}
                          value={knetMonth}
                          onChange={e => setKnetMonth(e.target.value)}
                          placeholder="MM"
                          className="w-full px-2 py-2 text-center rounded-xl bg-[#08121c] border border-cyan-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                        />
                        <input
                          type="text"
                          maxLength={2}
                          value={knetYear}
                          onChange={e => setKnetYear(e.target.value)}
                          placeholder="YY"
                          className="w-full px-2 py-2 text-center rounded-xl bg-[#08121c] border border-cyan-500/30 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-cyan-200 mb-1">
                        {isArabic ? 'الرقم السري للبطاقة (PIN):' : 'Card PIN:'}
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={knetPin}
                        onChange={e => setKnetPin(e.target.value)}
                        placeholder="••••"
                        className="w-full px-3 py-2 rounded-xl bg-[#08121c] border border-cyan-500/30 text-xs font-mono text-white tracking-widest focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-cyan-500/20 text-[10px] text-cyan-300/80 flex items-center justify-between">
                  <span>🔒 {isArabic ? 'معاملة بنكية مشفرة عبر شبكة شركة كي نت الرسمية' : 'Direct encrypted connection to K-Net Banking Network'}</span>
                  <span className="font-mono text-white font-bold">Kuwait Central Bank Regulated</span>
                </div>
              </div>
            )}

            {/* Google Pay Gateway Panel */}
            {paymentMethod === 'google_pay' && (
              <div className="mb-6 p-5 rounded-2xl bg-gradient-to-b from-[#141724] via-[#10121b] to-[#0b0c13] border border-blue-500/40 shadow-[0_4px_30px_rgba(59,130,246,0.15)] text-center relative overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Google Pay Logo Header */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="px-3 py-1.5 rounded-full bg-white text-black font-extrabold text-sm flex items-center gap-1.5 shadow-md">
                    <span className="font-bold tracking-tight flex items-center">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                    </span>
                    <span className="text-[#5f6368] font-medium ml-1">Pay</span>
                  </div>
                </div>

                <p className="text-xs text-[#c5c8d6] mb-3">
                  {isArabic ? 'الدفع الآمن بنقرة واحدة عبر حساب جوجل وبطاقاتك المحفوظة' : 'Fast, simple, and secure checkout with your Google Account'}
                </p>

                {/* Connected Google Account info */}
                <div className="p-3 rounded-xl bg-[#0c0e17] border border-white/10 mb-3 text-right rtl:text-right ltr:text-left space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8a8d9a]">{isArabic ? 'الحساب المرتبط:' : 'Connected Account:'}</span>
                    <span className="font-mono font-bold text-white flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                      {googlePayAccount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <span className="text-[#8a8d9a]">{isArabic ? 'البطاقة الافتراضية في Google Wallet:' : 'Selected Wallet Card:'}</span>
                    <span className="font-mono text-[#ffd700] font-semibold">Visa Platinum •••• 9102</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#9ea3b5] flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>{isArabic ? 'محمي بواسطة تشفير رقم الحساب الافتراضي من Google' : 'Protected by Google Virtual Account Tokenization'}</span>
                </div>
              </div>
            )}

            {/* Visa / MasterCard / AMEX Card Panel */}
            {(paymentMethod === 'card' || paymentMethod === 'mada') && (
              <div className="mb-6 p-4 rounded-xl bg-[#141520] border border-[#d4af37]/25">
                {/* Brand Selector for Credit Card */}
                {paymentMethod === 'card' && (
                  <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-white/10">
                    <span className="text-xs text-[#9ea3b5]">{isArabic ? 'نوع البطاقة:' : 'Card Network:'}</span>
                    {[
                      { id: 'visa', name: 'VISA' },
                      { id: 'mastercard', name: 'MasterCard' },
                      { id: 'amex', name: 'American Express' }
                    ].map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setCardBrand(b.id as any)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          cardBrand === b.id 
                            ? 'bg-[#d4af37] text-black shadow' 
                            : 'bg-[#0d0e14] text-[#8a8d9a] hover:text-white border border-white/10'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Visual Gold Card Preview */}
                <div className={`w-full h-40 rounded-xl border p-4 flex flex-col justify-between mb-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all ${
                  paymentMethod === 'mada'
                    ? 'bg-gradient-to-tr from-[#0a1a12] via-[#10241a] to-[#0c130f] border-emerald-500/40'
                    : cardBrand === 'mastercard'
                    ? 'bg-gradient-to-tr from-[#1f120e] via-[#2d1b14] to-[#120e0c] border-amber-500/40'
                    : cardBrand === 'amex'
                    ? 'bg-gradient-to-tr from-[#0f1f21] via-[#152e31] to-[#0d1617] border-cyan-500/40'
                    : 'bg-gradient-to-tr from-[#171922] via-[#2a271f] to-[#121319] border-[#d4af37]/40'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-[#ffd700] font-mono tracking-widest uppercase">
                      {paymentMethod === 'mada' ? 'MADA BUSINESS DEBIT' : `${cardBrand.toUpperCase()} ENTERPRISE PLATINUM`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {cardBrand === 'mastercard' && paymentMethod !== 'mada' ? (
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                          <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                          <div className="w-5 h-5 rounded-full bg-amber-400 opacity-90" />
                        </div>
                      ) : (
                        <div className="w-8 h-6 rounded bg-gradient-to-br from-[#ffd700] to-[#b38312] opacity-80" />
                      )}
                    </div>
                  </div>
                  <div className="font-mono text-base tracking-widest text-[#ffd700]">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-[10px] text-[#c5c8d6]">
                    <div>
                      <span className="text-[#7e8295] block text-[8px] uppercase">CARDHOLDER / COMPANY</span>
                      <span className="font-medium tracking-wider">{cardHolder || 'VALUED ENTERPRISE'}</span>
                    </div>
                    <div>
                      <span className="text-[#7e8295] block text-[8px] uppercase">EXPIRES</span>
                      <span className="font-mono">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-[#9ea3b5] mb-1">{t.cardNumber}</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 rounded-lg bg-[#0e0f16] border border-white/10 focus:border-[#ffd700] text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#9ea3b5] mb-1">{t.cardExpiry}</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0f16] border border-white/10 focus:border-[#ffd700] text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9ea3b5] mb-1">{t.cardCvv}</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={e => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3 py-2 rounded-lg bg-[#0e0f16] border border-white/10 focus:border-[#ffd700] text-xs font-mono text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="mb-6 p-5 rounded-xl bg-[#141520] border border-[#d4af37]/30 text-center">
                <Smartphone className="w-8 h-8 text-[#d4af37] mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">
                  Apple Pay Touch / Face ID
                </h4>
                <p className="text-xs text-[#9ea3b5]">
                  {isArabic 
                    ? 'سيتم التحقق عبر البصمة البيومترية المعتمدة فور الضغط على زر الدفع.' 
                    : 'Biometric authorization will be prompted on your trusted Apple device.'}
                </p>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="mb-6 p-4 rounded-xl bg-[#141520] border border-[#d4af37]/30 text-xs space-y-2 text-right rtl:text-right ltr:text-left">
                <div className="font-bold text-[#ffd700] mb-1">
                  {isArabic ? 'الحساب البنكي الرسمي - البنك التجاري الدولي (CIB مصر) والبنك الأهلي' : 'Official Corporate Wire - CIB Bank Egypt & NBE'}
                </div>
                <div className="flex justify-between text-[#9ea3b5]">
                  <span>{isArabic ? 'اسم المستفيد:' : 'Beneficiary:'}</span>
                  <span className="text-white">HR Navigator Consultations Co. LLC</span>
                </div>
                <div className="flex justify-between text-[#9ea3b5]">
                  <span>IBAN (مصر EGP):</span>
                  <span className="font-mono text-[#ffd700]">EG38 0010 0045 0000 1029 8812 001</span>
                </div>
                <div className="flex justify-between text-[#9ea3b5]">
                  <span>SWIFT:</span>
                  <span className="font-mono text-white">CIBEEGCX</span>
                </div>
              </div>
            )}

            {/* Pay Button */}
            <button
              id="btn-confirm-payment"
              type="button"
              disabled={processing}
              onClick={handleProcessPayment}
              className={`w-full py-3.5 rounded-xl text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-lg ${
                paymentMethod === 'instapay'
                  ? 'bg-gradient-to-r from-[#c084fc] via-[#8b5cf6] to-[#6d28d9] text-white shadow-[0_4px_25px_rgba(139,92,246,0.45)] hover:brightness-110'
                  : paymentMethod === 'knet'
                  ? 'bg-gradient-to-r from-[#0088cc] via-[#006699] to-[#004466] text-white shadow-[0_4px_25px_rgba(6,182,212,0.4)] hover:brightness-110'
                  : paymentMethod === 'google_pay'
                  ? 'bg-white text-[#1f1f1f] shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:bg-slate-100'
                  : paymentMethod === 'mada'
                  ? 'bg-gradient-to-r from-[#059669] via-[#047857] to-[#065f46] text-white shadow-[0_4px_25px_rgba(5,150,105,0.4)] hover:brightness-110'
                  : 'bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-[#0c0d12] shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-[0.99]'
              }`}
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.processingPayment}</span>
                </>
              ) : (
                <>
                  {paymentMethod === 'instapay' ? (
                    <>
                      <Zap className="w-4 h-4 fill-white text-white" />
                      <span>{isArabic ? 'إرسال النقود عبر InstaPay وتأكيد الحجز' : 'Send Money via InstaPay & Confirm'} ({formatAmount(convertedTotal)})</span>
                    </>
                  ) : paymentMethod === 'knet' ? (
                    <>
                      <Landmark className="w-4 h-4 text-cyan-300" />
                      <span>{isArabic ? 'تأكيد ودفع عبر كي نت K-NET الكويت' : 'Pay via K-Net Kuwait'} ({formatKWD})</span>
                    </>
                  ) : paymentMethod === 'google_pay' ? (
                    <>
                      <Wallet className="w-4 h-4 text-[#4285F4]" />
                      <span className="font-bold flex items-center gap-1">
                        <span>{isArabic ? 'إتمام الشراء فوراً بـ' : 'Pay with'}</span>
                        <span className="font-black text-black">Google Pay</span>
                      </span>
                      <span className="text-xs text-neutral-600 font-mono">({formatAmount(convertedTotal)})</span>
                    </>
                  ) : paymentMethod === 'card' ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{isArabic ? `دفع آمن بالبطاقة (${cardBrand.toUpperCase()})` : `Secure Pay with ${cardBrand.toUpperCase()}`} ({formatAmount(convertedTotal)})</span>
                    </>
                  ) : paymentMethod === 'mada' ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isArabic ? 'تأكيد الدفع عبر بطاقة مدى' : 'Pay with Mada Debit'} ({formatAmount(convertedTotal)})</span>
                    </>
                  ) : paymentMethod === 'apple_pay' ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      <span>{isArabic ? 'الدفع والتأكيد عبر Apple Pay' : 'Pay with Apple Pay'} ({formatAmount(convertedTotal)})</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      <span>{t.payNow} ({formatAmount(convertedTotal)})</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
