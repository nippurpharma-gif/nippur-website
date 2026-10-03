'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/store';

type SubscribeCode = 'subscribed' | 'already_subscribed' | 'invalid_email' | 'rate_limited' | 'server_error';

export function NewsletterForm() {
  const { t, locale } = useAppStore();
  const isAr = locale === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const messages = {
    subscribed: t.footer.subscribeSuccess,
    already: t.footer.alreadySubscribed,
    invalid: t.footer.subscribeInvalid,
    error: t.footer.subscribeError,
    rateLimited: isAr
      ? 'محاولات كثيرة. يرجى المحاولة لاحقاً.'
      : 'Too many attempts. Please try again later.',
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error(messages.invalid);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source: 'website' }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        code?: SubscribeCode;
        error?: string;
      };

      if (res.status === 429 || data.code === 'rate_limited') {
        toast.error(messages.rateLimited);
        return;
      }

      if (res.status === 400 || data.code === 'invalid_email') {
        toast.error(messages.invalid);
        return;
      }

      if (data.code === 'already_subscribed') {
        toast.message(messages.already);
        return;
      }

      if (res.ok && (data.code === 'subscribed' || res.status === 201)) {
        toast.success(messages.subscribed);
        setEmail('');
        return;
      }

      toast.error(messages.error);
    } catch {
      toast.error(messages.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="flex items-center gap-3 max-w-md" onSubmit={onSubmit}>
        <label className="flex-1 min-w-0">
          <span className="sr-only">{t.footer.emailPlaceholder}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.footer.emailPlaceholder}
            className="w-full bg-transparent border-0 border-b border-white/40 pb-2 text-sm text-white placeholder:text-white/45 outline-none focus:border-white transition-colors disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-brand-900 text-xs sm:text-sm font-medium transition-all duration-200 group shrink-0 disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{isAr ? 'جاري الإرسال…' : 'Subscribing…'}</span>
            </>
          ) : (
            <>
              <span>{t.footer.subscribe}</span>
              <ArrowUpRight className="size-4 text-brand-200 group-hover:text-brand-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 rtl:rotate-[-90deg]" />
            </>
          )}
        </button>
      </form>
      <p className="mt-4 text-xs text-white/45 max-w-sm leading-relaxed">
        {t.footer.newsletterDesc}
      </p>
    </div>
  );
}
