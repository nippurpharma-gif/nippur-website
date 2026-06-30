'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'home', labelKey: 'home' as const },
  { key: 'about', labelKey: 'about' as const },
  { key: 'manufacturing', labelKey: 'manufacturing' as const },
  { key: 'products', labelKey: 'products' as const },
  { key: 'research', labelKey: 'research' as const },
  { key: 'quality', labelKey: 'quality' as const },
  { key: 'sustainability', labelKey: 'sustainability' as const },
  { key: 'careers', labelKey: 'careers' as const },
  { key: 'news', labelKey: 'news' as const },
  { key: 'contact', labelKey: 'contact' as const },
];

const DEFAULT_LOGO = '/images/logo-nippur.png';

export function Header() {
  const { locale, setLocale, t, activeSection, mobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const logoUrl = settings?.logoUrl || DEFAULT_LOGO;
  const companyName = settings
    ? (locale === 'ar' ? settings.companyNameAr : settings.companyNameEn)
    : 'NIPPUR Pharma';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((key: string) => {
    const el = document.getElementById(key);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  }, [setMobileMenuOpen]);

  const toggleLanguage = useCallback((newLocale: 'en' | 'ar') => {
    setLocale(newLocale);
    localStorage.setItem('nippur-locale', newLocale);
    setShowLangMenu(false);
  }, [setLocale]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass border-b border-border/60 shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('hero')}
              className="flex items-center gap-3 group"
            >
              <img
                src={logoUrl}
                alt={companyName}
                className="h-10 lg:h-12 w-auto object-contain"
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  className={cn(
                    'px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 relative',
                    activeSection === item.key
                      ? 'text-brand-700'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  {t.nav[item.labelKey]}
                  {activeSection === item.key && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-brand-600 rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{locale === 'en' ? 'EN' : 'عر'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {showLangMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 top-full mt-1 w-36 rounded-xl border border-border bg-card shadow-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleLanguage('en')}
                        className={cn('w-full px-4 py-2.5 text-sm text-start hover:bg-accent transition-colors', locale === 'en' && 'text-brand-700 font-semibold bg-brand-50')}
                      >
                        English
                      </button>
                      <button
                        onClick={() => toggleLanguage('ar')}
                        className={cn('w-full px-4 py-2.5 text-sm text-start hover:bg-accent transition-colors', locale === 'ar' && 'text-brand-700 font-semibold bg-brand-50')}
                      >
                        العربية
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => scrollToSection('contact')}
                size="sm"
                className="hidden sm:flex bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/15 text-xs font-semibold tracking-wide"
              >
                {t.nav.getQuote}
              </Button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm xl:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={cn(
                'fixed top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card border-border shadow-2xl xl:hidden',
                locale === 'ar' ? 'right-0 border-s' : 'left-0 border-e'
              )}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <img src={logoUrl} alt={companyName} className="h-8 w-auto object-contain" />
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-accent">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-1">
                    {navItems.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => scrollToSection(item.key)}
                        className={cn(
                          'w-full px-4 py-3 text-sm font-medium rounded-lg text-start transition-colors',
                          activeSection === item.key
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                      >
                        {t.nav[item.labelKey]}
                      </button>
                    ))}
                  </div>
                </nav>
                <div className="p-4 border-t border-border space-y-2">
                  <button
                    onClick={() => toggleLanguage(locale === 'en' ? 'ar' : 'en')}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    {locale === 'en' ? 'اللغة العربية' : 'English'}
                  </button>
                  <Button onClick={() => scrollToSection('contact')} className="w-full bg-brand-600 hover:bg-brand-700 text-white">
                    {t.nav.getQuote}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}