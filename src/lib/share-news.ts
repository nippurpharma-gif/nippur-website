export type NewsShareArticle = {
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  imageUrl?: string;
  isPublished?: boolean;
};

export type SharePlatform = 'linkedin' | 'facebook' | 'instagram' | 'x';

export function getClientOrigin(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.replace(/\/$/, '');
  }
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export function toAbsoluteUrl(pathOrUrl: string, origin = getClientOrigin()): string {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

export function getNewsArticleUrl(slug: string, origin = getClientOrigin()): string {
  return `${origin}/news/${slug}`;
}

export function getJobUrl(slug: string, origin = getClientOrigin()): string {
  return `${origin}/careers/${slug}`;
}

export function getDefaultShareImage(origin = getClientOrigin()): string {
  return `${origin}/images/factory-building.png`;
}

export function canUseNativeShare() {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  const ua = navigator.userAgent || '';
  const isPhone = /Android|iPhone|iPad|iPod/i.test(ua);
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
  return isPhone || Boolean(coarsePointer);
}

export function getLocalizedNewsCopy(article: NewsShareArticle, locale: 'en' | 'ar') {
  const isAr = locale === 'ar';
  const title = isAr
    ? article.titleAr || article.titleEn
    : article.titleEn || article.titleAr;
  const excerpt = isAr
    ? article.excerptAr || article.excerptEn
    : article.excerptEn || article.excerptAr;
  return { title: title.trim(), excerpt: excerpt.trim() };
}

export function buildNewsShareCaption(
  article: NewsShareArticle,
  locale: 'en' | 'ar',
  origin = getClientOrigin(),
): string {
  const { title, excerpt } = getLocalizedNewsCopy(article, locale);
  const url = getNewsArticleUrl(article.slug, origin);
  const more = locale === 'ar' ? 'اقرأ المزيد:' : 'Read more:';
  return [title, excerpt, `${more}\n${url}`].filter(Boolean).join('\n\n');
}

export type JobShareInput = {
  slug: string;
  titleEn: string;
  titleAr: string;
  departmentEn: string;
  departmentAr: string;
  location: string;
  type: string;
  descriptionEn: string;
  descriptionAr: string;
  isActive?: boolean;
};

function firstParagraph(text: string, max = 280) {
  const paragraph = text.split(/\n\n+/)[0]?.replace(/\s+/g, ' ').trim() || '';
  if (paragraph.length <= max) return paragraph;
  return `${paragraph.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function getLocalizedJobCopy(job: JobShareInput, locale: 'en' | 'ar') {
  const isAr = locale === 'ar';
  const title = (isAr ? job.titleAr || job.titleEn : job.titleEn || job.titleAr).trim();
  const department = (isAr
    ? job.departmentAr || job.departmentEn
    : job.departmentEn || job.departmentAr
  ).trim();
  const description = firstParagraph(
    isAr ? job.descriptionAr || job.descriptionEn : job.descriptionEn || job.descriptionAr,
  );
  return { title, department, description };
}

export function buildJobShareCaption(
  job: JobShareInput,
  locale: 'en' | 'ar',
  origin = getClientOrigin(),
): string {
  const { title, department, description } = getLocalizedJobCopy(job, locale);
  const url = getJobUrl(job.slug, origin);
  const heading =
    locale === 'ar' ? `فرصة عمل في نيبور فارما: ${title}` : `We're hiring at NIPPUR Pharma: ${title}`;
  const meta = [department, job.location, job.type].filter(Boolean).join(' · ');
  const apply = locale === 'ar' ? 'قدّم الآن:' : 'Apply now:';
  return [heading, meta, description, `${apply}\n${url}`].filter(Boolean).join('\n\n');
}

export function clipForX(text: string, limit = 280): string {
  const normalized = text.trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, Math.max(0, limit - 1))}…`;
}

export function getShareComposerUrl(
  platform: Exclude<SharePlatform, 'instagram'>,
  caption: string,
  articleUrl: string,
): string {
  if (platform === 'x') {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(clipForX(caption))}`;
  }
  if (platform === 'facebook') {
    const params = new URLSearchParams({ u: articleUrl, quote: caption });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  }
  return `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(caption)}`;
}

export function openShareWindow(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer,width=720,height=780');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export async function downloadImageFromUrl(url: string, filename: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('image fetch failed');
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
    return false;
  }
}

export async function shareNative(payload: {
  title: string;
  text: string;
  url: string;
  imageUrl?: string;
}): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }

  const data: ShareData = {
    title: payload.title,
    text: payload.text,
    url: payload.url,
  };

  if (payload.imageUrl) {
    try {
      const res = await fetch(payload.imageUrl);
      if (res.ok) {
        const blob = await res.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `news.${ext}`, { type: blob.type || 'image/jpeg' });
        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          data.files = [file];
        }
      }
    } catch {
      // Image attach is optional; still share text + URL.
    }
  }

  await navigator.share(data);
  return true;
}
