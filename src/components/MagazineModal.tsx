import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Share2, 
  Check, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Language } from '../types';
import { MAGAZINE_ISSUES } from '../data/magazineData';

interface MagazineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenFullPageView?: () => void;
  onConsultationBook?: () => void;
}

export const AI_STUDIO_MAGAZINE_APPLET_URL = 'https://aistudio.google.com/u/1/apps/500e0d19-e33d-4ab8-94e8-d4e93f4c3a2e?showPreview=true&showAssistant=true&fullscreenApplet=true';

export const MagazineModal: React.FC<MagazineModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenFullPageView
}) => {
  const isArabic = lang === 'ar';
  const issues = MAGAZINE_ISSUES;

  const [copiedLink, setCopiedLink] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(AI_STUDIO_MAGAZINE_APPLET_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in p-0 sm:p-2 md:p-3"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div 
        className={`relative w-full bg-[#0a0c13] border border-[#d4af37]/40 shadow-[0_15px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'h-screen w-screen rounded-none sm:rounded-2xl sm:h-[98vh]' 
            : 'max-w-6xl h-[90vh] rounded-2xl'
        }`}
      >
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#d4af37]/25 bg-gradient-to-r from-[#10121d] via-[#161828] to-[#0d0f18] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#886411] flex items-center justify-center text-black shadow-md flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  {isArabic ? 'مجلة HR Navigator التنفيذية — التطبيق السحابي الكامل' : 'HR Navigator Executive Magazine — Live Applet'}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#4285F4]/20 text-[#60a5fa] border border-[#4285F4]/40">
                  <Sparkles className="w-3 h-3 text-[#4285F4]" />
                  <span>{isArabic ? 'متزامن لحظياً ومباشر' : 'Live Sync'}</span>
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/15 text-[#ffd700] border border-[#d4af37]/30">
                  {isArabic ? `${issues.length} أعداد معتمدة` : `${issues.length} Editions`}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a] hidden sm:block">
                {isArabic 
                  ? 'عرض مباشر لنفس رابط وتطبيق المجلة السحابي — أي تحديث تجريه هناك يظهر لك هنا فوراً عند التحديث.' 
                  : 'Live instance of the magazine cloud applet — Any update you deploy updates automatically here.'}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Reload iFrame Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9ea3b5] hover:text-white transition-colors cursor-pointer"
              title={isArabic ? 'تحديث ومزامنة المجلة الآن' : 'Refresh and sync live changes'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#ffd700]' : ''}`} />
            </button>

            {/* Toggle Fullscreen / Windowed */}
            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              className="hidden sm:inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9ea3b5] hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? (isArabic ? 'تصغير النافذة' : 'Windowed mode') : (isArabic ? 'ملء الشاشة' : 'Fullscreen')}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Open in external browser tab */}
            <a
              href={AI_STUDIO_MAGAZINE_APPLET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4285F4]/20 to-[#2563EB]/20 border border-[#4285F4]/50 hover:border-[#4285F4] text-[#60a5fa] text-xs font-bold transition-all"
              title={isArabic ? 'فتح في علامة تبويب مستقلة' : 'Open in new browser tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isArabic ? 'فتح بنافذة جديدة' : 'Open in New Tab'}</span>
            </a>

            {/* Share Link */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9ea3b5] hover:text-white transition-colors cursor-pointer"
              title={isArabic ? 'مشاركة ونسخ رابط المجلة' : 'Share Magazine Link'}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-[#9ea3b5] hover:text-rose-400 transition-colors cursor-pointer"
              aria-label="Close modal"
              title={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Sub-bar: Realtime Sync Reassurance */}
        <div className="px-4 sm:px-6 py-2 bg-[#0c0e18] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[#9ea3b5]">
              {isArabic ? (
                <>
                  سحابة المجلة متصلة بالرابط الرسمي: <span className="font-mono text-[#60a5fa]">aistudio.google.com/apps/500e0d19...</span>
                </>
              ) : (
                <>
                  Cloud connected directly to: <span className="font-mono text-[#60a5fa]">aistudio.google.com/apps/500e0d19...</span>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenFullPageView && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullPageView();
                }}
                className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <Layers className="w-3 h-3" />
                <span>{isArabic ? 'فهرس الأعداد والمقالات النصية' : 'View Text Articles Directory'}</span>
                {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
              </button>
            )}
          </div>
        </div>

        {/* Modal Body: Full Page Live iFrame of the exact URL provided */}
        <div className="flex-1 w-full h-full relative bg-[#000000] overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a0c13] text-[#9ea3b5] gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] animate-pulse">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">
                  {isArabic ? 'جارٍ تحميل صفحة وتطبيق المجلة الكامل...' : 'Loading full live magazine applet...'}
                </p>
                <p className="text-xs text-[#8a8d9a] mt-1">
                  {isArabic ? 'يتم جلب أحدث إصدار وتحديثات الأعداد مباشرة من السحابة' : 'Retrieving latest updates directly from the cloud'}
                </p>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            src={AI_STUDIO_MAGAZINE_APPLET_URL}
            title="HR Navigator Executive Magazine Live Applet"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            onLoad={() => setIsLoading(false)}
          />
        </div>

      </div>
    </div>
  );
};
