import React, { useState } from 'react';
import { X, Plus, DollarSign } from 'lucide-react';
import { Language, LuxuryService, Order, OrderStatus, PaymentMethod, Currency } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';
import { currencies, ALL_CURRENCIES } from '../utils/currency';

interface ManualOrderModalProps {
  isOpen: boolean;
  lang: Language;
  services: LuxuryService[];
  onClose: () => void;
  onAddOrder: (order: Order) => void;
}

export const ManualOrderModal: React.FC<ManualOrderModalProps> = ({
  isOpen,
  lang,
  services,
  onClose,
  onAddOrder
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const isArabic = lang === 'ar';

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [currency, setCurrency] = useState<Currency>('SAR');
  const [customPrice, setCustomPrice] = useState<number>(services[0]?.price || 50000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [status, setStatus] = useState<OrderStatus>('new');
  const [notes, setNotes] = useState('');

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const s = services.find(item => item.id === id);
    if (s) {
      setCustomPrice(s.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) return;

    const s = services.find(item => item.id === selectedServiceId);
    const subtotal = customPrice;
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal + tax;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `HRN-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: clientName.trim(),
      customerEmail: clientEmail.trim(),
      customerPhone: clientPhone.trim() || '+966 50 000 0000',
      items: [
        {
          serviceId: s?.id || 'custom',
          titleAr: s?.titleAr || 'استشارة استراتيجية مخصصة',
          titleEn: s?.titleEn || 'Bespoke Executive Consultation',
          price: customPrice,
          quantity: 1
        }
      ],
      subtotal,
      tax,
      total,
      currency,
      paymentMethod,
      paymentStatus: 'paid',
      status,
      createdAt: new Date().toISOString(),
      notes: notes.trim(),
      transactionRef: `TXN-ADM-${Math.floor(100000 + Math.random() * 900000)}`
    };

    onAddOrder(newOrder);
    onClose();
  };

  return (
    <div
      id="manual-order-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="manual-order-modal-dialog"
        className="relative w-full max-w-lg rounded-2xl bg-[#0f1017] border border-[#d4af37]/35 shadow-2xl overflow-hidden my-8"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#d4af37]" />
              <span>{t.addManualOrder}</span>
            </h3>
            <p className="text-xs text-[#9ea3b5]">
              {isArabic 
                ? 'إدراج طلب يدوي في السجل الإداري لخدمات كبار الشخصيات' 
                : 'Log a bespoke offline VIP booking directly into the order registry'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#c5c8d6] font-medium mb-1">{t.customerCol}</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="الاسم الكامل للعميل"
                className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#c5c8d6] font-medium mb-1">{t.emailAddress}</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="client@vip.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#c5c8d6] font-medium mb-1">{t.phoneNumber}</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none text-right rtl:text-left"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#c5c8d6] font-medium mb-1">{t.serviceCol}</label>
              <select
                value={selectedServiceId}
                onChange={e => handleServiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-[#12131c]">
                    {isArabic ? s.titleAr : s.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#c5c8d6] font-medium mb-1">
                  {t.amountCol} & {isArabic ? 'العملة' : 'Currency'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customPrice}
                    onChange={e => setCustomPrice(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white font-mono focus:outline-none"
                  />
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as Currency)}
                    className="w-32 px-2 py-2 rounded-xl bg-[#1a1c29] border border-[#d4af37]/40 text-[#ffd700] font-bold text-xs focus:outline-none"
                  >
                    {ALL_CURRENCIES.map(c => {
                      const curr = currencies[c];
                      return (
                        <option key={c} value={c} className="bg-[#12131c]">
                          {curr.flag} {c} ({isArabic ? curr.symbolAr : curr.symbolEn})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#c5c8d6] font-medium mb-1">{t.statusCol}</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none"
                >
                  <option value="new" className="bg-[#12131c]">{t.statusNew}</option>
                  <option value="processing" className="bg-[#12131c]">{t.statusProcessing}</option>
                  <option value="completed" className="bg-[#12131c]">{t.statusCompleted}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#c5c8d6] font-medium mb-1">{t.paymentCol}</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none"
              >
                <option value="instapay" className="bg-[#12131c]">انستاباي InstaPay (mimigameel2025@instapay)</option>
                <option value="card" className="bg-[#12131c]">Credit Card / Visa / Master</option>
                <option value="mada" className="bg-[#12131c]">مدى Mada</option>
                <option value="apple_pay" className="bg-[#12131c]">Apple Pay</option>
                <option value="bank_transfer" className="bg-[#12131c]">Bank Wire Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-[#c5c8d6] font-medium mb-1">ملاحظات إدارية</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="تفاصيل الترتيبات الخاصة..."
                className="w-full px-3 py-2 rounded-xl bg-[#14151f] border border-white/10 focus:border-[#ffd700] text-white focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer mt-2"
            >
              {isArabic ? 'إدراج الطلب وإصدار الفاتورة' : 'Register Order & Generate Invoice'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
