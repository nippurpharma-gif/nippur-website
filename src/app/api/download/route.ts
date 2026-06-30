import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), '..', 'nippur-pharma-project.zip');
    const fileStat = await stat(filePath);
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="nippur-pharma-project.zip"',
        'Content-Length': fileStat.size.toString(),
        'Cache-Control': 'no-cache',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}