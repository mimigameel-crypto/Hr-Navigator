import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Loader2, 
  X,
  Building,
  Video,
  ShieldCheck,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { Language } from '../types';
import { 
  googleSignIn, 
  getAccessToken, 
  createDiscoveryCallEvent, 
  logoutGoogle,
  CreatedCalendarEvent 
} from '../utils/googleCalendar';
import { User } from 'firebase/auth';

interface CalendarBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTopic?: string;
}

const CONSULTANTS = [
  {
    id: 'c1',
    nameAr: 'د. مصطفى الشناوي',
    nameEn: 'Dr. Moustafa El-Shennawy',
    titleAr: 'خبير الحوكمة المؤسسية وتطوير الهياكل (20+ سنة خبرة)',
    titleEn: 'Executive Governance & Org Design Advisor (20+ yrs)',
    badge: 'Senior Partner'
  },
  {
    id: 'c2',
    nameAr: 'أ. نورهان المهدي',
    nameEn: 'Eng. Nourhan El-Mahdy',
    titleAr: 'مستشارة تقييم الوظائف ومنظومات الجدارات وKPIs',
    titleEn: 'Job Evaluation & KPI Competencies Lead',
    badge: 'Principal Consultant'
  },
  {
    id: 'c3',
    nameAr: 'أ. كريم عبد العظيم',
    nameEn: 'Karim Abdel-Azim, SPHRi',
    titleAr: 'مستشار الامتثال العمالي وبناء سلم الرواتب والمكافآت',
    titleEn: 'Labor Compliance, Total Rewards & Payroll Lead',
    badge: 'Practice Lead'
  }
];

const TIME_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '01:00 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM'
];

export const CalendarBookingModal: React.FC<CalendarBookingModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTopic = ''
}) => {
  const isArabic = lang === 'ar';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states
  const [selectedConsultant, setSelectedConsultant] = useState(CONSULTANTS[0].id);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [companyName, setCompanyName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [topic, setTopic] = useState(initialTopic || (isArabic ? 'مناقشة احتياجات الهيكلة وتطوير منظومة الموارد البشرية' : 'HR Restructuring & Org Development Advisory'));
  const [notes, setNotes] = useState('');

  // Booking states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<CreatedCalendarEvent | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    const cached = getAccessToken();
    if (cached) {
      setToken(cached);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setToken(res.accessToken);
        if (res.user.displayName && !clientName) {
          setClientName(res.user.displayName);
        }
        if (res.user.email && !clientEmail) {
          setClientEmail(res.user.email);
        }
      }
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || (isArabic ? 'تعذر إتمام المصادقة مع Google' : 'Google Authentication failed'));
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setToken(null);
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setSubmitError(isArabic ? 'يرجى تسجيل الدخول بحساب Google أولاً لمزامنة الموعد بالتقويم' : 'Please connect Google account first');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const activeConsultant = CONSULTANTS.find(c => c.id === selectedConsultant) || CONSULTANTS[0];
      const consultantDisplay = isArabic ? activeConsultant.nameAr : activeConsultant.nameEn;

      // Parse slot time (e.g. '11:30 AM')
      const [timePart, modifier] = selectedSlot.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const start = new Date(`${selectedDate}T00:00:00`);
      start.setHours(hours, minutes, 0, 0);

      // 45 min duration
      const end = new Date(start.getTime() + 45 * 60 * 1000);

      const summary = isArabic
        ? `جلسة استكشافية | HR Navigator Discovery Call - ${companyName || clientName || 'العميل'}`
        : `HR Navigator Discovery Call - ${companyName || clientName || 'Client'}`;

      const description = `
═══════════════════════════════════════════════════
🏛️ HR NAVIGATOR CONSULTATIONS - DISCOVERY CALL
═══════════════════════════════════════════════════
• المستشار المشرف: ${consultantDisplay} (${activeConsultant.badge})
• العميل / ممثل المنشأة: ${clientName || 'غير محدد'}
• اسم الشركة: ${companyName || 'مؤسسة أعمال'}
• البريد الإلكتروني: ${clientEmail || currentUser?.email || 'N/A'}
• موضوع الجلسة: ${topic}
• ملاحظات إضافية: ${notes || 'لا توجد ملاحظات'}
• مدة الجلسة: 45 دقيقة استشارية عبر Google Meet

رابط الموقع والخدمات: https://hr-navigator.com
خدمة العملاء واتساب: +20 10 92792321
═══════════════════════════════════════════════════
      `.trim();

      const created = await createDiscoveryCallEvent(token, {
        summary,
        description,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        attendeeEmail: clientEmail || currentUser?.email || undefined,
        consultantName: consultantDisplay,
        meetingTopic: topic
      });

      setBookingSuccess(created);
    } catch (err: any) {
      console.error('Booking failed:', err);
      setSubmitError(err?.message || (isArabic ? 'حدث خطأ أثناء حجز الموعد في التقويم' : 'Failed to book slot on Google Calendar'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      id="calendar-booking-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0f111a] border border-[#d4af37]/40 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header with Google Calendar Brand Glow */}
        <div className="bg-gradient-to-r from-[#121624] via-[#1a1d30] to-[#121624] p-5 sm:p-6 border-b border-white/10 flex items-center justify-between relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335]" />
          
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#4285F4]/15 border border-[#4285F4]/40 flex items-center justify-center text-[#4285F4] shadow-inner">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isArabic ? 'حجز مكالمة استكشافية عبر Google Calendar' : 'Book Discovery Call via Google Calendar'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#4285F4]/20 border border-[#4285F4]/40 text-[10px] text-[#60a5fa] font-bold">
                  Workspace Live
                </span>
              </div>
              <p className="text-xs text-[#8a8d9a] mt-0.5">
                {isArabic 
                  ? 'حجز موعد استشاري وتثبيته مباشرة على تقويمك وتقويم المستشار مع رابط Google Meet' 
                  : 'Syncs slot directly with Google Calendar & creates instant Google Meet link'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8a8d9a] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Step 1: Google Account Connection Status Card */}
          <div className="p-4 rounded-2xl bg-[#141824] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                {/* Official Google G Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {token ? (isArabic ? 'متصل بـ Google Calendar' : 'Connected to Google Calendar') : (isArabic ? 'ربط الحساب للمزامنة' : 'Connect Google Account')}
                  </span>
                  {token && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      {isArabic ? 'مُصرح' : 'Authorized'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#8a8d9a]">
                  {token 
                    ? (currentUser?.email || (isArabic ? 'جاهز لإضافة الموعد إلى التقويم تلقائياً' : 'Ready to add event to your calendar'))
                    : (isArabic ? 'سجل دخولك بحساب Google ليتم تثبيت الموعد بجدولك تلقائياً' : 'Sign in with Google to enable automatic calendar booking')}
                </p>
              </div>
            </div>

            {token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/30 text-xs text-[#8a8d9a] hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isArabic ? 'تبديل الحساب' : 'Switch'}</span>
              </button>
            ) : (
              <button
                id="btn-google-calendar-signin"
                type="button"
                onClick={handleGoogleAuth}
                disabled={isSigningIn}
                className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 whitespace-nowrap"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span>{isArabic ? 'جارٍ الاتصال...' : 'Connecting...'}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{isArabic ? 'تسجيل الدخول بـ Google' : 'Sign in with Google'}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Booking Success Screen */}
          {bookingSuccess ? (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isArabic ? 'تم حجز المكالمة الاستكشافية بنجاح!' : 'Discovery Call Successfully Booked!'}
                </h4>
                <p className="text-xs text-emerald-300/90 mt-1 max-w-md mx-auto leading-relaxed">
                  {isArabic 
                    ? 'تمت إضافة الجلسة رسميًا إلى تقويم Google الخاص بك وربط رابط Google Meet تلقائياً.' 
                    : 'The event has been added to your Google Calendar with an automatic Google Meet conference.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-left rtl:text-right space-y-1.5 font-mono text-[#cbd5e1] max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#8a8d9a] font-sans">{isArabic ? 'الموعد المحدد:' : 'Slot:'}</span>
                  <span className="font-bold text-[#ffd700]">{selectedDate} ({selectedSlot})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8d9a] font-sans">{isArabic ? 'المستشار المشرف:' : 'Advisor:'}</span>
                  <span>{CONSULTANTS.find(c => c.id === selectedConsultant)?.nameAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8a8d9a] font-sans">{isArabic ? 'المنصة:' : 'Platform:'}</span>
                  <span className="text-[#60a5fa] flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    Google Meet
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {bookingSuccess.htmlLink && (
                  <a
                    href={bookingSuccess.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#2563eb] text-white font-bold text-xs flex items-center gap-2 hover:brightness-110 shadow-lg transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isArabic ? 'عرض الجلسة في Google Calendar' : 'View in Google Calendar'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isArabic ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookSession} className="space-y-5">
              {/* Consultant Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{isArabic ? 'اختر المستشار المتخصص بالجلسة:' : 'Select Lead Consultant:'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CONSULTANTS.map((c) => {
                    const isSelected = selectedConsultant === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedConsultant(c.id)}
                        className={`p-3 rounded-2xl border text-left rtl:text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected 
                            ? 'bg-[#d4af37]/15 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                            : 'bg-[#121420] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#d4af37] border border-[#d4af37]/30 inline-block mb-1">
                            {c.badge}
                          </span>
                          <h5 className="text-xs font-bold text-white">
                            {isArabic ? c.nameAr : c.nameEn}
                          </h5>
                          <p className="text-[10.5px] text-[#8a8d9a] mt-0.5 line-clamp-2 leading-relaxed">
                            {isArabic ? c.titleAr : c.titleEn}
                          </p>
                        </div>
                        <div className="flex items-center justify-end text-[10px] font-semibold text-[#d4af37]">
                          {isSelected ? (isArabic ? 'تم الاختيار ✓' : 'Selected ✓') : (isArabic ? 'اختيار' : 'Select')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date and Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#34A853]" />
                    <span>{isArabic ? 'تاريخ الجلسة:' : 'Session Date:'}</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#4285F4] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FBBC05]" />
                    <span>{isArabic ? 'الوقت المفضل (45 دقيقة):' : 'Preferred Slot (45m):'}</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSlot = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                            isSlot 
                              ? 'bg-[#4285F4] text-white shadow-md' 
                              : 'bg-[#121420] border border-white/10 text-[#8a8d9a] hover:text-white'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Company & Attendee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#cbd5e1] flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#d4af37]" />
                    <span>{isArabic ? 'اسم المنشأة أو الشركة:' : 'Company / Organization:'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'مثال: شركة الرؤية القابضة' : 'e.g. Acme Corp'}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#cbd5e1]">
                    {isArabic ? 'اسم ممثل المنشأة:' : 'Attendee Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isArabic ? 'اسمك الكريم' : 'Your full name'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Email & Topic */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#cbd5e1]">
                    {isArabic ? 'البريد الإلكتروني لتلقي دعوة التقويم ورابط Meet:' : 'Email to receive Calendar Invite & Meet link:'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#4285F4] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#cbd5e1]">
                    {isArabic ? 'محور الاستشارة المطلوب مناقشته:' : 'Consultation Focus Topic:'}
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={isArabic ? 'هيكلة الموارد البشرية، تقييم الوظائف، سلم الرواتب...' : 'Org design, compensation, compliance...'}
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#8a8d9a]">
                    {isArabic ? 'ملاحظات وتطلعات إضافية (اختياري):' : 'Additional Notes / Objectives (Optional):'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={isArabic ? 'عدد الموظفين، التحديات الحالية، الموعد النهائي المستهدف...' : 'Employee headcount, current pain points...'}
                    className="w-full bg-[#121420] border border-white/15 focus:border-[#d4af37] rounded-xl px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <div className="text-[11px] text-[#8a8d9a] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#34A853]" />
                  <span>{isArabic ? 'مكالمة فيديو عبر Google Meet مجانية مدتها 45 دقيقة' : 'Free 45-min Google Meet session'}</span>
                </div>

                <button
                  id="btn-confirm-calendar-booking"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b38f26] hover:brightness-110 text-black font-black text-xs flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(212,175,55,0.3)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>{isArabic ? 'جارٍ حجز الموعد ومزامنته...' : 'Syncing with Calendar...'}</span>
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="w-4 h-4" />
                      <span>{isArabic ? 'تأكيد الحجز ومزامنة التقويم' : 'Confirm & Sync to Google Calendar'}</span>
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
