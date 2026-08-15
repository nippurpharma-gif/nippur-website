'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DEFAULT_PRODUCTION_STATS,
  type ProductionStat,
} from '@/lib/production-stats';

const emptyStat = (): ProductionStat => ({
  value: '',
  unitEn: 'items/year',
  unitAr: 'وحدة/سنة',
  labelEn: '',
  labelAr: '',
});

export function ProductionStatsEditor({
  stats,
  onChange,
  isAr,
}: {
  stats: ProductionStat[];
  onChange: (next: ProductionStat[]) => void;
  isAr: boolean;
}) {
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const rows = stats.length > 0 ? stats : DEFAULT_PRODUCTION_STATS;

  const update = (index: number, patch: Partial<ProductionStat>) => {
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 leading-relaxed">
        {t(
          'These figures appear in About the company and Manufacturing on the public site.',
          'تظهر هذه الأرقام في قسم عن الشركة وفي التصنيع على الموقع.',
        )}
      </p>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-1 gap-2 rounded-lg border border-gray-100 bg-gray-50/80 p-3 md:grid-cols-12 md:items-end"
          >
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[11px] text-gray-500">{t('Value', 'القيمة')}</Label>
              <Input
                value={row.value}
                onChange={(e) => update(index, { value: e.target.value })}
                placeholder="100M+"
                maxLength={24}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[11px] text-gray-500">{t('Unit EN', 'الوحدة EN')}</Label>
              <Input
                value={row.unitEn}
                onChange={(e) => update(index, { unitEn: e.target.value })}
                placeholder="items/year"
                maxLength={80}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[11px] text-gray-500">{t('Unit AR', 'الوحدة AR')}</Label>
              <Input
                value={row.unitAr}
                onChange={(e) => update(index, { unitAr: e.target.value })}
                placeholder="وحدة/سنة"
                dir="rtl"
                maxLength={80}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label className="text-[11px] text-gray-500">{t('Label EN', 'الوصف EN')}</Label>
              <Input
                value={row.labelEn}
                onChange={(e) => update(index, { labelEn: e.target.value })}
                maxLength={120}
              />
            </div>
            <div className="space-y-1 md:col-span-3">
              <Label className="text-[11px] text-gray-500">{t('Label AR', 'الوصف AR')}</Label>
              <Input
                value={row.labelAr}
                onChange={(e) => update(index, { labelAr: e.target.value })}
                dir="rtl"
                maxLength={120}
              />
            </div>
            <div className="md:col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-600"
                disabled={rows.length <= 1}
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                aria-label={t('Remove', 'حذف')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={rows.length >= 8}
        onClick={() => onChange([...rows, emptyStat()])}
        className="gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        {t('Add figure', 'إضافة رقم')}
      </Button>
    </div>
  );
}
