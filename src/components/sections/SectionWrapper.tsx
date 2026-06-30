'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  dark?: boolean;
  noPadding?: boolean;
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
}: SectionWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${dark ? 'bg-brand-950 text-white' : 'bg-background text-foreground'} ${noPadding ? '' : 'py-20 lg:py-28'} ${className}`}
    >
      {/* Subtle background pattern */}
      {!dark && (
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f766e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(badge || title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`max-w-3xl ${title || subtitle ? 'mb-14 lg:mb-16' : ''}`}
          >
            {badge && (
              <span className={`inline-block text-xs font-semibold tracking-[0.15em] uppercase mb-4 px-3 py-1.5 rounded-full ${dark ? 'bg-brand-900/50 text-brand-300 border border-brand-800/50' : 'bg-brand-50 text-brand-700 border border-brand-200/50'}`}>
                {badge}
              </span>
            )}
            {title && (
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${dark ? 'text-white' : 'text-foreground'}`}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-4 text-base lg:text-lg leading-relaxed ${dark ? 'text-brand-200/70' : 'text-muted-foreground'}`}>
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}

export function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Track active section on scroll
export function useActiveSection() {
  const { setActiveSection } = useAppStore();

  useEffect(() => {
    const sections = ['hero', 'about', 'manufacturing', 'products', 'research', 'quality', 'sustainability', 'careers', 'news', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [setActiveSection]);
}