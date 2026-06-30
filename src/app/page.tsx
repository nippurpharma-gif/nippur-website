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
import { LoginPage } from '@/components/dashboard/LoginPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAppStore } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent() {
  const { viewMode } = useAppStore();
  useActiveSection();



  if (viewMode === 'login') {
    return <LoginPage />;
  }

  if (viewMode === 'dashboard') {
    return <Dashboard />;
  }

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
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}