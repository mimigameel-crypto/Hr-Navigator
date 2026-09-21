import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  Eye, 
  Search, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  CreditCard,
  Linkedin,
  Instagram,
  ArrowUpRight,
  Filter,
  Check,
  Zap,
  TrendingUp,
  PlayCircle,
  Video,
  UserPlus,
  MessageCircle,
  Youtube
} from 'lucide-react';
import { Language, Currency, DigitalResource, SocialPost } from '../types';
import { initialDigitalResources, initialSocialPosts } from '../data/resourcesData';
import { formatCurrencyValue } from '../utils/currency';

interface DigitalResourcesSectionProps {
  lang: Language;
  currentCurrency: Currency;
  onBuyResource: (resource: DigitalResource) => void;
  resources?: DigitalResource[];
  socialPosts?: SocialPost[];
}

export const DigitalResourcesSection: React.FC<DigitalResourcesSectionProps> = ({
  lang,
  currentCurrency,
  onBuyResource,
  resources = initialDigitalResources,
  socialPosts = initialSocialPosts
}) => {
  const isArabic = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'paid'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  const formatResourcePrice = (res: DigitalResource) => {
    const override = res.exactPrices?.[currentCurrency];
    return formatCurrencyValue(res.price, currentCurrency, lang, override).displayWithSymbol;
  };

  // Filter resources
  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'all' || res.accessType === activeTab;
    const matchesCategory = selectedCategory === 'all' || res.categoryAr === selectedCategory || res.categoryEn === selectedCategory;
    const title = isArabic ? res.titleAr : res.titleEn;
    const desc = isArabic ? res.descriptionAr : res.descriptionEn;
    const matchesSearch = !searchQuery.trim() || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
  });

  const handleFreeDownload = (resource: DigitalResource) => {
    // If the resource has an external download or viewing URL (like Adobe Acrobat / cloud storage)
    if (resource.downloadUrl) {
      setDownloadSuccessId(resource.id);
      window.open(resource.downloadUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => setDownloadSuccessId(null), 3000);
      return;
    }

    setDownloadingId(resource.id);
    // Simulate safe preparation of file
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccessId(resource.id);

      // Create a virtual download element for demonstration/PDF link
      const element = document.createElement('a');
      const sampleText = `HR NAVIGATOR CONSULTATIONS - OFFICIAL RESOURCE\n\nTitle: ${resource.titleEn}\nCategory: ${resource.categoryEn}\nPages: ${resource.pageCount}\nFormat: ${resource.format}\n\nDocument downloaded officially via HR Navigator Digital Library. For executive consultations, contact: +20 10 92792321 or visit hr-navigator.com`;
      const file = new Blob([sampleText], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `${resource.id}-${isArabic ? 'ملف-تعريفي' : 'document'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setTimeout(() => setDownloadSuccessId(null), 3500);
    }, 1200);
  };

  return (
    <section id="digital-resources" className="py-20 bg-gradient-to-b from-[#0a0b12] via-[#0f111c] to-[#0a0b12] text-white relative overflow-hidden border-t border-[#d4af37]/20">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#d4af37]/10 via-[#3b82f6]/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181a28] border border-[#d4af37]/40 text-[#ffd700] text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>{isArabic ? 'المجلة الاستشارية والمكتبة الرقمية' : 'Executive Magazine & Digital Assets'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            {isArabic ? (
              <>
                المجلة والملفات <span className="text-[#ffd700]">التنفيذية المعتمدة (PDF)</span>
              </>
            ) : (
              <>
                Advisory Magazine & <span className="text-[#ffd700]">Certified Toolkits (PDF)</span>
              </>
            )}
          </h2>

          <p className="text-sm sm:text-base text-[#9ea3b5] leading-relaxed">
            {isArabic 
              ? 'تصفح أعداد المجلة الاستشارية لـ HR Navigator، وحمّل ملفات البروفايل والأدلة التنفيذية مجاناً ومباشرة بصيغة PDF.'
              : 'Browse HR Navigator advisory magazine editions, corporate profiles, and executive PDF toolkits with instant direct access.'}
          </p>
        </div>

        {/* Featured Magazine Spotlight Banner */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#151624] via-[#1a1c30] to-[#121320] border-2 border-[#d4af37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.2)] relative overflow-hidden">
          {/* Subtle gold decoration badge */}
          <div className="absolute top-0 end-0 transform translate-x-4 -translate-y-4 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
              <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl bg-gradient-to-br from-[#d4af37] via-[#c59b27] to-[#805d15] p-1 shadow-2xl flex-shrink-0 flex flex-col items-center justify-center text-black font-extrabold relative group">
                <div className="w-full h-full rounded-xl bg-[#0c0d14] p-2 flex flex-col items-center justify-between text-center border border-white/10">
                  <span className="text-[9px] font-bold text-[#d4af37] uppercase tracking-wider">MAGAZINE</span>
                  <BookOpen className="w-7 h-7 text-[#ffd700]" />
                  <span className="text-[10px] font-mono text-white/90">ISSUE #01</span>
                </div>
              </div>

              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#ffd700] text-xs font-bold">
                    {isArabic ? 'العدد الاستشاري الأول للمجلة • متوفر الآن' : 'Inaugural Advisory Issue • Available Now'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    {isArabic ? 'تحميل مباشر مجاني 100%' : '100% Free Access'}
                  </span>
                  <span className="text-xs text-[#9ea3b5] font-mono">PDF • 36 {isArabic ? 'صفحة متخصصة' : 'pages'}</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
                  {isArabic 
                    ? 'مجلة HR Navigator التنفيذية – العدد الاستشاري الأول' 
                    : 'HR Navigator Executive Advisory Magazine – Inaugural Issue'}
                </h3>

                <p className="text-xs sm:text-sm text-[#c7cbd9] leading-relaxed">
                  {isArabic 
                    ? 'المرجع التنفيذي للرؤساء التنفيذيين ومديري الموارد البشرية: يتناول استراتيجيات التحول المؤسسي، تقليل دوران الموظفين، بناء سلالم الرواتب والجدارات، مع تجارب واقعية وحلول عملية معتمدة.'
                    : 'The premier advisory handbook for CEOs & HR leaders: Covering corporate transformation, talent retention, salary structuring, and verified field frameworks.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto flex-shrink-0">
              <a
                id="btn-magazine-spotlight-read"
                href="https://acrobat.adobe.com/id/urn:aaid:sc:AP:51c1e71e-ce7b-42c2-b096-559afa41da50"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>{isArabic ? 'قراءة وتحميل المجلة (PDF عبر Adobe)' : 'Read & Download Magazine (Adobe)'}</span>
                <ExternalLink className="w-4 h-4 text-black opacity-70" />
              </a>

              <span className="text-[11px] text-center text-[#9ea3b5]">
                {isArabic ? '⚡ فتح فوري وتصفح عالي الدقة بدون أي تسجيل' : '⚡ Instant high-res view without registration'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#121422] border border-white/10 mb-10 shadow-lg">
          {/* Tabs: All / Free / Paid */}
          <div className="flex items-center p-1 rounded-xl bg-[#0a0b12] border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black shadow' 
                  : 'text-[#9ea3b5] hover:text-white'
              }`}
            >
              {isArabic ? 'جميع الملفات' : 'All Resources'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('free')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'free' 
                  ? 'bg-emerald-500 text-white shadow' 
                  : 'text-[#9ea3b5] hover:text-white'
              }`}
            >
              {isArabic ? 'تحميل مجاني (Free)' : 'Free Downloads'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paid')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'paid' 
                  ? 'bg-[#3b82f6] text-white shadow' 
                  : 'text-[#9ea3b5] hover:text-white'
              }`}
            >
              {isArabic ? 'حقائب برسوم (Premium)' : 'Premium Toolkits'}
            </button>
          </div>

          {/* Search Field */}
          <div className="w-full sm:w-72 relative">
            <Search className="w-4 h-4 text-[#717688] absolute top-1/2 -translate-y-1/2 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث في الملفات والحقائب...' : 'Search documents...'}
              className="w-full py-2 px-9 rounded-xl bg-[#0a0b12] border border-white/10 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#d4af37]/60 transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'bg-[#141522] border border-white/10 text-[#9ea3b5] hover:text-white hover:border-[#d4af37]/40'
            }`}
          >
            {isArabic ? 'جميع الأقسام' : 'All Categories'}
          </button>
          {Array.from(new Set(resources.map(r => isArabic ? r.categoryAr : r.categoryEn))).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#d4af37] text-black shadow-md'
                  : 'bg-[#141522] border border-white/10 text-[#9ea3b5] hover:text-white hover:border-[#d4af37]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredResources.map((res) => {
            const isFree = res.accessType === 'free';
            const isDownloading = downloadingId === res.id;
            const isSuccess = downloadSuccessId === res.id;

            return (
              <div 
                key={res.id}
                id={`resource-card-${res.id}`}
                className="rounded-3xl bg-[#121422] border border-white/10 hover:border-[#d4af37]/50 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_30px_rgba(212,175,55,0.15)] group relative overflow-hidden"
              >
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                    isFree 
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' 
                      : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  }`}>
                    {isFree ? (
                      <>
                        <Download className="w-3 h-3" />
                        <span>{isArabic ? 'ملف مجاني' : 'Free Resource'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        <span>{isArabic ? 'حقيبة مدفوعة' : 'Paid Toolkit'}</span>
                      </>
                    )}
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-[#9ea3b5] font-mono">
                    {res.format} • {res.pageCount} {isArabic ? 'صفحة' : 'pages'}
                  </span>
                </div>

                {/* Body Content */}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1c29] border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] mb-4 group-hover:scale-105 group-hover:border-[#d4af37] transition-all shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-[#ffd700] transition-colors">
                    {isArabic ? res.titleAr : res.titleEn}
                  </h3>

                  <p className="text-xs text-[#9ea3b5] mb-4 line-clamp-3 leading-relaxed">
                    {isArabic ? res.descriptionAr : res.descriptionEn}
                  </p>

                  {/* Key Topics Covered */}
                  <div className="space-y-1.5 mb-6 pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase font-bold text-[#ffd700]/80 tracking-wider block mb-1">
                      {isArabic ? 'محتويات ومحاور الملف:' : 'Key Included Topics:'}
                    </span>
                    {(isArabic ? res.topicsAr : res.topicsEn).slice(0, 3).map((topic, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#c7cbd9]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Card */}
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-[#717688] block">
                        {isArabic ? 'رسوم الملف' : 'Price'}
                      </span>
                      <span className="text-sm font-extrabold text-white">
                        {isFree ? (
                          <span className="text-emerald-400 font-bold">{isArabic ? 'مجاني 100%' : 'Free 100%'}</span>
                        ) : (
                          <span className="text-[#ffd700]">{formatResourcePrice(res)}</span>
                        )}
                      </span>
                    </div>

                    <div className="text-right rtl:text-left text-[10px] text-[#717688]">
                      <span>{res.fileSize}</span>
                      <span className="block font-mono text-[#9ea3b5]">{res.downloadsCount}+ {isArabic ? 'تحميل' : 'downloads'}</span>
                    </div>
                  </div>

                  {isFree ? (
                    <button
                      type="button"
                      onClick={() => handleFreeDownload(res)}
                      disabled={isDownloading}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{isArabic ? 'جاري تجهيز الملف...' : 'Preparing Download...'}</span>
                        </>
                      ) : isSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>{isArabic ? 'تم التحميل بنجاح!' : 'Downloaded!'}</span>
                        </>
                      ) : (
                        <>
                          {res.downloadUrl ? (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              <span>{isArabic ? 'فتح وقراءة الملف (Adobe PDF)' : 'Open & Read (Adobe PDF)'}</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>{isArabic ? 'تحميل فوري مجاني (PDF)' : 'Free Instant Download'}</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBuyResource(res)}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-black" />
                      <span>{isArabic ? 'شراء وتحميل الحقيبة الآن' : 'Buy & Download Toolkit'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* LinkedIn & Instagram Showcase Section with Direct Follow Links */}
        <div className="mt-20 pt-16 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181a28] border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span>{isArabic ? 'منظومة المحتوى وقنوات التواصل المباشرة' : 'Omnichannel Insights & Communities'}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold text-white mb-3">
              {isArabic ? 'أحدث المنشورات، الفيديوهات والرؤى الاستشارية' : 'Latest Insights, Videos & Thought Leadership'}
            </h3>
            <p className="text-xs sm:text-sm text-[#9ea3b5] leading-relaxed mb-6">
              {isArabic 
                ? 'تابع حساباتنا الرسمية على LinkedIn وInstagram وYouTube للحصول على مقالات متجددة وفيديوهات إثرائية في الهيكلة وتطوير الموارد البشرية.'
                : 'Follow our verified accounts on LinkedIn, Instagram & YouTube for continuous insights and organizational frameworks.'}
            </p>

            {/* Prominent Follow Channels Buttons Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* LinkedIn Follow Button */}
              <a
                id="btn-social-follow-linkedin"
                href="https://www.linkedin.com/company/hr-navigator-consultations"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(0,119,181,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <Linkedin className="w-4 h-4" />
                <span>{isArabic ? 'متابعة على LinkedIn' : 'Follow on LinkedIn'}</span>
              </a>

              {/* Instagram Follow Button */}
              <a
                id="btn-social-follow-instagram"
                href="https://www.instagram.com/hrnavigatorconsultations/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(253,29,29,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <Instagram className="w-4 h-4" />
                <span>{isArabic ? 'متابعة على Instagram' : 'Follow on Instagram'}</span>
              </a>

              {/* YouTube Channel Button */}
              <a
                id="btn-social-follow-youtube"
                href="https://www.youtube.com/@hrnavigatorconsultations"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#cc0000] hover:bg-[#b00000] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(204,0,0,0.35)] transition-all hover:scale-105 active:scale-95"
              >
                <Youtube className="w-4 h-4" />
                <span>{isArabic ? 'قناة YouTube الرسمية' : 'YouTube Channel'}</span>
              </a>

              {/* WhatsApp Community / Direct Broadcast Button */}
              <a
                id="btn-social-whatsapp-channel"
                href="https://wa.me/201092792321?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D9%82%D8%A7%D8%A6%D9%85%D8%A9%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A7%D8%AA%20%D9%88%D8%AA%D8%AD%D8%AF%D9%8A%D8%AB%D8%A7%D8%AA%20HR%20Navigator."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isArabic ? 'الانضمام لمجتمع واتساب' : 'WhatsApp Advisory Network'}</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {socialPosts.map((post) => {
              const isVideo = post.mediaType === 'video' || post.platform === 'youtube';
              return (
                <div 
                  key={post.id}
                  className="p-5 rounded-2xl bg-[#141624] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                          post.platform === 'linkedin' 
                            ? 'bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/30' 
                            : post.platform === 'instagram'
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : post.platform === 'youtube'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {post.platform === 'linkedin' && <Linkedin className="w-4 h-4" />}
                          {post.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                          {post.platform === 'youtube' && <Youtube className="w-4 h-4" />}
                          {post.platform === 'whatsapp' && <MessageCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">HR Navigator Consulting</span>
                            {isVideo && (
                              <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-bold border border-red-500/30 flex items-center gap-0.5">
                                <Video className="w-2.5 h-2.5" />
                                <span>فيديو</span>
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#717688] font-mono">{post.publishDate}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-medium">
                        {isArabic ? post.tagAr : post.tagEn}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                      {isArabic ? post.titleAr : post.titleEn}
                    </h4>

                    <p className="text-xs text-[#9ea3b5] leading-relaxed mb-4">
                      {isArabic ? post.summaryAr : post.summaryEn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px]">
                    <span className="text-[#717688]">
                      {post.likesCount} {isArabic ? 'إعجاب وتفاعل' : 'Reactions'}
                    </span>

                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 font-bold transition-all ${
                        isVideo ? 'text-red-400 hover:text-red-300' : 'text-blue-400 hover:text-blue-300'
                      }`}
                    >
                      {isVideo ? (
                        <>
                          <PlayCircle className="w-4 h-4" />
                          <span>{isArabic ? 'مشاهدة الفيديو على المنصة' : 'Watch Video Online'}</span>
                        </>
                      ) : (
                        <>
                          <span>{isArabic ? 'عرض المنشور والتفاعل' : 'View Post & Engage'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </>
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
