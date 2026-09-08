import Link from "next/link";

import { Section, Card, EmptyState } from "@/components/ui";
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

function EventList({ events }: { events: EventRecord[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id}>
          <p className="text-sm text-muted">{formatDate(event.event_date)}</p>
          <h3 className="mt-2 font-display text-lg font-semibold text-ink-strong">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
              {event.description}
            </p>
          )}
          <Link
            href={`/events/${event.id}`}
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >
            Read more →
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getEvents({ upcoming: true }),
    getEvents(),
  ]);

  return (
    <>
      <Section eyebrow="Calendar" title="Events">
        {upcoming.length === 0 ? (
          <EmptyState>No upcoming events are scheduled right now.</EmptyState>
        ) : (
          <EventList events={upcoming} />
        )}
      </Section>

      <Section title="Past events" tone="alt">
        {past.length === 0 ? (
          <EmptyState>Past events will appear here once documented.</EmptyState>
        ) : (
          <EventList events={past} />
        )}
      </Section>
    </>
  );
}
