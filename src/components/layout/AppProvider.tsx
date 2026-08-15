'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore, type SiteSettings } from '@/store';
import type { Locale } from '@/lib/i18n/translations';
import { persistLocale } from '@/lib/locale';

export function AppProvider({
  children,
  initialLocale,
  initialSettings,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
  initialSettings?: SiteSettings | null;
}) {
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
  const { locale, setLocale, setSiteSettings, setSettingsFetched } = useAppStore();

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

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
