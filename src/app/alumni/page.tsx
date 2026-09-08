import { Section, PersonCard, EmptyState } from "@/components/ui";
import { getAlumni } from "@/lib/queries";

export const metadata = {
  title: "Alumni",
  description: "Former members of Cyb Robotics Organization and where they are now.",
};

export default async function AlumniPage() {
  const alumni = await getAlumni();

  const byBatch = alumni.reduce<Record<string, typeof alumni>>((acc, person) => {
    const key = person.alumnus_batch_year ?? "Batch year unlisted";
    (acc[key] ??= []).push(person);
    return acc;
  }, {});

  return (
    <Section eyebrow="Where they are now" title="Our alumni">
      {alumni.length === 0 ? (
        <EmptyState>
          The alumni directory is being compiled. If you are a former member,
          reach out through our social channels.
        </EmptyState>
      ) : (
        <div className="space-y-12">
          {Object.entries(byBatch).map(([batch, people]) => (
            <div key={batch}>
              <p className="eyebrow">{batch}</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {people.map((person) => (
                  <PersonCard
                    key={person.id}
                    name={person.full_name}
                    role={person.alumnus_current_role}
                    detail={person.course}
                    photoUrl={person.photo_url}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
