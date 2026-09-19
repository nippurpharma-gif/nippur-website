'use client';

import { useEffect, useLayoutEffect, useMemo, type ReactNode } from 'react';
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
import { scrollToHashTarget } from '@/lib/scroll-to-section';
import { useAppStore } from '@/store';
import type { HomePageData } from '@/lib/home-data';
import {
  DEFAULT_HOMEPAGE_SECTIONS,
  parseHomepageSections,
  type ManagedSectionKey,
} from '@/lib/homepage-sections';

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

  useEffect(() => {
    if (window.location.hash) {
      const timer = window.setTimeout(() => scrollToHashTarget(), 50);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const managedOrder = useMemo(() => {
    const sections = parseHomepageSections(data.settings?.homepageSections ?? DEFAULT_HOMEPAGE_SECTIONS);
    return sections.filter((s) => s.visible).map((s) => s.key);
  }, [data.settings?.homepageSections]);

  const sectionMap: Record<ManagedSectionKey, ReactNode> = {
    manufacturing: <ManufacturingSection key="manufacturing" />,
    products: <ProductsSection key="products" initialProducts={data.products} />,
    research: <ResearchSection key="research" />,
    quality: <QualitySection key="quality" />,
    sustainability: <SustainabilitySection key="sustainability" />,
    careers: <CareersSection key="careers" initialJobs={data.jobs} />,
    news: <NewsSection key="news" initialArticles={data.news} />,
    partners: <PartnersSection key="partners" initialPartners={data.partners} />,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <HeroSection />
        {/* isolate + solid bg keeps sticky hero (z-0) strictly underneath while scrolling */}
        <div className="relative z-10 isolate bg-background shadow-[0_-1px_0_rgba(10,37,68,0.04)]">
          <StatsSection />
          <AboutSection />
          {managedOrder.map((key) => sectionMap[key])}
          <ContactSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
