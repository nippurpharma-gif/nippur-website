'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore, type SiteSettings } from '@/store';

/**
 * Shared hook that fetches site settings from the API once (per session)
 * and stores them in Zustand so every component gets reactive updates.
 *
 * When the dashboard saves new settings and calls `setSiteSettings()`,
 * all components using this hook re-render automatically.
 */
export function useSiteSettings() {
  const { siteSettings, setSiteSettings, _settingsFetched, setSettingsFetched } = useAppStore();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings?XTransformPort=3000');
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setSiteSettings(data as SiteSettings);
      }
    } catch {
      // silent
    }
  }, [setSiteSettings]);

  useEffect(() => {
    if (!_settingsFetched) {
      setSettingsFetched(true);
      fetchSettings();
    }
  }, [_settingsFetched, setSettingsFetched, fetchSettings]);

  const refetch = useCallback(() => {
    fetchSettings();
  }, [fetchSettings]);

  return { settings: siteSettings, refetch };
}