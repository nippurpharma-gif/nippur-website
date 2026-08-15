import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { requireAdmin } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { parseListQuery } from '@/lib/pagination';

const MAX_CV_SIZE = 5 * 1024 * 1024;
const ALLOWED_CV_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_CV_EXT = new Set(['.pdf', '.doc', '.docx']);

function sniffCvMime(buf: Buffer, ext: string): string | null {
  if (buf.length >= 5 && buf.subarray(0, 5).toString('ascii') === '%PDF-') {
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
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { take, skip } = parseListQuery(request);
    const applications = await db.application.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });
    return NextResponse.json(applications);
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
    let cvFileName = '';
    let cvFilePath = '';

    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > MAX_CV_SIZE) {
        return NextResponse.json({ error: 'CV too large (max 5MB)' }, { status: 400 });
      }

      const ext = path.extname(cvFile.name).toLowerCase();
      if (!ALLOWED_CV_EXT.has(ext)) {
        return NextResponse.json({ error: 'CV must be PDF or Word document' }, { status: 400 });
      }

      if (cvFile.type && !ALLOWED_CV_MIME.has(cvFile.type)) {
        return NextResponse.json({ error: 'CV must be PDF or Word document' }, { status: 400 });
      }

      const bytes = Buffer.from(await cvFile.arrayBuffer());
      const sniffed = sniffCvMime(bytes, ext);
      if (!sniffed || !ALLOWED_CV_MIME.has(sniffed)) {
        return NextResponse.json({ error: 'CV file content is invalid' }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const safeBase = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
      cvFileName = `${Date.now()}-${safeBase.endsWith(ext) ? safeBase : `${safeBase}${ext}`}`;
      cvFilePath = path.join(uploadDir, cvFileName);
      await writeFile(cvFilePath, bytes);
    }

    const { fullName, email, phone, position, department, coverLetter } = parsed.data;

    const application = await db.application.create({
      data: {
        fullName,
        email,
        phone: phone || '',
        position,
        department: department || '',
        cvFileName,
        cvFilePath,
        coverLetter: coverLetter || '',
      },
    });

    return NextResponse.json({ id: application.id, success: true }, { status: 201 });
  } catch (err) {
    console.error('Application error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAdmin();
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
