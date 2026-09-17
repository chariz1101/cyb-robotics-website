import { PortalTabs } from "@/components/portal/tabs";
import { FileDirectory, type DirectoryRow } from "@/components/portal/file-directory";
import { Card } from "@/components/ui";
import { getAnnouncements, getDirectoryFiles } from "@/lib/queries";

export default async function PortalDirectoryPage(
  props: PageProps<"/members-portal/[slug]">,
) {
  const { slug } = await props.params;
  const [files, announcements] = await Promise.all([
    getDirectoryFiles(),
    getAnnouncements("members", 3),
  ]);

  const rows: DirectoryRow[] = files.map((f) => ({
    id: f.id,
    fileName: f.file_name,
    category: f.category,
    eventTitle: f.events?.title ?? null,
    url: f.file_url,
    sizeKb: f.file_size_kb,
  }));

  return (
    <>
      <PortalTabs base={`/members-portal/${slug}`} />

      {announcements.length > 0 && (
        <div className="mt-6.5 flex flex-col gap-3">
          {announcements.map((a) => (
            <Card key={a.id} className="border-l-2 border-l-brand p-5">
              <p className="label-sm tracking-[0.14em] text-brand">
                Announcement
              </p>
              <h2 className="mt-2 text-[19px]">{a.title}</h2>
              <p className="mt-1.5 text-sm leading-[1.6] text-ink-soft">
                {a.content}
              </p>
            </Card>
          ))}
        </div>
      )}

      <FileDirectory files={rows} />
    </>
  );
}
