import {
  PageHeader,
  SectionRule,
  OfficerCard,
  MemberChip,
  EmptyState,
} from "@/components/ui";
import { CURRENT_TERM, getOfficers, getGeneralMembers } from "@/lib/queries";

export const metadata = {
  title: "Officers & Members",
  description:
    "The executive officers, board members and general membership of Cyb Robotics Organization.",
};

export default async function OfficersPage() {
  const [officers, members] = await Promise.all([
    getOfficers(),
    getGeneralMembers(),
  ]);

  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <PageHeader eyebrow="Directory" title="Our officers & members" />

      <SectionRule className="mt-13 mb-5">
        Executive officers — AY {CURRENT_TERM.replace("-", "–")}
      </SectionRule>
      {officers.executive.length === 0 ? (
        <EmptyState>No officers have been published yet.</EmptyState>
      ) : (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {officers.executive.map((m) => (
            <OfficerCard
              key={m.id}
              name={m.full_name}
              position={m.officer_positions?.title ?? m.position}
              detail={m.course}
              photoUrl={m.photo_url}
            />
          ))}
        </div>
      )}

      {officers.board.length > 0 && (
        <>
          <SectionRule className="mt-14 mb-5">Board members</SectionRule>
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
            {officers.board.map((m) => (
              <OfficerCard
                key={m.id}
                name={m.full_name}
                position={m.officer_positions?.title ?? m.position}
                detail={m.course}
                photoUrl={m.photo_url}
              />
            ))}
          </div>
        </>
      )}

      <SectionRule className="mt-14 mb-5">General members</SectionRule>
      {members.length === 0 ? (
        <EmptyState>The general membership roster is being compiled.</EmptyState>
      ) : (
        <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
          {members.map((m) => (
            <MemberChip
              key={m.id}
              name={m.full_name}
              meta={m.year_level ?? m.course}
            />
          ))}
        </div>
      )}

      {/* The adviser closes the page, after the students. */}
      {officers.adviser.length > 0 && (
        <>
          <SectionRule className="mt-14 mb-5">Adviser</SectionRule>
          {/* auto-fill, not auto-fit: keeps the lone adviser card at card
              width instead of stretching it across the row. */}
          <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
            {officers.adviser.map((m) => (
              <OfficerCard
                key={m.id}
                name={m.full_name}
                position={m.officer_positions?.title ?? m.position}
                detail={m.course}
                photoUrl={m.photo_url}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
