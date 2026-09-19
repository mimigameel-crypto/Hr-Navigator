import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, OrderItem, Currency } from '../types';
import { translations } from '../translations';
import { formatCurrencyValue, convertFromSAR } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  lang: Language;
  currentCurrency: Currency;
  items: OrderItem[];
  onClose: () => void;
  onRemoveItem: (serviceId: string) => void;
  onUpdateQuantity: (serviceId: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  lang,
  currentCurrency,
  items,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Calculate unit price in active currency with exactPrices support
  const getItemUnitPrice = (item: OrderItem): number => {
    if (item.exactPrices && item.exactPrices[currentCurrency] !== undefined) {
      return item.exactPrices[currentCurrency]!;
    }
    return convertFromSAR(item.price, currentCurrency);
  };

  const totalConverted = items.reduce((sum, i) => sum + getItemUnitPrice(i) * i.quantity, 0);
  // Final price is all-inclusive (VAT included)
  const includedTaxConverted = Math.round((totalConverted * 0.15) / 1.15);

  const formatItemPrice = (item: OrderItem) => {
    const unit = getItemUnitPrice(item);
    return formatCurrencyValue(item.price, currentCurrency, lang, unit).displayWithSymbol;
  };

  const formatAmount = (val: number) => {
    return formatCurrencyValue(0, currentCurrency, lang, val).displayWithSymbol;
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-all"
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#0f1017] border-l rtl:border-l-0 rtl:border-r border-[#d4af37]/30 h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-base font-bold text-white">
                {t.cart} ({items.length})
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a8d9a] hover:text-white hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#717585]">
              <ShoppingBag className="w-12 h-12 text-[#d4af37]/40 mx-auto mb-3" />
              <p className="text-sm">{t.emptyCart}</p>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-white/5">
              {items.map(item => (
                <div key={item.serviceId} className="pt-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm line-clamp-1">
                      {isArabic ? item.titleAr : item.titleEn}
                    </h4>
                    <div className="font-mono text-[#ffd700] font-bold mt-1">
                      {formatItemPrice(item)}
                    </div>

                    {/* Quantity Modifier */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.serviceId, -1)}
                        className="w-6 h-6 rounded bg-[#1c1e2d] border border-white/10 text-white hover:bg-[#25283b] flex items-center justify-center font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-white px-2">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.serviceId, 1)}
                        className="w-6 h-6 rounded bg-[#1c1e2d] border border-white/10 text-white hover:bg-[#25283b] flex items-center justify-center font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.serviceId)}
                    className="p-2 text-[#717585] hover:text-rose-400 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
            <div className="space-y-1.5 text-xs text-[#9ea3b5]">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span className="font-mono text-white">{formatAmount(totalConverted)}</span>
              </div>
              <div className="flex justify-between text-[#8a8d9a]">
                <span>{isArabic ? 'ضريبة القيمة المضافة (15% مشمولة):' : 'VAT (15% Included):'}</span>
                <span className="font-mono text-[#8a8d9a]">{formatAmount(includedTaxConverted)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>{t.total} ({isArabic ? 'السعر النهائي' : 'Final Price'})</span>
                <span className="gold-gradient-text font-mono text-lg">
                  {formatAmount(totalConverted)}
                </span>
              </div>
            </div>

            <button
              id="cart-checkout-btn"
              type="button"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-[#0c0d12] font-extrabold text-sm shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>{t.checkoutNow}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="pt-1 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 text-[11px] text-[#c084fc]">
                <span>⚡</span>
                <span className="font-semibold">{isArabic ? 'دفع فوري عبر InstaPay متاح' : 'Instant InstaPay Checkout Available'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
