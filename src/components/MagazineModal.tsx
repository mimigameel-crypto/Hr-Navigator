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
  ArrowLeft,
  AlertCircle
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
  const [hasIframeError, setHasIframeError] = useState(false);

  if (!isOpen) return null;

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(AI_STUDIO_MAGAZINE_APPLET_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleRefresh = () => {
    setHasIframeError(false);
    setIframeKey(prev => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(AI_STUDIO_MAGAZINE_APPLET_URL, '_blank', 'noopener,noreferrer');
  };

  const handleGoToFullPage = () => {
    onClose();
    if (onOpenFullPageView) {
      onOpenFullPageView();
    }
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
                  {isArabic ? 'مجلة HR Navigator التنفيذية' : 'HR Navigator Executive Magazine'}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#4285F4]/20 text-[#60a5fa] border border-[#4285F4]/40">
                  <Sparkles className="w-3 h-3 text-[#4285F4]" />
                  <span>{isArabic ? 'متزامن لحظياً' : 'Live Sync'}</span>
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/15 text-[#ffd700] border border-[#d4af37]/30">
                  {isArabic ? `${issues.length} أعداد معتمدة` : `${issues.length} Editions`}
                </span>
              </div>
              <p className="text-[11px] text-[#8a8d9a] hidden sm:block">
                {isArabic 
                  ? 'أي تحديث تجريه على الرابط السحابي هناك يظهر لك فوراً هنا وفي التطبيق المباشر' 
                  : 'Any update you publish on the cloud instance updates automatically here'}
              </p>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Open in external browser tab button */}
            <button
              type="button"
              onClick={handleOpenExternal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563EB] hover:brightness-110 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title={isArabic ? 'فتح الرابط في نافذة جديدة' : 'Open in New Tab'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isArabic ? 'فتح في نافذة جديدة' : 'Open in New Tab'}</span>
            </button>

            {/* Reload iFrame Button */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#9ea3b5] hover:text-white transition-colors cursor-pointer"
              title={isArabic ? 'تحديث' : 'Refresh'}
            >
              <RefreshCw className="w-4 h-4" />
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

        {/* Sub-bar: Direct actions and advice */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0c0e18] border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span className="text-[#cbd5e1] font-mono text-[11px]">
              https://aistudio.google.com/apps/500e0d19...
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGoToFullPage}
              className="px-3 py-1 rounded-lg bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-[#ffd700] flex items-center gap-1.5 font-bold transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isArabic ? 'عرض صفحة المجلة والأعداد المدمجة بالمنصة' : 'In-App Magazine View'}</span>
              {isArabic ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Modal Body: Fallback & Embedded Screen */}
        <div className="flex-1 w-full h-full relative bg-[#090b12] flex flex-col items-center justify-center p-4">
          {/* Helpful Banner explaining browser security & offering 1-click solutions */}
          <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#131627] to-[#0c0e1a] border-2 border-[#d4af37]/50 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-[#4285F4]/15 border border-[#4285F4]/40 flex items-center justify-center text-[#60a5fa] mx-auto shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {isArabic ? 'تطبيق مجلة HR Navigator التفاعلي السحابي' : 'HR Navigator Live Cloud Applet'}
              </h2>
              <p className="text-xs sm:text-sm text-[#9ea3b5] leading-relaxed">
                {isArabic 
                  ? 'نظراً لقيود الحماية الأمنية في متصفح جوجل لروابط AI Studio داخل النوافذ المضمنة، يمكنك فتح التطبيق فوراً بنقرة واحدة أو تصفح الأعداد مباشرة داخل المنصة:' 
                  : 'Due to Google AI Studio iframe embedding security policies, you can open the live cloud applet directly or browse the built-in issue reader:'}
              </p>
            </div>

            {/* Direct Big Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleOpenExternal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563EB] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(66,133,244,0.4)] transition-all cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{isArabic ? 'فتح تطبيق المجلة بالرابط المباشر' : 'Open Live Applet Directly'}</span>
              </button>

              <button
                type="button"
                onClick={handleGoToFullPage}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>{isArabic ? 'تصفح صفحة المجلة بكافة أعدادها هنا' : 'Browse Issues Inside App'}</span>
              </button>
            </div>

            {/* Sync Reassurance */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-[#ffd700]">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isArabic ? 'ملاحظة: أي تحديث تجريه على الرابط السحابي يظهر لك فوراً بالرابط المباشر' : 'Note: Any update you make to the cloud project is instantly live'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
