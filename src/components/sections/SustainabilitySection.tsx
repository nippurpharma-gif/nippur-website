'use client';

import { Leaf, Zap, Droplets, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { SurfaceCard } from '@/components/ui/surface-card';

const pillarIcons: Record<string, React.ReactNode> = {
  leaf: <Leaf className="size-5.5" />,
  zap: <Zap className="size-5.5" />,
  droplets: <Droplets className="size-5.5" />,
  users: <Users className="size-5.5" />,
};

export function SustainabilitySection() {
  const { t } = useAppStore();

  return (
    <SectionWrapper
      id="sustainability"
      badge={t.sustainability.badge}
      title={t.sustainability.title}
      subtitle={t.sustainability.subtitle}
    >
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {t.sustainability.pillars.map((pillar, index) => (
          <StaggerItem key={index}>
            <SurfaceCard hover className="h-full p-6 sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 flex items-center justify-center size-12 rounded-xl bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  {pillarIcons[pillar.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-[var(--ink)] mb-2">{pillar.title}</h3>
                  <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}
