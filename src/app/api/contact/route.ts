import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  subject: z.string().trim().min(2).max(200),
  inquiry: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  const limited = await rateLimit(`contact:${clientIp(request)}`, {
    limit: 12,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Persist / email in production — avoid logging PII in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('Contact form submission:', {
        email: result.data.email,
        subject: result.data.subject,
      });
    }

    return NextResponse.json(
      { success: true, message: 'Message received successfully' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
