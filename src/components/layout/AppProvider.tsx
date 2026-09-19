'use client';

import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore, type SiteSettings } from '@/store';
import type { Locale } from '@/lib/i18n/translations';
import { persistLocale } from '@/lib/locale';

function needsAppDataProviders(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/auth')
  );
}

function AuthQueryProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}

export function AppProvider({
  children,
  initialLocale,
  initialSettings,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialSettings?: SiteSettings | null;
}) {
  const pathname = usePathname();
  const { locale, setLocale, setSiteSettings, setSettingsFetched } = useAppStore();
  const withDataProviders = needsAppDataProviders(pathname);

  useLayoutEffect(() => {
    if (initialLocale) {
      setLocale(initialLocale);
    }
    const saved = localStorage.getItem('nippur-locale') as Locale | null;
    if (saved === 'en' || saved === 'ar') {
      setLocale(saved);
      persistLocale(saved);
    }
    if (initialSettings) {
      setSiteSettings(initialSettings);
      setSettingsFetched(true);
    }
  }, [initialLocale, initialSettings, setLocale, setSiteSettings, setSettingsFetched]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  if (withDataProviders) {
    return <AuthQueryProviders>{children}</AuthQueryProviders>;
  }

  return <>{children}</>;
}
