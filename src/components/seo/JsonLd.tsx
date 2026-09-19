import { getSiteUrl } from '@/lib/site-url';
import type { SiteSettings } from '@/store';
import type { NewsArticlePublic } from '@/lib/news';
import type { JobPublic } from '@/lib/jobs';
import { ENTITY_KEYWORDS_EN } from '@/lib/seo';

function JsonLdScript({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({ settings }: { settings: SiteSettings | null }) {
  const site = getSiteUrl();
  const name = settings?.companyNameEn || 'NIPPUR Pharma';
  const logo = settings?.logoUrl?.startsWith('http')
    ? settings.logoUrl
    : `${site}${settings?.logoUrl || '/images/logo-nippur.png'}`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'MedicalOrganization'],
    name,
    alternateName: settings?.companyNameAr || 'نيبور فارما',
    legalName: name,
    url: site,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    image: `${site}/images/factory-building.png`,
    email: settings?.email || undefined,
    telephone: settings?.phone || undefined,
    description:
      settings?.descriptionEn ||
      'Pharmaceutical manufacturer in Baghdad, Iraq producing GMP-compliant cephalosporins and essential medicines with European manufacturing standards.',
    foundingLocation: {
      '@type': 'Place',
      name: 'Baghdad, Iraq',
    },
    areaServed: [
      { '@type': 'Country', name: 'Iraq' },
      { '@type': 'AdministrativeArea', name: 'Middle East' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'Baghdad, Iraq',
      addressLocality: 'Baghdad',
      addressCountry: 'IQ',
    },
    knowsAbout: ENTITY_KEYWORDS_EN,
    brand: {
      '@type': 'Brand',
      name: 'NIPPUR Pharma',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: settings?.email || undefined,
        telephone: settings?.phone || undefined,
        availableLanguage: ['English', 'Arabic'],
        areaServed: 'IQ',
      },
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    alternateName: 'نيبور فارما',
    url: site,
    inLanguage: ['en', 'ar'],
    publisher: { '@type': 'Organization', name, url: site },
    about: {
      '@type': 'Thing',
      name: 'Pharmaceutical manufacturing',
    },
  };

  return <JsonLdScript data={[organization, website]} />;
}

export function NewsArticleJsonLd({
  article,
  locale,
}: {
  article: NewsArticlePublic;
  locale: 'en' | 'ar';
}) {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? article.titleAr || article.titleEn : article.titleEn || article.titleAr;
  const description = isAr
    ? article.excerptAr || article.excerptEn
    : article.excerptEn || article.excerptAr;
  const image = article.imageUrl
    ? article.imageUrl.startsWith('http')
      ? article.imageUrl
      : `${site}${article.imageUrl}`
    : undefined;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    datePublished: article.date || article.createdAt,
    dateModified: article.createdAt,
    inLanguage: isAr ? 'ar' : 'en',
    articleSection: article.category,
    keywords: [title, article.category, 'NIPPUR Pharma', 'نيبور فارما'].join(', '),
    mainEntityOfPage: `${site}/news/${article.slug}`,
    image: image ? [image] : undefined,
    author: {
      '@type': 'Organization',
      name: 'NIPPUR Pharma',
      url: site,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NIPPUR Pharma',
      url: site,
      logo: {
        '@type': 'ImageObject',
        url: `${site}/images/logo-nippur.png`,
      },
    },
    about: {
      '@type': 'Thing',
      name: article.category,
    },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${site}/news` },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${site}/news/${article.slug}`,
      },
    ],
  };

  return <JsonLdScript data={[data, breadcrumb]} />;
}

export function NewsIndexJsonLd() {
  const site = getSiteUrl();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${site}/news` },
    ],
  };
  return <JsonLdScript data={breadcrumb} />;
}

export function CareersIndexJsonLd() {
  const site = getSiteUrl();
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: `${site}/careers` },
    ],
  };
  return <JsonLdScript data={breadcrumb} />;
}

export function JobPostingJsonLd({
  job,
  locale,
}: {
  job: JobPublic;
  locale: 'en' | 'ar';
}) {
  const site = getSiteUrl();
  const isAr = locale === 'ar';
  const title = isAr ? job.titleAr || job.titleEn : job.titleEn || job.titleAr;
  const description = isAr
    ? job.descriptionAr || job.descriptionEn
    : job.descriptionEn || job.descriptionAr;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title,
    description,
    datePosted: job.createdAt,
    employmentType: job.type,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'NIPPUR Pharma',
      sameAs: site,
      logo: `${site}/images/logo-nippur.png`,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Baghdad',
        addressCountry: 'IQ',
      },
    },
    url: `${site}/careers/${job.slug}`,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'Careers', item: `${site}/careers` },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${site}/careers/${job.slug}`,
      },
    ],
  };

  return <JsonLdScript data={[data, breadcrumb]} />;
}
