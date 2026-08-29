# Cyb Robotics Organization Website

Official website for **Cyb Robotics Organization**, the robotics organization under the College of Information and Communications Technology (CICT), West Visayas State University.

The site has three access tiers:
1. **Public Website** — club info, officers/members, alumni, projects, and events for anyone to view.
2. **Members Page** (unlisted, no login) — an unlisted route for members to access event documentation, files (sample letters, programmes, branding), and beginner Arduino project guides with sample code.
3. **Admin Page** — a protected dashboard for managing officers/members, events, announcements, and the members' file directory.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (React) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Database | PostgreSQL via [Supabase](https://supabase.com/) |
| Auth | Supabase Auth (admin only) |
| File Storage | Supabase Storage |
| Hosting | [Vercel](https://vercel.com/) |

---

## Project Structure

```
cyb-robotics-website/
├── app/
│   ├── (public)/              # Public website routes
│   │   ├── page.tsx            # Home
│   │   ├── about/
│   │   ├── members/            # Public member/officer directory
│   │   ├── alumni/
│   │   ├── projects/
│   │   └── events/
│   ├── members-portal/         # Unlisted members page (secret slug route)
│   │   └── [secret-slug]/
│   │       ├── directory/      # Event docs, letters, programmes, branding
│   │       └── projects/       # Arduino project guides + sample code
│   ├── admin/                  # Protected admin dashboard
│   │   ├── login/
│   │   ├── members/
│   │   ├── events/
│   │   ├── announcements/
│   │   └── files/
│   └── layout.tsx
├── components/                 # Shared UI components
├── lib/
│   ├── supabase/                # Supabase client + helpers
│   └── utils/
├── public/                      # Static assets (logo, images)
├── styles/
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com/) account/project
- A free [Vercel](https://vercel.com/) account (for deployment)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/chariz1101/cyb-robotics-website.git
cd cyb-robotics-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy the example file and fill in your Supabase project credentials:
```bash
cp .env.local.example .env.local
```
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only, keep secret
MEMBERS_PAGE_SECRET_SLUG=your-unlisted-url-slug
```

### 4. Run the development server
```bash
npm run dev
```
Visit `http://localhost:3000` for the public site, and `http://localhost:3000/members-portal/<your-secret-slug>` for the members page.

### 5. Set up the database
Run the SQL migration scripts in `/supabase/migrations` via the Supabase SQL editor or CLI to create the tables (`members`, `officers`, `alumni`, `events`, `projects`, `announcements`, `files`).

---

## Access Tiers Explained

### Public Website
No authentication required. Anyone can browse club info, current officers/members, alumni, projects, and events.

### Members Page (Unlisted)
- No login required — access is via a long, unguessable URL (the "secret slug").
- Intended for internal, low-sensitivity content: event documentation, sample letters, programmes, branding assets, and Arduino project guides with code.
- **Security note:** this is a soft-security model. Anyone with the link can view the page. Do not upload sensitive personal or financial data here. If sensitive files are ever needed, consider adding a simple shared passcode gate.

### Admin Page
- Protected by Supabase Auth login (officer/admin accounts only).
- Can add/edit/remove members, officers, and events.
- Can post announcements.
- Can upload/manage files in the members' directory.

---

## Deployment

The site auto-deploys to Vercel on every push to `main`.

1. Import the repo into [Vercel](https://vercel.com/new).
2. Add the same environment variables from `.env.local` into the Vercel project settings.
3. Deploy.

---

## Contributing (for org members/officers)

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit:
   ```bash
   git commit -m "Add: short description of change"
   ```
3. Push and open a Pull Request.
4. At least one other officer/admin should review before merging to `main`.

---

## Handoff Notes for Future Officers

This project is meant to be maintained by whoever holds relevant officer positions each year. When transferring responsibility:
- Transfer GitHub repo ownership/collaborator access.
- Transfer Supabase project ownership (or add the new admin as an owner).
- Transfer Vercel project access.
- Update the admin account credentials.
- Update this README if the stack, structure, or workflow changes.

---

## License

Internal project of Cyb Robotics Organization, CICT, West Visayas State University. Not for external redistribution without organization approval.