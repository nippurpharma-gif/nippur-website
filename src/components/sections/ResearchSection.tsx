'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Beaker, Microscope, Clock, Globe, Handshake } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { SurfaceCard } from '@/components/ui/surface-card';
import { useGSAP, prefersReducedMotion, parallaxMedia } from '@/lib/gsap-site';

const focusAreaIcons: Record<string, React.ReactNode> = {
  beaker: <Beaker className="size-5.5" />,
  microscope: <Microscope className="size-5.5" />,
  clock: <Clock className="size-5.5" />,
  globe: <Globe className="size-5.5" />,
};

export function ResearchSection() {
  const { t } = useAppStore();
  const mediaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const frame = mediaRef.current;
      const img = frame?.querySelector('img');
      if (!frame || !img) return;
      parallaxMedia(img, frame, { yPercent: 5, scrub: 1.15 });
    },
    { scope: mediaRef, revertOnUpdate: true },
  );

  return (
    <SectionWrapper
      id="research"
      badge={t.research.badge}
      title={t.research.title}
      subtitle={t.research.subtitle}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <FadeIn className="order-2 lg:order-1">
          <SurfaceCard media ref={mediaRef} className="overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--ink)]/40 to-transparent z-10" />
            <Image
              src="/images/research-lab.png"
              alt="NIPPUR Pharma Research Laboratory"
              width={800}
              height={600}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="w-full h-auto object-cover will-change-transform"
            />
          </SurfaceCard>
        </FadeIn>

        <div className="order-1 lg:order-2">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {t.research.focusAreas.map((area, index) => (
              <StaggerItem key={index}>
                <SurfaceCard hover className="h-full p-6 flex flex-col">
                  <div className="size-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white shrink-0">
                    {focusAreaIcons[area.icon]}
                  </div>
                  <h3 className="text-lg font-bold text-[var(--ink)] mb-2">
                    {area.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {area.desc}
                  </p>
                </SurfaceCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      <FadeIn delay={0.15}>
        <SurfaceCard className="mt-12 lg:mt-16 p-7 sm:p-9 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="size-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <Handshake className="size-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2.5">
                {t.research.partnership.title}
              </h3>
              <p className="text-[var(--ink-secondary)] leading-relaxed text-sm sm:text-base max-w-4xl">
                {t.research.partnership.text}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </FadeIn>
    </SectionWrapper>
  );
}
