export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

/** Canonical public origin for NextAuth CSRF/cookies. Never fall back to VERCEL_URL. */
export function getAuthUrl(): string | undefined {
  const explicit = process.env.NEXTAUTH_URL?.trim().replace(/\/$/, '');
  if (explicit) return explicit;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (site) return site;
  return undefined;
}

export function ensureAuthUrl(): void {
  if (process.env.NEXTAUTH_URL?.trim()) return;
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  if (site) process.env.NEXTAUTH_URL = site;
}
