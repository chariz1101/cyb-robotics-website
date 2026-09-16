import Link from "next/link";
import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/portal/code-block";
import { Card, Placeholder } from "@/components/ui";
import { getGuide } from "@/lib/queries";

const BADGE: Record<string, string> = {
  Beginner: "bg-brand-wash text-brand",
  Intermediate: "bg-brand text-canvas",
  Advanced: "bg-ink text-canvas",
};

/** Text files are shown inline; binaries are download-only. */
const INLINE_CODE = new Set(["ino", "c", "cpp", "h", "py", "txt", "md"]);

export async function generateMetadata(
  props: PageProps<"/members-portal/[slug]/guides/[id]">,
) {
  const { id } = await props.params;
  const result = await getGuide(id);
  return {
    title: result ? result.project.title : "Guide not found",
    robots: { index: false, follow: false },
  };
}

export default async function GuidePage(
  props: PageProps<"/members-portal/[slug]/guides/[id]">,
) {
  const { slug, id } = await props.params;
  const result = await getGuide(id);
  if (!result) notFound();

  const { project, steps, files } = result;
  const codeFile = files.find((f) =>
    INLINE_CODE.has((f.file_type ?? "").toLowerCase()),
  );

  return (
    <div className="mt-6.5">
      <Link
        href={`/members-portal/${slug}/guides`}
        className="font-label text-[11px] uppercase tracking-[0.1em] text-brand"
      >
        ← All guides
      </Link>

      <Card className="mt-5 p-6 sm:p-8.5">
        {project.difficulty_level && (
          <span
            className={`inline-block px-2.25 py-1.25 font-label text-[9.5px] uppercase tracking-[0.1em] ${
              BADGE[project.difficulty_level] ?? BADGE.Beginner
            }`}
          >
            {project.difficulty_level}
          </span>
        )}
        <h1 className="mb-2.5 mt-4 text-[26px] font-bold sm:text-[32px]">
          {project.title}
        </h1>
        {project.description && (
          <p className="max-w-[70ch] text-base leading-[1.65] text-ink-soft">
            {project.description}
          </p>
        )}

        {project.parts_list && (
          <div className="mt-5.5 border-l-2 border-brand bg-surface-alt px-4.5 py-4">
            <p className="mb-2 font-label text-[10px] uppercase tracking-[0.14em] text-brand">
              Parts list
            </p>
            <p className="whitespace-pre-line font-label text-[13px] leading-[1.8] text-ink-body">
              {project.parts_list}
            </p>
          </div>
        )}

        <div className="mt-8.5 flex flex-col gap-6.5">
          {steps.map((step) => (
            <div
              key={step.id}
              className="grid items-start gap-6 border-t border-ink/10 pt-6 md:[grid-template-columns:minmax(0,1fr)_minmax(0,240px)]"
            >
              <div>
                <p className="font-label text-[10.5px] uppercase tracking-[0.14em] text-brand">
                  Step {step.step_number}
                </p>
                <h2 className="mb-2 mt-2.5 text-[19px] font-semibold">
                  {step.title}
                </h2>
                <p className="whitespace-pre-line text-[14.5px] leading-[1.65] text-ink-soft">
                  {step.instructions}
                </p>
              </div>
              {step.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={step.image_url}
                  alt=""
                  className="w-full border border-ink/10 object-cover"
                />
              ) : (
                <Placeholder
                  label="wiring diagram"
                  className="h-[150px] w-full border border-ink/10"
                />
              )}
            </div>
          ))}
        </div>

        {codeFile && (
          <CodeBlock
            code={await fetchCode(codeFile.file_url)}
            fileName={codeFile.file_name}
            downloadUrl={codeFile.file_url}
          />
        )}

        {files.length > 0 && (
          <div className="mt-8.5 border-t border-ink/10 pt-6">
            <p className="mb-4 font-label text-[11px] uppercase tracking-[0.14em] text-brand">
              Downloads
            </p>
            <ul className="flex flex-col gap-2.5">
              {files.map((file) => (
                <li key={file.id}>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between border border-ink/12 bg-surface px-5 py-3.5 text-sm hover:border-brand"
                  >
                    <span className="truncate font-medium">{file.file_name}</span>
                    <span className="ml-4 flex-none font-label text-[10.5px] uppercase tracking-[0.1em] text-brand">
                      Open ↓
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

/**
 * Reads a sample-code file so it can be shown inline.
 *
 * Runs on the server, and a failure only costs the inline listing — the
 * download button still works — so it degrades to a short message rather
 * than taking the page down.
 */
async function fetchCode(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const text = await response.text();
    return text.length > 40_000 ? `${text.slice(0, 40_000)}\n…` : text;
  } catch {
    return "// Could not load the sample code. Use the download button above.";
  }
}
