'use client';

import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store';

interface NewsArticle {
  id: number;
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

interface NewsDetailModalProps {
  article: NewsArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateStr: string, locale: 'en' | 'ar'): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function NewsDetailModal({ article, open, onOpenChange }: NewsDetailModalProps) {
  const { locale } = useAppStore();

  const isRtl = locale === 'ar';

  const localized = useMemo(() => {
    if (!article) return null;
    return {
      title: isRtl ? article.titleAr : article.titleEn,
      excerpt: isRtl ? article.excerptAr : article.excerptEn,
      content: isRtl ? article.contentAr : article.contentEn,
      date: formatDate(article.date, locale),
    };
  }, [article, locale, isRtl]);

  const paragraphs = useMemo(() => {
    if (!localized?.content) return [];
    return localized.content.split('\n\n').filter((p) => p.trim().length > 0);
  }, [localized]);

  if (!article || !localized) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <p className="text-muted-foreground">Article not found.</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-xl border-brand-200/60 shadow-2xl shadow-brand-900/10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="overflow-y-auto max-h-[80vh]"
        >
          {/* Hero Image */}
          {article.imageUrl && (
            <div className="relative w-full h-64 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={localized.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

              {/* Close Button over image */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-3 right-3 z-10 rounded-full bg-white/90 backdrop-blur-sm p-2 text-brand-800 shadow-md hover:bg-white hover:text-brand-950 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {!article.imageUrl && (
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Article Body */}
          <div className="px-6 py-5 sm:px-8 sm:py-6">
            <DialogHeader className="text-left space-y-3">
              {/* Category Badge + Date Row */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 border border-brand-200/60">
                  {article.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {localized.date}
                </span>
              </div>

              {/* Title */}
              <DialogTitle className="text-2xl lg:text-3xl font-bold text-foreground leading-tight tracking-tight">
                {localized.title}
              </DialogTitle>

              {/* Excerpt / Description */}
              <DialogDescription className="text-base text-brand-700/80 font-medium leading-relaxed">
                {localized.excerpt}
              </DialogDescription>
            </DialogHeader>

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-brand-200/60 via-brand-300/40 to-transparent" />

            {/* Content Paragraphs */}
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}