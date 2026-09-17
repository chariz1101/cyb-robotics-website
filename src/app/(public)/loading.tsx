/**
 * Shown while a page's Supabase queries run.
 *
 * Without this the browser sits on the previous page until the data
 * arrives, which on a cold serverless function reads as a dead link. The
 * skeleton mirrors the usual page shape — eyebrow, title, a grid of
 * cards — so the layout does not jump when the real content lands.
 */
export default function Loading() {
  return (
    <div className="container-page w-full py-16 pb-[90px]" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="h-3 w-28 animate-pulse bg-line" />
      <div className="mt-5 h-10 w-full max-w-[420px] animate-pulse bg-line" />
      <div className="mt-12 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="border border-ink/12 bg-surface">
            <div className="h-[170px] animate-pulse bg-line" />
            <div className="space-y-3 p-5">
              <div className="h-2.5 w-20 animate-pulse bg-line" />
              <div className="h-4 w-3/4 animate-pulse bg-line" />
              <div className="h-3 w-full animate-pulse bg-line" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
