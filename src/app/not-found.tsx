import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Styled 404.
 *
 * Rendered outside the (public) route group, so the header and footer are
 * added here — otherwise a visitor who mistypes a URL lands on a page with
 * no navigation at all.
 *
 * This is also what a wrong members-portal slug gets, so it must not hint
 * that a correct slug exists — it reads as an ordinary missing page.
 */
export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="max-w-[440px] text-center">
          <p className="label text-brand">404</p>
          <h1 className="mt-3.5 text-[32px] sm:text-[38px]">
            This page does not exist.
          </h1>
          <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
            The link may be out of date, or the page may have been removed.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-[2px] border border-brand px-5 py-3 font-label text-[10.5px] uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-canvas"
          >
            Back to home
          </Link>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
