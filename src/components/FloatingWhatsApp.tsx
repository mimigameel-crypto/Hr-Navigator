import React, { useState, useMemo } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  CreditCard, 
  Calendar, 
  HelpCircle, 
  FileText,
  Building2,
  ArrowUpRight,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  lang: Language;
}

interface QuickReply {
  id: string;
  labelAr: string;
  labelEn: string;
  msgAr: string;
  msgEn: string;
  icon: React.ReactNode;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const isArabic = lang === 'ar';

  const phoneNumber = '201092792321';

  // Dynamic Time of Day Greeting Calculation
  const { greeting, subtext, isMorning, currentTimeStr } = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const morning = hour >= 4 && hour < 12;
    const afternoon = hour >= 12 && hour < 17;

    const greetingAr = morning
      ? 'صباح الخير والبركة'
      : afternoon
      ? 'طاب مساؤكم بكل خير'
      : 'مساء الخير والازدهار';

    const greetingEn = morning
      ? 'Good morning!'
      : afternoon
      ? 'Good afternoon!'
      : 'Good evening!';

    const subtextAr = morning
      ? 'يسعدنا بدء يوم عملكم بدعم استشاري متخصص. كيف يمكننا مساعدة مؤسستكم اليوم في تطوير منظومة الموارد البشرية؟'
      : afternoon
      ? 'أهلاً بكم في HR Navigator. مستشارونا مستعدون لمناقشة تحدياتكم الإدارية وتطوير الهياكل ومؤشرات الأداء.'
      : 'مرحباً بكم. يسعدنا استقبال استفساراتكم وحجز جلساتكم الاستشارية في أي وقت لخدمة نمو أعمالكم.';

    const subtextEn = morning
      ? 'Wishing you a productive morning! How can our advisory team assist your organization’s HR goals today?'
      : afternoon
      ? 'Good afternoon! Our executive consulting advisors are ready to assist you with bespoke HR solutions.'
      : 'Good evening! We are delighted to assist with your leadership and corporate restructuring advisory needs.';

    const timeString = now.toLocaleTimeString(isArabic ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      greeting: isArabic ? greetingAr : greetingEn,
      subtext: isArabic ? subtextAr : subtextEn,
      isMorning: morning,
      currentTimeStr: timeString
    };
  }, [isArabic]);

  const defaultMessage = isArabic 
    ? `${greeting}، أود الاستفسار عن باقات استشارات HR Navigator وحجز جلسة لمؤسستنا.` 
    : `${greeting} I would like to inquire about HR Navigator consultations and book a session for our company.`;

  const quickReplies: QuickReply[] = [
    {
      id: 'pricing',
      labelAr: 'الاستفسار عن الأسعار والباقات',
      labelEn: 'Inquire about Pricing',
      msgAr: 'مرحباً، أود الاستفسار عن تفاصيل أسعار باقات الاستشارات الإدارية ونماذج الدفع المتاحة لدى HR Navigator.',
      msgEn: 'Hello, I would like to inquire about consultation package pricing and payment models available at HR Navigator.',
      icon: <CreditCard className="w-3.5 h-3.5 text-[#ffd700]" />
    },
    {
      id: 'discovery-call',
      labelAr: 'حجز مكالمة استكشافية',
      labelEn: 'Book a Discovery Call',
      msgAr: 'مرحباً، أرغب في حجز مكالمة استكشافية (Discovery Call) مع مستشاري HR Navigator لمناقشة احتياجات شركتنا.',
      msgEn: 'Hello, I would like to book a Discovery Call with HR Navigator advisors to discuss our company needs.',
      icon: <Calendar className="w-3.5 h-3.5 text-[#34d399]" />
    },
    {
      id: 'custom-package',
      labelAr: 'طلب استشارة مخصصة للشركات',
      labelEn: 'Custom Corporate Advisory',
      msgAr: 'مرحباً، نحن شركة ونرغب في استشارة مخصصة تشمل الهيكلة التنظيمية وتقييم الوظائف ومؤشرات الأداء.',
      msgEn: 'Hello, we are an enterprise looking for customized advisory regarding org restructuring, job evaluation, and KPIs.',
      icon: <Building2 className="w-3.5 h-3.5 text-[#60a5fa]" />
    },
    {
      id: 'instapay-help',
      labelAr: 'استفسار عن الدفع عبر InstaPay',
      labelEn: 'InstaPay & Bank Transfer Query',
      msgAr: 'مرحباً، لدي استفسار بخصوص تأكيد التحويل المالي عبر InstaPay لحجز استشارة.',
      msgEn: 'Hello, I have a query regarding confirming an InstaPay bank transfer for our consultation booking.',
      icon: <FileText className="w-3.5 h-3.5 text-[#c084fc]" />
    },
    {
      id: 'pdf-resources',
      labelAr: 'طلب ملفات الـ PDF والحقائب التدريبية',
      labelEn: 'Inquire about PDF Toolkits & Courses',
      msgAr: 'مرحباً، أود الاستفسار عن تحميل الحقائب التدريبية وملفات الـ PDF والكورسات المتاحة لدى HR Navigator.',
      msgEn: 'Hello, I would like to inquire about accessing corporate training syllabuses and PDF toolkits from HR Navigator.',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />
    }
  ];

  const handleQuickReplyClick = (reply: QuickReply) => {
    const textToSend = isArabic ? reply.msgAr : reply.msgEn;
    const directUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendMessage = () => {
    const textToSend = customMsg.trim() || defaultMessage;
    const directUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(directUrl, '_blank', 'noopener,noreferrer');
    setCustomMsg('');
  };

  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMsg.trim() || defaultMessage)}`;

  return (
    <div 
      id="floating-whatsapp-container"
      className={`fixed bottom-6 ${isArabic ? 'left-6' : 'right-6'} z-50 flex flex-col ${isArabic ? 'items-start' : 'items-end'}`}
    >
      {/* Quick Interactive Chat Popup Card */}
      {isOpen && (
        <div 
          id="whatsapp-chat-preview"
          className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#12141e] border border-[#25D366]/40 shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base shadow-inner">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10b981] border-2 border-[#128C7E]" />
              </div>
              <div className="text-right rtl:text-right ltr:text-left">
                <h4 className="text-sm font-bold leading-tight gold-gradient-text">
                  {isArabic ? 'خدمة عملاء HR Navigator' : 'HR Navigator Advisory Desk'}
                </h4>
                <p className="text-[11px] text-white/90 font-medium">
                  {isArabic ? 'متاح للرد الفوري (9:00 ص – 5:00 م)' : 'Online for instant advisory'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-black/10 hover:bg-black/25 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-[#0a0b12] text-xs space-y-3 overflow-y-auto flex-1">
            {/* Dynamic Time of Day Pill Badge */}
            <div className="flex items-center justify-center my-0.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a27] border border-[#d4af37]/30 text-[11px] text-[#ffd700] shadow-sm">
                {isMorning ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-300" />
                )}
                <span className="font-semibold">{greeting}</span>
                <span className="text-[#64748b]">•</span>
                <span className="text-[#94a3b8] font-mono text-[10px]">{currentTimeStr}</span>
              </div>
            </div>

            {/* Realistic Chat Bubble from Advisor with Dynamic Greeting */}
            <div className="p-3.5 rounded-2xl rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none bg-[#181b28] border border-white/10 text-[#e2e4ea] leading-relaxed shadow-sm">
              <div className="flex items-center justify-between mb-1.5 pb-1.5 border-b border-white/5">
                <p className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                  <span>{greeting}</span>
                </p>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                  {isArabic ? 'استجابة سريعة' : 'Fast Response'}
                </span>
              </div>

              <p className="text-white font-medium text-[12px] mb-1">
                {isArabic ? 'أهلاً بك في HR Navigator الاستشارية' : 'Welcome to HR Navigator Advisory'}
              </p>

              <p className="text-[#a0a5b8] text-[11.5px] leading-relaxed">
                {subtext}
              </p>

              <div className="flex items-center justify-between text-[10px] text-[#6b7280] mt-2.5 pt-1.5 border-t border-white/5 font-mono">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#10b981]" />
                  <span>{currentTimeStr}</span>
                </span>
                <span className="text-emerald-400 font-sans">
                  {isArabic ? 'مستشارنا متواجد الآن' : 'Advisor online now'}
                </span>
              </div>
            </div>

            {/* Quick Reply Buttons Section */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#ffd700]/90 tracking-wider">
                <HelpCircle className="w-3 h-3 text-[#d4af37]" />
                <span>{isArabic ? 'استفسارات سريعة وشائعة:' : 'Quick Replies & Direct Actions:'}</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {quickReplies.map((reply) => (
                  <button
                    key={reply.id}
                    type="button"
                    onClick={() => handleQuickReplyClick(reply)}
                    className="w-full text-right rtl:text-right ltr:text-left p-2.5 rounded-xl bg-[#141724] hover:bg-[#1e2336] border border-white/10 hover:border-[#25D366]/50 text-[#e2e4ea] hover:text-white transition-all flex items-center justify-between group cursor-pointer shadow-sm hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-[#25D366]/20 flex items-center justify-center transition-colors">
                        {reply.icon}
                      </div>
                      <span className="text-xs font-medium group-hover:text-[#25D366] transition-colors">
                        {isArabic ? reply.labelAr : reply.labelEn}
                      </span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#717688] group-hover:text-[#25D366] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input Field */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 bg-[#141624] p-1.5 rounded-xl border border-white/10 focus-within:border-[#25D366]/60 transition-colors">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder={isArabic ? 'اكتب رسالتك الخاصة هنا...' : 'Type a custom question...'}
                  className="w-full bg-transparent text-xs text-white placeholder-[#6b7280] px-2 py-1.5 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors cursor-pointer flex-shrink-0"
                  title={isArabic ? 'إرسال إلى واتساب' : 'Send via WhatsApp'}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Direct Open Main Button */}
            <a
              id="btn-whatsapp-start-chat"
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(37,211,102,0.3)] transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isArabic ? 'فتح المحادثة على واتساب' : 'Open Full WhatsApp Chat'}</span>
            </a>

            <div className="text-center text-[10px] text-[#6b7280]">
              <span dir="ltr" className="font-mono text-[#9ea3b5]">+20 10 92792321</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <div className="flex items-center gap-2">
        {/* Floating Tooltip Pill (Desktop) */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141624]/90 border border-[#25D366]/40 text-white text-xs font-semibold shadow-lg backdrop-blur-md hover:border-[#25D366] transition-all cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span className="group-hover:text-[#25D366] transition-colors">
              {isArabic ? 'تواصل معنا مباشرة عبر واتساب' : 'Chat with us on WhatsApp'}
            </span>
          </button>
        )}

        <button
          id="btn-floating-whatsapp"
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] hover:from-[#159a8b] hover:to-[#2ee06f] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border-2 border-white/20"
          aria-label={isArabic ? 'خدمة العملاء عبر واتساب' : 'WhatsApp Customer Service'}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageCircle className="w-7 h-7 fill-white text-white" />
              {/* Online Pulse Indicator */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#12141e]" />
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
