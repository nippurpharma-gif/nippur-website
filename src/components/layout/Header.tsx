'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Languages } from 'lucide-react';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';
import { motionTransition } from '@/lib/motion-craft';
import { persistLocale } from '@/lib/locale';
import { scrollToSection as scrollTo } from '@/lib/scroll-to-section';

/** Primary desktop nav — 4 minimal items without Contact */
const primaryNav = [
  { key: 'hero', labelKey: 'home' as const },
  { key: 'about', labelKey: 'about' as const },
  { key: 'manufacturing', labelKey: 'manufacturing' as const },
  { key: 'products', labelKey: 'products' as const },
];

/** Full list for mobile drawer */
const allNav = [
  ...primaryNav,
  { key: 'research', labelKey: 'research' as const },
  { key: 'quality', labelKey: 'quality' as const },
  { key: 'sustainability', labelKey: 'sustainability' as const },
  { key: 'careers', labelKey: 'careers' as const },
  { key: 'news', labelKey: 'news' as const },
  { key: 'contact', labelKey: 'contact' as const },
];

const DEFAULT_LOGO = '/images/logo-nippur.png';

export function Header() {
  const { locale, setLocale, t, activeSection, mobileMenuOpen, setMobileMenuOpen } =
    useAppStore();
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);

  const logoUrl = settings?.logoUrl || DEFAULT_LOGO;
  const companyName = settings
    ? locale === 'ar'
      ? settings.companyNameAr
      : settings.companyNameEn
    : locale === 'ar'
      ? 'نيبور فارما'
      : 'NIPPUR Pharma';

  const onHero = !scrolled;
  const ink = onHero ? 'text-white' : 'text-brand-800';
  const inkMuted = onHero ? 'text-white/75' : 'text-[var(--ink-tertiary)]';
  const inkHover = onHero ? 'hover:text-white' : 'hover:text-brand-600';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = useCallback(
    (key: string) => {
      scrollTo(key);
      setMobileMenuOpen(false);
    },
    [setMobileMenuOpen],
  );

  const toggleLanguage = useCallback(() => {
    const next = locale === 'en' ? 'ar' : 'en';
    setLocale(next);
    persistLocale(next);
  }, [locale, setLocale]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={motionTransition.section}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,box-shadow] duration-300',
          scrolled
            ? 'glass border-b border-[rgba(10,37,68,0.08)] shadow-[var(--shadow-lift)]'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="site-container">
          {/* Header layout: Logo | Centered 4 Nav Items | Contact & Language Switcher */}
          <div className="relative flex h-16 lg:h-[4.25rem] items-center justify-between gap-4">
            {/* Start — Logo Only */}
            <button
              type="button"
              onClick={() => scrollToSection('hero')}
              className="relative z-20 flex shrink-0 items-center rounded-sm focus-visible:ring-2 focus-visible:ring-brand-600"
              aria-label={companyName}
            >
              <img
                src={logoUrl}
                alt={companyName}
                className={cn(
                  'h-8 lg:h-10 w-auto object-contain transition-[filter] duration-300',
                  onHero && 'brightness-0 invert',
                )}
              />
            </button>

            {/* Center — Primary Minimal Nav (4 items) */}
            <nav
              aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
              className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-7 xl:flex"
            >
              {primaryNav.map((item) => {
                const active = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => scrollToSection(item.key)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'pointer-events-auto relative py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-600 rounded-sm',
                      active ? ink : inkMuted,
                      inkHover,
                    )}
                  >
                    {t.nav[item.labelKey]}
                    {active && (
                      <motion.span
                        layoutId="navActive"
                        className={cn(
                          'absolute inset-x-0 -bottom-0.5 mx-auto h-px w-full max-w-[1.25rem]',
                          onHero ? 'bg-white/90' : 'bg-brand-600',
                        )}
                        transition={motionTransition.springNav}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* End — Contact Button + Translation Switcher Button */}
            <div className="relative z-20 flex shrink-0 items-center gap-3 lg:gap-3.5">
              {/* Contact Us Action Button */}
              <button
                type="button"
                onClick={() => scrollToSection('contact')}
                className={cn(
                  'hidden sm:inline-flex items-center text-[13px] font-medium transition-all duration-200 py-1.5 px-4 rounded-full border',
                  onHero
                    ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                    : 'border-[rgba(10,37,68,0.15)] text-brand-800 hover:bg-brand-50 hover:border-brand-300',
                )}
              >
                {t.nav.contact}
              </button>

              {/* Translation Button with Icon */}
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={locale === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-full border transition-all duration-200',
                  onHero
                    ? 'border-white/30 text-white hover:bg-white/10 hover:border-white/50'
                    : 'border-[rgba(10,37,68,0.15)] text-brand-800 hover:bg-brand-50 hover:border-brand-300',
                )}
              >
                <Languages className="size-3.5" />
                <span>{locale === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? (locale === 'ar' ? 'إغلاق القائمة' : 'Close menu') : (locale === 'ar' ? 'فتح القائمة' : 'Open menu')}
                aria-expanded={mobileMenuOpen}
                className={cn(
                  'flex size-10 items-center justify-center rounded-sm xl:hidden',
                  ink,
                  onHero ? 'hover:bg-white/10' : 'hover:bg-brand-50',
                )}
              >
                {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-brand-950/25 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: locale === 'ar' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className={cn(
                'fixed inset-y-0 z-50 flex w-[min(20rem,88vw)] flex-col bg-white shadow-2xl xl:hidden',
                locale === 'ar'
                  ? 'end-0 border-s border-[rgba(10,37,68,0.08)]'
                  : 'start-0 border-e border-[rgba(10,37,68,0.08)]',
              )}
              role="dialog"
              aria-modal="true"
              aria-label={locale === 'ar' ? 'القائمة' : 'Menu'}
            >
              <div className="flex items-center justify-between border-b border-[rgba(10,37,68,0.08)] px-5 py-4">
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="h-7 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex size-10 items-center justify-center rounded-sm text-brand-800 hover:bg-brand-50"
                  aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="grid gap-0.5">
                  {allNav.map((item) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.key)}
                        className={cn(
                          'w-full rounded-md px-4 py-3 text-start text-sm font-medium transition-colors',
                          activeSection === item.key
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-[var(--ink-secondary)] hover:bg-brand-50/70 hover:text-brand-800',
                        )}
                      >
                        {t.nav[item.labelKey]}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-3 border-t border-[rgba(10,37,68,0.08)] px-5 py-5">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-[13px] font-medium text-brand-600"
                >
                  <Languages className="size-4" />
                  <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
