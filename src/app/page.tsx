'use client';

import { useEffect } from 'react';
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


function AppContent() {
  useActiveSection();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ManufacturingSection />
        <ProductsSection />
        <ResearchSection />
        <QualitySection />
        <SustainabilitySection />
        <CareersSection />
        <NewsSection />
        <PartnersSection />
        <ContactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return <AppContent />;
}