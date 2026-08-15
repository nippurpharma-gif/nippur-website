import { getSiteUrl } from '@/lib/site-url';
import type { SiteSettings } from '@/store';

export function OrganizationJsonLd({ settings }: { settings: SiteSettings | null }) {
  const site = getSiteUrl();
  const name = settings?.companyNameEn || 'NIPPUR Pharma';
  const logo = settings?.logoUrl?.startsWith('http')
    ? settings.logoUrl
    : `${site}${settings?.logoUrl || '/images/logo-nippur.png'}`;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name,
    alternateName: settings?.companyNameAr || 'نيبور فارما',
    url: site,
    logo,
    email: settings?.email || undefined,
    telephone: settings?.phone || undefined,
    description: settings?.descriptionEn || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || 'Baghdad, Iraq',
      addressCountry: 'IQ',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
