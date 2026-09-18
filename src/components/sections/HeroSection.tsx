'use client';

import { useLayoutEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { useActiveSection } from './SectionWrapper';
import { createHeroGsapTimeline, createHeroScrollParallax, useGSAP } from '@/lib/gsap-site';
import { scrollToSection } from '@/lib/scroll-to-section';

/**
 * Fit a single-line display title exactly to the container width.
 * Measures at a known base size, then scales by width ratio (EN + AR, all viewports).
 */
function fitTitleToWidth(el: HTMLElement, container: HTMLElement) {
  const target = container.clientWidth;
  if (target <= 0) return;

  const prevWidth = el.style.width;
  const prevWhiteSpace = el.style.whiteSpace;
  const prevDisplay = el.style.display;

  el.style.display = 'inline-block';
  el.style.width = 'max-content';
  el.style.whiteSpace = 'nowrap';
  el.style.fontSize = '100px';

  const measured = el.getBoundingClientRect().width;
  if (measured <= 0) {
    el.style.width = prevWidth;
    el.style.whiteSpace = prevWhiteSpace;
    el.style.display = prevDisplay;
    return;
  }

  const next = (target / measured) * 100;
  el.style.fontSize = `${Math.max(16, next)}px`;

  const after = el.getBoundingClientRect().width;
  if (after > 0 && Math.abs(after - target) > 0.5) {
    el.style.fontSize = `${Math.max(16, next * (target / after))}px`;
  }

  el.style.width = '100%';
  el.style.display = 'block';
  el.style.whiteSpace = 'nowrap';
}

export function HeroSection() {
  const { t, locale } = useAppStore();
  useActiveSection();
  const rootRef = useRef<HTMLElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const wrap = titleWrapRef.current;
    const title = titleRef.current;
    if (!wrap || !title) return;

    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fitTitleToWidth(title, wrap));
    };

    run();

    const ro = new ResizeObserver(run);
    ro.observe(wrap);

    const onFonts = () => run();
    void document.fonts?.ready.then(onFonts);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [locale]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const start = () => {
        const wrap = titleWrapRef.current;
        const title = titleRef.current;
        if (wrap && title) fitTitleToWidth(title, wrap);
        createHeroGsapTimeline(root);
        createHeroScrollParallax(root);
      };

      if (document.fonts?.status === 'loaded') {
        start();
      } else {
        void document.fonts.ready.then(start);
      }
    },
    { scope: rootRef, dependencies: [locale], revertOnUpdate: true },
  );

  const brandTitle = locale === 'ar' ? 'نيـبـور فـارمـا' : 'Nippur Pharma';

  return (
    <section
      id="hero"
      ref={rootRef}
      className="sticky top-0 z-0 min-h-[100svh] flex flex-col justify-end overflow-hidden bg-neutral-950 pb-5 sm:pb-8 lg:pb-10"
    >
      {/* Media layer is isolated so GSAP transforms never lift the sticky section above page content */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          data-hero="bg"
          className="absolute inset-[-8%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/factory-real.jpeg')" }}
          role="img"
          aria-label={
            locale === 'ar'
              ? 'منشأة نيبور فارما للتصنيع الدوائي'
              : 'NIPPUR Pharma manufacturing facility'
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/92" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,0,0,0.45),transparent_70%)]" />
      </div>

      <div
        key={locale}
        className="relative z-[1] site-container flex flex-col justify-end w-full"
      >
        <div className="max-w-md lg:max-w-lg space-y-3 mb-5 lg:mb-8">
          <p
            data-hero="subtitle"
            className="text-sm sm:text-base leading-relaxed text-neutral-200/90 font-normal tracking-[-0.01em]"
          >
            {t.hero.subtitle}
          </p>

          <div data-hero="cta" className="relative pt-0.5">
            <button
              type="button"
              onClick={() => scrollToSection('products')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-brand-900 text-xs sm:text-sm font-medium transition-all duration-200 group"
            >
              <span>{t.hero.cta1}</span>
              <ArrowUpRight className="size-4 text-brand-200 group-hover:text-brand-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 rtl:rotate-[-90deg]" />
            </button>
          </div>
        </div>

        <div ref={titleWrapRef} className="w-full min-w-0 overflow-hidden">
          <h1
            ref={titleRef}
            data-hero="title"
            className={`pointer-events-none block w-full leading-[0.9] text-white select-none whitespace-nowrap ${
              locale === 'ar'
                ? 'tracking-normal pb-6 sm:pb-8'
                : 'tracking-[-0.045em] font-medium pb-6 sm:pb-8 xl:pb-0'
            }`}
            style={{ fontSize: 'clamp(1.5rem, 12vw, 8rem)' }}
          >
            {brandTitle}
          </h1>
        </div>
      </div>
    </section>
  );
}
