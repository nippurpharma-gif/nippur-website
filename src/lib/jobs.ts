import { cache } from 'react';
import { db } from '@/lib/db';

export type JobPublic = {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  experienceLevel: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibilitiesEn: string;
  responsibilitiesAr: string;
  requirementsEn: string;
  requirementsAr: string;
  offerEn: string;
  offerAr: string;
  applicationEmail: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

function mapJob(j: {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  experienceLevel: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibilitiesEn: string;
  responsibilitiesAr: string;
  requirementsEn: string;
  requirementsAr: string;
  offerEn: string;
  offerAr: string;
  applicationEmail: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}): JobPublic {
  return {
    ...j,
    createdAt: j.createdAt.toISOString(),
  };
}

export const getActiveJobs = cache(async (): Promise<JobPublic[]> => {
  try {
    const rows = await db.jobPosition.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 200,
    });
    return rows.map(mapJob);
  } catch {
    return [];
  }
});

export const getJobBySlug = cache(async (slug: string): Promise<JobPublic | null> => {
  try {
    const row = await db.jobPosition.findFirst({
      where: { slug, isActive: true },
    });
    return row ? mapJob(row) : null;
  } catch {
    return null;
  }
});

export const getRelatedJobs = cache(
  async (slug: string, departmentEn: string, take = 3): Promise<JobPublic[]> => {
    try {
      const sameDept = await db.jobPosition.findMany({
        where: {
          isActive: true,
          slug: { not: slug },
          departmentEn,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take,
      });

      if (sameDept.length >= take) {
        return sameDept.slice(0, take).map(mapJob);
      }

      const extras = await db.jobPosition.findMany({
        where: {
          isActive: true,
          slug: { not: slug },
          id: { notIn: sameDept.map((j) => j.id) },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: take - sameDept.length,
      });

      return [...sameDept, ...extras].map(mapJob);
    } catch {
      return [];
    }
  },
);

export const getAllActiveJobSlugs = cache(async (): Promise<string[]> => {
  try {
    const rows = await db.jobPosition.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug).filter(Boolean);
  } catch {
    return [];
  }
});
