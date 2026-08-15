'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { useAppStore } from '@/store';

interface AdminUserRow {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function UsersTab() {
  const { locale } = useAppStore();
  const { data: session } = useSession();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const qc = useQueryClient();
  const selfId = session?.user?.id;

  const { data: users = [], isLoading, isError } = useQuery<AdminUserRow[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const r = await fetch('/api/users');
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed');
      return Array.isArray(data) ? data : [];
    },
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUserRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    email: '',
    name: '',
    password: '',
    role: 'editor',
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: (body: typeof form) =>
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('User created', 'تم إنشاء المستخدم'));
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('User updated', 'تم تحديث المستخدم'));
      closeDialog();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/users?id=${id}`, { method: 'DELETE' }).then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');
        return data;
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(t('User deleted', 'تم حذف المستخدم'));
      setDeleteOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ email: '', name: '', password: '', role: 'editor', isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (row: AdminUserRow) => {
    setEditing(row);
    setForm({
      email: row.email,
      name: row.name,
      password: '',
      role: row.role,
      isActive: row.isActive,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      const payload: Record<string, unknown> = {
        id: editing.id,
        email: form.email,
        name: form.name,
        role: form.role,
        isActive: form.isActive,
      };
      if (form.password) payload.password = form.password;
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(form);
    }
  };

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('Admin users', 'مستخدمو لوحة التحكم')}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              'Each person signs in with their own email and password. Passwords are hashed and never shown.',
              'يسجّل كل شخص دخوله ببريده وكلمة مروره. كلمات المرور مشفّرة ولا تُعرض.',
            )}
          </p>
        </div>
        <Button onClick={openCreate} className="bg-brand-600 hover:bg-brand-700 text-white gap-2 rounded-full shrink-0">
          <Plus className="h-4 w-4" />
          {t('Add user', 'إضافة مستخدم')}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : isError ? (
            <p className="text-sm text-center py-12 text-red-600">
              {t('Only administrators can manage users.', 'إدارة المستخدمين متاحة للمديرين فقط.')}
            </p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">{t('No users yet', 'لا يوجد مستخدمون')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Name', 'الاسم')}</TableHead>
                  <TableHead>{t('Email', 'البريد')}</TableHead>
                  <TableHead>{t('Role', 'الدور')}</TableHead>
                  <TableHead>{t('Status', 'الحالة')}</TableHead>
                  <TableHead className="text-right">{t('Actions', 'إجراءات')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((row) => (
                  <TableRow key={row.id} className="group">
                    <TableCell className="font-medium text-sm">
                      {row.name}
                      {selfId === String(row.id) && (
                        <span className="ms-2 text-xs text-gray-400">{t('(you)', '(أنت)')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{row.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.role}</Badge>
                    </TableCell>
                    <TableCell>
                      {row.isActive ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">{t('Active', 'نشط')}</Badge>
                      ) : (
                        <Badge variant="outline">{t('Disabled', 'موقوف')}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {selfId !== String(row.id) && (
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
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? t('Edit user', 'تعديل المستخدم') : t('Add user', 'إضافة مستخدم')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('Full name', 'الاسم الكامل')} *</Label>
              <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('Email', 'البريد')} *</Label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>
                {editing
                  ? t('New password (leave blank to keep, min 8 characters)', 'كلمة مرور جديدة (اتركها فارغة للإبقاء، 8 أحرف على الأقل)')
                  : t('Password (min 8 characters)', 'كلمة المرور (8 أحرف على الأقل)')}
              </Label>
              <Input
                type="password"
                autoComplete="new-password"
                required={!editing}
                minLength={editing ? 8 : 8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('Role', 'الدور')}</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('Admin — full access', 'مدير — صلاحية كاملة')}</SelectItem>
                  <SelectItem value="editor">{t('Editor — content only', 'محرر — المحتوى فقط')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
              <Label>{t('Account active', 'الحساب نشط')}</Label>
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
            <DialogTitle>{t('Delete this user?', 'حذف هذا المستخدم؟')}</DialogTitle>
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
