import { create } from 'zustand';
import type { Locale } from '@/lib/i18n/translations';
import { translations } from '@/lib/i18n/translations';

export type ViewMode = 'website' | 'login' | 'dashboard';

export interface SiteSettings {
  id: number;
  companyNameEn: string;
  companyNameAr: string;
  logoUrl: string;
  email: string;
  phone: string;
  address: string;
  workingHours: string;
  emergencyPhone: string;
  descriptionEn: string;
  descriptionAr: string;
}

interface AppState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  dashboardTab: string;
  setDashboardTab: (tab: string) => void;
  selectedNews: number | null;
  setSelectedNews: (id: number | null) => void;
  showApplicationForm: string | null;
  setShowApplicationForm: (position: string | null) => void;
  siteSettings: SiteSettings | null;
  setSiteSettings: (settings: SiteSettings | null) => void;
  _settingsFetched: boolean;
  setSettingsFetched: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  locale: 'en',
  setLocale: (locale) => set({ locale, t: translations[locale] }),
  t: translations.en,
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  viewMode: 'website',
  setViewMode: (mode) => set({ viewMode: mode }),
  dashboardTab: 'overview',
  setDashboardTab: (tab) => set({ dashboardTab: tab }),
  selectedNews: null,
  setSelectedNews: (id) => set({ selectedNews: id }),
  showApplicationForm: null,
  setShowApplicationForm: (position) => set({ showApplicationForm: position }),
  siteSettings: null,
  setSiteSettings: (settings) => set({ siteSettings: settings }),
  _settingsFetched: false,
  setSettingsFetched: (v) => set({ _settingsFetched: v }),
}));