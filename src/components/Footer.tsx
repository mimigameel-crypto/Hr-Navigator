import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  Award,
  ArrowUp,
  Clock,
  MessageCircle,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  Copy,
  Check
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  lang: Language;
  onExplore: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onRequestAdminAccess?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onExplore,
  onOpenAuth,
  onRequestAdminAccess
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('+20 10 92792321');
    }
    setCopiedPhone(true);
    setTimeout(() => {
      setCopiedPhone(false);
    }, 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#090a0e] border-t border-[#d4af37]/25 text-[#9ea3b5] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Brand Col */}
          <div className="space-y-4">
            <BrandLogo lang={lang} size="md" />
            <p className="text-xs text-[#8a8d9a] leading-relaxed pt-2">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#d4af37] font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.securePayment}</span>
            </div>
          </div>

          {/* Practice Pillars */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-serif text-[#ffd700]">
              {t.luxuryServices}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'التوظيف والاستقطاب القيادي (Recruitment)' : 'Executive Search & Recruitment'}
                </button>
              </li>
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'إدارة وتقييم الأداء (Performance & OKRs)' : 'Performance & OKRs Systems'}
                </button>
              </li>
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'التدريب وتأهيل القيادات (Leadership Training)' : 'Leadership Training & Coaching'}
                </button>
              </li>
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'علاقات الموظفين واللوائح (Employee Relations)' : 'Employee Relations & Labor Law'}
                </button>
              </li>
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'التطوير التنظيمي والهيكلة (Org Development)' : 'Organizational Restructuring'}
                </button>
              </li>
              <li>
                <button type="button" onClick={onExplore} className="hover:text-[#ffd700] transition-colors">
                  {isArabic ? 'تحليلات الموارد البشرية (HR Analytics)' : 'Workforce Analytics & BI'}
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-serif text-[#ffd700]">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button type="button" onClick={onExplore} className="hover:text-white transition-colors">
                  {t.exploreCatalog}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenAuth('register')} className="hover:text-white transition-colors">
                  {t.register}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenAuth('login')} className="hover:text-white transition-colors">
                  {t.signIn}
                </button>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  {isArabic ? 'عن HR Navigator' : 'About HR Navigator'}
                </a>
              </li>
              <li>
                <span className="text-[#696c7d]">{t.terms}</span>
              </li>
              <li>
                <span className="text-[#696c7d]">{t.privacy}</span>
              </li>
              {onRequestAdminAccess && (
                <li className="pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={onRequestAdminAccess}
                    className="text-[11px] text-[#717587] hover:text-[#ffd700] transition-colors flex items-center gap-1.5"
                    title={isArabic ? 'دخول ملاك المنشأة المحمي' : 'Secure Owner Portal'}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{isArabic ? 'بوابة الملاك والإدارة' : 'Owner / Admin Portal'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 font-serif text-[#ffd700]">
              {t.contactUs}
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <span>{t.companyAddress}</span>
              </div>
              <div className="relative flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <button
                  type="button"
                  id="btn-footer-phone-copy"
                  onClick={handleCopyPhone}
                  className="group flex items-center gap-2 hover:text-[#ffd700] transition-colors font-mono font-bold text-white cursor-pointer text-left rtl:text-right"
                  title={isArabic ? 'انقر لنسخ رقم الهاتف' : 'Click to copy phone number'}
                >
                  <span dir="ltr">+20 10 92792321</span>
                  <span className="p-1 rounded bg-white/10 group-hover:bg-[#d4af37]/20 text-[#d4af37] transition-all">
                    {copiedPhone ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </span>
                </button>

                {/* Small 'Copied!' Toast Message */}
                {copiedPhone && (
                  <span 
                    role="status"
                    className="absolute -top-7 start-6 px-2 py-0.5 rounded-md bg-[#10b981] text-black font-bold text-[10px] shadow-[0_2px_10px_rgba(16,185,129,0.4)] animate-in fade-in zoom-in-75 duration-200 z-10 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>{isArabic ? 'تم النسخ!' : 'Copied!'}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#34d399] flex-shrink-0" />
                <span className="text-[#34d399] font-medium">
                  {isArabic ? 'متاح الآن: 9:00 ص – 5:00 م' : 'Open now: 9:00 AM – 5:00 PM'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <a href="mailto:hrnavigatorconsultations@gmail.com" className="hover:text-white transition-colors font-mono">
                  hrnavigatorconsultations@gmail.com
                </a>
              </div>
              <div className="pt-1 text-[11px] text-[#ffd700] font-mono">
                {t.taxNumber}
              </div>

              {/* Social Media Icons */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-white mb-2 flex items-center justify-between">
                  <span>{isArabic ? 'قنوات التواصل المعتمدة:' : 'Official Social Channels:'}</span>
                  <span className="text-[10px] text-[#8a8d9a] font-normal">@hrnavigatorconsultations</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://wa.me/201092792321"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 transition-all shadow-sm flex items-center justify-center group"
                    title="WhatsApp: +20 10 92792321"
                  >
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/hr-navigator-consultations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#38bdf8] hover:bg-[#0A66C2]/30 transition-all shadow-sm flex items-center justify-center group"
                    title="LinkedIn: HR Navigator Consultations"
                  >
                    <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1Hu7Hj4NnZ/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/40 text-[#60a5fa] hover:bg-[#1877F2]/30 transition-all shadow-sm flex items-center justify-center group"
                    title="Facebook: HR Navigator Consultations"
                  >
                    <Facebook className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    href="https://www.instagram.com/hrnavigatorconsultations/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#E4405F]/20 border border-[#E4405F]/40 text-[#f43f5e] hover:bg-[#E4405F]/30 transition-all shadow-sm flex items-center justify-center group"
                    title="Instagram: @hrnavigatorconsultations"
                  >
                    <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                  <a
                    id="btn-footer-youtube"
                    href="https://www.youtube.com/@hrnavigatorconsultations"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[#FF0000]/20 border border-[#FF0000]/40 text-[#ef4444] hover:bg-[#FF0000]/30 transition-all shadow-sm flex items-center justify-center group"
                    title="YouTube: HR Navigator Consultations"
                  >
                    <Youtube className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>{t.rightsReserved}</div>

          {/* Payment Gateways Bar */}
          <div className="flex items-center gap-2 flex-wrap justify-center text-[11px]">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono">Mada</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono">Visa / Mastercard</span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold">🇰🇼 K-Net</span>
            <span className="px-2.5 py-0.5 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold">Google Pay™</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white font-mono">Apple Pay</span>
            <a
              href="https://ipn.eg/S/mimigameel2025/instapay/8E32gp"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-full bg-gradient-to-r from-[#8b5cf6]/25 to-[#6d28d9]/25 border border-[#8b5cf6]/50 text-[#d8b4fe] font-bold hover:brightness-125 transition-all flex items-center gap-1.5 shadow-sm"
              title="Official InstaPay Payment: HR Navigator Consultations"
            >
              <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
              <span>⚡ InstaPay (HR Navigator)</span>
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="p-2 rounded-xl bg-[#14151e] border border-[#d4af37]/30 text-[#ffd700] hover:bg-[#1d1f2b] transition-colors flex items-center gap-1.5"
            title="Scroll to top"
          >
            <span>{isArabic ? 'للأعلى' : 'Top'}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
