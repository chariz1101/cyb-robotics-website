import Link from "next/link";

import { PageHeader, Card, Placeholder, EmptyState } from "@/components/ui";
import { getProjects } from "@/lib/queries";

export const metadata = {
  title: "Projects",
  description: "Robotics and embedded systems projects built by Cyb Robotics members.",
};

export default async function ProjectsPage() {
  const projects = await getProjects({ showcase: true });

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <PageHeader eyebrow="Showcase" title="Our projects" />

      {projects.length === 0 ? (
        <div className="mt-10">
          <EmptyState>No projects have been published yet.</EmptyState>
        </div>
      ) : (
        <div className="mt-9 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card interactive className="flex h-full flex-col">
                {project.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.cover_image_url}
                    alt=""
                    className="h-[180px] w-full object-cover"
                  />
                ) : (
                  <Placeholder label="project cover" className="h-[180px]" />
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
                  <h3 className="text-[18.5px] font-semibold">{project.title}</h3>
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
          ))}
        </div>
      )}
    </main>
  );
}
