# Software Requirements Specification (SRS)

## Cyb Robotics Organization Website

**Prepared for:** Cyb Robotics Organization, College of Information and Communications Technology (CICT), West Visayas State University
**Version:** 1.0
**Date:** August 29, 2026

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the functional and non-functional requirements for the **Cyb Robotics Organization Website**. It is intended to guide the development team in building the system and to serve as a reference for officers and future maintainers of the project.

### 1.2 Scope
The system is a web application with three access tiers:
1. **Public Website** — accessible to anyone, presenting information about the organization, its members, alumni, projects, and events.
2. **Members Page** — an unlisted (non-indexed, no-login) page accessible only to those with the direct link, containing an events documentation directory and beginner robotics project guides with sample code.
3. **Admin Page** — a login-protected dashboard for officers to manage members, events, announcements, and files.

The system will be built using Next.js (React), Tailwind CSS, Supabase (database, authentication, file storage), and hosted on Vercel.

**Out of scope for version 1.0:**
- Online payments or financial transactions
- Real-time chat or messaging between members
- Mobile native applications (iOS/Android apps)
- Public user accounts/registration for non-officers

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|---|---|
| SRS | Software Requirements Specification |
| CICT | College of Information and Communications Technology |
| WVSU | West Visayas State University |
| Admin | An officer with credentials to log into the Admin Page |
| Unlisted page | A page with no public navigation link and not indexed by search engines; accessible only via direct URL |
| CRUD | Create, Read, Update, Delete |
| RLS | Row Level Security (a Supabase/PostgreSQL access control feature) |

### 1.4 References
- Next.js Documentation — https://nextjs.org/docs
- Supabase Documentation — https://supabase.com/docs
- Tailwind CSS Documentation — https://tailwindcss.com/docs
- Project README and Task List (internal repository documents)

### 1.5 Overview
Section 2 describes the overall product context and constraints. Section 3 details specific functional and non-functional requirements. Section 4 covers external interface requirements. Section 5 lists assumptions and dependencies.

---

## 2. Overall Description

### 2.1 Product Perspective
This is a new, standalone system replacing any prior informal means (e.g., social media pages, shared drives) of presenting organization information and distributing internal documents. It is a single web application serving three distinct user-facing views from one codebase.

### 2.2 Product Functions (Summary)
- Display organizational information, officer/member directory, alumni list, projects, and events to the public.
- Provide members with access to an internal file directory and project learning guides via an unlisted link.
- Allow admins to manage all dynamic content (members, events, announcements, files) through a dashboard, without editing code.

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Skill Assumed |
|---|---|---|
| Public Visitor | Any internet user browsing the public site | None |
| Member | Current org member with access to the unlisted members page link | Basic (able to navigate a webpage, download files) |
| Admin/Officer | Officer responsible for maintaining site content | Basic to moderate (comfortable with web forms; no coding required) |
| Developer/Maintainer | Student developer maintaining or extending the codebase | Intermediate to advanced (Next.js, Supabase) |

### 2.4 Operating Environment
- Client: Modern web browsers (Chrome, Firefox, Safari, Edge), desktop and mobile.
- Server/Hosting: Vercel (application), Supabase (database, auth, file storage).
- No installation required for end users; fully web-based.

### 2.5 Design and Implementation Constraints
- Must be maintainable by student developers with rotating membership year to year.
- Must operate within free-tier limits of Vercel and Supabase where possible, given the organization has no dedicated budget for hosting.
- The Members Page must not require a login system; access control is via an unguessable URL.

### 2.6 Assumptions and Dependencies
- The organization will provide accurate and up-to-date content (member info, event details, project instructions).
- Continued availability of Vercel and Supabase free-tier services.
- At least one officer per academic year will be designated to maintain admin access and site content.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Public Website

| ID | Requirement |
|---|---|
| FR-1.1 | The system shall display a Home page with an overview of the organization. |
| FR-1.2 | The system shall display an About page with the organization's history, mission, and vision. |
| FR-1.3 | The system shall display a directory of current officers and members with names, positions, and photos. |
| FR-1.4 | The system shall display a list/gallery of alumni. |
| FR-1.5 | The system shall display a showcase of past and ongoing projects with descriptions and images. |
| FR-1.6 | The system shall display a list of upcoming and past events with descriptions, dates, and photos. |
| FR-1.7 | The system shall be navigable via a consistent header/navigation menu and footer across all public pages. |
| FR-1.8 | The public website shall not require login or registration to view any content. |

#### 3.1.2 Members Page (Unlisted)

| ID | Requirement |
|---|---|
| FR-2.1 | The system shall provide a members page accessible only via a direct, unlisted URL (not linked from public navigation, not indexed by search engines). |
| FR-2.2 | The members page shall display a directory of event documentation and files (e.g., sample letters, programmes, branding assets), organized for browsing/searching. |
| FR-2.3 | The members page shall allow users to view and download files from the directory. |
| FR-2.4 | The members page shall display beginner robotics project guides, including at minimum: an ultrasonic alarm project, an LED lights project, and an Arduino-based game project. |
| FR-2.5 | Each project guide shall include step-by-step instructions and downloadable/viewable sample code. |
| FR-2.6 | The members page shall not require a username/password login. |

#### 3.1.3 Admin Page

| ID | Requirement |
|---|---|
| FR-3.1 | The system shall require authentication (login) to access any admin page or function. |
| FR-3.2 | The system shall allow an authenticated admin to add, edit, and remove member records. |
| FR-3.3 | The system shall allow an authenticated admin to add, edit, and remove officer records (including position/title). |
| FR-3.4 | The system shall allow an authenticated admin to add, edit, and remove event records. |
| FR-3.5 | The system shall allow an authenticated admin to create, edit, publish, unpublish, and delete announcements. |
| FR-3.6 | The system shall allow an authenticated admin to upload, organize, and remove files in the members' directory. |
| FR-3.7 | The system shall allow an authenticated admin to add, edit, and remove alumni records. |
| FR-3.8 | The system shall restrict all data-modifying actions (create/update/delete) to authenticated admin users only. |
| FR-3.9 | The system shall log out an admin session after a period of inactivity or upon manual logout. |

#### 3.1.4 Announcements

| ID | Requirement |
|---|---|
| FR-4.1 | The system shall display published announcements to relevant audiences (public site and/or members page, as configured by the admin). |
| FR-4.2 | The system shall allow an admin to designate whether an announcement is public-facing, members-only, or both. |

### 3.2 Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-1 | Performance | Public pages shall load within 3 seconds under normal broadband/mobile data conditions. |
| NFR-2 | Usability | The site shall be responsive and usable on both desktop and mobile screen sizes. |
| NFR-3 | Security | Admin functions shall be protected by authentication; unauthenticated users shall not be able to modify any data. |
| NFR-4 | Security | Direct database write access shall be restricted via Row Level Security (RLS) policies; only the admin role may write. |
| NFR-5 | Security | The members page URL shall use a sufficiently long, non-guessable identifier to serve as its access control. |
| NFR-6 | Maintainability | The codebase shall be organized and documented (README, code comments) to allow handoff to new student developers each academic year. |
| NFR-7 | Availability | The system should target 99% uptime, relying on the SLA of the chosen hosting provider (Vercel) and backend provider (Supabase). |
| NFR-8 | Compatibility | The system shall function correctly on the latest two versions of major browsers (Chrome, Firefox, Safari, Edge). |
| NFR-9 | Scalability | The system shall support content growth (e.g., growing number of events, members, files) without requiring architectural changes, within free-tier or low-cost hosting limits. |
| NFR-10 | Data Integrity | The system shall validate required fields (e.g., event date, member name) before allowing an admin to save a record. |

### 3.3 Data Requirements (High-Level Entities)

| Entity | Key Attributes |
|---|---|
| Member | Name, photo, role/position, year, contact info (optional) |
| Officer | Name, photo, position, term/year |
| Alumnus | Name, photo, graduation year, current role/notes |
| Event | Title, description, date, photos, status (upcoming/past) |
| Project | Title, description, images, category (public showcase or members' guide) |
| Announcement | Title, content, audience (public/members/both), publish status, date |
| File | File name, category (letter/programme/branding/code/etc.), associated event (optional), upload date, file URL |

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Consistent navigation and branding (Cyb Robotics logo, colors) across all public pages.
- A distinct but consistent layout for the members page directory and project guides.
- A simple, form-based dashboard UI for the admin page (no coding knowledge required to operate).

### 4.2 Hardware Interfaces
- None specific; standard client devices (desktop/laptop/mobile) with internet access and a modern web browser.

### 4.3 Software Interfaces
- **Supabase**: Database (PostgreSQL), Authentication, and Storage APIs.
- **Vercel**: Hosting and deployment pipeline (auto-deploy from GitHub `main` branch).
- **GitHub**: Version control and collaboration.

### 4.4 Communication Interfaces
- Standard HTTPS for all client-server communication.

---

## 5. Other Requirements

### 5.1 Legal/Compliance
- Member and alumni personal information (names, photos) shall only be published with consent, per organization policy.
- The members page, while unlisted, shall not host sensitive personal data (e.g., financial or private contact information) beyond what is appropriate for a soft-security page.

### 5.2 Future Enhancements (Not in v1.0 Scope)
- Search functionality across the site.
- Event RSVP/registration system.
- Dark mode.
- Passcode protection for the members page, if content sensitivity increases.

---

## Appendix A: Requirement Traceability Summary

| Feature Area | Related Requirements |
|---|---|
| Public Website | FR-1.1 – FR-1.8 |
| Members Page | FR-2.1 – FR-2.6 |
| Admin Page | FR-3.1 – FR-3.9 |
| Announcements | FR-4.1 – FR-4.2 |
| Non-Functional | NFR-1 – NFR-10 |

---

## Document Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Project Lead / Developer | | | |
| Organization Adviser | | | |
| President / Head Officer | | | |