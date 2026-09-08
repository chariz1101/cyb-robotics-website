import { PageHeader, Card, Placeholder } from "@/components/ui";

export const metadata = {
  title: "About",
  description:
    "The history, mission, vision and university affiliation of Cyb Robotics Organization.",
};

export default function AboutPage() {
  return (
    <main className="container-page w-full py-16 pb-[90px]">
      <PageHeader eyebrow="About the org" title="Ten years of student-built robotics." />

      <div className="mt-13 grid items-start gap-11 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-label text-[13px] font-semibold uppercase tracking-[0.1em] text-brand">
            Our history
          </h2>
          <p className="mb-4 text-base leading-[1.68] text-ink-body">
            Cyb Robotics began in 2016 as an eight-person Arduino study group
            meeting in a borrowed CICT laboratory. What started as weekend
            soldering sessions grew into an accredited organization running
            competition teams, community workshops, and a permanent build space.
          </p>
          <p className="text-base leading-[1.68] text-ink-body">
            Today the org supports members across all year levels of the
            Information and Communications Technology programs, from first-timers
            wiring their first LED to senior teams shipping autonomous platforms.
          </p>
        </div>
        <Placeholder
          label="org photo — build lab"
          className="h-[320px] border border-ink/12"
        />
      </div>

      <div className="mt-14 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="bg-brand-deep p-8.5">
          <h2 className="mb-3.5 font-label text-xs uppercase tracking-[0.14em] text-brand-soft">
            Mission
          </h2>
          <p className="text-[19px] leading-[1.55] text-canvas">
            To give every CICT student a hands-on path into robotics — through
            open workshops, mentored builds, and projects that solve real
            problems on campus and beyond.
          </p>
        </div>
        <Card className="p-8.5">
          <h2 className="mb-3.5 font-label text-xs uppercase tracking-[0.14em] text-brand">
            Vision
          </h2>
          <p className="text-[19px] leading-[1.55] text-ink-body">
            A student community recognized regionally for engineering rigor,
            generous mentorship, and technology built in service of Western
            Visayas.
          </p>
        </Card>
      </div>

      <Card className="mt-14 grid items-center gap-8.5 p-8.5 md:[grid-template-columns:minmax(0,auto)_minmax(0,1fr)]">
        <div className="flex gap-3.5">
          <Placeholder
            label="CICT seal"
            className="h-22 w-22 border border-ink/12 text-center"
          />
          <Placeholder
            label="WVSU seal"
            className="h-22 w-22 border border-ink/12 text-center"
          />
        </div>
        <div>
          <h2 className="mb-2.5 text-[20px] font-semibold">Affiliation</h2>
          <p className="max-w-[70ch] text-[15px] leading-[1.65] text-ink-soft">
            Cyb Robotics is an accredited student organization under the College
            of Information and Communications Technology, West Visayas State
            University, La Paz, Iloilo City. All activities are conducted under
            CICT faculty advisement and university student-affairs policy.
          </p>
        </div>
      </Card>
    </main>
  );
}
