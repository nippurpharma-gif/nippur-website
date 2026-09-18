import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { JobPostingJsonLd } from '@/components/seo/JsonLd';
import { JobDetailView } from '@/components/careers/JobDetailView';
import { getAllActiveJobSlugs, getJobBySlug, getRelatedJobs } from '@/lib/jobs';
import { buildJobMetadata } from '@/lib/seo';
import { LOCALE_COOKIE, parseLocale } from '@/lib/locale';

export const revalidate = 120;

export async function generateStaticParams() {
  const slugs = await getAllActiveJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return buildJobMetadata(job, locale);
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const related = await getRelatedJobs(slug, job.departmentEn, 3);
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <SiteChrome>
      <JobPostingJsonLd job={job} locale={locale} />
      <JobDetailView job={job} related={related} />
    </SiteChrome>
  );
}
