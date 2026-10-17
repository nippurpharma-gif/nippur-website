import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { readCvFile } from '@/lib/cv-storage';

const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx']);

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { error } = await requireRole(['admin']);
  if (error) return error;

  try {
    const { filename } = await params;
    const safeName = path.basename(filename);

    if (
      safeName !== filename ||
      filename.includes('..') ||
      filename.includes('/') ||
      filename.includes('\\')
    ) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const ext = path.extname(safeName).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const application = await db.application.findFirst({
      where: { cvFileName: safeName },
      select: { cvFilePath: true, cvFileName: true },
    });

    if (!application?.cvFilePath) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await readCvFile(application.cvFilePath);

    const contentTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentTypes[ext] || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${safeName.replace(/"/g, '')}"`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('CV download error:', err);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
