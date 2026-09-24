import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language, ActiveView } from '../types';
import { CreativeStudioModal } from './CreativeStudioModal';

interface CreativeStudioPageViewProps {
  lang: Language;
  onBackToStore: () => void;
  onToggleView: (view: ActiveView) => void;
}

export const CreativeStudioPageView: React.FC<CreativeStudioPageViewProps> = ({
  lang,
  onBackToStore,
  onToggleView,
}) => {
  const isArabic = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#07080c] py-8 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToStore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#d4af37]/30 bg-[#121420] text-xs sm:text-sm font-bold text-[#ffd700] hover:bg-[#1a1c2c] transition-colors"
          >
            {isArabic ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isArabic ? 'العودة للرئيسية والخدمات' : 'Back to Store & Advisory'}</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#ffd700] text-xs font-bold border border-[#d4af37]/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veo 3.1 & Gemini Flash</span>
          </span>
        </div>

        {/* Embedded Studio Modal Component (always open in page view) */}
        <CreativeStudioModal
          isOpen={true}
          onClose={onBackToStore}
          lang={lang}
        />
      </div>
    </div>
  );
};
