import Link from "next/link";

import { PageHeader, Card, Placeholder, EmptyState } from "@/components/ui";
import { getEvents } from "@/lib/queries";
import type { EventRecord } from "@/lib/database.types";

export const metadata = {
  title: "Events",
  description: "Upcoming and past activities of Cyb Robotics Organization.",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EventRow({ event }: { event: EventRecord }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card
        interactive
        className="grid [grid-template-columns:minmax(0,1fr)] sm:[grid-template-columns:minmax(0,220px)_minmax(0,1fr)]"
      >
        {event.cover_photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.cover_photo_url}
            alt=""
            className="h-full min-h-[150px] w-full object-cover"
          />
        ) : (
          <Placeholder label="cover photo" className="min-h-[150px]" />
        )}
        <div className="flex flex-col gap-2.5 p-6">
          <p className="font-label text-[11px] uppercase tracking-[0.1em] text-brand">
            {formatDate(event.event_date)}
          </p>
          <h3 className="text-[21px] font-semibold">{event.title}</h3>
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

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getEvents({ upcoming: true }),
    getEvents(),
  ]);

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <PageHeader eyebrow="Calendar" title="Events" />

      <h2 className="mt-9 border-b border-ink/14 pb-3 font-label text-xs uppercase tracking-[0.12em] text-brand">
        Upcoming
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {upcoming.length === 0 ? (
          <EmptyState>No upcoming events are scheduled right now.</EmptyState>
        ) : (
          upcoming.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </div>

      <h2 className="mt-14 border-b border-ink/14 pb-3 font-label text-xs uppercase tracking-[0.12em] text-brand">
        Past
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {past.length === 0 ? (
          <EmptyState>Past events will appear here once documented.</EmptyState>
        ) : (
          past.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </div>
    </main>
  );
}
