'use client';

import { Lightbulb, Shield, Heart, Star, Eye, Target, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { useSiteSettings } from '@/hooks/use-site-settings';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './SectionWrapper';
import { SurfaceCard } from '@/components/ui/surface-card';

const valueIcons = [Lightbulb, Shield, Heart, Star];

export function AboutSection() {
  const { t, locale } = useAppStore();
  const { settings } = useSiteSettings();
  const aboutCopy =
    (locale === 'ar' ? settings?.descriptionAr : settings?.descriptionEn)?.trim() ||
    t.about.description;

  return (
    <SectionWrapper
      id="about"
      badge={t.about.badge}
      title={t.about.title}
      subtitle={aboutCopy}
    >
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
        <FadeIn delay={0.1}>
          <SurfaceCard hover className="h-full p-7 lg:p-9">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="flex items-center justify-center size-11 rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Eye className="size-5.5" />
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)]">{t.about.vision.title}</h3>
            </div>
            <p className="text-[var(--ink-secondary)] leading-relaxed text-sm sm:text-base">
              {t.about.vision.text}
            </p>
          </SurfaceCard>
        </FadeIn>

        <FadeIn delay={0.2}>
          <SurfaceCard hover className="h-full p-7 lg:p-9">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="flex items-center justify-center size-11 rounded-xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                <Target className="size-5.5" />
              </div>
              <h3 className="text-xl font-bold text-[var(--ink)]">{t.about.mission.title}</h3>
            </div>
            <p className="text-[var(--ink-secondary)] leading-relaxed text-sm sm:text-base">
              {t.about.mission.text}
            </p>
          </SurfaceCard>
        </FadeIn>
      </div>

      <div className="mb-16 lg:mb-20">
        <FadeIn delay={0.1}>
          <h3 className="text-2xl sm:text-3xl font-semibold text-[var(--ink)] mb-8 lg:mb-10 tracking-[-0.02em]">
            {t.about.values.title}
          </h3>
        </FadeIn>
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {t.about.values.items.map((item, index) => {
            const Icon = valueIcons[index];
            return (
              <StaggerItem key={index}>
                <SurfaceCard hover className="h-full p-6 flex flex-col">
                  <div className="flex items-center justify-center size-11 rounded-xl bg-brand-50 text-brand-700 mb-4 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white shrink-0">
                    <Icon className="size-5.5" />
                  </div>
                  <h4 className="text-lg font-bold text-[var(--ink)] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[var(--ink-secondary)] leading-relaxed">
                    {item.desc}
                  </p>
                </SurfaceCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      <FadeIn delay={0.1}>
        <SurfaceCard className="p-7 sm:p-9 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center justify-center size-12 rounded-xl bg-brand-50 text-brand-700 shrink-0">
              <Sparkles className="size-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2.5">
                {t.about.addedValue.title}
              </h3>
              <p className="text-[var(--ink-secondary)] leading-relaxed text-sm sm:text-base">
                {t.about.addedValue.text}
              </p>
            </div>
          </div>
        </SurfaceCard>
      </FadeIn>
    </SectionWrapper>
  );
}
