import Link from "next/link";

import { PortalTabs } from "@/components/portal/tabs";
import { Card, Placeholder, EmptyState } from "@/components/ui";
import { getGuides } from "@/lib/queries";

const BADGE: Record<string, string> = {
  Beginner: "bg-brand-wash text-brand",
  Intermediate: "bg-brand text-canvas",
  Advanced: "bg-ink text-canvas",
};

export default async function GuidesPage(
  props: PageProps<"/members-portal/[slug]/guides">,
) {
  const { slug } = await props.params;
  const guides = await getGuides();

  return (
    <>
      <PortalTabs base={`/members-portal/${slug}`} />

      {guides.length === 0 ? (
        <div className="mt-6.5">
          <EmptyState>
            No project guides have been published yet. Officers can add them
            from the admin dashboard.
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6.5 grid gap-4.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))]">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              href={`/members-portal/${slug}/guides/${guide.id}`}
              className="block text-ink"
            >
              <Card interactive className="flex h-full flex-col">
                <div className="relative">
                  {guide.cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={guide.cover_image_url}
                      alt=""
                      className="h-[140px] w-full object-cover"
                    />
                  ) : (
                    <Placeholder label="build photo" className="h-[140px]" />
                  )}
                  {guide.difficulty_level && (
                    <span
                      className={`absolute left-3 top-3 px-2.25 py-1.25 font-label text-[9.5px] uppercase tracking-[0.1em] ${
                        BADGE[guide.difficulty_level] ?? BADGE.Beginner
                      }`}
                    >
                      {guide.difficulty_level}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4.5">
                  <h3 className="text-[17px] font-semibold">{guide.title}</h3>
                  {guide.description && (
                    <p className="text-[13.5px] leading-[1.55] text-ink-soft">
                      {guide.description}
                    </p>
                  )}
                  <span className="mt-auto pt-2.5 font-label text-[10.5px] uppercase tracking-[0.1em] text-brand">
                    {guide.project_steps.length} step
                    {guide.project_steps.length === 1 ? "" : "s"} →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
