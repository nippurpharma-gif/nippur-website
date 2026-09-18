'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { useAppStore } from '@/store';
import {
  useGSAP,
  revealSectionHeader,
  revealOnScroll,
  SCROLL,
} from '@/lib/gsap-site';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  noPadding?: boolean;
  overflowVisible?: boolean;
}

export function SectionWrapper({
  id,
  children,
  className = '',
  badge,
  title,
  subtitle,
  dark = false,
  noPadding = false,
  overflowVisible = false,
}: SectionWrapperProps) {
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!headerRef.current) return;
      revealSectionHeader(headerRef.current);
    },
    { scope: headerRef, dependencies: [badge, title, subtitle], revertOnUpdate: true },
  );

  return (
    <section
      id={id}
      className={`relative ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} ${dark ? 'bg-brand-950 text-white' : 'bg-[#F7F9FC] text-[var(--ink)]'} ${noPadding ? '' : 'section-pad'} ${className}`}
    >
      <div className="relative site-container">
        {(badge || title || subtitle) && (
          <div
            ref={headerRef}
            className={`${title || subtitle ? 'mb-12 lg:mb-16' : 'mb-8'}`}
          >
            {badge && (
              <div
                data-section-header="label"
                className={`mb-8 lg:mb-10 flex items-center gap-2.5 ${
                  dark ? 'text-white/75' : 'text-[var(--ink-secondary)]'
                }`}
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${
                    dark ? 'bg-white' : 'bg-[var(--ink)]'
                  }`}
                  aria-hidden
                />
                <span className="text-sm font-medium tracking-[-0.01em]">
                  {badge}
                </span>
              </div>
            )}
            {title && (
              <h2
                data-section-header="title"
                className={`section-title ${dark ? 'text-white' : 'text-[var(--ink)]'}`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                data-section-header="subtitle"
                className={`section-subtitle ${
                  dark ? 'text-white/70' : 'text-[var(--ink-secondary)]'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function FadeIn({
  children,
  delay = 0,
  className = '',
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      revealOnScroll(el, {
        y,
        delay,
        start: SCROLL.default,
        duration: 0.95,
      });
    },
    { scope: ref, dependencies: [delay, y], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  stagger = 0.08,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll<HTMLElement>('[data-stagger-item]');
      if (!items.length) return;

      revealOnScroll(items, {
        trigger: el,
        y,
        stagger: { each: stagger, from: 'start' },
        start: SCROLL.default,
        duration: 0.9,
      });
    },
    { scope: ref, dependencies: [stagger, y], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item className={className}>
      {children}
    </div>
  );
}

export function useActiveSection() {
  const { setActiveSection } = useAppStore();

  useEffect(() => {
    const sections = [
      'hero',
      'about',
      'manufacturing',
      'products',
      'research',
      'quality',
      'sustainability',
      'careers',
      'news',
      'contact',
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);
}
