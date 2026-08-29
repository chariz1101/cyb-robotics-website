# Wireframes Outline — Cyb Robotics Organization Website

**Version:** 1.0
**Date:** August 29, 2026

This document outlines the layout and key elements for every page across the three access tiers. It's meant as a reference for building UI mockups (e.g., in Figma) and for developers translating layout into components. Boxes below are simplified ASCII sketches, not final visual design.

---

## Global Elements (apply to all public + members pages)

**Header (sticky)**
- Left: Cyb Robotics logo + org name
- Center/Right: Nav links — Home | About | Members | Alumni | Projects | Events
- Mobile: collapses into a hamburger menu

**Footer**
- Org social media links (Facebook, Instagram, etc.)
- Contact email
- CICT / WVSU affiliation line
- Copyright/year

---

## PUBLIC WEBSITE

### 1. Home Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  HERO SECTION                               │
│  [Logo/Banner Image]                        │
│  "Cyb Robotics Organization"                │
│  Short tagline / mission one-liner          │
│  [CTA button: "Meet the Team" / "Explore"]  │
├────────────────────────────────────────────┤
│  QUICK STATS / HIGHLIGHTS                   │
│  [# Members] [# Projects] [# Events held]   │
├────────────────────────────────────────────┤
│  FEATURED PROJECTS (carousel/grid, 3 cards) │
├────────────────────────────────────────────┤
│  UPCOMING EVENT (highlight card)            │
├────────────────────────────────────────────┤
│  LATEST ANNOUNCEMENT (banner or card)       │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```
**Key elements:** Hero image/banner, mission tagline, stat counters, featured content teasers linking to full pages.

---

### 2. About Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  ORG HISTORY (text + photo)                 │
├────────────────────────────────────────────┤
│  MISSION & VISION (two columns or stacked)  │
├────────────────────────────────────────────┤
│  CICT / WVSU AFFILIATION BLOCK              │
│  (logos, brief description)                 │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```

---

### 3. Members/Officers Directory Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  PAGE TITLE: "Our Officers & Members"       │
├────────────────────────────────────────────┤
│  OFFICERS SECTION                           │
│  [Photo] [Photo] [Photo]                    │
│  Name      Name      Name                   │
│  Position  Position  Position               │
│  (grid, ordered by display_order)           │
├────────────────────────────────────────────┤
│  GENERAL MEMBERS SECTION                    │
│  [Grid of photo + name cards]               │
│  (optional filter by year level/course)     │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```

---

### 4. Alumni Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  PAGE TITLE: "Our Alumni"                   │
├────────────────────────────────────────────┤
│  FILTER: [Batch Year dropdown] (optional)   │
├────────────────────────────────────────────┤
│  ALUMNI GRID                                │
│  [Photo] Name — Batch Year — Current Role   │
│  (repeat as cards)                          │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```

---

### 5. Projects Showcase Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  PAGE TITLE: "Our Projects"                 │
├────────────────────────────────────────────┤
│  FILTER: [Category tabs/chips] (optional)   │
├────────────────────────────────────────────┤
│  PROJECT CARDS GRID                         │
│  [Cover image]                              │
│  Title                                      │
│  Short description                          │
│  (click → project detail modal/page)        │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```

---

### 6. Events Page
```
┌────────────────────────────────────────────┐
│ HEADER / NAV                                │
├────────────────────────────────────────────┤
│  PAGE TITLE: "Events"                       │
├────────────────────────────────────────────┤
│  TABS: [ Upcoming ] [ Past ]                │
├────────────────────────────────────────────┤
│  EVENT LIST (cards, newest first)           │
│  [Cover photo] Title — Date                 │
│  Short description                          │
│  (click → event detail with gallery)        │
├────────────────────────────────────────────┤
│ FOOTER                                      │
└────────────────────────────────────────────┘
```

---

## MEMBERS PAGE (Unlisted — `/members-portal/<secret-slug>`)

> No global public nav/footer needed here — treat as a self-contained portal with its own simple header.

### 7. Members Portal — Landing/Directory
```
┌────────────────────────────────────────────┐
│  CYB ROBOTICS — MEMBERS PORTAL (simple hdr) │
├────────────────────────────────────────────┤
│  TABS: [ Directory ] [ Project Guides ]     │
├────────────────────────────────────────────┤
│  SEARCH / FILTER BAR                        │
│  (filter by category: Letters, Programmes,  │
│   Branding, Event Docs)                     │
├────────────────────────────────────────────┤
│  FILE LIST (table or card list)             │
│  📄 File name  | Category | Event | [↓Down] │
│  📄 File name  | Category | Event | [↓Down] │
│  (repeat, paginated if long)                │
└────────────────────────────────────────────┘
```

### 8. Members Portal — Project Guides
```
┌────────────────────────────────────────────┐
│  CYB ROBOTICS — MEMBERS PORTAL              │
├────────────────────────────────────────────┤
│  TABS: [ Directory ] [ Project Guides ]     │
├────────────────────────────────────────────┤
│  PROJECT GUIDE CARDS                        │
│  [Ultrasonic Alarm] [LED Lights] [Ard Game] │
│  Difficulty badge on each card               │
├────────────────────────────────────────────┤
│  (click a card → detail view below)         │
├────────────────────────────────────────────┤
│  PROJECT DETAIL VIEW                        │
│  Title + description                        │
│  Step 1: ... [image]                        │
│  Step 2: ... [image]                        │
│  Step N: ...                                │
│  ── Sample Code ──                          │
│  [📄 download .ino file] [view code preview]│
└────────────────────────────────────────────┘
```

---

## ADMIN PAGE (`/admin`, login-protected)

### 9. Admin — Login
```
┌────────────────────────────────────────────┐
│              CYB ROBOTICS ADMIN             │
│  ┌────────────────────────────────────┐    │
│  │  Email:    [______________]         │    │
│  │  Password: [______________]         │    │
│  │            [ Log In ]                │    │
│  └────────────────────────────────────┘    │
└────────────────────────────────────────────┘
```

### 10. Admin — Dashboard Home
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  MAIN CONTENT AREA      │
│ ─────────────     │                         │
│ Dashboard         │  Welcome, [Admin Name]  │
│ Members           │  Quick stats:           │
│ Events            │  [# Members][# Events]  │
│ Announcements     │  [# Files][# Draft ann.]│
│ Files             │                         │
│ Alumni            │  Recent activity log    │
│ ─────────────     │  (last 5 admin actions) │
│ [Logout]          │                         │
└────────────────────────────────────────────┘
```

### 11. Admin — Members/Officers Management
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  Members Management     │
│                   │  [+ Add Member]         │
│                   │  ─────────────────────  │
│                   │  Search: [______]        │
│                   │  Table:                 │
│                   │  Name | Position | Yr   │
│                   │        [Edit][Delete]   │
│                   │  (repeat rows)          │
└────────────────────────────────────────────┘
```
**Add/Edit Member Form (modal or side panel):** Name, Photo upload, Year level, Course, Is Officer? toggle, Position dropdown, Bio, Is Alumnus? toggle, Batch year, Current role.

### 12. Admin — Events Management
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  Events Management      │
│                   │  [+ Add Event]          │
│                   │  ─────────────────────  │
│                   │  Table:                 │
│                   │  Title | Date | Status  │
│                   │        [Edit][Delete]   │
│                   │  (repeat rows)          │
└────────────────────────────────────────────┘
```
**Add/Edit Event Form:** Title, Description, Date, Cover photo upload, Gallery photo uploads, Publish toggle.

### 13. Admin — Announcements Management
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  Announcements          │
│                   │  [+ New Announcement]   │
│                   │  ─────────────────────  │
│                   │  Table:                 │
│                   │  Title | Audience | Pub?│
│                   │        [Edit][Delete]   │
└────────────────────────────────────────────┘
```
**Add/Edit Announcement Form:** Title, Content (rich text), Audience (Public/Members/Both), Publish toggle, Publish date.

### 14. Admin — Files Directory Management
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  Files Directory        │
│                   │  [+ Upload File]        │
│                   │  ─────────────────────  │
│                   │  Filter: [Category ▾]   │
│                   │  Table:                 │
│                   │  Name | Category | Event│
│                   │        [Download][Del]  │
└────────────────────────────────────────────┘
```
**Upload File Form:** File picker, Category dropdown (Letter/Programme/Branding/Documentation), Related event (optional dropdown), Upload button.

### 15. Admin — Alumni Management
```
┌────────────────────────────────────────────┐
│ SIDEBAR NAV       │  Alumni Management      │
│                   │  [+ Add Alumnus]        │
│                   │  ─────────────────────  │
│                   │  Table:                 │
│                   │  Name | Batch | Role    │
│                   │        [Edit][Delete]   │
└────────────────────────────────────────────┘
```

---

## Notes for Design/Dev Handoff
- All admin tables should support basic pagination once record counts grow.
- Forms should show inline validation errors (e.g., missing required fields) before submission, per NFR-10 in the SRS.
- Mobile view for Admin: sidebar collapses into a top dropdown or hamburger menu; tables become stacked cards.
- These are structural outlines only — visual styling (colors, spacing, typography) should follow the org's branding guide once created.