import { cache } from 'react';
import { db } from '@/lib/db';

export type NewsArticlePublic = {
  id: number;
  slug: string;
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

function mapArticle(a: {
  id: number;
  slug: string;
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
  createdAt: Date;
}): NewsArticlePublic {
  return {
    ...a,
    createdAt: a.createdAt.toISOString(),
  };
}

export const getPublishedNews = cache(async (): Promise<NewsArticlePublic[]> => {
  try {
    const rows = await db.newsArticle.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    return rows.map(mapArticle);
  } catch {
    return [];
  }
});

export const getNewsBySlug = cache(async (slug: string): Promise<NewsArticlePublic | null> => {
  try {
    const row = await db.newsArticle.findFirst({
      where: { slug, isPublished: true },
    });
    return row ? mapArticle(row) : null;
  } catch {
    return null;
  }
});

export const getRelatedNews = cache(
  async (slug: string, category: string, take = 3): Promise<NewsArticlePublic[]> => {
    try {
      const sameCategory = await db.newsArticle.findMany({
        where: {
          isPublished: true,
          slug: { not: slug },
          category,
        },
        orderBy: { createdAt: 'desc' },
        take,
      });

      if (sameCategory.length >= take) {
        return sameCategory.slice(0, take).map(mapArticle);
      }

      const rest = await db.newsArticle.findMany({
        where: {
          isPublished: true,
          slug: { not: slug },
          category: { not: category },
        },
        orderBy: { createdAt: 'desc' },
        take: take - sameCategory.length,
      });

      return [...sameCategory, ...rest].map(mapArticle);
    } catch {
      return [];
    }
  },
);

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const rows = await db.newsArticle.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function listExistingSlugs(): Promise<Set<string>> {
  const rows = await db.newsArticle.findMany({ select: { slug: true } });
  return new Set(rows.map((r) => r.slug));
}
