'use client';

import { Lightbulb, Shield, Heart, Star, Eye, Target, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './SectionWrapper';

const valueIcons = [Lightbulb, Shield, Heart, Star];

export function AboutSection() {
  const { t } = useAppStore();

  return (
    <SectionWrapper
      id="about"
      badge={t.about.badge}
      title={t.about.title}
      subtitle={t.about.description}
    >
      {/* Vision & Mission Cards */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-20">
        <FadeIn delay={0.1}>
          <Card className="group relative overflow-hidden border-brand-200/60 hover:border-brand-300/80 hover:shadow-lg hover:shadow-brand-100/30 transition-all duration-300 h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                  <Eye className="size-5" />
                </div>
                <CardTitle className="text-xl">{t.about.vision.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.vision.text}
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="group relative overflow-hidden border-gold-200/60 hover:border-gold-300/80 hover:shadow-lg hover:shadow-gold-100/30 transition-all duration-300 h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gold-100 text-gold-600 group-hover:bg-gold-600 group-hover:text-white transition-colors duration-300">
                  <Target className="size-5" />
                </div>
                <CardTitle className="text-xl">{t.about.mission.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.mission.text}
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Values Grid */}
      <div className="mb-16 lg:mb-20">
        <FadeIn delay={0.1}>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 lg:mb-10">
            {t.about.values.title}
          </h3>
        </FadeIn>
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {t.about.values.items.map((item, index) => {
            const Icon = valueIcons[index];
            return (
              <StaggerItem key={index}>
                <Card className="group h-full border-border/60 hover:border-brand-200/80 hover:shadow-md hover:shadow-brand-50/50 transition-all duration-300 py-0 gap-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="size-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Added Value */}
      <FadeIn delay={0.1}>
        <Card className="relative overflow-hidden border-brand-200/50 bg-gradient-to-br from-brand-50/80 via-background to-gold-50/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <CardContent className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 shrink-0">
                <Sparkles className="size-7" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                  {t.about.addedValue.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {t.about.addedValue.text}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </SectionWrapper>
  );
}