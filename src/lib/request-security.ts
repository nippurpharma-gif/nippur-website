import type { NextRequest } from 'next/server';

/**
 * Defense-in-depth CSRF check for cookie-authenticated mutations.
 * Browser same-origin fetch sends Origin; reject cross-site callers.
 */
export function isSameOriginRequest(req: NextRequest): boolean {
  const host = req.headers.get('host')?.toLowerCase();
  if (!host) return false;

  const origin = req.headers.get('origin');
  if (origin) {
    try {
      return new URL(origin).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.get('referer');
  if (referer) {
    try {
      return new URL(referer).host.toLowerCase() === host;
    } catch {
      return false;
    }
  }

  // Missing both is uncommon for browser XHR; allow only outside production.
  return process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
}

/** Trust forwarded IP headers only behind a known reverse proxy / platform. */
export function trustProxyHeaders(): boolean {
  return (
    process.env.TRUSTED_PROXY === '1' ||
    process.env.VERCEL === '1' ||
    process.env.CF_PROXY === '1'
  );
}
