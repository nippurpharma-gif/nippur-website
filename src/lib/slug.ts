/** URL-safe slug from English title (or fallback). */
export function slugify(input: string, fallback = 'news'): string {
  const base = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return base || fallback;
}

export function uniqueSlugCandidate(base: string, existing: Set<string>, exclude?: string): string {
  let candidate = base;
  let n = 2;
  while (existing.has(candidate) && candidate !== exclude) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}
