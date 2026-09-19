'use client';

import { usePathname } from 'next/navigation';
import { SiteChrome } from '@/components/layout/SiteChrome';

const INNER_PREFIXES = ['/news', '/careers'];

function isInnerRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return INNER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Keeps Header / Footer / CTA mounted across /news and /careers soft navigations
 * (including individual article and job pages). Home keeps its own chrome.
 */
export function RouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isInnerRoute(pathname)) {
    return <SiteChrome>{children}</SiteChrome>;
  }

  return <>{children}</>;
}
