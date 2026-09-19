import React from 'react';
import { Language } from '../types';

interface BrandLogoProps {
  lang: Language;
  size?: 'sm' | 'md' | 'lg' | 'xl';
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

  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const titleSizes = {
    sm: 'text-sm font-bold tracking-wider',
    md: 'text-lg sm:text-xl font-bold tracking-wider',
    lg: 'text-2xl sm:text-3xl font-extrabold tracking-wider',
    xl: 'text-3xl sm:text-4xl font-extrabold tracking-wider'
  };

  const subtitleSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[10px] sm:text-[11px] tracking-[0.28em]',
    lg: 'text-xs sm:text-sm tracking-[0.35em]',
    xl: 'text-sm sm:text-base tracking-[0.4em]'
  };

  return (
    <div
      id="brand-logo-container"
      onClick={onClick}
      className={`inline-flex ${variant === 'stacked' ? 'flex-col items-center text-center' : 'items-center'} gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* High-Fidelity HR Navigator Compass Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(212,175,55,0.45)]"
        >
          <defs>
            {/* Primary Lustrous Gold Gradient */}
            <linearGradient id="hrGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF8E7" />
              <stop offset="25%" stopColor="#F5D77F" />
              <stop offset="60%" stopColor="#D4AF37" />
              <stop offset="85%" stopColor="#B3861B" />
              <stop offset="100%" stopColor="#8C6611" />
            </linearGradient>

            {/* Shadow Facet Gold Gradient */}
            <linearGradient id="hrGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="50%" stopColor="#997017" />
              <stop offset="100%" stopColor="#4A3403" />
            </linearGradient>

            {/* Radial Gold Glow */}
            <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(245, 215, 127, 0.35)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>

          {/* Background Ambient Glow */}
          <circle cx="60" cy="60" r="58" fill="url(#compassGlow)" opacity="0.6" />

          {/* 8-Point Compass Star Points */}
          {/* North Point */}
          <polygon points="60,2 60,60 51,40" fill="url(#hrGoldLight)" />
          <polygon points="60,2 60,60 69,40" fill="url(#hrGoldDark)" />

          {/* South Point */}
          <polygon points="60,118 60,60 69,80" fill="url(#hrGoldLight)" />
          <polygon points="60,118 60,60 51,80" fill="url(#hrGoldDark)" />

          {/* East Point */}
          <polygon points="118,60 60,60 80,51" fill="url(#hrGoldLight)" />
          <polygon points="118,60 60,60 80,69" fill="url(#hrGoldDark)" />

          {/* West Point */}
          <polygon points="2,60 60,60 40,69" fill="url(#hrGoldLight)" />
          <polygon points="2,60 60,60 40,51" fill="url(#hrGoldDark)" />

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
          <circle cx="60" cy="60" r="38" stroke="url(#hrGoldLight)" strokeWidth="3" fill="#0c0d12" />
          <circle cx="60" cy="60" r="34" stroke="url(#hrGoldDark)" strokeWidth="1.2" fill="none" opacity="0.85" />

          {/* Human Figure Head (Gold Sphere atop H-crossbar) */}
          <circle cx="53" cy="38" r="4.2" fill="url(#hrGoldLight)" stroke="#0c0d12" strokeWidth="0.8" />

          {/* Stylized Interlocking HR Monogram */}
          {/* 'H' Left Pillar with Serifs */}
          <path
            d="M38 42 H45 V76 H38 Z M36 42 H47 V45 H36 Z M36 73 H47 V76 H36 Z"
            fill="url(#hrGoldLight)"
          />

          {/* 'H' Crossbar */}
          <rect x="44" y="55" width="16" height="5.5" fill="url(#hrGoldLight)" />

          {/* Central Stem (Shared between H right & R left) */}
          <path
            d="M50 42 H57 V76 H50 Z M48 42 H59 V45 H48 Z M48 73 H59 V76 H48 Z"
            fill="url(#hrGoldLight)"
          />

          {/* 'R' Upper Loop */}
          <path
            d="M55 42 H68 C76 42 81 46 81 53 C81 59 76 63 68 63 H55 V42 Z M62 47 V58 H67 C71 58 74 56 74 53 C74 49 71 47 67 47 H62 Z"
            fill="url(#hrGoldLight)"
          />

          {/* Navigator Compass Arrow Slicing through R Leg pointing NE */}
          <g>
            {/* Arrow Shaft */}
            <polygon
              points="40,73 78,48 75,44 37,69"
              fill="url(#hrGoldLight)"
              stroke="#0c0d12"
              strokeWidth="0.8"
            />
            {/* Arrow Head */}
            <polygon
              points="84,43 73,42 77,53"
              fill="url(#hrGoldLight)"
              stroke="#0c0d12"
              strokeWidth="0.8"
            />
          </g>

          {/* 'R' Right Leg Base */}
          <path
            d="M66 62 L79 76 H70 L59 64 Z"
            fill="url(#hrGoldDark)"
          />
        </svg>
      </div>

      {/* Typographic Identity Matching Screenshot */}
      <div className={`flex flex-col ${variant === 'stacked' ? 'items-center' : 'text-left rtl:text-right'}`}>
        <div className="flex items-center gap-1.5">
          <span
            className={`${titleSizes[size]} font-serif gold-gradient-text tracking-widest font-extrabold leading-none`}
            style={{ fontFamily: "'Cinzel', 'Cairo', serif" }}
          >
            {isArabic ? 'HR NAVIGATOR' : 'HR NAVIGATOR'}
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`${subtitleSizes[size]} text-[#c59b27] font-semibold uppercase leading-tight`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              C O N S U L T A T I O N S
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
