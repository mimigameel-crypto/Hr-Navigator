import React, { useState } from 'react';
import { 
  Database, 
  Laptop, 
  CloudOff, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  HardDriveDownload,
  Share2
} from 'lucide-react';
import { Language } from '../types';

interface LocalStorageNoticeBannerProps {
  lang: Language;
}

export const LocalStorageNoticeBanner: React.FC<LocalStorageNoticeBannerProps> = ({ lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isArabic = lang === 'ar';

  return (
    <div 
      id="local-storage-sync-notice"
      className="mb-8 rounded-2xl bg-gradient-to-r from-[#111422] via-[#141829] to-[#0f121d] border border-amber-500/30 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Left Side: Icon & Summary */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
            <Database className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                {isArabic 
                  ? 'تنبيه حفظ البيانات وإدارتها محلياً (LocalStorage)' 
                  : 'Local Storage & Data Persistence Notice'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                {isArabic ? 'حفظ محلي في هذا المتصفح' : 'Client-Side Storage'}
              </span>
            </div>

            <p className="text-xs text-[#a6abc0] leading-relaxed max-w-3xl">
              {isArabic ? (
                <>
                  يتم حفظ الطلبات والمحتويات المعدّلة حالياً <strong className="text-amber-300">محلياً في ذاكرة متصفحك هذا (LocalStorage)</strong> لضمان عمل النظام بسرعة وسلاسة بدون انقطاع. يرجى العلم أن هذه البيانات 
                  <span className="text-white font-semibold"> لا تنتقل تلقائياً بين أجهزتك أو حساباتك الأخرى </span>
                  إلا في حال ربط المنصة بقاعدة بيانات سحابية مركزية (مثل Firebase أو Cloud Database).
                </>
              ) : (
                <>
                  Orders and custom resources are currently stored <strong className="text-amber-300">locally in your browser's LocalStorage</strong> for instant client-side performance. Note that these records 
                  <span className="text-white font-semibold"> do not automatically synchronize across different devices or separate accounts </span>
                  without connecting a centralized cloud database.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Toggle Details Button */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#ffd700] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? (isArabic ? 'إخفاء التفاصيل' : 'Hide Details') : (isArabic ? 'كيف أشارك البيانات؟' : 'How to Sync?')}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Explanation Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs animate-fade-in">
          {/* Card 1: What does this mean */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <Laptop className="w-4 h-4" />
              <span>{isArabic ? 'ماذا يعني الحفظ المحلي؟' : 'What does Local mean?'}</span>
            </div>
            <p className="text-[11px] text-[#8a8d9a] leading-relaxed">
              {isArabic 
                ? 'أي طلب أو مقال تضيفه هنا يبقى محفوظاً في هذا المتصفح وهذا الجهاز حتى لو أغلقت الصفحة. لكن فتحه من هاتف آخر أو حساب متصفح ثانٍ سيعرض البيانات الافتراضية.'
                : 'Any changes or bookings remain saved on this specific browser session, but viewing from another phone or fresh browser tab will show default data.'}
            </p>
          </div>

          {/* Card 2: Sharing with another account */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#60a5fa]">
              <Share2 className="w-4 h-4" />
              <span>{isArabic ? 'نقل التعديلات لحسابك الثاني' : 'Transferring Between Accounts'}</span>
            </div>
            <p className="text-[11px] text-[#8a8d9a] leading-relaxed">
              {isArabic 
                ? 'إذا أردت نقل كامل الكود والتعديلات إلى حسابك الثاني: استخدم زر "Export to GitHub" أو خيار "Download ZIP" في شريط أدوات المنصة لنقل المشروع بنقرة واحدة.'
                : 'To transfer everything to your second account, use the platform "Export to GitHub" or "Download ZIP" options to duplicate the exact updated project.'}
            </p>
          </div>

          {/* Card 3: Cloud Database Integration */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CloudOff className="w-4 h-4" />
              <span>{isArabic ? 'المزامنة السحابية الدائمة' : 'Centralized Cloud Sync'}</span>
            </div>
            <p className="text-[11px] text-[#8a8d9a] leading-relaxed">
              {isArabic 
                ? 'لجعل التعديلات والطلبات تظهر لحظياً على كل الهواتف وأجهزة الموظفين تلقائياً، يمكننا تفعيل قاعدة بيانات سحابية حية (مثل Firebase Firestore) في أي وقت تطلبه!'
                : 'To make all orders and edits appear instantaneously across all devices and accounts simultaneously, a live cloud database (e.g. Firebase) can be configured upon request!'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
