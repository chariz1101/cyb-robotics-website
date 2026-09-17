# Maintenance & Handoff

Who keeps this running, and what to check before launch.

---

## Owners

> **Fill this in before launch.** A site with one person who can deploy is one
> illness or one graduation away from being unmaintainable.

| Role | Name | Has access to |
|---|---|---|
| Primary maintainer | _(fill in)_ | GitHub, Vercel, Supabase, admin dashboard |
| Backup maintainer | _(fill in)_ | GitHub, Vercel, Supabase, admin dashboard |
| Content owner | _(fill in)_ | Admin dashboard |
| Adviser | Engr. Lea M. Gabawa | — |

**At least two people** must hold every credential. Check this every time
officers change.

---

## Where everything lives

| Thing | Where |
|---|---|
| Code | GitHub — `chariz1101/cyb-robotics-website` |
| Hosting | Vercel — deploys automatically on every push to `main` |
| Database, auth, file storage | Supabase |
| Design source | The Claude Design canvas (see `docs/tasklist.md` → Branding) |

---

## Automated checks

`npm run check` runs the two that need nothing but the repo:

| Script | Needs | What it protects |
|---|---|---|
| `check:officers` | — | Officer ordering: shuffles the real roster, asserts President first and adviser last |
| `check:images` | — | Upload resizing: runs the shipped function in Chromium against generated photos |
| `check:contrast` | — | Every colour pairing meets WCAG AA |
| `check:a11y` | dev server | axe-core audit; fails on serious and critical violations |
| `check:responsive` | dev server | No horizontal overflow at 390/768/1400px; mobile nav opens |
| `check:links` | dev server | No dead internal links |
| `check:rls` | Supabase keys | Every anonymous write is rejected on every table |
| `check:crud` | live site + admin login | Create → appears publicly → unpublish → disappears → delete |

The ones needing a server are worth running against a deployed preview, where
the database-backed pages are reachable:

```bash
CHECK_BASE_URL=https://<preview>.vercel.app npm run check:a11y
CHECK_BASE_URL=https://<preview>.vercel.app npm run check:links
CHECK_BASE_URL=https://<preview>.vercel.app npm run check:responsive
```

`check:rls` reads `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` from the environment. It refuses to run if it
cannot reach the database, because a rejected write proves nothing when the
host is unreachable.

---

## Pre-launch checklist

### Verified in code

- [x] The service role key appears nowhere in `src/` — every write authorizes
      as the signed-in admin through RLS
- [x] No `.env` file has ever been committed; `.gitignore` covers `.env*`
- [x] Every `<img>` and `<Image>` has an `alt` attribute
- [x] `robots.txt` disallows `/admin` and `/members-portal` without naming the
      secret slug
- [x] `sitemap.xml` contains no portal or admin URL
- [x] Colour pairings meet WCAG AA (`check:contrast`)
- [x] No serious or critical axe violations on the pages reachable without
      credentials

### Needs a live environment

- [ ] `npm run check:rls` passes against production
- [ ] `npm run check:crud` passes against production
- [ ] `check:a11y`, `check:links`, `check:responsive` pass with
      `CHECK_BASE_URL` pointed at a deployment
- [ ] Lighthouse ≥ 90 on performance and accessibility
- [ ] Walkthrough on a real iOS and a real Android device
- [ ] Cross-browser check in Safari and Firefox — the automated checks run
      Chromium only, so these are genuinely manual

### Needs a person

- [ ] Officers have reviewed every public page for accuracy
- [ ] Every listed member and alumnus has consented to being published
- [ ] Database backed up (Supabase → Database → Backups)
- [ ] Custom domain connected, if there is one
- [ ] Two officers hold every credential, and the table above is filled in
- [ ] Screen recording of the admin dashboard made for next year's officers

---

## Routine upkeep

**Each semester**

- Update the officer roster when positions change
- Move graduating members to Alumni
- Confirm both maintainers still have access

**Each year**

- Add the new `term_year` positions (see `docs/admin-guide.md`)
- Rotate the members-portal slug if it has been shared widely
- Export a database backup before the handover

**When something breaks**

1. Check the Vercel deployment log — a failed build leaves the last good
   version live, so the site stays up
2. Check the Supabase logs for database errors
3. `npm run check` locally to see whether a known guarantee has regressed
