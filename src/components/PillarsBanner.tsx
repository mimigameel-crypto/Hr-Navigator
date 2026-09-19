import React from 'react';
import { 
  Users, 
  ClipboardCheck, 
  GraduationCap, 
  Scale, 
  Building2, 
  TrendingUp 
} from 'lucide-react';
import { Language } from '../types';

interface PillarsBannerProps {
  lang: Language;
  selectedPillar?: string;
  onSelectPillar?: (pillarId: string) => void;
}

export const pillarsData = [
  {
    id: 'recruitment',
    icon: Users,
    titleEn: 'RECRUITMENT',
    titleAr: 'التوظيف والاستقطاب',
    descEn: 'Executive search, talent acquisition, and competency assessment.',
    descAr: 'استقطاب الكفاءات التنفيذية، التقييم السلوكي، وتوظيف النخبة.'
  },
  {
    id: 'performance',
    icon: ClipboardCheck,
    titleEn: 'PERFORMANCE',
    titleAr: 'إدارة الأداء',
    descEn: 'KPI design, OKRs frameworks, and executive performance appraisal systems.',
    descAr: 'تصميم مؤشرات الأداء KPIs ومنهجيات OKRs وتقييم الإنتاجية.'
  },
  {
    id: 'training',
    icon: GraduationCap,
    titleEn: 'TRAINING',
    titleAr: 'التدريب والتطوير',
    descEn: 'Leadership development programs, corporate academy setup, and executive coaching.',
    descAr: 'برامج تطوير القيادات، تأسيس الأكاديميات المؤسسية، والكوتشينغ التنفيذي.'
  },
  {
    id: 'employee_relations',
    icon: Scale,
    titleEn: 'EMPLOYEE RELATIONS',
    titleAr: 'علاقات الموظفين',
    descEn: 'Labor law compliance, internal policies, employee handbook, and disputes resolution.',
    descAr: 'الامتثال لنظام العمل، لوائح تنظيم العمل، والتحقيقات العمالية.'
  },
  {
    id: 'organizational_dev',
    icon: Building2,
    titleEn: 'ORGANIZATIONAL DEVELOPMENT',
    titleAr: 'التطوير التنظيمي',
    descEn: 'Organizational restructuring, job evaluation, and corporate governance.',
    descAr: 'إعادة الهيكلة التنظيمية، بطاقات الوصف الوظيفي، والحوكمة المؤسسية.'
  },
  {
    id: 'hr_analytics',
    icon: TrendingUp,
    titleEn: 'HR ANALYTICS',
    titleAr: 'تحليلات الموارد البشرية',
    descEn: 'Workforce metrics, predictive attrition modeling, and automated executive dashboards.',
    descAr: 'تحليلات القوى العاملة، التنبؤ بدوران العمل، ولوحات القياس الذكية.'
  }
];

export const PillarsBanner: React.FC<PillarsBannerProps> = ({
  lang,
  selectedPillar,
  onSelectPillar
}) => {
  const isArabic = lang === 'ar';

  return (
    <div className="w-full bg-[#0c0d12] border-y border-[#d4af37]/30 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Banner Section Header */}
        <div className="text-center mb-5">
          <div className="text-[11px] font-bold tracking-[0.25em] text-[#d4af37] uppercase">
            {isArabic ? 'مجالات الاستشارات المتخصصة' : 'CONSULTING PRACTICES & SPECIALIZATIONS'}
          </div>
        </div>

        {/* 6 Pillars Row Matching Screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {pillarsData.map(pillar => {
            const Icon = pillar.icon;
            const isSelected = selectedPillar === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => onSelectPillar && onSelectPillar(pillar.id)}
                className={`p-3.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#d4af37] bg-[#d4af37]/15 shadow-[0_0_20px_rgba(212,175,55,0.25)]'
                    : 'border-[#d4af37]/20 bg-[#12131b]/70 hover:border-[#d4af37]/50 hover:bg-[#181a25]'
                }`}
              >
                {/* Gold Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#8c6611]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#ffd700] mb-2.5 group-hover:scale-110 transition-transform shadow-sm">
                  <Icon className="w-5 h-5 text-[#d4af37]" />
                </div>

                {/* English Pillar Name */}
                <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider group-hover:text-[#ffd700] transition-colors uppercase leading-tight font-serif">
                  {pillar.titleEn}
                </span>

                {/* Arabic Subtitle */}
                <span className="text-[10px] text-[#9ea3b5] mt-1 font-medium leading-tight line-clamp-1">
                  {pillar.titleAr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
