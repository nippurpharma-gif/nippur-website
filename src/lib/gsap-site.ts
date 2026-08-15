'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const EASE = 'power3.out';
export const EASE_SOFT = 'power2.out';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function shouldAvoidSplitText(el: HTMLElement): boolean {
  if (typeof document !== 'undefined' && document.documentElement.dir === 'rtl') {
    return true;
  }
  return isArabicText(el.textContent ?? '');
}

/** Hero entrance — brand → label → title → subtitle → CTAs (stats live in StatsSection) */
export function createHeroGsapTimeline(root: HTMLElement): gsap.core.Timeline | null {
  const nodes = root.querySelectorAll<HTMLElement>('[data-hero]');
  if (prefersReducedMotion()) {
    gsap.set(nodes, { autoAlpha: 1, y: 0, clearProps: 'transform' });
    return null;
  }

  const brand = root.querySelector<HTMLElement>('[data-hero="brand"]');
  const label = root.querySelector<HTMLElement>('[data-hero="label"]');
  const title = root.querySelector<HTMLElement>('[data-hero="title"]');
  const subtitle = root.querySelector<HTMLElement>('[data-hero="subtitle"]');
  const cta = root.querySelector<HTMLElement>('[data-hero="cta"]');
  const bg = root.querySelector<HTMLElement>('[data-hero="bg"]');

  const tl = gsap.timeline({ defaults: { ease: EASE } });

  if (bg) {
    gsap.fromTo(
      bg,
      { scale: 1.08 },
      { scale: 1, duration: 1.65, ease: 'power2.out' },
    );
  }

  if (brand) {
    tl.from(brand, { y: 12, autoAlpha: 0, duration: 0.4 }, 0.08);
  }

  if (label) {
    tl.from(label, { y: 12, autoAlpha: 0, duration: 0.4 }, '-=0.18');
  }

  if (title) {
    // Brand wordmark stays one fitted line — no SplitText (preserves width fit EN/AR)
    tl.from(title, { y: 22, autoAlpha: 0, duration: 0.75 }, '-=0.1');
  }

  if (subtitle) {
    tl.from(subtitle, { y: 16, autoAlpha: 0, duration: 0.55 }, '-=0.38');
  }

  if (cta) {
    tl.from(cta, { y: 14, autoAlpha: 0, duration: 0.5 }, '-=0.32');
  }

  return tl;
}

export function gsapCountUp(
  el: HTMLElement,
  target: number,
  options?: {
    duration?: number;
    suffix?: string;
    prefix?: string;
    scrollTrigger?: ScrollTrigger.Vars | boolean;
  },
) {
  const write = (n: number) => {
    el.textContent = `${options?.prefix ?? ''}${Math.round(n).toLocaleString('en-US')}${options?.suffix ?? ''}`;
  };

  if (prefersReducedMotion()) {
    write(target);
    return null;
  }

  const proxy = { val: 0 };
  const st =
    options?.scrollTrigger === true
      ? { trigger: el, start: 'top 88%', toggleActions: 'play none none none' as const }
      : options?.scrollTrigger === false || options?.scrollTrigger === undefined
        ? undefined
        : options.scrollTrigger;

  return gsap.to(proxy, {
    val: target,
    duration: options?.duration ?? 1.4,
    ease: EASE_SOFT,
    snap: { val: 1 },
    onUpdate: () => write(proxy.val),
    ...(st ? { scrollTrigger: st } : {}),
  });
}

/** Section header — stacked label + title + subtitle (no SplitText, always visible) */
export function revealSectionHeader(
  scope: HTMLElement,
  options?: { start?: string },
) {
  const label = scope.querySelector<HTMLElement>('[data-section-header="label"]');
  const title = scope.querySelector<HTMLElement>('[data-section-header="title"]');
  const subtitle = scope.querySelector<HTMLElement>(
    '[data-section-header="subtitle"]',
  );

  if (!label && !title && !subtitle) return;

  const nodes = [label, title, subtitle].filter(Boolean) as HTMLElement[];
  gsap.set(nodes, { autoAlpha: 1, clearProps: 'opacity,visibility' });

  if (prefersReducedMotion()) {
    gsap.set(nodes, { y: 0, yPercent: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: scope,
      start: options?.start ?? 'top 80%',
      toggleActions: 'play none none none',
    },
    defaults: { ease: EASE },
  });

  if (label) {
    tl.from(label, { y: 12, duration: 0.45 }, 0);
  }

  if (title) {
    tl.from(title, { y: 18, duration: 0.65 }, '-=0.12');
  }

  if (subtitle) {
    tl.from(subtitle, { y: 14, duration: 0.55 }, '-=0.35');
  }
}

/** Soft word/line reveal — skips SplitText for Arabic (shaping-safe fade). */
export function animateSplitHeading(
  el: HTMLElement,
  options?: { start?: string; delay?: number; immediate?: boolean },
) {
  if (prefersReducedMotion()) {
    gsap.set(el, { autoAlpha: 1 });
    return null;
  }

  const isRtl =
    document.documentElement.dir === 'rtl' ||
    isArabicText(el.textContent ?? '');

  if (isRtl) {
    return gsap.from(el, {
      y: 22,
      autoAlpha: 0,
      duration: 0.75,
      ease: EASE,
      delay: options?.delay ?? 0,
      ...(options?.immediate
        ? {}
        : {
            scrollTrigger: {
              trigger: el,
              start: options?.start ?? 'top 85%',
              toggleActions: 'play none none none',
            },
          }),
    });
  }

  const run = () =>
    SplitText.create(el, {
      type: 'words,lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.words, {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.035,
          ease: EASE,
          delay: options?.delay ?? 0,
          ...(options?.immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: options?.start ?? 'top 85%',
                  toggleActions: 'play none none none',
                },
              }),
        });
      },
    });

  if (document.fonts?.status === 'loaded') return run();
  return document.fonts.ready.then(run);
}

export function scrollFadeUp(
  targets: gsap.TweenTarget,
  trigger: Element | null,
  options?: { stagger?: number; y?: number; start?: string },
) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  gsap.from(targets, {
    y: options?.y ?? 28,
    autoAlpha: 0,
    duration: 0.7,
    stagger: options?.stagger ?? 0.07,
    ease: EASE,
    scrollTrigger: {
      trigger: trigger ?? undefined,
      start: options?.start ?? 'top 85%',
      toggleActions: 'play none none none',
    },
  });
}

/** Alias for counter animations */
export const animateCounter = gsapCountUp;
