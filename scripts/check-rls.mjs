/**
 * Proves the database rejects anonymous writes.
 *
 * Run: npm run check:rls
 *
 * Uses the anon key — the same key shipped to every browser — and tries
 * to insert, update and delete on every table. Each attempt MUST fail.
 * The members portal is protected by an unguessable URL rather than
 * authentication, so anyone can obtain this key; RLS is the only thing
 * standing between a visitor and the org's data.
 *
 * Reads are expected to succeed on public tables. That is by design and
 * documented in docs/schema.md §4.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
  process.exit(2);
}
if (process.env.SUPABASE_SERVICE_ROLE_KEY === key) {
  console.error("That is the service role key. This check needs the anon key.");
  process.exit(2);
}

const supabase = createClient(url, key);

/**
 * Prove the database is actually reachable before trusting any rejection.
 *
 * Without this the check is worse than useless: an unreachable host makes
 * every write fail with a network error, which is indistinguishable from
 * RLS refusing it, and the run reports a clean pass. Reads are public on
 * `members` by design, so a successful select is the right canary.
 */
const { error: reachError } = await supabase
  .from("members")
  .select("id")
  .limit(1);

if (reachError) {
  console.error(
    `Cannot reach the database, so a rejected write proves nothing:\n  ${reachError.message}`,
  );
  process.exit(2);
}
console.log("Database reachable — rejections below are real.\n");

/** A minimally valid row per table, so a rejection means RLS and not a constraint. */
const SAMPLES = {
  members: { full_name: "RLS probe" },
  officer_positions: { title: "RLS probe", display_order: 999 },
  events: { title: "RLS probe", event_date: "2030-01-01" },
  event_photos: { photo_url: "https://example.com/x.jpg" },
  projects: { title: "RLS probe" },
  project_steps: { step_number: 1, title: "RLS probe", instructions: "x" },
  project_files: { file_name: "x.ino", file_url: "https://example.com/x" },
  announcements: { title: "RLS probe", content: "x" },
  files: { file_name: "x.pdf", category: "other", file_url: "https://e.co/x" },
  admin_users: { email: "probe@example.com" },
};

let failed = false;
const report = (name, pass, detail) => {
  if (!pass) failed = true;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
};

for (const [table, sample] of Object.entries(SAMPLES)) {
  // INSERT — a success here means anyone can write to your database.
  const { data: inserted, error: insertError } = await supabase
    .from(table)
    .insert(sample)
    .select();

  if (!insertError && inserted?.length) {
    report(`${table}: anonymous INSERT rejected`, false, "ROW WAS CREATED");
    // Leave nothing behind, though a successful delete is itself a failure.
    await supabase.from(table).delete().eq("id", inserted[0].id);
  } else {
    report(`${table}: anonymous INSERT rejected`, true);
  }

  // UPDATE — target every row; RLS should match none.
  const { data: updated, error: updateError } = await supabase
    .from(table)
    .update(sample)
    .not("id", "is", null)
    .select();

  report(
    `${table}: anonymous UPDATE rejected`,
    Boolean(updateError) || (updated?.length ?? 0) === 0,
    updated?.length ? `${updated.length} ROW(S) CHANGED` : "",
  );

  // DELETE — same.
  const { data: deleted, error: deleteError } = await supabase
    .from(table)
    .delete()
    .not("id", "is", null)
    .select();

  report(
    `${table}: anonymous DELETE rejected`,
    Boolean(deleteError) || (deleted?.length ?? 0) === 0,
    deleted?.length ? `${deleted.length} ROW(S) DELETED` : "",
  );
}

// Storage: buckets are public-read, but uploads must require an admin.
const { error: uploadError } = await supabase.storage
  .from("avatars")
  .upload(`rls-probe-${Date.now()}.txt`, new Blob(["probe"]));
report("storage: anonymous upload rejected", Boolean(uploadError));

console.log(
  failed
    ? "\nA write succeeded without authentication. Re-apply the policies in supabase/migrations/0001_initial_schema.sql."
    : "\nEvery anonymous write was rejected.",
);
process.exit(failed ? 1 : 0);
