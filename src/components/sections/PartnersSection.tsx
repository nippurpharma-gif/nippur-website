'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn, StaggerContainer, StaggerItem } from './SectionWrapper';
import { Handshake, Loader2 } from 'lucide-react';

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
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((partner) => (
            <StaggerItem key={partner.id}>
              <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/60 bg-card hover:border-brand-200 hover:shadow-lg transition-all duration-300">
                {partner.logoUrl ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={partner.logoUrl}
                      alt={displayName(partner)}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center shrink-0">
                    <Handshake className="w-6 h-6 text-brand-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {displayName(partner)}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {displayDescription(partner)}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </SectionWrapper>
  );
}