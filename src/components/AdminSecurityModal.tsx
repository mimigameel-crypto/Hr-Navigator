import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  ArrowRight,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { BrandLogo } from './BrandLogo';

interface AdminSecurityModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({
  isOpen,
  lang,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  // Secret Owner PINs
  const VALID_PINS = ['7923', '1984', 'admin'];

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim().toLowerCase();
    if (VALID_PINS.includes(cleanPin)) {
      setError('');
      onSuccess();
      onClose();
    } else {
      setError(
        isArabic 
          ? 'رمز الأمان السري غير صحيح. هذه المنطقة مخصصة لملاك وإدارة HR Navigator فقط.' 
          : 'Incorrect security PIN. This area is strictly restricted to HR Navigator owners.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0e0f17] border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] overflow-hidden">
        {/* Top Gold Accent Stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#996515]" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-[#8a8d9a] hover:text-[#ffd700] p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1a1c29] border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-3 shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">
              {isArabic ? 'بوابة الملاك والإدارة الاستشارية' : 'HR Navigator Owner & Executive Portal'}
            </h3>
            <p className="text-xs text-[#9ea3b5] leading-relaxed max-w-sm mx-auto">
              {isArabic 
                ? 'هذه اللوحة محمية وسرية، وتحتوي على تقارير الإيرادات، إدارة الحجوزات، والفواتير.' 
                : 'This executive portal is strictly confidential, containing revenue reports and client bookings.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#c5c8d6] mb-2 text-right rtl:text-right ltr:text-left">
                {isArabic ? 'أدخل رمز الأمان السري للملاك (PIN Code):' : 'Enter Executive Access PIN:'}
              </label>
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 rtl:left-auto rtl:right-3 w-5 h-5 text-[#d4af37]" />
                <input
                  type="password"
                  autoFocus
                  required
                  value={pin}
                  onChange={e => {
                    setPin(e.target.value);
                    setError('');
                  }}
                  placeholder="••••"
                  maxLength={10}
                  className="w-full pl-11 pr-4 rtl:pl-4 rtl:pr-11 py-3 rounded-xl bg-[#141520] border border-[#d4af37]/35 focus:border-[#ffd700] text-center font-mono text-xl tracking-[0.4em] text-[#ffd700] placeholder-[#4d5162] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-[#0c0d12] text-sm font-extrabold shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isArabic ? 'التحقق وفتح لوحة الملاك' : 'Authenticate & Unlock'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </form>

          {/* Hint / Reminder for Owner */}
          <div className="mt-5 pt-4 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-[11px] text-[#8a8d9a] hover:text-[#d4af37] transition-colors inline-flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isArabic ? 'مساعدة المالك في رمز الدخول' : 'Owner PIN Hint'}</span>
            </button>
            {showHint && (
              <p className="text-[11px] text-[#ffd700] mt-1.5 bg-[#141622] p-2 rounded-lg border border-[#d4af37]/20 animate-in fade-in">
                {isArabic 
                  ? 'رمز المرور المعتمد للإدارة هو: 7923 أو 1984 (أو كتابة admin)' 
                  : 'Default Owner PIN is: 7923 or 1984 (or type admin)'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
