'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';

const DEFAULT_LOGO = '/images/logo-nippur.png';

export function Footer() {
  const { t, locale, setViewMode } = useAppStore();
  const { settings } = useSiteSettings();

  const logoUrl = settings?.logoUrl || DEFAULT_LOGO;
  const companyName = settings
    ? (locale === 'ar' ? settings.companyNameAr : settings.companyNameEn)
    : 'NIPPUR Pharma';

  const description = settings
    ? locale === 'ar'
      ? settings.descriptionAr
      : settings.descriptionEn
    : '';

  const scrollToSection = (key: string) => {
    const el = document.getElementById(key);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <img src={logoUrl} alt={companyName} className="h-14 w-auto object-contain mb-4 brightness-0 invert" />
            {description && (
              <p className="text-brand-200/70 text-sm leading-relaxed mb-6">
                {description}
              </p>
            )}
            <div className="flex flex-col gap-2 text-sm text-brand-200/70">
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-brand-300 transition-colors">
                  <Mail className="w-4 h-4" />
                  {settings.email}
                </a>
              )}
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-brand-300 transition-colors">
                  <Phone className="w-4 h-4" />
                  {settings.phone}
                </a>
              )}
              {settings?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {settings.address}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-300 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.footer.about, section: 'about' },
                { label: t.footer.manufacturing, section: 'manufacturing' },
                { label: t.footer.products, section: 'products' },
                { label: t.footer.research, section: 'research' },
                { label: t.footer.quality, section: 'quality' },
              ].map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-sm text-brand-200/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-300 mb-4">
              {t.footer.company}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t.footer.careers, section: 'careers' },
                { label: t.footer.news, section: 'news' },
                { label: t.footer.contact, section: 'contact' },
              ].map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-sm text-brand-200/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-300 mb-4">
              {t.footer.newsletter}
            </h4>
            <p className="text-sm text-brand-200/70 mb-4">
              {t.footer.newsletterDesc}
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="bg-brand-900 border-brand-800 text-white placeholder:text-brand-200/40 focus-visible:ring-brand-500"
              />
              <Button className="bg-brand-600 hover:bg-brand-500 text-white shrink-0">
                {t.footer.subscribe}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-brand-200/50">
              {t.footer.copyright}
            </p>
            <p className="text-xs text-brand-200/50">
              {t.footer.tagline}
            </p>
            <button
              onClick={() => setViewMode('login')}
              className="text-xs text-brand-200/20 hover:text-brand-200/50 transition-colors"
              title="Admin"
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 end-6 z-40 w-11 h-11 rounded-full bg-brand-700 hover:bg-brand-600 text-white shadow-lg shadow-brand-700/30 flex items-center justify-center transition-colors"
      >
        <ArrowUp className="w-4 h-4" />
      </motion.button>
    </footer>
  );
}