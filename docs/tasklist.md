# Cyb Robotics Organization Website — 1-Month Build Task List

A week-by-week task breakdown for building and launching the Cyb Robotics Organization website within 1 month (4 weeks). Assumes a small team (1–4 people) working part-time alongside classes.

---

## Week 1: Setup & Foundation

**Goal:** Project scaffolding, environments ready, database schema designed.

### Setup
- [/] Create GitHub repository and invite collaborators
- [ ] Set up Next.js project with Tailwind CSS
- [ ] Create Supabase project (database, auth, storage)
- [ ] Create Vercel project and link it to the GitHub repo
- [ ] Set up `.env.local` and `.env.local.example` with Supabase keys
- [ ] Confirm auto-deploy works (push a test commit, verify it appears live)

### Planning & Design
- [ ] Finalize sitemap for public site, members page, and admin page
- [ ] Sketch wireframes for: Home, About, Members/Officers, Alumni, Projects, Events, Members Portal, Admin Dashboard
- [ ] Decide on brand colors, fonts, and logo usage (based on existing Cyb Robotics branding)
- [ ] Define database schema (tables: `members`, `officers`, `alumni`, `events`, `projects`, `announcements`, `files`)

### Database
- [ ] Create tables in Supabase per finalized schema
- [ ] Set up Row Level Security (RLS) policies (public read-only tables vs. admin-only write access)
- [ ] Create a Supabase Storage bucket for files (letters, programmes, branding, sample code)
- [ ] Seed the database with placeholder/sample data for development

**End of Week 1 Checkpoint:** Repo, hosting, and database are live; schema is finalized; wireframes approved by officers.

---

## Week 2: Public Website

**Goal:** Public-facing pages built and populated with real content.

### Core Pages
- [ ] Build Home page (hero section, mission statement, highlights)
- [ ] Build About page (org history, mission/vision, CICT/WVSU affiliation)
- [ ] Build Officers/Members directory page (photos, names, positions)
- [ ] Build Alumni page (list/gallery of past members)
- [ ] Build Projects showcase page (public-facing summaries of club projects)
- [ ] Build Events page (upcoming and past events, with photos/descriptions)

### Content & Media
- [ ] Collect officer/member photos and bios
- [ ] Collect alumni info and photos
- [ ] Collect event photos and write event descriptions
- [ ] Write project summaries for the public projects page
- [ ] Optimize and upload all images

### Polish
- [ ] Add responsive navigation bar and footer (with social media links)
- [ ] Make all public pages mobile-responsive
- [ ] Basic SEO setup (page titles, meta descriptions, favicon)

**End of Week 2 Checkpoint:** Public website is fully browsable with real content, on both desktop and mobile.

---

## Week 3: Members Page & Admin Page

**Goal:** Build the unlisted members portal and the protected admin dashboard.

### Members Page (Unlisted, No Login)
- [ ] Build the unlisted route using the secret slug pattern
- [ ] Build the Directory section (event documentation, sample letters, programmes, branding files)
- [ ] Build the Projects section for beginner guides:
  - [ ] Ultrasonic alarm — instructions + sample code
  - [ ] LED lights project — instructions + sample code
  - [ ] Arduino-based game — instructions + sample code
- [ ] Add file download/preview functionality (PDFs, images, code files)
- [ ] Test that the page is not indexed by search engines (`noindex` meta tag / robots.txt)

### Admin Page
- [ ] Build admin login page (Supabase Auth)
- [ ] Build admin dashboard layout/navigation
- [ ] Build member/officer management (add, edit, remove)
- [ ] Build event management (add, edit, remove)
- [ ] Build announcements management (create, edit, delete, publish/unpublish)
- [ ] Build file upload/manage interface for the members' directory
- [ ] Restrict all admin routes to authenticated admin users only

### Testing
- [ ] Test admin CRUD operations end-to-end
- [ ] Test that public/members pages update correctly after admin changes
- [ ] Test file upload size limits and supported file types

**End of Week 3 Checkpoint:** Members portal and admin dashboard are functional; admins can manage all content without touching code.

---

## Week 4: Testing, Refinement & Launch

**Goal:** Polish, fix bugs, gather feedback, and officially launch.

### Quality Assurance
- [ ] Full walkthrough of all three tiers (public, members, admin) on desktop
- [ ] Full walkthrough on mobile devices
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Fix any broken links, layout issues, or bugs found
- [ ] Check loading speed and optimize large images/assets

### Security & Access
- [ ] Review Supabase RLS policies once more (no public write access anywhere)
- [ ] Confirm admin credentials are secure and not shared insecurely
- [ ] Confirm the members page secret slug is only shared through official org channels
- [ ] Back up the database (export initial data)

### Content Review
- [ ] Officers review all public content for accuracy
- [ ] Proofread all text across the site
- [ ] Confirm all officer/member/alumni info is up to date and approved for publishing

### Launch
- [ ] Set up custom domain (if applicable) and connect to Vercel
- [ ] Final deployment to production
- [ ] Announce the website launch to the org (social media, group chats, etc.)
- [ ] Share the members portal link with current members through official channels
- [ ] Document admin login steps and share with relevant officers

### Handoff Documentation
- [ ] Write/update internal documentation on how to use the admin dashboard
- [ ] Record a short screen-recording walkthrough for future officers (optional but recommended)
- [ ] Confirm at least 2 people have admin access and repo/Supabase/Vercel access for redundancy

**End of Week 4 Checkpoint:** Website is live, tested, and officially launched. Admin access and documentation are in place for future officers.

---

## Notes
- Adjust task ownership based on team size — pair tasks up if working solo across 4 weeks.
- If timelines slip, prioritize in this order: **Admin functionality > Public site > Members portal polish** — the admin page unblocks everything else long-term.
- Keep a running list of "nice-to-have" features (e.g., search, dark mode, event RSVP) for a post-launch v2 instead of squeezing them into this month.