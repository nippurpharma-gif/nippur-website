'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, TestTube2, FlaskConical, CheckCircle2, Check } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';

const standardIcons: Record<string, React.ReactNode> = {
  'shield-check': <ShieldCheck className="h-6 w-6" />,
  'test': <TestTube2 className="h-6 w-6" />,
  'flask': <FlaskConical className="h-6 w-6" />,
  'check-circle': <CheckCircle2 className="h-6 w-6" />,
};

export function QualitySection() {
  const { t } = useAppStore();

  return (
    <SectionWrapper
      id="quality"
      badge={t.quality.badge}
      title={t.quality.title}
      subtitle={t.quality.subtitle}
      dark
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Standards Grid */}
        <div className="order-2 lg:order-1">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {t.quality.standards.map((standard, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(13, 148, 136, 0.15)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full border-brand-800/40 bg-brand-900/40 hover:border-brand-600/60 transition-colors duration-300 backdrop-blur-sm">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-800/60 text-brand-300">
                          {standardIcons[standard.icon]}
                        </div>
                        <h3 className="font-semibold text-white">{standard.title}</h3>
                      </div>
                      <p className="text-sm text-brand-200/70 leading-relaxed">
                        {standard.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Image Column */}
        <FadeIn className="order-1 lg:order-2">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tl from-brand-800/40 to-transparent z-10" />
            <Image
              src="/images/quality-control.png"
              alt="NIPPUR Pharma Quality Control Laboratory"
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        </FadeIn>
      </div>

      {/* Certifications List */}
      <FadeIn delay={0.3}>
        <div className="mt-16 lg:mt-20">
          <div className="rounded-2xl border border-brand-800/40 bg-brand-900/30 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-gold-500" />
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {t.quality.certifications.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {t.quality.certifications.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 py-2"
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-700/50 flex items-center justify-center">
                    <Check className="h-3 w-3 text-brand-300" />
                  </div>
                  <span className="text-sm text-brand-100/90">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionWrapper>
  );
}