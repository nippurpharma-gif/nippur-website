'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ArrowLeft, ArrowRight, Briefcase, GraduationCap, ListChecks, Gift } from 'lucide-react';
import { useAppStore } from '@/store';
import { SurfaceCard } from '@/components/ui/surface-card';
import { Button } from '@/components/ui/button';
import { PageShareButton } from '@/components/share/PageShareButton';
import { ApplicationFormDialog } from '@/components/sections/ApplicationFormDialog';
import type { JobPublic } from '@/lib/jobs';

function toLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
}

function JobSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="pt-10 first:pt-0">
      <h2 className="flex items-center gap-2.5 text-lg font-bold text-[var(--ink)] mb-4">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function JobDetailView({
  job,
  related,
}: {
  job: JobPublic;
  related: JobPublic[];
}) {
  const { locale, t } = useAppStore();
  const isAr = locale === 'ar';
  const title = isAr ? job.titleAr || job.titleEn : job.titleEn || job.titleAr;
  const department = isAr
    ? job.departmentAr || job.departmentEn
    : job.departmentEn || job.departmentAr;
  const description = isAr
    ? job.descriptionAr || job.descriptionEn
    : job.descriptionEn || job.descriptionAr;
  const responsibilities = toLines(
    isAr ? job.responsibilitiesAr || job.responsibilitiesEn : job.responsibilitiesEn || job.responsibilitiesAr,
  );
  const requirements = toLines(
    isAr ? job.requirementsAr || job.requirementsEn : job.requirementsEn || job.requirementsAr,
  );
  const offer = toLines(isAr ? job.offerAr || job.offerEn : job.offerEn || job.offerAr);
  const overviewParagraphs = description
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <article className="bg-background">
      <div className="border-b border-[rgba(10,37,68,0.06)] bg-gradient-to-b from-brand-50/70 to-background">
        <div className="site-container py-8 lg:py-12 max-w-4xl">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900 mb-8"
          >
            {isAr ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
            <span>{isAr ? 'كل الوظائف' : 'All careers'}</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            {department ? (
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200/60">
                {department}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-secondary)]">
              <MapPin className="size-3.5 text-brand-600" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-secondary)]">
              <Clock className="size-3.5 text-brand-600" />
              {job.type}
            </span>
            {job.experienceLevel ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-secondary)]">
                <GraduationCap className="size-3.5 text-brand-600" />
                {job.experienceLevel}
              </span>
            ) : null}
            <PageShareButton
              title={title}
              text={overviewParagraphs[0] || title}
              successEn="Job link copied"
              successAr="تم نسخ رابط الوظيفة"
              className="ms-auto"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[var(--ink)] tracking-tight leading-tight max-w-3xl">
            {title}
          </h1>

          {overviewParagraphs[0] ? (
            <p className="mt-5 text-lg text-brand-800/80 font-medium leading-relaxed max-w-2xl">
              {overviewParagraphs[0]}
            </p>
          ) : null}

          <div className="mt-8">
            <Button
              className="bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-none px-6"
              onClick={() => setDialogOpen(true)}
            >
              <Briefcase className="size-4 me-2" />
              {t.careers.apply}
            </Button>
          </div>
        </div>
      </div>

      <div className="site-container max-w-3xl py-12 lg:py-16">
        {overviewParagraphs.length > 1 && (
          <JobSection
            title={isAr ? 'نبذة عن الوظيفة' : 'About the role'}
            icon={<Briefcase className="size-4" />}
          >
            <div className="space-y-4">
              {overviewParagraphs.slice(1).map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed text-[var(--ink-secondary)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </JobSection>
        )}

        {responsibilities.length > 0 && (
          <JobSection
            title={isAr ? 'المسؤوليات' : 'Responsibilities'}
            icon={<ListChecks className="size-4" />}
          >
            <ul className="space-y-3">
              {responsibilities.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--ink-secondary)]">
                  <span className="mt-2 size-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </JobSection>
        )}

        {requirements.length > 0 && (
          <JobSection
            title={isAr ? 'المتطلبات' : 'Requirements'}
            icon={<GraduationCap className="size-4" />}
          >
            <ul className="space-y-3">
              {requirements.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--ink-secondary)]">
                  <span className="mt-2 size-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </JobSection>
        )}

        {offer.length > 0 && (
          <JobSection
            title={isAr ? 'ما نقدّمه' : 'What we offer'}
            icon={<Gift className="size-4" />}
          >
            <ul className="space-y-3">
              {offer.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-[var(--ink-secondary)]">
                  <span className="mt-2 size-1.5 rounded-full bg-brand-600 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </JobSection>
        )}

        <div className="mt-12 rounded-2xl border border-[rgba(10,37,68,0.08)] bg-brand-50/50 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-bold text-[var(--ink)]">
              {isAr ? 'هل أنت مناسب لهذه الوظيفة؟' : 'Interested in this role?'}
            </p>
            <p className="text-sm text-[var(--ink-secondary)] mt-1">
              {isAr
                ? 'أرسل طلبك وسنتواصل معك عند المراجعة.'
                : 'Submit your application and our team will review it.'}
            </p>
          </div>
          <Button
            className="bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-none shrink-0"
            onClick={() => setDialogOpen(true)}
          >
            <Briefcase className="size-4 me-2" />
            {t.careers.apply}
          </Button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[rgba(10,37,68,0.06)] bg-brand-50/40">
          <div className="site-container py-14 lg:py-16">
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-8">
              {isAr ? 'وظائف ذات صلة' : 'Related roles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => {
                const itemTitle = isAr ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;
                const itemDept = isAr
                  ? item.departmentAr || item.departmentEn
                  : item.departmentEn || item.departmentAr;
                const itemDesc = isAr
                  ? item.descriptionAr || item.descriptionEn
                  : item.descriptionEn || item.descriptionAr;
                return (
                  <Link key={item.id} href={`/careers/${item.slug}`} className="group block h-full">
                    <SurfaceCard hover className="h-full p-5 flex flex-col">
                      <p className="text-xs text-brand-700 font-semibold mb-2">{itemDept}</p>
                      <h3 className="font-bold text-[var(--ink)] group-hover:text-brand-700 mb-2 leading-snug">
                        {itemTitle}
                      </h3>
                      <p className="text-sm text-[var(--ink-secondary)] line-clamp-3 flex-1">{itemDesc}</p>
                      <span className="mt-4 text-sm font-semibold text-brand-700 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                        {isAr ? 'عرض الوظيفة' : 'View role'}
                        <ArrowRight className={`size-3.5 ${isAr ? 'rotate-180' : ''}`} />
                      </span>
                    </SurfaceCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <ApplicationFormDialog
        position={title}
        department={department}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </article>
  );
}
