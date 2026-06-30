'use client';

import { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export function NewsSection() {
  const { t, locale } = useAppStore();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [showCount, setShowCount] = useState(3);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?XTransformPort=3000')
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
  }, []);

  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setModalOpen(true);
  };

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
            <div
              className="group rounded-2xl border border-border/60 bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => openArticle(article)}
            >
              <div className="h-2 bg-gradient-to-r from-brand-600 to-brand-400" />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <span className="text-xs text-muted-foreground">{article.date}</span>
                  <Badge className="bg-gold-50 text-gold-600 border-gold-200/60 text-[10px] font-medium hover:bg-gold-100">
                    {article.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground leading-tight group-hover:text-brand-700 transition-colors">
                  {locale === 'ar' ? article.titleAr : article.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {locale === 'ar' ? article.excerptAr : article.excerptEn}
                </p>
                <div className="flex items-center gap-1 text-brand-600 text-sm font-medium group-hover:gap-2 transition-all">
                  <span>{t.news.readMore}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {articles.length > showCount && (
        <FadeIn className="mt-10 text-center">
          <Button
            variant="outline"
            className="border-brand-200 text-brand-700 hover:bg-brand-50"
            onClick={() => setShowCount((prev) => prev + 3)}
          >
            <Newspaper className="w-4 h-4 me-2" />
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