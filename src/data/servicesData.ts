import { LuxuryService } from '../types';

export const initialServices: LuxuryService[] = [
  // =================================================================
  // 1. المؤسسية: الخدمات الاستشارية الكبرى (HR Navigator Consultations)
  // =================================================================
  {
    id: 'srv-od-01',
    sku: 'HRN-OD-01',
    titleAr: 'التطوير التنظيمي وإعادة الهيكلة الشاملة',
    titleEn: 'Comprehensive Organizational Development & Restructuring',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 462000,
    exactPrices: { EGP: 462000, SAR: 35000, USD: 9550, AED: 35000 },
    pricePrefixAr: 'يبدأ من',
    pricePrefixEn: 'Starts from',
    singleLineOutcomeAr: 'حوّل الهيكل التنظيمي إلى نموذج أكثر كفاءة ووضوحًا يدعم النمو ويمنع تداخل المسؤوليات.',
    singleLineOutcomeEn: 'Transform your organizational structure into an efficient model driving growth and eliminating overlap.',
    keyDeliverablesAr: [
      'تصميم الهيكل التنظيمي المعتمد وفق أفضل الممارسات',
      'مراجعة وتحديث بطاقات الوصف الوظيفي ومصفوفة الصلاحيات RACI',
      'إعداد خطة التحول والتنفيذ المؤسسي خطوة بخطوة'
    ],
    keyDeliverablesEn: [
      'Accredited Organizational Structure Design',
      'Job Descriptions & RACI Authority Framework Review',
      'Step-by-Step Enterprise Transformation & Execution Plan'
    ],
    estimatedDurationAr: '8–12 أسبوعًا',
    estimatedDurationEn: '8–12 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'إعادة بناء النموذج التشغيلي والهيكل التنظيمي لتسريع اتخاذ القرارات ورفع كفاءة الإنتاجية.',
    descriptionEn: 'Operating model redesign and organizational restructuring to streamline decision-making and boost output.',
    featuresAr: [
      'تصميم الهيكل التنظيمي المعتمد',
      'مراجعة الوظائف والصلاحيات',
      'إعداد خطة التحول والتنفيذ'
    ],
    featuresEn: [
      'Accredited Organizational Chart Design',
      'Job Descriptions & RACI Authority Review',
      'Transformation & Implementation Roadmap'
    ],
    badgeAr: 'الأكثر طلبًا',
    badgeEn: 'Most In Demand',
    available: true
  },
  {
    id: 'srv-rec-02',
    sku: 'HRN-REC-02',
    titleAr: 'استقطاب القيادات التنفيذية',
    titleEn: 'Executive Search & Strategic Recruitment',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 22,
    exactPrices: { EGP: 22, SAR: 22, USD: 22, AED: 22 },
    pricePrefixAr: 'الأتعاب:',
    pricePrefixEn: 'Fee:',
    customPriceNoteAr: '22% من الراتب السنوي للمرشح – بحد أدنى وفق مستوى الوظيفة',
    customPriceNoteEn: '22% of Candidate Annual Salary – Minimum threshold by seniority',
    singleLineOutcomeAr: 'استقطاب وتعيين أفضل الكفاءات القيادية لضمان قيادة استراتيجية ناجحة ومستدامة لمنشأتك.',
    singleLineOutcomeEn: 'Attract and secure visionary executive leaders to steer your organization toward strategic milestones.',
    keyDeliverablesAr: [
      'بحث واستهداف مباشر للكفاءات النادرة C-Level والمناصب الحساسة',
      'تقييم الجدارات السلوكية والمقابلات الفنية المعمقة',
      'ضمان استقرار المرشح واستبداله المجاني خلال فترة التجربة'
    ],
    keyDeliverablesEn: [
      'Direct Headhunting for C-Level and Senior Roles',
      'In-Depth Behavioral Competency & Psychometric Assessment',
      'Candidate Retention & Replacement Guarantee During Probation'
    ],
    estimatedDurationAr: '4–8 أسابيع',
    estimatedDurationEn: '4–8 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'استقطاب الكفاءات النادرة والمديرين التنفيذيين مع تقييم جدارات موثوق وضمان استقرار المرشح.',
    descriptionEn: 'Headhunting rare executive talent backed by validated competency assessments and retention guarantee.',
    featuresAr: [
      'بحث واستهداف الكفاءات النادرة',
      'تقييم سلوكي وفني معتمد',
      'ضمان استقرار المرشح لفترة التجربة'
    ],
    featuresEn: [
      'Direct C-Level & Executive Search',
      'Behavioral & Competency Assessment',
      'Retention & Replacement Guarantee'
    ],
    badgeAr: 'مناسب للقيادات',
    badgeEn: 'Executive Level',
    available: true
  },
  {
    id: 'srv-prf-03',
    sku: 'HRN-PRF-03',
    titleAr: 'إدارة الأداء و KPIs و OKRs',
    titleEn: 'Performance Management, KPIs & OKRs Framework',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 290400,
    exactPrices: { EGP: 290400, SAR: 22000, USD: 6000, AED: 22000 },
    pricePrefixAr: 'يبدأ من',
    pricePrefixEn: 'Starts from',
    singleLineOutcomeAr: 'مواءمة أهداف الموظفين مع الرؤية الاستراتيجية لتحفيز الإنتاجية وربط المكافآت بالنتائج الفعلية.',
    singleLineOutcomeEn: 'Align workforce targets with strategic goals to drive measurable accountability and performance.',
    keyDeliverablesAr: [
      'بناء وتدقيق قاموس مؤشرات الأداء الوظيفي (KPIs) لجميع الإدارات',
      'تطبيق نماذج تقييم أداء رقمية ودورية للأفراد وفرق العمل',
      'ربط منظومة تقييم الأداء بنظام المكافآت والحوافز السنوية'
    ],
    keyDeliverablesEn: [
      'Departmental Key Performance Indicator (KPI) Dictionary',
      'Automated & Periodic Digital Performance Evaluation Forms',
      'Linking Performance Scores to Merit Incentives & Rewards'
    ],
    estimatedDurationAr: '6–10 أسابيع',
    estimatedDurationEn: '6–10 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'منظومة متكاملة لقياس الأداء ومؤشرات الإنجاز لربط أهداف المنشأة بنتائج كل موظف.',
    descriptionEn: 'Comprehensive performance appraisal and OKR framework linking corporate goals to individual KPIs.',
    featuresAr: [
      'بناء قاموس مؤشرات الأداء (KPIs)',
      'نماذج تقييم أداء رقمية دورية',
      'ربط الأداء بسلم المكافآت والحوافز'
    ],
    featuresEn: [
      'Custom KPI & OKR Dictionary',
      'Digital Appraisal Workflows',
      'Incentive & Merit Matrix'
    ],
    badgeAr: 'الأفضل للتحول',
    badgeEn: 'Best for Transformation',
    available: true
  },
  {
    id: 'srv-trn-04',
    sku: 'HRN-TRN-04',
    titleAr: 'تأهيل القيادات وتطوير المهارات التنفيذية',
    titleEn: 'Executive Leadership Academy & Coaching Program',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 422400,
    exactPrices: { EGP: 422400, SAR: 32000, USD: 8750, AED: 32000 },
    pricePrefixAr: 'يبدأ من',
    pricePrefixEn: 'Starts from',
    customPriceNoteAr: 'تبدأ من 422,400 ج.م للمجموعة',
    customPriceNoteEn: 'Starts from 422,400 EGP per cohort',
    singleLineOutcomeAr: 'تمكين القيادات التنفيذية بمهارات القيادة الحديثة وصناعة القرار الاستراتيجي وإدارة التغيير.',
    singleLineOutcomeEn: 'Equip senior leaders with modern decision-making skills, emotional intelligence, and strategic vision.',
    keyDeliverablesAr: [
      'جلسات كوتشينغ تنفيذي فردي (1-on-1) للقيادات العليا',
      'مصفوفة خطط التعاقب الوظيفي (Succession Planning) للمناصب الحرجة',
      'قياس الأثر التدريبي الفعلي على الإنتاجية وعائد الاستثمار ROI'
    ],
    keyDeliverablesEn: [
      '1-on-1 Certified Executive Coaching Sessions',
      'Succession Planning Architecture for Critical Positions',
      'Post-Program ROI & Leadership Impact Measurement'
    ],
    estimatedDurationAr: '8–12 أسبوعًا',
    estimatedDurationEn: '8–12 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج مكثف لتطوير القيادات التنفيذية يشمل كوتشينغ فردي ومحاكاة لصناعة القرار وإدارة التغيير.',
    descriptionEn: 'Intensive executive coaching, leadership simulation, and succession planning for enterprise directors.',
    featuresAr: [
      'كوتشينغ تنفيذي فردي (1-on-1)',
      'خطط التعاقب الوظيفي للمناصب الحساسة',
      'تقييم أثر التدريب و ROI'
    ],
    featuresEn: [
      '1-on-1 Executive Coaching',
      'Strategic Succession Planning',
      'Training Impact & ROI Analysis'
    ],
    badgeAr: 'تطوير نخبوي',
    badgeEn: 'Executive Elite',
    available: true
  },
  {
    id: 'srv-emp-05',
    sku: 'HRN-EMP-05',
    titleAr: 'تدقيق الامتثال ولائحة تنظيم العمل',
    titleEn: 'Labor Law Compliance & Bylaw Accreditation',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 237600,
    exactPrices: { EGP: 237600, SAR: 18000, USD: 4900, AED: 18000 },
    pricePrefixAr: 'يبدأ من',
    pricePrefixEn: 'Starts from',
    singleLineOutcomeAr: 'حماية المنشأة قانونيًا وضمان التوافق التام مع نظام العمل وتجنب النزاعات العمالية والغرامات.',
    singleLineOutcomeEn: 'Protect your enterprise legally, ensure full labor law compliance, and eliminate litigation risks.',
    keyDeliverablesAr: [
      'مراجعة واعتماد اللائحة الداخلية لتنظيم العمل رسميًا',
      'صياغة نماذج عقود العمل الموحدة المحمية قانونياً',
      'دليل إجراءات التحقيق الإداري وجدول المخالفات والجزاءات'
    ],
    keyDeliverablesEn: [
      'Official Labor Regulation Bylaw Drafting & Approval',
      'Legally Protective Standardized Employment Contracts',
      'Internal Investigation Procedures & Disciplinary Policy'
    ],
    estimatedDurationAr: '4–6 أسابيع',
    estimatedDurationEn: '4–6 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'تدقيق قانوني شامل لكافة الممارسات العمالية وصياغة اللوائح والعقود لتفادي أي نزاعات أو مخالفات.',
    descriptionEn: 'Rigorous legal HR audit, internal bylaw drafting, and protective employment contracts.',
    featuresAr: [
      'مراجعة واعتماد اللائحة الداخلية',
      'صياغة نماذج عقود عمل متوافقة',
      'دليل إجراءات التحقيق والمساءلة'
    ],
    featuresEn: [
      'Internal Bylaw Legal Accreditation',
      'Compliant Employment Contracts',
      'Investigation & Disciplinary Manual'
    ],
    badgeAr: 'حماية نظامية',
    badgeEn: 'Regulatory Safety',
    available: true
  },
  {
    id: 'srv-anl-06',
    sku: 'HRN-ANL-06',
    titleAr: 'HR Analytics Dashboard (لوحة تحليلات الموارد البشرية)',
    titleEn: 'Executive HR Analytics & BI Dashboard',
    categoryAr: 'الخدمات الاستشارية',
    categoryEn: 'Consulting Services',
    serviceType: 'consulting',
    price: 343200,
    exactPrices: { EGP: 343200, SAR: 26000, USD: 7100, AED: 26000 },
    pricePrefixAr: 'يبدأ من',
    pricePrefixEn: 'Starts from',
    customPriceNoteAr: 'تبدأ من 343,200 ج.م – التراخيص غير مشمولة',
    customPriceNoteEn: 'Starts from 343,200 EGP – Software licenses excluded',
    singleLineOutcomeAr: 'تحويل بيانات رأس المال البشري إلى لوحات تفاعلية تدعم اتخاذ القرارات التنفيذية السريعة والدقيقة.',
    singleLineOutcomeEn: 'Transform raw HR data into interactive executive dashboards for fast, high-impact workforce decisions.',
    keyDeliverablesAr: [
      'لوحة ذكاء أعمال BI تفاعلية وفورية للإدارة العليا',
      'نماذج استباقية للتنبؤ بمعدلات دوران العمل وتكلفة التوظيف',
      'ربط تكامل الأنظمة مع برامج الرواتب و HRIS الحالية'
    ],
    keyDeliverablesEn: [
      'Real-Time Interactive Business Intelligence (BI) Dashboard',
      'Predictive Models for Turnover, Absenteeism & Hiring Costs',
      'Seamless Data Pipeline Integration with Existing HRIS'
    ],
    estimatedDurationAr: '4–8 أسابيع',
    estimatedDurationEn: '4–8 Weeks',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'بناء داشبورد ذكي يربط جميع مؤشرات رأس المال البشري ويزود الإدارة بتقارير لحظية دقيقة.',
    descriptionEn: 'Interactive BI dashboard consolidating workforce metrics and delivering real-time actionable intelligence.',
    featuresAr: [
      'لوحة ذكاء أعمال BI فورية للإدارة',
      'نماذج استباقية للتنبؤ بدوران العمل',
      'ربط تكامل الأنظمة مع أنظمة HRIS'
    ],
    featuresEn: [
      'Executive Real-Time BI Dashboard',
      'Predictive Turnover Models',
      'HRIS System Integration'
    ],
    badgeAr: 'حل رقمي',
    badgeEn: 'Digital Solution',
    available: true
  },

  // =================================================================
  // 2. الاستشارات الفردية والزيارات التشخيصية (Screenshot 2)
  // =================================================================
  {
    id: 'srv-adv-01',
    sku: 'HRN-ADV-01',
    titleAr: 'جلسة استشارية فردية (60 دقيقة)',
    titleEn: 'Individual Advisory Consultation (60 Mins)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 2500,
    exactPrices: { EGP: 2500, SAR: 190, USD: 52, AED: 190 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'تشخيص مباشر لحل مشكلة محددة أو اتخاذ قرار HR استراتيجي حاسم.',
    singleLineOutcomeEn: 'Direct focused diagnostic session to solve a specific challenge or decide on a critical HR issue.',
    keyDeliverablesAr: [
      'تحليل فوري للتحدي المطروح مع كبير المستشارين',
      'توصيات عملية وخطوات تنفيذية واضحة ومباشرة',
      'ملخص مكتوب لأبرز القرارات والتوصيات المتفق عليها'
    ],
    keyDeliverablesEn: [
      'Instant deep-dive with Chief HR Advisor',
      'Direct, actionable execution steps',
      'Written executive summary of recommendations'
    ],
    estimatedDurationAr: '60 دقيقة',
    estimatedDurationEn: '60 Minutes',
    suitableForAr: 'مشكلة محددة أو قرار HR واحد',
    suitableForEn: 'A specific issue or single HR decision',
    primaryActionType: 'book_diagnostic',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'جلسة مركزة عبر الفيديو أو الهاتف لمناقشة تحدي مهني محدد والحصول على حلول قابلة للتطبيق فوراً.',
    descriptionEn: 'A targeted one-on-one video session to tackle a specific HR challenge with immediate actionable solutions.',
    featuresAr: [
      'جلسة مكثفة 60 دقيقة عبر Google Meet / Zoom',
      'مناسبة لمشكلة محددة أو قرار HR واحد',
      'توصيات عملية موثقة خطياً'
    ],
    featuresEn: [
      '60-minute intensive virtual consultation',
      'Best for specific problems or single decisions',
      'Documented actionable recommendations'
    ],
    badgeAr: 'استشارة فردية',
    badgeEn: '1-on-1 Session',
    available: true
  },
  {
    id: 'srv-adv-02',
    sku: 'HRN-ADV-02',
    titleAr: 'جلسة تحليل متعمق (90 دقيقة)',
    titleEn: 'In-Depth Case Analysis Session (90 Mins)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 4000,
    exactPrices: { EGP: 4000, SAR: 300, USD: 83, AED: 300 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'تحليل حالة شاملة وفحص الوثائق ووضع خطوات تنفيذية منهجية لمعالجة التحديات.',
    singleLineOutcomeEn: 'Comprehensive case assessment, document review, and structured action steps.',
    keyDeliverablesAr: [
      'دراسة معمقة للمستندات واللوائح والبيانات قبل الجلسة',
      'جلسة نقاش تشخيصية 90 دقيقة عبر الفيديو',
      'خارطة طريق تنفيذية مجدولة زمنياً لمعالجة المشكلة'
    ],
    keyDeliverablesEn: [
      'Prior document and bylaw review',
      '90-minute structured diagnostic video session',
      'Chronological action roadmap for execution'
    ],
    estimatedDurationAr: '90 دقيقة',
    estimatedDurationEn: '90 Minutes',
    suitableForAr: 'تحليل حالة ووضع خطوات تنفيذية',
    suitableForEn: 'Case study & execution steps',
    primaryActionType: 'book_diagnostic',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'دراسة مستفيضة لحالة المؤسسة أو النزاع الداخلي ووضع خطوات إجرائية مفصلة للتنفيذ.',
    descriptionEn: 'Exhaustive examination of your company case with step-by-step organizational mitigation.',
    featuresAr: [
      'جلسة 90 دقيقة مع دراسة المستندات مسبقاً',
      'مناسبة لتحليل حالة ووضع خطوات تنفيذية',
      'خارطة طريق تنفيذية لمعالجة التحدي'
    ],
    featuresEn: [
      '90-minute session with document pre-review',
      'Suitable for deep case study & action plans',
      'Clear structured execution roadmap'
    ],
    badgeAr: 'تحليل متعمق',
    badgeEn: 'Deep Analysis',
    available: true
  },
  {
    id: 'srv-adv-03',
    sku: 'HRN-ADV-03',
    titleAr: 'استشارة تنفيذية للشركات (90 دقيقة)',
    titleEn: 'Corporate Executive Advisory (90 Mins)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 6000,
    exactPrices: { EGP: 6000, SAR: 450, USD: 125, AED: 450 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'جلسة توجيه استراتيجي مخصصة لأصحاب الشركات والمديرين التنفيذيين لصناعة القرارات الكبرى.',
    singleLineOutcomeEn: 'High-level strategic guidance tailored for founders, CEOs, and C-suite decision-makers.',
    keyDeliverablesAr: [
      'تقييم جاهزية رأس المال البشري للتوسع والنمو',
      'مراجعة تحديات القيادة والرواتب والهيكل مع المؤسسين',
      'مذكرة توجيهية تنفيذية خاصة بمجلس الإدارة'
    ],
    keyDeliverablesEn: [
      'Human capital scaling & readiness diagnostic',
      'Executive alignment on compensation and structure',
      'Confidential board advisory memo'
    ],
    estimatedDurationAr: '90 دقيقة',
    estimatedDurationEn: '90 Minutes',
    suitableForAr: 'أصحاب الشركات والمديرون التنفيذيون',
    suitableForEn: 'Founders, CEOs & Executive Directors',
    primaryActionType: 'book_diagnostic',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'استشارة استراتيجية متقدمة مخصصة للمؤسسين والمديرين التنفيذيين لمناقشة القرارات الاستراتيجية الحساسة.',
    descriptionEn: 'Confidential executive advisory for founders and executives on strategic talent decisions.',
    featuresAr: [
      'جلسة 90 دقيقة مخصصة للقيادات العليا',
      'مناسبة لأصحاب الشركات والمديرين التنفيذيين',
      'مذكرة توجيهية خاصة للقرارات الاستراتيجية'
    ],
    featuresEn: [
      '90-minute session for top executives',
      'Suitable for business owners & CEOs',
      'Strategic advisory memorandum'
    ],
    badgeAr: 'مخصص للشركات',
    badgeEn: 'Corporate C-Level',
    available: true
  },
  {
    id: 'srv-adv-04',
    sku: 'HRN-ADV-04',
    titleAr: 'باقة المتابعة المهنية (3 جلسات × 60 دقيقة)',
    titleEn: 'Professional Follow-up Pack (3 Sessions × 60 Mins)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 7000,
    exactPrices: { EGP: 7000, SAR: 530, USD: 145, AED: 530 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'مرافقة مهنية مكثفة ومتابعة حثيثة لتنفيذ الحلول والمخرجات خلال شهر كامل.',
    singleLineOutcomeEn: 'Close professional accompaniment ensuring rigorous execution over a full 30-day period.',
    keyDeliverablesAr: [
      '3 جلسات استشارية موزعة على مدار 30 يوماً',
      'مراجعة واعتماد مسودات القرارات والسياسات',
      'قناة تواصل واتساب مباشرة للرد على الاستفسارات العاجلة'
    ],
    keyDeliverablesEn: [
      '3 advisory sessions distributed over 30 days',
      'Draft decision and policy review & sign-off',
      'Direct WhatsApp channel for urgent operational queries'
    ],
    estimatedDurationAr: '3 جلسات × 60 دقيقة',
    estimatedDurationEn: '3 Sessions × 60 Mins',
    suitableForAr: 'متابعة تنفيذ الحل خلال شهر',
    suitableForEn: 'Solution implementation tracking over 1 month',
    primaryActionType: 'book_diagnostic',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'باقة متابعة وإشراف على مدار شهر لضمان ترجمة القرارات الاستشارية إلى واقع عملي ناجح.',
    descriptionEn: 'Monthly supervisory package ensuring strategic recommendations are successfully embedded.',
    featuresAr: [
      '3 جلسات استشارية متباعدة (60 دقيقة لكل جلسة)',
      'مناسبة لمتابعة تنفيذ الحل خلال شهر',
      'إشراف ومراجعة دورية للمستندات والنتائج'
    ],
    featuresEn: [
      '3 distributed sessions (60 mins each)',
      'Suitable for 1-month solution follow-up',
      'Document review and continuous guidance'
    ],
    badgeAr: 'متابعة شهرية',
    badgeEn: 'Monthly Retainer',
    available: true
  },
  {
    id: 'srv-adv-05',
    sku: 'HRN-ADV-05',
    titleAr: 'باقة المستشار التنفيذي (4 ساعات شهرياً)',
    titleEn: 'Retained Executive Advisor (4 Hours / Month)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 12000,
    exactPrices: { EGP: 12000, SAR: 910, USD: 250, AED: 910 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'شراكة استشارية مستمرة لدعم الإدارة في القرارات والسياسات وضمان الانضباط التنظيمي.',
    singleLineOutcomeEn: 'Ongoing retained advisory supporting leadership in continuous policy formulation and decisions.',
    keyDeliverablesAr: [
      'رصيد 4 ساعات استشارية شهرياً مقسمة وفق حاجة الإدارة',
      'مراجعة دورية للوائح والقرارات الإدارية قبل صدورها',
      'أولوية قصوى ودعم استشاري استباقي في الأزمات'
    ],
    keyDeliverablesEn: [
      '4 consultation hours monthly allocated flexibly',
      'Routine review of HR decisions and bylaws before issuance',
      'Priority emergency advisory support'
    ],
    estimatedDurationAr: '4 ساعات شهرياً',
    estimatedDurationEn: '4 Hours Monthly',
    suitableForAr: 'دعم الإدارة في القرارات والسياسات',
    suitableForEn: 'Executive management support on policies',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'مستشارك الخاص للموارد البشرية على مدار الشهر لدعم الإدارة في صياغة القرارات ومراجعة اللوائح.',
    descriptionEn: 'Dedicated monthly HR advisor backing your executive committee on critical workforce decisions.',
    featuresAr: [
      '4 ساعات استشارية شهرياً مرنة',
      'مناسبة لدعم الإدارة في القرارات والسياسات',
      'أولوية قصوى في الاستجابة والاستشارات'
    ],
    featuresEn: [
      '4 flexible consultation hours monthly',
      'Supports management in ongoing policies',
      'Top priority advisory response'
    ],
    badgeAr: 'مستشار مخصص',
    badgeEn: 'Executive Retainer',
    available: true
  },
  {
    id: 'srv-adv-06',
    sku: 'HRN-ADV-06',
    titleAr: 'زيارة استشارية داخل الشركة (3 ساعات كحد أدنى)',
    titleEn: 'On-Site Corporate Advisory Visit (3 Hours Min)',
    categoryAr: 'الاستشارات التشخيصية',
    categoryEn: 'Diagnostic Advisory',
    serviceType: 'advisory',
    price: 12000,
    exactPrices: { EGP: 12000, SAR: 910, USD: 250, AED: 910 },
    pricePrefixAr: 'السعر:',
    pricePrefixEn: 'Price:',
    singleLineOutcomeAr: 'حضور ميداني في مقر منشأتك للاجتماع مع الإدارة ودراسة بيئة العمل والتحديات ميدانياً.',
    singleLineOutcomeEn: 'Direct on-site consultant presence at your company HQ for leadership alignment and field diagnosis.',
    keyDeliverablesAr: [
      'حضور ميداني لكبار المستشارين في مقر الشركة',
      'اجتماع طاولة مستديرة مع مجلس الإدارة ومديري الأقسام',
      'تقرير تشخيصي وتوصيات عملية تسلم للإدارة بعد الزيارة'
    ],
    keyDeliverablesEn: [
      'Senior advisor on-site presence at headquarters',
      'Roundtable session with board and department heads',
      'Comprehensive post-visit diagnostic field report'
    ],
    estimatedDurationAr: '3 ساعات كحد أدنى',
    estimatedDurationEn: '3 Hours Minimum',
    suitableForAr: 'اجتماع الإدارة ودراسة المشكلة ميدانياً',
    suitableForEn: 'Executive board meetings & on-site diagnosis',
    primaryActionType: 'request_custom_quote',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'زيارة ميدانية لمقر شركتك للاطلاع على بيئة العمل وتدفق العمليات والاجتماع بالمسؤولين مباشرة.',
    descriptionEn: 'Direct in-person organizational diagnosis at your corporate offices with executive roundtables.',
    featuresAr: [
      'زيارة ميدانية 3 ساعات في مقر منشأتك',
      'مناسبة لاجتماع الإدارة ودراسة المشكلة ميدانياً',
      'تقرير تشخيصي شامل بعد الزيارة'
    ],
    featuresEn: [
      '3-hour on-site visit at corporate premises',
      'Ideal for board meetings & field assessment',
      'Detailed comprehensive post-visit report'
    ],
    badgeAr: 'زيارة ميدانية',
    badgeEn: 'On-Site Diagnostic',
    available: true
  },

  // =================================================================
  // 3. البرامج التدريبية والكورسات (Training Programs)
  // =================================================================
  {
    id: 'srv-trn-adv-01',
    sku: 'HRN-TRN-ADV-01',
    titleAr: 'HR Advanced Program (برنامج الموارد البشرية المتقدم)',
    titleEn: 'HR Advanced Program',
    categoryAr: 'البرامج التدريبية',
    categoryEn: 'Training Programs',
    serviceType: 'training',
    price: 7000,
    exactPrices: { EGP: 7000, SAR: 530, USD: 145, AED: 530 },
    studentDiscountPrice: 3850,
    exactStudentPrices: { EGP: 3850, SAR: 290, USD: 80, AED: 290 },
    pricePrefixAr: 'الاستثمار:',
    pricePrefixEn: 'Investment:',
    singleLineOutcomeAr: 'برنامج عملي تطبيقي متكامل لبناء قدرات مهنية متقدمة وجاهزة لسوق العمل عبر وظائف HR الأساسية.',
    singleLineOutcomeEn: 'A practical HR program designed to build solid, job-ready capabilities across core HR functions.',
    keyDeliverablesAr: [
      '12 جلسة تدريبية تفاعلية مباشرة (24 ساعة تدريبية معتمدة)',
      'شهادة إتمام رسمية معتمدة من HR Navigator Consultations',
      'تطبيقات عملية على التوظيف، قانون العمل، الرواتب، وإدارة الأداء'
    ],
    keyDeliverablesEn: [
      '12 Interactive Live Sessions (24 Accredited Training Hours)',
      'Official Certificate of Completion from HR Navigator Consultations',
      'Hands-on practical cases: Talent, Labor Law, Payroll & Performance'
    ],
    estimatedDurationAr: '12 جلسة (24 ساعة تدريبية)',
    estimatedDurationEn: '12 Sessions (24 Training Hours)',
    primaryActionType: 'instant_enroll',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج تطبيقي متقدم يغطي التوظيف، قانون العمل والتأمينات، الرواتب، الأداء، والثقافة المؤسسية.',
    descriptionEn: 'A practical HR program designed to build solid, job-ready capabilities across core HR functions.',
    featuresAr: [
      '12 جلسة تدريبية (24 ساعة تدريبية)',
      'شهادة إتمام معتمدة من HR Navigator',
      'خصم خاص لطلبة الجامعة عند رفع كارنيه الجامعة'
    ],
    featuresEn: [
      '12 Sessions (24 Training Hours)',
      'Official Certificate of Completion',
      'Special University Student Discount with Student ID'
    ],
    badgeAr: 'برنامج احترافي متقدم',
    badgeEn: 'Advanced Certification',
    available: true,
    courseDetails: {
      sessionsCount: 12,
      trainingHours: 24,
      certificateTitleAr: 'شهادة إتمام معتمدة في ممارسات الموارد البشرية المتقدمة - HR Navigator Consultations',
      certificateTitleEn: 'Certified HR Advanced Professional - HR Navigator Consultations',
      investmentEgp: 7000,
      studentPriceEgp: 3850,
      targetAudienceAr: [
        'أخصائيو وممارسو الموارد البشرية الراغبون في الترقية لمستويات إشرافية',
        'مديرو الموارد البشرية الجدد وأصحاب الأعمال الباحثون عن تطبيق عملي سليم',
        'خريجو الجامعات الطموحون الراغبون في اكتساب مهارات متقدمة تؤهلهم للوظائف القيادية'
      ],
      targetAudienceEn: [
        'HR specialists and practitioners aiming for supervisory promotion',
        'New HR managers and SME business owners seeking professional execution',
        'Ambitious professionals aiming for enterprise HR readiness'
      ],
      learningOutcomesAr: [
        'إتقان دورة الاستقطاب والتعيين والمقابلات السلوكية المتطورة',
        'فهم أحكام قانون العمل والتأمينات الاجتماعية وتجنب النزاعات القانونية',
        'حساب الرواتب والبدلات والاستقطاعات ونهاية الخدمة باحترافية تامة',
        'تصميم وتطبيق منظومات تقييم الأداء ومتابعة تحقيق الأهداف',
        'بناء سياسات العمل وثقافة المنظمة وتعزيز ارتباط الموظفين'
      ],
      learningOutcomesEn: [
        'Master the full recruitment lifecycle and behavioral interviewing',
        'Deep mastery of Labor Law & social insurance compliance',
        'Flawless payroll calculations, deductions, and end-of-service awards',
        'Design and deploy practical performance management frameworks',
        'Build healthy organizational culture and institutional HR policies'
      ],
      modules: [
        {
          number: 1,
          titleAr: 'Recruitment & Talent Acquisition (استقطاب المواهب والتوظيف)',
          titleEn: 'Recruitment & Talent Acquisition',
          descriptionAr: 'تخطيط القوى العاملة، صياغة الإعلانات، مصادر التوظيف المتقدمة، والمقابلات المبنية على الجدارات.'
        },
        {
          number: 2,
          titleAr: 'Personnel & Labour Law Basics (شؤون العاملين وقانون العمل)',
          titleEn: 'Personnel & Labour Law Basics',
          descriptionAr: 'أنواع العقود، الإجازات، التحقيق التأديبي، التأمينات الاجتماعية، وحقوق والتزامات الطرفين.'
        },
        {
          number: 3,
          titleAr: 'Payroll Fundamentals (أساسيات وإعداد الرواتب)',
          titleEn: 'Payroll Fundamentals',
          descriptionAr: 'هيكل الرواتب، حساب الضرائب والتأمينات، الإضافي والخصومات، وإقفال شيت المرتبات شهرياً.'
        },
        {
          number: 4,
          titleAr: 'Performance Management (إدارة وتطوير الأداء)',
          titleEn: 'Performance Management',
          descriptionAr: 'تحديد مستهدفات SMART، نماذج التقييم الدوري، معالجة تدني الأداء، وإدارة الحوافز.'
        },
        {
          number: 5,
          titleAr: 'Organizational Culture & HR Policies (الثقافة المؤسسية والسياسات)',
          titleEn: 'Organizational Culture & HR Policies',
          descriptionAr: 'صياغة دليل الموظف، لائحة العمل الداخلية، بناء الولاء الوظيفي، وبيئة العمل الإيجابية.'
        }
      ],
      studentDiscount: {
        available: true,
        studentPriceEgp: 3850,
        standardPriceEgp: 7000,
        discountNoteAr: 'خصم خاص لطلبة الجامعة عند تقديم صورة كارنيه الجامعة ساري الصلاحية.',
        discountNoteEn: 'Special university student discount with valid student ID upload.',
        idCardRequired: true
      },
      deliveryFormatAr: 'جلسات تفاعلية مباشرة عبر الإنترنت (Zoom) مع تسجيلات دائمة وماتيريال كامل',
      deliveryFormatEn: 'Live interactive online Zoom sessions + permanent recordings & resources',
      toolsUsedAr: ['قوالب شيتات رواتب إكسيل متطورة', 'نماذج عقود عمل متوافقة', 'أدلة المقابلات السلوكية']
    }
  },
  {
    id: 'srv-trn-jun-02',
    sku: 'HRN-TRN-JUN-02',
    titleAr: 'HR for Juniors Program (برنامج الموارد البشرية للمبتدئين)',
    titleEn: 'HR for Juniors Program',
    categoryAr: 'البرامج التدريبية',
    categoryEn: 'Training Programs',
    serviceType: 'training',
    // Base price shown outside is strictly 3,000 EGP as mandated!
    price: 3000,
    exactPrices: { EGP: 3000, SAR: 227, USD: 62, AED: 227 },
    // 45% student discount applied at checkout upon uploading university student ID = 1,650 EGP!
    studentDiscountPrice: 1650,
    exactStudentPrices: { EGP: 1650, SAR: 125, USD: 34, AED: 125 },
    pricePrefixAr: 'الاستثمار:',
    pricePrefixEn: 'Investment:',
    singleLineOutcomeAr: 'مدخلك العملي الشامل لاحتراف وظائف الموارد البشرية الأساسية والانطلاق في سوق العمل بثقة.',
    singleLineOutcomeEn: 'A practical introduction to core HR functions designed specifically for HR beginners and juniors.',
    keyDeliverablesAr: [
      '6 جلسات تدريبية مكثفة (12 ساعة تدريبية تفاعلية)',
      'شهادة إتمام معتمدة من HR Navigator Consultations',
      'خصم 45% لطلبة الجامعة عند الحجز ورفع صورة كارنيه الجامعة'
    ],
    keyDeliverablesEn: [
      '6 Intensive Sessions (12 Interactive Training Hours)',
      'Official Certificate of Completion from HR Navigator Consultations',
      '45% University Student Discount with Student ID Upload'
    ],
    estimatedDurationAr: '6 جلسات (12 ساعة تدريبية)',
    estimatedDurationEn: '6 Sessions (12 Training Hours)',
    primaryActionType: 'instant_enroll',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'مدخل عملي مبسط لأساسيات الموارد البشرية مصمم خصيصاً للطلبة والمبتدئين في المجال.',
    descriptionEn: 'A practical introduction to core HR functions, designed specifically for HR beginners and junior professionals.',
    featuresAr: [
      '6 جلسات تدريبية (12 ساعة تدريبية)',
      'شهادة إتمام معتمدة من HR Navigator',
      'خصم 45% لطلبة الجامعة عند الحجز والدفع (1,650 ج.م)'
    ],
    featuresEn: [
      '6 Sessions (12 Training Hours)',
      'Official Certificate of Completion',
      '45% Student Discount at checkout with Student ID (1,650 EGP)'
    ],
    badgeAr: 'خصم 45% للطلبة عند الحجز',
    badgeEn: '45% Student Discount at Checkout',
    available: true,
    courseDetails: {
      sessionsCount: 6,
      trainingHours: 12,
      certificateTitleAr: 'شهادة إتمام معتمدة - برنامج الموارد البشرية للمبتدئين (HR for Juniors)',
      certificateTitleEn: 'Certificate of Completion - HR for Juniors Program',
      investmentEgp: 3000,
      studentPriceEgp: 1650, // 3000 - 45% discount!
      targetAudienceAr: [
        'طلاب وخريجو الجامعات الباحثون عن أول وظيفة في مجال الموارد البشرية HR',
        'مبتدئو العمل في إدارة الموارد البشرية (خبرة أقل من سنتين)',
        'الراغبون في التحويل المهني (Career Shift) إلى مجال الموارد البشرية'
      ],
      targetAudienceEn: [
        'University students and fresh graduates seeking an entry-level HR career',
        'Junior HR professionals and assistants (0–2 years of experience)',
        'Professionals making a career transition into Human Resources'
      ],
      learningOutcomesAr: [
        'فهم الهيكل العام لإدارات الموارد البشرية والمسارات الوظيفية',
        'اكتساب المهارات الأساسية في التوظيف وفلترة السير الذاتية وإجراء المقابلات الأولية',
        'معرفة حقوق وواجبات الموظف وصاحب العمل وفق قانون العمل',
        'فهم مكونات مسير الرواتب وكيفية مراجعة الحضور والانصراف والبدلات',
        'أساسيات صياغة السياسات والإجراءات وكتابة الإيميلات المهنية'
      ],
      learningOutcomesEn: [
        'Understand HR structure, functions, and career path trajectories',
        'Screen resumes, master screening interviews, and coordinate recruitment',
        'Grasp core labor law principles and statutory worker rights',
        'Understand payroll sheets, time & attendance, and deduction calculations',
        'Draft basic HR operational policies and professional business communications'
      ],
      modules: [
        {
          number: 1,
          titleAr: 'Recruitment & Talent Acquisition — Fundamentals (أساسيات التوظيف)',
          titleEn: 'Recruitment & Talent Acquisition — Fundamentals',
          descriptionAr: 'قراءة وفلترة الـ CVs، تجهيز أسئلة المقابلة، وتنظيم ملفات المتقدمين.'
        },
        {
          number: 2,
          titleAr: 'Personnel & Labour Law Basics — Fundamentals (أساسيات شؤون العاملين)',
          titleEn: 'Personnel & Labour Law Basics — Fundamentals',
          descriptionAr: 'مسوغات التعيين، ملفات الموظفين، الإجازات الرسمية، والتأمين الصحي والاجتماعي.'
        },
        {
          number: 3,
          titleAr: 'Payroll Fundamentals (أساسيات الرواتب)',
          titleEn: 'Payroll Fundamentals',
          descriptionAr: 'مكونات الراتب، مفردات المرتب، حساب الخصومات والغياب والتأخيرات.'
        },
        {
          number: 4,
          titleAr: 'Performance Management — Fundamentals (أساسيات إدارة الأداء)',
          titleEn: 'Performance Management — Fundamentals',
          descriptionAr: 'أهمية التقييم الوظيفي، دور مسؤول الـ HR في المتابعة، وكيفية توثيق الملاحظات.'
        },
        {
          number: 5,
          titleAr: 'Organizational Culture & HR Policies — Fundamentals (السياسات وثقافة العمل)',
          titleEn: 'Organizational Culture & HR Policies — Fundamentals',
          descriptionAr: 'أخلاقيات العمل، حفظ السرية، ولائحة النظام الأساسي، والتواصل مع الموظفين.'
        }
      ],
      studentDiscount: {
        available: true,
        studentPriceEgp: 1650,
        standardPriceEgp: 3000,
        discountNoteAr: 'خصم 45% خاص ومباشر لطلبة الجامعات عند الحجز والدفع (السعر بعد الخصم: 1,650 ج.م). يلزم رفع صورة كارنيه الجامعة أو إثبات القيد.',
        discountNoteEn: 'Direct 45% university student discount at checkout (Price after discount: 1,650 EGP). Valid Student ID upload is strictly required.',
        idCardRequired: true
      },
      deliveryFormatAr: 'جلسات تفاعلية مباشرة عبر الإنترنت (Zoom) + تسجيلات كاملة وماتيريال تدريبي',
      deliveryFormatEn: 'Interactive live Zoom workshops + full session recordings and study material',
      toolsUsedAr: ['شيتات إكسيل جاهزة لشؤون العاملين', 'قوالب سيرة ذاتية وبطاقات مقابلة', 'ملفات قانون العمل المبسطة']
    }
  },
  {
    id: 'srv-trn-cld-03',
    sku: 'HRN-TRN-CLD-03',
    titleAr: 'Claude for HR (برنامج كلود للذكاء الاصطناعي في الموارد البشرية)',
    titleEn: 'Claude for HR',
    categoryAr: 'البرامج التدريبية',
    categoryEn: 'Training Programs',
    serviceType: 'training',
    price: 3750,
    exactPrices: { EGP: 3750, SAR: 284, USD: 78, AED: 284 },
    studentDiscountPrice: 2062,
    exactStudentPrices: { EGP: 2062, SAR: 156, USD: 43, AED: 156 },
    pricePrefixAr: 'الاستثمار:',
    pricePrefixEn: 'Investment:',
    singleLineOutcomeAr: 'برنامج تطبيقي مدعوم بالذكاء الاصطناعي لتمكين ممارسي HR من استخدام Claude للعمل بذكاء وسرعة أكبر.',
    singleLineOutcomeEn: 'A practical AI-powered HR program helping professionals leverage Claude to work smarter and faster.',
    keyDeliverablesAr: [
      '6 جلسات تدريبية تطبيقية (12 ساعة تدريبية عملية)',
      'شهادة إتمام معتمدة من HR Navigator Consultations',
      'مكتبة أوامر وبرومبتات احترافية متكاملة لجميع عمليات الموارد البشرية'
    ],
    keyDeliverablesEn: [
      '6 Hands-on Sessions (12 Practical Training Hours)',
      'Official Certificate of Completion from HR Navigator Consultations',
      'Ready-to-use Prompt Engineering Library for HR workflows'
    ],
    estimatedDurationAr: '6 جلسات (12 ساعة تدريبية)',
    estimatedDurationEn: '6 Sessions (12 Training Hours)',
    primaryActionType: 'instant_enroll',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج عملي بالذكاء الاصطناعي لتمكين ممارسي الموارد البشرية من توظيف كلود في الأتمتة والتحليل.',
    descriptionEn: 'A practical AI-powered HR program that helps HR professionals leverage Claude to work smarter, faster, and more strategically.',
    featuresAr: [
      '6 جلسات تدريبية (12 ساعة تدريبية)',
      'شهادة إتمام معتمدة من HR Navigator',
      '8 محاور تطبيقية للذكاء الاصطناعي في HR'
    ],
    featuresEn: [
      '6 Sessions (12 Training Hours)',
      'Official Certificate of Completion',
      '8 Applied AI in HR Modules'
    ],
    badgeAr: 'ذكاء اصطناعي في HR',
    badgeEn: 'AI in HR',
    available: true,
    courseDetails: {
      sessionsCount: 6,
      trainingHours: 12,
      certificateTitleAr: 'شهادة إتمام معتمدة - تطبيقات الذكاء الاصطناعي وكلود في الموارد البشرية (Claude for HR)',
      certificateTitleEn: 'Certified Claude AI for HR Practitioner - HR Navigator Consultations',
      investmentEgp: 3750,
      studentPriceEgp: 2062,
      targetAudienceAr: [
        'مديرو وأخصائيو الموارد البشرية الراغبون في توفير عشرات الساعات أسبوعياً',
        'مسؤولو التوظيف والتدريب والعمليات الباحثون عن أتمتة المهام الروتينية',
        'قادة الموارد البشرية الراغبون في بناء استراتيجيات مدعومة بالبيانات والذكاء الاصطناعي'
      ],
      targetAudienceEn: [
        'HR managers and generalists looking to automate workflows and save time',
        'Recruiters and talent acquisition teams seeking AI screening tools',
        'HR leaders looking to leverage AI for data analytics and strategy'
      ],
      learningOutcomesAr: [
        'إتقان صياغة الأوامر الهندسية (Prompt Engineering) التخصصية لمهام HR',
        'استخدام Claude لصياغة بطاقات الوصف الوظيفي وأسئلة المقابلات المخصصة',
        'تحليل السير الذاتية ومطابقتها مع متطلبات الوظيفة بدقة عالية وبحيادية',
        'أتمتة صياغة لوائح العمل والسياسات الداخلية ورسائل التواصل المؤسسي',
        'تحليل بيانات الموظفين واستخراج تقارير ذكية واستشرافية في ثوانٍ'
      ],
      learningOutcomesEn: [
        'Master expert HR prompt engineering methodologies with Claude',
        'Generate precision job descriptions and tailored interview rubrics',
        'Perform advanced resume screening and candidate matching',
        'Draft robust HR policies, employee handbooks, and announcements instantly',
        'Conduct AI-driven workforce sentiment and people analytics'
      ],
      modules: [
        {
          number: 1,
          titleAr: 'Module 1: AI Foundations for Modern HR',
          titleEn: 'AI Foundations for Modern HR',
          descriptionAr: 'مقدمة في الذكاء الاصطناعي التوليدي، أخلاقيات الاستخدام، وحماية سرية بيانات الموظفين.'
        },
        {
          number: 2,
          titleAr: 'Module 2: Claude Prompt Mastery for HR',
          titleEn: 'Claude Prompt Mastery for HR',
          descriptionAr: 'تقنيات هندسة الأوامر المتقدمة، استخدام الـ Roles والـ Context والسياق الدقيق.'
        },
        {
          number: 3,
          titleAr: 'Module 3: AI-Powered Talent Acquisition',
          titleEn: 'AI-Powered Talent Acquisition',
          descriptionAr: 'كتابة إعلانات الوظائف الجذابة، فحص الـ CVs، وتوليد بطاقات الجدارات في لحظات.'
        },
        {
          number: 4,
          titleAr: 'Module 4: Intelligent Interviewing & Talent Selection',
          titleEn: 'Intelligent Interviewing & Talent Selection',
          descriptionAr: 'تصميم أسئلة المقابلات السلوكية والمواقفية ومحاكاة المقابلات واختبارات التقييم.'
        },
        {
          number: 5,
          titleAr: 'Module 5: Performance Management & Appraisal Generation',
          titleEn: 'Performance Management & Appraisal Generation',
          descriptionAr: 'صياغة أهداف OKRs و KPIs، كتابة الفيدباك الإيجابي والتقويمي، وتحليل التقييمات.'
        },
        {
          number: 6,
          titleAr: 'Module 6: HR Operations & Employee Relations',
          titleEn: 'HR Operations & Employee Relations',
          descriptionAr: 'صياغة الخطابات الرسمية، اللوائح، خطط الـ Onboarding، وحل النزاعات الودية.'
        },
        {
          number: 7,
          titleAr: 'Module 7: People Analytics & AI-Driven Insights',
          titleEn: 'People Analytics & AI-Driven Insights',
          descriptionAr: 'تحليل استبيانات الرضا الوظيفي، نسب الدوران، وتلخيص المقترحات والشكاوى.'
        },
        {
          number: 8,
          titleAr: 'Module 8: Strategic HR Transformation with Claude',
          titleEn: 'Strategic HR Transformation with Claude',
          descriptionAr: 'بناء خطط التعاقب، تحويل دور الـ HR إلى شريك أعمال استراتيجي بالذكاء الاصطناعي.'
        }
      ],
      studentDiscount: {
        available: true,
        studentPriceEgp: 2062,
        standardPriceEgp: 3750,
        discountNoteAr: 'خصم خاص لطلبة الجامعات عند تقديم كارنيه الجامعة ساري الصلاحية.',
        discountNoteEn: 'Special student discount with valid student ID card upload.',
        idCardRequired: true
      },
      deliveryFormatAr: 'ورش عمل تطبيقية مباشرة عبر Zoom + مكتبة برومبتات جاهزة + تسجيلات كاملة',
      deliveryFormatEn: 'Live practical Zoom workshops + prompt library + lifetime recordings',
      toolsUsedAr: ['حسابات Claude التوليدية', 'مكتبة تضم أكثر من 100 برومبت HR جاهز', 'نماذج تحليل البيانات']
    }
  },
  {
    id: 'srv-trn-odf-04',
    sku: 'HRN-TRN-ODF-04',
    titleAr: 'OD Fundamentals (أساسيات التطوير التنظيمي)',
    titleEn: 'OD Fundamentals',
    categoryAr: 'البرامج التدريبية',
    categoryEn: 'Training Programs',
    serviceType: 'training',
    price: 5000,
    exactPrices: { EGP: 5000, SAR: 379, USD: 104, AED: 379 },
    studentDiscountPrice: 2750,
    exactStudentPrices: { EGP: 2750, SAR: 208, USD: 57, AED: 208 },
    pricePrefixAr: 'الاستثمار:',
    pricePrefixEn: 'Investment:',
    singleLineOutcomeAr: 'مدخل عملي لأساسيات التطوير التنظيمي ودوره في بناء مؤسسات فعالة ومرنة قادرة على النمو.',
    singleLineOutcomeEn: 'A practical introduction to the fundamentals of Organizational Development and its role in building effective organizations.',
    keyDeliverablesAr: [
      '6 جلسات تدريبية متخصصة (12 ساعة تدريبية معتمدة)',
      'شهادة إتمام معتمدة من HR Navigator Consultations',
      'تطبيقات ونماذج عملية في التشخيص التنظيمي وإعادة الهيكلة وإدارة التغيير'
    ],
    keyDeliverablesEn: [
      '6 Specialized Sessions (12 Accredited Training Hours)',
      'Official Certificate of Completion from HR Navigator Consultations',
      'Practical tools for diagnostic assessment, restructuring, and change management'
    ],
    estimatedDurationAr: '6 جلسات (12 ساعة تدريبية)',
    estimatedDurationEn: '6 Sessions (12 Training Hours)',
    primaryActionType: 'instant_enroll',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80',
    descriptionAr: 'برنامج متخصص لتعلم منهجيات التطوير التنظيمي والتشخيص المؤسسي وبناء الهياكل وإدارة التغيير.',
    descriptionEn: 'A practical introduction to the fundamentals of Organizational Development and its role in building effective organizations.',
    featuresAr: [
      '6 جلسات تدريبية (12 ساعة تدريبية)',
      'شهادة إتمام معتمدة من HR Navigator',
      'تطبيقات على التشخيص وإعادة الهيكلة'
    ],
    featuresEn: [
      '6 Sessions (12 Training Hours)',
      'Official Certificate of Completion',
      'Hands-on diagnosis & restructuring cases'
    ],
    badgeAr: 'تطوير تنظيمي تطبيقي',
    badgeEn: 'Applied OD',
    available: true,
    courseDetails: {
      sessionsCount: 6,
      trainingHours: 12,
      certificateTitleAr: 'شهادة إتمام معتمدة - أساسيات التطوير التنظيمي (OD Fundamentals)',
      certificateTitleEn: 'Certified OD Fundamentals Professional - HR Navigator Consultations',
      investmentEgp: 5000,
      studentPriceEgp: 2750,
      targetAudienceAr: [
        'ممارسو الموارد البشرية الراغبون في التخصص بمجال التطوير التنظيمي OD',
        'مديرو التطوير والتميز المؤسسي وأخصائيو الهيكلة والحوكمة',
        'الاستشاريون الداخليون وقادة التغيير في المؤسسات الساعية للتحول'
      ],
      targetAudienceEn: [
        'HR practitioners wanting to specialize in Organizational Development',
        'Organizational excellence managers, restructuring and governance analysts',
        'Internal consultants and change leaders in transforming organizations'
      ],
      learningOutcomesAr: [
        'استيعاب الفارق الجوهري بين إدارة الموارد البشرية والتطوير التنظيمي OD',
        'إتقان أدوات التشخيص المؤسسي (Weisbord, McKinsey 7S, Nadler-Tushman)',
        'تصميم وتحديث الهياكل التنظيمية ومصفوفات الصلاحيات وبطاقات الوصف',
        'قيادة برامج إدارة التغيير المؤسسي والتعامل مع مقاومة التغيير بفاعلية',
        'قياس الأثر الحقيقي لتدخلات التطوير التنظيمي على كفاءة الأعمال والربحية'
      ],
      learningOutcomesEn: [
        'Differentiate strategic OD interventions from operational HR tasks',
        'Apply institutional diagnosis models (McKinsey 7S, Weisbord 6-Box, Nadler)',
        'Design agile organizational architectures and delegation frameworks',
        'Drive structured change initiatives and effectively manage resistance',
        'Quantify and measure the business impact and ROI of OD initiatives'
      ],
      modules: [
        {
          number: 1,
          titleAr: 'Fundamentals of Organizational Development (OD) & Systems Thinking',
          titleEn: 'Fundamentals of Organizational Development (OD) & Systems Thinking',
          descriptionAr: 'مفاهيم الـ OD، دور مستشار التطوير التنظيمي، والتفكير المنظومي داخل الشركات.'
        },
        {
          number: 2,
          titleAr: 'Organizational Diagnosis & Gap Analysis (التشخيص التنظيمي وتحليل الفجوات)',
          titleEn: 'Organizational Diagnosis & Gap Analysis',
          descriptionAr: 'جمع البيانات، المقابلات التشخيصية، نماذج 7S وتحليل جذور المشكلات المؤسسية.'
        },
        {
          number: 3,
          titleAr: 'Job Architecture & Organizational Structure Design (تصميم الهياكل والوظائف)',
          titleEn: 'Job Architecture & Organizational Structure Design',
          descriptionAr: 'أنواع الهياكل التنظيمية، تفادي التداخل الوظيفي، وتوزيع الصلاحيات والمسؤوليات.'
        },
        {
          number: 4,
          titleAr: 'Change Management & Culture Transformation (إدارة التغيير والتحول الثقافي)',
          titleEn: 'Change Management & Culture Transformation',
          descriptionAr: 'منهجيات كوتر وبروسكي في قيادة التغيير، وخطة التواصل وإشراك الموظفين.'
        },
        {
          number: 5,
          titleAr: 'Measuring OD Impact & Business Interventions (قياس أثر التدخلات التنظيمية)',
          titleEn: 'Measuring OD Impact & Business Interventions',
          descriptionAr: 'مؤشرات نجاح التطوير التنظيمي، تقييم فاعلية الهيكل الجديد، وضمان استدامة النتائج.'
        }
      ],
      studentDiscount: {
        available: true,
        studentPriceEgp: 2750,
        standardPriceEgp: 5000,
        discountNoteAr: 'خصم خاص لطلبة الجامعات عند تقديم كارنيه الجامعة ساري الصلاحية.',
        discountNoteEn: 'Special student discount with valid student ID card upload.',
        idCardRequired: true
      },
      deliveryFormatAr: 'جلسات تفاعلية مباشرة عبر Zoom + دراسات حالة تطبيقية + تسجيلات كاملة',
      deliveryFormatEn: 'Live interactive Zoom sessions + hands-on case studies + recordings',
      toolsUsedAr: ['نماذج تشخيص تنظيمي جاهزة', 'قوالب رسم الهياكل التنظيمية', 'مصفوفات قياس أثر التغيير']
    }
  }
];
