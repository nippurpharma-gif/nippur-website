export type Locale = 'en' | 'ar';

export const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      about: 'About',
      manufacturing: 'Manufacturing',
      products: 'Products',
      research: 'R&D',
      quality: 'Quality',
      sustainability: 'Sustainability',
      careers: 'Careers',
      news: 'News',
      contact: 'Contact',
      getQuote: 'Call Us',
    },

    // Hero
    hero: {
      brand: 'NIPPUR Pharma',
      badge: 'Iraq\'s Next-Generation Pharmaceutical Manufacturer',
      title: 'Advancing Healthcare Through',
      titleHighlight: 'Iraqi Innovation',
      subtitle: 'NIPPUR Pharma combines Iraq\'s ancient legacy of healing with cutting-edge European good manufacturing practice technology to deliver world-class pharmaceutical products.',
      cta1: 'Explore Our Products',
      cta2: 'Discover Our Facility',
      scrollLabel: 'Scroll',
      scrollHint: 'Scroll down',
    },

    // About
    about: {
      badge: 'About NIPPUR Pharma',
      title: 'Where Ancient Wisdom Meets Modern Pharmaceutical Science',
      description: 'Inspired by the ancient city of Nippur — one of the oldest centers of knowledge in Mesopotamia — NIPPUR Pharma represents a new era of pharmaceutical manufacturing in Iraq. We combine European technology with national expertise to produce medicines that meet the highest international standards.',
      vision: {
        title: 'Our Vision',
        text: 'To be a leading force in developing Iraq\'s pharmaceutical industry by producing high-quality medicines according to Iraqi and international standards, building a new generation of national pharmaceutical industries capable of competing regionally and globally.',
      },
      mission: {
        title: 'Our Mission',
        text: 'To provide safe, effective, and high-quality pharmaceutical products manufactured using the latest technologies and qualified personnel, contributing to improved healthcare and ensuring patients in Iraq have access to reliable and affordable medicines.',
      },
      values: {
        title: 'Our Values',
        items: [
          { title: 'Innovation', desc: 'Continuous investment in research, development, and cutting-edge manufacturing technology.' },
          { title: 'Quality', desc: 'Unwavering commitment to GMP standards and international quality protocols.' },
          { title: 'Integrity', desc: 'Transparent operations and ethical business practices in everything we do.' },
          { title: 'National Pride', desc: 'Building Iraqi manufacturing excellence that competes on the global stage.' },
        ],
      },
      addedValue: {
        title: 'Our Added Value',
        text: 'NIPPUR Pharma goes beyond manufacturing medicines. We are establishing a modern pharmaceutical industrial model that combines European technology, global quality, and local expertise — reinforcing the concept of "Iraqi Manufacturing with International Standards" and building trust in national products.',
      },
    },

    // Manufacturing
    manufacturing: {
      badge: 'Manufacturing Excellence',
      title: 'World-Class Pharmaceutical Manufacturing',
      subtitle: 'Our state-of-the-art facilities are designed and equipped according to the highest international GMP standards, featuring European machinery and advanced automation systems.',
      facilities: [
        {
          title: 'Cephalosporin Facility',
          desc: 'Dedicated production lines for oral and injectable cephalosporin formulations, with fully controlled environments to prevent cross-contamination.',
          icon: 'pill',
        },
        {
          title: 'Sterile Manufacturing',
          desc: 'Advanced aseptic processing area for the production of sterile pharmaceutical products including ampoules and eye drops.',
          icon: 'shield',
        },
        {
          title: 'General Formulation',
          desc: 'Versatile production facility for various pharmaceutical dosage forms with flexible manufacturing capabilities.',
          icon: 'flask',
        },
        {
          title: 'Utility Building',
          desc: 'Centralized utility systems including purified water, HVAC, clean steam, and compressed air supporting all manufacturing operations.',
          icon: 'settings',
        },
      ],
      capacity: {
        title: 'Production Capacity',
        items: [
          { label: 'Cephalosporins - syrup', value: '15M+', unit: 'items/year' },
          { label: 'Cephalosporins - Capsules', value: '100M+', unit: 'items/year' },
          { label: 'Injectable - vials', value: '20M+', unit: 'items/year' },
          { label: 'Injectable - Ampoules', value: '30M+', unit: 'items/year' },
          { label: 'Eye Drops', value: '15M+', unit: 'items/year' },
        ],
      },
    },

    // Products
    products: {
      badge: 'Product Portfolio',
      title: 'Pharmaceutical Solutions for Iraq\'s Healthcare',
      subtitle: 'We manufacture a comprehensive range of high-quality pharmaceutical products, from cephalosporin antibiotics to sterile formulations.',
      categories: ['All', 'Cephalosporins', 'Injectables', 'Ampoules', 'Eye Drops'],
      items: [
        {
          name: 'Cefalexin 500mg',
          category: 'Cephalosporins',
          form: 'Capsules',
          strength: '500mg',
          packaging: '10 capsules / box',
          desc: 'First-generation cephalosporin antibiotic for treating bacterial infections.',
        },
        {
          name: 'Ceftriaxone 1g',
          category: 'Injectables',
          form: 'Injection',
          strength: '1g',
          packaging: '1 vial / box',
          desc: 'Third-generation cephalosporin for severe bacterial infections.',
        },
        {
          name: 'Cefixime 400mg',
          category: 'Cephalosporins',
          form: 'Tablets',
          strength: '400mg',
          packaging: '10 tablets / box',
          desc: 'Oral cephalosporin for respiratory and urinary tract infections.',
        },
        {
          name: 'Ceftazidime 1g',
          category: 'Injectables',
          form: 'Injection',
          strength: '1g',
          packaging: '1 vial / box',
          desc: 'Third-generation cephalosporin effective against pseudomonas infections.',
        },
        {
          name: 'Chloramphenicol Eye Drops',
          category: 'Eye Drops',
          form: 'Eye Drops',
          strength: '0.5%',
          packaging: '10ml bottle',
          desc: 'Broad-spectrum antibiotic eye drops for treating ocular infections.',
        },
        {
          name: 'Diclofenac Sodium Ampoules',
          category: 'Ampoules',
          form: 'Ampoule',
          strength: '75mg/3ml',
          packaging: '5 ampoules / box',
          desc: 'Non-steroidal anti-inflammatory drug for pain management.',
        },
      ],
      viewDetails: 'View Details',
      downloadLeaflet: 'Download Leaflet',
      requestSample: 'Request Sample',
    },

    // Research
    research: {
      badge: 'Research & Development',
      title: 'Driving Pharmaceutical Innovation',
      subtitle: 'Our R&D department is dedicated to developing new formulations, improving existing products, and advancing pharmaceutical science in Iraq.',
      focusAreas: [
        {
          title: 'Formulation Development',
          desc: 'Creating optimized drug formulations with enhanced bioavailability and stability for the Iraqi market.',
          icon: 'beaker',
        },
        {
          title: 'Analytical Research',
          desc: 'Advanced analytical method development and validation using state-of-the-art equipment.',
          icon: 'microscope',
        },
        {
          title: 'Stability Studies',
          desc: 'Comprehensive stability testing programs to ensure product quality throughout shelf life.',
          icon: 'clock',
        },
        {
          title: 'Technology Transfer',
          desc: 'Partnering with international pharmaceutical companies to bring advanced technologies to Iraq.',
          icon: 'globe',
        },
      ],
      partnership: {
        title: 'Research Partnerships',
        text: 'We actively seek collaboration with universities, research institutions, and international pharmaceutical companies to advance pharmaceutical science and develop innovative solutions for Iraq\'s healthcare challenges.',
      },
    },

    // Quality
    quality: {
      badge: 'Quality Assurance',
      title: 'Uncompromising Quality Standards',
      subtitle: 'Our quality management system ensures every product meets the highest international pharmaceutical standards.',
      standards: [
        {
          num: '/01',
          title: 'GMP Compliance',
          desc: 'Full compliance with WHO and ICH GMP guidelines in all manufacturing operations, ensuring maximum safety, quality, and efficacy across every batch.',
          tags: ['WHO GMP Guidelines', 'ICH Q7-Q12 Standards', 'Iraqi FDA Certified'],
          image: '/images/quality-control.png',
          icon: 'shield-check',
        },
        {
          num: '/02',
          title: 'Quality Control Laboratory',
          desc: 'State-of-the-art QC laboratory equipped with HPLC, GC, UV-Vis spectrophotometry, and automated dissolution testing systems for material and release analysis.',
          tags: ['HPLC & GC Testing', 'Spectrophotometry', 'Dissolution Systems'],
          image: '/images/research-lab.png',
          icon: 'test',
        },
        {
          num: '/03',
          title: 'GLP Analytical Laboratory',
          desc: 'Good Laboratory Practice certified testing facilities providing reliable, fully traceable analytical results and stringent stability testing throughout the product lifecycle.',
          tags: ['Method Validation', 'Analytical Traceability', 'ISO Standards'],
          image: '/images/manufacturing-line.png',
          icon: 'flask',
        },
        {
          num: '/04',
          title: 'Validation & Environmental Safety',
          desc: 'Comprehensive validation programs covering HVAC cleanroom systems, manufacturing equipment, process qualification, and automated CIP/SIP protocols.',
          tags: ['Cleanroom ISO 5-8', 'Process Validation', 'Zero-Contamination'],
          image: '/images/factory-real.jpeg',
          icon: 'check-circle',
        },
      ],
      certifications: {
        title: 'Certifications & Compliance',
        items: [
          'WHO GMP Guidelines',
          'ICH Q7-Q12 Guidelines',
          'Iraqi FDA Standards',
          'ISO Quality Management',
          'Environmental Compliance',
          'Occupational Safety Standards',
        ],
      },
    },

    // Sustainability
    sustainability: {
      badge: 'Sustainability',
      title: 'Responsible Manufacturing for a Sustainable Future',
      subtitle: 'We are committed to minimizing our environmental impact while maximizing our positive contribution to Iraqi society.',
      pillars: [
        {
          title: 'Environmental Protection',
          desc: 'Advanced waste treatment systems, emissions control, and responsible disposal of pharmaceutical waste to protect Iraq\'s environment.',
          icon: 'leaf',
        },
        {
          title: 'Energy Efficiency',
          desc: 'Optimized energy consumption through modern HVAC systems, LED lighting, and energy-efficient manufacturing equipment.',
          icon: 'zap',
        },
        {
          title: 'Water Conservation',
          desc: 'Water recycling and purification systems to minimize water consumption and protect local water resources.',
          icon: 'droplets',
        },
        {
          title: 'Community Impact',
          desc: 'Investing in local communities through employment, training programs, health education, and support for medical research in Iraq.',
          icon: 'users',
        },
      ],
    },

    // Careers
    careers: {
      badge: 'Join Our Team',
      title: 'Build Your Career at NIPPUR Pharma',
      subtitle: 'Join Iraq\'s most advanced pharmaceutical manufacturer and be part of a team that\'s transforming the nation\'s healthcare industry.',
      benefits: {
        title: 'Why NIPPUR Pharma?',
        items: [
          'Competitive salary packages',
          'Professional development programs',
          'International training opportunities',
          'Modern working environment',
          'Health insurance coverage',
          'Career advancement paths',
        ],
      },
      apply: 'Apply Now',
      allPositions: 'View All Positions',
      submitCV: 'Submit Your CV',
    },

    // News
    news: {
      badge: 'Latest Updates',
      title: 'News & Events',
      subtitle: 'Stay informed about NIPPUR Pharma\'s latest developments, achievements, and industry participation.',
      items: [
        {
          date: 'Dec 2024',
          title: 'NIPPUR Pharma Receives GMP Certification',
          excerpt: 'We are proud to announce that our manufacturing facility has received full GMP certification from the Iraqi FDA, marking a significant milestone in our commitment to quality.',
          category: 'Achievement',
        },
        {
          date: 'Nov 2024',
          title: 'New Cephalosporin Production Line Inaugurated',
          excerpt: 'Our new state-of-the-art cephalosporin production line is now operational, significantly increasing our manufacturing capacity for essential antibiotics.',
          category: 'Manufacturing',
        },
        {
          date: 'Oct 2024',
          title: 'NIPPUR Pharma at Arab Health Exhibition',
          excerpt: 'NIPPUR Pharma showcased its products and manufacturing capabilities at the Arab Health Exhibition, connecting with international healthcare partners.',
          category: 'Events',
        },
      ],
      readMore: 'Read More',
      viewAll: 'View All News',
    },

    // Partners
    partners: {
      badge: 'Our Partners',
      title: 'Strategic Partnerships',
      subtitle: 'We collaborate with leading international pharmaceutical companies and organizations to deliver excellence.',
    },

    // Contact
    contact: {
      badge: 'Get in Touch',
      title: 'Contact NIPPUR Pharma',
      subtitle: 'Whether you\'re a healthcare provider, distributor, investor, or potential partner — we\'d love to hear from you.',
      form: {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        company: 'Company / Organization',
        subject: 'Subject',
        inquiry: 'Type of Inquiry',
        inquiryOptions: [
          'General Inquiry',
          'Product Information',
          'Partnership',
          'Distribution',
          'Investment',
          'Careers',
          'Media',
          'Other',
        ],
        message: 'Your Message',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Thank you! Your message has been sent successfully.',
        error: 'Something went wrong. Please try again.',
      },
      info: {
        headquarters: 'Headquarters',
        address: 'Baghdad, Iraq',
        email: 'E-mail',
        phone: 'Phone',
        workingHours: 'Working Hours',
        hours: 'Sunday - Thursday: 8:00 AM - 5:00 PM',
      },
    },

    // Stats
    stats: {
      badge: 'About Us',
      statement:
        'We are a pharmaceutical manufacturer focused on crafting safe, intentional medicines that balance Iraqi heritage, European good manufacturing practice, and everyday patient care.',
    },

    // Footer
    footer: {
      description: 'NIPPUR Pharma — Iraq\'s next-generation pharmaceutical manufacturer, combining ancient Mesopotamian heritage with cutting-edge European GMP technology.',
      quickLinks: 'Quick Links',
      products: 'Products',
      company: 'Company',
      support: 'Support',
      about: 'About Us',
      manufacturing: 'Manufacturing',
      careers: 'Careers',
      contact: 'Contact Us',
      news: 'News',
      quality: 'Quality',
      faq: 'FAQ',
      research: 'R&D',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      sitemap: 'Sitemap',
      newsletter: 'Newsletter',
      newsletterDesc: 'Subscribe to receive updates about our products and company news.',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      copyright: '© 2026 NIPPUR Pharma. All rights reserved.',
      tagline: 'Iraqi Manufacturing with International Standards',
    },

    // CTA
    cta: {
      badge: 'Partner with Us',
      title: 'Ready to Partner with Iraq\'s Leading Pharma Manufacturer?',
      subtitle: 'Whether you\'re looking for high-quality pharmaceutical products, distribution partnerships, or investment opportunities — NIPPUR Pharma is your trusted partner.',
      contact: 'Contact Us',
      products: 'View Products',
    },
  },
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      about: 'عن الشركة',
      manufacturing: 'التصنيع',
      products: 'المنتجات',
      research: 'البحث والتطوير',
      quality: 'الجودة',
      sustainability: 'الاستدامة',
      careers: 'الوظائف',
      news: 'الأخبار',
      contact: 'اتصل بنا',
      getQuote: 'اتصل بنا',
    },

    // Hero
    hero: {
      brand: 'نيبور فارما',
      badge: 'أحدث شركة تصنيع دوائي في العراق',
      title: 'نرتقي بالرعاية الصحية عبر الابتكار العراقي',
      titleHighlight: '',
      subtitle: 'تجمع نيبور فارما بين إرث العراق العريق في العلاج وتقنيات التصنيع الأوروبية الحديثة المطابقة لمعايير ممارسات التصنيع الجيد، لتقديم منتجات دوائية عالمية المستوى.',
      cta1: 'استكشف منتجاتنا',
      cta2: 'اكتشف منشأتنا',
      scrollLabel: 'مرّر',
      scrollHint: 'مرّر للأسفل',
    },

    // About
    about: {
      badge: 'عن نيبور فارما',
      title: 'حيث يلتقي الحكم القديم بالعلوم الدوائية الحديثة',
      description: 'استُلهم اسم الشركة من مدينة نيبور إحدى أقدم مراكز المعرفة في بلاد الرافدين. تمثل نيبور فارما عصراً جديداً في صناعة الأدوية في العراق، حيث نجمع بين التكنولوجيا الأوروبية والخبرات الوطنية لإنتاج أدوية تلبي أعلى المعايير الدولية.',
      vision: {
        title: 'رؤيتنا',
        text: 'أن تكون إحدى الشركات الرائدة في تطوير الصناعة الدوائية العراقية من خلال إنتاج أدوية عالية الجودة وفق المعايير العراقية والعالمية، والمساهمة في بناء جيل جديد من الصناعات الدوائية الوطنية القادرة على المنافسة إقليمياً ودولياً.',
      },
      mission: {
        title: 'رسالتنا',
        text: 'تلتزم الشركة بتوفير منتجات دوائية آمنة وفعالة وذات جودة عالية، تُصنع باستخدام أحدث التقنيات والكوادر المؤهلة، مع الإسهام في تحسين مستوى الرعاية الصحية وضمان وصول المرضى في العراق إلى أدوية موثوقة وبأسعار مناسبة.',
      },
      values: {
        title: 'قيمنا',
        items: [
          { title: 'الابتكار', desc: 'الاستثمار المستمر في البحث والتطوير وتقنيات التصنيع الحديثة.' },
          { title: 'الجودة', desc: 'التزام لا يتزعزع بمعايير ممارسات التصنيع الجيد والبروتوكولات الدولية للجودة.' },
          { title: 'النزاهة', desc: 'عمليات شفافة وممارسات تجارية أخلاقية في كل ما نقوم به.' },
          { title: 'الفخر الوطني', desc: 'بناء التميز الصناعي العراقي الذي ينافس على الساحة العالمية.' },
        ],
      },
      addedValue: {
        title: 'قيمتنا المضافة',
        text: 'لا يقتصر دور نيبور فارما على تصنيع الأدوية، بل يتمثل في تأسيس نموذج صناعي دوائي حديث يجمع بين التكنولوجيا الأوروبية والجودة العالمية والخبرات المحلية، بما يرسخ مفهوم "صناعة عراقية بمعايير عالمية" ويعزز الثقة بالمنتج الوطني.',
      },
    },

    // Manufacturing
    manufacturing: {
      badge: 'التميز التصنيعي',
      title: 'تصنيع دوائي على مستوى عالمي',
      subtitle: 'منشآتنا مصممة ومجهزة وفقاً لأعلى معايير ممارسات التصنيع الجيد الدولية، مع معدات أوروبية متقدمة وأنظمة أتمتة حديثة.',
      facilities: [
        {
          title: 'منشأة السيفالوسبورين',
          desc: 'خطوط إنتاج مخصصة للمستحضرات السيفالوسبورينية الفموية والقابلة للحقن، مع بيئات مضبوطة بالكامل لمنع التلوث المتبادل.',
          icon: 'pill',
        },
        {
          title: 'التصنيع المعقم',
          desc: 'منطقة معالجة عقيمة متقدمة لإنتاج المستحضرات الدوائية المعقمة بما في ذلك الأمبولات والقطرات العينية.',
          icon: 'shield',
        },
        {
          title: 'التشكيل العام',
          desc: 'منشأة إنتاج متعددة الاستخدامات لمختلف الأشكال الصيدلانية مع قدرات تصنيع مرنة.',
          icon: 'flask',
        },
        {
          title: 'مبنى المرافق',
          desc: 'أنظمة مرافق مركزية تشمل الماء النقي والتكييف والبخار المعقم والهواء المضغوط.',
          icon: 'settings',
        },
      ],
      capacity: {
        title: 'القدرة الإنتاجية',
        items: [
          { label: 'سيفالوسبورين - شراب', value: '15M+', unit: 'وحدة/سنة' },
          { label: 'سيفالوسبورين - فيال', value: '20M+', unit: 'وحدة/سنة' },
          { label: 'سيفالوسبورين - كبسول', value: '100M+', unit: 'وحدة/سنة' },
          { label: 'أمبولات', value: '30M+', unit: 'وحدة/سنة' },
          { label: 'قطرات عينية', value: '15M+', unit: 'وحدة/سنة' },
        ],
      },
    },

    // Products
    products: {
      badge: 'محفظة المنتجات',
      title: 'حلول دوائية لرعاية العراق الصحية',
      subtitle: 'نصنع مجموعة شاملة من المنتجات الدوائية عالية الجودة، من مضادات السيفالوسبورين إلى المستحضرات المعقمة.',
      categories: ['الكل', 'سيفالوسبورين', 'حقن', 'أمبولات', 'قطرات عينية'],
      items: [
        {
          name: 'سيفالكسين 500 مجم',
          category: 'سيفالوسبورين',
          form: 'كبسولات',
          strength: '500 مجم',
          packaging: '10 كبسولات / علبة',
          desc: 'مضاد حيوي من الجيل الأول للسيفالوسبورين لعلاج العدوى البكتيرية.',
        },
        {
          name: 'سيفترياكسون 1 جم',
          category: 'حقن',
          form: 'حقن',
          strength: '1 جم',
          packaging: '1 قارورة / علبة',
          desc: 'مضاد حيوي من الجيل الثالث للعدوى البكتيرية الشديدة.',
        },
        {
          name: 'سيفيكسيم 400 مجم',
          category: 'سيفالوسبورين',
          form: 'أقراص',
          strength: '400 مجم',
          packaging: '10 أقراص / علبة',
          desc: 'سيفالوسبورين فموي لعدوى الجهاز التنفسي والمسالك البولية.',
        },
        {
          name: 'سيفتازيديم 1 جم',
          category: 'حقن',
          form: 'حقن',
          strength: '1 جم',
          packaging: '1 قارورة / علبة',
          desc: 'مضاد حيوي من الجيل الثالث فعال ضد عدوى السودوموناس.',
        },
        {
          name: 'قطرات كلورامفينيكول العينية',
          category: 'قطرات عينية',
          form: 'قطرات عينية',
          strength: '0.5%',
          packaging: '10 مل زجاجة',
          desc: 'قطرات عينية مضادة حيوية واسعة الطيف لعلاج العدوى العينية.',
        },
        {
          name: 'أمبولات ديكلوفيناك الصوديوم',
          category: 'أمبولات',
          form: 'أمبولة',
          strength: '75 مجم / 3 مل',
          packaging: '5 أمبولات / علبة',
          desc: 'مسكن ومضاد التهاب غير ستيرويدي لإدارة الألم.',
        },
      ],
      viewDetails: 'عرض التفاصيل',
      downloadLeaflet: 'تحميل النشرة',
      requestSample: 'طلب عينة',
    },

    // Research
    research: {
      badge: 'البحث والتطوير',
      title: 'قيادة الابتكار الدوائي',
      subtitle: 'مكرس قسم البحث والتطوير لتطوير التركيبات الجديدة وتحسين المنتجات الحالية وتقدم العلوم الصيدلانية في العراق.',
      focusAreas: [
        {
          title: 'تطوير التركيبات',
          desc: 'إنشاء تركيبات دوائية محسنة مع توافر حيوي واستقرار أعلى للسوق العراقي.',
          icon: 'beaker',
        },
        {
          title: 'البحث التحليلي',
          desc: 'تطوير وتحقق من طرق تحليلية متقدمة باستخدام أحدث المعدات.',
          icon: 'microscope',
        },
        {
          title: 'دراسات الثبات',
          desc: 'برامج شاملة لاختبار الثبات لضمان جودة المنتج طوال فترة الصلاحية.',
          icon: 'clock',
        },
        {
          title: 'نقل التكنولوجيا',
          desc: 'الشراكة مع شركات أدوية دولية لجلب التقنيات المتقدمة إلى العراق.',
          icon: 'globe',
        },
      ],
      partnership: {
        title: 'الشراكات البحثية',
        text: 'نسعى بنشاط للتعاون مع الجامعات ومؤسسات البحث والشركات الصيدلانية الدولية لتقدم العلوم الصيدلانية وتطوير حلول مبتكرة لتحديات الرعاية الصحية في العراق.',
      },
    },

    // Quality
    quality: {
      badge: 'ضمان الجودة',
      title: 'معايير جودة لا تقبل المساومة',
      subtitle: 'يضمن نظام إدارة الجودة لدينا أن كل منتج يلبي أعلى المعايير الدوائية الدولية.',
      standards: [
        {
          num: '/01',
          title: 'الامتثال لممارسات التصنيع الجيد (GMP)',
          desc: 'الامتثال الكامل لتعليمات منظمة الصحة العالمية وإرشادات ICH GMP في كافة عمليات التصنيع لضمان أعلى معايير السلامة والجودة والفاعلية الدوائية.',
          tags: ['إرشادات WHO GMP', 'معايير ICH Q7-Q12', 'اعتماد المؤسسة العامة للغذاء والدواء'],
          image: '/images/quality-control.png',
          icon: 'shield-check',
        },
        {
          num: '/02',
          title: 'مختبر رقابة الجودة (QC Lab)',
          desc: 'مختبر رقابة جودة متطور مجهز بأحدث أجهزة الكروماتوغرافيا (HPLC, GC) والمطيافية الضوئية وأنظمة التفكك والذوبان الآلية لفحص المواد والمنتجات النهائية.',
          tags: ['تحليل HPLC و GC', 'مطيافية الضوء UV-Vis', 'أنظمة اختبار الذوبان'],
          image: '/images/research-lab.png',
          icon: 'test',
        },
        {
          num: '/03',
          title: 'مختبر الممارسات المختبرية الجيدة (GLP)',
          desc: 'مرافق فحص واختبار معتمدة وفق معايير GLP توفر نتائج تحليلية موثوقة وموثقة مع برامج دراسات ثبات الدواء على مدار فترة الصلاحية.',
          tags: ['التحقق من الطرق التحليلية', 'الموثوقية والتوثيق', 'معايير الجودة الدولية ISO'],
          image: '/images/manufacturing-line.png',
          icon: 'flask',
        },
        {
          num: '/04',
          title: 'التثبت والسلامة البيئية',
          desc: 'برامج تثبت لمعايرة خطوط الإنتاج وأنظمة الغرف النظيفة (HVAC) وبروتوكولات التعقيم والتنظيف الآلي للحد التام من أي تلوث متقاطع.',
          tags: ['غرف نظيفة ISO 5-8', 'التثبت من العمليات', 'بروتوكولات منع التلوث'],
          image: '/images/factory-real.jpeg',
          icon: 'check-circle',
        },
      ],
      certifications: {
        title: 'الشهادات والامتثال العالمي',
        items: [
          'إرشادات منظمة الصحة العالمية (WHO GMP)',
          'إرشادات ICH Q7-Q12',
          'معايير المؤسسة العامة للغذاء والدواء العراقية',
          'إدارة الجودة ISO 9001',
          'الامتثال والسلامة البيئية',
          'معايير السلامة والصحة المهنية',
        ],
      },
    },

    // Sustainability
    sustainability: {
      badge: 'الاستدامة',
      title: 'تصنيع مسؤول لمستقبل مستدام',
      subtitle: 'نلتزم بتقليل تأثيرنا البيئي مع تعظيم إسهامنا الإيجابي في المجتمع العراقي.',
      pillars: [
        {
          title: 'حماية البيئة',
          desc: 'أنظمة متقدمة لمعالجة النفايات والتحكم بالانبعاثات والتخلص المسؤول من النفايات الدوائية.',
          icon: 'leaf',
        },
        {
          title: 'كفاءة الطاقة',
          desc: 'استهلاك محسن للطاقة من خلال أنظمة تكييف حديثة وإضاءة LED ومعدات تصنيع موفرة للطاقة.',
          icon: 'zap',
        },
        {
          title: 'حفظ المياه',
          desc: 'أنظمة إعادة تدوير وتنقية المياه لتقليل الاستهلاك وحماية الموارد المائية المحلية.',
          icon: 'droplets',
        },
        {
          title: 'التأثير المجتمعي',
          desc: 'الاستثمار في المجتمعات المحلية من خلال التوظيف وبرامج التدريب والتثقيف الصحي.',
          icon: 'users',
        },
      ],
    },

    // Careers
    careers: {
      badge: 'انضم لفريقنا',
      title: 'ابنِ مسارك المهني في نيبور فارما',
      subtitle: 'انضم لأحدث شركة تصنيع دوائي في العراق وكن جزءاً من فريق يحوّل صناعة الرعاية الصحية في البلاد.',
      benefits: {
        title: 'لماذا نيبور فارما؟',
        items: [
          'رواتب تنافسية',
          'برامج تطوير مهني',
          'فرص تدريب دولية',
          'بيئة عمل حديثة',
          'تغطية تأمين صحي',
          'مسارات ترقية مهنية',
        ],
      },
      apply: 'قدّم الآن',
      allPositions: 'عرض جميع الوظائف',
      submitCV: 'أرسل سيرتك الذاتية',
    },

    // News
    news: {
      badge: 'آخر التحديثات',
      title: 'الأخبار والفعاليات',
      subtitle: 'ابقَ على اطلاع بأحدث تطورات إنجازات نيبور فارما ومشاركتها الصناعية.',
      items: [
        {
          date: 'ديسمبر 2024',
          title: 'نيبور فارما تحصل على شهادة ممارسات التصنيع الجيد',
          excerpt: 'نفخر بالإعلان عن حصول منشأة التصنيع لدينا على شهادة كاملة لممارسات التصنيع الجيد من هيئة الدواء العراقية، وهو إنجاز مهم في التزامنا بالجودة.',
          category: 'إنجاز',
        },
        {
          date: 'نوفمبر 2024',
          title: 'افتتاح خط إنتاج سيفالوسبورين الجديد',
          excerpt: 'خط إنتاج السيفالوسبورين الجديد المتطور أصبح الآن تشغيلياً، مما يزيد بشكل كبير من قدرتنا التصنيعية للمضادات الحيوية الأساسية.',
          category: 'التصنيع',
        },
        {
          date: 'أكتوبر 2024',
          title: 'نيبور فارما في معرض الصحة العربية',
          excerpt: 'عرضت نيبور فارما منتجاتها وقدراتها التصنيعية في معرض الصحة العربية، وربطت علاقات مع شركاء رعاية صحية دوليين.',
          category: 'فعاليات',
        },
      ],
      readMore: 'اقرأ المزيد',
      viewAll: 'عرض جميع الأخبار',
    },

    // Partners
    partners: {
      badge: 'شركاؤنا',
      title: 'الشراكات الاستراتيجية',
      subtitle: 'نتعاون مع شركات ومنظمات صيدلانية دولية رائدة لتقديم التميز.',
    },

    // Contact
    contact: {
      badge: 'تواصل معنا',
      title: 'اتصل بنيبور فارما',
      subtitle: 'سواء كنت مقدم رعاية صحية أو موزعاً أو مستثمراً أو شريكاً محتملاً — نود أن نسمع منك.',
      form: {
        name: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        company: 'الشركة / المؤسسة',
        subject: 'الموضوع',
        inquiry: 'نوع الاستفسار',
        inquiryOptions: [
          'استفسار عام',
          'معلومات المنتج',
          'شراكة',
          'توزيع',
          'استثمار',
          'وظائف',
          'إعلام',
          'أخرى',
        ],
        message: 'رسالتك',
        submit: 'إرسال الرسالة',
        sending: 'جارِ الإرسال...',
        success: 'شكراً لك! تم إرسال رسالتك بنجاح.',
        error: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
      },
      info: {
        headquarters: 'المقر الرئيسي',
        address: 'العنوان',
        email: 'البريد الالكتروني',
        phone: 'رقم الهاتف',
        workingHours: 'ساعات العمل',
        hours: 'الأحد - الخميس: 8:00 ص - 5:00 م',
      },
    },

    // Stats
    stats: {
      badge: 'عن الشركة',
      statement:
        'نحن شركة تصنيع دوائي تركّز على إنتاج أدوية آمنة ومدروسة تجمع بين الإرث العراقي وممارسات التصنيع الجيد الأوروبية ورعاية المرضى اليومية.',
    },

    // Footer
    footer: {
      description: 'نيبور فارما — أحدث شركة تصنيع دوائي في العراق، تجمع بين إرث بلاد الرافدين العريق وتقنيات التصنيع الأوروبية الحديثة وفق ممارسات التصنيع الجيد.',
      quickLinks: 'روابط سريعة',
      products: 'المنتجات',
      company: 'الشركة',
      support: 'الدعم',
      about: 'عن الشركة',
      manufacturing: 'التصنيع',
      careers: 'الوظائف',
      contact: 'اتصل بنا',
      news: 'الأخبار',
      quality: 'الجودة',
      faq: 'الأسئلة الشائعة',
      research: 'البحث والتطوير',
      privacy: ' الخصوصية',
      terms: 'شروط الخدمة',
      sitemap: 'خريطة الموقع',
      newsletter: 'النشرة الإخبارية',
      newsletterDesc: 'اشترك لتلقي التحديثات حول منتجاتنا وأخبار الشركة.',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      subscribe: 'اشتراك',
      copyright: '© 2026 نيبور فارما. جميع الحقوق محفوظة.',
      tagline: 'صناعة عراقية بمعايير عالمية',
    },

    // CTA
    cta: {
      badge: 'شراكة معنا',
      title: 'هل أنت مستعد للشراكة مع أبرز شركة تصنيع دوائي في العراق؟',
      subtitle: 'سواء كنت تبحث عن منتجات دوائية عالية الجودة أو شراكات توزيع أو فرص استثمارية — نيبور فارما هي شريكك الموثوق.',
      contact: 'اتصل بنا',
      products: 'عرض المنتجات',
    },
  },
} as const;

export type Translations = typeof translations.en;