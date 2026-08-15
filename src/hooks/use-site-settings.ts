'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore, type SiteSettings } from '@/store';

let isFetchingSettings = false;

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
    if (isFetchingSettings) return;
    isFetchingSettings = true;
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) return;
      const data = await res.json();
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setSiteSettings(data as SiteSettings);
      }
    } catch {
      // silent
    } finally {
      isFetchingSettings = false;
    }
  }, [setSiteSettings]);

  useEffect(() => {
    if (!_settingsFetched && !isFetchingSettings) {
      setSettingsFetched(true);
      fetchSettings();
    }
  }, [_settingsFetched, setSettingsFetched, fetchSettings]);

  const refetch = useCallback(() => {
    isFetchingSettings = false;
    fetchSettings();
  }, [fetchSettings]);

  return { settings: siteSettings, refetch };
}