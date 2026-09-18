'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { motionTransition } from '@/lib/motion-craft';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { scrollToSection } from '@/lib/scroll-to-section';
import {
  DEFAULT_HOMEPAGE_SECTIONS,
  isSectionVisible,
  type ManagedSectionKey,
} from '@/lib/homepage-sections';
import { gsap, useGSAP, prefersReducedMotion, revealOnScroll, SCROLL } from '@/lib/gsap-site';

function fitWordmark(el: HTMLElement, container: HTMLElement) {
  const target = container.clientWidth;
  if (target <= 0) return;

  el.style.display = 'inline-block';
  el.style.width = 'max-content';
  el.style.whiteSpace = 'nowrap';
  el.style.fontSize = '100px';

  const measured = el.getBoundingClientRect().width;
  if (measured <= 0) return;

  const next = (target / measured) * 100;
  el.style.fontSize = `${Math.max(28, next)}px`;

  const after = el.getBoundingClientRect().width;
  if (after > 0 && Math.abs(after - target) > 0.5) {
    el.style.fontSize = `${Math.max(28, next * (target / after))}px`;
  }

  el.style.width = '100%';
  el.style.display = 'block';
}

export function Footer() {
  const { t, locale } = useAppStore();
  const { settings } = useSiteSettings();
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const wordWrapRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLParagraphElement>(null);

  const scrollToTop = () => {
    scrollToSection('hero');
  };

  useLayoutEffect(() => {
    const wrap = wordWrapRef.current;
    const word = wordRef.current;
    if (!wrap || !word) return;

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitWordmark(word, wrap));
    };

    run();
    const ro = new ResizeObserver(run);
    ro.observe(wrap);
    void document.fonts?.ready.then(run);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [locale]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || prefersReducedMotion()) return;

      const columns = gsap.utils.toArray<HTMLElement>('[data-footer-col]', root);
      const word = wordRef.current;

      if (columns.length) {
        revealOnScroll(columns, {
          trigger: root,
          start: SCROLL.late,
          stagger: 0.09,
          y: 24,
        });
      }

      if (word) {
        revealOnScroll(word, {
          trigger: wordWrapRef.current ?? word,
          start: 'top 92%',
          y: 36,
          duration: 1.05,
        });
      }
    },
    { scope: rootRef, dependencies: [locale], revertOnUpdate: true },
  );

  const sections = settings?.homepageSections?.length
    ? settings.homepageSections
    : DEFAULT_HOMEPAGE_SECTIONS;

  const show = (key: ManagedSectionKey) => isSectionVisible(sections, key);

  const navLinks = [
    { label: t.nav.home, section: 'hero' },
    { label: t.nav.about, section: 'about' },
    ...(show('products') ? [{ label: t.nav.products, section: 'products' }] : []),
    ...(show('manufacturing')
      ? [{ label: t.nav.manufacturing, section: 'manufacturing' }]
      : []),
    { label: t.nav.contact, section: 'contact' },
  ];

  const moreLinks = [
    ...(show('careers') ? [{ label: t.footer.careers, href: '/careers' }] : []),
    ...(show('news') ? [{ label: t.footer.news, href: '/news' }] : []),
    ...(show('quality') ? [{ label: t.footer.quality, section: 'quality' }] : []),
  ];

  const contactLines = [
    settings?.email,
    settings?.phone,
    settings?.address,
  ].filter(Boolean) as string[];

  return (
    <footer ref={rootRef} className="bg-[#0B1220] text-white">
      <div className="site-container pt-16 lg:pt-24 pb-8 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div data-footer-col className="lg:col-span-5">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-8">
              {t.footer.newsletter}
            </h2>
            <form
              className="flex items-center gap-3 max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex-1 min-w-0">
                <span className="sr-only">{t.footer.emailPlaceholder}</span>
                <input
                  type="email"
                  required
                  placeholder={t.footer.emailPlaceholder}
                  className="w-full bg-transparent border-0 border-b border-white/40 pb-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-white transition-colors"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-brand-900 text-xs sm:text-sm font-medium transition-all duration-200 group shrink-0"
              >
                <span>{t.footer.subscribe}</span>
                <ArrowUpRight className="size-4 text-brand-200 group-hover:text-brand-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 rtl:rotate-[-90deg]" />
              </button>
            </form>
            <p className="mt-4 text-xs text-white/45 max-w-sm leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
          </div>

          <nav
            data-footer-col
            className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8"
            aria-label={locale === 'ar' ? 'روابط التذييل' : 'Footer'}
          >
            <div>
              <ul className="space-y-2.5">
                {navLinks.map((link) => (
                  <li key={link.section}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(link.section)}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ul className="space-y-2.5">
                {moreLinks.map((link) => (
                  <li key={'href' in link ? link.href : link.section}>
                    {'href' in link && link.href ? (
                      <a
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scrollToSection(link.section!)}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <ul className="space-y-2.5">
                {contactLines.map((line) => (
                  <li key={line} className="text-sm text-white/70 break-words">
                    {line}
                  </li>
                ))}
                {contactLines.length === 0 && (
                  <li className="text-sm text-white/70">Iraq</li>
                )}
              </ul>
            </div>
          </nav>
        </div>

        <div
          data-footer-col
          className="mt-16 lg:mt-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] sm:text-xs text-white/45"
        >
          <p>
            <span>{t.footer.privacy}</span>
            <span className="mx-1.5">·</span>
            <span>{t.footer.terms}</span>
          </p>
          <p>{t.footer.copyright}</p>
        </div>

        <div ref={wordWrapRef} className="mt-10 lg:mt-14 w-full min-w-0 overflow-hidden">
          <p
            ref={wordRef}
            aria-label={locale === 'ar' ? 'نيبور فارما' : 'Nippur Pharma'}
            className={`block w-full select-none whitespace-nowrap font-semibold leading-[0.85] text-white will-change-transform ${
              locale === 'ar' ? 'tracking-normal h-90' : 'tracking-[-0.05em]'
            }`}
          >
            {locale === 'ar' ? 'نيبور فارما' : 'Nippur Pharma'}
          </p>
        </div>
      </div>

      <motion.button
        onClick={scrollToTop}
        whileHover={reduced ? undefined : { y: -2 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={motionTransition.fadeFast}
        aria-label={locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
        className="fixed bottom-6 end-6 z-40 w-11 h-11 rounded-full border border-blue-500/20 bg-white/10 backdrop-blur-xs hover:bg-white hover:text-brand-900 text-white flex items-center justify-center transition-colors"
      >
        <ArrowUp className="w-4 h-4 text-blue-500" />
      </motion.button>
    </footer>
  );
}
