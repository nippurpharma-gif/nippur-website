import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/translations';
import { getSiteUrl } from '@/lib/site-url';

const copy = {
  en: {
    title: "NIPPUR Pharma — Iraq's Next-Generation Pharmaceutical Manufacturer",
    description:
      "NIPPUR Pharma combines Iraq's ancient legacy of healing with European GMP manufacturing to deliver world-class medicines.",
    ogTitle: "NIPPUR Pharma — Iraq's Pharmaceutical Manufacturer",
  },
  ar: {
    title: 'نيبور فارما — تصنيع دوائي من الجيل التالي في العراق',
    description:
      'تجمع نيبور فارما بين إرث العراق في العلاج وتقنيات التصنيع الأوروبية وفق ممارسات التصنيع الجيد لتقديم أدوية بمعايير عالمية.',
    ogTitle: 'نيبور فارما — تصنيع دوائي في العراق',
  },
};

export function buildRootMetadata(locale: Locale): Metadata {
  const site = getSiteUrl();
  const t = copy[locale];
  const ogImage = `${site}/images/factory-building.png`;

  return {
    metadataBase: new URL(site),
    title: t.title,
    description: t.description,
    keywords: [
      'NIPPUR Pharma',
      'نيبور فارما',
      'pharmaceutical',
      'Iraq',
      'GMP',
      'cephalosporin',
      'medicine',
      'manufacturing',
    ],
    authors: [{ name: 'NIPPUR Pharma' }],
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        ar: '/',
      },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.description,
      siteName: 'NIPPUR Pharma',
      type: 'website',
      locale: locale === 'ar' ? 'ar_IQ' : 'en_US',
      url: site,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: 'NIPPUR Pharma manufacturing facility',
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
    },
  };
}
