import Link from "next/link";

import { Card, Placeholder, EmptyState } from "@/components/ui";
import {
  getAnnouncements,
  getEvents,
  getProjects,
  getStats,
} from "@/lib/queries";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const [stats, featured, upcoming, announcements] = await Promise.all([
    getStats(),
    getProjects({ showcase: true, limit: 3 }),
    getEvents({ upcoming: true, limit: 1 }),
    getAnnouncements("public", 1),
  ]);

  const nextEvent = upcoming[0];
  const latest = announcements[0];

  return (
    <main>
      {/* Hero */}
      <section
        className="overflow-hidden border-b border-ink bg-brand-deep"
        style={{
          backgroundImage:
            "radial-gradient(circle at 82% 20%, rgba(94,164,131,0.28), transparent 55%)",
        }}
      >
        <div className="container-page grid items-center gap-10 lg:[grid-template-columns:minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="py-22 lg:py-23">
            <div className="mb-6.5 flex items-center gap-2.5">
              <span className="block h-px w-6.5 bg-brand-mid" />
              <span className="label text-brand-soft">
                CICT · West Visayas State University
              </span>
            </div>
            <h1 className="text-[40px] font-bold text-canvas md:text-[60px] md:leading-[1.02]">
              Building machines that think, one prototype at a time.
            </h1>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] text-canvas/76">
              Cyb Robotics is the student robotics and embedded systems
              organization of the College of Information and Communications
              Technology — a workshop for hands-on learning, competition, and
              community outreach.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/officers"
                className="rounded-[2px] bg-canvas px-6.5 py-4 text-[14.5px] font-semibold text-brand-deep transition-opacity hover:opacity-90"
              >
                Meet the team
              </Link>
              <Link
                href="/projects"
                className="rounded-[2px] border border-canvas/34 px-6.5 py-4 text-[14.5px] font-medium text-canvas transition-colors hover:bg-white/10"
              >
                Explore projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink">
        <dl className="container-page grid grid-cols-3">
          {[
            { label: "Members", value: stats.members },
            { label: "Projects", value: stats.projects },
            { label: "Events held", value: stats.events },
          ].map((stat) => (
            <div
              key={stat.label}
              className="-ml-px border-l border-canvas/12 py-8.5 pl-6.5"
            >
              <dd className="text-[32px] font-bold leading-none tracking-[-0.03em] text-canvas md:text-[44px]">
                {stat.value}
              </dd>
              <dt className="label mt-2.5 block tracking-[0.16em] text-brand-mid">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured projects */}
      <section className="container-page pt-19">
        <div className="flex flex-wrap items-baseline justify-between gap-5 border-b border-ink/14 pb-4.5">
          <h2 className="text-[30px] font-bold">Featured projects</h2>
          <Link
            href="/projects"
            className="font-label text-[11px] uppercase tracking-[0.12em] text-brand"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="mt-7">
            <EmptyState>No projects have been published yet.</EmptyState>
          </div>
        ) : (
          <div className="mt-7 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {featured.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card interactive className="flex h-full flex-col">
                  {project.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.cover_image_url}
                      alt=""
                      className="h-[170px] w-full object-cover"
                    />
                  ) : (
                    <Placeholder label="project cover" className="h-[170px]" />
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5 pb-5.5">
                    {project.category && (
                      <span className="label-sm text-brand">
                        {project.category}
                      </span>
                    )}
                    <h3 className="text-[18px] font-semibold">{project.title}</h3>
                    {project.description && (
                      <p className="text-sm leading-[1.55] text-ink-soft">
                        {project.description}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming event + latest announcement */}
      <section className="container-page grid gap-5 pt-14 lg:[grid-template-columns:minmax(0,1.35fr)_minmax(0,1fr)]">
        {nextEvent ? (
          <div className="flex flex-col gap-3.5 bg-brand p-8.5">
            <span className="label-sm tracking-[0.16em] text-brand-pale">
              Upcoming event
            </span>
            <h3 className="max-w-[24ch] text-[28px] font-bold text-canvas">
              {nextEvent.title}
            </h3>
            <p className="font-label text-xs tracking-[0.06em] text-brand-tint">
              {formatDate(nextEvent.event_date)}
            </p>
            {nextEvent.description && (
              <p className="mt-1.5 max-w-[46ch] text-[15px] leading-[1.6] text-canvas/80">
                {nextEvent.description}
              </p>
            )}
            <Link
              href="/events"
              className="mt-3 self-start rounded-[2px] border border-canvas/34 px-5 py-3 text-[13.5px] font-medium text-canvas transition-colors hover:bg-white/10"
            >
              See all events
            </Link>
          </div>
        ) : (
          <EmptyState>No upcoming events are scheduled.</EmptyState>
        )}

        {latest ? (
          <Card className="flex flex-col gap-3 p-7.5">
            <span className="label-sm tracking-[0.16em] text-brand">
              Latest announcement
            </span>
            <h3 className="text-[20px] font-semibold">{latest.title}</h3>
            <p className="text-[14.5px] leading-[1.6] text-ink-soft">
              {latest.content}
            </p>
            {latest.publish_date && (
              <p className="mt-auto border-t border-ink/10 pt-4 font-label text-[11px] tracking-[0.08em] text-muted">
                Posted {formatDate(latest.publish_date)}
              </p>
            )}
          </Card>
        ) : (
          <EmptyState>Nothing announced right now.</EmptyState>
        )}
      </section>

      <div className="h-19" />
    </main>
  );
}
