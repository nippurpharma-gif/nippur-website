'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/store';
import { SectionWrapper, StaggerContainer, StaggerItem } from './SectionWrapper';

function AnimatedCounter({
  value,
  suffix,
}: {
  value: string;
  suffix: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20px' });
  const numericPart = value.replace(/[^0-9]/g, '');
  const hasPlus = value.includes('+');
  const isNumeric = numericPart.length > 0 && !isNaN(Number(numericPart));
  const targetNum = isNumeric ? parseInt(numericPart, 10) : 0;
  const [displayValue, setDisplayValue] = useState(isNumeric ? '0' : value);

  useEffect(() => {
    if (!isInView || !isNumeric) return;

    const duration = 2000;
    const startTime = Date.now();
    let rafId: number;

    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * targetNum);
      const formatted = current.toLocaleString('en-US');
      setDisplayValue(hasPlus ? `${formatted}+` : formatted);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [isInView, isNumeric, targetNum, hasPlus]);

  return (
    <span ref={ref} className="bg-gradient-to-r from-brand-300 via-teal-200 to-brand-400 bg-clip-text text-transparent">
      {displayValue}
      {suffix && isNumeric && (
        <span className="text-brand-200/50 text-sm font-normal ms-1">{suffix}</span>
      )}
    </span>
  );
}

export function StatsSection() {
  const { t } = useAppStore();

  return (
    <SectionWrapper id="stats" badge={t.stats.badge} dark>
      <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {t.stats.items.map((item, index) => (
          <StaggerItem key={index}>
            <div className="group relative rounded-xl border border-brand-800/40 bg-brand-900/30 backdrop-blur-sm p-6 lg:p-8 text-center hover:border-brand-600/40 hover:bg-brand-900/50 transition-all duration-300">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-none">
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </div>
                <p className="mt-3 text-sm text-brand-200/60 font-medium">
                  {item.label}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}