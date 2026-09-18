"use client";

import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Catches a failed render anywhere in the app.
 *
 * Queries throw when Supabase is unreachable — a free-tier pause, a
 * network blip, a bad deploy — and without this the visitor gets Next's
 * unstyled crash screen. It renders outside the (public) route group, so
 * the shell is added here to leave a way back.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <SiteHeader />
      <div
        data-page-error="true"
        className="flex flex-1 items-center justify-center px-6 py-24"
      >
        <div className="max-w-[460px] text-center">
          <p className="label text-brand">Something went wrong</p>
          <h1 className="mt-3.5 text-[32px] sm:text-[38px]">
            This page could not be loaded.
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
            The site could not reach its database. This is usually temporary —
            try again in a moment. If it keeps happening, let an officer know.
          </p>
          {error.digest && (
            <p className="mt-4 font-label text-[10.5px] tracking-[0.08em] text-faint">
              Reference: {error.digest}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-[2px] bg-brand-deep px-5 py-3 font-label text-[10.5px] uppercase tracking-[0.1em] text-canvas"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-[2px] border border-brand px-5 py-3 font-label text-[10.5px] uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-canvas"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
