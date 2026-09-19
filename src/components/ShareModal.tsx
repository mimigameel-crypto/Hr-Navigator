import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  Users, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Mail,
  Sparkles,
  QrCode
} from 'lucide-react';
import { Language } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  lang,
  onClose
}) => {
  const [copiedClient, setCopiedClient] = useState(false);
  const [copiedStore, setCopiedStore] = useState(false);

  if (!isOpen) return null;

  const isArabic = lang === 'ar';

  // Dynamic base URL detection (uses current window location if available, fallback to metadata preview)
  const previewBase = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-pre-uz7brkv75oaqnpjrvegkug-889292147996.europe-west2.run.app';

  // Client link can work with clean root or query
  const mainStoreUrl = previewBase;
  const clientPortalUrl = `${previewBase}?view=portal`;

  const handleCopy = (url: string, type: 'portal' | 'store') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    if (type === 'portal') {
      setCopiedClient(true);
      setTimeout(() => setCopiedClient(false), 2500);
    } else {
      setCopiedStore(true);
      setTimeout(() => setCopiedStore(false), 2500);
    }
  };

  const shareText = isArabic
    ? 'يسر شركة HR Navigator للاستشارات الإدارية دعوتكم للاطلاع على باقات الاستشارات وحجز الجلسات التنفيذية عبر الرابط المباشر:'
    : 'HR Navigator Consultations invites you to explore our executive HR advisory programs and book sessions via:';

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${clientPortalUrl}`)}`;
  const mailShareUrl = `mailto:?subject=${encodeURIComponent(isArabic ? 'رابط بوابة مشتركي وعملاء HR Navigator' : 'HR Navigator Client Advisory Portal')}&body=${encodeURIComponent(`${shareText}\n${clientPortalUrl}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e0f17] border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden">
        {/* Top Gold Accent Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#996515]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1a1c29] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-3 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">
              {isArabic ? 'مشاركة ونشر رابط المشتركين والعملاء' : 'Share & Publish Client Link'}
            </h3>
            <p className="text-xs text-[#9ea3b5] leading-relaxed max-w-sm mx-auto">
              {isArabic 
                ? 'انسخ الرابط الآمن المخصص للعملاء والمشتركين لإرساله عبر واتساب، البريد، أو وسائل التواصل، وهو معزول تماماً عن بيانات الملاك والإيرادات.' 
                : 'Share this client-safe link with subscribers. It is strictly isolated from executive admin and revenue data.'}
            </p>
          </div>

          {/* Primary Client Link Box */}
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#141522] border border-[#d4af37]/35 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#ffd700] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#d4af37]" />
                  <span>{isArabic ? 'رابط بوابة المشتركين (الاستشارات والطلبات)' : 'Client Portal Direct Link'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  {isArabic ? 'آمن للمشتركين 100%' : 'Client Safe'}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-[#0a0b10] p-2 rounded-xl border border-white/10 mb-3">
                <input
                  type="text"
                  readOnly
                  value={clientPortalUrl}
                  className="w-full bg-transparent text-xs text-[#e2e4ea] font-mono focus:outline-none select-all px-1"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(clientPortalUrl, 'portal')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black text-xs font-extrabold shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedClient ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span>{isArabic ? 'تم نسخ الرابط بنجاح!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>{isArabic ? 'نسخ رابط المشتركين' : 'Copy Client Link'}</span>
                    </>
                  )}
                </button>

                <a
                  href={clientPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#ffd700] border border-[#d4af37]/30 transition-colors flex items-center justify-center"
                  title={isArabic ? 'معاينة الرابط' : 'Open preview'}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Secondary Main Store / Homepage Link */}
            <div className="p-3.5 rounded-2xl bg-[#10111a] border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#c5c8d6]">
                  {isArabic ? 'رابط الموقع والصفحة الرئيسية المباشر:' : 'Main Homepage Direct Link:'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={mainStoreUrl}
                  className="flex-1 bg-[#090a10] border border-white/10 p-2 rounded-xl text-xs text-[#9ea3b5] font-mono focus:outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(mainStoreUrl, 'store')}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-[#d4af37]/20 text-[#ffd700] text-xs font-bold border border-white/10 hover:border-[#d4af37]/40 transition-all flex items-center gap-1.5"
                >
                  {copiedStore ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedStore ? (isArabic ? 'تم النسخ' : 'Copied') : (isArabic ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* Quick Share via Channels */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isArabic ? 'مشاركة عبر واتساب' : 'WhatsApp'}</span>
              </a>

              <a
                href={mailShareUrl}
                className="py-2.5 px-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>{isArabic ? 'إرسال بالبريد' : 'Email Link'}</span>
              </a>
            </div>
          </div>

          {/* Security guarantee footnote */}
          <div className="p-3 rounded-xl bg-[#090a10] border border-white/5 text-[11px] text-[#8a8d9a] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
            <span>
              {isArabic 
                ? 'ملاحظة: هذا الرابط يعرض الباقات وحجوزات المشترك فقط، ولا يحتوي على لوحة الملاك أو بيانات الإيرادات.' 
                : 'Note: This link only displays client services & their orders, completely hiding owner revenue & records.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
