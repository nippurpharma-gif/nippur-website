import { NewsIndexJsonLd } from '@/components/seo/JsonLd';
import { NewsIndex } from '@/components/news/NewsIndex';
import { getPublishedNews } from '@/lib/news';
import { buildNewsIndexMetadata } from '@/lib/seo';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, parseLocale } from '@/lib/locale';

export const revalidate = 120;

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return buildNewsIndexMetadata(locale);
}

export default async function NewsPage() {
  const articles = await getPublishedNews();

  return (
    <>
      <NewsIndexJsonLd />
      <NewsIndex articles={articles} />
    </>
  );
}
