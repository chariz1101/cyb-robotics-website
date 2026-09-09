import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader, Card } from "@/components/ui";
import { getProject } from "@/lib/queries";

export async function generateMetadata(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const result = await getProject(id);
  if (!result) return { title: "Project not found" };
  return {
    title: result.project.title,
    description: result.project.description ?? undefined,
  };
}

export default async function ProjectPage(props: PageProps<"/projects/[id]">) {
  const { id } = await props.params;
  const result = await getProject(id);

  if (!result) notFound();
  const { project, steps, files } = result;

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <Link
        href="/projects"
        className="font-label text-[10.5px] uppercase tracking-[0.1em] text-brand"
      >
        ← All projects
      </Link>
      <div className="mt-5">
        <PageHeader
          eyebrow={project.category ?? "Project"}
          title={project.title}
        />
      </div>
      {project.description && (
        <p className="mt-6 max-w-[70ch] text-base leading-[1.68] text-ink-body">
          {project.description}
        </p>
      )}

      {steps.length > 0 && (
        <>
          <h2 className="mt-13 border-b border-ink/14 pb-3.5 font-label text-xs uppercase tracking-[0.14em] text-brand">
            Instructions
          </h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step) => (
              <li key={step.id}>
                <Card className="p-6">
                  <p className="label-sm text-brand">Step {step.step_number}</p>
                  <h3 className="mt-2 text-[18px] font-semibold">{step.title}</h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-[1.6] text-ink-soft">
                    {step.instructions}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </>
      )}

      {files.length > 0 && (
        <>
          <h2 className="mt-13 border-b border-ink/14 pb-3.5 font-label text-xs uppercase tracking-[0.14em] text-brand">
            Downloads
          </h2>
          <ul className="mt-6 space-y-3">
            {files.map((file) => (
              <li key={file.id}>
                <a
                  href={file.file_url}
                  className="flex items-center justify-between border border-ink/12 bg-surface px-5 py-4 text-sm transition-colors hover:border-brand"
                >
                  <span className="font-medium">{file.file_name}</span>
                  <span className="font-label text-[10.5px] uppercase tracking-[0.1em] text-brand">
                    Download ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
