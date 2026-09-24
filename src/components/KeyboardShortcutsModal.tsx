import React from 'react';
import { 
  Keyboard, 
  X, 
  Command, 
  ArrowUp, 
  Search, 
  BookOpen, 
  Building, 
  LayoutDashboard, 
  Cloud, 
  ShoppingCart, 
  Globe, 
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { Language } from '../types';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isArabic = lang === 'ar';

  if (!isOpen) return null;

  const shortcuts = [
    {
      keys: ['?'],
      descAr: 'فتح / إغلاق دليل اختصارات لوحة المفاتيح',
      descEn: 'Open / close this keyboard shortcuts guide',
      icon: <HelpCircle className="w-4 h-4 text-[#d4af37]" />
    },
    {
      keys: ['M'],
      descAr: 'الانتقال إلى مجلة HR Navigator التنفيذية',
      descEn: 'Navigate to HR Navigator Executive Magazine',
      icon: <BookOpen className="w-4 h-4 text-[#ffd700]" />
    },
    {
      keys: ['D'],
      descAr: 'فتح سحابة ملفات Google Drive (الحسابات المتعددة)',
      descEn: 'Open Google Drive Cloud Files (Multi-accounts)',
      icon: <Cloud className="w-4 h-4 text-[#4285F4]" />
    },
    {
      keys: ['P'],
      descAr: 'بوابة المشتركين والعملاء (Client Portal)',
      descEn: 'Client & Subscriber Portal',
      icon: <Building className="w-4 h-4 text-[#38bdf8]" />
    },
    {
      keys: ['H'],
      descAr: 'العودة للرئيسية واستعراض باقات الاستشارات',
      descEn: 'Home & Advisory Consultations Catalog',
      icon: <LayoutDashboard className="w-4 h-4 text-[#a78bfa]" />
    },
    {
      keys: ['C'],
      descAr: 'فتح سلة المشتريات والطلبات',
      descEn: 'Open Cart & Consultations Drawer',
      icon: <ShoppingCart className="w-4 h-4 text-[#fbbf24]" />
    },
    {
      keys: ['Q'],
      descAr: 'الدفع السريع المباشر (Quick Checkout)',
      descEn: 'Direct Quick Pay Checkout',
      icon: <CreditCard className="w-4 h-4 text-[#34d399]" />
    },
    {
      keys: ['L'],
      descAr: 'تبديل لغة الواجهة (العربية / English)',
      descEn: 'Switch language (Arabic / English)',
      icon: <Globe className="w-4 h-4 text-[#f472b6]" />
    },
    {
      keys: ['T'],
      descAr: 'الرجوع فوراً إلى أعلى الصفحة',
      descEn: 'Smooth scroll to top of page',
      icon: <ArrowUp className="w-4 h-4 text-[#fb7185]" />
    },
    {
      keys: ['Esc'],
      descAr: 'إغلاق أي نافذة منبثقة نشطة',
      descEn: 'Close active modal / drawer',
      icon: <X className="w-4 h-4 text-[#94a3b8]" />
    }
  ];

  return (
    <div 
      id="keyboard-shortcuts-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="keyboard-shortcuts-dialog"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-2xl bg-[#0e1017] border border-[#d4af37]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.2)] overflow-hidden my-8"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Top Gold Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-[#f3e8c8] to-[#c59b27]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-[#171a26] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] shadow-md">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1e2333] text-[#ffd700] text-[10px] font-bold border border-[#d4af37]/30 mb-0.5">
                <Command className="w-3 h-3" />
                <span>{isArabic ? 'سرعة وسهولة التصفح' : 'Quick Navigation'}</span>
              </div>
              <h2 className="text-lg font-bold text-white font-serif">
                {isArabic ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-[#9ea3b5] mb-4 leading-relaxed">
            {isArabic 
              ? 'اضغط على المفاتيح الموضحة أدناه في أي وقت لتنفيذ الإجراء بسرعة دون استخدام الفأرة:'
              : 'Press the keys below at any time for quick navigation and control:'}
          </p>

          {/* Shortcuts Grid / List */}
          <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
            {shortcuts.map((item, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-[#141624] border border-white/5 hover:border-[#d4af37]/30 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-black/40 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-xs text-[#e2e4ea] font-medium">
                    {isArabic ? item.descAr : item.descEn}
                  </span>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {item.keys.map((k, kIdx) => (
                    <kbd 
                      key={kIdx}
                      className="px-2 py-1 rounded-md bg-[#1f2235] border border-white/20 text-[#ffd700] font-mono text-[11px] font-bold shadow-inner min-w-[26px] text-center"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8a8d9a]">
            <span>
              {isArabic ? 'اضغط ? في أي وقت لفتح هذه القائمة' : 'Press ? anytime to toggle this menu'}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1 rounded-lg bg-[#d4af37] text-black text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
            >
              {isArabic ? 'فهمت' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
