import Link from "next/link";
import type { ReactNode } from "react";

import { Card, Placeholder, initialsOf } from "@/components/ui";
import type { EventRecord, Project } from "@/lib/database.types";

/**
 * Content cards shared across the public pages.
 *
 * These live here rather than inline so a layout fix lands everywhere at
 * once — the project card in particular appears on both the home page and
 * the projects index.
 */

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Section heading with the eyebrow-and-rule treatment. */
export function SectionHeading({
  children,
  aside,
  className = "",
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-b border-ink/14 pb-4.5 ${className}`}
    >
      <h2 className="text-[26px] font-bold sm:text-[30px]">{children}</h2>
      {aside}
    </div>
  );
}

export function Button({
  href,
  children,
  tone = "solid",
}: {
  href: string;
  children: ReactNode;
  tone?: "solid" | "outline" | "onDark";
}) {
  const tones = {
    solid: "bg-brand-deep text-canvas hover:opacity-90",
    outline: "border border-brand text-brand hover:bg-brand hover:text-canvas",
    onDark: "border border-canvas/34 text-canvas hover:bg-white/10",
  } as const;

  return (
    <Link
      href={href}
      className={`inline-block rounded-[2px] px-5 py-3.5 text-[14.5px] font-semibold transition-colors sm:px-6.5 sm:py-4 ${tones[tone]}`}
    >
      {children}
    </Link>
  );
}

/** Portrait card for officers and the adviser. */
export function PersonCard({
  name,
  position,
  detail,
  photoUrl,
}: {
  name: string;
  position?: string | null;
  detail?: string | null;
  photoUrl?: string | null;
}) {
  return (
    <Card>
      {photoUrl ? (
        // Supabase Storage hosts these; switch to next/image once the bucket
        // domain is added to images.remotePatterns in next.config.ts.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="h-[190px] w-full object-cover" />
      ) : (
        <div className="hatch-deep flex h-[190px] items-center justify-center">
          <span className="text-[38px] font-bold tracking-[0.02em] text-brand-soft">
            {initialsOf(name)}
          </span>
        </div>
      )}
      <div className="px-4.5 pb-5 pt-4.5">
        <p className="text-[16.5px] font-semibold tracking-[-0.01em]">{name}</p>
        {position && (
          <p className="mt-1.5 font-label text-[11px] uppercase tracking-[0.1em] text-brand">
            {position}
          </p>
        )}
        {detail && <p className="mt-2 text-[13px] text-muted">{detail}</p>}
      </div>
    </Card>
  );
}

export function ProjectCard({
  project,
  coverHeight = 180,
}: {
  project: Project;
  coverHeight?: number;
}) {
  return (
    <Link href={`/projects/${project.id}`} className="block text-ink">
      <Card interactive className="flex h-full flex-col">
        {project.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.cover_image_url}
            alt=""
            style={{ height: coverHeight }}
            className="w-full object-cover"
          />
        ) : (
          <Placeholder
            label="project cover"
            className="w-full"
            style={{ height: coverHeight }}
          />
        )}
        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <div className="flex items-center justify-between gap-2.5">
            {project.category && (
              <span className="label-sm text-brand">{project.category}</span>
            )}
            {project.difficulty_level && (
              <span className="font-label text-[10px] text-muted">
                {project.difficulty_level}
              </span>
            )}
          </div>
          <h3 className="text-[17px] font-semibold sm:text-[18.5px]">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-sm leading-[1.55] text-ink-soft">
              {project.description}
            </p>
          )}
          <span className="mt-auto pt-3 font-label text-[10.5px] uppercase tracking-[0.1em] text-brand">
            Read more →
          </span>
        </div>
      </Card>
    </Link>
  );
}

/** Wide event row: cover image beside the details on anything but phones. */
export function EventCard({ event }: { event: EventRecord }) {
  return (
    <Link href={`/events/${event.id}`} className="block text-ink">
      <Card
        interactive
        className="grid sm:[grid-template-columns:minmax(0,220px)_minmax(0,1fr)]"
      >
        {event.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_photo_url}
            alt=""
            className="h-[160px] w-full object-cover sm:h-full sm:min-h-[150px]"
          />
        ) : (
          <Placeholder
            label="cover photo"
            className="h-[120px] w-full sm:h-auto sm:min-h-[150px]"
          />
        )}
        <div className="flex flex-col gap-2.5 p-5 sm:p-6">
          <p className="font-label text-[11px] uppercase tracking-[0.1em] text-brand">
            {formatDate(event.event_date)}
          </p>
          <h3 className="text-[19px] font-semibold sm:text-[21px]">
            {event.title}
          </h3>
          {event.description && (
            <p className="max-w-[70ch] text-[14.5px] leading-[1.6] text-ink-soft">
              {event.description}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
