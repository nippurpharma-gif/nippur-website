'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTASection } from '@/components/sections/CTASection';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header variant="inner" />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none pt-16 lg:pt-[4.25rem]">
        {children}
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}
