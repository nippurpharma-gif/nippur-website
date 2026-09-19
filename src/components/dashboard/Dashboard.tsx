'use client';

import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Newspaper,
  Users,
  LogOut,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  FileText,
  TrendingUp,
  Eye,
  Download,
  ChevronDown,
  Loader2,
  Handshake,
  Briefcase,
  Settings,
  Upload,
  Package,
  Shield,
  PanelsTopLeft,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'motion/react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useAppStore } from '@/store';
import { ProductsTab } from '@/components/dashboard/ProductsTab';
import { UsersTab } from '@/components/dashboard/UsersTab';
import { ProductionStatsEditor } from '@/components/dashboard/ProductionStatsEditor';
import { HomepageSectionsEditor } from '@/components/dashboard/HomepageSectionsEditor';
import { NewsShareDialog, JobShareDialog } from '@/components/share/SocialShareDialog';
import {
  DEFAULT_PRODUCTION_STATS,
  parseProductionStats,
  type ProductionStat,
} from '@/lib/production-stats';

const API_BASE = '/api';

function asList<T>(data: unknown): T[] {
  return Array.isArray(data) ? data : [];
}

// ── Types ──────────────────────────────────────────────────────────────

interface NewsArticle {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  date: string;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
}

interface Application {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  cvFileName: string;
  cvFilePath: string;
  coverLetter: string;
  status: string;
  createdAt: string;
}

interface NewsFormData {
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  date: string;
  imageUrl: string;
  isPublished: boolean;
}

interface Partner {
  id: number;
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface PartnerFormData {
  nameEn: string;
  nameAr: string;
  description: string;
  logoUrl: string;
  sortOrder: number;
  isActive: boolean;
}

interface JobPosition {
  id: number;
  slug: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  experienceLevel: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibilitiesEn: string;
  responsibilitiesAr: string;
  requirementsEn: string;
  requirementsAr: string;
  offerEn: string;
  offerAr: string;
  applicationEmail: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

interface JobFormData {
  slug: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  experienceLevel: string;
  descriptionEn: string;
  descriptionAr: string;
  responsibilitiesEn: string;
  responsibilitiesAr: string;
  requirementsEn: string;
  requirementsAr: string;
  offerEn: string;
  offerAr: string;
  applicationEmail: string;
  sortOrder: number;
  isActive: boolean;
}

interface SiteSettingsData {
  id: number;
  companyNameEn: string;
  companyNameAr: string;
  logoUrl: string;
  email: string;
  phone: string;
  emergencyPhone: string;
  address: string;
  workingHours: string;
  descriptionEn: string;
  descriptionAr: string;
  productionStats?: ProductionStat[];
  updatedAt: string;
}

const emptyNewsForm: NewsFormData = {
  slug: '',
  titleEn: '',
  titleAr: '',
  excerptEn: '',
  excerptAr: '',
  contentEn: '',
  contentAr: '',
  category: 'General',
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  isPublished: false,
};

const CATEGORIES = ['General', 'Achievement', 'Manufacturing', 'Events', 'Partnership'];
const APP_STATUSES = ['pending', 'reviewed', 'accepted', 'rejected'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract'];

const emptyPartnerForm: PartnerFormData = {
  nameEn: '',
  nameAr: '',
  description: '',
  logoUrl: '',
  sortOrder: 0,
  isActive: true,
};

const emptyJobForm: JobFormData = {
  slug: '',
  titleEn: '',
  titleAr: '',
  departmentEn: '',
  departmentAr: '',
  location: 'Baghdad',
  type: 'Full-time',
  experienceLevel: '',
  descriptionEn: '',
  descriptionAr: '',
  responsibilitiesEn: '',
  responsibilitiesAr: '',
  requirementsEn: '',
  requirementsAr: '',
  offerEn: '',
  offerAr: '',
  applicationEmail: '',
  sortOrder: 0,
  isActive: true,
};

// ── Helpers ─────────────────────────────────────────────────────────────

function statusBadge(status: string) {
  const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; labelEn: string; labelAr: string }> = {
    pending: { variant: 'outline', labelEn: 'Pending', labelAr: 'قيد الانتظار' },
    reviewed: { variant: 'secondary', labelEn: 'Reviewed', labelAr: 'تمت المراجعة' },
    accepted: { variant: 'default', labelEn: 'Accepted', labelAr: 'مقبول' },
    rejected: { variant: 'destructive', labelEn: 'Rejected', labelAr: 'مرفوض' },
  };
  const s = map[status] || map.pending;
  return <Badge variant={s.variant}>{s.labelEn}</Badge>;
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ── Sidebar Navigation Config ──────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'overview', icon: LayoutDashboard, labelEn: 'Overview', labelAr: 'نظرة عامة' },
  { id: 'sections', icon: PanelsTopLeft, labelEn: 'Page Sections', labelAr: 'أقسام الصفحة' },
  { id: 'products', icon: Package, labelEn: 'Products', labelAr: 'المنتجات' },
  { id: 'news', icon: Newspaper, labelEn: 'News Management', labelAr: 'إدارة الأخبار' },
  { id: 'applications', icon: Users, labelEn: 'Applications', labelAr: 'الطلبات' },
  { id: 'partners', icon: Handshake, labelEn: 'Partners', labelAr: 'الشركاء' },
  { id: 'jobs', icon: Briefcase, labelEn: 'Job Positions', labelAr: 'الوظائف' },
  { id: 'users', icon: Shield, labelEn: 'Users & Login', labelAr: 'المستخدمون وتسجيل الدخول' },
  { id: 'settings', icon: Settings, labelEn: 'Site Settings', labelAr: 'إعدادات الموقع' },
];

// ── Dashboard Component ────────────────────────────────────────────────

export function Dashboard() {
  const { dashboardTab, setDashboardTab, locale } = useAppStore();
  const isAr = locale === 'ar';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTab = dashboardTab || 'overview';

  const t = (en: string, ar: string) => (isAr ? ar : en);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden" dir="ltr">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-950 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <img
            src="/images/logo-nippur.png"
            alt="NIPPUR Pharma"
            className="h-9 w-auto brightness-0 invert"
          />
          <button
            className="lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setDashboardTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 cursor-pointer
                  ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{t(item.labelEn, item.labelAr)}</span>
              </button>
            );
          })}
        </nav>
        {/* Logout */}
        <div className="px-3 py-2 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>{t('Logout', 'تسجيل الخروج')}</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">
              {activeTab === 'overview' && t('Overview', 'نظرة عامة')}
              {activeTab === 'sections' && t('Page Sections', 'أقسام الصفحة')}
              {activeTab === 'products' && t('Products', 'المنتجات')}
              {activeTab === 'news' && t('News Management', 'إدارة الأخبار')}
              {activeTab === 'applications' && t('Applications', 'الطلبات')}
              {activeTab === 'partners' && t('Partners', 'الشركاء')}
              {activeTab === 'jobs' && t('Job Positions', 'الوظائف')}
              {activeTab === 'users' && t('Users & Login', 'المستخدمون وتسجيل الدخول')}
              {activeTab === 'settings' && t('Site Settings', 'إعدادات الموقع')}
            </h1>

            {/* Language indicator */}
            <Badge variant="outline" className="text-xs font-normal">
              {isAr ? 'العربية' : 'English'}
            </Badge>
          </div>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'sections' && <HomepageSectionsEditor />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'news' && <NewsTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'partners' && <PartnersTab />}
          {activeTab === 'jobs' && <JobsTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}

// ── Overview Tab ────────────────────────────────────────────────────────

function OverviewTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const { data: news = [], isLoading: newsLoading } = useQuery<NewsArticle[]>({
    queryKey: ['news'],
    queryFn: async () => asList<NewsArticle>(await fetch(`${API_BASE}/news`).then((r) => r.json())),
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () =>
      asList<Application>(await fetch(`${API_BASE}/applications`).then((r) => r.json())),
  });

  const publishedCount = news.filter((n) => n.isPublished).length;
  const recentApps = applications.slice(0, 5);

  const stats = [
    {
      label: t('Total News', 'إجمالي الأخبار'),
      value: news.length,
      icon: Newspaper,
      color: 'bg-brand-50 text-brand-600',
    },
    {
      label: t('Total Applications', 'إجمالي الطلبات'),
      value: applications.length,
      icon: Users,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: t('Published News', 'الأخبار المنشورة'),
      value: publishedCount,
      icon: Eye,
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">
                        {newsLoading || appsLoading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              {t('Recent Applications', 'أحدث الطلبات')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
              </div>
            ) : recentApps.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">{t('No applications yet', 'لا توجد طلبات بعد')}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                        {t('Name', 'الاسم')}
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                        {t('Position', 'المنصب')}
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                        {t('Status', 'الحالة')}
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-gray-500 uppercase">
                        {t('Date', 'التاريخ')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium text-gray-900 text-sm">
                          {app.fullName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{app.position}</TableCell>
                        <TableCell>{statusBadge(app.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">{formatDate(app.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ── News Tab ────────────────────────────────────────────────────────────

function NewsTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [sharingNews, setSharingNews] = useState<NewsArticle | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<NewsFormData>(emptyNewsForm);

  const { data: news = [], isLoading } = useQuery<NewsArticle[]>({
    queryKey: ['news'],
    queryFn: async () => asList<NewsArticle>(await fetch(`${API_BASE}/news`).then((r) => r.json())),
  });

  const createMutation = useMutation({
    mutationFn: (data: NewsFormData) =>
      fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: NewsFormData & { id: number }) =>
      fetch(`${API_BASE}/news`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${API_BASE}/news?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  function openCreateDialog() {
    setEditingNews(null);
    setFormData(emptyNewsForm);
    setDialogOpen(true);
  }

  function openEditDialog(article: NewsArticle) {
    setEditingNews(article);
    setFormData({
      slug: article.slug || '',
      titleEn: article.titleEn,
      titleAr: article.titleAr,
      excerptEn: article.excerptEn,
      excerptAr: article.excerptAr,
      contentEn: article.contentEn,
      contentAr: article.contentAr,
      category: article.category,
      date: article.date,
      imageUrl: article.imageUrl,
      isPublished: article.isPublished,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingNews(null);
    setFormData(emptyNewsForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleDelete() {
    if (deletingId !== null) {
      deleteMutation.mutate(deletingId);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      {/* Header with action */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t('All Articles', 'جميع المقالات')}</h2>
        <Button onClick={openCreateDialog} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          {t('Add New Article', 'إضافة مقال جديد')}
        </Button>
      </div>

      {/* News Table */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : news.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">{t('No articles yet', 'لا توجد مقالات بعد')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Title', 'العنوان')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Slug', 'الرابط')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Category', 'الفئة')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Date', 'التاريخ')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Status', 'الحالة')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">
                      {t('Actions', 'الإجراءات')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((article) => (
                    <TableRow key={article.id} className="group">
                      <TableCell className="font-medium text-gray-900 text-sm max-w-[250px] truncate">
                        {isAr ? article.titleAr : article.titleEn}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 max-w-[140px] truncate">
                        {article.slug ? (
                          <a
                            href={`/news/${article.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-600 hover:underline"
                          >
                            {article.slug}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {article.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{formatDate(article.date)}</TableCell>
                      <TableCell>
                        {article.isPublished ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">
                            {t('Published', 'منشور')}
                          </Badge>
                        ) : (
                          <Badge variant="outline">{t('Draft', 'مسودة')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-brand-600"
                            title={t('Share', 'مشاركة')}
                            onClick={() => setSharingNews(article)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-brand-600"
                            onClick={() => openEditDialog(article)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => {
                              setDeletingId(article.id);
                              setDeleteDialogOpen(true);
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? t('Edit Article', 'تعديل المقال') : t('Add New Article', 'إضافة مقال جديد')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Title (English)', 'العنوان (إنجليزي)')} *
                </Label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Article title in English"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Title (Arabic)', 'العنوان (عربي)')} *
                </Label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  placeholder="عنوان المقال بالعربية"
                  dir="rtl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">
                {t('URL slug (optional)', 'رابط الخبر (اختياري)')}
              </Label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/-+/g, '-'),
                  })
                }
                placeholder="gmp-certification"
              />
              <p className="text-[11px] text-gray-400">
                {formData.slug
                  ? `/news/${formData.slug}`
                  : t('Auto-generated from English title if empty', 'يُولَّد تلقائياً من العنوان الإنجليزي إن تُرك فارغاً')}
              </p>
            </div>

            {/* Excerpt row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Excerpt (English)', 'المقتطف (إنجليزي)')}
                </Label>
                <Textarea
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  placeholder="Brief excerpt in English"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Excerpt (Arabic)', 'المقتطف (عربي)')}
                </Label>
                <Textarea
                  value={formData.excerptAr}
                  onChange={(e) => setFormData({ ...formData, excerptAr: e.target.value })}
                  placeholder="مقتطف مختصر بالعربية"
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Content row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Content (English)', 'المحتوى (إنجليزي)')}
                </Label>
                <Textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Full article content in English"
                  rows={6}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Content (Arabic)', 'المحتوى (عربي)')}
                </Label>
                <Textarea
                  value={formData.contentAr}
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  placeholder="المحتوى الكامل للمقال بالعربية"
                  rows={6}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Meta fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Category', 'الفئة')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Date', 'التاريخ')}</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-gray-500">{t('Image URL', 'رابط الصورة')}</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Published toggle */}
            <div className="flex items-center gap-3 py-2">
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label className="text-sm text-gray-700">
                {formData.isPublished ? t('Published', 'منشور') : t('Draft', 'مسودة')}
              </Label>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>
                {t('Cancel', 'إلغاء')}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingNews ? t('Update Article', 'تحديث المقال') : t('Create Article', 'إنشاء المقال')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('Delete Article', 'حذف المقال')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {t(
              'Are you sure you want to delete this article? This action cannot be undone.',
              'هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.'
            )}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('Cancel', 'إلغاء')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('Delete', 'حذف')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <NewsShareDialog
        article={sharingNews}
        open={sharingNews !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setSharingNews(null);
        }}
      />
    </div>
  );
}

// ── Applications Tab ────────────────────────────────────────────────────

function ApplicationsTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const queryClient = useQueryClient();
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () =>
      asList<Application>(await fetch(`${API_BASE}/applications`).then((r) => r.json())),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      fetch(`${API_BASE}/applications`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  function openDetail(app: Application) {
    setSelectedApp(app);
    setDetailDialogOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t('All Applications', 'جميع الطلبات')}</h2>
        <Badge variant="secondary" className="text-xs">
          {applications.length} {t('total', 'إجمالي')}
        </Badge>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">
              {t('No applications yet', 'لا توجد طلبات بعد')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Name', 'الاسم')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Email', 'البريد')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Position', 'المنصب')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Department', 'القسم')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('CV', 'السيرة الذاتية')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Date', 'التاريخ')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Status', 'الحالة')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow
                      key={app.id}
                      className="cursor-pointer hover:bg-gray-50/50"
                      onClick={() => openDetail(app)}
                    >
                      <TableCell className="font-medium text-gray-900 text-sm">{app.fullName}</TableCell>
                      <TableCell className="text-sm text-gray-600">{app.email}</TableCell>
                      <TableCell className="text-sm text-gray-600">{app.position}</TableCell>
                      <TableCell className="text-sm text-gray-500">{app.department || '—'}</TableCell>
                      <TableCell>
                        {app.cvFileName ? (
                          <a
                            href={`/api/uploads/${app.cvFileName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs font-medium"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {t('Download', 'تحميل')}
                          </a>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{formatDate(app.createdAt)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={app.status}
                          onValueChange={(val) => statusMutation.mutate({ id: app.id, status: val })}
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {APP_STATUSES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s === 'pending' && t('Pending', 'قيد الانتظار')}
                                {s === 'reviewed' && t('Reviewed', 'تمت المراجعة')}
                                {s === 'accepted' && t('Accepted', 'مقبول')}
                                {s === 'rejected' && t('Rejected', 'مرفوض')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('Application Details', 'تفاصيل الطلب')}</DialogTitle>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Full Name', 'الاسم الكامل')}</p>
                  <p className="text-sm text-gray-900 mt-0.5 font-medium">{selectedApp.fullName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Email', 'البريد الإلكتروني')}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Phone', 'الهاتف')}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedApp.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Position', 'المنصب')}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedApp.position}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Department', 'القسم')}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedApp.department || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Date', 'التاريخ')}</p>
                  <p className="text-sm text-gray-900 mt-0.5">{formatDate(selectedApp.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Status', 'الحالة')}</p>
                  <div className="mt-0.5">{statusBadge(selectedApp.status)}</div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('CV', 'السيرة الذاتية')}</p>
                  {selectedApp.cvFileName ? (
                    <a
                      href={`/api/uploads/${selectedApp.cvFileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 text-sm font-medium mt-0.5"
                    >
                      <Download className="h-4 w-4" />
                      {selectedApp.cvFileName}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 mt-0.5">—</p>
                  )}
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase">{t('Cover Letter', 'الرسالة المصاحبة')}</p>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Status update in dialog */}
              <div className="pt-3 border-t">
                <p className="text-xs font-medium text-gray-400 uppercase mb-2">{t('Update Status', 'تحديث الحالة')}</p>
                <Select
                  value={selectedApp.status}
                  onValueChange={(val) => {
                    statusMutation.mutate({ id: selectedApp.id, status: val });
                    setSelectedApp({ ...selectedApp, status: val });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APP_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === 'pending' && t('Pending', 'قيد الانتظار')}
                        {s === 'reviewed' && t('Reviewed', 'تمت المراجعة')}
                        {s === 'accepted' && t('Accepted', 'مقبول')}
                        {s === 'rejected' && t('Rejected', 'مرفوض')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Partners Tab ────────────────────────────────────────────────────────

function PartnersTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<PartnerFormData>(emptyPartnerForm);

  const { data: partners = [], isLoading } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: async () => asList<Partner>(await fetch(`${API_BASE}/partners`).then((r) => r.json())),
  });

  const createMutation = useMutation({
    mutationFn: (data: PartnerFormData) =>
      fetch(`${API_BASE}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: PartnerFormData & { id: number }) =>
      fetch(`${API_BASE}/partners`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${API_BASE}/partners?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  function openCreateDialog() {
    setEditingPartner(null);
    setFormData(emptyPartnerForm);
    setDialogOpen(true);
  }

  function openEditDialog(partner: Partner) {
    setEditingPartner(partner);
    setFormData({
      nameEn: partner.nameEn,
      nameAr: partner.nameAr,
      description: partner.description,
      logoUrl: partner.logoUrl,
      sortOrder: partner.sortOrder,
      isActive: partner.isActive,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingPartner(null);
    setFormData(emptyPartnerForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingPartner) {
      updateMutation.mutate({ id: editingPartner.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleDelete() {
    if (deletingId !== null) {
      deleteMutation.mutate(deletingId);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t('All Partners', 'جميع الشركاء')}</h2>
        <Button onClick={openCreateDialog} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          {t('Add Partner', 'إضافة شريك')}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : partners.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">{t('No partners yet', 'لا يوجد شركاء بعد')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Name (EN)', 'الاسم (إنجليزي)')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Name (AR)', 'الاسم (عربي)')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Description', 'الوصف')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Sort Order', 'ترتيب')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Status', 'الحالة')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">{t('Actions', 'الإجراءات')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id} className="group">
                      <TableCell className="font-medium text-gray-900 text-sm">{partner.nameEn}</TableCell>
                      <TableCell className="text-sm text-gray-600" dir="rtl">{partner.nameAr}</TableCell>
                      <TableCell className="text-sm text-gray-500 max-w-[200px] truncate">{partner.description || '—'}</TableCell>
                      <TableCell className="text-sm text-gray-500">{partner.sortOrder}</TableCell>
                      <TableCell>
                        {partner.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">{t('Active', 'نشط')}</Badge>
                        ) : (
                          <Badge variant="outline">{t('Inactive', 'غير نشط')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-brand-600" onClick={() => openEditDialog(partner)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => {
                              setDeletingId(partner.id);
                              setDeleteDialogOpen(true);
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartner ? t('Edit Partner', 'تعديل الشريك') : t('Add New Partner', 'إضافة شريك جديد')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Name (English)', 'الاسم (إنجليزي)')} *</Label>
                <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} placeholder="Partner name" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Name (Arabic)', 'الاسم (عربي)')} *</Label>
                <Input value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })} placeholder="اسم الشريك" dir="rtl" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Description', 'الوصف')}</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Logo URL', 'رابط الشعار')}</Label>
              <Input value={formData.logoUrl} onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Sort Order', 'ترتيب')}</Label>
                <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-3 py-2">
                <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                <Label className="text-sm text-gray-700">{formData.isActive ? t('Active', 'نشط') : t('Inactive', 'غير نشط')}</Label>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>{t('Cancel', 'إلغاء')}</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingPartner ? t('Update Partner', 'تحديث الشريك') : t('Create Partner', 'إنشاء الشريك')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('Delete Partner', 'حذف الشريك')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {t('Are you sure you want to delete this partner? This action cannot be undone.', 'هل أنت متأكد من حذف هذا الشريك؟ لا يمكن التراجع عن هذا الإجراء.')}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="gap-2">
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('Delete', 'حذف')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// ── Jobs Tab ────────────────────────────────────────────────────────────

function JobsTab() {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);

  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
  const [sharingJob, setSharingJob] = useState<JobPosition | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<JobFormData>(emptyJobForm);

  const { data: jobs = [], isLoading } = useQuery<JobPosition[]>({
    queryKey: ['jobs'],
    queryFn: async () => asList<JobPosition>(await fetch(`${API_BASE}/jobs`).then((r) => r.json())),
  });

  const createMutation = useMutation({
    mutationFn: (data: JobFormData) =>
      fetch(`${API_BASE}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      closeDialog();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: JobFormData & { id: number }) =>
      fetch(`${API_BASE}/jobs`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      closeDialog();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`${API_BASE}/jobs?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  function openCreateDialog() {
    setEditingJob(null);
    setFormData(emptyJobForm);
    setDialogOpen(true);
  }

  function openEditDialog(job: JobPosition) {
    setEditingJob(job);
    setFormData({
      slug: job.slug || '',
      titleEn: job.titleEn,
      titleAr: job.titleAr,
      departmentEn: job.departmentEn,
      departmentAr: job.departmentAr,
      location: job.location,
      type: job.type,
      experienceLevel: job.experienceLevel || '',
      descriptionEn: job.descriptionEn,
      descriptionAr: job.descriptionAr,
      responsibilitiesEn: job.responsibilitiesEn || '',
      responsibilitiesAr: job.responsibilitiesAr || '',
      requirementsEn: job.requirementsEn || '',
      requirementsAr: job.requirementsAr || '',
      offerEn: job.offerEn || '',
      offerAr: job.offerAr || '',
      applicationEmail: job.applicationEmail,
      sortOrder: job.sortOrder,
      isActive: job.isActive,
    });
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditingJob(null);
    setFormData(emptyJobForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  function handleDelete() {
    if (deletingId !== null) {
      deleteMutation.mutate(deletingId);
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{t('All Job Positions', 'جميع الوظائف')}</h2>
        <Button onClick={openCreateDialog} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          {t('Add Job', 'إضافة وظيفة')}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
            </div>
          ) : jobs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-12">{t('No job positions yet', 'لا توجد وظائف بعد')}</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Title (EN)', 'العنوان (إنجليزي)')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Slug', 'الرابط')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Title (AR)', 'العنوان (عربي)')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Department', 'القسم')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Location', 'الموقع')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Type', 'النوع')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Email', 'البريد')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase">{t('Status', 'الحالة')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 uppercase text-right">{t('Actions', 'الإجراءات')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id} className="group">
                      <TableCell className="font-medium text-gray-900 text-sm">{job.titleEn}</TableCell>
                      <TableCell className="text-xs text-gray-500 max-w-[120px] truncate">
                        {job.slug ? (
                          <a href={`/careers/${job.slug}`} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">
                            {job.slug}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600" dir="rtl">{job.titleAr}</TableCell>
                      <TableCell className="text-sm text-gray-600">{isAr ? job.departmentAr : job.departmentEn}</TableCell>
                      <TableCell className="text-sm text-gray-500">{job.location}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">{job.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{job.applicationEmail || '—'}</TableCell>
                      <TableCell>
                        {job.isActive ? (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0">{t('Active', 'نشط')}</Badge>
                        ) : (
                          <Badge variant="outline">{t('Inactive', 'غير نشط')}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-brand-600"
                            title={t('Share', 'مشاركة')}
                            onClick={() => setSharingJob(job)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-brand-600" onClick={() => openEditDialog(job)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => {
                              setDeletingId(job.id);
                              setDeleteDialogOpen(true);
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? t('Edit Job Position', 'تعديل الوظيفة') : t('Add New Job Position', 'إضافة وظيفة جديدة')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Title (English)', 'العنوان (إنجليزي)')} *</Label>
                <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} placeholder="Job title" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Title (Arabic)', 'العنوان (عربي)')} *</Label>
                <Input value={formData.titleAr} onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })} placeholder="عنوان الوظيفة" dir="rtl" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">
                {t('URL slug (optional)', 'رابط الوظيفة (اختياري)')}
              </Label>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slug: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]+/g, '-')
                      .replace(/-+/g, '-'),
                  })
                }
                placeholder="production-supervisor"
              />
              <p className="text-[11px] text-gray-400">
                {formData.slug
                  ? `/careers/${formData.slug}`
                  : t('Auto-generated from English title if empty', 'يُولَّد تلقائياً من العنوان الإنجليزي إن تُرك فارغاً')}
              </p>
            </div>

            {/* Department row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Department (English)', 'القسم (إنجليزي)')}</Label>
                <Input value={formData.departmentEn} onChange={(e) => setFormData({ ...formData, departmentEn: e.target.value })} placeholder="Department" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Department (Arabic)', 'القسم (عربي)')}</Label>
                <Input value={formData.departmentAr} onChange={(e) => setFormData({ ...formData, departmentAr: e.target.value })} placeholder="القسم" dir="rtl" />
              </div>
            </div>

            {/* Meta fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Location', 'الموقع')}</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Baghdad" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Type', 'النوع')}</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((jt) => (
                      <SelectItem key={jt} value={jt}>{jt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Experience (optional)', 'الخبرة (اختياري)')}
                </Label>
                <Input
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  placeholder={t('e.g. 3–5 years', 'مثال: 3–5 سنوات')}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">{t('Sort Order', 'ترتيب')}</Label>
                <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })} />
              </div>
            </div>

            {/* Application Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Application Email', 'بريد التقديم')}</Label>
              <Input type="email" value={formData.applicationEmail} onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })} placeholder="careers@nippurpharma.iq" />
              <p className="text-xs text-gray-400">{t('Email address where applications for this position will be sent', 'عنوان البريد الإلكتروني الذي سيتم إرسال طلبات هذا المنصب إليه')}</p>
            </div>

            <div className="rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2">
              <p className="text-xs text-gray-500">
                {t(
                  'Optional detail fields: use one item per line for lists. Leave blank to hide a section on the job page.',
                  'الحقول التالية اختيارية: ضع كل نقطة في سطر مستقل. اترك الحقل فارغاً لإخفاء القسم من صفحة الوظيفة.',
                )}
              </p>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Overview (English)', 'نبذة (إنجليزي)')}
                </Label>
                <Textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Short role overview shown on cards and the job page"
                  rows={3}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Overview (Arabic)', 'نبذة (عربي)')}
                </Label>
                <Textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="نبذة قصيرة تظهر في البطاقات وصفحة الوظيفة"
                  rows={3}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Responsibilities (English, optional)', 'المسؤوليات (إنجليزي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.responsibilitiesEn}
                  onChange={(e) => setFormData({ ...formData, responsibilitiesEn: e.target.value })}
                  placeholder={"Oversee daily production\nEnsure GMP compliance\nTrain junior staff"}
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Responsibilities (Arabic, optional)', 'المسؤوليات (عربي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.responsibilitiesAr}
                  onChange={(e) => setFormData({ ...formData, responsibilitiesAr: e.target.value })}
                  placeholder={"الإشراف على الإنتاج اليومي\nضمان الالتزام بممارسات التصنيع الجيد\nتدريب الكوادر"}
                  rows={5}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Requirements (English, optional)', 'المتطلبات (إنجليزي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.requirementsEn}
                  onChange={(e) => setFormData({ ...formData, requirementsEn: e.target.value })}
                  placeholder={"Bachelor’s in Pharmacy or related field\n3+ years in pharmaceutical manufacturing"}
                  rows={5}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('Requirements (Arabic, optional)', 'المتطلبات (عربي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.requirementsAr}
                  onChange={(e) => setFormData({ ...formData, requirementsAr: e.target.value })}
                  placeholder={"بكالوريوس صيدلة أو تخصص ذي صلة\nخبرة 3 سنوات فأكثر في التصنيع الدوائي"}
                  rows={5}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Offer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('What we offer (English, optional)', 'ما نقدّمه (إنجليزي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.offerEn}
                  onChange={(e) => setFormData({ ...formData, offerEn: e.target.value })}
                  placeholder={"Competitive salary\nHealth insurance\nProfessional development"}
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-500">
                  {t('What we offer (Arabic, optional)', 'ما نقدّمه (عربي، اختياري)')}
                </Label>
                <Textarea
                  value={formData.offerAr}
                  onChange={(e) => setFormData({ ...formData, offerAr: e.target.value })}
                  placeholder={"راتب تنافسي\nتأمين صحي\nتطوير مهني"}
                  rows={4}
                  dir="rtl"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3 py-2">
              <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
              <Label className="text-sm text-gray-700">{formData.isActive ? t('Active', 'نشط') : t('Inactive', 'غير نشط')}</Label>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={closeDialog}>{t('Cancel', 'إلغاء')}</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-600 hover:bg-brand-700 text-white gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingJob ? t('Update Job', 'تحديث الوظيفة') : t('Create Job', 'إنشاء الوظيفة')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('Delete Job Position', 'حذف الوظيفة')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            {t('Are you sure you want to delete this job position? This action cannot be undone.', 'هل أنت متأكد من حذف هذه الوظيفة؟ لا يمكن التراجع عن هذا الإجراء.')}
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{t('Cancel', 'إلغاء')}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="gap-2">
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('Delete', 'حذف')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <JobShareDialog
        job={sharingJob}
        open={sharingJob !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setSharingJob(null);
        }}
      />
    </motion.div>
  );
}

// ── Settings Tab ────────────────────────────────────────────────────────

function SettingsTab() {
  const { locale, setSiteSettings } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SiteSettingsData>({
    queryKey: ['settings'],
    queryFn: () => fetch(`${API_BASE}/settings`).then((r) => r.json()),
  });

  const [formData, setFormData] = useState({
    companyNameEn: '',
    companyNameAr: '',
    logoUrl: '',
    email: '',
    phone: '',
    emergencyPhone: '',
    address: '',
    workingHours: '',
    descriptionEn: '',
    descriptionAr: '',
    productionStats: DEFAULT_PRODUCTION_STATS,
  });

  useEffect(() => {
    if (!settings || typeof settings !== 'object' || !('id' in settings)) return;
    setFormData({
      companyNameEn: settings.companyNameEn ?? '',
      companyNameAr: settings.companyNameAr ?? '',
      logoUrl: settings.logoUrl ?? '',
      email: settings.email ?? '',
      phone: settings.phone ?? '',
      emergencyPhone: settings.emergencyPhone ?? '',
      address: settings.address ?? '',
      workingHours: settings.workingHours ?? '',
      descriptionEn: settings.descriptionEn ?? '',
      descriptionAr: settings.descriptionAr ?? '',
      productionStats: parseProductionStats(settings.productionStats),
    });
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error(t('Please select an image file', 'يرجى اختيار ملف صورة'));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(t('Logo must be under 2MB', 'يجب أن يكون الشعار أقل من 2 ميجابايت'));
      return;
    }
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append('logo', file);
      const res = await fetch(`${API_BASE}/upload-logo`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.logoUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: data.logoUrl }));
        toast.success(t('Logo uploaded', 'تم رفع الشعار'));
      }
    } catch {
      toast.error(t('Upload failed', 'فشل رفع الشعار'));
    } finally {
      setUploadingLogo(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      if (saved && typeof saved === 'object' && saved.id) {
        setSiteSettings({
          ...saved,
          productionStats: parseProductionStats(saved.productionStats),
        });
      }
      toast.success(t('Settings saved successfully', 'تم حفظ الإعدادات بنجاح'));
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateMutation.mutate(formData);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-4xl"
    >
      {/* Company Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-brand-600" />
            {t('Company Information', 'معلومات الشركة')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Company Name (English)', 'اسم الشركة (إنجليزي)')}</Label>
              <Input value={formData.companyNameEn} onChange={(e) => setFormData({ ...formData, companyNameEn: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Company Name (Arabic)', 'اسم الشركة (عربي)')}</Label>
              <Input value={formData.companyNameAr} onChange={(e) => setFormData({ ...formData, companyNameAr: e.target.value })} dir="rtl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-500">{t('Logo', 'الشعار')}</Label>
            <div className="flex items-center gap-3">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo preview" className="h-14 w-auto object-contain bg-gray-50 rounded-lg p-2 border" />
              ) : (
                <div className="h-14 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                  {t('No logo', 'لا شعار')}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingLogo}
                  className="gap-1.5 text-xs"
                >
                  {uploadingLogo ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  {t('Upload Logo', 'رفع الشعار')}
                </Button>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://... or /images/..."
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-600" />
            {t('Contact Details', 'تفاصيل الاتصال')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Email', 'البريد الإلكتروني')}</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Phone', 'الهاتف')}</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Emergency Phone', 'هاتف الطوارئ')}</Label>
              <Input value={formData.emergencyPhone} onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-500">{t('Working Hours', 'ساعات العمل')}</Label>
              <Input value={formData.workingHours} onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-500">{t('Address', 'العنوان')}</Label>
            <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Eye className="h-5 w-5 text-brand-600" />
            {t('About the Company', 'عن الشركة')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-500">{t('Description (English)', 'الوصف (إنجليزي)')}</Label>
            <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} placeholder="Company description in English" rows={5} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-500">{t('Description (Arabic)', 'الوصف (عربي)')}</Label>
            <Textarea value={formData.descriptionAr} onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })} placeholder="وصف الشركة بالعربية" rows={5} dir="rtl" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-600" />
            {t('Production figures', 'أرقام الإنتاج')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductionStatsEditor
            stats={formData.productionStats}
            onChange={(productionStats) => setFormData({ ...formData, productionStats })}
            isAr={isAr}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={updateMutation.isPending} className="bg-brand-600 hover:bg-brand-700 text-white gap-2 min-w-[140px]">
          {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t('Save Settings', 'حفظ الإعدادات')}
        </Button>
      </div>
    </motion.form>
  );
}
