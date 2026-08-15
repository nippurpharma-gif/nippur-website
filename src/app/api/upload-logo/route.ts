import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
/** SVG banned — same-origin SVG can execute scripts (stored XSS). */
const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp']);
const ALLOWED_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return 'image/png';
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return 'image/jpeg';
  }
  if (
    buf.length >= 12 &&
    buf.toString('ascii', 0, 4) === 'RIFF' &&
    buf.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
    }

    if (file.type && !ALLOWED_MIME.has(file.type)) {
      return NextResponse.json({ error: 'Invalid image type' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageMime(bytes);
    if (!sniffed || !ALLOWED_MIME.has(sniffed)) {
      return NextResponse.json({ error: 'File content is not a valid PNG/JPEG/WebP' }, { status: 400 });
    }

    const safeExt =
      sniffed === 'image/png' ? '.png' : sniffed === 'image/webp' ? '.webp' : '.jpg';

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const fileName = `logo-${Date.now()}${safeExt}`;
    await writeFile(path.join(uploadDir, fileName), bytes);

    return NextResponse.json({ logoUrl: `/uploads/${fileName}` });
  } catch (err) {
    console.error('Logo upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
