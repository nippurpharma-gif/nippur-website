export function PageLoading({ label = 'Loading' }: { label?: string }) {
  return (
    <div
      className="site-container py-16 lg:py-24 animate-pulse"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="h-3 w-24 rounded bg-brand-100 mb-5" />
      <div className="h-10 max-w-xl rounded-lg bg-brand-100/80 mb-4" />
      <div className="h-4 max-w-lg rounded bg-brand-50 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[rgba(10,37,68,0.06)] bg-white p-6 space-y-4"
          >
            <div className="h-3 w-20 rounded bg-brand-50" />
            <div className="h-5 w-[80%] rounded bg-brand-100/70" />
            <div className="h-3 w-full rounded bg-brand-50" />
            <div className="h-3 w-3/4 rounded bg-brand-50" />
            <div className="h-px w-full bg-[rgba(10,37,68,0.06)] mt-2" />
            <div className="h-3 w-24 rounded bg-brand-50" />
          </div>
        ))}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}
