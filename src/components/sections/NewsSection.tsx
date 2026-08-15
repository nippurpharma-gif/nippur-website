'use client';

import { memo, useState, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';
import { NewsDetailModal } from './NewsDetailModal';

interface NewsArticle {
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
}

const NewsCard = memo(function NewsCard({
  article,
  locale,
  readMore,
  onOpen,
}: {
  article: NewsArticle;
  locale: string;
  readMore: string;
  onOpen: (article: NewsArticle) => void;
}) {
  return (
    <SurfaceCard
      hover
      className="h-full p-6 sm:p-7 cursor-pointer flex flex-col justify-between"
      onClick={() => onOpen(article)}
    >
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
          {locale === 'ar' ? article.titleAr : article.titleEn}
        </h3>

        <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 mb-6">
          {locale === 'ar' ? article.excerptAr : article.excerptEn}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-brand-700 text-sm font-semibold pt-4 border-t border-[rgba(10,37,68,0.06)] group-hover:gap-2.5 transition-all">
        <span>{readMore}</span>
        <ArrowRight className={`size-4 ${locale === 'ar' ? 'rotate-180' : ''}`} />
      </div>
    </SurfaceCard>
  );
});

export function NewsSection({ initialArticles }: { initialArticles?: NewsArticle[] }) {
  const { t, locale } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>(
    () => initialArticles?.filter((a) => a.isPublished) ?? [],
  );
  const [showCount, setShowCount] = useState(3);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
          setArticles(data.filter((a: NewsArticle) => a.isPublished));
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

  const openArticle = useCallback((article: NewsArticle) => {
    setSelectedArticle(article);
    setModalOpen(true);
  }, []);

  const visibleArticles = articles.slice(0, showCount);

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
            <NewsCard
              article={article}
              locale={locale}
              readMore={t.news.readMore}
              onOpen={openArticle}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {articles.length > showCount && (
        <FadeIn className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-[rgba(10,37,68,0.12)] text-[var(--ink)] hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 rounded-full"
            onClick={() => setShowCount((prev) => prev + 3)}
          >
            <Newspaper className="size-4 me-2" />
            {t.news.viewAll}
          </Button>
        </FadeIn>
      )}

      <NewsDetailModal
        article={selectedArticle}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </SectionWrapper>
  );
}
