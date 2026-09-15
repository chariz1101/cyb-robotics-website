import { PageHeader, EmptyState } from "@/components/ui";
import { EventCard } from "@/components/cards";
import { getEvents } from "@/lib/queries";

export const metadata = {
  title: "Events",
  description: "Upcoming and past activities of Cyb Robotics Organization.",
};

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
          upcoming.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>

      <h2 className="mt-14 border-b border-ink/14 pb-3 font-label text-xs uppercase tracking-[0.12em] text-brand">
        Past
      </h2>
      <div className="mt-6 flex flex-col gap-4">
        {past.length === 0 ? (
          <EmptyState>Past events will appear here once documented.</EmptyState>
        ) : (
          past.map((event) => <EventCard key={event.id} event={event} />)
        )}
      </div>
    </main>
  );
}
