import Link from "next/link";

import { requireAdmin, firstNameOf } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function counts() {
  const supabase = await createClient();
  const head = { count: "exact" as const, head: true };

  const [members, events, announcements, files] = await Promise.all([
    supabase.from("members").select("*", head).eq("is_alumnus", false),
    supabase.from("events").select("*", head),
    supabase.from("announcements").select("*", head).eq("is_published", true),
    supabase.from("files").select("*", head),
  ]);

  return [
    { label: "Members", value: members.count ?? 0, href: "/admin/members" },
    { label: "Events", value: events.count ?? 0, href: "/admin/events" },
    {
      label: "Published announcements",
      value: announcements.count ?? 0,
      href: "/admin/announcements",
    },
    { label: "Files", value: files.count ?? 0, href: "/admin/files" },
  ];
}

async function recentActivity() {
  const supabase = await createClient();

  const [{ data: events }, { data: announcements }] = await Promise.all([
    supabase
      .from("events")
      .select("title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(4),
    supabase
      .from("announcements")
      .select("title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  return [
    ...(events ?? []).map((e) => ({
      when: e.updated_at,
      what: `Event · ${e.title}`,
    })),
    ...(announcements ?? []).map((a) => ({
      when: a.updated_at,
      what: `Announcement · ${a.title}`,
    })),
  ]
    .sort((a, b) => (a.when < b.when ? 1 : -1))
    .slice(0, 5);
}

export default async function AdminDashboard() {
  const admin = await requireAdmin();
  const [stats, activity] = await Promise.all([counts(), recentActivity()]);

  return (
    <div>
      <p className="label tracking-[0.16em] text-muted">Dashboard</p>
      <h1 className="mt-2.5 text-[32px] font-bold">
        Welcome back, {firstNameOf(admin.full_name, admin.email)}
      </h1>

      <div className="mt-7 grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-ink/12 bg-surface p-5 transition-colors hover:border-brand"
          >
            <p className="text-[32px] font-bold tracking-[-0.03em] text-brand-deep">
              {stat.value}
            </p>
            <p className="label-sm mt-2 tracking-[0.12em] text-muted">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 border border-ink/12 bg-surface">
        <p className="border-b border-ink/10 px-5 py-4 font-label text-[10.5px] uppercase tracking-[0.14em] text-brand">
          Recent activity
        </p>
        {activity.length === 0 ? (
          <p className="px-5 py-11 text-center font-label text-xs tracking-[0.06em] text-faint">
            Nothing has been edited yet.
          </p>
        ) : (
          activity.map((item, i) => (
            <div
              key={`${item.what}-${i}`}
              className="flex flex-wrap items-baseline gap-4 border-b border-ink/6 px-5 py-3.5 last:border-0"
            >
              <span className="min-w-[120px] font-label text-[11px] text-faint">
                {new Date(item.when).toLocaleDateString("en-PH", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-sm text-ink-body">{item.what}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
