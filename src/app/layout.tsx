import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono, Cairo } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/components/layout/AppProvider';
import { RouteShell } from '@/components/layout/RouteShell';
import { LOCALE_COOKIE, parseLocale } from '@/lib/locale';
import { buildRootMetadata } from '@/lib/seo';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
});

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  preload: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  return buildRootMetadata(locale);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/factory-real.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} ${cairo.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-700 focus:text-white focus:rounded-lg focus:shadow-xl text-sm font-medium transition-all"
        >
          Skip to content / الانتقال إلى المحتوى الرئيسي
        </a>
        <AppProvider initialLocale={locale}>
          <RouteShell>{children}</RouteShell>
        </AppProvider>
        <Toaster />
      </body>
    </html>
  );
}
