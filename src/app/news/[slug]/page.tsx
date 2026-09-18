import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { NewsArticleJsonLd } from '@/components/seo/JsonLd';
import { NewsArticleView } from '@/components/news/NewsArticleView';
import { getAllPublishedSlugs, getNewsBySlug, getRelatedNews } from '@/lib/news';
import { buildNewsArticleMetadata } from '@/lib/seo';
import { LOCALE_COOKIE, parseLocale } from '@/lib/locale';

export const revalidate = 120;

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return buildNewsArticleMetadata(article, locale);
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedNews(slug, article.category, 3);
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <SiteChrome>
      <NewsArticleJsonLd article={article} locale={locale} />
      <NewsArticleView article={article} related={related} />
    </SiteChrome>
  );
}
