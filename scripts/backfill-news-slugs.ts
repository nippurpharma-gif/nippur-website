import { PrismaClient } from '@prisma/client';
import { slugify, uniqueSlugCandidate } from '../src/lib/slug';

const db = new PrismaClient();

async function main() {
  const articles = await db.newsArticle.findMany({ orderBy: { id: 'asc' } });
  const used = new Set(
    articles.map((a) => a.slug).filter((s): s is string => typeof s === 'string' && s.length > 0),
  );

  for (const article of articles) {
    if (article.slug?.trim()) continue;
    const base = slugify(article.titleEn || article.titleAr || `news-${article.id}`);
    const slug = uniqueSlugCandidate(base, used);
    used.add(slug);
    await db.newsArticle.update({
      where: { id: article.id },
      data: { slug },
    });
    console.log(`Slug for #${article.id}: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
