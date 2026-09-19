import { ConsultationAppointment } from '../types';

const STORAGE_KEY = 'hrn_mock_appointments';

export const INITIAL_MOCK_APPOINTMENTS: ConsultationAppointment[] = [
  {
    id: 'apt-seed-1',
    orderNumber: 'HRN-8921',
    serviceTitle: 'استشارة تأسيس إدارة الموارد البشرية المتكاملة',
    clientName: 'م. أحمد الشريف',
    clientEmail: 'ahmed.shareef@enterprise.com',
    clientPhone: '+201092792321',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '11:00 AM - 12:00 PM',
    advisorNameAr: 'د. مي جميل (كبير مستشاري الموارد البشرية)',
    advisorNameEn: 'Dr. Mai Gameel (Chief HR Advisor)',
    meetingType: 'google_meet',
    meetingLink: 'https://meet.google.com/hrn-advisory-room',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
];

export const getSavedAppointments = (): ConsultationAppointment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_APPOINTMENTS));
      return INITIAL_MOCK_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_APPOINTMENTS;
  }
};

export const saveAppointment = (appointment: ConsultationAppointment): ConsultationAppointment[] => {
  const current = getSavedAppointments();
  const updated = [appointment, ...current.filter(a => a.id !== appointment.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to persist appointment:', err);
  }
  return updated;
};

// Generates upcoming 14 available days (excluding Fridays)
export const getAvailableDates = () => {
  const dates: { dateStr: string; dayNameAr: string; dayNameEn: string; displayFormatted: string }[] = [];
  const now = new Date();
  
  let added = 0;
  let offset = 1;

  while (added < 10) {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    // 5 is Friday
    if (d.getDay() !== 5) {
      const dateStr = d.toISOString().split('T')[0];
      const dayNameAr = d.toLocaleDateString('ar-EG', { weekday: 'long' });
      const dayNameEn = d.toLocaleDateString('en-US', { weekday: 'short' });
      const displayFormatted = d.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
      dates.push({ dateStr, dayNameAr, dayNameEn, displayFormatted });
      added++;
    }
    offset++;
  }

  return dates;
};

export const TIME_SLOTS = [
  { id: 'slot-1', timeAr: '09:00 ص – 10:00 ص', timeEn: '09:00 AM – 10:00 AM' },
  { id: 'slot-2', timeAr: '10:30 ص – 11:30 ص', timeEn: '10:30 AM – 11:30 AM' },
  { id: 'slot-3', timeAr: '12:00 م – 01:00 م', timeEn: '12:00 PM – 01:00 PM' },
  { id: 'slot-4', timeAr: '02:00 م – 03:00 م', timeEn: '02:00 PM – 03:00 PM' },
  { id: 'slot-5', timeAr: '03:30 م – 04:30 م', timeEn: '03:30 PM – 04:30 PM' },
  { id: 'slot-6', timeAr: '05:00 م – 06:00 م', timeEn: '05:00 PM – 06:00 PM' },
];
