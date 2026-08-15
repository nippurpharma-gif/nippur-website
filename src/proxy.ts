import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

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
  // Strip trailing slash except root
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default withAuth(
  function proxy(req) {
    const pathname = normalizePath(req.nextUrl.pathname);
    const isApi = pathname.startsWith('/api/');
    const isAuthRoute = pathname.startsWith('/api/auth');

    if (isApi && !isAuthRoute) {
      const method = req.method.toUpperCase();
      const isPublic =
        (method === 'GET' && PUBLIC_GET.has(pathname)) ||
        (method === 'POST' && PUBLIC_POST.has(pathname));

      if (isPublic) {
        return NextResponse.next();
      }

      if (!req.nextauth.token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const pathname = normalizePath(req.nextUrl.pathname);
        const isApi = pathname.startsWith('/api/');
        const isAuthRoute = pathname.startsWith('/api/auth');

        // API auth is enforced in the proxy function above
        if (isApi && !isAuthRoute) return true;

        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  },
);

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
