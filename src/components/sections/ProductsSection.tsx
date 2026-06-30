'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Send, Package, Syringe, Droplets, FlaskConical } from 'lucide-react';
import { useAppStore } from '@/store';
import { SectionWrapper, FadeIn } from './SectionWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const categoryIcons: Record<string, React.ElementType> = {
  Cephalosporins: Pill,
  Injectables: Syringe,
  Ampoules: FlaskConical,
  'Eye Drops': Droplets,
  'سيفالوسبورين': Pill,
  'حقن': Syringe,
  'أمبولات': FlaskConical,
  'قطرات عينية': Droplets,
};

function Pill(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export function ProductsSection() {
  const { t, locale } = useAppStore();
  const [activeCategory, setActiveCategory] = useState(t.products.categories[0]);

  const filteredItems = activeCategory === t.products.categories[0]
    ? t.products.items
    : t.products.items.filter((item) => item.category === activeCategory);

  return (
    <SectionWrapper
      id="products"
      badge={t.products.badge}
      title={t.products.title}
      subtitle={t.products.subtitle}
    >
      {/* Category Tabs */}
      <FadeIn className="mb-10">
        <div className="flex flex-wrap gap-2">
          {t.products.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-700 text-white shadow-lg shadow-brand-700/20'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredItems.map((product, i) => {
            const Icon = categoryIcons[product.category] || Package;
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: '0 20px 40px oklch(0.45 0.08 175 / 0.06)' }}
                className="rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-brand-200 transition-colors"
              >
                {/* Card Header */}
                <div className="h-2 bg-gradient-to-r from-brand-600 to-brand-400" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground leading-tight">{product.name}</h3>
                      <Badge variant="secondary" className="mt-2 text-xs bg-brand-50 text-brand-700 hover:bg-brand-100">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{product.desc}</p>

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <span className="text-muted-foreground block">{locale === 'ar' ? 'الشكل الصيدلاني' : 'Form'}</span>
                      <span className="font-medium text-foreground">{product.form}</span>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <span className="text-muted-foreground block">{locale === 'ar' ? 'التركيز' : 'Strength'}</span>
                      <span className="font-medium text-foreground">{product.strength}</span>
                    </div>
                    <div className="col-span-2 bg-muted/50 rounded-lg p-2.5">
                      <span className="text-muted-foreground block">{locale === 'ar' ? 'التغليف' : 'Packaging'}</span>
                      <span className="font-medium text-foreground">{product.packaging}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/50">
                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-brand-700 hover:text-brand-800 hover:bg-brand-50">
                      <Eye className="w-3.5 h-3.5 me-1" />
                      {t.products.viewDetails}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-brand-700 hover:text-brand-800 hover:bg-brand-50">
                      <Download className="w-3.5 h-3.5 me-1" />
                      {t.products.downloadLeaflet}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-gold-600 hover:text-gold-700 hover:bg-gold-50">
                      <Send className="w-3.5 h-3.5 me-1" />
                      {t.products.requestSample}
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No products found in this category.</p>
        </div>
      )}
    </SectionWrapper>
  );
}

