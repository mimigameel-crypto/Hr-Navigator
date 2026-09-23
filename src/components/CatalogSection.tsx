import React, { useState } from 'react';
import { 
  Check, 
  ShoppingBag, 
  Zap, 
  Sparkles, 
  Clock, 
  Coins, 
  Search, 
  X, 
  GraduationCap, 
  Info, 
  ShieldAlert, 
  Send, 
  Calendar,
  Layers
} from 'lucide-react';
import { Language, LuxuryService, Currency } from '../types';
import { translations } from '../translations';
import { 
  ALL_CURRENCIES, 
  currencies,
  getServiceDisplayPrice,
  getServiceOriginalDisplayPrice
} from '../utils/currency';
import { CustomQuoteModal } from './CustomQuoteModal';
import { ServiceDetailsModal } from './ServiceDetailsModal';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals for Custom Quote and Full Details
  const [selectedDetailService, setSelectedDetailService] = useState<LuxuryService | null>(null);
  const [selectedQuoteService, setSelectedQuoteService] = useState<LuxuryService | null>(null);

  // Extract unique categories based on current language
  const categories = [
    { id: 'all', label: t.allCategories },
    ...Array.from(new Set(services.map(s => isArabic ? s.categoryAr : s.categoryEn))).map(cat => ({
      id: cat,
      label: cat
    }))
  ];

  // Filter services by category and real-time title search
  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'all' || (isArabic ? s.categoryAr : s.categoryEn) === selectedCategory;
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return matchesCategory;

    const matchesTitle = 
      (isArabic ? s.titleAr : s.titleEn).toLowerCase().includes(cleanQuery) ||
      s.titleAr.toLowerCase().includes(cleanQuery) ||
      s.titleEn.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesTitle;
  });

  return (
    <section id="catalog-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#d4af37]/35 bg-[#14151e] text-xs font-semibold text-[#ffd700] mb-3.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>HR Navigator Consultations</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 tracking-tight font-serif">
          {t.catalogTitle}
        </h2>
        <p className="text-sm sm:text-base text-[#9ea3b5] max-w-2xl mx-auto">
          {t.catalogSubtitle}
        </p>

        {/* Real-Time Search Bar */}
        <div className="mt-7 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchServices}
              aria-label={t.searchServices}
              className="w-full pl-10 pr-10 rtl:pl-10 rtl:pr-10 py-3 rounded-2xl bg-[#141520] border border-[#d4af37]/25 focus:border-[#ffd700] text-white placeholder-[#717585] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                id="catalog-search-clear-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                title={t.clearSearch}
                aria-label={t.clearSearch}
                className="absolute right-3.5 rtl:right-auto rtl:left-3.5 text-[#8a8d9a] hover:text-[#ffd700] p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="flex items-center justify-between text-[11px] text-[#8a8d9a] mt-2 px-2">
              <span>
                {isArabic 
                  ? `نتائج البحث: ${filteredServices.length} خدمة متطابقة`
                  : `Search results: ${filteredServices.length} matching item${filteredServices.length === 1 ? '' : 's'}`}
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#d4af37] hover:underline cursor-pointer"
              >
                {t.clearSearch}
              </button>
            </div>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mt-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] shadow-[0_2px_15px_rgba(212,175,55,0.3)] font-bold'
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
            <span>{isArabic ? 'عملة العرض الحالية:' : 'Display Currency:'}</span>
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

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div id="catalog-no-results" className="text-center py-16 px-6 bg-[#12131b] rounded-2xl border border-[#d4af37]/20 max-w-md mx-auto my-6">
          <Search className="w-10 h-10 text-[#d4af37]/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">
            {t.noSearchResults}
          </h3>
          {searchQuery && (
            <p className="text-xs text-[#8a8d9a] mb-5">
              "{searchQuery}"
            </p>
          )}
          <button
            id="btn-reset-catalog-filter"
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
          >
            {t.clearSearch}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredServices.map(service => {
            const title = isArabic ? service.titleAr : service.titleEn;
            const category = isArabic ? service.categoryAr : service.categoryEn;
            const description = isArabic ? service.descriptionAr : service.descriptionEn;
            const outcome = isArabic ? service.singleLineOutcomeAr : service.singleLineOutcomeEn;
            const deliverables = (isArabic ? service.keyDeliverablesAr : service.keyDeliverablesEn) || (isArabic ? service.featuresAr : service.featuresEn);
            const duration = isArabic ? service.estimatedDurationAr : service.estimatedDurationEn;
            const badge = isArabic ? service.badgeAr : service.badgeEn;
            const pricePrefix = isArabic 
              ? (service.pricePrefixAr || 'يبدأ من') 
              : (service.pricePrefixEn || 'Starts from');
            const priceInfo = getServiceDisplayPrice(service, currentCurrency, lang);

            // Determine Primary Action Type
            const isTraining = service.serviceType === 'training';
            const isDiagnosticAdvisory = service.primaryActionType === 'book_diagnostic';

            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group relative rounded-2xl bg-[#11131c] border border-[#d4af37]/25 hover:border-[#d4af37]/65 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_12px_40px_rgba(212,175,55,0.18)] hover:-translate-y-1"
              >
                {/* Image Container with Luxury Overlay */}
                <div className="relative h-52 w-full overflow-hidden bg-[#0a0b10]">
                  <img
                    src={service.image}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131c] via-[#11131c]/40 to-black/50" />

                  {/* Single Badge - strictly no multiple best-sellers */}
                  {badge && (
                    <div className={`absolute top-3.5 right-3.5 rtl:right-auto rtl:left-3.5 z-10 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
                      service.id === 'srv-trn-jun-02'
                        ? 'bg-gradient-to-r from-emerald-950/95 to-[#0b1411]/95 border border-emerald-400/60 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : service.id === 'srv-od-01'
                        ? 'bg-[#0c0d12]/95 border border-[#d4af37] text-[#ffd700] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                        : 'bg-[#0c0d12]/90 border border-white/20 text-white'
                    }`}>
                      {service.id === 'srv-trn-jun-02' && <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{badge}</span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute bottom-3 left-3.5 rtl:left-auto rtl:right-3.5 text-[11px] font-bold text-[#d4af37] bg-[#0c0d14]/85 px-2.5 py-1 rounded-md backdrop-blur-sm border border-[#d4af37]/20">
                    {category}
                  </div>
                </div>

                {/* Content Body - Precise Hierarchical Design */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Service Name */}
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ffd700] transition-colors leading-snug mb-2 font-serif">
                      {title}
                    </h3>

                    {/* Single-line Clear Strategic Outcome */}
                    {outcome && (
                      <div className="mb-3 px-3 py-2 rounded-lg bg-[#161826] border-r-2 rtl:border-r-2 ltr:border-l-2 border-[#d4af37] text-[11px] sm:text-xs text-[#e0e3ee] leading-relaxed line-clamp-2">
                        {outcome}
                      </div>
                    )}

                    {/* Description clamped to exactly 2 lines */}
                    <p className="text-xs text-[#9ea3b5] line-clamp-2 mb-4 leading-relaxed">
                      {description}
                    </p>

                    {/* Exactly 3 Key Deliverables */}
                    <div className="space-y-2 mb-5 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider block">
                        {isArabic ? '3 مخرجات رئيسية:' : '3 Key Deliverables:'}
                      </span>
                      {deliverables.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#c9ccd9]">
                          <Check className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Duration & Price & Buttons Footer */}
                  <div className="pt-4 border-t border-[#d4af37]/20">
                    {/* Duration Display */}
                    {duration && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8a8d9a] mb-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span className="text-[11px] font-medium text-[#c5c8d6]">
                          {isArabic ? 'مدة التنفيذ التقديرية:' : 'Est. Duration:'} {duration}
                        </span>
                      </div>
                    )}

                    {/* Enlarge Price Area */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[11px] font-semibold text-[#8a8d9a] block">
                          {pricePrefix}
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          {service.customPriceNoteAr && service.id === 'srv-rec-02' ? (
                            <span className="text-lg sm:text-xl font-black gold-gradient-text font-serif">
                              {isArabic ? '22% من الراتب السنوي' : '22% of Annual Salary'}
                            </span>
                          ) : (
                            <>
                              <span className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-serif">
                                {priceInfo.formatted}
                              </span>
                              <span className="text-xs font-bold text-[#d4af37]">
                                {priceInfo.symbol}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Course / Program Quick Note */}
                      {isTraining && (
                        <div className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/25">
                          {service.id === 'srv-trn-jun-02'
                            ? (isArabic ? 'خصم 45% للطلبة' : '45% Student Off')
                            : (isArabic ? 'شهادة معتمدة' : 'Certified')}
                        </div>
                      )}
                    </div>

                    {/* Actions Grid: Primary Action & Secondary Action */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {/* Secondary Button: عرض التفاصيل (View Details) */}
                      <button
                        id={`btn-details-${service.id}`}
                        type="button"
                        onClick={() => setSelectedDetailService(service)}
                        className="py-2.5 px-3 rounded-xl border border-[#d4af37]/35 bg-[#171926] hover:bg-[#222436] text-[#ffd700] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'عرض التفاصيل' : 'View Details'}</span>
                      </button>

                      {/* Primary Button: 
                          - اطلب عرضًا مخصصًا for consulting 
                          - احجز استشارة تشخيصية for individual advisory 
                          - احجز الآن for training */}
                      {isTraining ? (
                        <button
                          id={`btn-enroll-${service.id}`}
                          type="button"
                          onClick={() => onInstantBuy(service)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{isArabic ? 'احجز الآن' : 'Book Now'}</span>
                        </button>
                      ) : isDiagnosticAdvisory ? (
                        <button
                          id={`btn-advisory-${service.id}`}
                          type="button"
                          onClick={() => onInstantBuy(service)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>{isArabic ? 'احجز استشارة تشخيصية' : 'Book Diagnostic'}</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-custom-quote-${service.id}`}
                          type="button"
                          onClick={() => setSelectedQuoteService(service)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold shadow-[0_2px_12px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 fill-current" />
                          <span>{isArabic ? 'اطلب عرضًا مخصصًا' : 'Request Quote'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Unified Legal & Pricing Disclaimer Box Under All Packages */}
      <div 
        id="unified-pricing-disclaimer" 
        className="mt-12 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12131e] via-[#151724] to-[#12131e] border border-[#d4af37]/30 shadow-md text-center max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-[#c0c4d4] leading-relaxed"
      >
        <ShieldAlert className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
        <p className="font-medium">
          {isArabic ? (
            <>
              <span className="font-bold text-[#ffd700]">تنبيه موحد: </span>
              الأسعار استرشادية وتُحدد نهائيًا وفق عدد الموظفين والفروع والوظائف ونطاق التنفيذ. الأسعار لا تشمل الضرائب أو التراخيص أو مصروفات الانتقال – إن وجدت.
            </>
          ) : (
            <>
              <span className="font-bold text-[#ffd700]">Unified Notice: </span>
              Prices are indicative and finalized based on employee count, branches, positions, and implementation scope. Prices exclude taxes, software licenses, or travel expenses where applicable.
            </>
          )}
        </p>
      </div>

      {/* Modals for Custom Quote and Service Details */}
      <CustomQuoteModal
        isOpen={Boolean(selectedQuoteService)}
        onClose={() => setSelectedQuoteService(null)}
        service={selectedQuoteService}
        lang={lang}
        currentCurrency={currentCurrency}
      />

      <ServiceDetailsModal
        isOpen={Boolean(selectedDetailService)}
        onClose={() => setSelectedDetailService(null)}
        service={selectedDetailService}
        lang={lang}
        currentCurrency={currentCurrency}
        onRequestQuote={(service) => setSelectedQuoteService(service)}
        onInstantBuy={(service) => onInstantBuy(service)}
      />
    </section>
  );
};
