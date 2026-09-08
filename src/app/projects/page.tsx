import Link from "next/link";

import { Section, Card, EmptyState } from "@/components/ui";
import { getProjects } from "@/lib/queries";

export const metadata = {
  title: "Projects",
  description: "Robotics and embedded systems projects built by Cyb Robotics members.",
};

export default async function ProjectsPage() {
  const projects = await getProjects({ showcase: true });

  return (
    <Section eyebrow="Showcase" title="Our projects">
      {projects.length === 0 ? (
        <EmptyState>No projects have been published yet.</EmptyState>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id}>
              <div className="flex items-center justify-between gap-3">
                {project.category && <p className="eyebrow">{project.category}</p>}
                {project.difficulty_level && (
                  <span className="text-xs text-faint">
                    {project.difficulty_level}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink-strong">
                {project.title}
              </h3>
              {project.description && (
                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted">
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
      )}
    </Section>
  );
}
