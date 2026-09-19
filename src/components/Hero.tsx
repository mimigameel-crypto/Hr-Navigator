import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Award, 
  Clock,
  Share2
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  lang: Language;
  onExplore: () => void;
  onJoin: () => void;
  onQuickPay: () => void;
  onShare: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExplore,
  onJoin,
  onQuickPay,
  onShare
}) => {
  const t = translations[lang];
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section id="hero-section" className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Ambient Luxury Lighting (Comfortable on eyes, warm metallic & deep slate) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#d4af37]/10 via-[#c59b27]/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-32 right-10 w-96 h-96 rounded-full bg-[#d4af37]/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-5 w-80 h-80 rounded-full bg-[#aa7c11]/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow / Royal Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/40 bg-[#151620]/90 shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-8">
            <Sparkles className="w-4 h-4 text-[#ffd700] animate-pulse" />
            <span className="text-xs font-semibold text-[#ffd700] tracking-wide">
              {t.heroBadge}
            </span>
          </div>

          {/* Central Emblazoned Logo Motif */}
          <div className="mb-6 scale-110">
            <BrandLogo lang={lang} size="lg" showSubtitle={false} />
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight sm:leading-snug">
            <span className="block text-[#e2e4ea] mb-2">{t.heroTitle}</span>
            <span className="gold-gradient-text font-serif block">
              {t.brandName}
            </span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-[#9ea3b5] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t.heroDescription}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <button
              id="hero-btn-explore"
              type="button"
              onClick={onExplore}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-[#0b0c10] font-bold text-sm shadow-[0_4px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_4px_35px_rgba(212,175,55,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.exploreCatalog}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              id="hero-btn-quickpay"
              type="button"
              onClick={onQuickPay}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-[#d4af37]/60 bg-[#151620]/80 hover:bg-[#1f212f] text-[#ffd700] font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#d4af37]" />
              <span>{t.bookNow}</span>
            </button>

            <button
              id="hero-btn-join"
              type="button"
              onClick={onJoin}
              className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/10 hover:border-[#d4af37]/40 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.joinNow}</span>
            </button>

            <button
              id="hero-btn-share-client"
              type="button"
              onClick={onShare}
              className="w-full sm:w-auto px-6 py-4 rounded-xl border border-blue-500/50 bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 hover:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(59,130,246,0.2)] cursor-pointer"
              title={isArabic ? 'نشر ومشاركة رابط المشتركين المباشر' : 'Share Direct Client Link'}
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>{isArabic ? 'نشر رابط المشتركين 🔗' : 'Share Client Link 🔗'}</span>
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#9ea3b5]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>{t.securePayment}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/40 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d4af37]" />
              <span>{t.exclusive}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#d4af37]/40 hidden sm:inline-block" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d4af37]" />
              <span>{t.instantConfirmation}</span>
            </div>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-16 pt-10 border-t border-[#d4af37]/20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl bg-[#12131b]/60 border border-[#d4af37]/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-serif">500+</div>
            <div className="text-xs text-[#9ea3b5] mt-1 font-medium">{t.statClients}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12131b]/60 border border-[#d4af37]/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-serif">120+</div>
            <div className="text-xs text-[#9ea3b5] mt-1 font-medium">{t.statVolume}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12131b]/60 border border-[#d4af37]/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-serif">99.8%</div>
            <div className="text-xs text-[#9ea3b5] mt-1 font-medium">{t.statRating}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#12131b]/60 border border-[#d4af37]/15 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-serif">24/7</div>
            <div className="text-xs text-[#9ea3b5] mt-1 font-medium">{t.statCoverage}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
