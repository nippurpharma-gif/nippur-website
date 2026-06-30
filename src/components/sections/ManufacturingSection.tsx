'use client';

import { motion } from 'framer-motion';
import { Pill, Shield, FlaskConical, Settings, Factory, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';

const iconMap: Record<string, React.ElementType> = {
  pill: Pill,
  shield: Shield,
  flask: FlaskConical,
  settings: Settings,
};

export function ManufacturingSection() {
  const { t } = useAppStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SectionWrapper
      id="manufacturing"
      badge={t.manufacturing.badge}
      title={t.manufacturing.title}
      subtitle={t.manufacturing.subtitle}
      className="bg-muted/30"
    >
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Facility Image + Capacity */}
        <div className="space-y-10">
          <FadeIn>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/10">
              <img
                src="/images/manufacturing-line.png"
                alt="NIPPUR Pharma Manufacturing Line"
                className="w-full h-[300px] lg:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent" />
              <div className="absolute bottom-6 start-6 end-6">
                <div className="flex items-center gap-2 text-white">
                  <Factory className="w-5 h-5" />
                  <span className="text-sm font-medium">GMP Certified Facility</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Production Capacity */}
          <FadeIn delay={0.2}>
            <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-6 text-foreground">{t.manufacturing.capacity.title}</h3>
              <div className="grid grid-cols-2 gap-6">
                {t.manufacturing.capacity.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="text-center p-4 rounded-xl bg-muted/50"
                  >
                    <div className="text-2xl lg:text-3xl font-bold gradient-text">{item.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.unit}</div>
                    <div className="text-sm font-medium text-foreground mt-1">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Right: Facility Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 gap-4">
          {t.manufacturing.facilities.map((facility, i) => {
            const Icon = iconMap[facility.icon] || FlaskConical;
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px oklch(0.45 0.08 175 / 0.08)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="h-full border-border/60 bg-card hover:border-brand-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-brand-700" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">{facility.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{facility.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </SectionWrapper>
  );
}