'use client';

import { motion } from 'framer-motion';
import { Leaf, Zap, Droplets, Users } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, StaggerContainer, StaggerItem } from '@/components/sections/SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';

const pillarIcons: Record<string, React.ReactNode> = {
  leaf: <Leaf className="h-6 w-6" />,
  zap: <Zap className="h-6 w-6" />,
  droplets: <Droplets className="h-6 w-6" />,
  users: <Users className="h-6 w-6" />,
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
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-5xl mx-auto">
        {t.sustainability.pillars.map((pillar, index) => (
          <StaggerItem key={index}>
            <motion.div
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(13, 148, 136, 0.12)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Card className="h-full border-brand-100 hover:border-brand-300 transition-colors duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors duration-300">
                      {pillarIcons[pillar.icon]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-2">{pillar.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionWrapper>
  );
}