# Cyb Robotics Organization Website — Build Plan

**Timeline:** 6 weeks (Sep 7 – Oct 18, 2026), with a hard fallback scope at Week 4
**Team:** 1–4 student developers, part-time alongside classes
**Status as of:** Sep 8, 2026 — end of Week 1

---

## How to read this plan

Work runs on **two parallel tracks**, because they block on completely different things:

- **Track B (Content & Coordination)** depends on *other people* — officers submitting photos, alumni replying, advisers approving text. It has the longest lead time and the least control, so it starts on Day 1 and runs the entire six weeks. **This is the real critical path.** A finished site with placeholder photos is not launched.
- **Track A (Build)** depends only on the dev team. It can always move forward using seed data, so it never waits on Track B.

The single most common way a project like this misses its date is treating content as a Week 2 task. It isn't. Chasing 30 people for headshots takes longer than writing the pages that display them.

**Dependency rule:** every build task below can be completed against seeded placeholder data. Nothing in Track A is allowed to block on Track B.

---

## Week 1 — Foundation *(Sep 7–13)* ✅ done

**Goal:** repo, database, and hosting are live; everything downstream is unblocked.

### Track A — Build
- [x] Create GitHub repository and invite collaborators
- [x] Set up Next.js project with Tailwind CSS
- [x] Write the SRS, wireframe guide, and database schema docs
- [x] Design the database schema (10 tables, RLS policies, storage buckets)
- [x] Write runnable migrations (`supabase/setup.sql`, `supabase/migrations/`)
- [x] Create the Supabase project and run `supabase/setup.sql`
- [x] Insert the first `admin_users` row (see `docs/schema.md` §6 — nothing works without it)
- [x] Fill in `.env.local` from `env.local.example`
- [x] Create the Vercel project, link the repo, add env vars
- [x] Confirm auto-deploy works (push a commit, verify it appears live)
- [x] Seed the real AY 2026-2027 roster (20 people) via migration 0004

### Track B — Content & Coordination *(start now, do not defer)*
- [ ] Send the photo + bio request to all 14 officers, with a **hard deadline of Week 3**
- [ ] Send the alumni info request through org channels and social media
- [ ] Confirm the branding source of truth: colors, fonts, logo files (see below)
- [ ] Get officer sign-off on the sitemap and wireframes in `docs/wireframe-guide.md`
- [ ] Ask the adviser who must approve public text before launch, and how long they need

**Checkpoint:** a deployed site (even if it's the Next.js splash page) reading from a live Supabase project with seed data. Content requests are out with deadlines attached.

---

## Week 2 — Design System & Shell *(Sep 14–20)* ✅ done

**Goal:** every future page is a fill-in-the-blanks exercise, not a design decision.

### Track A — Build
- [x] Translate the branding into Tailwind theme tokens (`globals.css` `@theme`)
- [x] Build `src/lib/supabase/` — browser client, server client, typed queries
- [~] Types hand-written in `src/lib/database.types.ts`. `npm run types:generate`
      regenerates them from the live schema — needs `SUPABASE_PROJECT_ID` and a
      logged-in Supabase CLI, so it has to be run locally
- [x] Build the shared shell: sticky header, nav, mobile hamburger, footer
- [x] Build the reusable primitives the wireframes call for: `Card`, `SectionHeading`,
      `PersonCard`, `EventCard`, `ProjectCard`, `Button`, `EmptyState`
- [x] Set up the base metadata / SEO defaults and favicon
- [x] Verify the shell at phone width, including the nav — covered by
      `npm run check:responsive`

### Track B — Content & Coordination
- [ ] First follow-up on officer photos (expect ~40% response after one ask)
- [ ] Draft the About page text: history, mission, vision, CICT/WVSU affiliation
- [ ] Collect event photos from past activities and pick the best 5–8 per event
- [ ] Decide the members-portal secret slug and where it will be shared

**Checkpoint:** the shell renders on every route with correct branding. A new page costs an hour, not a day.

---

## Week 3 — Public Website *(Sep 21–27)* ✅ done

**Goal:** the entire public tier is browsable against real queries.

### Track A — Build
- [x] Home — hero, stat counters, featured projects, upcoming event, latest announcement
- [x] About — history, mission/vision, affiliation
- [x] Officers — grouped by committee, ordered by `officer_positions.display_order`
- [x] Members — full directory
- [x] Alumni — list/gallery with batch year and current role
- [x] Projects — public showcase grid, plus a project detail page
- [x] Events — upcoming and past, with a per-event detail page and photo gallery
- [x] Handle every empty state (no upcoming events, no announcements, no alumni yet)
- [x] Make all public pages responsive

### Track B — Content & Coordination
- [ ] **Officer photo deadline lands this week** — chase the stragglers individually
- [ ] Write the public project summaries
- [ ] Write event descriptions for each past event
- [ ] Optimize and upload all images collected so far

**Checkpoint:** a stranger can browse the whole public site on a phone and understand what Cyb Robotics is. Real content where it exists, graceful placeholders where it doesn't.

---

## Week 4 — Admin Dashboard *(Sep 28 – Oct 4)* ✅ done

**Goal:** officers can change site content without a developer. This is the tier that determines whether the site survives past this batch.

### Track A — Build
- [x] Admin login page via Supabase Auth
- [x] Route protection — `proxy.ts` guarding every `/admin` route
      (Next 16 renamed `middleware.ts` to `proxy.ts`; same functionality)
- [x] Dashboard layout and navigation
- [x] Member/officer management — add, edit, remove, assign position, toggle published
- [x] Event management — add, edit, remove, publish/unpublish, manage photo gallery
- [x] Announcement management — create, edit, delete, publish/unpublish, set audience
- [x] File upload interface for the members directory, with category tagging
- [x] Image upload with client-side resize before it reaches storage
- [x] Confirm every write path goes through RLS as the signed-in admin, **not** the service role key
- [x] End-to-end test: create → appears publicly; unpublish → disappears —
      `npm run check:crud` (needs a live site and admin credentials)

### Track B — Content & Coordination
- [ ] Adviser reviews the public text drafted in Weeks 2–3
- [ ] Collect the members-portal files: sample letters, programmes, branding assets
- [ ] Confirm which alumni have consented to being listed publicly

**⚠️ Fallback point:** if the timeline has slipped badly, **launch here** with the public site and admin dashboard only. The members portal ships as a v1.1 two weeks later. A live public site with working admin beats a complete site that never launches.

**Checkpoint:** an officer who has never seen the codebase can add an event, upload its photos, and see it appear publicly — without asking a developer.

---

## Week 5 — Members Portal *(Oct 5–11)* — Track A done

**Goal:** the unlisted members tier is complete and useful.

### Track A — Build
- [x] Build the unlisted route using the secret-slug pattern
- [x] `noindex` meta tag on every members route
- [x] `robots.txt` disallow, and verified the route is absent from the sitemap
- [x] Directory section — event documentation, letters, programmes, branding, filterable by category
- [x] File download and preview for PDFs, images, and code files
- [x] Project guides section with step-by-step instructions and a code viewer.
      The three guides themselves are content — officers add them from
      **Admin → Projects**, which now manages steps and sample-code files:
  - [ ] Ultrasonic alarm — written as "Collision-Detecting Alarm" and seeded by
        migration `0007`; still needs `supabase/seed/collision-alarm.ino` uploaded
        and a build-through *(content)*
  - [ ] LED lights project *(content)*
  - [ ] Arduino-based game *(content)*
- [x] Copy-to-clipboard on every code block
- [x] Members-audience announcements surface here

### Track B — Content & Coordination
- [ ] Write the three project guides — steps, wiring diagrams, tested sample code
- [ ] **Actually build each project from your own written instructions.** If a member
      can't follow them, the guide has failed, and you will only find that out by trying
- [ ] Upload all directory files with correct categories

**Checkpoint:** a member with the link can download any org file and follow a project guide end to end.

---

## Week 6 — Hardening & Launch *(Oct 12–18)* — engineering done

**Goal:** ship it, and make sure next year's officers can keep it running.

### Quality
- [~] Automated coverage of all three tiers; a human walkthrough is still worth doing
- [ ] Full walkthrough on real mobile devices (iOS and Android)
- [ ] Cross-browser check — **Safari and Firefox are manual**; only Chromium
      is available to the automated checks
- [~] Automated a11y pass clean (`check:a11y`, axe-core) and every colour
      pairing meets AA (`check:contrast`). **Lighthouse itself still needs
      running against a deployment**
- [x] Alt text on every image (verified); keyboard focus states present on
      all interactive elements
- [x] `check:links` crawls the public site for dead internal links;
      `check:responsive` covers layout breaks

### Security
- [x] `npm run check:rls` attempts insert/update/delete on every table with
      the anon key and asserts each is rejected — **run it against production**
- [x] Confirm the service role key appears nowhere in client-side code or the repo
- [x] Confirm `.env.local` is gitignored and was never committed
- [x] Verified the portal is absent from the sitemap and disallowed in robots.txt
- [ ] Export a full database backup

### Content Sign-off
- [ ] Officers review every public page for accuracy
- [ ] Proofread all text
- [ ] Confirm every listed member and alumnus consented to publication

### Launch
- [ ] Connect the custom domain, if there is one
- [ ] Deploy to production
- [ ] Announce on org social media and group chats
- [ ] Share the members portal link through official channels only

### Handoff — *do not skip this*
- [x] Write the admin guide — `docs/admin-guide.md`
- [ ] Record a 10-minute screen walkthrough of the admin dashboard
- [ ] Give **at least two officers** admin access to the site, Supabase, Vercel, and the repo
- [x] Document how to rotate the members-portal slug if it leaks —
      `docs/admin-guide.md`
- [~] `docs/maintenance.md` has the owners table — **names still to fill in**

**Checkpoint:** live, tested, documented, and owned by more than one person.

---

## Where the project actually stands

*Updated Sep 14, 2026.*

**Track A (build) — Weeks 1 through 4 complete.** Nine public routes, the
design system, the typed data layer, and the full admin dashboard: login,
route protection, and CRUD for members, alumni, events, announcements and
files. Photo and file uploads go to Supabase Storage, with images
downscaled in the browser before they leave the device.

**Track B (content) — not started.** No officer photos, no bios, no alumni
records, no event documentation. Every page still renders its empty state
or initials-only cards.

The dashboard no longer blocks this. Officers can manage everything
themselves, photos included, so content collection is now purely a matter
of asking people and waiting. That waiting is the longest lead time left
in the project — 20 people have to send material, and the clock starts
when the first message goes out, not when the site is finished.

### Checks

Run `npm run check` before pushing. It covers the two things that broke
silently once already:

| Script | What it protects |
|---|---|
| `check:officers` | Officer ordering — shuffles the real roster and asserts President first, adviser last |
| `check:images` | Upload resizing — runs the shipped function in Chromium against generated photos |
| `check:responsive` | Horizontal overflow at 390/768/1400px and the mobile nav (needs `npm run dev` running) |
| `check:crud` | Admin create → public → unpublish → delete. Needs `CHECK_BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` |
| `check:contrast` | Every colour pairing meets WCAG AA. No server needed |
| `check:a11y` | axe-core audit; fails on serious and critical violations |
| `check:links` | Dead internal links across the public site |
| `check:rls` | Anonymous insert/update/delete rejected on every table. Refuses to run if the database is unreachable |

Full reference, plus the pre-launch checklist, is in `docs/maintenance.md`.

---

## Branding

Source of truth: the design canvas
(artifact `1d5a075e-4df4-4952-b0da-bab50b85c2c8`).
Extracted into `src/app/globals.css` as Tailwind v4 `@theme` tokens — use the
token names, not raw hex, so a palette change stays a one-file edit.

### Color

| Token | Hex | Usage |
|---|---|---|
| `brand` | `#145C41` | Primary green — links, buttons, active nav, rules |
| `brand-deep` | `#0C3B2A` | Deep green section backgrounds (hero, footer) |
| `brand-mid` | `#5F9C82` | Muted green on dark backgrounds |
| `brand-soft` | `#8FC4AA` | Light mint — secondary text on dark |
| `canvas` | `#F6F6F1` | Page background (warm cream, never pure white) |
| `surface` | `#FFFFFF` | Cards, panels |
| `surface-alt` | `#F1F2EE` | Alternating sections, inset panels |
| `surface-sunk` | `#FAFAF7` | Table stripes, subtle insets |
| `ink` | `#31362F` | Body copy |
| `ink-strong` | `#0B0D0C` | Headings; near-black section backgrounds |
| `ink-soft` | `#4A504B` | Secondary copy |
| `muted` | `#6B726C` | Captions, metadata |
| `faint` | `#8A918B` | Timestamps, disabled states |
| `line` | `#E7E9E4` | Borders, dividers |
| `danger` | `#A32020` | Destructive actions, errors |
| `accent` | `#D97757` | Sparingly — highlights, badges |

The palette is warm-neutral, not grey. `#F6F6F1` rather than white is what
gives the design its character; using `#FFF` for page backgrounds will quietly
flatten it.

### Type

| Role | Family | Notes |
|---|---|---|
| Display | **Bebas Neue** | h1–h4 and the large stat numerals. One weight only |
| Body & UI | **Montserrat** | Paragraphs, buttons, labels. Weights 400–600 |
| Lead copy | **Montserrat Light** (300) | The `lead` utility — large secondary copy only |
| Mono | system mono | Code blocks in the members-portal guides |

**Bebas Neue ships a single weight (400).** There is no Bold cut, so a
`font-bold` on a Bebas heading only asks the browser to synthesise one,
which smears the letterforms. Headings carry weight through size and the
face's own condensed density instead.

Bebas is also uppercase-only — lowercase input renders as capitals — and its
cap-height-to-em ratio makes it read about 15% smaller than a normal face at
the same pixel size, so heading sizes were scaled up to compensate. It wants
slightly open tracking (`0.01em`), the opposite of the negative tracking the
previous face used.

Montserrat Light is deliberately not available as a general body style: at
300 it only holds up at size.

### Motifs — the details that make it look designed

- **Sharp corners.** `border-radius: 2px` almost everywhere. Pills (`999px`) and
  avatars (`50%`) are the only exceptions. Rounded cards will read as a
  different site.
- **Wide-tracked eyebrows.** Small uppercase labels at `0.08em`–`0.18em`
  letter-spacing sit above nearly every section heading. This is the single most
  recognizable move in the design — available as the `eyebrow` utility.
- **Near-flat elevation.** Depth comes from hairline borders, not shadow. One
  card shadow and one toast shadow exist; that's the whole scale.
- **Light page, dark punctuation.** Cream background broken by deep-green
  (`#0C3B2A`) and near-black (`#0B0D0C`) full-bleed sections.

### Screens in the canvas

Home (hero, featured projects), About (history, mission, vision, affiliation),
Officers & Members (executives AY 2026–2027 + general members), Alumni,
Projects, Events, members-portal guide pages, and the admin dashboard.

---

## Scope Discipline

**If the timeline slips, cut in this order:**

1. Members portal project guides → ship with one guide instead of three
2. Members portal entirely → v1.1, two weeks after launch
3. Alumni page → v1.1, if alumni response is thin
4. Polish and animation → always last

**Never cut:** the admin dashboard. Without it the site is frozen the day you graduate, and the next batch has to rebuild from scratch. It is the whole reason this is a database-backed site instead of static HTML.

**Deliberately out of scope for v1** — keep a list, revisit after launch:
site search, dark mode, event RSVP, member logins, comments, a newsletter, analytics dashboards.

---

## Notes

- Two people should be able to deploy. A single point of failure during finals week is a real risk.
- Commit small and often; every push to `main` deploys.
- When a task is blocked on another person, log **who** and **since when**. That list is what you escalate to the adviser.
