'use client';

import { useRef } from 'react';
import { Pill, Shield, FlaskConical, Settings, Factory } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './SectionWrapper';
import { SurfaceCard } from '@/components/ui/surface-card';
import { useProductionStats } from '@/hooks/use-production-stats';
import { gsap, useGSAP, prefersReducedMotion, EASE } from '@/lib/gsap-site';

const iconMap: Record<string, React.ElementType> = {
  pill: Pill,
  shield: Shield,
  flask: FlaskConical,
  settings: Settings,
};

export function ManufacturingSection() {
  const { t } = useAppStore();
  const capacityItems = useProductionStats();
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const capacityRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const img = imageWrapRef.current?.querySelector('img');
      if (img && imageWrapRef.current) {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.08 },
          {
            yPercent: 8,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: imageWrapRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }

      if (capacityRef.current) {
        const cells = gsap.utils.toArray<HTMLElement>(
          '[data-capacity-cell]',
          capacityRef.current,
        );
        gsap.from(cells, {
          y: 18,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: EASE,
          scrollTrigger: {
            trigger: capacityRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      }
    },
    { dependencies: [capacityItems.length] },
  );

  return (
    <SectionWrapper
      id="manufacturing"
      badge={t.manufacturing.badge}
      title={t.manufacturing.title}
      subtitle={t.manufacturing.subtitle}
    >
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <div className="space-y-8">
          <FadeIn>
            <SurfaceCard
              media
              ref={imageWrapRef}
            >
              <img
                src="/images/manufacturing-line.png"
                alt="NIPPUR Pharma Manufacturing Line"
                className="w-full h-[300px] lg:h-[400px] object-cover will-change-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/75 via-transparent to-transparent" />
              <div className="absolute bottom-6 start-6 end-6">
                <div className="flex items-center gap-2 text-white">
                  <Factory className="size-5 text-brand-300" />
                  <span className="text-sm font-medium tracking-[-0.01em]">
                    GMP Certified Facility
                  </span>
                </div>
              </div>
            </SurfaceCard>
          </FadeIn>
        </div>

        <StaggerContainer className="grid sm:grid-cols-2 gap-4 lg:gap-5">
          {t.manufacturing.facilities.map((facility, i) => {
            const Icon = iconMap[facility.icon] || FlaskConical;
            return (
              <StaggerItem key={i}>
                <SurfaceCard hover className="h-full p-6 flex flex-col">
                  <div className="size-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white shrink-0">
                    <Icon className="size-5.5" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {facility.desc}
                  </p>
                </SurfaceCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </SectionWrapper>
  );
}
