import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/translations';
import { getSiteUrl } from '@/lib/site-url';
import type { NewsArticlePublic } from '@/lib/news';
import type { JobPublic } from '@/lib/jobs';

export const ENTITY_KEYWORDS_EN = [
  'NIPPUR Pharma',
  'Nippur Pharma Iraq',
  'pharmaceutical manufacturer Iraq',
  'Baghdad pharmaceutical company',
  'GMP pharmaceutical manufacturing',
  'European GMP Iraq',
  'cephalosporin manufacturer',
  'cephalosporin capsules',
  'cephalosporin vials',
  'cephalosporin syrup',
  'eye drops manufacturer Iraq',
  'ampoules pharmaceutical Iraq',
  'Iraqi FDA certified manufacturer',
  'drug manufacturing Baghdad',
  'pharma partner Iraq',
];

export const ENTITY_KEYWORDS_AR = [
  'نيبور فارما',
  'شركة نيبور فارما',
  'تصنيع دوائي في العراق',
  'مصنع أدوية بغداد',
  'ممارسات التصنيع الجيد',
  'سيفالوسبورين',
  'كبسول سيفالوسبورين',
  'فيال سيفالوسبورين',
  'شراب سيفالوسبورين',
  'قطرات عينية',
  'أمبولات دوائية',
  'شركة أدوية عراقية',
  'تصنيع وفق معايير أوروبية',
  'شريك تصنيع دوائي',
];

const copy = {
  en: {
    title: "NIPPUR Pharma — Iraq's Next-Generation Pharmaceutical Manufacturer",
    description:
      'NIPPUR Pharma is a Baghdad-based pharmaceutical manufacturer delivering GMP-compliant cephalosporins, injectables, eye drops, and ampoules with European manufacturing standards for Iraq and regional partners.',
    ogTitle: "NIPPUR Pharma — Iraq's Pharmaceutical Manufacturer",
  },
  ar: {
    title: 'نيبور فارما — تصنيع دوائي من الجيل التالي في العراق',
    description:
      'نيبور فارما شركة تصنيع دوائي في بغداد تقدّم سيفالوسبورين وحقن وقطرات عينية وأمبولات وفق ممارسات التصنيع الجيد والمعايير الأوروبية للعراق وشركاء المنطقة.',
    ogTitle: 'نيبور فارما — تصنيع دوائي في العراق',
  },
};

export function buildRootMetadata(locale: Locale): Metadata {
  const site = getSiteUrl();
  const t = copy[locale];
  const ogImage = `${site}/images/factory-building.png`;
  const keywords = [...ENTITY_KEYWORDS_EN, ...ENTITY_KEYWORDS_AR];

  return {
    metadataBase: new URL(site),
    title: {
      default: t.title,
      template: '%s | NIPPUR Pharma',
    },
    description: t.description,
    keywords,
    authors: [{ name: 'NIPPUR Pharma', url: site }],
    creator: 'NIPPUR Pharma',
    publisher: 'NIPPUR Pharma',
    category: 'Pharmaceutical Manufacturing',
    applicationName: 'NIPPUR Pharma',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/',
        'ar-IQ': '/',
        'x-default': '/',
      },
      types: {
        'text/plain': '/llms.txt',
      },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.description,
      siteName: 'NIPPUR Pharma',
      type: 'website',
      locale: locale === 'ar' ? 'ar_IQ' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_IQ'],
      url: site,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'NIPPUR Pharma manufacturing facility in Baghdad, Iraq',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.ogTitle,
      description: t.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    other: {
      'ai-content': 'index',
    },
  };
}

export function buildNewsIndexMetadata(locale: Locale): Metadata {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? 'الأخبار والفعاليات' : 'News & Events';
  const description = isAr
    ? 'آخر أخبار نيبور فارما حول التصنيع الدوائي، شهادات ممارسات التصنيع الجيد، والشراكات في العراق والمنطقة.'
    : 'Latest NIPPUR Pharma news on GMP manufacturing, cephalosporin production, partnerships, and pharmaceutical developments in Iraq.';
  const ogImage = `${site}/images/factory-building.png`;

  return {
    title,
    description,
    keywords: [
      ...(isAr ? ENTITY_KEYWORDS_AR : ENTITY_KEYWORDS_EN),
      isAr ? 'أخبار نيبور فارما' : 'NIPPUR Pharma news',
    ],
    alternates: { canonical: '/news' },
    openGraph: {
      title: `${title} | NIPPUR Pharma`,
      description,
      url: `${site}/news`,
      type: 'website',
      siteName: 'NIPPUR Pharma',
      locale: isAr ? 'ar_IQ' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | NIPPUR Pharma`,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function buildNewsArticleMetadata(
  article: NewsArticlePublic,
  locale: Locale,
): Metadata {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? article.titleAr || article.titleEn : article.titleEn || article.titleAr;
  const description =
    (isAr ? article.excerptAr || article.excerptEn : article.excerptEn || article.excerptAr) ||
    copy[locale].description;
  const image = article.imageUrl
    ? article.imageUrl.startsWith('http')
      ? article.imageUrl
      : `${site}${article.imageUrl}`
    : `${site}/images/factory-building.png`;
  const url = `${site}/news/${article.slug}`;

  return {
    title,
    description,
    keywords: [
      title,
      article.category,
      'NIPPUR Pharma',
      'نيبور فارما',
      ...(isAr ? ENTITY_KEYWORDS_AR.slice(0, 6) : ENTITY_KEYWORDS_EN.slice(0, 6)),
    ],
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'NIPPUR Pharma',
      locale: isAr ? 'ar_IQ' : 'en_US',
      publishedTime: article.date || article.createdAt,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildCareersIndexMetadata(locale: Locale): Metadata {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? 'الوظائف' : 'Careers';
  const description = isAr
    ? 'انضم إلى فريق نيبور فارما في بغداد — وظائف في التصنيع الدوائي وضمان الجودة والبحث والتطوير.'
    : 'Join the NIPPUR Pharma team in Baghdad — open roles in pharmaceutical manufacturing, quality assurance, and R&D.';
  const ogImage = `${site}/images/factory-building.png`;

  return {
    title,
    description,
    keywords: [
      ...(isAr ? ENTITY_KEYWORDS_AR : ENTITY_KEYWORDS_EN),
      isAr ? 'وظائف نيبور فارما' : 'NIPPUR Pharma careers',
      isAr ? 'وظائف تصنيع دوائي العراق' : 'pharmaceutical jobs Iraq',
    ],
    alternates: { canonical: '/careers' },
    openGraph: {
      title: `${title} | NIPPUR Pharma`,
      description,
      url: `${site}/careers`,
      type: 'website',
      siteName: 'NIPPUR Pharma',
      locale: isAr ? 'ar_IQ' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | NIPPUR Pharma`,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function buildJobMetadata(job: JobPublic, locale: Locale): Metadata {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? job.titleAr || job.titleEn : job.titleEn || job.titleAr;
  const description =
    (isAr ? job.descriptionAr || job.descriptionEn : job.descriptionEn || job.descriptionAr) ||
    copy[locale].description;
  const url = `${site}/careers/${job.slug}`;
  const department = isAr
    ? job.departmentAr || job.departmentEn
    : job.departmentEn || job.departmentAr;

  return {
    title,
    description: description.slice(0, 160),
    keywords: [
      title,
      department,
      'NIPPUR Pharma',
      'نيبور فارما',
      job.location,
      ...(isAr ? ENTITY_KEYWORDS_AR.slice(0, 6) : ENTITY_KEYWORDS_EN.slice(0, 6)),
    ],
    alternates: { canonical: `/careers/${job.slug}` },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url,
      type: 'website',
      siteName: 'NIPPUR Pharma',
      locale: isAr ? 'ar_IQ' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description: description.slice(0, 160),
    },
  };
}

