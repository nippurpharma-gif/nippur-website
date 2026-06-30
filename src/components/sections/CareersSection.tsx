'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, Briefcase, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function CareersSection() {
  const { t, locale } = useAppStore();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyPosition, setApplyPosition] = useState<string | null>(null);
  const [applyDepartment, setApplyDepartment] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs?XTransformPort=3000');
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
    fetchJobs();
  }, []);

  const handleApply = (title: string, department: string) => {
    setApplyDepartment(department);
    setApplyPosition(title);
    setDialogOpen(true);
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Briefcase className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No open positions at the moment</p>
              <p className="text-sm mt-1">Please check back later</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job) => (
                <StaggerItem key={job.id}>
                  <Card className="group h-full border border-border/60 bg-card hover:border-brand-300/50 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <Badge variant="secondary" className="bg-brand-50 text-brand-700 hover:bg-brand-100 border-brand-200/50 font-medium">
                          {getDepartment(job)}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground leading-snug group-hover:text-brand-700 transition-colors">
                        {getTitle(job)}
                      </h3>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col gap-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-brand-500" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-brand-500" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {getDescription(job)}
                      </p>
                      <Button
                        className="w-full mt-auto bg-brand-600 hover:bg-brand-700 text-white"
                        onClick={() => handleApply(getTitle(job), getDepartment(job))}
                      >
                        <Briefcase className="h-4 w-4 me-2" />
                        {t.careers.apply}
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        <div className="lg:col-span-1">
          <FadeIn delay={0.3}>
            <div className="sticky top-24 rounded-2xl border border-brand-200/50 bg-gradient-to-br from-brand-50 to-white p-6 lg:p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center">
                  <CheckCircle className="h-4.5 w-4.5 text-brand-600" />
                </div>
                {t.careers.benefits.title}
              </h3>
              <ul className="space-y-4">
                {t.careers.benefits.items.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-foreground/80">
                    <CheckCircle className="h-5 w-5 text-brand-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-brand-200/50">
                <Button
                  variant="outline"
                  className="w-full border-brand-300 text-brand-700 hover:bg-brand-50 hover:text-brand-800"
                  onClick={() => {
                    setApplyDepartment('');
                    setApplyPosition('');
                    setDialogOpen(true);
                  }}
                >
                  {t.careers.submitCV}
                </Button>
              </div>
            </div>
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