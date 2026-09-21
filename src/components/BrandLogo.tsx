import React from 'react';
import { Language } from '../types';

interface BrandLogoProps {
  lang: Language;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'horizontal' | 'stacked';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  lang,
  size = 'md',
  showSubtitle = true,
  className = '',
  onClick,
  variant = 'horizontal'
}) => {
  const isArabic = lang === 'ar';

  // Sizing configurations with larger, more imposing typography for HR Navigate
  const iconSizes = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-32 h-32 sm:w-40 sm:h-40',
    hero: 'w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40'
  };

  const titleSizes = {
    sm: 'text-base sm:text-lg font-bold tracking-wider',
    md: 'text-xl sm:text-2xl font-bold tracking-wider',
    lg: 'text-3xl sm:text-4xl font-extrabold tracking-wider',
    xl: 'text-4xl sm:text-5xl font-extrabold tracking-wider',
    '2xl': 'text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide',
    hero: 'text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide'
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.22em]',
    md: 'text-[11px] sm:text-xs tracking-[0.28em]',
    lg: 'text-xs sm:text-sm tracking-[0.35em]',
    xl: 'text-sm sm:text-base tracking-[0.4em]',
    '2xl': 'text-base sm:text-lg tracking-[0.45em]',
    hero: 'text-xs sm:text-sm md:text-base tracking-[0.45em]'
  };

  return (
    <div
      id="brand-logo-container"
      dir="ltr"
      onClick={onClick}
      className={`logo-shimmer-container inline-flex ${
        variant === 'stacked' ? 'flex-col items-center text-center' : 'items-center'
      } gap-3 sm:gap-5 cursor-pointer group select-none relative ${className}`}
    >
      {/* High-Fidelity HR Navigator Compass Emblem (Strictly on Left) */}
      <div 
        className={`relative ${iconSizes[size]} flex-shrink-0 transition-all duration-300 group-hover:scale-105 overflow-hidden rounded-full p-0.5`}
      >
        {/* Animated Gleam / Flash Light Sweep on Hover ("ومض") */}
        <div className="logo-gleam-line absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/85 to-transparent -translate-x-[160%] opacity-0 pointer-events-none z-10" />

        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg-emblem w-full h-full drop-shadow-[0_2px_14px_rgba(212,175,55,0.55)] transition-all duration-300 group-hover:drop-shadow-[0_0_24px_rgba(255,215,0,0.85)]"
        >
          <defs>
            {/* Primary Lustrous 24K Gold Gradient */}
            <linearGradient id="hrGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#F7DF8C" />
              <stop offset="55%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#B3861B" />
              <stop offset="100%" stopColor="#87600E" />
            </linearGradient>

            {/* Shadow Facet Bevel Gradient */}
            <linearGradient id="hrGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="45%" stopColor="#9C7317" />
              <stop offset="85%" stopColor="#634504" />
              <stop offset="100%" stopColor="#382502" />
            </linearGradient>

            {/* Radial Gold Ambient Glow */}
            <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(247, 223, 140, 0.45)" />
              <stop offset="70%" stopColor="rgba(212, 175, 55, 0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="60" cy="60" r="58" fill="url(#compassGlow)" opacity="0.75" />

          {/* 8-Point Compass Star Points */}
          {/* North Point */}
          <polygon points="60,2 60,60 50,41" fill="url(#hrGoldLight)" />
          <polygon points="60,2 60,60 70,41" fill="url(#hrGoldDark)" />

          {/* South Point */}
          <polygon points="60,118 60,60 70,79" fill="url(#hrGoldLight)" />
          <polygon points="60,118 60,60 50,79" fill="url(#hrGoldDark)" />

          {/* East Point */}
          <polygon points="118,60 60,60 79,50" fill="url(#hrGoldLight)" />
          <polygon points="118,60 60,60 79,70" fill="url(#hrGoldDark)" />

          {/* West Point */}
          <polygon points="2,60 60,60 41,70" fill="url(#hrGoldLight)" />
          <polygon points="2,60 60,60 41,50" fill="url(#hrGoldDark)" />

          {/* Diagonal Points (NE, NW, SE, SW) */}
          <polygon points="101,19 60,60 76,40" fill="url(#hrGoldLight)" opacity="0.95" />
          <polygon points="101,19 60,60 84,48" fill="url(#hrGoldDark)" opacity="0.95" />

          <polygon points="19,19 60,60 44,40" fill="url(#hrGoldDark)" opacity="0.95" />
          <polygon points="19,19 60,60 36,48" fill="url(#hrGoldLight)" opacity="0.95" />

          <polygon points="101,101 60,60 84,72" fill="url(#hrGoldLight)" opacity="0.95" />
          <polygon points="101,101 60,60 76,80" fill="url(#hrGoldDark)" opacity="0.95" />

          <polygon points="19,101 60,60 36,72" fill="url(#hrGoldDark)" opacity="0.95" />
          <polygon points="19,101 60,60 44,80" fill="url(#hrGoldLight)" opacity="0.95" />

          {/* Dual Metallic Compass Rings */}
          <circle cx="60" cy="60" r="39" stroke="url(#hrGoldLight)" strokeWidth="3" fill="#090a0f" />
          <circle cx="60" cy="60" r="35" stroke="url(#hrGoldDark)" strokeWidth="1.2" fill="none" opacity="0.9" />

          {/* Human Figure Head (Gold Sphere atop center H/R stem) */}
          <circle cx="53" cy="36" r="4.5" fill="url(#hrGoldLight)" stroke="#090a0f" strokeWidth="0.8" />

          {/* Stylized Interlocking HR Monogram */}
          {/* 'H' Left Pillar with Serifs */}
          <path
            d="M37 41 H44 V77 H37 Z M34 40 H47 V43 H34 Z M34 75 H47 V78 H34 Z"
            fill="url(#hrGoldLight)"
          />

          {/* 'H' Crossbar */}
          <rect x="43" y="56" width="16" height="5.5" fill="url(#hrGoldLight)" />

          {/* Central Stem (Shared between H right & R left) */}
          <path
            d="M50 41 H57 V77 H50 Z M48 40 H59 V43 H48 Z M48 75 H59 V78 H48 Z"
            fill="url(#hrGoldLight)"
          />

          {/* 'R' Upper Loop */}
          <path
            d="M55 41 H69 C77 41 82 45 82 52 C82 58 77 62 69 62 H55 V41 Z M62 46 V57 H68 C72 57 75 55 75 52 C75 48 72 46 68 46 H62 Z"
            fill="url(#hrGoldLight)"
          />

          {/* Navigator Compass Dynamic Arrow Slicing through R pointing NE */}
          <g>
            {/* Arrow Shaft */}
            <polygon
              points="39,74 79,47 76,43 36,70"
              fill="url(#hrGoldLight)"
              stroke="#090a0f"
              strokeWidth="0.8"
            />
            {/* Arrow Head Pointing North-East */}
            <polygon
              points="87,42 74,40 78,53"
              fill="url(#hrGoldLight)"
              stroke="#090a0f"
              strokeWidth="0.8"
            />
          </g>

          {/* 'R' Right Leg Base */}
          <path
            d="M66 62 L80 77 H71 L59 64 Z"
            fill="url(#hrGoldDark)"
          />
        </svg>
      </div>

      {/* Typographic Identity Matching Screenshot (HR NAVIGATOR on Right of Logo) */}
      <div className={`relative overflow-hidden flex flex-col ${variant === 'stacked' ? 'items-center text-center' : 'items-start text-left'} rounded-lg px-1 py-0.5`}>
        {/* Animated Gleam / Flash Light Sweep on Hover over the Name ("ومض للاسم") */}
        <div className="logo-text-gleam absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-[160%] opacity-0 pointer-events-none z-10" />

        <div className="flex items-center gap-2 relative">
          <span
            className={`${titleSizes[size]} logo-text-title font-serif gold-gradient-text tracking-wider font-extrabold leading-none transition-all duration-300 drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            HR NAVIGATOR
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1.5 w-full">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
            <span
              className={`${subtitleSizes[size]} text-[#d4af37] font-semibold uppercase leading-tight tracking-[0.3em] sm:tracking-[0.4em] transition-colors duration-300 group-hover:text-[#ffd700]`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              CONSULTING
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
