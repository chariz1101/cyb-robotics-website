import { Section } from "@/components/ui";

export const metadata = {
  title: "About",
  description:
    "The history, mission, vision and university affiliation of Cyb Robotics Organization.",
};

export default function AboutPage() {
  return (
    <>
      <Section eyebrow="About the org" title="Ten years of student-built robotics.">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-ink-soft">
          <p>
            Cyb Robotics began in 2016 as an eight-person Arduino study group
            meeting in a borrowed CICT laboratory. What started as weekend
            soldering sessions grew into an accredited organization running
            competition teams, community workshops, and a permanent build space.
          </p>
          <p>
            Today the org supports members across all year levels of the
            Information and Communications Technology programs, from
            first-timers wiring their first LED to senior teams shipping
            autonomous platforms.
          </p>
        </div>
      </Section>

      <Section tone="alt">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Mission</p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              To give every CICT student a hands-on path into robotics — through
              open workshops, mentored builds, and projects that solve real
              problems on campus and beyond.
            </p>
          </div>
          <div>
            <p className="eyebrow">Vision</p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              A student community recognized regionally for engineering rigor,
              generous mentorship, and technology built in service of Western
              Visayas.
            </p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Affiliation" tone="deep">
        <p className="max-w-3xl text-base leading-relaxed text-brand-soft">
          Cyb Robotics is an accredited student organization under the College of
          Information and Communications Technology, West Visayas State
          University, La Paz, Iloilo City. All activities are conducted under
          CICT faculty advisement and university student-affairs policy.
        </p>
      </Section>
    </>
  );
}
