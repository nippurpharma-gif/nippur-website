/**
 * Sliding-window rate limiter.
 * Uses Upstash Redis when UPSTASH_REDIS_REST_URL + TOKEN are set (multi-instance).
 * Falls back to in-memory for local / single-instance deploys.
 */

type Result = { ok: true } | { ok: false; retryAfterSec: number };

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

function memoryLimit(key: string, opts: { limit: number; windowMs: number }): Result {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < opts.windowMs);

  if (bucket.timestamps.length >= opts.limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterSec = Math.max(1, Math.ceil((opts.windowMs - (now - oldest)) / 1000));
    buckets.set(key, bucket);
    return { ok: false, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true };
}

async function redisLimit(key: string, opts: { limit: number; windowMs: number }): Promise<Result | null> {
  const base = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!base || !token) return null;

  const now = Date.now();
  const member = `${now}:${Math.random().toString(36).slice(2)}`;
  const pipeline = [
    ['ZREMRANGEBYSCORE', key, '0', String(now - opts.windowMs)],
    ['ZADD', key, String(now), member],
    ['ZCARD', key],
    ['PEXPIRE', key, String(opts.windowMs)],
  ];

  try {
    const res = await fetch(`${base}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Array<{ result?: number }>;
    const count = Number(json[2]?.result ?? 0);
    if (count > opts.limit) {
      await fetch(`${base}/zrem/${encodeURIComponent(key)}/${encodeURIComponent(member)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }).catch(() => undefined);
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil(opts.windowMs / 1000)) };
    }
    return { ok: true };
  } catch {
    return null;
  }
}

export async function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number },
): Promise<Result> {
  const redis = await redisLimit(`rl:${key}`, opts);
  if (redis) return redis;
  return memoryLimit(key, opts);
}

export function clientIp(request: Request): string {
  const cf = request.headers.get('cf-connecting-ip');
  if (cf) return cf.trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return 'unknown';
}
