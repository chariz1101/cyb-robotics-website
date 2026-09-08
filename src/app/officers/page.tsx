import { Section, PersonCard, EmptyState } from "@/components/ui";
import { CURRENT_TERM, getOfficers, getGeneralMembers } from "@/lib/queries";

export const metadata = {
  title: "Officers & Members",
  description:
    "The executive officers, board members and general membership of CYB Robotics Organization.",
};

export default async function OfficersPage() {
  const [officers, members] = await Promise.all([
    getOfficers(),
    getGeneralMembers(),
  ]);

  const adviser = officers.adviser[0];

  return (
    <>
      <Section eyebrow="Our team" title="Officers &amp; members">
        <p className="max-w-2xl text-base leading-relaxed text-ink-soft">
          The people steering CYB Robotics for academic year {CURRENT_TERM}.
        </p>
      </Section>

      {adviser && (
        <Section eyebrow="Adviser" tone="alt">
          <div className="max-w-sm">
            <PersonCard
              name={adviser.full_name}
              role={adviser.officer_positions?.title}
              detail={adviser.course}
              photoUrl={adviser.photo_url}
            />
          </div>
        </Section>
      )}

      <Section
        eyebrow={`AY ${CURRENT_TERM}`}
        title="Executive officers"
        tone={adviser ? "light" : "alt"}
      >
        {officers.executive.length === 0 ? (
          <EmptyState>No officers have been published yet.</EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {officers.executive.map((m) => (
              <PersonCard
                key={m.id}
                name={m.full_name}
                role={m.officer_positions?.title ?? m.position}
                detail={m.year_level}
                photoUrl={m.photo_url}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Board members" tone="alt">
        {officers.board.length === 0 ? (
          <EmptyState>No board members have been published yet.</EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {officers.board.map((m) => (
              <PersonCard
                key={m.id}
                name={m.full_name}
                role={m.officer_positions?.committee}
                detail={m.year_level}
                photoUrl={m.photo_url}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="General members">
        {members.length === 0 ? (
          <EmptyState>
            The general membership roster is being compiled.
          </EmptyState>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <PersonCard
                key={m.id}
                name={m.full_name}
                detail={m.year_level}
                photoUrl={m.photo_url}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
