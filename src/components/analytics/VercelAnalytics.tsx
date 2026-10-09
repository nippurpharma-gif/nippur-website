'use client';

import { Analytics } from '@vercel/analytics/next';

/**
 * Client-only wrapper so `beforeSend` is not passed across the RSC boundary
 * (functions cannot be serialized from Server Components).
 */
export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        try {
          const path = new URL(event.url).pathname;
          if (
            path.startsWith('/admin') ||
            path.startsWith('/login') ||
            path.startsWith('/api/')
          ) {
            return null;
          }
        } catch {
          return event;
        }
        return event;
      }}
    />
  );
}
