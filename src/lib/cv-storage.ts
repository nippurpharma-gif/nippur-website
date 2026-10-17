import { mkdir, writeFile, readFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { put } from '@vercel/blob';

export type StoredCv = {
  fileName: string;
  /** Local absolute path, or remote Blob URL */
  filePath: string;
  storage: 'blob' | 'local';
};

function useBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

/**
 * Persist a CV. Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set
 * (required on Vercel — local disk is read-only). Falls back to ./uploads in local/dev.
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
    const blob = await put(`cvs/${fileName}`, bytes, {
      access: 'public',
      contentType,
      addRandomSuffix: false,
    });
    return { fileName, filePath: blob.url, storage: 'blob' };
  }

  if (process.env.VERCEL === '1') {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is required on Vercel to store CV uploads (local disk is not writable).',
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
    const res = await fetch(filePath, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch CV blob (${res.status})`);
    }
    return Buffer.from(await res.arrayBuffer());
  }

  const resolved = path.resolve(filePath);
  const uploadsRoot = path.resolve(process.cwd(), 'uploads');
  if (!resolved.startsWith(uploadsRoot + path.sep) && resolved !== uploadsRoot) {
    throw new Error('Invalid CV path');
  }
  return readFile(resolved);
}
