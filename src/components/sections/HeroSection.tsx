'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useActiveSection } from './SectionWrapper';

export function HeroSection() {
  const { t } = useAppStore();
  useActiveSection();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroStats = [
    { value: '5', label: t.hero.stats.products },
    { value: '180M+', label: t.hero.stats.capacity },
    { value: 'GMP', label: t.hero.stats.standards },
    { value: '8+', label: t.hero.stats.countries },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/factory-real.jpeg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-950/60 to-brand-950/85" />
        {/* Subtle animated grain overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-brand-500/5 blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-3xl z-0"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 lg:pt-40 lg:pb-32 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase mb-6 px-4 py-2 rounded-full bg-brand-500/10 text-brand-300 border border-brand-400/20 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            {t.hero.badge}
          </motion.span>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-white"
          >
            {t.hero.title}{' '}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-teal-300 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
            className="mt-6 text-base sm:text-lg lg:text-xl leading-relaxed text-brand-100/70 max-w-2xl"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.45 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => scrollTo('products')}
              size="lg"
              className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-6 text-base rounded-lg shadow-lg shadow-brand-600/25 transition-all hover:shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.hero.cta1}
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              onClick={() => scrollTo('manufacturing')}
              variant="outline"
              size="lg"
              className="border-brand-400/30 text-brand-200 hover:bg-brand-400/10 hover:text-white hover:border-brand-400/50 px-8 py-6 text-base rounded-lg backdrop-blur-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.hero.cta2}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
        className="relative z-10 border-t border-brand-400/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-brand-400/10">
            {heroStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.7 + index * 0.1,
                  ease: 'easeOut',
                }}
                className="py-6 lg:py-8 px-4 sm:px-6 text-center"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-brand-200/60 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => scrollTo('about')}
          className="flex flex-col items-center gap-2 text-brand-300/60 hover:text-brand-300 transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-label="Scroll down"
        >
          <span className="text-xs tracking-widest uppercase">{t.hero.cta2.includes('Discover') || t.hero.cta2.includes('اكتشف') ? 'SCROLL' : 'مرر'}</span>
          <ChevronDown className="size-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}