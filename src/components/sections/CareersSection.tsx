'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { MapPin, Clock, CheckCircle, Briefcase, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';
import { ApplicationFormDialog } from './ApplicationFormDialog';

interface JobPosition {
  id: number;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  descriptionEn: string;
  descriptionAr: string;
  applicationEmail: string;
  sortOrder: number;
  isActive: boolean;
}

const JobCard = memo(function JobCard({
  title,
  department,
  location,
  type,
  description,
  applyLabel,
  onApply,
}: {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  applyLabel: string;
  onApply: (title: string, department: string) => void;
}) {
  return (
    <SurfaceCard hover className="h-full p-6 flex flex-col justify-between">
      <div>
        <div className="mb-3">
          <span className="inline-block text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md">
            {department}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors mb-3">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--ink-secondary)] mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-brand-600" />
            {location}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-brand-600" />
            {type}
          </span>
        </div>
        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 mb-6">
          {description}
        </p>
      </div>
      <Button
        className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-none"
        onClick={() => onApply(title, department)}
      >
        <Briefcase className="size-4 me-2" />
        {applyLabel}
      </Button>
    </SurfaceCard>
  );
});

export function CareersSection({ initialJobs }: { initialJobs?: JobPosition[] }) {
  const { t, locale } = useAppStore();
  const [jobs, setJobs] = useState<JobPosition[]>(
    () =>
      initialJobs
        ?.filter((job) => job.isActive === true)
        .sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
  );
  const [loading, setLoading] = useState(!initialJobs);
  const [applyPosition, setApplyPosition] = useState<string | null>(null);
  const [applyDepartment, setApplyDepartment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const handleApply = useCallback((title: string, department: string) => {
    setApplyDepartment(department);
    setApplyPosition(title);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setApplyPosition(null);
  };

  const getTitle = (job: JobPosition) => (locale === 'ar' ? job.titleAr : job.titleEn);
  const getDepartment = (job: JobPosition) => (locale === 'ar' ? job.departmentAr : job.departmentEn);
  const getDescription = (job: JobPosition) => (locale === 'ar' ? job.descriptionAr : job.descriptionEn);

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
              <p className="text-lg font-medium text-[var(--ink)]">No open positions at the moment</p>
              <p className="text-sm mt-1 text-[var(--ink-secondary)]">Please check back later</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <StaggerItem key={job.id}>
                  <JobCard
                    title={getTitle(job)}
                    department={getDepartment(job)}
                    location={job.location}
                    type={job.type}
                    description={getDescription(job)}
                    applyLabel={t.careers.apply}
                    onApply={handleApply}
                  />
                </StaggerItem>
              ))}
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

      <ApplicationFormDialog
        position={applyPosition}
        department={applyDepartment}
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
      />
    </SectionWrapper>
  );
}
