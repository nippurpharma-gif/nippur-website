'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store';

export interface ProductRow {
  id: number;
  nameEn: string;
  nameAr: string;
  categoryEn: string;
  categoryAr: string;
  formEn: string;
  formAr: string;
  strengthEn: string;
  strengthAr: string;
  packagingEn: string;
  packagingAr: string;
  descEn: string;
  descAr: string;
  leafletUrl: string;
  sortOrder: number;
  isActive: boolean;
}

const emptyForm: Omit<ProductRow, 'id'> = {
  nameEn: '',
  nameAr: '',
  categoryEn: 'Cephalosporins',
  categoryAr: 'سيفالوسبورين',
  formEn: '',
  formAr: '',
  strengthEn: '',
  strengthAr: '',
  packagingEn: '',
  packagingAr: '',
  descEn: '',
  descAr: '',
  leafletUrl: '',
  sortOrder: 0,
  isActive: true,
};

export function ProductsTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const qc = useQueryClient();

  const { data: products = [], isLoading } = useQuery<ProductRow[]>({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then((r) => r.json()),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const createMutation = useMutation({
    mutationFn: (body: typeof emptyForm) =>
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('Product created', 'تم إنشاء المنتج'));
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (body: typeof emptyForm & { id: number }) =>
      fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('Product updated', 'تم تحديث المنتج'));
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/products?id=${id}`, { method: 'DELETE' }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success(t('Product deleted', 'تم حذف المنتج'));
      setDeleteOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (row: ProductRow) => {
    setEditing(row);
    const { id: _id, ...rest } = row;
    setForm(rest);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ ...form, id: editing.id });
    else createMutation.mutate(form);
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t('Product catalogue', 'كتالوج المنتجات')}</h2>
        <Button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white gap-2 rounded-full">
          <Plus className="h-4 w-4" />
          {t('Add Product', 'إضافة منتج')}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">{t('No products yet', 'لا توجد منتجات بعد')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('Name (EN)', 'الاسم إنجليزي')}</TableHead>
                    <TableHead>{t('Name (AR)', 'الاسم عربي')}</TableHead>
                    <TableHead>{t('Category', 'الفئة')}</TableHead>
                    <TableHead>{t('Status', 'الحالة')}</TableHead>
                    <TableHead className="text-right">{t('Actions', 'إجراءات')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((row) => (
                    <TableRow key={row.id} className="group">
                      <TableCell className="font-medium text-sm">{row.nameEn}</TableCell>
                      <TableCell className="text-sm" dir="rtl">{row.nameAr}</TableCell>
                      <TableCell className="text-sm">{isAr ? row.categoryAr : row.categoryEn}</TableCell>
                      <TableCell>
                        {row.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0">{t('Active', 'نشط')}</Badge>
                        ) : (
                          <Badge variant="outline">{t('Inactive', 'غير نشط')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => {
                              setDeletingId(row.id);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? t('Edit product', 'تعديل المنتج') : t('Add product', 'إضافة منتج')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Name (English) *</Label>
                <Input required value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>الاسم (عربي) *</Label>
                <Input required dir="rtl" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Category (EN) *</Label>
                <Input required value={form.categoryEn} onChange={(e) => setForm({ ...form, categoryEn: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>الفئة (عربي) *</Label>
                <Input required dir="rtl" value={form.categoryAr} onChange={(e) => setForm({ ...form, categoryAr: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Form (EN)</Label>
                <Input value={form.formEn} onChange={(e) => setForm({ ...form, formEn: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>الشكل</Label>
                <Input dir="rtl" value={form.formAr} onChange={(e) => setForm({ ...form, formAr: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Strength (EN)</Label>
                <Input value={form.strengthEn} onChange={(e) => setForm({ ...form, strengthEn: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>التركيز</Label>
                <Input dir="rtl" value={form.strengthAr} onChange={(e) => setForm({ ...form, strengthAr: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Packaging (EN)</Label>
                <Input value={form.packagingEn} onChange={(e) => setForm({ ...form, packagingEn: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>التغليف</Label>
                <Input dir="rtl" value={form.packagingAr} onChange={(e) => setForm({ ...form, packagingAr: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Description (EN)</Label>
              <Textarea rows={3} value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>الوصف</Label>
              <Textarea rows={3} dir="rtl" value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('Leaflet URL', 'رابط النشرة')}</Label>
              <Input value={form.leafletUrl} onChange={(e) => setForm({ ...form, leafletUrl: e.target.value })} placeholder="/uploads/leaflet.pdf" />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>{t('Published on website', 'منشور على الموقع')}</Label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>{t('Cancel', 'إلغاء')}</Button>
              <Button type="submit" disabled={pending} className="bg-brand-600 text-white">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('Save', 'حفظ')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Delete product?', 'حذف المنتج؟')}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
            >
              {t('Delete', 'حذف')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
