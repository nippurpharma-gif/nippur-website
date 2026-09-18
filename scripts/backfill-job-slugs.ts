import { PrismaClient } from '@prisma/client';
import { slugify, uniqueSlugCandidate } from '../src/lib/slug';

const db = new PrismaClient();

async function main() {
  const jobs = await db.jobPosition.findMany({ orderBy: { id: 'asc' } });
  const used = new Set(
    jobs.map((j) => j.slug).filter((s): s is string => typeof s === 'string' && s.length > 0),
  );

  for (const job of jobs) {
    if (job.slug?.trim()) continue;
    const base = slugify(job.titleEn || job.titleAr || `job-${job.id}`);
    const slug = uniqueSlugCandidate(base, used);
    used.add(slug);
    await db.jobPosition.update({
      where: { id: job.id },
      data: { slug },
    });
    console.log(`Job slug #${job.id}: ${slug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
