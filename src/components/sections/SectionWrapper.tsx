'use client';

import { useRef, useEffect, type ReactNode } from 'react';
import { useAppStore } from '@/store';
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
  revealSectionHeader,
  EASE,
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
  /** Sticky/pin stacks need visible overflow */
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
    { scope: headerRef, dependencies: [badge, title, subtitle] },
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
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { y: 0 });
        return;
      }

      gsap.from(el, {
        y: 22,
        duration: 0.65,
        delay,
        ease: EASE,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: ref, dependencies: [delay] },
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
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const items = gsap.utils.toArray<HTMLElement>('[data-stagger-item]', el);

      if (prefersReducedMotion()) {
        gsap.set(items, { y: 0 });
        return;
      }

      gsap.from(items, {
        y: 22,
        duration: 0.65,
        stagger: 0.07,
        ease: EASE,
        immediateRender: false,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: ref },
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
    <div
      data-stagger-item
      className={`transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
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
