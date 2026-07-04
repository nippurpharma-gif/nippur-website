'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn } from './SectionWrapper';
import { Handshake, Loader2 } from 'lucide-react';
import LogoLoop, { LogoItem } from '@/components/ui/LogoLoop';

interface Partner {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export function PartnersSection() {
  const { t, locale } = useAppStore();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const res = await fetch('/api/partners?XTransformPort=3000');
        if (!res.ok) return;
        const data: Partner[] = await res.json();
        setPartners(
          data
            .filter((p) => p.isActive === true)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
      } catch {
        // silently fail — keep empty list
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, []);

  const displayName = (p: Partner) => (locale === 'ar' ? p.nameAr : p.nameEn);
  const displayDescription = (p: Partner) =>
    p.description
      ? p.description
      : locale === 'ar'
        ? 'شريك استراتيجي'
        : 'Strategic Partner';

  const logoItems = useMemo<LogoItem[]>(() => {
    return partners.map((partner) => ({
      node: (
        <div 
          dir={locale === 'ar' ? 'rtl' : 'ltr'} 
          className="group relative overflow-hidden h-25 w-25 flex items-center flex-col gap-0 px-0 py-0 rounded-full border border-black/[0.04] dark:border-white/[0.05] bg-white/40 dark:bg-brand-950/20 backdrop-blur-md hover:border-brand-500/35 dark:hover:border-brand-400/35 hover:bg-white/80 dark:hover:bg-brand-950/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-500 ease-out select-none"
        >
          {partner.logoUrl ? (
            // img
            <div className="h-25 w-25 fixed top-0 left-0 right-0 rounded-full bg-white p-1.5 flex items-center justify-center shrink-0 border border-black/[0.03] dark:border-white/[0.05] overflow-hidden shadow-xs">
              <img
                src={partner.logoUrl}
                alt={displayName(partner)}
                className="w-full h-full object-contain pointer-events-none filter grayscale opacity-55 dark:opacity-45 contrast-100 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-out"
                draggable={false}
              />
            </div>
          ) : (
            // icon
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-950 dark:to-brand-900 flex items-center justify-center shrink-0 border border-black/[0.03] dark:border-white/[0.05] shadow-xs">
              <Handshake className="w-6 h-6 text-muted-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 pointer-events-none transition-colors duration-500 ease-out" />
            </div>
          )}
          {/* name and description */}
          <div className="flex flex-col text-start min-w-[150px] max-w-[220px]">
            <h4 className="font-semibold text-foreground text-sm leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-500 truncate">
              {displayName(partner)}
            </h4>
            <p className="text-[11px] text-muted-foreground truncate mt-1 leading-none">
              {displayDescription(partner)}
            </p>
          </div>
        </div>
      ),
      title: displayName(partner),
    }));
  }, [partners, locale]);

  if (!loading && partners.length === 0) {
    return null;
  }

  return (
    <SectionWrapper
      id="partners"
      badge={t.partners.badge}
      title={t.partners.title}
      subtitle={t.partners.subtitle}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        </div>
      ) : (
        <FadeIn>
          <div className="relative w-full py-0 overflow-hidden">
            <LogoLoop
              logos={logoItems}
              speed={40}
              direction={locale === 'ar' ? 'right' : 'left'}
              logoHeight={76}
              gap={60}
              pauseOnHover={true}
              fadeOut={true}
            />
          </div>
          <div className="relative w-full py-0 overflow-hidden">
            <LogoLoop
              logos={logoItems}
              speed={30}
              direction={locale === 'ar' ? 'left' : 'right'}
              logoHeight={76}
              gap={40}
              pauseOnHover={true}
              fadeOut={true}
            />
          </div>
          <div className="relative w-full py-0 overflow-hidden">
            <LogoLoop
              logos={logoItems}
              speed={30}
              direction={locale === 'ar' ? 'right' : 'left'}
              logoHeight={76}
              gap={60}
              pauseOnHover={true}
              fadeOut={true}
            />
          </div>
        </FadeIn>
      )}
    </SectionWrapper>
  );
}