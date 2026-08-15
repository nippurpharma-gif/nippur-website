'use client';

import { useEffect, useLayoutEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useActiveSection } from '@/components/sections/SectionWrapper';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ManufacturingSection } from '@/components/sections/ManufacturingSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ResearchSection } from '@/components/sections/ResearchSection';
import { QualitySection } from '@/components/sections/QualitySection';
import { SustainabilitySection } from '@/components/sections/SustainabilitySection';
import { CareersSection } from '@/components/sections/CareersSection';
import { NewsSection } from '@/components/sections/NewsSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { CTASection } from '@/components/sections/CTASection';
import { ScrollTrigger } from '@/lib/gsap-site';
import { useAppStore } from '@/store';
import type { HomePageData } from '@/lib/home-data';

export function HomePage({ data }: { data: HomePageData }) {
  useActiveSection();
  const locale = useAppStore((s) => s.locale);
  const setSiteSettings = useAppStore((s) => s.setSiteSettings);
  const setSettingsFetched = useAppStore((s) => s.setSettingsFetched);

  useLayoutEffect(() => {
    if (data.settings) {
      setSiteSettings(data.settings);
      setSettingsFetched(true);
    }
  }, [data.settings, setSiteSettings, setSettingsFetched]);

  useEffect(() => {
    void document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, [locale]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroSection />
        <div className="relative z-10 bg-background">
          <StatsSection />
          <AboutSection />
          <ManufacturingSection />
          <ProductsSection initialProducts={data.products} />
          <ResearchSection />
          <QualitySection />
          <SustainabilitySection />
          <CareersSection initialJobs={data.jobs} />
          <NewsSection initialArticles={data.news} />
          <PartnersSection initialPartners={data.partners} />
          <ContactSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
