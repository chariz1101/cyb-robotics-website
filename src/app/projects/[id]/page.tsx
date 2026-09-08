import Link from "next/link";
import { notFound } from "next/navigation";

import { Section, Card } from "@/components/ui";
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
    <>
      <Section eyebrow={project.category ?? "Project"} title={project.title}>
        <Link
          href="/projects"
          className="text-sm font-semibold text-brand hover:underline"
        >
          ← All projects
        </Link>
        {project.description && (
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink-soft">
            {project.description}
          </p>
        )}
      </Section>

      {steps.length > 0 && (
        <Section eyebrow="Instructions" tone="alt">
          <ol className="space-y-6">
            {steps.map((step) => (
              <li key={step.id}>
                <Card>
                  <p className="eyebrow">Step {step.step_number}</p>
                  <h3 className="mt-2 font-display text-lg font-semibold text-ink-strong">
                    {step.title}
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {step.instructions}
                  </p>
                </Card>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {files.length > 0 && (
        <Section eyebrow="Downloads">
          <ul className="space-y-3">
            {files.map((file) => (
              <li key={file.id}>
                <a
                  href={file.file_url}
                  className="flex items-center justify-between border border-line bg-surface px-5 py-4 text-sm transition-colors hover:border-brand"
                  style={{ borderRadius: "var(--radius-sharp)" }}
                >
                  <span className="font-medium text-ink">{file.file_name}</span>
                  <span className="text-brand">Download ↓</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
