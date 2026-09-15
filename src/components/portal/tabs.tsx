"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PortalTabs({ base }: { base: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: base, label: "Directory" },
    { href: `${base}/guides`, label: "Project guides" },
  ];

  return (
    <div className="flex border-b border-ink/14">
      {tabs.map((tab) => {
        const active =
          tab.href === base ? pathname === base : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-3 font-label text-xs uppercase tracking-[0.12em] sm:px-5 ${
              active
                ? "border-brand text-brand"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
