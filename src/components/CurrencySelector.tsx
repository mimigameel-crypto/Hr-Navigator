import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Coins, Globe2 } from 'lucide-react';
import { Currency, Language } from '../types';
import { currencies, ALL_CURRENCIES, GCC_CURRENCIES } from '../utils/currency';

interface CurrencySelectorProps {
  currentCurrency: Currency;
  onSelectCurrency: (c: Currency) => void;
  lang: Language;
  variant?: 'compact' | 'full' | 'pills';
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onSelectCurrency,
  lang,
  variant = 'compact',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isArabic = lang === 'ar';

  const activeConfig = currencies[currentCurrency] || currencies.SAR;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
        {ALL_CURRENCIES.map(code => {
          const item = currencies[code];
          const isSelected = currentCurrency === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => onSelectCurrency(code)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                isSelected
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0b0c10] shadow-[0_0_12px_rgba(212,175,55,0.35)] scale-105'
                  : 'bg-[#141520] text-[#9ea3b5] hover:text-white border border-[#d4af37]/20 hover:border-[#d4af37]/50'
              }`}
            >
              <span className="text-sm">{item.flag}</span>
              <span className="font-mono">{code}</span>
              <span className="text-[10px] opacity-80 font-normal">
                ({isArabic ? item.symbolAr : item.symbolEn})
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Dropdown Button */}
      <button
        id="btn-currency-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#d4af37]/35 bg-[#14151e]/80 hover:bg-[#1c1e2a] hover:border-[#d4af37]/60 text-xs font-bold text-[#ffd700] transition-all cursor-pointer shadow-sm select-none"
        title={isArabic ? 'تغيير عملة الدفع' : 'Change Payment Currency'}
      >
        <span className="text-base leading-none">{activeConfig.flag}</span>
        <span className="font-mono">{activeConfig.code}</span>
        <span className="text-[#9ea3b5] text-[11px] font-normal">
          ({isArabic ? activeConfig.symbolAr : activeConfig.symbolEn})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#d4af37] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="currency-dropdown-menu"
          className="absolute z-50 top-full mt-1.5 right-0 rtl:right-auto rtl:left-0 w-64 max-h-[80vh] overflow-y-auto rounded-xl bg-[#0f1017] border border-[#d4af37]/40 shadow-[0_10px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.2)] p-1.5 backdrop-blur-xl divide-y divide-white/5 custom-scrollbar"
        >
          {/* GCC Currencies Section */}
          <div className="pb-1.5">
            <div className="px-2.5 py-1 text-[10px] font-bold text-[#ffd700] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Coins className="w-3 h-3 text-[#d4af37]" />
              <span>{isArabic ? 'عملات دول الخليج العربي (GCC)' : 'GCC Currencies'}</span>
            </div>

            <div className="space-y-0.5">
              {GCC_CURRENCIES.map(code => {
                const item = currencies[code];
                const isSelected = currentCurrency === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onSelectCurrency(code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                        : 'text-[#e5e5e5] hover:bg-[#1a1b26] hover:text-[#ffd700]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <div className="text-right rtl:text-right ltr:text-left">
                        <span className="font-mono font-bold block leading-none">{code}</span>
                        <span className="text-[10px] text-[#8a8d9a] leading-tight">
                          {isArabic ? item.nameAr : item.nameEn}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-[#d4af37] font-bold px-1.5 py-0.5 rounded bg-black/40">
                      {isArabic ? item.symbolAr : item.symbolEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* International & Regional Currencies Section */}
          <div className="pt-1.5">
            <div className="px-2.5 py-1 text-[10px] font-bold text-[#9ea3b5] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Globe2 className="w-3 h-3 text-[#8a8d9a]" />
              <span>{isArabic ? 'عملات دولية وعربية أخرى' : 'Other Currencies'}</span>
            </div>

            <div className="space-y-0.5">
              {(['USD', 'EGP'] as Currency[]).map(code => {
                const item = currencies[code];
                const isSelected = currentCurrency === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      onSelectCurrency(code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/40'
                        : 'text-[#e5e5e5] hover:bg-[#1a1b26] hover:text-[#ffd700]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <div className="text-right rtl:text-right ltr:text-left">
                        <span className="font-mono font-bold block leading-none">{code}</span>
                        <span className="text-[10px] text-[#8a8d9a] leading-tight">
                          {isArabic ? item.nameAr : item.nameEn}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-[#d4af37] font-bold px-1.5 py-0.5 rounded bg-black/40">
                      {isArabic ? item.symbolAr : item.symbolEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
