import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';

interface ScrollToTopButtonProps {
  lang: Language;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ lang }) => {
  const [visible, setVisible] = useState(false);
  const isArabic = lang === 'ar';

  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop || window.scrollY;
      if (scrolled > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisible, { passive: true });
    // Check initial position
    toggleVisible();

    return () => {
      window.removeEventListener('scroll', toggleVisible);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <div
      id="floating-scroll-to-top-container"
      className={`fixed bottom-6 ${isArabic ? 'right-6' : 'left-6'} z-40 animate-in fade-in zoom-in duration-300`}
    >
      <button
        id="btn-floating-scroll-to-top"
        type="button"
        onClick={scrollToTop}
        className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-[#151722] to-[#1e2233] border border-[#d4af37]/60 hover:border-[#ffd700] text-[#ffd700] hover:text-white shadow-[0_8px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.35)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
        title={isArabic ? 'العودة إلى أعلى الموقع' : 'Back to top'}
        aria-label={isArabic ? 'أعلى الصفحة' : 'Scroll to top'}
      >
        <div className="w-7 h-7 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
          <ArrowUp className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <span className="text-xs font-bold font-serif tracking-wider">
          {isArabic ? 'أعلى' : 'Top'}
        </span>
      </button>
    </div>
  );
};
