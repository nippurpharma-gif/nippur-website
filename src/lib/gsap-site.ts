'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: 'power2.out', duration: 0.9 });
  gsap.config({ nullTargetWarn: false });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const EASE = 'power2.out';
export const EASE_SOFT = 'power2.out';
export const EASE_EXPO = 'expo.out';

/** One shared scroll start — avoids competing triggers firing at different thresholds */
export const SCROLL = {
  early: 'top 88%',
  default: 'top 82%',
  late: 'top 75%',
} as const;

const REVEAL_Y = 28;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isArabicText(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function clearReveal(els: gsap.TweenTarget) {
  gsap.set(els, { clearProps: 'opacity,visibility,transform' });
}

function isLiveElement(el: Element | null | undefined): el is HTMLElement {
  return !!el && el instanceof HTMLElement && el.isConnected;
}

/**
 * Scrubbed yPercent parallax — validates nodes are mounted before creating
 * ScrollTrigger (avoids GSAP crash on RTL/LTR locale flips).
 */
export function scrubParallax(
  target: HTMLElement,
  trigger: HTMLElement,
  options?: {
    from?: number;
    to?: number;
    scrub?: number;
    start?: string;
    end?: string;
  },
) {
  if (prefersReducedMotion()) return null;
  if (!isLiveElement(target) || !isLiveElement(trigger)) return null;

  return gsap.fromTo(
    target,
    { yPercent: options?.from ?? -6 },
    {
      yPercent: options?.to ?? 6,
      ease: 'none',
      force3D: false,
      overwrite: 'auto',
      scrollTrigger: {
        trigger,
        start: options?.start ?? 'top bottom',
        end: options?.end ?? 'bottom top',
        scrub: options?.scrub ?? 1.2,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
      },
    },
  );
}

/**
 * Best-practice scroll reveal: set hidden state first, then animate TO visible.
 * Avoids the classic `from()` flicker (visible → jump to hidden → animate).
 */
export function revealOnScroll(
  targets: gsap.TweenTarget,
  options?: {
    trigger?: Element | string | null;
    start?: string;
    y?: number;
    duration?: number;
    stagger?: number | gsap.StaggerVars;
    delay?: number;
  },
) {
  const els = gsap.utils.toArray<HTMLElement>(targets).filter(isLiveElement);
  if (!els.length) return null;

  if (prefersReducedMotion()) {
    clearReveal(els);
    return null;
  }

  let trigger: Element | null = els[0];
  if (typeof options?.trigger === 'string') {
    trigger = document.querySelector(options.trigger);
  } else if (options?.trigger) {
    trigger = options.trigger;
  }
  if (!trigger || (trigger instanceof HTMLElement && !trigger.isConnected)) {
    return null;
  }

  const y = options?.y ?? REVEAL_Y;
  gsap.set(els, { opacity: 0, y });

  return gsap.to(els, {
    opacity: 1,
    y: 0,
    duration: options?.duration ?? 0.9,
    stagger: options?.stagger ?? 0,
    delay: options?.delay ?? 0,
    ease: EASE,
    overwrite: 'auto',
    force3D: false,
    scrollTrigger: {
      trigger,
      start: options?.start ?? SCROLL.default,
      once: true,
      fastScrollEnd: true,
      invalidateOnRefresh: true,
    },
  });
}

/** Hero entrance — opacity-only on copy (no y/force3D) so sticky stacking stays intact */
export function createHeroGsapTimeline(root: HTMLElement): gsap.core.Timeline | null {
  const brand = root.querySelector<HTMLElement>('[data-hero="brand"]');
  const label = root.querySelector<HTMLElement>('[data-hero="label"]');
  const title = root.querySelector<HTMLElement>('[data-hero="title"]');
  const subtitle = root.querySelector<HTMLElement>('[data-hero="subtitle"]');
  const cta = root.querySelector<HTMLElement>('[data-hero="cta"]');
  const bg = root.querySelector<HTMLElement>('[data-hero="bg"]');
  const nodes = [brand, label, title, subtitle, cta].filter(Boolean) as HTMLElement[];

  if (prefersReducedMotion()) {
    gsap.set(nodes, { clearProps: 'opacity' });
    return null;
  }

  // Opacity only — transform on sticky descendants breaks z-index vs following content
  gsap.set(nodes, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: EASE, overwrite: 'auto' } });

  if (bg) {
    gsap.fromTo(
      bg,
      { scale: 1.05 },
      { scale: 1, duration: 1.8, ease: 'power1.out', force3D: false },
    );
  }

  if (brand) tl.to(brand, { opacity: 1, duration: 0.55 }, 0.12);
  if (label) tl.to(label, { opacity: 1, duration: 0.55 }, '-=0.35');
  if (title) tl.to(title, { opacity: 1, duration: 0.85 }, '-=0.28');
  if (subtitle) tl.to(subtitle, { opacity: 1, duration: 0.65 }, '-=0.5');
  if (cta) tl.to(cta, { opacity: 1, duration: 0.55 }, '-=0.4');

  return tl;
}

/**
 * Parallax the media layer only. Keep force3D off so the sticky hero
 * does not promote above the page content stack.
 */
export function createHeroScrollParallax(root: HTMLElement) {
  const bg = root.querySelector<HTMLElement>('[data-hero="bg"]');
  if (!bg) return null;
  return scrubParallax(bg, root, {
    from: -4,
    to: 8,
    scrub: 1.4,
    start: 'top top',
    end: 'bottom top',
  });
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
      ? { trigger: el, start: SCROLL.early, once: true }
      : options?.scrollTrigger === false || options?.scrollTrigger === undefined
        ? undefined
        : options.scrollTrigger;

  return gsap.to(proxy, {
    val: target,
    duration: options?.duration ?? 1.35,
    ease: EASE_SOFT,
    snap: { val: 1 },
    onUpdate: () => write(proxy.val),
    ...(st ? { scrollTrigger: st } : {}),
  });
}

/** Section header — one timeline, set → to */
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

  if (prefersReducedMotion()) {
    clearReveal(nodes);
    return;
  }

  gsap.set(nodes, { opacity: 0, y: 22 });

  const tl = gsap.timeline({
    defaults: { ease: EASE, overwrite: 'auto', force3D: false },
    scrollTrigger: {
      trigger: scope,
      start: options?.start ?? SCROLL.early,
      once: true,
      fastScrollEnd: true,
    },
  });

  if (label) tl.to(label, { opacity: 1, y: 0, duration: 0.55 }, 0);
  if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, 0.08);
  if (subtitle) tl.to(subtitle, { opacity: 1, y: 0, duration: 0.7 }, 0.18);
}

/** Soft word/line reveal — skips SplitText for Arabic */
export function animateSplitHeading(
  el: HTMLElement,
  options?: { start?: string; delay?: number; immediate?: boolean },
) {
  if (prefersReducedMotion()) {
    clearReveal(el);
    return null;
  }

  const isRtl =
    document.documentElement.dir === 'rtl' ||
    isArabicText(el.textContent ?? '');

  if (isRtl) {
    if (options?.immediate) {
      gsap.set(el, { opacity: 0, y: 22, force3D: true });
      return gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: options?.delay ?? 0,
        ease: EASE,
      });
    }
    return revealOnScroll(el, {
      start: options?.start,
      delay: options?.delay,
      y: 22,
    });
  }

  const run = () =>
    SplitText.create(el, {
      type: 'words,lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(self.words, { yPercent: 100, opacity: 0 });
        return gsap.to(self.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.028,
          ease: EASE,
          delay: options?.delay ?? 0,
          scrollTrigger: {
            trigger: el,
            start: options?.start ?? SCROLL.default,
            once: true,
            fastScrollEnd: true,
          },
        });
      },
    });

  if (document.fonts?.status === 'loaded') return run();
  return document.fonts.ready.then(run);
}

export function scrollFadeUp(
  targets: gsap.TweenTarget,
  trigger: Element | null,
  options?: { stagger?: number; y?: number; start?: string; duration?: number },
) {
  return revealOnScroll(targets, {
    trigger,
    stagger: options?.stagger ?? 0.07,
    y: options?.y,
    start: options?.start,
    duration: options?.duration,
  });
}

/** Gentle scrub parallax — transform only, no clip-path (avoids flicker) */
export function parallaxMedia(
  media: HTMLElement,
  trigger: HTMLElement,
  options?: { yPercent?: number; scrub?: number | boolean },
) {
  if (prefersReducedMotion()) return null;

  return gsap.fromTo(
    media,
    { yPercent: -(options?.yPercent ?? 6) },
    {
      yPercent: options?.yPercent ?? 6,
      ease: 'none',
      force3D: true,
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: options?.scrub ?? 1.1,
      },
    },
  );
}

/** @deprecated clip-path reveals cause flicker — kept as no-op for call-site safety */
export function revealMediaClip(_frame: HTMLElement, _options?: { start?: string; duration?: number }) {
  return null;
}

export const animateCounter = gsapCountUp;
