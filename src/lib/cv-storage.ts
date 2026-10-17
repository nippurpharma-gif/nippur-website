import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { get, put } from '@vercel/blob';

export type StoredCv = {
  fileName: string;
  /** Local absolute path, or remote Blob URL */
  filePath: string;
  storage: 'blob' | 'local';
};

function useBlobStorage(): boolean {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
      (process.env.VERCEL === '1' && process.env.BLOB_STORE_ID?.trim()),
  );
}

/**
 * Persist a CV.
 * - On Vercel / when Blob credentials exist: Vercel Blob (private store).
 * - Locally without Blob: ./uploads
 */
export async function storeCvFile(
  bytes: Buffer,
  originalName: string,
  contentType: string,
): Promise<StoredCv> {
  const ext = path.extname(originalName).toLowerCase() || '.pdf';
  const safeBase = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 80);
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}-${
    safeBase.endsWith(ext) ? safeBase : `${safeBase}${ext}`
  }`;

  if (useBlobStorage()) {
    const body = new Blob([bytes], { type: contentType });
    const blob = await put(`cvs/${fileName}`, body, {
      // Store is private — public access throws and becomes HTTP 500.
      access: 'private',
      contentType,
      addRandomSuffix: false,
    });
    return { fileName, filePath: blob.url, storage: 'blob' };
  }

  if (process.env.VERCEL === '1') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN (or connected Blob store) is required on Vercel to store CV uploads.',
    );
  }

  const uploadDir = path.join(process.cwd(), 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, bytes);
  return { fileName, filePath, storage: 'local' };
}

export async function readCvFile(filePath: string): Promise<Buffer> {
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    const result = await get(filePath, { access: 'private' });
    if (!result) {
      throw new Error('CV blob not found');
    }
    const ab = await new Response(result.stream).arrayBuffer();
    return Buffer.from(ab);
  }

  const resolved = path.resolve(filePath);
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  if (!resolved.startsWith(uploadsRoot + path.sep) && resolved !== uploadsRoot) {
    throw new Error('Invalid CV path');
  }
  return readFile(resolved);
}
