import { PageHeader, EmptyState } from "@/components/ui";
import { ProjectCard } from "@/components/cards";
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
        <div className="mt-9 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr))]">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
