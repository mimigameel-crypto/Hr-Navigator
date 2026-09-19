import React, { useState } from 'react';
import { 
  Star, 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Award, 
  ThumbsUp, 
  CheckCircle2,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Language, Order, ConsultationFeedback } from '../types';
import { BrandLogo } from './BrandLogo';

interface FeedbackModalProps {
  isOpen: boolean;
  order: Order | null;
  lang: Language;
  onClose: () => void;
  onSubmitFeedback: (orderId: string, feedback: ConsultationFeedback) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  order,
  lang,
  onClose,
  onSubmitFeedback
}) => {
  if (!isOpen || !order) return null;

  const isArabic = lang === 'ar';

  const [rating, setRating] = useState<number>(order.feedback?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [advisorRating, setAdvisorRating] = useState<number>(order.feedback?.advisorRating || 5);
  const [recommendScore, setRecommendScore] = useState<number>(order.feedback?.recommendLikelihood || 10);
  const [comment, setComment] = useState<string>(order.feedback?.comment || '');
  const [impactTag, setImpactTag] = useState<string>(
    order.feedback?.serviceImpactAr || (isArabic ? 'تطوير الهيكل التنظيمي واللوائح' : 'Organizational Restructuring')
  );
  const [isSubmitted, setIsSubmitted] = useState(Boolean(order.feedback));
  const [submitting, setSubmitting] = useState(false);

  const serviceTitle = order.items[0]
    ? (isArabic ? order.items[0].titleAr : order.items[0].titleEn)
    : (isArabic ? 'جلسة الاستشارة التنفيذية' : 'Executive Consultation Session');

  const ratingDescriptions = isArabic ? [
    'بحاجة إلى تحسين كبير',
    'مقبول مع بعض الملاحظات',
    'جيد ويلبي الاحتياج',
    'ممتاز ومفيد جداً',
    'استثنائي وفاق التوقعات المؤسسية'
  ] : [
    'Needs Major Improvement',
    'Acceptable with Remarks',
    'Good & Met Expectations',
    'Excellent & Highly Useful',
    'Exceptional - Exceeded Expectations'
  ];

  const impactOptions = isArabic ? [
    'تطوير الهيكل التنظيمي واللوائح',
    'حل نزاعات العمل والامتثال القانوني',
    'تأسيس مؤشرات الأداء (KPIs) ونظام المكافآت',
    'استقطاب وتوظيف الكفاءات القيادية',
    'رفع كفاءة فريق الموارد البشرية الداخلي'
  ] : [
    'Organizational Restructuring',
    'Labor Compliance & Advisory',
    'KPIs & Performance Incentive Design',
    'Executive Talent Acquisition',
    'Internal HR Capacity Building'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      const feedbackPayload: ConsultationFeedback = {
        id: `fb-${Date.now()}`,
        orderNumber: order.orderNumber,
        rating,
        satisfactionLevel: rating >= 5 ? 'exceptional' : rating >= 4 ? 'very_good' : rating >= 3 ? 'neutral' : 'poor',
        recommendLikelihood: recommendScore,
        advisorRating,
        comment: comment.trim(),
        serviceImpactAr: impactTag,
        submittedAt: new Date().toISOString()
      };

      onSubmitFeedback(order.id, feedbackPayload);
      setIsSubmitted(true);
      setSubmitting(false);
    }, 500);
  };

  return (
    <div 
      id="customer-feedback-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="customer-feedback-modal-container"
        className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#141624] via-[#0f101a] to-[#090a10] border border-[#d4af37]/35 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative text-right rtl:text-right ltr:text-left"
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#8b6508] via-[#ffd700] to-[#8b6508]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#8a8d9a] hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          /* Submission Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#10b981] to-[#059669] text-white mx-auto flex items-center justify-center shadow-[0_8px_25px_rgba(16,185,129,0.35)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white font-serif">
              {isArabic ? 'شكراً لثقتكم ومشاركتكم الكريمة' : 'Thank You For Your Valued Feedback'}
            </h3>

            <p className="text-sm text-[#9ea3b5] max-w-md mx-auto leading-relaxed">
              {isArabic 
                ? `تم تسجيل تقييمكم للاستشارة (${order.orderNumber}) بنجاح. تساعدنا آراؤكم دوماً في ترسيخ أعلى معايير الجودة والاستشارات التنفيذية.` 
                : `Your rating for consultation (#${order.orderNumber}) has been recorded. Your insights empower us to maintain premier executive advisory standards.`}
            </p>

            <div className="p-4 rounded-xl bg-[#141829] border border-[#d4af37]/20 max-w-md mx-auto text-xs text-[#ffd700] flex items-center justify-center gap-2 font-mono">
              <Award className="w-4 h-4 text-[#ffd700]" />
              <span>{isArabic ? 'تقييمك المعتمد: ' : 'Your Confirmed Rating: '}</span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star 
                    key={s} 
                    className={`w-3.5 h-3.5 ${s <= rating ? 'fill-[#ffd700] text-[#ffd700]' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c59b27] text-[#0c0d12] font-black text-xs shadow-lg hover:brightness-110 cursor-pointer"
              >
                {isArabic ? 'إغلاق ومتابعة' : 'Close Window'}
              </button>
            </div>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold mb-1.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isArabic ? 'اكتملت الاستشارة بنجاح' : 'Consultation Completed'}</span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isArabic ? 'تقييم تجربة الاستشارة الإدارية' : 'Consultation Experience Feedback'}
                </h3>
                <p className="text-xs text-[#9ea3b5] mt-0.5">
                  {order.orderNumber} • {serviceTitle}
                </p>
              </div>
              <BrandLogo lang={lang} size="sm" showSubtitle={false} />
            </div>

            {/* 1. Star Rating */}
            <div className="mb-6 p-4 rounded-2xl bg-[#131522] border border-white/5 text-center">
              <label className="block text-xs font-bold text-white mb-2">
                {isArabic ? '1. ما هو تقييمك العام لجودة الاستشارة؟' : '1. How would you rate the overall consultation quality?'}
              </label>

              <div className="flex items-center justify-center gap-2 my-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                      aria-label={`Rate ${star} star`}
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors ${
                          active 
                            ? 'fill-[#ffd700] text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' 
                            : 'text-[#4b4e60]'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-[#ffd700] mt-1 h-5">
                {ratingDescriptions[(hoverRating || rating) - 1]}
              </div>
            </div>

            {/* 2. Impact Domain Selection */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{isArabic ? '2. ما هو الأثر الأبرز الذي تحقق لمؤسستكم؟' : '2. Key Organizational Impact Achieved:'}</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {impactOptions.map(opt => {
                  const isSelected = impactTag === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setImpactTag(opt)}
                      className={`p-2.5 rounded-xl text-xs text-right rtl:text-right ltr:text-left transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-[#d4af37]/20 border-[#ffd700] text-white font-semibold'
                          : 'bg-[#151722] text-[#9ea3b5] hover:text-white border-white/5'
                      }`}
                    >
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Recommend Score (NPS 1-10) */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-white mb-2">
                <span className="flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>{isArabic ? '3. مدى احتمالية ترشيحك لإتش آر نافيجيتور لشركائك؟' : '3. Likelihood to recommend HR Navigator (1-10):'}</span>
                </span>
                <span className="font-mono font-bold text-[#ffd700] bg-[#1a1c2b] px-2 py-0.5 rounded border border-white/10">
                  {recommendScore} / 10
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRecommendScore(num)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-lg transition-all border cursor-pointer ${
                      recommendScore === num
                        ? 'bg-[#10b981] text-white border-[#34d399] shadow-md scale-105'
                        : 'bg-[#151722] text-[#8a8d9a] hover:text-white border-white/5'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Qualitative Comment */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>{isArabic ? '4. ملاحظاتك أو شهادتك الإدارية للمستشار:' : '4. Client Testimonial & Remarks:'}</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                placeholder={isArabic 
                  ? 'اكتب رأيك حول احترافية المستشار، وضوح التوصيات، وسرعة الاستجابة...' 
                  : 'Write your thoughts regarding advisor professionalism, strategic recommendations, and clarity...'}
                className="w-full p-3.5 rounded-xl bg-[#141624] border border-white/10 focus:border-[#d4af37] text-xs text-white placeholder-[#626678] focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e6c158] to-[#c59b27] hover:brightness-110 text-[#0c0d12] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitting 
                    ? (isArabic ? 'جاري إرسال التقييم...' : 'Submitting Feedback...') 
                    : (isArabic ? 'إرسال التقييم وتوثيقه' : 'Submit Consultation Feedback')}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#8a8d9a] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                {isArabic ? 'لاحقاً' : 'Later'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
