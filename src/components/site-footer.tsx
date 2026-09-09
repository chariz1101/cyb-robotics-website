import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-canvas/62">
      <div className="container-page grid gap-8 py-13 pb-10 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
        <div>
          <Image
            src="/cyb-logo.png"
            alt=""
            width={44}
            height={44}
            className="mb-3.5 block h-11 w-11 object-contain"
          />
          <p className="text-sm font-semibold text-canvas">
            Cyb Robotics Organization
          </p>
          <p className="label mt-2 text-[10.5px] tracking-[0.1em] text-brand-mid">
            CICT · WVSU · La Paz, Iloilo
          </p>
        </div>

        <div>
          <p className="label mb-3.5 text-[10.5px] tracking-[0.14em] text-canvas">
            Connect
          </p>
          <div className="flex flex-col gap-2.5 text-sm">
            {["Facebook", "Instagram", "GitHub"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-canvas/66 hover:text-canvas"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="label mb-3.5 text-[10.5px] tracking-[0.14em] text-canvas">
            Contact
          </p>
          <p className="text-sm leading-[1.7]">
            <a
              href="mailto:cybrobotics@wvsu.edu.ph"
              className="text-canvas/66 hover:text-canvas"
            >
              cybrobotics@wvsu.edu.ph
            </a>
            <br />
            CICT Building, Room 204
          </p>
        </div>

        <div>
          <p className="label mb-3.5 text-[10.5px] tracking-[0.14em] text-canvas">
            Internal
          </p>
          <div className="flex flex-col items-start gap-2.5 text-sm">
            <Link href="/portal" className="text-canvas/66 hover:text-canvas">
              Members portal
            </Link>
            <Link href="/admin" className="text-canvas/66 hover:text-canvas">
              Admin login
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/12">
        <p className="container-page label py-4.5 text-[10.5px] tracking-[0.08em] text-canvas/42">
          © {new Date().getFullYear()} Cyb Robotics Organization · All rights reserved
        </p>
      </div>
    </footer>
  );
}
