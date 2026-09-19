'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { canUseNativeShare, copyText } from '@/lib/share-news';
import { useAppStore } from '@/store';

export function PageShareButton({
  title,
  text,
  successEn,
  successAr,
  className,
}: {
  title: string;
  text?: string;
  successEn: string;
  successAr: string;
  className?: string;
}) {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href.split('#')[0];

    if (canUseNativeShare()) {
      try {
        await navigator.share({
          title,
          text: text || title,
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    const ok = await copyText(url);
    if (!ok) {
      toast.error(isAr ? 'تعذر نسخ الرابط' : 'Could not copy the link');
      return;
    }
    setCopied(true);
    toast.success(isAr ? successAr : successEn);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Button type="button" variant="outline" size="sm" className={className} onClick={handleShare}>
      {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
      {copied ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'مشاركة' : 'Share'}
    </Button>
  );
}
