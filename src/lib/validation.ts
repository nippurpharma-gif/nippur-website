import { z } from 'zod';

/** Allow site-relative media paths or http(s) URLs — blocks javascript: and data: */
export const mediaUrlSchema = z
  .string()
  .max(500)
  .refine((value) => {
    if (!value) return true;
    if (value.startsWith('/uploads/') || value.startsWith('/images/')) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'Invalid media URL');
