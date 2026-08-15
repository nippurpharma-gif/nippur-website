'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { gsap, useGSAP, prefersReducedMotion, EASE } from '@/lib/gsap-site';
import { scrollToSection } from '@/lib/scroll-to-section';

export function CTASection() {
  const { t, locale } = useAppStore();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const bg = root.querySelector<HTMLElement>('[data-cta="bg"]');
      const parts = gsap.utils.toArray<HTMLElement>('[data-cta-part]', root);

      if (prefersReducedMotion()) {
        gsap.set(parts, { autoAlpha: 1, y: 0 });
        return;
      }

      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.08 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: root,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 72%',
            toggleActions: 'play none none none',
          },
        })
        .from(parts, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: EASE,
        });
    },
    { scope: rootRef, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <section
      id="cta"
      ref={rootRef}
      className="relative overflow-hidden min-h-[70svh] lg:min-h-[80svh] flex items-center justify-center"
    >
      <div className="absolute inset-0 z-0">
        <div
          data-cta="bg"
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{ backgroundImage: "url('/images/factory-building.png')" }}
          role="img"
          aria-hidden
        />
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
