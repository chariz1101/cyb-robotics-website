import Link from "next/link";

import { Section, Card, EmptyState, Button } from "@/components/ui";
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
  const [stats, projects, upcoming, announcements] = await Promise.all([
    getStats(),
    getProjects({ showcase: true, limit: 3 }),
    getEvents({ upcoming: true, limit: 1 }),
    getAnnouncements("public", 1),
  ]);

  const nextEvent = upcoming[0];
  const latest = announcements[0];

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-deep text-canvas">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="eyebrow-on-dark">CICT · West Visayas State University</p>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Building machines that think, one prototype at a time.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-brand-soft md:text-lg">
            Cyb Robotics is the student robotics and embedded systems
            organization of the College of Information and Communications
            Technology — a workshop for hands-on learning, competition, and
            community outreach.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/officers">Meet the team</Button>
            <Button href="/projects" tone="outline">
              Explore projects
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-line bg-surface-alt">
        <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-line px-6">
          {[
            { label: "Members", value: stats.members },
            { label: "Projects", value: stats.projects },
            { label: "Events held", value: stats.events },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-10 text-center">
              <dd className="font-display text-3xl font-bold text-brand md:text-5xl">
                {stat.value}
              </dd>
              <dt className="eyebrow mt-2 block">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured projects */}
      <Section eyebrow="Showcase" title="Featured projects">
        {projects.length === 0 ? (
          <EmptyState>No projects have been published yet.</EmptyState>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id}>
                  {project.category && (
                    <p className="eyebrow">{project.category}</p>
                  )}
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink-strong">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  )}
                  <Link
                    href={`/projects/${project.id}`}
                    className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
                  >
                    Read more →
                  </Link>
                </Card>
              ))}
            </div>
            <Link
              href="/projects"
              className="mt-8 inline-block text-sm font-semibold text-brand hover:underline"
            >
              View all →
            </Link>
          </>
        )}
      </Section>

      {/* Upcoming event + latest announcement */}
      <Section tone="alt">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow">Upcoming event</p>
            {nextEvent ? (
              <Card className="mt-4">
                <p className="text-sm text-muted">
                  {formatDate(nextEvent.event_date)}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink-strong">
                  {nextEvent.title}
                </h3>
                {nextEvent.description && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    {nextEvent.description}
                  </p>
                )}
                <Link
                  href="/events"
                  className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
                >
                  See all events →
                </Link>
              </Card>
            ) : (
              <div className="mt-4">
                <EmptyState>No upcoming events are scheduled.</EmptyState>
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow">Latest announcement</p>
            {latest ? (
              <Card className="mt-4">
                {latest.publish_date && (
                  <p className="text-sm text-muted">
                    Posted {formatDate(latest.publish_date)}
                  </p>
                )}
                <h3 className="mt-2 font-display text-xl font-semibold text-ink-strong">
                  {latest.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {latest.content}
                </p>
              </Card>
            ) : (
              <div className="mt-4">
                <EmptyState>Nothing announced right now.</EmptyState>
              </div>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
