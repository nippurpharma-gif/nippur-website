'use client';

import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { SurfaceCard } from '@/components/ui/surface-card';
import type { NewsArticlePublic } from '@/lib/news';

export function NewsIndex({ articles }: { articles: NewsArticlePublic[] }) {
  const { t, locale } = useAppStore();
  const isAr = locale === 'ar';

  return (
    <div className="bg-background">
      <section className="border-b border-[rgba(10,37,68,0.06)] bg-gradient-to-b from-brand-50/80 to-background">
        <div className="site-container py-14 lg:py-20">
          <p className="text-sm font-medium text-brand-700 mb-3">{t.news.badge}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--ink)] tracking-tight max-w-3xl">
            {t.news.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--ink-secondary)] max-w-2xl leading-relaxed">
            {t.news.subtitle}
          </p>
        </div>
      </section>

      <section className="site-container py-12 lg:py-16">
        {articles.length === 0 ? (
          <p className="text-[var(--ink-secondary)] text-center py-16">
            {isAr ? 'لا توجد أخبار منشورة حالياً.' : 'No published news yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const title = isAr ? article.titleAr || article.titleEn : article.titleEn || article.titleAr;
              const excerpt = isAr
                ? article.excerptAr || article.excerptEn
                : article.excerptEn || article.excerptAr;
              return (
                <Link key={article.id} href={`/news/${article.slug}`} className="group block h-full">
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
                      <h2 className="text-lg font-bold text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors mb-3">
                        {title}
                      </h2>
                      <p className="text-sm text-[var(--ink-secondary)] leading-relaxed line-clamp-3 mb-6">
                        {excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-brand-700 text-sm font-semibold pt-4 border-t border-[rgba(10,37,68,0.06)] group-hover:gap-2.5 transition-all">
                      <span>{t.news.readMore}</span>
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
