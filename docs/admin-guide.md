# Admin Guide — Cyb Robotics Website

For officers. No coding required.

Everything on the public site and in the members portal is edited from the
admin dashboard at **`/admin`**. If something on the site is wrong or out of
date, it can be fixed here.

---

## Signing in

1. Go to `https://<your-domain>/admin`
2. Enter your email and password

**"That account is not registered as an administrator"** means you signed in
successfully but have no admin record. Ask whoever set up the site to run the
SQL in *Adding another admin* below.

Forgot your password? Ask an existing admin to send a reset from the Supabase
dashboard (Authentication → Users → your row → Send password recovery).

---

## Adding a member or officer

**Members → + Member**

| Field | Notes |
|---|---|
| Full name | Required |
| Officer position | Leave as "Not an officer" for general members |
| Is an officer | Turn on for executives, board members and the adviser |
| Year level / Course | Shown under their name |
| Photo | Upload straight from your phone or computer — it is resized automatically |
| Show on public site | Off means the record exists but nobody sees it |

Officers appear on the public **Officers** page in the order set by their
position. That order is fixed in the database, not here — see *Changing the
officer order*.

**Alumni are separate.** Use the **Alumni** section, not Members.

---

## Adding an event

**Events → + Event.** Title and date are required. Set *Show on public site*
when it's ready to be seen — leave it off to draft it.

To add photos afterwards, click **Photos →** on the event's row. Upload as
many as you like; *Display order* controls the sequence (lower first).

---

## Posting an announcement

**Announcements → + Announcement.**

- **Audience** decides where it shows: *Public site* on the home page,
  *Members portal* inside the portal, *Both* in both places.
- **Published** off keeps it as a draft.
- **Publish date** in the future keeps it hidden until then.

---

## Adding files to the members directory

**Files → + File.** Choose a category (letter, programme, branding,
documentation, other) and upload the file. Type and size are filled in
automatically. Link it to an event if it belongs to one.

These appear in the members portal directory, searchable and filterable.

---

## Writing a project guide

**Projects → + Project**

1. Fill in the title, description and difficulty.
2. Write the **parts list**, one component per line.
3. Turn on **Show as a members guide**. Turn on **Show on public projects
   page** as well if it should also appear publicly.
4. Save, then click **Steps →** on its row.
5. Add each step with a number, title and instructions. Upload a wiring
   diagram or photo per step if you have one.
6. Under *Sample code & downloads*, upload the `.ino` file. It appears in the
   guide with a copy button and a download link.

---

## Changing the officer order

The order officers appear in is stored in the `officer_positions` table, not
the dashboard. To change it, open the Supabase dashboard → SQL Editor:

```sql
update public.officer_positions
set display_order = 3
where title = 'Treasurer' and term_year = '2026-2027';
```

Lower numbers come first. The adviser is last by convention.

**At the start of a new academic year**, add a fresh set of positions with the
new `term_year` (copy the pattern in
`supabase/migrations/0005_officer_display_order.sql`), then reassign each
officer's position in the dashboard.

---

## Adding another admin

Two steps, both in the Supabase dashboard. Nothing in the app creates admins —
deliberately, so a compromised dashboard session cannot mint new ones.

1. **Authentication → Users → Add user → Create new user.** Enter their email
   and a password, and tick *Auto Confirm User*.
2. **SQL Editor**, with their email:

```sql
insert into public.admin_users (id, email, full_name, role)
select id, email, 'Their Name', 'admin'
from auth.users
where email = 'their.email@wvsu.edu.ph'
on conflict (id) do nothing;
```

Use `'super_admin'` instead of `'admin'` for whoever is taking over.

---

## If the members portal link leaks

The portal has no login. Its protection is that the URL is unguessable, so a
leaked link means anyone who has it can read the directory. To rotate it:

1. Generate a new slug — long and random:
   ```bash
   openssl rand -hex 16
   ```
2. In Vercel → your project → Settings → Environment Variables, change
   `MEMBERS_PAGE_SECRET_SLUG` to `/members-portal/<the new value>`.
3. Redeploy (Deployments → the latest → Redeploy). The old URL starts
   returning "not found" immediately.
4. Share the new link through official channels only.

Nothing in the database changes, and no content is lost.

**If the leaked files were sensitive**, rotating the slug is not enough on its
own — the files were public to anyone holding the anon key for as long as the
link was out. Consider making the buckets private and serving signed URLs;
`docs/schema.md` §4 explains the trade-off.

---

## What needs a developer

Most things don't. These do:

- Changing page layout, wording of fixed text (mission, vision, history), or
  the colour scheme
- Adding a new kind of content the dashboard doesn't cover
- Database schema changes

Everything else — members, officers, alumni, events, photos, announcements,
files, projects and guides — is editable here.
