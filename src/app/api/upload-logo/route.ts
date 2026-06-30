import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File | null;

    if (!file || !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 2MB)' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || '.png';
    const fileName = `logo-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json({ logoUrl: `/uploads/${fileName}` });
  } catch (error) {
    console.error('Logo upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}