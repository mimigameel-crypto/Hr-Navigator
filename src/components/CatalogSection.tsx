import React, { useState } from 'react';
import { 
  Check, 
  ShoppingBag, 
  Zap, 
  Sparkles, 
  Shield, 
  Filter,
  Coins
} from 'lucide-react';
import { Language, LuxuryService, Currency } from '../types';
import { translations } from '../translations';
import { 
  formatCurrencyValue, 
  ALL_CURRENCIES, 
  currencies,
  getServiceDisplayPrice,
  getServiceOriginalDisplayPrice
} from '../utils/currency';

interface CatalogSectionProps {
  lang: Language;
  currentCurrency: Currency;
  onSelectCurrency: (c: Currency) => void;
  services: LuxuryService[];
  onAddToCart: (service: LuxuryService) => void;
  onInstantBuy: (service: LuxuryService) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  lang,
  currentCurrency,
  onSelectCurrency,
  services,
  onAddToCart,
  onInstantBuy
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories based on current language
  const categories = [
    { id: 'all', label: t.allCategories },
    ...Array.from(new Set(services.map(s => isArabic ? s.categoryAr : s.categoryEn))).map(cat => ({
      id: cat,
      label: cat
    }))
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => (isArabic ? s.categoryAr : s.categoryEn) === selectedCategory);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(isArabic ? 'ar-SA' : 'en-US').format(amount);
  };

  return (
    <section id="catalog-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#14151e] text-xs font-semibold text-[#ffd700] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{t.exclusive}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          {t.catalogTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#9ea3b5]">
          {t.catalogSubtitle}
        </p>

        {/* Category Pill Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] shadow-[0_2px_15px_rgba(212,175,55,0.3)]'
                  : 'bg-[#14151e] text-[#9ea3b5] hover:text-white border border-[#d4af37]/15 hover:border-[#d4af37]/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Currency Quick Switcher Strip */}
        <div className="mt-5 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-xs text-[#9ea3b5] flex items-center gap-1.5 font-medium">
            <Coins className="w-4 h-4 text-[#ffd700]" />
            <span>{isArabic ? 'عملة عرض الأسعار الحالية:' : 'Active Display Currency:'}</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {ALL_CURRENCIES.map(code => {
              const item = currencies[code];
              const isSelected = currentCurrency === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onSelectCurrency(code)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                      : 'bg-[#141520] text-[#9ea3b5] hover:text-white border border-[#d4af37]/20 hover:border-[#d4af37]/50'
                  }`}
                >
                  <span className="text-sm">{item.flag}</span>
                  <span className="font-mono">{code}</span>
                  <span className="text-[10px] opacity-80 font-normal">
                    ({isArabic ? item.symbolAr : item.symbolEn})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map(service => {
          const title = isArabic ? service.titleAr : service.titleEn;
          const category = isArabic ? service.categoryAr : service.categoryEn;
          const description = isArabic ? service.descriptionAr : service.descriptionEn;
          const features = isArabic ? service.featuresAr : service.featuresEn;
          const badge = isArabic ? service.badgeAr : service.badgeEn;

          return (
            <div
              key={service.id}
              id={`service-card-${service.id}`}
              className="group relative rounded-2xl bg-[#12131b] border border-[#d4af37]/20 hover:border-[#d4af37]/60 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_10px_35px_rgba(212,175,55,0.15)] hover:-translate-y-1"
            >
              {/* Image Container with Luxury Overlay */}
              <div className="relative h-60 w-full overflow-hidden bg-[#0c0d12]">
                <img
                  src={service.image}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12131b] via-transparent to-black/40" />

                {/* Badge */}
                {badge && (
                  <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 px-3 py-1 rounded-full bg-[#0c0d12]/90 border border-[#d4af37]/50 text-[11px] font-bold text-[#ffd700] backdrop-blur-md shadow-sm">
                    {badge}
                  </div>
                )}

                {/* Category Label */}
                <div className="absolute bottom-3 left-4 rtl:left-auto rtl:right-4 text-xs font-semibold text-[#d4af37] bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/5">
                  {category}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#ffd700] transition-colors leading-snug">
                      {title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9ea3b5] line-clamp-2 mb-4 leading-relaxed">
                    {description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-white/5">
                    <span className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider block">
                      {t.featuresIncluded}
                    </span>
                    {features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#c5c8d6]">
                        <Check className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Area */}
                <div className="pt-4 border-t border-[#d4af37]/15">
                  <div className="flex items-end justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-[#8a8d9a] block font-medium">
                        {t.vatIncluded}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold gold-gradient-text font-serif">
                          {getServiceDisplayPrice(service, currentCurrency, lang).formatted}
                        </span>
                        <span className="text-xs font-semibold text-[#d4af37]">
                          {getServiceDisplayPrice(service, currentCurrency, lang).symbol}
                        </span>
                      </div>
                    </div>

                    {(service.originalPrice || service.exactOriginalPrices) && (
                      <div className="text-xs text-[#717585] line-through font-mono">
                        {getServiceOriginalDisplayPrice(service, currentCurrency, lang)?.displayWithSymbol}
                      </div>
                    )}
                  </div>

                  {/* Buttons Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      id={`btn-cart-${service.id}`}
                      type="button"
                      onClick={() => onAddToCart(service)}
                      className="py-2.5 px-3 rounded-xl border border-[#d4af37]/35 bg-[#171923] hover:bg-[#202230] text-[#ffd700] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>

                    <button
                      id={`btn-instant-pay-${service.id}`}
                      type="button"
                      onClick={() => onInstantBuy(service)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{t.bookNow}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
