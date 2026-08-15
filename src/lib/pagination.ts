export function parseListQuery(
  request: Request,
  defaults: { take: number; max: number } = { take: 200, max: 500 },
): { take: number; skip: number } {
  const url = new URL(request.url);
  const takeRaw = Number(url.searchParams.get('take'));
  const skipRaw = Number(url.searchParams.get('skip'));
  const take =
    Number.isFinite(takeRaw) && takeRaw > 0
      ? Math.min(defaults.max, Math.floor(takeRaw))
      : defaults.take;
  const skip =
    Number.isFinite(skipRaw) && skipRaw > 0 ? Math.min(10_000, Math.floor(skipRaw)) : 0;
  return { take, skip };
}
