'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Handshake, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn } from './SectionWrapper';
import LogoLoop, { type LogoItem } from '@/components/ui/LogoLoop';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

interface Partner {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const ROW_COUNT = 3;
const FADE_COLOR = '#F7F9FC';
/** Circle diameter — matches prior h-25 (100px) layout from design */
const LOGO_SIZE = 100;
const LOGO_GAP = 48;

function splitIntoRows<T>(items: T[], rows: number): T[][] {
  const result = Array.from({ length: rows }, () => [] as T[]);
  items.forEach((item, index) => {
    result[index % rows].push(item);
  });
  return result;
}

/** Offset each row so loops don't look identical when partner count is small */
function offsetRow<T>(items: T[], offset: number): T[] {
  if (items.length <= 1) return items;
  const n = offset % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

export function PartnersSection({ initialPartners }: { initialPartners?: Partner[] }) {
  const { t, locale } = useAppStore();
  const reduced = usePrefersReducedMotion();
  const [partners, setPartners] = useState<Partner[]>(
    () =>
      initialPartners
        ?.filter((p) => p.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder) ?? [],
  );
  const [loading, setLoading] = useState(!initialPartners);

  useEffect(() => {
    if (initialPartners) return;
    async function fetchPartners() {
      try {
        const res = await fetch('/api/partners');
        if (!res.ok) return;
        const data: Partner[] = await res.json();
        setPartners(
          data
            .filter((p) => p.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder),
        );
      } catch {
        // keep empty
      } finally {
        setLoading(false);
      }
    }
    fetchPartners();
  }, [initialPartners]);

  const displayName = useCallback(
    (p: Partner) => (locale === 'ar' ? p.nameAr : p.nameEn),
    [locale],
  );

  const toLogoItems = useCallback(
    (list: Partner[]): LogoItem[] =>
      list.map((partner) => ({
        src: partner.logoUrl,
        alt: displayName(partner),
        title: displayName(partner),
      })),
    [displayName],
  );

  const rows = useMemo(() => {
    const split = splitIntoRows(partners, ROW_COUNT);
    return split.map((row, i) => offsetRow(row, i * 2));
  }, [partners]);

  const rowConfigs = useMemo(
    () => [
      {
        speed: reduced ? 0 : 42,
        direction: (locale === 'ar' ? 'right' : 'left') as 'left' | 'right',
      },
      {
        speed: reduced ? 0 : 34,
        direction: (locale === 'ar' ? 'left' : 'right') as 'left' | 'right',
      },
      {
        speed: reduced ? 0 : 38,
        direction: (locale === 'ar' ? 'right' : 'left') as 'left' | 'right',
      },
    ],
    [locale, reduced],
  );

  const renderPartnerLogo = useCallback(
    (item: LogoItem, key: React.Key) => {
      const title = 'title' in item ? item.title : 'alt' in item ? item.alt : '';
      const hasSrc = 'src' in item && item.src;

      return (
        <div
          key={key}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          className="group/item flex shrink-0 items-center justify-center rounded-full border border-[rgba(10,37,68,0.08)] bg-white p-3 shadow-[var(--shadow-lift)] transition-[transform,box-shadow,border-color] duration-200 hover:border-brand-200/50 hover:shadow-[0_6px_28px_rgba(10,37,68,0.1)]"
          title={title}
        >
          {hasSrc ? (
            <img
              src={item.src}
              alt={item.alt ?? title ?? ''}
              className="h-full w-full object-contain grayscale opacity-55 transition-[filter,opacity] duration-300 group-hover/item:grayscale-0 group-hover/item:opacity-100 pointer-events-none rounded-full"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <Handshake className="size-10 text-brand-400/70 pointer-events-none" aria-hidden />
          )}
        </div>
      );
    },
    [],
  );

  if (!loading && partners.length === 0) {
    return null;
  }

  const ariaLabel =
    locale === 'ar' ? 'شعارات شركائنا الاستراتيجيين' : 'Strategic partner logos';

  return (
    <SectionWrapper
      id="partners"
      badge={t.partners.badge}
      title={t.partners.title}
      subtitle={t.partners.subtitle}
    >
      {loading ? (
        <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
          <Loader2 className="w-7 h-7 text-brand-600 animate-spin" />
          <span className="sr-only">{locale === 'ar' ? 'جاري التحميل' : 'Loading partners'}</span>
        </div>
      ) : (
        <FadeIn>
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 space-y-6 sm:space-y-7">
            {rows.map((rowPartners, index) => {
              if (rowPartners.length === 0) return null;
              const config = rowConfigs[index];

              return (
                <div
                  key={index}
                  className="relative py-2"
                  style={{ minHeight: LOGO_SIZE + 24 }}
                >
                  <LogoLoop
                    logos={toLogoItems(rowPartners)}
                    speed={config.speed}
                    direction={config.direction}
                    logoHeight={LOGO_SIZE}
                    gap={LOGO_GAP}
                    hoverSpeed={0}
                    scaleOnHover
                    fadeOut
                    fadeOutColor={FADE_COLOR}
                    renderItem={renderPartnerLogo}
                    ariaLabel={`${ariaLabel} — ${locale === 'ar' ? 'صف' : 'row'} ${index + 1}`}
                    className="py-2"
                  />
                </div>
              );
            })}
          </div>
        </FadeIn>
      )}
    </SectionWrapper>
  );
}
