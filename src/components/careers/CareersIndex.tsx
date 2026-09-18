'use client';

import Link from 'next/link';
import { MapPin, Clock, ArrowRight, GraduationCap } from 'lucide-react';
import { useAppStore } from '@/store';
import { SurfaceCard } from '@/components/ui/surface-card';
import type { JobPublic } from '@/lib/jobs';

export function CareersIndex({ jobs }: { jobs: JobPublic[] }) {
  const { t, locale } = useAppStore();
  const isAr = locale === 'ar';

  return (
    <div className="bg-background">
      <section className="border-b border-[rgba(10,37,68,0.06)] bg-gradient-to-b from-brand-50/80 to-background">
        <div className="site-container py-14 lg:py-20">
          <p className="text-sm font-medium text-brand-700 mb-3">{t.careers.badge}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink)] tracking-tight max-w-3xl">
            {t.careers.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
            {t.careers.subtitle}
          </p>
        </div>
      </section>

      <section className="site-container py-12 lg:py-16">
        {jobs.length === 0 ? (
          <p className="text-[var(--ink-secondary)] text-center py-16">
            {isAr ? 'لا توجد وظائف مفتوحة حالياً.' : 'No open positions at the moment.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => {
              const title = isAr ? job.titleAr || job.titleEn : job.titleEn || job.titleAr;
              const department = isAr
                ? job.departmentAr || job.departmentEn
                : job.departmentEn || job.departmentAr;
              const description = isAr
                ? job.descriptionAr || job.descriptionEn
                : job.descriptionEn || job.descriptionAr;
              return (
                <Link key={job.id} href={`/careers/${job.slug}`} className="group block h-full">
                  <SurfaceCard hover className="h-full p-6 sm:p-7 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className="inline-block text-[11px] font-semibold tracking-wide uppercase bg-brand-50 text-brand-700 px-2.5 py-1 rounded-md">
                        {department}
                      </span>
                      {job.experienceLevel ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--ink-tertiary)] shrink-0">
                          <GraduationCap className="size-3" />
                          {job.experienceLevel}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors mb-3">
                      {title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--ink-secondary)] mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-brand-600" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-brand-600" />
                        {job.type}
                      </span>
                    </div>
                    {description ? (
                      <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 flex-1 mb-6">
                        {description}
                      </p>
                    ) : (
                      <div className="flex-1 mb-6" />
                    )}
                    <div className="flex items-center gap-1.5 text-brand-700 text-sm font-semibold pt-4 border-t border-[rgba(10,37,68,0.06)] group-hover:gap-2.5 transition-all">
                      <span>{isAr ? 'عرض الوظيفة' : 'View role'}</span>
                      <ArrowRight className={`size-4 ${isAr ? 'rotate-180' : ''}`} />
                    </div>
                  </SurfaceCard>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
