import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Applebot-Extended',
];

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/api/'],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: ['/', '/news', '/careers', '/llms.txt', '/sitemap.xml'],
        disallow: ['/admin', '/login', '/api/'],
      })),
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
