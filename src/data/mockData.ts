import { Order, User } from '../types';
export { initialServices } from './servicesData';

export const initialOrders: Order[] = [
  {
    id: 'ord-hr-101',
    orderNumber: 'HRN-7810',
    customerName: 'شركة النماء القابضة للاستثمار',
    customerEmail: 'ceo.office@al-namaa.com.sa',
    customerPhone: '+966 50 441 9922',
    customerAddress: 'برج النماء، طريق الملك عبد العزيز، الرياض',
    items: [
      {
        serviceId: 'srv-od-01',
        titleAr: 'التطوير التنظيمي وإعادة الهيكلة الشاملة',
        titleEn: 'Comprehensive Organizational Development & Restructuring',
        price: 462000,
        quantity: 1
      }
    ],
    subtotal: 462000,
    tax: 69300,
    total: 531300,
    currency: 'EGP',
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    status: 'processing',
    createdAt: '2025-05-18T09:30:00Z',
    notes: 'تم استلام التحويل البنكي للمرحلة الأولى. بدأت ورش العمل لتحليل الهيكل الحالي.',
    transactionRef: 'TXN-BANK-HRN881920'
  },
  {
    id: 'ord-hr-102',
    orderNumber: 'HRN-7811',
    customerName: 'مجموعة المدى للرعاية الصحية',
    customerEmail: 'hrd@almada-health.com',
    customerPhone: '+966 55 889 1234',
    customerAddress: 'طريق الملك فهد، جدة، المملكة العربية السعودية',
    items: [
      {
        serviceId: 'srv-prf-03',
        titleAr: 'إدارة الأداء و KPIs و OKRs',
        titleEn: 'Performance Management, KPIs & OKRs Framework',
        price: 290400,
        quantity: 1
      }
    ],
    subtotal: 290400,
    tax: 43560,
    total: 333960,
    currency: 'EGP',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'new',
    createdAt: '2025-05-19T11:20:00Z',
    notes: 'طلب فوري عبر بوابة الدفع الإلكتروني. تم تعيين المستشار المسؤول.',
    transactionRef: 'TXN-CARD-99381023'
  },
  {
    id: 'ord-hr-103',
    orderNumber: 'HRN-7812',
    customerName: 'شركة تقنية الرؤية لحلول السحاب',
    customerEmail: 'operations@visioncloud.io',
    customerPhone: '+966 54 220 7711',
    customerAddress: 'واحة الأعمال، الخبر، المنطقة الشرقية',
    items: [
      {
        serviceId: 'srv-rec-02',
        titleAr: 'استقطاب القيادات التنفيذية',
        titleEn: 'Executive Search & Strategic Recruitment',
        price: 28000,
        quantity: 1
      }
    ],
    subtotal: 28000,
    tax: 4200,
    total: 32200,
    currency: 'SAR',
    paymentMethod: 'mada',
    paymentStatus: 'paid',
    status: 'completed',
    createdAt: '2025-05-14T14:45:00Z',
    notes: 'تم إتمام مرحلة المقابلات وتعيين الرئيس التنفيذي للعمليات COO بنجاح.',
    transactionRef: 'TXN-MADA-44810294'
  },
  {
    id: 'ord-hr-104',
    orderNumber: 'HRN-7813',
    customerName: 'Falcon Strategic Logistics LLC',
    customerEmail: 'leadership@falcon-logistics.ae',
    customerPhone: '+971 50 778 9900',
    customerAddress: 'DIFC Gate Tower, Dubai, UAE',
    items: [
      {
        serviceId: 'srv-trn-adv-01',
        titleAr: 'HR Advanced Program (برنامج الموارد البشرية المتقدم)',
        titleEn: 'HR Advanced Program',
        price: 7000,
        quantity: 1
      }
    ],
    subtotal: 7000,
    tax: 0,
    total: 7000,
    currency: 'EGP',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'processing',
    createdAt: '2025-05-20T08:15:00Z',
    notes: 'تم تأكيد حجز مقعد المتدرب في الدفعة القادمة وإرسال تفاصيل الجلسات.',
    transactionRef: 'TXN-CARD-10928374'
  }
];

export const demoUsers: User[] = [
  {
    id: 'usr-admin-primary',
    name: 'المستشار التنفيذي (ميمي جميل)',
    email: 'mimigameel@gmail.com',
    phone: '+201092792321',
    role: 'admin',
    tier: 'Royal Black',
    joinedDate: '2023-01-15'
  },
  {
    id: 'usr-admin-secondary',
    name: 'المستشار التنفيذي (mimigameel82)',
    email: 'mimigameel82@gmail.com',
    phone: '+201092792321',
    role: 'admin',
    tier: 'Royal Black',
    joinedDate: '2023-01-15'
  },
  {
    id: 'usr-admin-default',
    name: 'إدارة إتش آر نافيجيتور (HR Navigator)',
    email: 'admin@hr-navigator.com',
    phone: '+201092792321',
    role: 'admin',
    tier: 'Royal Black',
    joinedDate: '2023-01-15'
  },
  {
    id: 'usr-client',
    name: 'سعادة الأستاذ سلطان الحربي (المدير العام)',
    email: 'client@partner-corp.com',
    phone: '+966 55 333 4455',
    role: 'customer',
    tier: 'Platinum Elite',
    joinedDate: '2024-03-10'
  }
];
