import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  ShieldCheck, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  FileText, 
  Sparkles, 
  Compass, 
  Layers, 
  Mail, 
  CreditCard, 
  Smartphone,
  Share2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Printer
} from 'lucide-react';
import { Language } from '../types';
import { BrandLogo } from './BrandLogo';

interface BrandGuidelinesModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const BrandGuidelinesModal: React.FC<BrandGuidelinesModalProps> = ({
  lang,
  isOpen,
  onClose
}) => {
  const isArabic = lang === 'ar';
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'colors' | 'typography' | 'logo_rules' | 'stationery' | 'email_signature'>('overview');
  const [signatureName, setSignatureName] = useState('د. استشاري الموارد البشرية');
  const [signatureTitle, setSignatureTitle] = useState('Senior HR Consultant & Managing Partner');
  const [signaturePhone, setSignaturePhone] = useState('+966 50 000 0000');
  const [copiedSignature, setCopiedSignature] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const brandColors = [
    {
      id: 'gold-primary',
      nameAr: 'الذهب الملكي الاستشاري (Primary Gold)',
      nameEn: 'Consulting Royal Gold',
      roleAr: 'اللون الأساسي للشعار، الأزرار الرئيسية، والأختام المعتمدة',
      roleEn: 'Primary emblem, main CTA buttons, verified seals',
      hex: '#D4AF37',
      rgb: 'RGB(212, 175, 55)',
      cmyk: 'CMYK(0, 17, 74, 17)',
      bgClass: 'bg-[#D4AF37]',
      textColor: 'text-black'
    },
    {
      id: 'gold-light',
      nameAr: 'الوهج الذهبي المشع (Bright Accent Gold)',
      nameEn: 'Lustrous Accent Gold',
      roleAr: 'التأثيرات الضوئية، التدرجات، والتركيز على العناوين المهمة',
      roleEn: 'Gleams, gradients, high-emphasis text',
      hex: '#FFD700',
      rgb: 'RGB(255, 215, 0)',
      cmyk: 'CMYK(0, 16, 100, 0)',
      bgClass: 'bg-[#FFD700]',
      textColor: 'text-black'
    },
    {
      id: 'navy-obsidian',
      nameAr: 'الكحلي الليلي الفاخر (Deep Obsidian Navy)',
      nameEn: 'Deep Obsidian Navy',
      roleAr: 'الخلفية الرسمية للمنصة، كروت الخدمات، والجوائز المطبوعة',
      roleEn: 'Official canvas background, premium service cards',
      hex: '#080A11',
      rgb: 'RGB(8, 10, 17)',
      cmyk: 'CMYK(53, 41, 0, 93)',
      bgClass: 'bg-[#080A11]',
      textColor: 'text-white'
    },
    {
      id: 'navy-surface',
      nameAr: 'كحلي الأسطح الذكية (Surface Midnight)',
      nameEn: 'Surface Midnight',
      roleAr: 'خلفيات الحاويات والبطاقات والنماذج التفاعلية',
      roleEn: 'Container cards, modals, and interactive panels',
      hex: '#12141F',
      rgb: 'RGB(18, 20, 31)',
      cmyk: 'CMYK(42, 35, 0, 88)',
      bgClass: 'bg-[#12141F]',
      textColor: 'text-white'
    },
    {
      id: 'cloud-blue',
      nameAr: 'أزرق السحابة المعتمد (Cloud Blue)',
      nameEn: 'Google Cloud Blue',
      roleAr: 'سحابة Google Drive، التوافق السحابي، والتقارير الرقمية',
      roleEn: 'Google Drive sync, cloud infrastructure tags',
      hex: '#4285F4',
      rgb: 'RGB(66, 133, 244)',
      cmyk: 'CMYK(73, 45, 0, 4)',
      bgClass: 'bg-[#4285F4]',
      textColor: 'text-white'
    },
    {
      id: 'slate-neutral',
      nameAr: 'الرمادي الاستشاري المقروء (Slate Text)',
      nameEn: 'Consulting Slate',
      roleAr: 'النصوص الفرعية والشروحات التوضيحية لضمان راحة العين',
      roleEn: 'Subtexts, descriptions, high readability contrast',
      hex: '#9EA3B5',
      rgb: 'RGB(158, 163, 181)',
      cmyk: 'CMYK(13, 10, 0, 29)',
      bgClass: 'bg-[#9EA3B5]',
      textColor: 'text-black'
    }
  ];

  const handleDownloadSVG = () => {
    // Generate clean SVG download of the official emblem
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hrGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFF9E6" />
      <stop offset="25%" stop-color="#F7DF8C" />
      <stop offset="55%" stop-color="#D4AF37" />
      <stop offset="85%" stop-color="#B3861B" />
      <stop offset="100%" stop-color="#87600E" />
    </linearGradient>
    <linearGradient id="hrGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="45%" stop-color="#9C7317" />
      <stop offset="85%" stop-color="#634504" />
      <stop offset="100%" stop-color="#382502" />
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="#080A11" />
  <polygon points="60,2 60,60 50,41" fill="url(#hrGoldLight)" />
  <polygon points="60,2 60,60 70,41" fill="url(#hrGoldDark)" />
  <polygon points="60,118 60,60 70,79" fill="url(#hrGoldLight)" />
  <polygon points="60,118 60,60 50,79" fill="url(#hrGoldDark)" />
  <polygon points="118,60 60,60 79,50" fill="url(#hrGoldLight)" />
  <polygon points="118,60 60,60 79,70" fill="url(#hrGoldDark)" />
  <polygon points="2,60 60,60 41,70" fill="url(#hrGoldLight)" />
  <polygon points="2,60 60,60 41,50" fill="url(#hrGoldDark)" />
  <polygon points="101,19 60,60 76,40" fill="url(#hrGoldLight)" />
  <polygon points="101,19 60,60 84,48" fill="url(#hrGoldDark)" />
  <polygon points="19,19 60,60 44,40" fill="url(#hrGoldDark)" />
  <polygon points="19,19 60,60 36,48" fill="url(#hrGoldLight)" />
  <polygon points="101,101 60,60 84,72" fill="url(#hrGoldLight)" />
  <polygon points="101,101 60,60 76,80" fill="url(#hrGoldDark)" />
  <polygon points="19,101 60,60 36,72" fill="url(#hrGoldDark)" />
  <polygon points="19,101 60,60 44,80" fill="url(#hrGoldLight)" />
  <circle cx="60" cy="60" r="39" stroke="url(#hrGoldLight)" stroke-width="3" fill="#090a0f" />
  <circle cx="60" cy="60" r="35" stroke="url(#hrGoldDark)" stroke-width="1.2" fill="none" opacity="0.9" />
  <circle cx="53" cy="36" r="4.5" fill="url(#hrGoldLight)" stroke="#090a0f" stroke-width="0.8" />
  <path d="M37 41 H44 V77 H37 Z M34 40 H47 V43 H34 Z M34 75 H47 V78 H34 Z" fill="url(#hrGoldLight)" />
  <rect x="43" y="56" width="16" height="5.5" fill="url(#hrGoldLight)" />
  <path d="M50 41 H57 V77 H50 Z M48 40 H59 V43 H48 Z M48 75 H59 V78 H48 Z" fill="url(#hrGoldLight)" />
  <path d="M55 41 H69 C77 41 82 45 82 52 C82 58 77 62 69 62 H55 V41 Z M62 46 V57 H68 C72 57 75 55 75 52 C75 48 72 46 68 46 H62 Z" fill="url(#hrGoldLight)" />
  <polygon points="68,60 82,77 73,77 61,62" fill="url(#hrGoldLight)" />
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HR-Navigator-Emblem-Official.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyEmailSignatureHTML = () => {
    const htmlCode = `
<table style="font-family: Arial, sans-serif; font-size: 13px; color: #222; max-width: 520px; border-left: 3px solid #d4af37; padding-left: 14px;">
  <tr>
    <td style="vertical-align: top; padding-right: 14px;">
      <div style="font-size: 16px; font-weight: bold; color: #0d1117;">${signatureName}</div>
      <div style="font-size: 12px; color: #b8860b; font-weight: 600; text-transform: uppercase; margin-top: 2px;">${signatureTitle}</div>
      <div style="font-size: 12px; color: #555; margin-top: 6px;">HR Navigator Consultations | استشارات الموارد البشرية</div>
      <div style="font-size: 11px; color: #666; margin-top: 4px;">الهاتف: ${signaturePhone} | البريد: info@hrnavigator.org</div>
      <div style="font-size: 11px; color: #d4af37; margin-top: 3px;">المملكة العربية السعودية • جمهورية مصر العربية</div>
    </td>
  </tr>
</table>`;
    navigator.clipboard.writeText(htmlCode);
    setCopiedSignature(true);
    setTimeout(() => setCopiedSignature(false), 3000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="brand-guidelines-modal"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl my-auto rounded-3xl bg-[#0b0d14] border border-[#d4af37]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#141624] via-[#1a1d30] to-[#121422] border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] shadow-md">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[10px] font-bold text-[#ffd700] tracking-wider uppercase">
                  Official Brand Architecture
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isArabic ? 'معتمد 100%' : '100% Verified'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {isArabic ? 'دليل وأصول الهوية البصرية الرسمية' : 'Official Visual Identity & Brand Guidelines'}
              </h2>
              <p className="text-xs text-[#9ea3b5]">
                HR Navigator Consultations • نظام الهوية، الألوان، المطبوعات والتطبيقات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37]/25 border border-[#d4af37]/40 text-xs font-bold text-[#ffd700] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isArabic ? 'تحميل الشعار (SVG)' : 'Download Logo SVG'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-[#9ea3b5] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-[#0e1018] border-b border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'نظرة عامة وفلسفة الهوية' : 'Identity Overview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('colors')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'colors'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isArabic ? 'باليت الألوان وأكواد الطباعة' : 'Color Palette (HEX/CMYK)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('typography')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'typography'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{isArabic ? 'الخطوط والتايبوغرافي' : 'Typography & Fonts'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logo_rules')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'logo_rules'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isArabic ? 'قواعد استخدام الشعار (Do & Don\'t)' : 'Logo Rules & Clear Space'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stationery')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stationery'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{isArabic ? 'المطبوعات وكروت الأعمال' : 'Business Stationery'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email_signature')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'email_signature'
                ? 'bg-[#d4af37] text-black shadow-md'
                : 'text-[#9ea3b5] hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{isArabic ? 'توقيع الإيميل الرسمي' : 'Email Signature'}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Brand Philosophy Hero Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121422] via-[#16182c] to-[#0d0f17] border border-[#d4af37]/35 relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-xs text-[#ffd700] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>فلسفة الهوية: البوصلة، التميز، والإنسان</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {isArabic 
                      ? 'صُممت لتعكس الثقة المطلقة والقيادة الاستشارية في الموارد البشرية'
                      : 'Crafted to Embody Authority, Trust & Strategic HR Leadership'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#c7cbd9] leading-relaxed">
                    {isArabic 
                      ? 'تجمع هوية HR Navigator بين ثلاثة رموز جوهرية: بوصلة الملاحة (8-Point Compass) كدليل استراتيجي يوجه المؤسسات نحو التميز، حرفي HR المتداخلين بصلابة، ورأس الإنسان الذهبي الذي يرمز إلى أن رأس المال البشري هو المحرك الأثمن لكل نجاح.'
                      : 'The HR Navigator identity synthesizes three core pillars: The 8-Point Navigation Compass guiding enterprises toward governance, the bold interlocking HR monogram, and the golden human icon representing people as the ultimate capital.'}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">بوصلة الملاحة (The Compass)</div>
                      <div className="text-[11px] text-[#8a8d9a]">الاتجاه الاستراتيجي والقرارات الرشيدة</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">الذهب الملكي (24K Royal Gold)</div>
                      <div className="text-[11px] text-[#8a8d9a]">القيمة العالية والاحترافية الحصرية</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-[#4285F4]/30 flex items-center justify-center text-[#4285F4]">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">الكحلي الليلي (Obsidian Navy)</div>
                      <div className="text-[11px] text-[#8a8d9a]">العمق المؤسسي والاستقرار التنظيمي</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Variations Matrix */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ffd700]" />
                  <span>تطبيقات الشعار الرسمية المعتمدة (Approved Variants)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dark Mode Variant */}
                  <div className="p-6 rounded-2xl bg-[#090b12] border border-[#d4af37]/30 flex flex-col items-center justify-center gap-4 text-center min-h-[170px]">
                    <span className="text-[10px] font-mono text-[#8a8d9a] uppercase tracking-wider">
                      النسخة الأساسية (Dark Canvas - Default)
                    </span>
                    <BrandLogo lang={lang} size="md" />
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      الاستخدام القياسي للموقع الرسمي، المنصات الرقمية، والبطاقات
                    </span>
                  </div>

                  {/* Light / Paper Mode Variant */}
                  <div className="p-6 rounded-2xl bg-[#f8f9fa] border border-gray-300 flex flex-col items-center justify-center gap-4 text-center min-h-[170px]">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                      نسخة المطبوعات والأوراق الرسمية (Light / Paper Stationery)
                    </span>
                    <div className="scale-95">
                      <BrandLogo lang={lang} size="md" />
                    </div>
                    <span className="text-[11px] text-slate-700 font-semibold">
                      الاستخدام المعتمد لترويسة العقود المطبوعة، الفواتير، والشهادات
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR PALETTE */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">باليت الألوان الرسمية المعتمدة (Official Color Swatches)</h3>
                  <p className="text-xs text-[#9ea3b5]">
                    انسخ أكواد الـ HEX أو الـ RGB فوراً لاستخدامها في تصاميم السوشيال ميديا والمطبوعات
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandColors.map((color) => (
                  <div 
                    key={color.id}
                    className="rounded-2xl bg-[#12141f] border border-white/10 overflow-hidden shadow-lg hover:border-[#d4af37]/40 transition-all"
                  >
                    {/* Color Swatch Header */}
                    <div className={`h-24 ${color.bgClass} flex items-end justify-between p-3.5`}>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-white`}>
                        {color.hex}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(color.hex, color.id)}
                        className="px-2.5 py-1 rounded bg-black/50 hover:bg-black/80 backdrop-blur-sm text-[10px] text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedCode === color.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode === color.id ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'نسخ HEX' : 'Copy')}</span>
                      </button>
                    </div>

                    {/* Color Details */}
                    <div className="p-4 space-y-2">
                      <div className="text-xs font-bold text-white">
                        {isArabic ? color.nameAr : color.nameEn}
                      </div>
                      <div className="text-[11px] text-[#9ea3b5] leading-relaxed">
                        {isArabic ? color.roleAr : color.roleEn}
                      </div>
                      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-[#8a8d9a]">
                        <div>{color.rgb}</div>
                        <div>{color.cmyk}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TYPOGRAPHY */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">الخطوط والتايبوغرافي المعتمد (Typography Hierarchy)</h3>
                <p className="text-xs text-[#9ea3b5]">
                  معايير الخطوط والأوزان المعتمدة لضمان هيبة المظهر وقابلية القراءة العالية
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Arabic Typography */}
                <div className="p-6 rounded-2xl bg-[#12141f] border border-[#d4af37]/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-[#ffd700]">الخط العربي المعتمد (Arabic Primary)</span>
                    <span className="text-[10px] font-mono text-emerald-400">System Modern Sans / Cairo</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">العناوين الرئيسية الكبرى (Bold / 800)</div>
                      <div className="text-2xl font-black text-white">
                        استشارات الموارد البشرية وتطوير الأعمال
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">العناوين الفرعية والمحاور (SemiBold / 600)</div>
                      <div className="text-base font-bold text-[#ffd700]">
                        هيكلة الشركات وبناء بطاقات الوصف الوظيفي الحديثة
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">النصوص التوضيحية والفقرات (Regular / 400)</div>
                      <div className="text-xs text-[#c7cbd9] leading-relaxed">
                        نقدم حلولاً متكاملة لإعادة هيكلة المنظمات، حوكمة مجالس الإدارة، وتصميم مصفوفات الكفاءات المعتمدة وفق أرقى المقاييس الدولية.
                      </div>
                    </div>
                  </div>
                </div>

                {/* English Typography */}
                <div className="p-6 rounded-2xl bg-[#12141f] border border-[#4285F4]/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-[#60a5fa]">الخط الإنجليزي المعتمد (Latin Primary)</span>
                    <span className="text-[10px] font-mono text-emerald-400">Inter / System Sans-Serif</span>
                  </div>
                  <div className="space-y-3" dir="ltr">
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">Executive Display Titles (Bold / 800)</div>
                      <div className="text-2xl font-black text-white tracking-tight">
                        HR Navigator Consultations
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">Section Subtitles (SemiBold / 600)</div>
                      <div className="text-base font-bold text-[#ffd700] tracking-wide">
                        Strategic Advisory & Organizational Design
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8a8d9a] mb-1">Body Text & Metrics (Regular / 400)</div>
                      <div className="text-xs text-[#c7cbd9] leading-relaxed">
                        Empowering corporate resilience and human capital scalability across the GCC & Middle East through vetted governance frameworks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGO RULES & DOS/DON'TS */}
          {activeTab === 'logo_rules' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">قواعد ومساحات الأمان للشعار (Clear Space & Rules)</h3>
                <p className="text-xs text-[#9ea3b5]">
                  الضوابط الصارمة للحفاظ على هيبة وقوة الشعار وتجنب أي تشويه بصري
                </p>
              </div>

              {/* Clear Space illustration */}
              <div className="p-6 rounded-2xl bg-[#12141f] border border-white/10 flex flex-col md:flex-row items-center gap-6">
                <div className="p-8 rounded-xl bg-black/60 border border-dashed border-[#d4af37]/40 flex items-center justify-center relative">
                  <div className="absolute top-1 left-2 text-[9px] font-mono text-[#ffd700]">Clear Space (X)</div>
                  <BrandLogo lang={lang} size="sm" />
                </div>
                <div className="space-y-2 text-xs text-[#c7cbd9]">
                  <div className="font-bold text-white text-sm">مساحة الأمان (Clear Space = X):</div>
                  <p>
                    يجب ترك مسافة حرة حول الشعار من جميع الجهات تعادل نصف قطر البوصلة على الأقل، ويُمنع ملامسة أي نصوص أو شعارات أخرى لهذه المساحة.
                  </p>
                  <div className="font-bold text-white text-sm pt-2">الحد الأدنى للحجم (Minimum Size):</div>
                  <p>
                    - في التطبيقات الرقمية: لا يقل عرض الشعار عن 36 بكسل لضمان وضوح تفاصيل البوصلة والتاج.
                    <br />
                    - في المطبوعات: لا يقل قطر الشعار عن 15 ملم.
                  </p>
                </div>
              </div>

              {/* DOs and DON'Ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* DOs */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>الاستخدامات الصحيحة (Do's)</span>
                  </div>
                  <ul className="text-xs text-[#c7cbd9] space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>استخدام الشعار على خلفية كحلية داكنة موحدة أو خلفية بيضاء نقية.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>الحفاظ على نسبة العرض إلى الارتفاع عند تصغير أو تكبير الشعار (Lock Aspect Ratio).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400">•</span>
                      <span>استخدام التدرج الذهبي المعتمد (24K Gold) فقط.</span>
                    </li>
                  </ul>
                </div>

                {/* DONTs */}
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <XCircle className="w-4 h-4" />
                    <span>الاستخدامات الممنوعة (Don'ts)</span>
                  </div>
                  <ul className="text-xs text-[#c7cbd9] space-y-2">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>يُمنع مط الشعار أو ضغطه بشكل غير متناسق.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>يُمنع تغيير ألوان البوصلة أو استبدال الذهبي بألوان فاقعة أخرى.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400">•</span>
                      <span>يُمنع وضع الشعار فوق صور مزدحمة أو خلفيات بنقوش تعيق وضوح البوصلة.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: STATIONERY & BUSINESS CARDS */}
          {activeTab === 'stationery' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">قوالب المطبوعات الرسمية (Corporate Stationery Preview)</h3>
                <p className="text-xs text-[#9ea3b5]">
                  معاينة مظهر كروت العمل والأوراق الرسمية المعتمدة لشركة HR Navigator
                </p>
              </div>

              {/* Business Card Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front of Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c0e17] to-[#16182c] border border-[#d4af37]/40 shadow-2xl relative min-h-[200px] flex flex-col justify-between">
                  <div className="text-[10px] font-mono text-[#ffd700] uppercase tracking-wider">
                    وجه كارت العمل (Business Card - Front)
                  </div>
                  <div className="my-auto flex items-center justify-center">
                    <BrandLogo lang={lang} size="md" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-[#8a8d9a] pt-2 border-t border-white/5">
                    <span>Executive Consulting Services</span>
                    <span>المملكة العربية السعودية • مصر</span>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f111d] to-[#121422] border border-[#d4af37]/30 shadow-2xl relative min-h-[200px] flex flex-col justify-between text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-white">{signatureName}</div>
                      <div className="text-[11px] text-[#ffd700] font-semibold">{signatureTitle}</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#ffd700]">
                      <Compass className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-[#c7cbd9] pt-4">
                    <div>الهاتف: {signaturePhone}</div>
                    <div>البريد: info@hrnavigator.org</div>
                    <div>الموقع: hrnavigator.org</div>
                  </div>

                  <div className="text-[10px] text-[#8a8d9a] pt-2 border-t border-white/5">
                    HR Navigator Consultations • استشارات وتطوير الموارد البشرية
                  </div>
                </div>
              </div>

              {/* Official Letterhead Info */}
              <div className="p-5 rounded-2xl bg-[#12141f] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">ترويسة الخطابات والعقود المعتمدة (Official Letterhead)</h4>
                  <p className="text-[11px] text-[#9ea3b5]">
                    مطبقة بالفعل في صيغة عقد الاستشارات الإدارية ونظام الفواتير المعتمد (PDF)
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  جاهز للطباعة والتحميل
                </span>
              </div>
            </div>
          )}

          {/* TAB 6: EMAIL SIGNATURE */}
          {activeTab === 'email_signature' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-white">توقيع البريد الإلكتروني الرسمي المعتمد (Corporate Email Signature)</h3>
                <p className="text-xs text-[#9ea3b5]">
                  قم بتخصيص بياناتك ونسخ كود التوقيع الجاهز لدمجه فوراً في بريدك (Outlook / Gmail)
                </p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#12141f] border border-white/10">
                <div>
                  <label className="block text-[11px] text-[#9ea3b5] mb-1">الاسم واللقب</label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ea3b5] mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={signatureTitle}
                    onChange={(e) => setSignatureTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#9ea3b5] mb-1">رقم الهاتف / الواتساب</label>
                  <input
                    type="text"
                    value={signaturePhone}
                    onChange={(e) => setSignaturePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:border-[#d4af37] outline-none"
                  />
                </div>
              </div>

              {/* Signature Live Preview */}
              <div className="p-6 rounded-2xl bg-white text-black shadow-xl space-y-4">
                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  معاينة توقيع البريد الحي (Live Email Signature Preview)
                </div>

                <div className="border-r-4 border-[#d4af37] pr-4 space-y-1.5" dir="rtl">
                  <div className="text-base font-bold text-gray-900">{signatureName}</div>
                  <div className="text-xs font-semibold text-[#b8860b] uppercase tracking-wide">
                    {signatureTitle}
                  </div>
                  <div className="text-xs text-gray-700 font-medium">
                    HR Navigator Consultations | استشارات الموارد البشرية
                  </div>
                  <div className="text-[11px] text-gray-600 pt-1">
                    الهاتف: {signaturePhone} | البريد: info@hrnavigator.org
                  </div>
                  <div className="text-[10px] text-[#b8860b] font-medium">
                    المملكة العربية السعودية • جمهورية مصر العربية
                  </div>
                </div>
              </div>

              {/* Action to Copy Signature */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCopyEmailSignatureHTML}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-black font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg cursor-pointer transition-all"
                >
                  {copiedSignature ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSignature ? (isArabic ? 'تم نسخ التوقيع بنجاح!' : 'Copied!') : (isArabic ? 'نسخ كود التوقيع (HTML)' : 'Copy Signature HTML')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0e1018] border-t border-white/10 flex items-center justify-between text-xs text-[#8a8d9a]">
          <div>
            HR Navigator Visual Identity Guidelines • Ver 2.0
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-colors cursor-pointer"
          >
            {isArabic ? 'إغلاق الدليل' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
