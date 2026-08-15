'use client';

import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Download, Send, Package, Syringe, Droplets, FlaskConical, X } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn } from './SectionWrapper';
import { Button } from '@/components/ui/button';
import { SurfaceCard } from '@/components/ui/surface-card';
import { motionTransition, STAGGER_MS } from '@/lib/motion-craft';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

interface Product {
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
  isActive: boolean;
}

const categoryIcons: Record<string, React.ElementType> = {
  Cephalosporins: PillIcon,
  Injectables: Syringe,
  Ampoules: FlaskConical,
  'Eye Drops': Droplets,
  'سيفالوسبورين': PillIcon,
  'حقن': Syringe,
  'أمبولات': FlaskConical,
  'قطرات عينية': Droplets,
};

function PillIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

const ProductCard = memo(function ProductCard({
  product,
  locale,
  labels,
  onDetail,
  onLeaflet,
  onSample,
}: {
  product: Product;
  locale: string;
  labels: {
    form: string;
    strength: string;
    packaging: string;
    viewDetails: string;
    downloadLeaflet: string;
    requestSample: string;
  };
  onDetail: (product: Product) => void;
  onLeaflet: (product: Product) => void;
  onSample: (product: Product) => void;
}) {
  const category = locale === 'ar' ? product.categoryAr : product.categoryEn;
  const Icon = categoryIcons[category] || categoryIcons[product.categoryEn] || Package;
  return (
    <SurfaceCard hover className="p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[var(--ink)] leading-snug group-hover:text-brand-700 transition-colors">
              {locale === 'ar' ? product.nameAr : product.nameEn}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-0.5 rounded-md">
              {category}
            </span>
          </div>
          <div className="size-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
            <Icon className="size-5.5" />
          </div>
        </div>

        <p className="text-sm text-[var(--ink-secondary)] mb-5 leading-relaxed">
          {locale === 'ar' ? product.descAr : product.descEn}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5 text-xs bg-[#F7F9FC] border border-[rgba(10,37,68,0.06)] rounded-xl p-3">
          <div>
            <span className="text-[var(--ink-secondary)] block text-[11px] mb-0.5">{labels.form}</span>
            <span className="font-semibold text-[var(--ink)]">
              {locale === 'ar' ? product.formAr : product.formEn}
            </span>
          </div>
          <div>
            <span className="text-[var(--ink-secondary)] block text-[11px] mb-0.5">{labels.strength}</span>
            <span className="font-semibold text-[var(--ink)]">
              {locale === 'ar' ? product.strengthAr : product.strengthEn}
            </span>
          </div>
          <div className="col-span-2 pt-2 border-t border-[rgba(10,37,68,0.06)]">
            <span className="text-[var(--ink-secondary)] block text-[11px] mb-0.5">{labels.packaging}</span>
            <span className="font-semibold text-[var(--ink)]">
              {locale === 'ar' ? product.packagingAr : product.packagingEn}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-[rgba(10,37,68,0.06)]">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 min-w-[7rem] text-xs h-8 text-brand-700 hover:text-brand-800 hover:bg-brand-50 rounded-full"
          onClick={() => onDetail(product)}
        >
          <Eye className="size-3.5 me-1" />
          {labels.viewDetails}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 min-w-[7rem] text-xs h-8 text-brand-700 hover:text-brand-800 hover:bg-brand-50 rounded-full"
          onClick={() => onLeaflet(product)}
        >
          <Download className="size-3.5 me-1" />
          {labels.downloadLeaflet}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex-1 min-w-[7rem] text-xs h-8 text-brand-700 hover:text-brand-800 hover:bg-brand-50 rounded-full"
          onClick={() => onSample(product)}
        >
          <Send className="size-3.5 me-1" />
          {labels.requestSample}
        </Button>
      </div>
    </SurfaceCard>
  );
});

export function ProductsSection({ initialProducts }: { initialProducts?: Product[] }) {
  const { t, locale } = useAppStore();
  const reduced = usePrefersReducedMotion();
  const [products, setProducts] = useState<Product[]>(
    () => initialProducts?.filter((p) => p.isActive) ?? [],
  );
  const [loading, setLoading] = useState(!initialProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [detail, setDetail] = useState<Product | null>(null);

  useEffect(() => {
    if (initialProducts) return;
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data.filter((p: Product) => p.isActive) : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [initialProducts]);

  const allLabel = locale === 'ar' ? t.products.categories[0] : t.products.categories[0];

  const categories = useMemo(() => {
    const key = locale === 'ar' ? 'categoryAr' : 'categoryEn';
    const unique = Array.from(new Set(products.map((p) => p[key]).filter(Boolean)));
    return ['all', ...unique];
  }, [products, locale]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) =>
      locale === 'ar' ? p.categoryAr === activeCategory : p.categoryEn === activeCategory,
    );
  }, [products, activeCategory, locale]);

  const labelOf = (cat: string) => (cat === 'all' ? allLabel : cat);

  const scrollToContact = useCallback((product: Product) => {
    const name = locale === 'ar' ? product.nameAr : product.nameEn;
    const subject = locale === 'ar' ? `طلب عينة: ${name}` : `Sample request: ${name}`;
    sessionStorage.setItem('nippur-contact-subject', subject);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  }, [locale]);

  const openLeaflet = useCallback((product: Product) => {
    if (product.leafletUrl) {
      window.open(product.leafletUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    toast.message(
      locale === 'ar' ? 'النشرة غير متوفرة لهذا المنتج حالياً.' : 'A leaflet is not available for this product yet.',
    );
  }, [locale]);

  const openDetail = useCallback((product: Product) => setDetail(product), []);

  const productLabels = useMemo(
    () => ({
      form: locale === 'ar' ? 'الشكل الصيدلاني' : 'Form',
      strength: locale === 'ar' ? 'التركيز' : 'Strength',
      packaging: locale === 'ar' ? 'التغليف' : 'Packaging',
      viewDetails: t.products.viewDetails,
      downloadLeaflet: t.products.downloadLeaflet,
      requestSample: t.products.requestSample,
    }),
    [locale, t.products.downloadLeaflet, t.products.requestSample, t.products.viewDetails],
  );

  return (
    <SectionWrapper
      id="products"
      badge={t.products.badge}
      title={t.products.title}
      subtitle={t.products.subtitle}
    >
      <FadeIn className="mb-10">
        <div role="tablist" aria-label={locale === 'ar' ? 'فئات المنتجات' : 'Product categories'} className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                activeCategory === cat
                  ? 'bg-[var(--ink)] text-white shadow-sm'
                  : 'bg-white border border-[rgba(10,37,68,0.08)] text-[var(--ink-secondary)] hover:border-brand-200 hover:text-[var(--ink)]'
              }`}
            >
              {labelOf(cat)}
            </button>
          ))}
        </div>
      </FadeIn>

      {loading && (
        <p className="text-sm text-[var(--ink-secondary)] py-8">
          {locale === 'ar' ? 'جاري تحميل المنتجات…' : 'Loading products…'}
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={motionTransition.enter}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((product, i) => (
              <motion.div
                key={product.id}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  ...motionTransition.enter,
                  delay: reduced ? 0 : i * (STAGGER_MS / 1000),
                }}
              >
                <ProductCard
                  product={product}
                  locale={locale}
                  labels={productLabels}
                  onDetail={openDetail}
                  onLeaflet={openLeaflet}
                  onSample={scrollToContact}
                />
              </motion.div>
            ))}
        </motion.div>
      </AnimatePresence>

      {!loading && filteredItems.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>{locale === 'ar' ? 'لا توجد منتجات في هذه الفئة.' : 'No products found in this category.'}</p>
        </div>
      )}

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-detail-title"
          onClick={() => setDetail(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 end-3 rounded-full p-2 text-[var(--ink-secondary)] hover:bg-brand-50"
              onClick={() => setDetail(null)}
              aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}
            >
              <X className="size-4" />
            </button>
            <h3 id="product-detail-title" className="text-xl font-bold text-[var(--ink)] pe-8">
              {locale === 'ar' ? detail.nameAr : detail.nameEn}
            </h3>
            <p className="mt-2 text-sm text-brand-700 font-medium">
              {locale === 'ar' ? detail.categoryAr : detail.categoryEn}
            </p>
            <p className="mt-4 text-sm text-[var(--ink-secondary)] leading-relaxed">
              {locale === 'ar' ? detail.descAr : detail.descEn}
            </p>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-[var(--ink-secondary)] text-xs">{locale === 'ar' ? 'الشكل' : 'Form'}</dt>
                <dd className="font-semibold">{locale === 'ar' ? detail.formAr : detail.formEn}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-secondary)] text-xs">{locale === 'ar' ? 'التركيز' : 'Strength'}</dt>
                <dd className="font-semibold">{locale === 'ar' ? detail.strengthAr : detail.strengthEn}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[var(--ink-secondary)] text-xs">{locale === 'ar' ? 'التغليف' : 'Packaging'}</dt>
                <dd className="font-semibold">{locale === 'ar' ? detail.packagingAr : detail.packagingEn}</dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}
