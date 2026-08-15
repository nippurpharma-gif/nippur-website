import { cache } from 'react';
import { db } from '@/lib/db';
import type { SiteSettings } from '@/store';
import { parseProductionStats } from '@/lib/production-stats';

export type HomeProduct = {
  id: number;
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  formEn: string;
  formAr: string;
  strengthEn: string;
  strengthAr: string;
  packagingEn: string;
  packagingAr: string;
  descEn: string;
  descAr: string;
  leafletUrl: string;
  isActive: boolean;
};

export type HomeJob = {
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
};

export type HomeNews = {
  id: number;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  date: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
};

export type HomePartner = {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export type HomePageData = {
  settings: SiteSettings | null;
  products: HomeProduct[];
  jobs: HomeJob[];
  news: HomeNews[];
  partners: HomePartner[];
};

function toSettings(row: {
  id: number;
  companyNameEn: string;
  companyNameAr: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  emergencyPhone: string;
  descriptionEn: string;
  descriptionAr: string;
  productionStats: unknown;
}): SiteSettings {
  return {
    id: row.id,
    companyNameEn: row.companyNameEn,
    companyNameAr: row.companyNameAr,
    logoUrl: row.logoUrl,
    email: row.email,
    phone: row.phone,
    address: row.address,
    workingHours: row.workingHours,
    emergencyPhone: row.emergencyPhone,
    descriptionEn: row.descriptionEn,
    descriptionAr: row.descriptionAr,
    productionStats: parseProductionStats(row.productionStats),
  };
}

export const getHomePageData = cache(async (): Promise<HomePageData> => {
  try {
    const [settingsRow, products, jobs, news, partners] = await Promise.all([
      db.siteSettings.findUnique({ where: { id: 1 } }),
      db.product.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 200,
      }),
      db.jobPosition.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 200,
      }),
      db.newsArticle.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      db.partner.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
        take: 200,
      }),
    ]);

    return {
      settings: settingsRow ? toSettings(settingsRow) : null,
      products,
      jobs,
      news: news.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
      partners,
    };
  } catch {
    return {
      settings: null,
      products: [],
      jobs: [],
      news: [],
      partners: [],
    };
  }
});
