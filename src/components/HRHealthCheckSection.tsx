import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  TrendingUp, 
  Award,
  BarChart3,
  Building2,
  Calendar
} from 'lucide-react';
import { Language } from '../types';

interface HealthCheckSectionProps {
  lang: Language;
  onBookConsultation: () => void;
}

interface Question {
  id: number;
  questionAr: string;
  questionEn: string;
  options: {
    textAr: string;
    textEn: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    questionAr: 'هل تمتلك منشأتكم هيكلاً تنظيمياً معتمداً وبطاقات وصف وظيفي محدثة؟',
    questionEn: 'Does your company have an approved org chart and updated job descriptions?',
    options: [
      { textAr: 'نعم، معتمد ومحدث بشكل دوري لكافة الإدارات', textEn: 'Yes, officially approved and audited regularly', score: 25 },
      { textAr: 'لدينا هيكل مبدئي ولكن بطاقات الوصف غير مكتملة', textEn: 'Preliminary structure exists but JDs incomplete', score: 15 },
      { textAr: 'لا يوجد هيكل رسمي واضح حتى الآن', textEn: 'No official organizational structure yet', score: 5 }
    ]
  },
  {
    id: 2,
    questionAr: 'كيف تقيسون وتتابعون أداء الموظفين وتحقيق الأهداف؟',
    questionEn: 'How do you measure employee performance and target achievements?',
    options: [
      { textAr: 'منظومة KPIs و OKRs مؤتمتة مرتبطة بالمكافآت', textEn: 'Automated KPIs/OKRs linked directly to incentives', score: 25 },
      { textAr: 'تقييم سنوي ورقي تقليدي بدون ربط استراتيجي', textEn: 'Traditional annual paper appraisals', score: 15 },
      { textAr: 'يعتمد على التقدير الشخصي لمدير الإدارة', textEn: 'Subjective appraisal by direct managers', score: 5 }
    ]
  },
  {
    id: 3,
    questionAr: 'ما مدى جاهزية لوائح العمل وسياسات الموارد البشرية لديكم؟',
    questionEn: 'What is the compliance and maturity level of your HR policies and bylaws?',
    options: [
      { textAr: 'لائحة داخلية معتمدة ومطابقة 100% لنظام العمل', textEn: 'Approved bylaws 100% compliant with labor regulations', score: 25 },
      { textAr: 'لوائح قديمة بحاجة لمراجعة وتطوير عاجل', textEn: 'Outdated policies requiring urgent revision', score: 15 },
      { textAr: 'لا نمتلك لائحة عمل موثقة ومعلنة للموظفين', textEn: 'No written HR policies announced to team', score: 5 }
    ]
  },
  {
    id: 4,
    questionAr: 'كيف تديرون خطط التعاقب الوظيفي وتأهيل القيادات والتدريب؟',
    questionEn: 'How do you handle leadership succession planning and employee training?',
    options: [
      { textAr: 'خطة سنوية لتحديد الاحتياج التدريبي ومسار قيادي', textEn: 'Annual training needs analysis (TNA) & leadership paths', score: 25 },
      { textAr: 'دورات تدريبية عشوائية عند توفر الميزانية', textEn: 'Ad-hoc training sessions when budget allows', score: 15 },
      { textAr: 'لا يوجد أي برامج تدريبية أو خطط تعاقب', textEn: 'No formal training programs or succession plans', score: 5 }
    ]
  }
];

export const HRHealthCheckSection: React.FC<HealthCheckSectionProps> = ({
  lang,
  onBookConsultation
}) => {
  const isArabic = lang === 'ar';
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [calculatedScore, setCalculatedScore] = useState<number | null>(null);

  const handleSelectOption = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final score
      const total = nextAnswers.reduce((sum, val) => sum + val, 0);
      setCalculatedScore(total);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setCalculatedScore(null);
  };

  const getScoreAssessment = (score: number) => {
    if (score >= 85) {
      return {
        titleAr: 'مؤشر كفاءة مؤسسية عالي (نخبة)',
        titleEn: 'Elite Organizational Maturity',
        color: 'text-emerald-400',
        bg: 'border-emerald-500/30 bg-emerald-500/10',
        descAr: 'تمتلك منشأتكم أسساً إدارية قوية. أنتم جاهزون الآن لمرحلة التوسع الاستراتيجي، الحوكمة المعقدة، والتحول الرقمي الكامل.',
        descEn: 'Your company demonstrates solid HR foundations. You are well-positioned for strategic expansion and digital HR transformation.'
      };
    } else if (score >= 60) {
      return {
        titleAr: 'مستوى نضج متوسط (يحتاج حوكمة وهيكلة)',
        titleEn: 'Moderate Maturity (Requires Governance & KPIs)',
        color: 'text-amber-400',
        bg: 'border-amber-500/30 bg-amber-500/10',
        descAr: 'هناك ممارسات إيجابية ولكن توجد ثغرات استراتيجية في التقييم أو التوصيف الوظيفي قد تعيق التوسع أو ترفع معدل دوران الموظفين.',
        descEn: 'Positive practices exist, but key gaps in KPIs or job architectures risk higher attrition and operational bottlenecks.'
      };
    } else {
      return {
        titleAr: 'مؤشر مخاطر تشغيلية مرتفعة (تدخل استشاري فوري)',
        titleEn: 'High Operational Risk (Immediate Intervention Advised)',
        color: 'text-rose-400',
        bg: 'border-rose-500/30 bg-rose-500/10',
        descAr: 'المنشأة تفتقر للأسس التنظيمية واللوائح الإلزامية، مما يعرضها لمخاطر عمالية وقانونية وهدر مالي مستمر في الرواتب والتوظيف.',
        descEn: 'Critical organizational and legal vulnerabilities detected. Immediate restructuring is essential to prevent costly labor risks.'
      };
    }
  };

  return (
    <section id="hr-health-check" className="py-16 bg-[#0c0d14] border-y border-[#d4af37]/20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#ffd700] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isArabic ? 'أداة مجانية للشركات والرؤساء التنفيذيين' : 'Complimentary Executive Tool'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isArabic ? 'مقياس جاهزية ونضج الموارد البشرية لمنشأتكم' : 'Enterprise HR Readiness & Health Index'}
          </h2>

          <p className="text-xs sm:text-sm text-[#9ea3b5] max-w-xl mx-auto leading-relaxed">
            {isArabic 
              ? 'أجب في دقيقة واحدة عن 4 محاور استراتيجية لاكتشاف نقاط القوة ومخاطر الهدر التنظيمي في شركتك مع تقرير فوري.' 
              : 'Evaluate your organization across 4 strategic pillars in 1 minute to identify structural risks and receive tailored insights.'}
          </p>
        </div>

        {/* Evaluation Card */}
        <div className="rounded-3xl bg-[#13141f] border border-[#d4af37]/30 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {calculatedScore === null ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#8a8d9a] mb-4">
                <span>
                  {isArabic 
                    ? `السؤال ${currentStep + 1} من ${questions.length}` 
                    : `Question ${currentStep + 1} of ${questions.length}`}
                </span>
                <span className="font-mono text-[#ffd700]">
                  {Math.round(((currentStep) / questions.length) * 100)}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/10 mb-8 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#ffd700] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {isArabic ? questions[currentStep].questionAr : questions[currentStep].questionEn}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(opt.score)}
                    className="w-full text-right rtl:text-right ltr:text-left p-4 sm:p-5 rounded-2xl bg-[#1a1c29] hover:bg-[#222538] border border-white/5 hover:border-[#d4af37]/60 text-white text-sm font-medium transition-all group flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="group-hover:text-[#ffd700] transition-colors leading-relaxed">
                      {isArabic ? opt.textAr : opt.textEn}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#d4af37] group-hover:text-black flex items-center justify-center flex-shrink-0 transition-colors">
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="inline-flex flex-col items-center justify-center p-6 rounded-3xl bg-[#191b28] border border-[#d4af37]/40 shadow-inner">
                <div className="text-xs font-bold text-[#8a8d9a] uppercase tracking-wider mb-1">
                  {isArabic ? 'درجة نضج الموارد البشرية' : 'HR Readiness Score'}
                </div>
                <div className="text-5xl sm:text-6xl font-black font-mono text-[#ffd700]">
                  {calculatedScore}
                  <span className="text-2xl text-[#8a8d9a]">/100</span>
                </div>
              </div>

              {(() => {
                const assessment = getScoreAssessment(calculatedScore);
                return (
                  <div className={`p-6 rounded-2xl border ${assessment.bg} text-center space-y-2 max-w-2xl mx-auto`}>
                    <h4 className={`text-lg font-bold ${assessment.color}`}>
                      {isArabic ? assessment.titleAr : assessment.titleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#c5c8d6] leading-relaxed">
                      {isArabic ? assessment.descAr : assessment.descEn}
                    </p>
                  </div>
                );
              })()}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onBookConsultation}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FFF0C2] via-[#d4af37] to-[#c59b27] text-black font-extrabold text-sm shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isArabic ? 'حجز جلسة علاجية واستشارة مخصصة' : 'Book Strategic Action Session'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1a1c29] text-[#9ea3b5] hover:text-white font-semibold text-xs border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'إعادة التقييم' : 'Retake Assessment'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
