'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Beaker, Microscope, Clock, Globe } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';

const focusAreaIcons: Record<string, React.ReactNode> = {
  beaker: <Beaker className="h-6 w-6" />,
  microscope: <Microscope className="h-6 w-6" />,
  clock: <Clock className="h-6 w-6" />,
  globe: <Globe className="h-6 w-6" />,
};

export function ResearchSection() {
  const { t } = useAppStore();

  return (
    <SectionWrapper
      id="research"
      badge={t.research.badge}
      title={t.research.title}
      subtitle={t.research.subtitle}
    >
      {/* Image + Focus Areas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Image Column */}
        <FadeIn className="order-2 lg:order-1">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/30 to-transparent z-10" />
            <Image
              src="/images/research-lab.png"
              alt="NIPPUR Pharma Research Laboratory"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </FadeIn>

        {/* Focus Areas Grid */}
        <div className="order-1 lg:order-2">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {t.research.focusAreas.map((area, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(13, 148, 136, 0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full border-brand-100 hover:border-brand-300 transition-colors duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-50 text-brand-600">
                          {focusAreaIcons[area.icon]}
                        </div>
                        <h3 className="font-semibold text-foreground">{area.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {area.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Research Partnership Section */}
      <FadeIn delay={0.3}>
        <div className="mt-16 lg:mt-20 relative rounded-2xl border border-brand-200/50 bg-gradient-to-r from-brand-50 to-white p-6 sm:p-8 lg:p-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-100/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 rounded-full bg-gold-500" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.research.partnership.title}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">
              {t.research.partnership.text}
            </p>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}