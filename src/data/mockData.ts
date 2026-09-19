import { LuxuryService, Order, User } from '../types';

export const initialServices: LuxuryService[] = [
  {
    id: 'srv-od-01',
    sku: 'HRN-OD-01',
    titleAr: 'باقة التطوير التنظيمي وإعادة الهيكلة الشاملة',
    titleEn: 'Comprehensive Organizational Development & Restructuring',
    categoryAr: 'التطوير التنظيمي',
    categoryEn: 'Organizational Development',
    price: 35000,
    originalPrice: 42000,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'تصميم الهيكل التنظيمي المعتمد، بطاقات الوصف الوظيفي لجميع الإدارات، مصفوفة الصلاحيات (RACI Matrix)، والحوكمة المؤسسية المتوافقة مع أهداف النمو.',
    descriptionEn: 'Full organizational architecture redesign, department-wide job descriptions, RACI authority matrices, and corporate governance tailored for sustainable scaling.',
    featuresAr: [
      'هيكل تنظيمي تفاعلي مرن للأقسام والإدارات',
      'بطاقات وصف وظيفي تفصيلية لكافة المناصب',
      'مصفوفة المسؤوليات والصلاحيات RACI',
      'ورشة عمل تنفيذية مع مجلس الإدارة'
    ],
    featuresEn: [
      'Interactive Enterprise Organizational Chart',
      'Comprehensive Job Descriptions for all roles',
      'RACI Matrix & Delegated Authority Framework',
      'Executive Board Alignment Workshop'
    ],
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Best Seller',
    available: true
  },
  {
    id: 'srv-rec-02',
    sku: 'HRN-REC-02',
    titleAr: 'حلول استقطاب وتوظيف القيادات التنفيذية',
    titleEn: 'Executive Search & Strategic Recruitment Solutions',
    categoryAr: 'التوظيف والاستقطاب',
    categoryEn: 'Recruitment',
    price: 28000,
    originalPrice: 34000,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'خدمة استقطاب الكفاءات التنفيذية والنوعية (C-Level & Directors) مع اختبارات قياس الجدارات والمقابلات السلوكية المركزة وضمان استقرار المرشح.',
    descriptionEn: 'Headhunting and targeted acquisition for C-Suite executives and functional directors, backed by behavioral psychometric assessments and retention guarantees.',
    featuresAr: [
      'فحص واختيار دقيق عبر شبكة علاقات قيادية',
      'تقييم الجدارات السلوكية والفنية المعتمدة',
      'ضمان استبدال مجاني للمرشح خلال فترة التجربة',
      'تقرير مقارن شامل لأبرز 3 مرشحين نهائيين'
    ],
    featuresEn: [
      'Discreet Executive Headhunting & Screening',
      'Certified Competency & Leadership Assessments',
      'Full 90-Day Candidate Replacement Guarantee',
      'Comprehensive Finalist Benchmark Dossier'
    ],
    badgeAr: 'ضمان تنفيذي',
    badgeEn: 'Executive Guarantee',
    available: true
  },
  {
    id: 'srv-prf-03',
    sku: 'HRN-PRF-03',
    titleAr: 'منظومة إدارة الأداء ومؤشرات KPIs و OKRs',
    titleEn: 'Performance Management, KPIs & OKRs Framework',
    categoryAr: 'إدارة الأداء',
    categoryEn: 'Performance',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'بناء وتفعيل نظام إدارة الأداء السنوي والنصف سنوي، وتحديد المؤشرات الرئيسية (KPIs) وربطها بالأهداف الاستراتيجية ومنظومة المكافآت والبوانص.',
    descriptionEn: 'Design and roll out of robust annual appraisal cycles, cascading Balanced Scorecards (KPIs) and agile OKRs coupled with incentive-linked rewards.',
    featuresAr: [
      'قاموس مؤشرات أداء مفصل حسب كل وظيفة',
      'نماذج تقييم أداء رقمية تفاعلية',
      'ربط نتائج الأداء بسلم الحوافز والمكافآت',
      'دليل إرشادي لمدراء الإدارات لتقييم الموظفين'
    ],
    featuresEn: [
      'Role-Specific KPI Dictionary & Targets',
      'Standardized Digital Appraisal Templates',
      'Performance-Linked Incentive Modeling',
      'Line Managers Appraisal Coaching Guide'
    ],
    badgeAr: 'حل استراتيجي',
    badgeEn: 'Strategic Suite',
    available: true
  },
  {
    id: 'srv-trn-04',
    sku: 'HRN-TRN-04',
    titleAr: 'برنامج تأهيل القيادات وتطوير المهارات التنفيذية',
    titleEn: 'Executive Leadership Academy & Coaching Program',
    categoryAr: 'التدريب والتطوير',
    categoryEn: 'Training',
    price: 32000,
    originalPrice: 38000,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج مكثف مخصص للقيادات ومدراء الصف الأول يتضمن تحليل الاحتياجات التدريبية (TNA)، جلسات كوتشينغ 1-on-1، وخطط التعاقب الوظيفي (Succession Planning).',
    descriptionEn: 'Intensive immersion for senior leaders featuring Training Needs Analysis (TNA), one-on-one executive coaching, and institutional succession plans.',
    featuresAr: [
      'جلسات كوتشينغ فردية مع مستشارين معتمدين',
      'خطة تعاقب وظيفي شاملة للوظائف الحساسة',
      'شهادات تدريب مهنية معتمدة للمشاركين',
      'قياس الأثر التدريبي ROI بعد 60 يوماً'
    ],
    featuresEn: [
      'Certified 1-on-1 Executive Coaching Sessions',
      'Critical Role Succession Planning Blueprint',
      'Accredited Professional Completion Diplomas',
      '60-Day Post-Training ROI Measurement'
    ],
    badgeAr: 'معتمد دولياً',
    badgeEn: 'Accredited',
    available: true
  },
  {
    id: 'srv-emp-05',
    sku: 'HRN-EMP-05',
    titleAr: 'تدقيق الامتثال لنظام العمل ولائحة تنظيم العمل',
    titleEn: 'Saudi Labor Law Compliance & Employee Handbook',
    categoryAr: 'علاقات الموظفين',
    categoryEn: 'Employee Relations',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'صياغة واعتماد لائحة تنظيم العمل الداخلية وفق اشتراطات وزارة الموارد البشرية، تدقيق العقود الوظيفية، وتنظيم لجان التحقيق والتأديب المؤسسي.',
    descriptionEn: 'Comprehensive drafting and Ministry accreditation of internal labor bylaws, employment contract audits, and compliant disciplinary committee procedures.',
    featuresAr: [
      'اعتماد رسمي للائحة الداخلية عبر منصة قوى',
      'صياغة نماذج عقود موحدة لحماية المنشأة',
      'دليل إجراءات التحقيق والجزاءات العمالية',
      'حماية قانونية متكاملة ضد النزاعات القضائية'
    ],
    featuresEn: [
      'Official Qiwa Platform Bylaw Accreditation',
      'Protective Standardized Employment Contracts',
      'Disciplinary & Workplace Grievance Procedures',
      'Mitigation Audit Against Labor Disputes'
    ],
    badgeAr: 'امتثال نظامي',
    badgeEn: 'Compliance Audit',
    available: true
  },
  {
    id: 'srv-anl-06',
    sku: 'HRN-ANL-06',
    titleAr: 'لوحة قياس تحليلات الموارد البشرية (HR Analytics Dashboard)',
    titleEn: 'Workforce Intelligence & HR Analytics BI Dashboard',
    categoryAr: 'تحليلات الموارد البشرية',
    categoryEn: 'HR Analytics',
    price: 26000,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'تأسيس لوحات ذكاء أعمال (BI) متقدمة لتحليل تكلفة التوظيف، معدلات دوران العمل، توطين الوظائف (نطاقات)، وتحليل إنتاجية الموظفين في الوقت الفعلي.',
    descriptionEn: 'Custom PowerBI / Tableau workforce intelligence deployment tracking turnover risks, cost-per-hire, Saudization (Nitaqat) tiers, and real-time FTE output.',
    featuresAr: [
      'لوحة قياس تفاعلية لحظية للإدارة التنفيذية',
      'مؤشرات استباقية للتنبؤ باستقالات الكفاءات',
      'تكامل مع أنظمة الرواتب وERP الحالية',
      'تقارير دورية آلية ترسل للإدارة العليا'
    ],
    featuresEn: [
      'Live Executive Interactive PowerBI Dashboard',
      'Predictive Turnover & Attrition Early Warning',
      'Seamless Integration with Existing HRIS / ERP',
      'Automated Monthly C-Suite Analytical Summaries'
    ],
    badgeAr: 'ذكاء أعمال',
    badgeEn: 'Workforce BI',
    available: true
  },
  {
    id: 'srv-trn-adv-01',
    sku: 'HRN-TRN-ADV',
    titleAr: 'برنامج الموارد البشرية المتقدم (HR Advanced Program)',
    titleEn: 'HR Advanced Program',
    categoryAr: 'البرامج التدريبية والكورسات',
    categoryEn: 'Training Programs',
    price: 530,
    originalPrice: 680,
    exactPrices: {
      EGP: 7000,
      SAR: 530,
      USD: 145,
      AED: 520,
      QAR: 515,
      KWD: 43,
      BHD: 53,
      OMR: 55
    },
    exactOriginalPrices: {
      EGP: 9000,
      SAR: 680,
      USD: 185
    },
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج عملي متقدم في الموارد البشرية مصمم لبناء قدرات راسخة وجاهزة لسوق العمل عبر الوظائف الأساسية للموارد البشرية (12 جلسة • 24 ساعة تدريبية • شهادة إتمام معتمدة).',
    descriptionEn: 'A practical HR program designed to build solid, job-ready capabilities across the core HR functions (12 Sessions • 24 Training Hours • Certificate of Completion).',
    featuresAr: [
      '12 جلسة تفاعلية • 24 ساعة تدريبية مكثفة',
      'Recruitment & Talent Acquisition (استقطاب المواهب)',
      'Personnel & Labour Law Basics (شؤون العاملين وقانون العمل)',
      'Payroll Fundamentals (أساسيات المرتبات والتأمينات)',
      'Performance Management (إدارة وتقييم الأداء)',
      'Organizational Culture & HR Policies (الثقافة التنظيمية والسياسات)',
      'شهادة إتمام معتمدة (Certificate of Completion)'
    ],
    featuresEn: [
      '12 Interactive Sessions • 24 Training Hours',
      'Recruitment & Talent Acquisition Mastery',
      'Personnel & Labour Law Core Principles',
      'Payroll Fundamentals & Compensation',
      'Performance Management Systems',
      'Organizational Culture & HR Policies',
      'Official Certificate of Completion'
    ],
    badgeAr: 'خصم خاص • 7,000 ج.م',
    badgeEn: 'Special Offer • 7,000 EGP',
    available: true
  },
  {
    id: 'srv-trn-jun-02',
    sku: 'HRN-TRN-JUN',
    titleAr: 'برنامج الموارد البشرية للمبتدئين (HR for Juniors Program)',
    titleEn: 'HR for Juniors Program',
    categoryAr: 'البرامج التدريبية والكورسات',
    categoryEn: 'Training Programs',
    price: 265,
    originalPrice: 340,
    exactPrices: {
      EGP: 3500,
      SAR: 265,
      USD: 73,
      AED: 260,
      QAR: 257,
      KWD: 22,
      BHD: 27,
      OMR: 28
    },
    exactOriginalPrices: {
      EGP: 4500,
      SAR: 340,
      USD: 95
    },
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'مقدمة عملية لوظائف الموارد البشرية الأساسية، مصممة خصيصاً للمبتدئين والمهنيين الجدد في مجال الموارد البشرية (6 جلسات • 12 ساعة تدريبية • شهادة إتمام).',
    descriptionEn: 'A practical introduction to the core HR functions, designed specifically for HR beginners and junior professionals (6 Sessions • 12 Training Hours • Certificate of Completion).',
    featuresAr: [
      '6 جلسات تطبيقية • 12 ساعة تدريبية',
      'Recruitment & Talent Acquisition — Fundamentals',
      'Personnel & Labour Law Basics — Fundamentals',
      'Payroll Fundamentals (أساسيات الرواتب)',
      'Performance Management — Fundamentals',
      'Organizational Culture & HR Policies — Fundamentals',
      'شهادة إتمام البرنامج (Certificate of Completion)'
    ],
    featuresEn: [
      '6 Practical Sessions • 12 Training Hours',
      'Recruitment & Talent Acquisition — Fundamentals',
      'Personnel & Labour Law Basics — Fundamentals',
      'Payroll Fundamentals',
      'Performance Management — Fundamentals',
      'Organizational Culture & HR Policies — Fundamentals',
      'Official Certificate of Completion'
    ],
    badgeAr: 'خصم خاص • 3,500 ج.م',
    badgeEn: 'Special Offer • 3,500 EGP',
    available: true
  },
  {
    id: 'srv-trn-cld-03',
    sku: 'HRN-TRN-CLD',
    titleAr: 'برنامج كلود للموارد البشرية بالذكاء الاصطناعي (Claude for HR)',
    titleEn: 'Claude for HR Program',
    categoryAr: 'البرامج التدريبية والكورسات',
    categoryEn: 'Training Programs',
    price: 284,
    originalPrice: 380,
    exactPrices: {
      EGP: 3750,
      SAR: 284,
      USD: 78,
      AED: 278,
      QAR: 275,
      KWD: 23,
      BHD: 29,
      OMR: 30
    },
    exactOriginalPrices: {
      EGP: 5000,
      SAR: 380,
      USD: 105
    },
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج عملي معزز بالذكاء الاصطناعي يساعد متخصصي الموارد البشرية على الاستفادة من Claude للعمل بذكاء وسرعة أكبر وبطريقة استراتيجية (6 جلسات • 12 ساعة تدريبية • استثمار 3,750 ج.م).',
    descriptionEn: 'A practical AI-powered HR program that helps HR professionals leverage Claude to work smarter, faster, and more strategically (6 Sessions • 12 Training Hours • Investment: 3,750 EGP).',
    featuresAr: [
      '6 جلسات • 12 ساعة تدريبية • 3,750 ج.م',
      '1. AI Foundations for Modern HR',
      '2. Claude Prompt Mastery for HR',
      '3. AI-Powered Talent Acquisition & Selection',
      '4. Performance Management & HR Operations',
      '5. People Analytics & Strategic HR Transformation with Claude',
      'شهادة إتمام معتمدة (Certificate of Completion)'
    ],
    featuresEn: [
      '6 Sessions • 12 Training Hours • 3,750 EGP',
      '1. AI Foundations for Modern HR',
      '2. Claude Prompt Mastery for HR',
      '3. AI-Powered Talent Acquisition',
      '4. Intelligent Interviewing & Talent Selection',
      '5. Performance Management & HR Operations',
      '6. People Analytics & Strategic HR Transformation',
      'Official Certificate of Completion'
    ],
    badgeAr: 'خصم خاص • 3,750 ج.م',
    badgeEn: 'Special Offer • 3,750 EGP',
    available: true
  },
  {
    id: 'srv-trn-od-04',
    sku: 'HRN-TRN-ODF',
    titleAr: 'أساسيات التطوير التنظيمي (OD Fundamentals)',
    titleEn: 'OD Fundamentals Program',
    categoryAr: 'البرامج التدريبية والكورسات',
    categoryEn: 'Training Programs',
    price: 379,
    originalPrice: 490,
    exactPrices: {
      EGP: 5000,
      SAR: 379,
      USD: 104,
      AED: 371,
      QAR: 367,
      KWD: 31,
      BHD: 38,
      OMR: 39
    },
    exactOriginalPrices: {
      EGP: 6500,
      SAR: 490,
      USD: 135
    },
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'مقدمة عملية لأساسيات التطوير التنظيمي ودوره في بناء منظمات فعالة وإدارة التغيير المؤسسي (6 جلسات • 12 ساعة تدريبية • استثمار 5,000 ج.م • شهادة إتمام معتمدة).',
    descriptionEn: 'A practical introduction to the fundamentals of Organizational Development and its role in building effective organizations (6 Sessions • 12 Training Hours • Investment: 5,000 EGP).',
    featuresAr: [
      '6 جلسات تفاعلية • 12 ساعة تدريبية • 5,000 ج.م',
      'نماذج وأدوات تشخيص المنظمات (OD Diagnostic Models)',
      'تصميم التدخلات وإدارة التغيير المؤسسي (Change Management)',
      'هندسة الوظائف والهياكل التنظيمية (Job Architecture)',
      'قياس أثر التطوير التنظيمي ومؤشرات الفعالية',
      'شهادة إتمام معتمدة (Certificate of Completion)'
    ],
    featuresEn: [
      '6 Sessions • 12 Training Hours • 5,000 EGP',
      'OD Diagnostic Models & Systems Thinking',
      'Designing Interventions & Culture Alignment',
      'Job Architecture & Restructuring Frameworks',
      'Measuring OD Impact & Long-term Effectiveness',
      'Official Certificate of Completion'
    ],
    badgeAr: 'خصم خاص • 5,000 ج.م',
    badgeEn: 'Special Offer • 5,000 EGP',
    available: true
  }
];

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
        titleAr: 'باقة التطوير التنظيمي وإعادة الهيكلة الشاملة',
        titleEn: 'Comprehensive Organizational Development & Restructuring',
        price: 35000,
        quantity: 1
      }
    ],
    subtotal: 35000,
    tax: 5250,
    total: 40250,
    currency: 'SAR',
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
        titleAr: 'منظومة إدارة الأداء ومؤشرات KPIs و OKRs',
        titleEn: 'Performance Management, KPIs & OKRs Framework',
        price: 22000,
        quantity: 1
      }
    ],
    subtotal: 22000,
    tax: 3300,
    total: 25300,
    currency: 'SAR',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'new',
    createdAt: '2025-05-19T11:20:00Z',
    notes: 'طلب فوري عبر بوابة الدفع الإلكتروني. تم تعيين المستشار المسؤول أ. طارق.',
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
        titleAr: 'حلول استقطاب وتوظيف القيادات التنفيذية',
        titleEn: 'Executive Search & Strategic Recruitment Solutions',
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
        serviceId: 'srv-trn-04',
        titleAr: 'برنامج تأهيل القيادات وتطوير المهارات التنفيذية',
        titleEn: 'Executive Leadership Academy & Coaching Program',
        price: 32000,
        quantity: 1
      }
    ],
    subtotal: 32000,
    tax: 4800,
    total: 36800,
    currency: 'SAR',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    status: 'processing',
    createdAt: '2025-05-20T08:15:00Z',
    notes: 'تم جدولة جلسات الكوتشينغ التنفيذي عبر الاتصال المرئي المشفر.',
    transactionRef: 'TXN-APAY-10928374'
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
    name: 'إدارة إتش آر نافيجيتور',
    email: 'admin@hr-navigator.com',
    phone: '+966 50 111 0099',
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
