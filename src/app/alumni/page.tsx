import { PageHeader, Card, EmptyState, initialsOf } from "@/components/ui";
import { getAlumni } from "@/lib/queries";

export const metadata = {
  title: "Alumni",
  description: "Former members of Cyb Robotics Organization and where they are now.",
};

export default async function AlumniPage() {
  const alumni = await getAlumni();

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <PageHeader eyebrow="Where they are now" title="Our alumni" />

      {alumni.length === 0 ? (
        <div className="mt-10">
          <EmptyState>
            The alumni directory is being compiled. If you are a former member,
            reach out through our social channels.
          </EmptyState>
        </div>
      ) : (
        <div className="mt-9 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {alumni.map((person) => (
            <Card key={person.id} className="flex gap-4 p-5">
              <span className="hatch flex h-[62px] w-[62px] flex-none items-center justify-center border border-ink/10 text-base font-semibold text-muted">
                {initialsOf(person.full_name)}
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold tracking-[-0.01em]">
                  {person.full_name}
                </span>
                {person.alumnus_batch_year && (
                  <span className="mt-1.5 block font-label text-[10.5px] tracking-[0.1em] text-brand">
                    BATCH {person.alumnus_batch_year}
                  </span>
                )}
                {(person.alumnus_current_role || person.course) && (
                  <span className="mt-2 block text-[13.5px] leading-[1.5] text-ink-soft">
                    {person.alumnus_current_role}
                    {person.alumnus_current_role && person.course && <br />}
                    {person.course}
                  </span>
                )}
              </span>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
