import type { Locale } from '@/lib/i18n/translations';

export const LOCALE_COOKIE = 'nippur-locale';

export function parseLocale(value: string | undefined | null): Locale {
  return value === 'ar' ? 'ar' : 'en';
}

export function persistLocale(locale: Locale) {
  if (typeof document === 'undefined') return;
  localStorage.setItem('nippur-locale', locale);
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
}
