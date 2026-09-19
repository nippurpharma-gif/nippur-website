'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Share2, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/store';
import {
  buildJobShareCaption,
  buildNewsShareCaption,
  copyText,
  downloadImageFromUrl,
  getClientOrigin,
  getDefaultShareImage,
  getJobUrl,
  getLocalizedJobCopy,
  getLocalizedNewsCopy,
  getNewsArticleUrl,
  getShareComposerUrl,
  openShareWindow,
  shareNative,
  toAbsoluteUrl,
  type JobShareInput,
  type NewsShareArticle,
  type SharePlatform,
} from '@/lib/share-news';

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98C23.99 15.67 24 15.26 24 12s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
      <path d="M18.24 2H21.5l-7.19 8.22L22.5 22h-6.59l-5.16-6.74L4.99 22H1.72l7.69-8.79L1.5 2h6.76l4.66 6.17L18.24 2zm-1.16 18h1.81L7 3.89H5.06L17.08 20z" />
    </svg>
  );
}

const PLATFORMS: Array<{
  id: SharePlatform;
  labelEn: string;
  labelAr: string;
  className: string;
  icon: typeof LinkedInIcon;
}> = [
  {
    id: 'linkedin',
    labelEn: 'LinkedIn',
    labelAr: 'لينكدإن',
    className: 'bg-[#0A66C2] hover:bg-[#0858a6] text-white border-[#0A66C2]',
    icon: LinkedInIcon,
  },
  {
    id: 'facebook',
    labelEn: 'Facebook',
    labelAr: 'فيسبوك',
    className: 'bg-[#1877F2] hover:bg-[#1464cc] text-white border-[#1877F2]',
    icon: FacebookIcon,
  },
  {
    id: 'instagram',
    labelEn: 'Instagram',
    labelAr: 'إنستغرام',
    className:
      'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] hover:opacity-90 text-white border-transparent',
    icon: InstagramIcon,
  },
  {
    id: 'x',
    labelEn: 'X',
    labelAr: 'منصة X',
    className: 'bg-black hover:bg-neutral-800 text-white border-black',
    icon: XIcon,
  },
];

type SocialShareItem = {
  kind: 'news' | 'job';
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string;
  slug?: string;
  isLive: boolean;
  caption: string;
};

function SocialShareDialog({
  item,
  open,
  onOpenChange,
}: {
  item: SocialShareItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useAppStore();
  const isAr = locale === 'ar';
  const t = (en: string, ar: string) => (isAr ? ar : en);
  const isJob = item?.kind === 'job';
  const [caption, setCaption] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<SharePlatform | 'native' | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const origin = useMemo(() => getClientOrigin(), [open]);
  const isLocal = /localhost|127\.0\.0\.1/.test(origin);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    if (!item || !open) return;
    setCaption(item.caption);
    setCopied(false);
    setBusy(null);
  }, [item, open]);

  async function handleCopy() {
    const ok = await copyText(caption);
    if (ok) {
      setCopied(true);
      toast.success(t('Caption copied', 'تم نسخ نص المنشور'));
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      toast.error(t('Could not copy caption', 'تعذر نسخ النص'));
    }
  }

  async function handleNativeShare() {
    if (!item) return;
    setBusy('native');
    try {
      await copyText(caption);
      await shareNative({
        title: item.title,
        text: caption,
        url: item.url,
        imageUrl: item.imageUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      toast.error(t('Share was cancelled or failed', 'تم إلغاء المشاركة أو فشلت'));
    } finally {
      setBusy(null);
    }
  }

  async function handlePlatform(platform: SharePlatform) {
    if (!item) return;
    setBusy(platform);
    try {
      await copyText(caption);

      if (platform === 'instagram') {
        if (item.imageUrl) {
          await downloadImageFromUrl(item.imageUrl, `${item.slug || item.kind}.jpg`);
        }
        toast.success(
          t(
            'Caption copied. Upload the image in Instagram, then paste the text.',
            'تم نسخ النص. ارفع الصورة في إنستغرام ثم الصق الكتابة.',
          ),
        );
        openShareWindow('https://www.instagram.com/');
        return;
      }

      if (platform === 'facebook') {
        toast.success(
          t(
            'Caption copied. Facebook fills the link and image; paste the text if needed.',
            'تم نسخ النص. فيسبوك يملأ الرابط والصورة؛ الصق الكتابة إن لزم.',
          ),
        );
      } else if (platform === 'linkedin') {
        toast.success(
          t(
            isJob
              ? 'Opening LinkedIn with the job text and link.'
              : 'Opening LinkedIn with the article text and link.',
            isJob
              ? 'جارٍ فتح لينكدإن بنص الوظيفة والرابط.'
              : 'جارٍ فتح لينكدإن بنص الخبر والرابط.',
          ),
        );
      }

      openShareWindow(getShareComposerUrl(platform, caption, item.url));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto bg-white"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-4 text-brand-700" />
            {isJob ? t('Share job', 'مشاركة الوظيفة') : t('Share article', 'مشاركة المقال')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'The site prepares the text, image, and link. You review and publish in the app.',
              'الموقع يجهّز النص والصورة والرابط. أنت تراجع وتنشر من التطبيق.',
            )}
          </DialogDescription>
        </DialogHeader>

        {item && (
          <div className="space-y-4">
            <div className="flex gap-3 rounded-xl border border-[rgba(10,37,68,0.08)] bg-brand-50/50 p-3">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt=""
                  className="size-16 rounded-lg object-cover shrink-0 bg-white"
                />
              ) : (
                <div className="size-16 rounded-lg bg-brand-100 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--ink)] line-clamp-2">{item.title}</p>
                {item.excerpt ? (
                  <p className="mt-1 text-xs text-[var(--ink-secondary)] line-clamp-2">{item.excerpt}</p>
                ) : null}
                <p className="mt-1 text-xs text-brand-700 break-all">{item.url}</p>
              </div>
            </div>

            {!item.isLive && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                {isJob
                  ? t(
                      'This job is inactive. Activate it first so the public link works.',
                      'هذه الوظيفة غير نشطة. فعّلها أولاً حتى يعمل الرابط العام.',
                    )
                  : t(
                      'This article is still a draft. Publish it first so the public link works.',
                      'هذا المقال ما زال مسودة. انشره أولاً حتى يعمل الرابط العام.',
                    )}
              </p>
            )}

            {isLocal && (
              <p className="text-xs text-gray-500">
                {t(
                  'Facebook and LinkedIn image previews work after the page is live on the public domain.',
                  'معاينة الصورة على فيسبوك ولينكدإن تظهر بعد نشر الصفحة على الدومين العام.',
                )}
              </p>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-medium text-gray-500">
                  {t('Post text', 'نص المنشور')}
                </label>
                <Button type="button" variant="ghost" size="sm" className="h-8 px-2" onClick={handleCopy}>
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? t('Copied', 'تم النسخ') : t('Copy', 'نسخ')}
                </Button>
              </div>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={8}
                dir={isAr ? 'rtl' : 'ltr'}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    type="button"
                    disabled={busy !== null}
                    onClick={() => handlePlatform(platform.id)}
                    className={`justify-start rounded-xl ${platform.className}`}
                  >
                    <Icon />
                    {isAr ? platform.labelAr : platform.labelEn}
                  </Button>
                );
              })}
            </div>

            {canNativeShare && (
              <Button
                type="button"
                variant="outline"
                disabled={busy !== null}
                onClick={handleNativeShare}
                className="w-full rounded-xl"
              >
                <Smartphone className="size-4" />
                {t('Share via phone apps', 'مشاركة عبر تطبيقات الهاتف')}
              </Button>
            )}

            <p className="text-[11px] leading-relaxed text-gray-500">
              {t(
                'X, LinkedIn, and Facebook open a compose window with the content. Instagram cannot prefill a post from the browser, so the caption is copied and the image is downloaded for you to attach.',
                'X ولينكدإن وفيسبوك تفتح صفحة المنشور مع المحتوى. إنستغرام لا يسمح بتعبئة المنشور من المتصفح، لذلك يُنسخ النص وتُحمَّل الصورة لترفقها أنت.',
              )}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function NewsShareDialog({
  article,
  open,
  onOpenChange,
}: {
  article: NewsShareArticle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useAppStore();
  const origin = useMemo(() => getClientOrigin(), [open]);
  const item = useMemo<SocialShareItem | null>(() => {
    if (!article) return null;
    const copy = getLocalizedNewsCopy(article, locale);
    return {
      kind: 'news',
      title: copy.title,
      excerpt: copy.excerpt,
      url: getNewsArticleUrl(article.slug, origin),
      imageUrl: article.imageUrl ? toAbsoluteUrl(article.imageUrl, origin) : '',
      slug: article.slug,
      isLive: article.isPublished !== false,
      caption: buildNewsShareCaption(article, locale, origin),
    };
  }, [article, locale, origin]);

  return <SocialShareDialog item={item} open={open} onOpenChange={onOpenChange} />;
}

export function JobShareDialog({
  job,
  open,
  onOpenChange,
}: {
  job: JobShareInput | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { locale } = useAppStore();
  const origin = useMemo(() => getClientOrigin(), [open]);
  const item = useMemo<SocialShareItem | null>(() => {
    if (!job) return null;
    const copy = getLocalizedJobCopy(job, locale);
    return {
      kind: 'job',
      title: copy.title,
      excerpt: [copy.department, job.location, job.type].filter(Boolean).join(' · '),
      url: getJobUrl(job.slug, origin),
      imageUrl: getDefaultShareImage(origin),
      slug: job.slug,
      isLive: job.isActive !== false,
      caption: buildJobShareCaption(job, locale, origin),
    };
  }, [job, locale, origin]);

  return <SocialShareDialog item={item} open={open} onOpenChange={onOpenChange} />;
}
