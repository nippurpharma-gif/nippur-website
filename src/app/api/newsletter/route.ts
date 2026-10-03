import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { addBrevoContact } from '@/lib/brevo';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().trim().email().max(200),
  source: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  const limited = await rateLimit(`newsletter:${clientIp(request)}`, {
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many subscription attempts. Please try again later.', code: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid email address', code: 'invalid_email' },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();
    const source = parsed.data.source?.trim() || 'website';

    const existing = await db.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      // Keep Brevo in sync for returning subscribers (best-effort).
      void addBrevoContact(email, { source: existing.source || source });
      return NextResponse.json(
        {
          success: true,
          code: 'already_subscribed',
          message: 'Already subscribed',
        },
        { status: 200 },
      );
    }

    await db.newsletterSubscriber.create({
      data: { email, source },
    });

    const brevo = await addBrevoContact(email, { source });
    if (!brevo.ok && !brevo.skipped) {
      console.error('[newsletter] Brevo sync failed after DB save', {
        email,
        status: brevo.status,
        error: brevo.error,
      });
    }

    return NextResponse.json(
      {
        success: true,
        code: 'subscribed',
        message: 'Subscribed successfully',
        brevoSynced: brevo.ok,
      },
      { status: 201 },
    );
  } catch (err) {
    // Unique race: two concurrent first-time submits
    if (
      err &&
      typeof err === 'object' &&
      'code' in err &&
      (err as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        {
          success: true,
          code: 'already_subscribed',
          message: 'Already subscribed',
        },
        { status: 200 },
      );
    }

    console.error('[newsletter] subscribe failed', err);
    return NextResponse.json(
      { error: 'Failed to subscribe', code: 'server_error' },
      { status: 500 },
    );
  }
}
