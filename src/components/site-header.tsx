"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/officers", label: "Members" },
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
    <header className="sticky top-0 z-60 bg-ink">
      <div className="container-page flex items-center gap-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/cyb-logo.png"
            alt="Cyb Robotics"
            width={38}
            height={38}
            priority
            className="block h-[38px] w-[38px] object-contain"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold leading-none tracking-[0.02em] text-canvas">
              CYB:ORG
            </span>
            <span className="label text-[9px] text-brand-mid">
              Cyb Robotics Organization
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden flex-wrap gap-0.5 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-[2px] px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-white/10 text-canvas"
                  : "text-canvas/70 hover:text-canvas"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/portal"
          className="ml-auto hidden rounded-[2px] border border-canvas/24 px-3.5 py-2.5 font-label text-[11px] uppercase tracking-[0.1em] text-canvas transition-colors hover:bg-white/10 md:ml-0 md:block"
        >
          Members
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation"
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-[2px] border border-canvas/24 text-canvas md:hidden"
        >
          <span aria-hidden>{open ? "✕" : "☰"}</span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-ink pb-3 md:hidden"
      >
        <div className="container-page">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`block border-b border-white/8 py-3 text-[13.5px] font-medium last:border-0 ${
                isActive(item.href) ? "text-canvas" : "text-canvas/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/portal"
            onClick={() => setOpen(false)}
            className="mt-3 inline-block rounded-[2px] border border-canvas/24 px-3.5 py-2.5 font-label text-[11px] uppercase tracking-[0.1em] text-canvas"
          >
            Members portal
          </Link>
        </div>
      </nav>
    </header>
  );
}
