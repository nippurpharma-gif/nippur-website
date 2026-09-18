'use client';

import { GripVertical, Eye, EyeOff, ArrowUp, ArrowDown, Save, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/store';
import {
  DEFAULT_HOMEPAGE_SECTIONS,
  SECTION_LABELS,
  parseHomepageSections,
  type HomepageSectionConfig,
} from '@/lib/homepage-sections';

export function HomepageSectionsEditor() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const queryClient = useQueryClient();
  const [sections, setSections] = useState<HomepageSectionConfig[]>(DEFAULT_HOMEPAGE_SECTIONS);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  useEffect(() => {
    if (settings?.homepageSections) {
      setSections(parseHomepageSections(settings.homepageSections));
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (next: HomepageSectionConfig[]) => {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepageSections: next }),
      });
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      useAppStore.getState().setSiteSettings(data);
      toast.success(t('Sections updated', 'تم تحديث الأقسام'));
    },
    onError: () => toast.error(t('Failed to save', 'فشل الحفظ')),
  });

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const tmp = next[index];
    next[index] = next[target];
    next[target] = tmp;
    setSections(next.map((s, i) => ({ ...s, sortOrder: i })));
  };

  const toggle = (index: number, visible: boolean) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, visible } : s)));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg">
            {t('Homepage Sections', 'أقسام الصفحة الرئيسية')}
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              'Show or hide sections and reorder them. Hidden sections also leave the navigation.',
              'أظهر أو أخفِ الأقسام وأعد ترتيبها. الأقسام المخفية تختفي أيضاً من شريط التنقل.',
            )}
          </p>
        </div>
        <Button
          onClick={() => saveMutation.mutate(sections.map((s, i) => ({ ...s, sortOrder: i })))}
          disabled={saveMutation.isPending}
          className="bg-brand-600 hover:bg-brand-700 text-white gap-2 shrink-0"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {t('Save', 'حفظ')}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section, index) => {
          const labels = SECTION_LABELS[section.key];
          return (
            <div
              key={section.key}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-3"
            >
              <GripVertical className="h-4 w-4 text-gray-300 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {isAr ? labels.ar : labels.en}
                </p>
                <p className="text-xs text-gray-400">#{section.key}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  aria-label="Move up"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === sections.length - 1}
                  onClick={() => move(index, 1)}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 ps-2 border-s border-gray-100">
                {section.visible ? (
                  <Eye className="h-4 w-4 text-emerald-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
                <Switch
                  checked={section.visible}
                  onCheckedChange={(v) => toggle(index, v)}
                  aria-label={t('Visible', 'ظاهر')}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
