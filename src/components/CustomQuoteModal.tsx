import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { Language, LuxuryService, Currency } from '../types';
import { translations } from '../translations';
import { getServiceDisplayPrice } from '../utils/currency';

interface CustomQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: LuxuryService | null;
  lang: Language;
  currentCurrency: Currency;
  onSuccessSubmit?: (data: any) => void;
}

export const CustomQuoteModal: React.FC<CustomQuoteModalProps> = ({
  isOpen,
  onClose,
  service,
  lang,
  currentCurrency,
  onSuccessSubmit
}) => {
  const isArabic = lang === 'ar';
  const t = translations[lang];

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeCount, setEmployeeCount] = useState('20-50');
  const [branchesCount, setBranchesCount] = useState('1');
  const [preferredTimeline, setPreferredTimeline] = useState('immediate');
  const [projectScope, setProjectScope] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quoteRef, setQuoteRef] = useState('');

  if (!isOpen || !service) return null;

  const title = isArabic ? service.titleAr : service.titleEn;
  const priceDisplay = getServiceDisplayPrice(service, currentCurrency, lang);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedRef = `QUOTE-HRN-${Math.floor(10000 + Math.random() * 90000)}`;
      setQuoteRef(generatedRef);
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (onSuccessSubmit) {
        onSuccessSubmit({
          quoteRef: generatedRef,
          serviceId: service.id,
          serviceTitle: title,
          companyName,
          contactName,
          email,
          phone,
          employeeCount,
          branchesCount,
          projectScope
        });
      }
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div 
      id="custom-quote-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div 
        id="custom-quote-modal-dialog"
        className="relative w-full max-w-2xl rounded-2xl bg-[#0e1017] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(212,175,55,0.2)] overflow-hidden my-8"
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#886411]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          aria-label={t.closeModal}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 font-serif">
              {isArabic ? 'تم استلام طلب العرض المخصص بنجاح' : 'Custom Quote Request Received'}
            </h3>
            <p className="text-sm text-[#9ea3b5] max-w-md mx-auto mb-6">
              {isArabic 
                ? 'شكراً لاهتمامكم بخدمات HR Navigator. سيقوم كبير المستشارين بدراسة متطلباتكم والتواصل معكم خلال 24 ساعة لتقديم عرض مفصل ومحدد النطاق والتكلفة.'
                : 'Thank you for choosing HR Navigator. Our Senior Advisor will review your requirements and reach out within 24 hours with a comprehensive customized proposal.'}
            </p>

            <div className="p-4 rounded-xl bg-[#141522] border border-[#d4af37]/30 max-w-md mx-auto text-sm mb-6 space-y-2 text-right rtl:text-right ltr:text-left">
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{isArabic ? 'رقم الطلب المرجعي:' : 'Request Reference:'}</span>
                <span className="font-mono font-bold text-[#ffd700]">{quoteRef}</span>
              </div>
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{isArabic ? 'الخدمة المطلوبة:' : 'Requested Service:'}</span>
                <span className="font-medium text-white line-clamp-1">{title}</span>
              </div>
              <div className="flex justify-between items-center text-[#9ea3b5]">
                <span>{isArabic ? 'المنشأة:' : 'Company:'}</span>
                <span className="text-white">{companyName}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/201092792321?text=${encodeURIComponent(
                  `مرحباً HR Navigator، أود متابعة طلب العرض المخصص رقم (${quoteRef}) لخدمة: ${title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all shadow-[0_2px_12px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2"
              >
                <span>{isArabic ? 'متابعة عبر واتساب فوراً' : 'Follow up on WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1f2130] hover:bg-[#282a3d] text-white text-xs font-bold transition-all border border-white/10"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#161824] text-[11px] font-semibold text-[#ffd700] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isArabic ? 'طلب عرض مخصص • HR Navigator' : 'Custom Proposal Request • HR Navigator'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 font-serif">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#9ea3b5]">
                <span>{isArabic ? (service.pricePrefixAr || 'يبدأ من:') : (service.pricePrefixEn || 'Starts from:')}</span>
                <span className="text-sm font-bold text-[#ffd700] font-mono">
                  {priceDisplay.formatted} {priceDisplay.symbol}
                </span>
                {service.estimatedDurationAr && (
                  <>
                    <span className="text-white/20">•</span>
                    <span className="flex items-center gap-1 text-[#c5c8d6]">
                      <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{isArabic ? service.estimatedDurationAr : service.estimatedDurationEn}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Form Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'اسم المنشأة / الشركة' : 'Company Name'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder={isArabic ? 'مثال: شركة الرؤية القابضة' : 'e.g. Vision Holding Group'}
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'اسم المسؤول أو متخذ القرار' : 'Contact Person'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder={isArabic ? 'مثال: أ. محمد عبد الله (المدير التنفيذي)' : 'e.g. John Smith (CEO)'}
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'البريد الإلكتروني المهني' : 'Business Email'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'رقم الهاتف أو الواتساب' : 'Phone / WhatsApp'} <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+20 10 92792321"
                    dir="ltr"
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none text-right rtl:text-left"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'عدد الموظفين التقريبي' : 'Approximate Employee Count'}
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <select
                    value={employeeCount}
                    onChange={e => setEmployeeCount(e.target.value)}
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white focus:outline-none"
                  >
                    <option value="1-15">{isArabic ? '1 – 15 موظف (منشأة ناشئة)' : '1–15 Employees (Startup)'}</option>
                    <option value="16-50">{isArabic ? '16 – 50 موظف (منشأة صغيرة)' : '16–50 Employees (Small)'}</option>
                    <option value="51-150">{isArabic ? '51 – 150 موظف (منشأة متوسطة)' : '51–150 Employees (Medium)'}</option>
                    <option value="151-500">{isArabic ? '151 – 500 موظف (مؤسسة كبيرة)' : '151–500 Employees (Large)'}</option>
                    <option value="500+">{isArabic ? 'أكثر من 500 موظف (مجموعة كبرى)' : '500+ Employees (Enterprise)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                  {isArabic ? 'عدد الفروع / مواقع العمل' : 'Number of Branches'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#8a8d9a] absolute left-3 rtl:left-auto rtl:right-3 top-2.5 pointer-events-none" />
                  <select
                    value={branchesCount}
                    onChange={e => setBranchesCount(e.target.value)}
                    className="w-full pl-3 pr-9 rtl:pl-9 rtl:pr-3 py-2 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white focus:outline-none"
                  >
                    <option value="1">{isArabic ? 'مقر رئيسي واحد فقط' : 'Single Headquarters'}</option>
                    <option value="2-3">{isArabic ? '2 – 3 فروع' : '2–3 Branches'}</option>
                    <option value="4-10">{isArabic ? '4 – 10 فروع' : '4–10 Branches'}</option>
                    <option value="10+">{isArabic ? 'أكثر من 10 فروع' : '10+ Branches'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Scope / Notes Textarea */}
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-[#c5c8d6] mb-1">
                {isArabic ? 'ملاحظات إضافية حول التحديات أو النطاق المستهدف' : 'Additional Notes / Project Scope Details'}
              </label>
              <textarea
                rows={3}
                value={projectScope}
                onChange={e => setProjectScope(e.target.value)}
                placeholder={isArabic ? 'اذكر أي تفاصيل خاصة مثل الوظائف المستهدفة، أو التحدي التنظيمي الأبرز في منشأتكم...' : 'Mention any specific details regarding targeted roles, bottlenecks, or objectives...'}
                className="w-full p-3 rounded-xl bg-[#141522] border border-[#d4af37]/25 focus:border-[#ffd700] text-xs text-white placeholder-[#5a5e70] focus:outline-none resize-none"
              />
            </div>

            {/* Unified Legal & Pricing Disclaimer Box */}
            <div className="mb-6 p-3.5 rounded-xl bg-[#12131e] border border-[#d4af37]/20 flex items-start gap-2.5 text-[11px] text-[#9ea3b5] leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
              <span>
                {isArabic 
                  ? 'الأسعار استرشادية وتُحدد نهائيًا وفق عدد الموظفين والفروع والوظائف ونطاق التنفيذ. الأسعار لا تشمل الضرائب أو التراخيص أو مصروفات الانتقال – إن وجدت.'
                  : 'Prices are indicative and finalized based on headcount, branch locations, role count, and scope. Prices exclude taxes, software licenses, or travel expenses if applicable.'}
              </span>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[#9ea3b5] text-xs font-semibold transition-all cursor-pointer"
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] hover:brightness-110 text-[#0b0c10] text-xs font-extrabold transition-all shadow-[0_2px_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0b0c10] border-t-transparent rounded-full animate-spin" />
                    <span>{isArabic ? 'جارٍ الإرسال...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 fill-current" />
                    <span>{isArabic ? 'إرسال طلب العرض المخصص' : 'Submit Proposal Request'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
