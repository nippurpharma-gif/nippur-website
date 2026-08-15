import type { Locale } from '@/lib/i18n/translations';

export type ProductionStat = {
  value: string;
  unitEn: string;
  unitAr: string;
  labelEn: string;
  labelAr: string;
};

export type LocalizedStat = {
  value: string;
  unit: string;
  label: string;
};

export const DEFAULT_PRODUCTION_STATS: ProductionStat[] = [
  {
    value: '100M+',
    unitEn: 'items/year',
    unitAr: 'وحدة/سنة',
    labelEn: 'Cephalosporins - Capsules',
    labelAr: 'سيفالوسبورين - كبسول',
  },
  {
    value: '20M+',
    unitEn: 'items/year',
    unitAr: 'وحدة/سنة',
    labelEn: 'Cephalosporins - Vials',
    labelAr: 'سيفالوسبورين - فيال',
  },
  {
    value: '15M+',
    unitEn: 'items/year',
    unitAr: 'وحدة/سنة',
    labelEn: 'Cephalosporins - syrup',
    labelAr: 'سيفالوسبورين - شراب',
  },
  {
    value: '15M+',
    unitEn: 'items/year',
    unitAr: 'وحدة/سنة',
    labelEn: 'Eye Drops',
    labelAr: 'قطرات عينية',
  },
  {
    value: '30M+',
    unitEn: 'items/year',
    unitAr: 'وحدة/سنة',
    labelEn: 'Ampoules',
    labelAr: 'أمبولات',
  },
];

function isStat(value: unknown): value is ProductionStat {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.value === 'string' &&
    typeof row.unitEn === 'string' &&
    typeof row.unitAr === 'string' &&
    typeof row.labelEn === 'string' &&
    typeof row.labelAr === 'string'
  );
}

export function parseProductionStats(raw: unknown): ProductionStat[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_PRODUCTION_STATS;
  const parsed = raw.filter(isStat).slice(0, 8);
  return parsed.length > 0 ? parsed : DEFAULT_PRODUCTION_STATS;
}

export function localizeStats(stats: ProductionStat[], locale: Locale): LocalizedStat[] {
  return stats.map((item) => ({
    value: item.value,
    unit: locale === 'ar' ? item.unitAr : item.unitEn,
    label: locale === 'ar' ? item.labelAr : item.labelEn,
  }));
}
