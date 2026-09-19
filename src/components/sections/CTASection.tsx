'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { gsap, useGSAP, prefersReducedMotion, revealOnScroll, SCROLL, scrubParallax } from '@/lib/gsap-site';
import { scrollToSection } from '@/lib/scroll-to-section';

export function CTASection() {
  const { t } = useAppStore();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const bg = root.querySelector<HTMLElement>('[data-cta="bg"]');
      const parts = gsap.utils.toArray<HTMLElement>('[data-cta-part]', root);

      if (prefersReducedMotion()) {
        gsap.set(parts, { clearProps: 'opacity,visibility,transform' });
        return;
      }

      if (bg) scrubParallax(bg, root, { from: -6, to: 6, scrub: 1.2 });

      revealOnScroll(parts, {
        trigger: root,
        start: SCROLL.late,
        stagger: 0.1,
        y: 30,
        duration: 0.95,
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      id="cta"
      ref={rootRef}
      className="relative overflow-hidden min-h-[70svh] lg:min-h-[80svh] flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <div data-cta="bg" className="absolute inset-0 will-change-transform">
          <Image
            src="/images/factory-building.webp"
            alt=""
            fill
            sizes="100vw"
            quality={65}
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/70" />
      </div>

      <div className="relative z-10 site-container w-full py-20 lg:py-28">
        <div className="mx-auto max-w-3xl text-center space-y-6 lg:space-y-8">
          <p
            data-cta-part
            className="text-sm font-medium tracking-[-0.01em] text-white/75"
          >
            {t.cta.badge}
          </p>

          <h2
            data-cta-part
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold text-white leading-[1.15] tracking-tight"
          >
            {t.cta.title}
          </h2>

          <p
            data-cta-part
            className="text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
          >
            {t.cta.subtitle}
          </p>

          <div
            data-cta-part
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
          >
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-brand-900 text-xs sm:text-sm font-medium transition-all duration-200 group"
            >
              <span>{t.cta.contact}</span>
              <ArrowUpRight className="size-4 text-brand-200 group-hover:text-brand-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 rtl:rotate-[-90deg]" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('products')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-brand-900 text-xs sm:text-sm font-medium transition-all duration-200 group"
            >
              <span>{t.cta.products}</span>
              <ArrowUpRight className="size-4 text-brand-200 group-hover:text-brand-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 rtl:rotate-[-90deg]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
