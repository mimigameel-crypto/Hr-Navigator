export interface MagazineArticle {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  authorRoleAr: string;
  authorRoleEn: string;
  categoryAr: string;
  categoryEn: string;
  readTimeAr: string;
  readTimeEn: string;
  pageNumber: number;
  highlightAr: string;
  highlightEn: string;
  contentParagraphsAr: string[];
  contentParagraphsEn: string[];
  keyTakeawaysAr: string[];
  keyTakeawaysEn: string[];
}

export interface MagazineIssue {
  id: string;
  issueNumber: string;
  volume: string;
  releaseDateAr: string;
  releaseDateEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  themeColor: string;
  coverImage?: string;
  pdfUrl: string;
  directDownloadUrl?: string;
  pageCount: number;
  featured: boolean;
  editorialAr: {
    editorNameAr: string;
    editorRoleAr: string;
    messageAr: string;
  };
  editorialEn: {
    editorNameEn: string;
    editorRoleEn: string;
    messageEn: string;
  };
  stats: {
    readersCount: number;
    downloadsCount: number;
    sharesCount: number;
  };
  topicsAr: string[];
  topicsEn: string[];
  articles: MagazineArticle[];
}

export const MAGAZINE_ISSUES: MagazineIssue[] = [
  {
    id: 'issue-01',
    issueNumber: '01',
    volume: 'المجلد الأول • الربع الأول 2026',
    releaseDateAr: 'يناير 2026',
    releaseDateEn: 'January 2026',
    titleAr: 'التحول المؤسسي وحوكمة رأس المال البشري',
    titleEn: 'Institutional Transformation & Human Capital Governance',
    subtitleAr: 'المرجع التنفيذي لقادة الموارد البشرية والرؤساء التنفيذيين لصناعة التغيير المستدام',
    subtitleEn: 'The executive playbook for HR leaders and CEOs creating sustainable organizational change',
    themeColor: '#d4af37',
    pdfUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:51c1e71e-ce7b-42c2-b096-559afa41da50',
    pageCount: 36,
    featured: true,
    editorialAr: {
      editorNameAr: 'مستشارو HR Navigator',
      editorRoleAr: 'هيئة التحرير والاستشارات الاستراتيجية',
      messageAr: 'نضع بين أيديكم هذا العدد التأسيسي الأول من مجلة HR Navigator ليكون بوصلتكم العملية في قيادة منظمات رشيقة، عادلة، وقادرة على حماية وتنمية مواهبها المحورية وسط تسارع متطلبات السوق الإقليمي والعالمي.'
    },
    editorialEn: {
      editorNameEn: 'HR Navigator Advisory Board',
      editorRoleEn: 'Editorial & Strategic Consulting Board',
      messageEn: 'We are proud to present this foundational first issue of HR Navigator Magazine as your operational compass for driving agile, fair, and high-performing human capital frameworks.'
    },
    stats: {
      readersCount: 4280,
      downloadsCount: 1850,
      sharesCount: 620
    },
    topicsAr: [
      'استراتيجيات التحول المؤسسي 2026',
      'إدارة المواهب وتقليل الهدر الوظيفي',
      'حوكمة الرواتب وسلم الجدارات القيادية',
      'دليل المستشارين والتطبيقات التنفيذية'
    ],
    topicsEn: [
      'Institutional Transformation Strategies 2026',
      'Talent Retention & Workforce Optimization',
      'Salary Governance & Competency Frameworks',
      'Advisory Insights & Field Applications'
    ],
    articles: [
      {
        id: 'art-1-1',
        titleAr: 'إعادة هندسة الموارد البشرية: من إدارة شؤون الموظفين إلى شريك أعمال استراتيجي (HRBP)',
        titleEn: 'HR Re-engineering: Moving from Personnel Administration to Strategic Business Partner',
        authorAr: 'فريق الاستشارات المؤسسية',
        authorEn: 'Corporate Advisory Team',
        authorRoleAr: 'قطاع التطوير التنظيمي • HR Navigator',
        authorRoleEn: 'Org Development Practice • HR Navigator',
        categoryAr: 'التطوير التنظيمي',
        categoryEn: 'Org Development',
        readTimeAr: '6 دقائق قراءة',
        readTimeEn: '6 min read',
        pageNumber: 4,
        highlightAr: 'لم يعد قسم الموارد البشرية مركز تكلفة إداري، بل هو غرفة العمليات الحقيقية لتعظيم العائد على الاستثمار البشري (ROI on Human Capital).',
        highlightEn: 'HR is no longer an administrative cost center; it is the tactical command room driving ROI on human capital.',
        contentParagraphsAr: [
          'يشهد قطاع الأعمال اليوم تحولاً جذرياً في فلسفة إدارة الموظفين، حيث تبين الدراسات الميدانية أن أكثر من 70% من مبادرات التطوير المؤسسي تتعثر بسبب غياب المواءمة بين استراتيجية الموارد البشرية والأهداف المالية للشركة.',
          'التحول الناجح يبدأ بتفكيك البيروقراطية التقليدية، وإعادة صياغة أدوار مسؤولي الموارد البشرية ليكونوا شركاء أعمال (HR Business Partners) متواجدين في قلب العمليات التشغيلية، يقدمون الاستشارات اللحظية للمدراء التنفيذيين.',
          'تتضمن النماذج الحديثة التي تطبقها HR Navigator بناء مصفوفات واضحة للمساءلة، وحوكمة تدفق البيانات الوظيفية، وتمكين القيادات الوسطى من أدوات التقييم المستمر دون انتظار التقييم السنوي التقليدي.'
        ],
        contentParagraphsEn: [
          'Modern enterprises are undergoing a fundamental transformation where over 70% of organizational restructuring programs falter due to misalignment between HR strategy and financial milestones.',
          'Successful transformation starts by breaking down administrative red-tape, enabling HR Business Partners to operate right beside business units providing dynamic data-driven counsel.',
          'HR Navigator frameworks focus on building accountable role matrices, real-time feedback loops, and automated metric dashboards.'
        ],
        keyTakeawaysAr: [
          'ربط مؤشرات أداء الـ HR بنتائج الأعمال المباشرة وصافي الأرباح',
          'تحويل إدارة الموارد البشرية من رد الفعل إلى التنبؤ الاستباقي بالاحتياجات',
          'الاعتماد على لوحات تحكم ذكية ترصد تكلفة الاستبقاء ونسب الدوران الوظيفي'
        ],
        keyTakeawaysEn: [
          'Align HR KPIs directly with top-line growth and bottom-line profit',
          'Shift from reactive administration to predictive talent planning',
          'Deploy live intelligence dashboards tracking retention and turnover costs'
        ]
      },
      {
        id: 'art-1-2',
        titleAr: 'المعادلة الذهبية لهياكل الرواتب: التوازن الدقيق بين العدالة الداخلية والتنافسية السوقية',
        titleEn: 'The Compensation Formula: Balancing Internal Equity and Market Competitiveness',
        authorAr: 'خبراء التعويضات والبدلات',
        authorEn: 'Total Rewards Specialists',
        authorRoleAr: 'استشارات الرواتب والأجور • HR Navigator',
        authorRoleEn: 'Comp & Benefits Practice • HR Navigator',
        categoryAr: 'الرواتب والتعويضات',
        categoryEn: 'Comp & Benefits',
        readTimeAr: '8 دقائق قراءة',
        readTimeEn: '8 min read',
        pageNumber: 12,
        highlightAr: 'أفضل نظام رواتب هو الذي يشعر الموظف بعدالته وشفافيته، ويحمي الشركة من تسرب كفاءاتها الاستراتيجية إلى المنافسين.',
        highlightEn: 'The most effective compensation system delivers verifiable equity to staff while safeguarding vital talent from poaching.',
        contentParagraphsAr: [
          'يواجه أصحاب الشركات وقادة الـ HR دائماً التحدي الأصعب: كيف نضمن بقاء الرواتب جاذبة ومنافسة لأفضل الكفاءات في السوق دون إرهاق الميزانية التشغيلية ونسب السيولة في المنشأة؟',
          'العدالة الداخلية تعني أن كل وظيفة تُقيَّم بناءً على حجم أثرها وجداراتها المحددة (Job Evaluation via Point Factor Method)، بحيث لا يشعر أي موظف بأن راتبه يتأثر بالمحسوبية أو التقدير الشخصي.',
          'أما التنافسية السوقية فتتطلب مسحاً دورياً دقيقاً لسوق العمل الإقليمي (Salary Benchmarking)، وتصميم حزم مزايا متكاملة (Total Rewards) تشمل الحوافز المرتبطة بالأرباح والمكافآت قصيرة وطويلة الأجل.'
        ],
        contentParagraphsEn: [
          'Business owners face the eternal challenge: maintaining attractive market rates without overloading cash flow and operational payroll ratios.',
          'Internal equity requires objective point-factor job evaluation, removing bias and ensuring every grade accurately reflects organizational weight.',
          'External competitiveness leverages methodical regional benchmark surveys and holistic total rewards.'
        ],
        keyTakeawaysAr: [
          'تصميم سلم رواتب متدرج (Min - Mid - Max) مع نطاق انتشار مرن',
          'ربط الزيادات السنوية بمؤشرات الإنجاز الفردي والمؤسسي لا الأقدمية المجردة',
          'بناء حزم بدلات غير نقدية ترفع ارتباط الموظف ورضاه الوظيفي'
        ],
        keyTakeawaysEn: [
          'Establish progressive salary bands (Min - Mid - Max) with flexible spread',
          'Link merits to objective achievements rather than tenure alone',
          'Incorporate impactful non-cash benefits enhancing employee lifetime value'
        ]
      },
      {
        id: 'art-1-3',
        titleAr: 'إدارة وتقييم الأداء: لماذا فشلت التقييمات السنوية وما البديل العملي (OKRs & KPIs)؟',
        titleEn: 'Performance Leadership: Why Annual Appraisals Failed & How OKRs Deliver Agility',
        authorAr: 'مستشار تقييم الأداء المؤسسي',
        authorEn: 'Performance & OKR Consultant',
        authorRoleAr: 'قطاع الحوكمة وتطوير الأداء • HR Navigator',
        authorRoleEn: 'Governance & Performance • HR Navigator',
        categoryAr: 'تقييم الأداء',
        categoryEn: 'Performance & OKRs',
        readTimeAr: '7 دقائق قراءة',
        readTimeEn: '7 min read',
        pageNumber: 20,
        highlightAr: 'الموظفون لا يكرهون التقييم بذاته، بل يكرهون المفاجآت غير العادلة في نهاية العام. السر يكمن في جلسات التغذية الراجعة المستمرة.',
        highlightEn: 'Staff don’t dislike evaluation; they dislike year-end surprises. The remedy lies in agile continuous feedback.',
        contentParagraphsAr: [
          'تؤكد الدراسات أن أكثر من 85% من المدراء والموظفين يعتبرون التقييم السنوي التقليدي مضيعة للوقت لا تعكس الإنتاجية الفعلية على مدار 12 شهراً.',
          'الجيل الجديد من الشركات الناجحة يستبدل هذا النموذج البيروقراطي بمنظومة الأهداف والنتائج الرئيسية (OKRs) ربع السنوية، المقترنة بجلسات متابعة أسبوعية أو شهرية (1-on-1 Check-ins).',
          'هذا التحول يمنح الموظف وضوحاً كاملاً حول ما يُتوقع منه، ويسمح بتصحيح المسار فوراً في حال حدوث أي تعثر دون الانتظار حتى نهاية السنة المالية.'
        ],
        contentParagraphsEn: [
          'Over 85% of leaders view legacy annual reviews as ritualistic bureaucracy failing to reflect 12 months of daily impact.',
          'Leading organizations replace this with agile quarterly OKRs coupled with frequent constructive one-on-one reviews.',
          'Continuous feedback creates psychological safety and instant course-correction before missed deadlines impact client delivery.'
        ],
        keyTakeawaysAr: [
          'تحويل التقييم من محاكمة للموظف إلى جلسة تطوير وتمكين',
          'وضع أهداف طموحة وشفافة يراها الجميع في المنظمة',
          'فصل جلسات مراجعة الأداء عن جلسات مناقشة العلاوات والرواتب'
        ],
        keyTakeawaysEn: [
          'Transform evaluations into growth and empowerment conversations',
          'Cascade transparent OKRs visible across team tiers',
          'Decouple quarterly developmental feedback from compensation negotiations'
        ]
      },
      {
        id: 'art-1-4',
        titleAr: 'دليل المستشارين: الخطوات التنفيذية الـ 6 لبناء بيئة عمل خالية من الهدر الوظيفي',
        titleEn: 'The Consultant Playbook: 6 Tactical Steps to Eliminate Organizational Waste',
        authorAr: 'فريق خبراء استشارات الشركات',
        authorEn: 'Senior Consulting Practice',
        authorRoleAr: 'إدارة التحول التشغيلي • HR Navigator',
        authorRoleEn: 'Operational Transformation • HR Navigator',
        categoryAr: 'استشارات تنفيذية',
        categoryEn: 'Executive Advisory',
        readTimeAr: '9 دقائق قراءة',
        readTimeEn: '9 min read',
        pageNumber: 28,
        highlightAr: 'الهدر الوظيفي ليس فقط في الوقت الضائع، بل في المهام المزدوجة، الصلاحيات الغامضة، وتشتت الكفاءات في صراعات إدارية عقيمة.',
        highlightEn: 'Workforce waste is not merely lost hours; it manifests in overlapping mandates, ambiguous delegation, and role friction.',
        contentParagraphsAr: [
          'عندما ندخل أي منشأة لإجراء تدقيق تنظيمي، نكتشف عادة أن ما بين 20% إلى 35% من الوقت التشغيلي يُهدر في مهام لا تضيف أي قيمة مباشرة للمستفيد النهائي أو العملاء.',
          'الخطوات الست تبدأ بالتدقيق الوظيفي (Job Audit)، ورسم خريطة تدفق العمليات (Process Mapping)، وإلغاء الموافقات الزائدة، وتحديد المسؤوليات بمصفوفة RACI المعتمدة عالمياً.',
          'عند اكتمال هذا التطبيق، تشهد الشركات انخفاضاً مباشراً في تكاليف التشغيل بنسبة تصل إلى 28% مع ارتفاع ملحوظ في سرعة إنجاز المشروعات وسعادة الموظفين.'
        ],
        contentParagraphsEn: [
          'Operational audits frequently uncover that 20% to 35% of employee bandwidth is consumed by zero-value duplicate procedures.',
          'The 6-step roadmap executes comprehensive job audits, process flowcharts, approval streamlining, and RACI matrices.',
          'Completion yields up to 28% operational expenditure reduction alongside faster project turnaround and heightened job satisfaction.'
        ],
        keyTakeawaysAr: [
          'تطبيق مصفوفة RACI لإنهاء تداخل المسؤوليات والصلاحيات',
          'أتمتة طلبات الإجازات والموافقات الروتينية لتقليل الإرهاق الورقي',
          'تحديد بطاقات وصف وظيفي محددة تعتمد على النتائج لا الساعات'
        ],
        keyTakeawaysEn: [
          'Deploy RACI governance to eliminate ambiguous responsibility',
          'Automate administrative workflows and leave approvals',
          'Draft outcome-based job descriptions rather than attendance mandates'
        ]
      }
    ]
  },
  {
    id: 'issue-02',
    issueNumber: '02',
    volume: 'المجلد الثاني • الربع الثاني 2026',
    releaseDateAr: 'إبريل 2026',
    releaseDateEn: 'April 2026',
    titleAr: 'ذكاء الأعمال واستبقاء المواهب في عصر الذكاء الاصطناعي',
    titleEn: 'HR Analytics & Talent Retention in the AI Era',
    subtitleAr: 'كيف تستخدم الشركات الحديثة تحليلات البيانات والذكاء الاصطناعي لبناء فرق عمل متماسكة وذكية',
    subtitleEn: 'Harnessing workforce analytics and AI to build cohesive, high-retention enterprise teams',
    themeColor: '#3b82f6',
    pdfUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:51c1e71e-ce7b-42c2-b096-559afa41da50',
    pageCount: 42,
    featured: false,
    editorialAr: {
      editorNameAr: 'مستشارو HR Navigator',
      editorRoleAr: 'هيئة التحرير الاستشارية',
      messageAr: 'نركز في هذا العدد على الثورة الرقمية في قطاع رأس المال البشري، وكيف تحول المنظمات الرائدة لغة الأرقام والتنبؤات إلى قرارات استباقية تحمي المواهب وترفع الإنتاجية.'
    },
    editorialEn: {
      editorNameEn: 'HR Navigator Advisory Board',
      editorRoleEn: 'Advisory Editorial Board',
      messageEn: 'Focusing on workforce digitalization and predictive talent intelligence for agile decision-making.'
    },
    stats: {
      readersCount: 3120,
      downloadsCount: 1420,
      sharesCount: 410
    },
    topicsAr: [
      'تحليلات الموارد البشرية وتوقع الاستقالات',
      'تطبيقات الذكاء الاصطناعي في الفرز والاستقطاب',
      'بناء مسارات النمو الوظيفي البديلة للمواهب التقنية',
      'الاستثمار في رفاهية ورضا الموظفين والـ ROI'
    ],
    topicsEn: [
      'Predictive HR Analytics & Flight-Risk Modeling',
      'AI Applications in Talent Acquisition & Screening',
      'Alternative Career Ladders for Tech Talent',
      'Employee Well-being ROI & Productivity Metrics'
    ],
    articles: [
      {
        id: 'art-2-1',
        titleAr: 'تحليلات الموارد البشرية (People Analytics): كيف تتنبأ بالاستقالات قبل وقوعها بـ 90 يوماً؟',
        titleEn: 'People Analytics: Predicting Flight Risk 90 Days Before Resignation',
        authorAr: 'فريق ذكاء الأعمال والتحليلات',
        authorEn: 'BI & People Analytics Team',
        authorRoleAr: 'وحدة التحليلات المتقدمة • HR Navigator',
        authorRoleEn: 'People Analytics Unit • HR Navigator',
        categoryAr: 'تحليلات البيانات',
        categoryEn: 'People Analytics',
        readTimeAr: '7 دقائق قراءة',
        readTimeEn: '7 min read',
        pageNumber: 6,
        highlightAr: 'الموظف لا يقرر الاستقالة فجأة؛ هناك إشارات رقمية ونمطية واضحة تسبق تقديم الاستقالة بأسابيع إذا تم رصدها بدقة.',
        highlightEn: 'Resignations rarely happen overnight; unmistakable behavioral markers appear weeks in advance when properly tracked.',
        contentParagraphsAr: [
          'تعد تكلفة استبدال الموظف الكفء من أعلى التكاليف الخفية التي تستنزف أرباح الشركات، حيث تقدر بـ 6 إلى 9 أضعاف راتبه الشهري عند احتساب فترات التوظيف والتدريب وضياع الإنتاجية.',
          'الأنظمة التحليلية الحديثة تدرس مؤشرات مثل: تغير نمط الإجازات، تراجع المشاركة في الاجتماعات، انخفاض عدد ساعات التفاعل على المنصات الداخلية، والتغيرات في تقييمات التغذية الراجعة.',
          'التدخل الاستباقي من خلال جلسات الاستماع وتعديل المسار الوظيفي ينقذ أكثر من 65% من هذه المواهب المحورية ويضمن استقرار العمليات.'
        ],
        contentParagraphsEn: [
          'Replacing vital personnel costs between 6 to 9 months of salary in onboarding and lost business momentum.',
          'Predictive models examine leave patterns, communication dip, and peer interaction variations.',
          'Proactive leadership dialogues successfully retain over 65% of at-risk talent.'
        ],
        keyTakeawaysAr: [
          'تتبع مؤشرات الرضا الداخلي دورياً بشكل مجهول الهوية',
          'بناء خطط تعاقب وظيفي (Succession Planning) للمناصب الحرجة',
          'إجراء مقابلات البقاء (Stay Interviews) وليس فقط مقابلات الخروج'
        ],
        keyTakeawaysEn: [
          'Deploy quarterly anonymous pulse checks',
          'Maintain live succession pipelines for pivotal roles',
          'Conduct proactive Stay Interviews rather than just Exit Interviews'
        ]
      }
    ]
  },
  {
    id: 'issue-03',
    issueNumber: '03',
    volume: 'المجلد الثالث • الربع الثالث 2026',
    releaseDateAr: 'يوليو 2026',
    releaseDateEn: 'July 2026',
    titleAr: 'ثقافة المؤسسة والقيادة التكيفية في الأسواق التنافسية',
    titleEn: 'Adaptive Corporate Culture & High-Impact Leadership',
    subtitleAr: 'بناء بيئة عمل تجذب العقول وتصنع القادة وتضاعف الإنتاجية المستدامة',
    subtitleEn: 'Cultivating workplace ecosystems that magnetize elite talent and multiply productivity',
    themeColor: '#10b981',
    pdfUrl: 'https://acrobat.adobe.com/id/urn:aaid:sc:AP:51c1e71e-ce7b-42c2-b096-559afa41da50',
    pageCount: 38,
    featured: false,
    editorialAr: {
      editorNameAr: 'مستشارو HR Navigator',
      editorRoleAr: 'هيئة التحرير الاستشارية',
      messageAr: 'الثقافة المؤسسية هي ما يفعله الموظفون عندما لا يكون المدير حاضراً. في هذا العدد نوضح كيف تحول القيم المكتوبة إلى ممارسات يومية تصنع الفارق التنافسي.'
    },
    editorialEn: {
      editorNameEn: 'HR Navigator Advisory Board',
      editorRoleEn: 'Advisory Editorial Board',
      messageEn: 'Corporate culture is what team members execute when nobody is watching. Turning core values into daily operational habits.'
    },
    stats: {
      readersCount: 2890,
      downloadsCount: 1180,
      sharesCount: 350
    },
    topicsAr: [
      'صياغة ميثاق السلوك والقيم المؤسسية القابلة للقياس',
      'القيادة التكيفية وإدارة الأزمات في بيئة متقلبة',
      'حوكمة بيئات العمل الهجينة وعن بُعد',
      'تجارب ناجحة في تقليل الصراعات بين الإدارات'
    ],
    topicsEn: [
      'Translating Values into Measurable Behaviors',
      'Adaptive Leadership in Volatile Markets',
      'Hybrid & Remote Workplace Governance',
      'Eliminating Interdepartmental Friction'
    ],
    articles: [
      {
        id: 'art-3-1',
        titleAr: 'الثقافة المؤسسية كأصل رأسمالي: كيف تحول الشعارات الجدارية إلى سلوكيات يومية؟',
        titleEn: 'Culture as a Capital Asset: Translating Wall Posters into Daily Habits',
        authorAr: 'فريق القيادة والثقافة المؤسسية',
        authorEn: 'Leadership & Culture Practice',
        authorRoleAr: 'استشارات القيادة • HR Navigator',
        authorRoleEn: 'Leadership Practice • HR Navigator',
        categoryAr: 'الثقافة والقيادة',
        categoryEn: 'Culture & Leadership',
        readTimeAr: '6 دقائق قراءة',
        readTimeEn: '6 min read',
        pageNumber: 8,
        highlightAr: 'المنظمات لا تفشل بسبب نقص الأفكار العبقرية، بل بسبب غياب ثقافة المساءلة والاحترام المتبادل التي تمكن الأفكار من النجاح.',
        highlightEn: 'Enterprises rarely fail from lack of genius ideas; they fail from an absence of accountability and shared psychological safety.',
        contentParagraphsAr: [
          'يصرف العديد من الشركات مبالغ طائلة لصياغة قيم مكتوبة مثل "النزاهة، الإتقان، الشفافية"، ولكنها تظل حبراً على ورق إذا لم تُربط بتقييم الأداء والمكافآت والترقيات.',
          'الشركات الرائدة تضع تعريفاً سلوكياً دقيقاً لكل قيمة، وتكافئ الموظفين الذين يجسدونها علناً، وتتعامل بحزم مع أي سلوك يتناقض معها حتى لو صدر من أفضل موظف في المبيعات.',
          'تطبيق هذه المنهجية يخلق بيئة عمل صحية تقل فيها الشائعات والصراعات الداخلية وتتضاعف فيها الرغبة في الابتكار والتعاون.'
        ],
        contentParagraphsEn: [
          'Companies spend fortunes drafting core values, yet they remain hollow unless linked directly to promotions and compensations.',
          'Leading firms define distinct behaviors for each value and publicly celebrate exemplary conduct.',
          'This rigor eradicates toxic office politics and cultivates authentic collaboration.'
        ],
        keyTakeawaysAr: [
          'ربط القيم المؤسسية ببنود تقييم الجدارات السنوية',
          'تدريب المدراء على القيادة بالقدوة والتغذية الراجعة البناءة',
          'الاحتفاء بقصص النجاح التي تجسد قيم الشركة أمام الجميع'
        ],
        keyTakeawaysEn: [
          'Incorporate core values into competency rubrics',
          'Train leaders to coach through behavioral examples',
          'Publicly amplify success stories embodying cultural principles'
        ]
      }
    ]
  }
];
