import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/ui";
import { getEvent } from "@/lib/queries";

export async function generateMetadata(props: PageProps<"/events/[id]">) {
  const { id } = await props.params;
  const result = await getEvent(id);
  if (!result) return { title: "Event not found" };
  return {
    title: result.event.title,
    description: result.event.description ?? undefined,
  };
}

export default async function EventPage(props: PageProps<"/events/[id]">) {
  const { id } = await props.params;
  const result = await getEvent(id);

  if (!result) notFound();
  const { event, photos } = result;

  const date = new Date(event.event_date).toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <Link
        href="/events"
        className="font-label text-[10.5px] uppercase tracking-[0.1em] text-brand"
      >
        ← All events
      </Link>
      <div className="mt-5">
        <PageHeader eyebrow={date} title={event.title} />
      </div>

      {event.description && (
        <p className="mt-6 max-w-[70ch] whitespace-pre-line text-base leading-[1.68] text-ink-body">
          {event.description}
        </p>
      )}

      {photos.length > 0 && (
        <>
          <h2 className="mt-13 border-b border-ink/14 pb-3.5 font-label text-xs uppercase tracking-[0.14em] text-brand">
            Gallery
          </h2>
          <div className="mt-6 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {photos.map((photo) => (
              <figure key={photo.id}>
                {/* Supabase Storage hosts these; switch to next/image once the
                    bucket domain is added to images.remotePatterns. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  className="w-full border border-ink/12 object-cover"
                />
                {photo.caption && (
                  <figcaption className="mt-2 text-[13px] text-muted">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
