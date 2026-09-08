import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/ui";
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
    <>
      <Section eyebrow={date} title={event.title}>
        <Link
          href="/events"
          className="text-sm font-semibold text-brand hover:underline"
        >
          ← All events
        </Link>
        {event.description && (
          <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-ink-soft">
            {event.description}
          </p>
        )}
      </Section>

      {photos.length > 0 && (
        <Section eyebrow="Gallery" tone="alt">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <figure key={photo.id}>
                {/* Supabase Storage hosts these; switch to next/image once the
                    bucket domain is added to images.remotePatterns. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photo_url}
                  alt={photo.caption ?? ""}
                  className="w-full border border-line object-cover"
                  style={{ borderRadius: "var(--radius-sharp)" }}
                />
                {photo.caption && (
                  <figcaption className="mt-2 text-sm text-muted">
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
