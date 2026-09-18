import { z } from 'zod';

export const MANAGED_SECTION_KEYS = [
  'products',
  'manufacturing',
  'research',
  'quality',
  'sustainability',
  'careers',
  'news',
  'partners',
] as const;

export type ManagedSectionKey = (typeof MANAGED_SECTION_KEYS)[number];

export type HomepageSectionConfig = {
  key: ManagedSectionKey;
  visible: boolean;
  sortOrder: number;
};

export const SECTION_LABELS: Record<
  ManagedSectionKey,
  { en: string; ar: string; navKey: ManagedSectionKey }
> = {
  products: { en: 'Product Portfolio', ar: 'محفظة المنتجات', navKey: 'products' },
  manufacturing: { en: 'Manufacturing Excellence', ar: 'التميز التصنيعي', navKey: 'manufacturing' },
  research: { en: 'Research & Development', ar: 'البحث والتطوير', navKey: 'research' },
  quality: { en: 'Quality Assurance', ar: 'ضمان الجودة', navKey: 'quality' },
  sustainability: { en: 'Sustainability', ar: 'الاستدامة', navKey: 'sustainability' },
  careers: { en: 'Join Our Team', ar: 'انضم لفريقنا', navKey: 'careers' },
  news: { en: 'Latest Updates', ar: 'آخر التحديثات', navKey: 'news' },
  partners: { en: 'Our Partners', ar: 'شركاؤنا', navKey: 'partners' },
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = MANAGED_SECTION_KEYS.map(
  (key, index) => ({
    key,
    visible: true,
    sortOrder: index,
  }),
);

const sectionSchema = z.object({
  key: z.enum(MANAGED_SECTION_KEYS),
  visible: z.boolean(),
  sortOrder: z.number().int().min(0).max(100),
});

export function parseHomepageSections(raw: unknown): HomepageSectionConfig[] {
  const parsed = z.array(sectionSchema).safeParse(raw);
  const byKey = new Map<ManagedSectionKey, HomepageSectionConfig>();

  if (parsed.success) {
    for (const row of parsed.data) {
      byKey.set(row.key, row);
    }
  }

  const merged = MANAGED_SECTION_KEYS.map((key, index) => {
    const existing = byKey.get(key);
    return {
      key,
      visible: existing?.visible ?? true,
      sortOrder: existing?.sortOrder ?? index,
    };
  });

  return merged.sort((a, b) => a.sortOrder - b.sortOrder || a.key.localeCompare(b.key));
}

export function visibleManagedSections(raw: unknown): HomepageSectionConfig[] {
  return parseHomepageSections(raw).filter((s) => s.visible);
}

export function isSectionVisible(
  sections: HomepageSectionConfig[] | undefined | null,
  key: ManagedSectionKey,
): boolean {
  const list = sections && sections.length > 0 ? sections : DEFAULT_HOMEPAGE_SECTIONS;
  const found = list.find((s) => s.key === key);
  return found ? found.visible : true;
}
