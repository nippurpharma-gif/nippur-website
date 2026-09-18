import { SiteChrome } from '@/components/layout/SiteChrome';
import { CareersIndexJsonLd } from '@/components/seo/JsonLd';
import { CareersIndex } from '@/components/careers/CareersIndex';
import { getActiveJobs } from '@/lib/jobs';
import { buildCareersIndexMetadata } from '@/lib/seo';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, parseLocale } from '@/lib/locale';

export const revalidate = 120;

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return buildCareersIndexMetadata(locale);
}

export default async function CareersPage() {
  const jobs = await getActiveJobs();

  return (
    <SiteChrome>
      <CareersIndexJsonLd />
      <CareersIndex jobs={jobs} />
    </SiteChrome>
  );
}
