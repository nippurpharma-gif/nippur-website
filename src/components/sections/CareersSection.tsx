'use client';

import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, CheckCircle, Briefcase, Loader2, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';

interface JobPosition {
  id: number;
  slug?: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  experienceLevel?: string;
  descriptionEn: string;
  descriptionAr: string;
  sortOrder: number;
  isActive: boolean;
}

const JobCard = memo(function JobCard({
  title,
  department,
  location,
  type,
  experienceLevel,
  description,
  viewLabel,
  href,
  isAr,
}: {
  title: string;
  department: string;
  location: string;
  type: string;
  experienceLevel?: string;
  description: string;
  viewLabel: string;
  href: string;
  isAr: boolean;
}) {
  return (
    <Link href={href} className="group block h-full">
      <SurfaceCard hover className="h-full p-6 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <span className="inline-block text-[11px] font-semibold tracking-wide uppercase bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md">
            {department}
          </span>
          {experienceLevel ? (
            <span className="text-[11px] font-medium text-[var(--ink-tertiary)] shrink-0">
              {experienceLevel}
            </span>
          ) : null}
        </div>

        <h3 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors mb-3">
          {title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--ink-secondary)] mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-brand-600" />
            {location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-brand-600" />
            {type}
          </span>
        </div>

        {description ? (
          <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 flex-1 mb-6">
            {description}
          </p>
        ) : (
          <div className="flex-1 mb-6" />
        )}

        <div className="mt-auto pt-4 border-t border-[rgba(10,37,68,0.06)] flex items-center justify-between gap-2 text-sm font-semibold text-brand-700">
          <span className="inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            {viewLabel}
            <ArrowRight className={`size-4 ${isAr ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </SurfaceCard>
    </Link>
  );
});

export function CareersSection({ initialJobs }: { initialJobs?: JobPosition[] }) {
  const { t, locale } = useAppStore();
  const isAr = locale === 'ar';
  const [jobs, setJobs] = useState<JobPosition[]>(
    () =>
      initialJobs
        ?.filter((job) => job.isActive === true)
        .sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
  );
  const [loading, setLoading] = useState(!initialJobs);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Failed to fetch jobs');
        const data: JobPosition[] = await res.json();
        setJobs(
          data
            .filter((job) => job.isActive === true)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    if (initialJobs) return;
    fetchJobs();
  }, [initialJobs]);

  const getTitle = (job: JobPosition) => (locale === 'ar' ? job.titleAr : job.titleEn);
  const getDepartment = (job: JobPosition) => (locale === 'ar' ? job.departmentAr : job.departmentEn);
  const getDescription = (job: JobPosition) => (locale === 'ar' ? job.descriptionAr : job.descriptionEn);

  const visibleJobs = jobs.slice(0, 4);

  return (
    <SectionWrapper
      id="careers"
      badge={t.careers.badge}
      title={t.careers.title}
      subtitle={t.careers.subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="size-8 animate-spin text-brand-600" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--ink-secondary)]">
              <Briefcase className="size-12 mb-4 opacity-30" />
              <p className="text-lg font-medium text-[var(--ink)]">
                {isAr ? 'لا توجد وظائف مفتوحة حالياً' : 'No open positions at the moment'}
              </p>
              <p className="text-sm mt-1 text-[var(--ink-secondary)]">
                {isAr ? 'يرجى المراجعة لاحقاً' : 'Please check back later'}
              </p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visibleJobs.map((job) =>
                job.slug ? (
                  <StaggerItem key={job.id}>
                    <JobCard
                      title={getTitle(job)}
                      department={getDepartment(job)}
                      location={job.location}
                      type={job.type}
                      experienceLevel={job.experienceLevel}
                      description={getDescription(job)}
                      viewLabel={isAr ? 'عرض الوظيفة' : 'View role'}
                      href={`/careers/${job.slug}`}
                      isAr={isAr}
                    />
                  </StaggerItem>
                ) : null,
              )}
            </StaggerContainer>
          )}
        </div>

        <div className="lg:col-span-1">
          <FadeIn delay={0.2}>
            <SurfaceCard className="sticky top-24 p-6 lg:p-8">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-6 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <CheckCircle className="size-5" />
                </div>
                {t.careers.benefits.title}
              </h3>
              <ul className="space-y-3.5">
                {t.careers.benefits.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-[var(--ink-secondary)]">
                    <CheckCircle className="size-4.5 text-brand-600 mt-0.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </FadeIn>
        </div>
      </div>

      {jobs.length > 0 && (
        <FadeIn className="mt-10 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="border-[rgba(10,37,68,0.12)] text-[var(--ink)] hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 rounded-full px-6"
          >
            <Link href="/careers">
              <Briefcase className="size-4 me-2" />
              {t.careers.allPositions}
            </Link>
          </Button>
        </FadeIn>
      )}
    </SectionWrapper>
  );
}
