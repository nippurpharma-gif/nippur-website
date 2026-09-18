'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  TestTube2,
  FlaskConical,
  CheckCircle2,
  Award,
  Check,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion, revealOnScroll, SCROLL } from '@/lib/gsap-site';

function pinOffsetPx(): number {
  const header = document.querySelector('header');
  const headerH = header?.getBoundingClientRect().height ?? 68;
  return Math.round(headerH + 20);
}

const standardIcons: Record<string, React.ReactNode> = {
  'shield-check': <ShieldCheck className="size-5" />,
  test: <TestTube2 className="size-5" />,
  flask: <FlaskConical className="size-5" />,
  'check-circle': <CheckCircle2 className="size-5" />,
};

export function QualitySection() {
  const { t, locale } = useAppStore();
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = sectionRef.current;
      if (!root) return;

      const headerNodes = root.querySelectorAll('[data-quality-header]');
      const stack = root.querySelector<HTMLElement>('[data-quality-stack]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-standard-item]', root);
      const certBar = root.querySelector<HTMLElement>('[data-certifications-bar]');
      const certBadges = gsap.utils.toArray<HTMLElement>('[data-cert-badge]', root);

      if (headerNodes.length) {
        revealOnScroll(headerNodes, {
          trigger: root,
          start: SCROLL.default,
          stagger: 0.08,
          y: 22,
        });
      }

      const mm = gsap.matchMedia();

      mm.add('(min-width: 1024px)', () => {
        if (!stack || cards.length < 2 || prefersReducedMotion()) return;

        const start = () => `top ${pinOffsetPx()}px`;
        const last = cards[cards.length - 1];

        cards.forEach((card, i) => {
          const inner = card.querySelector<HTMLElement>('[data-standard-inner]');

          ScrollTrigger.create({
            trigger: card,
            start,
            endTrigger: last,
            end: start,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });

          if (!inner || i === cards.length - 1) return;

          gsap.fromTo(
            inner,
            { scale: 1, opacity: 1 },
            {
              scale: 0.98,
              opacity: 0.5,
              ease: 'none',
              scrollTrigger: {
                trigger: cards[i + 1],
                start: 'top bottom',
                end: start,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );
        });

        const onLoad = () => ScrollTrigger.refresh();
        window.addEventListener('load', onLoad);
        return () => window.removeEventListener('load', onLoad);
      });

      mm.add('(max-width: 1023px)', () => {
        if (prefersReducedMotion()) return;
        const inners = cards
          .map((card) => card.querySelector<HTMLElement>('[data-standard-inner]'))
          .filter(Boolean) as HTMLElement[];
        revealOnScroll(inners, {
          trigger: stack ?? root,
          start: SCROLL.default,
          stagger: 0.1,
          y: 24,
        });
      });

      if (certBar && certBadges.length && !prefersReducedMotion()) {
        revealOnScroll([certBar, ...certBadges], {
          trigger: certBar,
          start: SCROLL.default,
          stagger: 0.05,
          y: 18,
        });
      }

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <SectionWrapper id="quality" dark overflowVisible>
      <div ref={sectionRef} className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div
          
            data-quality-left
            className="lg:col-span-5 lg:sticky lg:top-[6.5rem] lg:self-start space-y-6"
          >
            {/* Quality Badge */}
            <div data-quality-header className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-brand-400" aria-hidden />
              <span className="text-sm font-medium tracking-wide uppercase text-brand-300">
                {t.quality.badge}
              </span>
            </div>

            <h2
              data-quality-header
              className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.15]"
            >
              {t.quality.title}
            </h2>

            <p
              data-quality-header
              className="text-base sm:text-lg text-brand-100/75 leading-relaxed"
            >
              {t.quality.subtitle}
            </p>
          </div>
          {/* Standards Stack */}
          <div data-quality-stack className="lg:col-span-7">
            {t.quality.standards.map((standard, index) => {
              const numTag = standard.num || `/0${index + 1}`;
              return (
                <article
                  key={numTag}
                  data-standard-item
                  className="group relative bg-brand-950 pt-8 lg:pt-6 lg:pb-6 pb-4"
                  style={{ zIndex: index + 1 }}
                >
                  <div
                    data-standard-inner
                    className={`grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch origin-top ${
                      index > 0 ? 'border-t border-white/10 pt-8 lg:pt-10' : ''
                    }`}
                  >
                    <div
                      data-standard-text
                      className="md:col-span-7 flex flex-col justify-between gap-4 min-h-0"
                    >
                      {/* Standard Item Content */}
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-base sm:text-lg font-semibold tracking-wider text-brand-400">
                            {numTag}
                          </span>
                          <div className="size-9 rounded-xl bg-white/10 text-brand-300 flex items-center justify-center border border-white/10 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                            {standardIcons[standard.icon]}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {standard.title}
                        </h3>

                        <p className="text-sm sm:text-base text-brand-100/75 leading-relaxed">
                          {standard.desc}
                        </p>
                      </div>
                    </div>
                    {/* Standard Item Image */}
                    <div data-standard-image className="md:col-span-5 min-h-[200px] md:min-h-0">
                      <div className="relative h-full min-h-[200px] rounded-2xl overflow-hidden border border-white/10">
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent z-10 pointer-events-none" />
                        <Image
                          src={standard.image || '/images/quality-control.png'}
                          alt={standard.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 28vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

            {/* Certifications Bar */}
        <div
          data-certifications-bar
          className="mt-16 lg:mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9 lg:p-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="size-11 rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center justify-center shrink-0">
              <Award className="size-5.5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {t.quality.certifications.title}
              </h3>
              <p className="text-xs sm:text-sm text-brand-200/70 mt-0.5">
                {locale === 'ar'
                  ? 'معتمدون وممتثلون لأعلى الهيئات الصحية والتنظيمية المحلية والدولية'
                  : 'Fully certified and compliant with global health regulatory authorities'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {t.quality.certifications.items.map((item, index) => (
              <div
                key={index}
                data-cert-badge
                className="flex items-center gap-3 py-4 px-5 rounded-xl bg-white/5"
              >
                <div className="flex-shrink-0 size-6 rounded-full bg-brand-500/30 text-brand-300 border border-brand-400/40 flex items-center justify-center">
                  <Check className="size-3.5" />
                </div>
                <span className="text-sm font-medium text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
