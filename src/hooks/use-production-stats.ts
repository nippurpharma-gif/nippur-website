'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import {
  localizeStats,
  parseProductionStats,
  type LocalizedStat,
} from '@/lib/production-stats';

export function useProductionStats(): LocalizedStat[] {
  const locale = useAppStore((s) => s.locale);
  const { settings } = useSiteSettings();

  return useMemo(
    () => localizeStats(parseProductionStats(settings?.productionStats), locale),
    [locale, settings?.productionStats],
  );
}
