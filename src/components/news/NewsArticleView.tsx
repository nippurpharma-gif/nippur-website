'use client';

import Link from 'next/link';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { SurfaceCard } from '@/components/ui/surface-card';
import { PageShareButton } from '@/components/share/PageShareButton';
import type { NewsArticlePublic } from '@/lib/news';

function formatDate(dateStr: string, locale: 'en' | 'ar'): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function NewsArticleView({
  article,
  related,
}: {
  article: NewsArticlePublic;
  related: NewsArticlePublic[];
}) {
  const { locale, t } = useAppStore();
  const isAr = locale === 'ar';
  const title = isAr ? article.titleAr || article.titleEn : article.titleEn || article.titleAr;
  const excerpt = isAr ? article.excerptAr || article.excerptEn : article.excerptEn || article.excerptAr;
  const content = isAr ? article.contentAr || article.contentEn : article.contentEn || article.contentAr;
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="bg-background">
      <div className="site-container py-8 lg:py-12 max-w-4xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:text-brand-900 mb-8"
        >
          {isAr ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{isAr ? 'كل الأخبار' : 'All news'}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200/60">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-secondary)]">
            <Calendar className="size-3.5" />
            {formatDate(article.date || article.createdAt, locale)}
          </span>
          <PageShareButton
            title={title}
            text={excerpt}
            successEn="Article link copied"
            successAr="تم نسخ رابط الخبر"
            className="ms-auto"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[var(--ink)] tracking-tight leading-tight">
          {title}
        </h1>
        {excerpt && (
          <p className="mt-5 text-lg text-brand-800/80 font-medium leading-relaxed">{excerpt}</p>
        )}
      </div>

      {article.imageUrl && (
        <div className="site-container max-w-5xl mb-10">
          <div className="relative overflow-hidden rounded-2xl aspect-[16/9] bg-brand-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.imageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="site-container max-w-3xl pb-16 lg:pb-20">
        <div className="space-y-5">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base sm:text-lg leading-relaxed text-[var(--ink-secondary)]">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-[var(--ink-secondary)]">{excerpt}</p>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="border-t border-[rgba(10,37,68,0.06)] bg-brand-50/40">
          <div className="site-container py-14 lg:py-16">
            <h2 className="text-2xl font-bold text-[var(--ink)] mb-8">
              {isAr ? 'أخبار ذات صلة' : 'Related news'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => {
                const itemTitle = isAr ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;
                const itemExcerpt = isAr
                  ? item.excerptAr || item.excerptEn
                  : item.excerptEn || item.excerptAr;
                return (
                  <Link key={item.id} href={`/news/${item.slug}`} className="group block h-full">
                    <SurfaceCard hover className="h-full p-5 flex flex-col">
                      <p className="text-xs text-brand-700 font-medium mb-2">{item.category}</p>
                      <h3 className="font-bold text-[var(--ink)] group-hover:text-brand-700 mb-2 leading-snug">
                        {itemTitle}
                      </h3>
                      <p className="text-sm text-[var(--ink-secondary)] line-clamp-3 flex-1">
                        {itemExcerpt}
                      </p>
                      <span className="mt-4 text-sm font-semibold text-brand-700 inline-flex items-center gap-1">
                        {t.news.readMore}
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
    </article>
  );
}
