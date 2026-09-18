import { type AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { rateLimit } from '@/lib/rate-limit';
import { ensureAuthUrl } from '@/lib/site-url';

ensureAuthUrl();

function resolveAuthSecret(): string | undefined {
  const fromEnv = process.env.NEXTAUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === 'production') {
    console.error('[auth] NEXTAUTH_SECRET is required in production');
    return undefined;
  }

  console.warn('[auth] Using development fallback NEXTAUTH_SECRET');
  return 'dev-only-nippur-secret-change-me';
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const headerBag = req && 'headers' in req ? req.headers : undefined;
        const forwarded =
          headerBag && typeof (headerBag as Headers).get === 'function'
            ? (headerBag as Headers).get('x-forwarded-for')
            : (headerBag as Record<string, string | string[] | undefined> | undefined)?.[
                'x-forwarded-for'
              ];
        const ipRaw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        const ip = ipRaw?.split(',')[0]?.trim() || 'unknown';

        try {
          const limited = await withTimeout(
            rateLimit(`login:${ip}:${email}`, {
              limit: 8,
              windowMs: 15 * 60 * 1000,
            }),
            2500,
            'rate-limit',
          );
          if (!limited.ok) return null;
        } catch (error) {
          console.error('[auth] rate limit failed', error);
        }

        let user;
        try {
          user = await withTimeout(
            db.adminUser.findUnique({ where: { email } }),
            8000,
            'admin lookup',
          );
        } catch (error) {
          console.error('[auth] admin lookup failed', error);
          return null;
        }
        if (!user || !user.isActive) return null;
        if (!verifyPassword(password, user.passwordHash)) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  secret: resolveAuthSecret(),
  useSecureCookies: process.env.NODE_ENV === 'production',
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.uid;
      }
      return session;
    },
  },
};

export async function getAdminSession() {
  return getServerSession(authOptions);
}

/** Returns 401 JSON when the caller is not an authenticated admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  const role = session?.user?.role;
  if (!session?.user || (role && role !== 'admin' && role !== 'editor')) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireRole(allowed: string[]) {
  const result = await requireAdmin();
  if (result.error) return result;
  const role = result.session?.user?.role ?? 'admin';
  if (!allowed.includes(role)) {
    return {
      session: result.session,
      error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }
  return result;
}
