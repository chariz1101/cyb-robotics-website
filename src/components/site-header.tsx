"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/officers", label: "Officers" },
  { href: "/alumni", label: "Alumni" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-base font-bold tracking-tight text-brand">
          CYB Robotics
        </Link>

        <nav className="hidden gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`font-display text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                isActive(item.href)
                  ? "text-brand"
                  : "text-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          className="flex h-9 w-9 items-center justify-center border border-line text-ink md:hidden"
          style={{ borderRadius: "var(--radius-sharp)" }}
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line bg-canvas px-6 pb-4 md:hidden"
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`block border-b border-line-soft py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] last:border-0 ${
              isActive(item.href) ? "text-brand" : "text-muted"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
