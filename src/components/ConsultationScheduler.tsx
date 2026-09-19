import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { Language, Order, ConsultationAppointment } from '../types';
import { getAvailableDates, TIME_SLOTS, saveAppointment } from '../utils/calendarService';

interface ConsultationSchedulerProps {
  order: Order;
  lang: Language;
  onAppointmentScheduled?: (appointment: ConsultationAppointment) => void;
}

export const ConsultationScheduler: React.FC<ConsultationSchedulerProps> = ({
  order,
  lang,
  onAppointmentScheduled
}) => {
  const isArabic = lang === 'ar';
  const availableDates = getAvailableDates();

  const [selectedDate, setSelectedDate] = useState(availableDates[0]?.dateStr || '');
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]?.timeAr || '');
  const [meetingType, setMeetingType] = useState<'google_meet' | 'zoom' | 'phone'>('google_meet');
  const [bookedAppointment, setBookedAppointment] = useState<ConsultationAppointment | null>(
    order.consultationAppointment || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const serviceTitle = order.items[0] 
    ? (isArabic ? order.items[0].titleAr : order.items[0].titleEn)
    : (isArabic ? 'استشارة استراتيجية في الموارد البشرية' : 'HR Strategic Advisory');

  const handleConfirmSchedule = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const appointment: ConsultationAppointment = {
        id: `apt-${Date.now()}`,
        orderNumber: order.orderNumber,
        serviceTitle,
        clientName: order.customerName,
        clientEmail: order.customerEmail,
        clientPhone: order.customerPhone,
        date: selectedDate,
        timeSlot: selectedTime,
        advisorNameAr: 'د. مي جميل (كبير مستشاري إتش آر نافيجيتور)',
        advisorNameEn: 'Dr. Mai Gameel (Chief HR Advisor)',
        meetingType,
        meetingLink: meetingType === 'google_meet' ? 'https://meet.google.com/hrn-advisory-room' : undefined,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      saveAppointment(appointment);
      setBookedAppointment(appointment);
      setIsSubmitting(false);

      if (onAppointmentScheduled) {
        onAppointmentScheduled(appointment);
      }
    }, 600);
  };

  // If already booked, show prestigious confirmation pass
  if (bookedAppointment) {
    return (
      <div 
        id="consultation-booked-card"
        className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#12162a] via-[#0f111a] to-[#0a0b12] border border-[#d4af37]/40 shadow-[0_8px_30px_rgba(212,175,55,0.15)] text-right rtl:text-right ltr:text-left relative overflow-hidden"
      >
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#d4af37]/25">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#d4af37] to-[#ffd700] text-[#0a0b12] flex items-center justify-center font-bold shadow-md">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{isArabic ? 'تم تأكيد موعد الجلسة الاستشارية' : 'Consultation Session Confirmed'}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isArabic ? 'مجدول بالتقويم' : 'Synced to Calendar'}
                </span>
              </h4>
              <p className="text-[11px] text-[#ffd700]">
                {serviceTitle}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#8a8d9a] px-2 py-1 rounded bg-white/5">
            {bookedAppointment.orderNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
          <div className="p-3 rounded-xl bg-[#161826] border border-white/5">
            <span className="block text-[10px] text-[#8a8d9a] mb-1">
              {isArabic ? 'تاريخ الجلسة:' : 'Date:'}
            </span>
            <span className="font-bold text-white flex items-center gap-1.5 font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              {bookedAppointment.date}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#161826] border border-white/5">
            <span className="block text-[10px] text-[#8a8d9a] mb-1">
              {isArabic ? 'التوقيت المعتمد:' : 'Time Slot:'}
            </span>
            <span className="font-bold text-white flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#34d399]" />
              {bookedAppointment.timeSlot}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#161826] border border-white/5">
            <span className="block text-[10px] text-[#8a8d9a] mb-1">
              {isArabic ? 'المستشار التنفيذي:' : 'Advisor:'}
            </span>
            <span className="font-bold text-white flex items-center gap-1 truncate text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
              {isArabic ? bookedAppointment.advisorNameAr : bookedAppointment.advisorNameEn}
            </span>
          </div>
        </div>

        {/* Meeting Link & Calendar Invite note */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#172033] to-[#121927] border border-[#38bdf8]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0284c7]/20 border border-[#0284c7]/40 flex items-center justify-center text-[#38bdf8]">
              <Video className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white text-xs block">
                {isArabic ? 'غرفة الاجتماع الافتراضي (Google Meet)' : 'Virtual Advisory Room (Google Meet)'}
              </span>
              <span className="text-[11px] text-[#94a3b8]">
                {isArabic ? 'تمت مزامنة الموعد وإرسال دعوة التقويم إلى بريدك الإلكتروني.' : 'Calendar sync invite sent to your registered email.'}
              </span>
            </div>
          </div>

          <a
            href={bookedAppointment.meetingLink || 'https://meet.google.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <span>{isArabic ? 'رابط القاعة' : 'Join Room'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="consultation-scheduler-container"
      className="mt-6 p-5 rounded-2xl bg-gradient-to-b from-[#161726] via-[#10111a] to-[#0a0b12] border border-[#d4af37]/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-right rtl:text-right ltr:text-left"
    >
      {/* Title & Badge */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#996515] flex items-center justify-center text-[#0a0b12] font-bold shadow-md">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{isArabic ? 'حجز وتنسيق موعد الاستشارة' : 'Schedule Your Consultation Session'}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d4af37]/20 text-[#ffd700] border border-[#d4af37]/30">
                {isArabic ? 'متاح الآن' : 'Now Available'}
              </span>
            </h4>
            <p className="text-[11px] text-[#9ea3b5]">
              {isArabic 
                ? 'اختر اليوم والوقت الأنسب لمناقشة ملف استشارتكم مباشرة مع مستشارينا.' 
                : 'Select the optimal date and time slot for your 1-on-1 advisory session.'}
            </p>
          </div>
        </div>
      </div>

      {/* Date Picker Grid */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{isArabic ? '1. اختر يوم الاستشارة:' : '1. Select Consultation Date:'}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {availableDates.slice(0, 5).map(d => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`p-2.5 rounded-xl text-center transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#d4af37] text-[#0a0b12] font-bold border-[#ffd700] shadow-md scale-[1.02]' 
                    : 'bg-[#151722] text-[#9ea3b5] hover:text-white hover:bg-[#1e2130] border-white/5'
                }`}
              >
                <div className="text-[11px] font-medium">
                  {isArabic ? d.dayNameAr : d.dayNameEn}
                </div>
                <div className="text-xs font-bold font-mono mt-0.5">
                  {d.dateStr.split('-').slice(1).join('/')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Picker */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#34d399]" />
          <span>{isArabic ? '2. اختر الفترة الزمنية المناسبة:' : '2. Select Time Window:'}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIME_SLOTS.map(slot => {
            const isSelected = selectedTime === (isArabic ? slot.timeAr : slot.timeEn);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedTime(isArabic ? slot.timeAr : slot.timeEn)}
                className={`p-2.5 rounded-xl text-center text-xs transition-all cursor-pointer border font-mono ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white font-bold border-[#34d399] shadow-md scale-[1.01]'
                    : 'bg-[#151722] text-[#9ea3b5] hover:text-white hover:bg-[#1e2130] border-white/5'
                }`}
              >
                {isArabic ? slot.timeAr : slot.timeEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meeting Mode Selection */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>{isArabic ? '3. قناة انعقاد الجلسة:' : '3. Advisory Session Channel:'}</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMeetingType('google_meet')}
            className={`p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              meetingType === 'google_meet'
                ? 'bg-[#0284c7]/20 border-[#38bdf8] text-white font-bold'
                : 'bg-[#151722] text-[#9ea3b5] border-white/5 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Google Meet (افتراضي)</span>
          </button>
          <button
            type="button"
            onClick={() => setMeetingType('phone')}
            className={`p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
              meetingType === 'phone'
                ? 'bg-[#10b981]/20 border-[#34d399] text-white font-bold'
                : 'bg-[#151722] text-[#9ea3b5] border-white/5 hover:text-white'
            }`}
          >
            <span>{isArabic ? 'اتصال هاتفي مباشر' : 'Direct Phone Call'}</span>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        id="btn-confirm-appointment-schedule"
        type="button"
        disabled={isSubmitting || !selectedDate || !selectedTime}
        onClick={handleConfirmSchedule}
        className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c058] to-[#c59b27] hover:brightness-110 text-[#0c0d12] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all active:scale-[0.99] cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4 text-[#0c0d12]" />
        <span>
          {isSubmitting 
            ? (isArabic ? 'جاري مزامنة وحجز الموعد بالتقويم...' : 'Syncing Appointment to Calendar...')
            : (isArabic ? 'تأكيد وحفظ الموعد في التقويم الآن' : 'Confirm & Sync Consultation Slot Now')}
        </span>
      </button>

      <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-[#34d399]">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>
          {isArabic 
            ? 'يتم إرسال رابط الجلسة وتذكير التقويم التلقائي مباشرة إلى بريدك ورقم هاتفك' 
            : 'Meeting link & automated calendar invite synced directly to your email & SMS'}
        </span>
      </div>
    </div>
  );
};
