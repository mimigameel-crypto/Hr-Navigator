import React from 'react';
import { 
  X, 
  Check, 
  Clock, 
  Award, 
  BookOpen, 
  GraduationCap, 
  ShieldAlert, 
  Sparkles, 
  Send, 
  Zap, 
  Users, 
  Target, 
  Layers
} from 'lucide-react';
import { Language, LuxuryService, Currency } from '../types';
import { translations } from '../translations';
import { getServiceDisplayPrice } from '../utils/currency';

interface ServiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: LuxuryService | null;
  lang: Language;
  currentCurrency: Currency;
  onRequestQuote: (service: LuxuryService) => void;
  onInstantBuy: (service: LuxuryService) => void;
}

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  isOpen,
  onClose,
  service,
  lang,
  currentCurrency,
  onRequestQuote,
  onInstantBuy
}) => {
  if (!isOpen || !service) return null;

  const isArabic = lang === 'ar';
  const t = translations[lang];

  const title = isArabic ? service.titleAr : service.titleEn;
  const category = isArabic ? service.categoryAr : service.categoryEn;
  const description = isArabic ? service.descriptionAr : service.descriptionEn;
  const outcome = isArabic ? service.singleLineOutcomeAr : service.singleLineOutcomeEn;
  const deliverables = isArabic ? service.keyDeliverablesAr : service.keyDeliverablesEn;
  const duration = isArabic ? service.estimatedDurationAr : service.estimatedDurationEn;
  const priceDisplay = getServiceDisplayPrice(service, currentCurrency, lang);
  const course = service.courseDetails;

  return (
    <div 
      id="service-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="service-details-modal-dialog"
        className="relative w-full max-w-3xl rounded-2xl bg-[#0d0f16] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t.closeModal}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 flex-1">
          {/* Header Area */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#d4af37]/15 text-[#ffd700] border border-[#d4af37]/30">
                {category}
              </span>
              {service.badgeAr && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/15">
                  {isArabic ? service.badgeAr : service.badgeEn}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 font-serif">
              {title}
            </h2>

            {/* One-line Strategic Result */}
            {outcome && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#171926] to-[#12131f] border-r-4 rtl:border-r-4 ltr:border-l-4 border-[#d4af37] text-sm text-[#e6e8f2] font-medium leading-relaxed">
                {outcome}
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#131520] border border-white/5">
              <span className="text-[10px] text-[#8a8d9a] block mb-1 font-medium">
                {isArabic ? (service.pricePrefixAr || 'يبدأ من') : (service.pricePrefixEn || 'Starts from')}
              </span>
              <div className="text-lg font-bold text-[#ffd700] font-mono">
                {priceDisplay.formatted} <span className="text-xs">{priceDisplay.symbol}</span>
              </div>
            </div>

            {duration && (
              <div className="p-3 rounded-xl bg-[#131520] border border-white/5">
                <span className="text-[10px] text-[#8a8d9a] block mb-1 font-medium">
                  {isArabic ? 'مدة التنفيذ التقديرية' : 'Estimated Duration'}
                </span>
                <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{duration}</span>
                </div>
              </div>
            )}

            {course ? (
              <>
                <div className="p-3 rounded-xl bg-[#131520] border border-white/5">
                  <span className="text-[10px] text-[#8a8d9a] block mb-1 font-medium">
                    {isArabic ? 'عدد الجلسات والساعات' : 'Sessions & Hours'}
                  </span>
                  <div className="text-xs sm:text-sm font-semibold text-white mt-1">
                    {course.sessionsCount} {isArabic ? 'جلسات' : 'Sessions'} • {course.trainingHours} {isArabic ? 'ساعة' : 'Hours'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131520] border border-emerald-500/20">
                  <span className="text-[10px] text-emerald-400 block mb-1 font-medium">
                    {isArabic ? 'خصم طلبة الجامعة' : 'Student Discount'}
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300 mt-1">
                    {service.id === 'srv-trn-jun-02' 
                      ? (isArabic ? 'خصم 45% عند الحجز' : '45% Off at Checkout') 
                      : (isArabic ? 'متاح بكارنيه الجامعة' : 'Available with Student ID')}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-3 rounded-xl bg-[#131520] border border-white/5 col-span-2">
                <span className="text-[10px] text-[#8a8d9a] block mb-1 font-medium">
                  {isArabic ? 'المنشأة الاستشارية المسؤولة' : 'Advisory Entity'}
                </span>
                <div className="text-xs font-bold text-[#d4af37] mt-1">
                  HR Navigator Consultations
                </div>
              </div>
            )}
          </div>

          {/* Key Deliverables (3 max or full list) */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#d4af37]" />
              <span>{isArabic ? 'المخرجات والنتائج الرئيسية:' : 'Key Deliverables & Outputs:'}</span>
            </h3>
            <div className="space-y-2.5">
              {(deliverables || service.featuresAr).map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#121420] border border-white/5 text-xs text-[#dcdfe8]">
                  <Check className="w-4 h-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training Course Syllabus Modules */}
          {course && course.modules && (
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#d4af37]" />
                <span>{isArabic ? 'المحاور والوحدات التدريبية المعتمدة (Syllabus):' : 'Certified Training Syllabus Modules:'}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.modules.map((mod, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#121422] border border-[#d4af37]/20 hover:border-[#d4af37]/50 transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37] text-[10px] font-bold text-[#ffd700] flex items-center justify-center font-mono">
                        {mod.number}
                      </span>
                      <h4 className="text-xs font-bold text-white">
                        {isArabic ? mod.titleAr : mod.titleEn}
                      </h4>
                    </div>
                    {mod.descriptionAr && (
                      <p className="text-[11px] text-[#9ea3b5] leading-relaxed pr-7 rtl:pr-7 ltr:pl-7">
                        {isArabic ? mod.descriptionAr : (mod.descriptionEn || mod.descriptionAr)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Student Discount Highlight Banner for Courses */}
          {course?.studentDiscount && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#072419] to-[#0c1822] border border-emerald-500/40 flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#d1fae5] space-y-1">
                <p className="font-bold text-emerald-300">
                  {isArabic ? 'تنويه خصم طلاب الجامعات والمعاهد:' : 'University Student Discount Notice:'}
                </p>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                  {isArabic ? course.studentDiscount.discountNoteAr : course.studentDiscount.discountNoteEn}
                </p>
                {service.id === 'srv-trn-jun-02' && (
                  <p className="text-[11px] font-mono font-bold text-emerald-400 pt-1">
                    {isArabic 
                      ? 'السعر الأساسي للكورس 3,000 ج.م ويصبح 1,650 ج.م للطلاب (خصم 45%) عند تأكيد الحجز وإرفاق صورة الكارنيه.'
                      : 'Base course price is 3,000 EGP, becoming 1,650 EGP for students (45% discount) upon ID verification at checkout.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Unified Disclaimer Box */}
          <div className="p-3.5 rounded-xl bg-[#11121b] border border-[#d4af37]/20 flex items-start gap-2.5 text-[11px] text-[#9ea3b5] leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
            <span>
              {isArabic 
                ? 'الأسعار استرشادية وتُحدد نهائيًا وفق عدد الموظفين والفروع والوظائف ونطاق التنفيذ. الأسعار لا تشمل الضرائب أو التراخيص أو مصروفات الانتقال – إن وجدت.'
                : 'Prices are indicative and finalized based on headcount, branch locations, role count, and scope. Prices exclude taxes, software licenses, or travel expenses if applicable.'}
            </span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-[#0a0b10] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[#9ea3b5] text-xs font-semibold transition-all cursor-pointer"
          >
            {isArabic ? 'إغلاق التفاصيل' : 'Close Details'}
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            {service.serviceType === 'training' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInstantBuy(service);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold transition-all shadow-[0_2px_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isArabic ? 'التسجيل والحجز الآن' : 'Enroll & Reserve Now'}</span>
              </button>
            ) : service.primaryActionType === 'book_diagnostic' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onInstantBuy(service);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold transition-all shadow-[0_2px_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isArabic ? 'احجز استشارة تشخيصية' : 'Book Diagnostic Consultation'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestQuote(service);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold transition-all shadow-[0_2px_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>{isArabic ? 'اطلب عرضًا مخصصًا' : 'Request Custom Quote'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
