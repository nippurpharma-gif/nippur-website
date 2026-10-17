import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import path from 'path';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { parseListQuery } from '@/lib/pagination';
import { storeCvFile } from '@/lib/cv-storage';

const MAX_CV_SIZE = 5 * 1024 * 1024;
const ALLOWED_CV_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_CV_EXT = new Set(['.pdf', '.doc', '.docx']);
/** Browsers often send this for PDFs — do not reject before magic-byte sniff. */
const PASSTHROUGH_MIME = new Set(['', 'application/octet-stream', 'binary/octet-stream']);

function sniffCvMime(buf: Buffer, ext: string): string | null {
  const head = buf.subarray(0, Math.min(1024, buf.length)).toString('latin1');
  if (head.includes('%PDF-')) {
    return 'application/pdf';
  }
  // OLE Compound File (legacy .doc)
  if (
    buf.length >= 8 &&
    buf[0] === 0xd0 &&
    buf[1] === 0xcf &&
    buf[2] === 0x11 &&
    buf[3] === 0xe0
  ) {
    return 'application/msword';
  }
  // ZIP-based Office Open XML (.docx)
  if (buf.length >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && (ext === '.docx' || ext === '.doc')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return null;
}

const applicationSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  position: z.string().trim().min(1).max(120),
  department: z.string().trim().max(120).optional().or(z.literal('')),
  coverLetter: z.string().trim().max(5000).optional().or(z.literal('')),
});

const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.enum(['pending', 'reviewed', 'accepted', 'rejected']).optional(),
});

export async function GET(request: NextRequest) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const { take, skip } = parseListQuery(request);
    const applications = await db.application.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
    // Never expose absolute server filesystem paths / storage URLs to clients.
    const safe = applications.map(({ cvFilePath: _path, ...rest }) => rest);
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = await rateLimit(`applications:${clientIp(request)}`, {
    limit: 8,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.ok) {
    return NextResponse.json(
      { error: 'Too many applications. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfterSec) } },
    );
  }

  try {
    const formData = await request.formData();

    const parsed = applicationSchema.safeParse({
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone') ?? '',
      position: formData.get('position'),
      department: formData.get('department') ?? '',
      coverLetter: formData.get('coverLetter') ?? '',
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid application data', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const cvFile = formData.get('cv') as File | null;

    if (!cvFile || cvFile.size <= 0) {
      return NextResponse.json({ error: 'CV is required' }, { status: 400 });
    }

    if (cvFile.size > MAX_CV_SIZE) {
      return NextResponse.json({ error: 'CV too large (max 5MB)' }, { status: 400 });
    }

    const ext = path.extname(cvFile.name).toLowerCase();
    if (!ALLOWED_CV_EXT.has(ext)) {
      return NextResponse.json({ error: 'CV must be PDF or Word document' }, { status: 400 });
    }

    const declaredType = (cvFile.type || '').toLowerCase();
    if (
      declaredType &&
      !PASSTHROUGH_MIME.has(declaredType) &&
      !ALLOWED_CV_MIME.has(declaredType)
    ) {
      return NextResponse.json({ error: 'CV must be PDF or Word document' }, { status: 400 });
    }

    const bytes = Buffer.from(await cvFile.arrayBuffer());
    const sniffed = sniffCvMime(bytes, ext);
    if (!sniffed || !ALLOWED_CV_MIME.has(sniffed)) {
      return NextResponse.json({ error: 'CV file content is invalid' }, { status: 400 });
    }

    const stored = await storeCvFile(bytes, cvFile.name, sniffed);

    const { fullName, email, phone, position, department, coverLetter } = parsed.data;

    const application = await db.application.create({
      data: {
        fullName,
        email,
        phone: phone || '',
        position,
        department: department || '',
        cvFileName: stored.fileName,
        cvFilePath: stored.filePath,
        coverLetter: coverLetter || '',
      },
    });

    return NextResponse.json({ id: application.id, success: true }, { status: 201 });
  } catch (err) {
    console.error('Application error:', err);
    const message = err instanceof Error ? err.message : 'Failed to submit application';
    const isConfig =
      message.includes('BLOB_READ_WRITE_TOKEN') ||
      message.includes('Blob store') ||
      message.includes('private store') ||
      message.includes('public access');
    return NextResponse.json(
      {
        error: isConfig
          ? message
          : process.env.NODE_ENV === 'production'
            ? 'Failed to submit application'
            : message,
      },
      { status: isConfig ? 503 : 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid update data' }, { status: 400 });
    }

    const { id, status } = parsed.data;
    const application = await db.application.update({
      where: { id: Number(id) },
      data: status ? { status } : {},
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
