import Link from "next/link";

/**
 * /portal with no slug.
 *
 * The public header and footer link here rather than to the real portal
 * URL: putting the secret slug in the public site's HTML would defeat the
 * point of an unlisted page.
 */
export const metadata = {
  title: "Members Portal",
  robots: { index: false, follow: false },
};

export default function PortalLockedPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-20">
      <div className="max-w-[440px] text-center">
        <p className="label text-brand">Members Portal</p>
        <h1 className="mt-3.5 text-[32px] font-bold">This page is unlisted.</h1>
        <p className="mt-5 text-[15px] leading-[1.7] text-ink-soft">
          The members portal is reachable only through its full link, which is
          shared with current members through official Cyb Robotics channels.
          If you are a member and do not have it, ask any officer.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-[2px] border border-brand px-5 py-3 font-label text-[10.5px] uppercase tracking-[0.1em] text-brand hover:bg-brand hover:text-canvas"
        >
          Back to website
        </Link>
      </div>
    </div>
  );
}
