import Image from "next/image";
import Link from "next/link";

import { assertPortalSlug } from "@/lib/portal";

/**
 * Every portal route is noindex. The slug keeps the page unlisted, but a
 * member pasting the link somewhere crawlable would otherwise be enough
 * to get it into a search index.
 */
export const metadata = {
  title: "Members Portal",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PortalLayout(
  props: LayoutProps<"/members-portal/[slug]">,
) {
  const { slug } = await props.params;
  assertPortalSlug(slug);

  return (
    <div className="flex flex-1 flex-col bg-canvas">
      <header className="sticky top-0 z-40 bg-brand-deep">
        <div className="mx-auto flex w-full max-w-[1080px] items-center gap-3.5 px-7 py-4">
          <Image
            src="/cyb-logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <p className="text-sm font-semibold tracking-[-0.005em] text-canvas">
            Cyb Robotics{" "}
            <span className="font-medium text-brand-soft">/ Members Portal</span>
          </p>
          <Link
            href="/"
            className="ml-auto rounded-[2px] border border-canvas/24 px-3.25 py-2 font-label text-[10.5px] uppercase tracking-[0.1em] text-canvas hover:bg-white/10"
          >
            Exit portal
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1080px] px-7 py-9 pb-20">
        {props.children}
      </div>
    </div>
  );
}
