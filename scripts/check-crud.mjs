/**
 * End-to-end check: sign in, create a member, confirm it reaches the
 * public site, unpublish it, confirm it disappears, then delete it.
 *
 * Needs a running site with real Supabase credentials, so it is not part
 * of `npm run check`. Point it at a Vercel preview or a local dev server:
 *
 *   CHECK_BASE_URL=https://<preview>.vercel.app \
 *   ADMIN_EMAIL=you@wvsu.edu.ph ADMIN_PASSWORD=... \
 *   npm run check:crud
 *
 * The record is named with a timestamp and removed at the end, including
 * on failure, so a bad run does not leave test data on the live site.
 */
import { chromium } from "playwright";

const BASE = process.env.CHECK_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  process.exit(2);
}

const NAME = `ZZ Test Member ${new Date().toISOString().slice(11, 19)}`;
const results = [];
const record = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: 1400, height: 950 } });
let created = false;

try {
  // --- sign in ---
  await page.goto(`${BASE}/admin/login`, { waitUntil: "domcontentloaded" });
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((u) => !u.pathname.endsWith("/login"), { timeout: 20000 });
  record("signs in and reaches the dashboard", page.url().includes("/admin"));

  // --- create ---
  await page.goto(`${BASE}/admin/members`, { waitUntil: "domcontentloaded" });
  await page.click('button:has-text("+ Member")');
  await page.fill("#field-full_name", NAME);
  await page.fill("#field-year_level", "1st Year");
  // is_published defaults off in the form; turn it on.
  const published = page.locator("#field-is_published");
  if ((await published.getAttribute("aria-pressed")) === "false") {
    await published.click();
  }
  await page.click('button[type="submit"]:has-text("Save")');
  await page.waitForTimeout(2500);
  created = true;
  record("creates a member", await page.locator(`text=${NAME}`).first().isVisible());

  // --- appears publicly ---
  await page.goto(`${BASE}/officers`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  record(
    "new member appears on /officers",
    await page.locator(`text=${NAME}`).first().isVisible(),
  );

  // --- unpublish ---
  await page.goto(`${BASE}/admin/members`, { waitUntil: "domcontentloaded" });
  await page.click(`div:has-text("${NAME}") >> button:has-text("Edit") >> nth=0`);
  await page.locator("#field-is_published").click();
  await page.click('button[type="submit"]:has-text("Save")');
  await page.waitForTimeout(2500);

  await page.goto(`${BASE}/officers`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  record(
    "unpublished member disappears from /officers",
    (await page.locator(`text=${NAME}`).count()) === 0,
  );
} catch (error) {
  record("run completed without errors", false, String(error).slice(0, 120));
} finally {
  // --- always clean up ---
  if (created) {
    try {
      page.on("dialog", (d) => d.accept());
      await page.goto(`${BASE}/admin/members`, { waitUntil: "domcontentloaded" });
      await page.click(`div:has-text("${NAME}") >> button:has-text("Delete") >> nth=0`);
      await page.waitForTimeout(2500);
      record(
        "deletes the test member",
        (await page.locator(`text=${NAME}`).count()) === 0,
      );
    } catch (error) {
      record("deletes the test member", false, String(error).slice(0, 120));
      console.error(`\n  Remove "${NAME}" by hand — cleanup failed.`);
    }
  }
  await browser.close();
}

process.exit(results.some((r) => !r.pass) ? 1 : 0);
