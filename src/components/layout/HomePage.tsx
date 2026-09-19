'use client';

import { useEffect, useLayoutEffect, useMemo, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { useActiveSection } from '@/components/sections/SectionWrapper';
import { HeroSection } from '@/components/sections/HeroSection';
import { scrollToHashTarget } from '@/lib/scroll-to-section';
import { useAppStore } from '@/store';
import type { HomePageData } from '@/lib/home-data';
import {
  DEFAULT_HOMEPAGE_SECTIONS,
  parseHomepageSections,
  type ManagedSectionKey,
} from '@/lib/homepage-sections';

const StatsSection = dynamic(
  () => import('@/components/sections/StatsSection').then((m) => m.StatsSection),
  { ssr: true },
);
const AboutSection = dynamic(
  () => import('@/components/sections/AboutSection').then((m) => m.AboutSection),
  { ssr: true },
);
const ManufacturingSection = dynamic(
  () => import('@/components/sections/ManufacturingSection').then((m) => m.ManufacturingSection),
  { ssr: true },
);
const ProductsSection = dynamic(
  () => import('@/components/sections/ProductsSection').then((m) => m.ProductsSection),
  { ssr: true },
);
const ResearchSection = dynamic(
  () => import('@/components/sections/ResearchSection').then((m) => m.ResearchSection),
  { ssr: true },
);
const QualitySection = dynamic(
  () => import('@/components/sections/QualitySection').then((m) => m.QualitySection),
  { ssr: true },
);
const SustainabilitySection = dynamic(
  () => import('@/components/sections/SustainabilitySection').then((m) => m.SustainabilitySection),
  { ssr: true },
);
const CareersSection = dynamic(
  () => import('@/components/sections/CareersSection').then((m) => m.CareersSection),
  { ssr: true },
);
const NewsSection = dynamic(
  () => import('@/components/sections/NewsSection').then((m) => m.NewsSection),
  { ssr: true },
);
const PartnersSection = dynamic(
  () => import('@/components/sections/PartnersSection').then((m) => m.PartnersSection),
  { ssr: true },
);
const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection').then((m) => m.ContactSection),
  { ssr: true },
);
const CTASection = dynamic(
  () => import('@/components/sections/CTASection').then((m) => m.CTASection),
  { ssr: true },
);
const Footer = dynamic(
  () => import('@/components/layout/Footer').then((m) => m.Footer),
  { ssr: true },
);

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
    if (window.location.hash) {
      const timer = window.setTimeout(() => scrollToHashTarget(), 50);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void import('@/lib/gsap-site').then(({ ScrollTrigger }) => ScrollTrigger.refresh());
    }, 400);
    return () => window.clearTimeout(id);
  }, [locale]);

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
