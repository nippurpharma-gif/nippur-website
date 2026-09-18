import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { getPublishedNews } from '@/lib/news';
import { getActiveJobs } from '@/lib/jobs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const [news, jobs] = await Promise.all([getPublishedNews(), getActiveJobs()]);

  const newsEntries: MetadataRoute.Sitemap = news.map((article) => ({
    url: `${site}/news/${article.slug}`,
    lastModified: article.createdAt ? new Date(article.createdAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${site}/careers/${job.slug}`,
    lastModified: job.createdAt ? new Date(job.createdAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: site,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${site}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${site}/careers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...newsEntries,
    ...jobEntries,
  ];
}
