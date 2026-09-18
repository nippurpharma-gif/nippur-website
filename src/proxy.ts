import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { ensureAuthUrl } from '@/lib/site-url';

ensureAuthUrl();

/** Exact public API paths (method-aware). Everything else under /api requires a session. */
const PUBLIC_GET = new Set([
  '/api/news',
  '/api/jobs',
  '/api/partners',
  '/api/settings',
  '/api/products',
]);

const PUBLIC_POST = new Set(['/api/applications', '/api/contact']);

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function loginRedirect(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = '';
  url.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`);
  return NextResponse.redirect(url);
}

export async function proxy(req: NextRequest) {
  const pathname = normalizePath(req.nextUrl.pathname);
  const isApi = pathname.startsWith('/api/');
  const isAuthRoute = pathname.startsWith('/api/auth');

  if (isAuthRoute) {
    return NextResponse.next();
  }

  const forwardedProto = req.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie:
      process.env.NODE_ENV === 'production' ||
      req.nextUrl.protocol === 'https:' ||
      forwardedProto === 'https',
  });

  if (pathname.startsWith('/admin') && !token) {
    return loginRedirect(req);
  }

  if (isApi) {
    const method = req.method.toUpperCase();
    const isPublic =
      (method === 'GET' && PUBLIC_GET.has(pathname)) ||
      (method === 'POST' && PUBLIC_POST.has(pathname));

    if (isPublic) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/((?!auth).*)'],
};
