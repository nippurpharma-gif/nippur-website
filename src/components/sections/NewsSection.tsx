'use client';

import { memo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';

interface NewsArticle {
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
}

const NewsCard = memo(function NewsCard({
  article,
  locale,
  readMore,
}: {
  article: NewsArticle;
  locale: string;
  readMore: string;
}) {
  const title = locale === 'ar' ? article.titleAr || article.titleEn : article.titleEn || article.titleAr;
  const excerpt =
    locale === 'ar' ? article.excerptAr || article.excerptEn : article.excerptEn || article.excerptAr;

  return (
    <Link href={`/news/${article.slug}`} className="group block h-full">
      <SurfaceCard hover className="h-full p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-4 text-xs font-medium text-[var(--ink-secondary)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-brand-600" />
              {article.date}
            </span>
            <span>•</span>
            <span className="bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md font-medium">
              {article.category}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors mb-3">
            {title}
          </h3>

          <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 mb-6">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-brand-700 text-sm font-semibold pt-4 border-t border-[rgba(10,37,68,0.06)] group-hover:gap-2.5 transition-all">
          <span>{readMore}</span>
          <ArrowRight className={`size-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
        </div>
      </SurfaceCard>
    </Link>
  );
});

export function NewsSection({ initialArticles }: { initialArticles?: NewsArticle[] }) {
  const { t, locale } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>(
    () => initialArticles?.filter((a) => a.isPublished && a.slug) ?? [],
  );
  const [loading, setLoading] = useState(!initialArticles);

  useEffect(() => {
    if (initialArticles) return;
    fetch('/api/news')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setArticles(data.filter((a: NewsArticle) => a.isPublished && a.slug));
        } else {
          setArticles([]);
        }
      })
      .catch(() => {
        setArticles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [initialArticles]);

  const visibleArticles = articles.slice(0, 3);

  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="news"
      badge={t.news.badge}
      title={t.news.title}
      subtitle={t.news.subtitle}
    >
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleArticles.map((article) => (
          <StaggerItem key={article.id}>
            <NewsCard article={article} locale={locale} readMore={t.news.readMore} />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {articles.length > 0 && (
        <FadeIn className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-[rgba(10,37,68,0.12)] text-[var(--ink)] hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 rounded-full"
          >
            <Link href="/news">
              <Newspaper className="size-4 me-2" />
              {t.news.viewAll}
            </Link>
          </Button>
        </FadeIn>
      )}
    </SectionWrapper>
  );
}
