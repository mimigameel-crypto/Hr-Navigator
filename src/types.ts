export type Language = 'ar' | 'en';

export type Currency = 'SAR' | 'AED' | 'KWD' | 'QAR' | 'BHD' | 'OMR' | 'USD' | 'EGP';

export type ActiveView = 'store' | 'client_portal' | 'admin';

export type OrderStatus = 'new' | 'processing' | 'completed' | 'cancelled';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'knet' | 'mada' | 'bank_transfer' | 'instapay';

export type PaymentStatus = 'paid' | 'pending' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  tier: 'Gold VIP' | 'Platinum Elite' | 'Royal Black';
  joinedDate: string;
  isStudent?: boolean;
  universityName?: string;
  studentIdCard?: string; // base64 or photo URL
}

export interface CourseModuleDetail {
  number?: number;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  topicsAr?: string[];
  topicsEn?: string[];
}

export interface CourseDetailInfo {
  sessionsCount: number;
  trainingHours: number;
  certificateTitleAr: string;
  certificateTitleEn: string;
  investmentEgp: number;
  studentPriceEgp: number;
  targetAudienceAr: string[];
  targetAudienceEn: string[];
  prerequisitesAr?: string;
  prerequisitesEn?: string;
  learningOutcomesAr: string[];
  learningOutcomesEn: string[];
  modules: CourseModuleDetail[];
  studentDiscount: {
    available: boolean;
    studentPriceEgp: number;
    standardPriceEgp: number;
    discountNoteAr: string;
    discountNoteEn: string;
    idCardRequired: boolean;
  };
  deliveryFormatAr: string;
  deliveryFormatEn: string;
  toolsUsedAr?: string[];
  toolsUsedEn?: string[];
}

export interface LuxuryService {
  id: string;
  sku: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  price: number;
  originalPrice?: number;
  studentDiscountPrice?: number;
  exactPrices?: Partial<Record<Currency, number>>;
  exactOriginalPrices?: Partial<Record<Currency, number>>;
  exactStudentPrices?: Partial<Record<Currency, number>>;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  badgeAr?: string;
  badgeEn?: string;
  available: boolean;
  courseDetails?: CourseDetailInfo;
}

export interface OrderItem {
  serviceId: string;
  titleAr: string;
  titleEn: string;
  price: number;
  originalPrice?: number;
  studentDiscountPrice?: number;
  exactPrices?: Partial<Record<Currency, number>>;
  exactOriginalPrices?: Partial<Record<Currency, number>>;
  exactStudentPrices?: Partial<Record<Currency, number>>;
  sku?: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  transactionRef?: string;
  consultationAppointment?: ConsultationAppointment;
  feedback?: ConsultationFeedback;
  isStudentOrder?: boolean;
  studentIdCardUrl?: string;
  studentDiscountApplied?: number;
}

export interface ConsultationFeedback {
  id: string;
  orderNumber: string;
  rating: number; // 1 to 5
  satisfactionLevel: 'exceptional' | 'very_good' | 'neutral' | 'poor';
  recommendLikelihood: number; // 1 to 10
  advisorRating?: number; // 1 to 5
  comment: string;
  serviceImpactAr?: string;
  submittedAt: string;
}

export interface ConsultationAppointment {
  id: string;
  orderNumber: string;
  serviceTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 AM - 11:00 AM"
  advisorNameAr: string;
  advisorNameEn: string;
  meetingType: 'google_meet' | 'zoom' | 'phone' | 'in_person';
  meetingLink?: string;
  status: 'confirmed' | 'rescheduled' | 'completed';
  createdAt: string;
}

export type ResourceAccessType = 'free' | 'paid';

export interface DigitalResource {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  categoryAr: string;
  categoryEn: string;
  accessType: ResourceAccessType;
  price: number; // in base currency (e.g. SAR/EGP)
  exactPrices?: Partial<Record<Currency, number>>;
  fileSize: string;
  pageCount: number;
  format: 'PDF' | 'DOCX' | 'XLSX';
  downloadUrl?: string;
  coverImage?: string;
  topicsAr: string[];
  topicsEn: string[];
  downloadsCount: number;
  badgeAr?: string;
  badgeEn?: string;
}

export interface SocialPost {
  id: string;
  platform: 'linkedin' | 'instagram' | 'whatsapp' | 'youtube';
  mediaType?: 'article' | 'video' | 'infographic';
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  postUrl: string;
  videoUrl?: string;
  likesCount: number;
  sharesCount: number;
  publishDate: string;
  tagAr: string;
  tagEn: string;
}
