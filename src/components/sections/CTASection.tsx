'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Package } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper } from '@/components/sections/SectionWrapper';
import { Button } from '@/components/ui/button';

export function CTASection() {
  const { t } = useAppStore();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <SectionWrapper id="cta" dark>
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-[500px] h-[500px] rounded-full bg-gold-500/8 blur-[100px]"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative text-center max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {t.cta.title}
        </motion.h2>

        <motion.p
          className="mt-5 text-base lg:text-lg text-brand-200/70 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          {t.cta.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
        >
          <Button
            size="lg"
            onClick={() => scrollTo('contact')}
            className="bg-brand-500 hover:bg-brand-400 text-white px-8 text-base min-w-[180px]"
          >
            {t.cta.contact}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => scrollTo('products')}
            className="border-brand-400/40 text-brand-200 hover:bg-brand-900/50 hover:text-white hover:border-brand-300/60 px-8 text-base min-w-[180px]"
          >
            <Package className="mr-2 h-4 w-4" />
            {t.cta.products}
          </Button>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}