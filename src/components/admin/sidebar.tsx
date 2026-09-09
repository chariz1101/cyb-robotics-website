"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

import { signOut } from "@/lib/actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/members", label: "Members" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/files", label: "Files" },
  { href: "/admin/alumni", label: "Alumni" },
];

export function AdminSidebar({
  email,
  fullName,
}: {
  email: string;
  fullName: string | null;
}) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <aside className="flex flex-col bg-ink py-5.5 md:min-h-screen">
      <div className="flex items-center gap-2.5 border-b border-canvas/12 px-5.5 pb-5.5">
        <Image
          src="/cyb-logo.png"
          alt=""
          width={30}
          height={30}
          className="h-7.5 w-7.5 object-contain"
        />
        <p className="font-label text-[10px] uppercase leading-[1.4] tracking-[0.14em] text-canvas">
          Cyb Robotics
          <br />
          <span className="text-brand-mid">Admin</span>
        </p>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 md:px-3 md:py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`rounded-[2px] px-3.5 py-2.75 text-sm font-medium ${
                active
                  ? "bg-brand text-canvas"
                  : "text-canvas/70 hover:bg-white/8 hover:text-canvas"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pt-6">
        <p className="mb-2.5 truncate px-1 font-label text-[10px] tracking-[0.06em] text-canvas/42">
          {fullName ?? email}
        </p>
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => void signOut())}
          className="w-full rounded-[2px] border border-canvas/20 py-2.75 font-label text-[10.5px] uppercase tracking-[0.1em] text-canvas/70 hover:text-canvas disabled:opacity-50"
        >
          {pending ? "Signing out…" : "Log out"}
        </button>
      </div>
    </aside>
  );
}
