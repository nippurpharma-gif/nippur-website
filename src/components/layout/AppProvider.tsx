'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useAppStore();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  // Initialize locale from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nippur-locale') as 'en' | 'ar' | null;
    if (saved) {
      setLocale(saved);
    }
  }, [setLocale]);

  return <>{children}</>;
}