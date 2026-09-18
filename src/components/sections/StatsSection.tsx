'use client';

import { useRef } from 'react';
import { useAppStore } from '@/store';
import { useProductionStats } from '@/hooks/use-production-stats';
import { gsap, useGSAP, gsapCountUp, prefersReducedMotion, revealOnScroll, SCROLL } from '@/lib/gsap-site';

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const isNumeric = Boolean(match);
  const targetNum = match ? parseInt(match[2], 10) : 0;
  const valueSuffix = match ? match[3] : '';
  const valuePrefix = match ? match[1] : '';

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (!isNumeric) {
        el.textContent = value;
        return;
      }

      gsapCountUp(el, targetNum, {
        prefix: valuePrefix,
        suffix: valueSuffix,
        duration: prefersReducedMotion() ? 0 : 1.35,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    },
    {
      scope: ref,
      dependencies: [value, isNumeric, targetNum, valuePrefix, valueSuffix],
    },
  );

  return (
    <span ref={ref} className="tabular text-[var(--ink)]">
      {isNumeric ? `${valuePrefix}0${valueSuffix}` : value}
    </span>
  );
}

/** Forma-style: label column + content column (statement + production capacity) */
export function StatsSection() {
  const { t, locale } = useAppStore();
  const capacityItems = useProductionStats();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const label = root.querySelector<HTMLElement>('[data-stats="label"]');
      const statement = root.querySelector<HTMLElement>('[data-stats="statement"]');
      const cards = gsap.utils.toArray<HTMLElement>('[data-stat-card]', root);
      const targets = [label, statement, ...cards].filter(Boolean) as HTMLElement[];

      if (prefersReducedMotion()) {
        gsap.set(targets, { clearProps: 'opacity,visibility,transform' });
        return;
      }

      revealOnScroll(targets, {
        trigger: root,
        start: SCROLL.default,
        stagger: 0.07,
        y: 24,
        duration: 0.95,
      });
    },
    { scope: rootRef, dependencies: [locale, capacityItems.length] },
  );

  return (
    <section
      id="stats"
      ref={rootRef}
      className="relative z-10 overflow-hidden bg-[#F7F9FC] text-[var(--ink)] section-pad"
      aria-labelledby="stats-statement"
    >
      <div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div
            data-stats="label"
            className="flex shrink-0 items-center gap-2.5 self-start"
          >
            <span
              className="size-1.5 shrink-0 rounded-full bg-[var(--ink)]"
              aria-hidden
            />
            <span className="text-sm font-medium text-[var(--ink-secondary)] tracking-[-0.01em]">
              {t.stats.badge}
            </span>
          </div>

          <div data-stats="content" className="min-w-0 w-full lg:max-w-[52rem] xl:max-w-[58rem]">
            <h2
              id="stats-statement"
              data-stats="statement"
              className={`text-[clamp(1.5rem,3.2vw,2.75rem)] font-semibold text-[var(--ink)] mb-14 sm:mb-16 lg:mb-20 w-full ${
                locale === 'ar'
                  ? 'leading-[1.45] tracking-normal'
                  : 'leading-[1.15] tracking-[-0.035em]'
              }`}
            >
              {t.stats.statement}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10 lg:gap-x-12 lg:gap-y-12">
              {capacityItems.map((item) => (
                <div key={item.label} data-stat-card className="min-w-0">
                  <p
                    className={`text-[clamp(2.25rem,5vw,3.75rem)] font-semibold text-[var(--ink)] leading-none ${
                      locale === 'ar' ? 'tracking-normal' : 'tracking-[-0.04em]'
                    }`}
                  >
                    <AnimatedCounter value={item.value} />
                  </p>
                  <p className="mt-2 text-xs font-medium text-[var(--ink-secondary)] tracking-[-0.01em]">
                    {item.unit}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[var(--ink)] leading-snug tracking-[-0.01em]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
