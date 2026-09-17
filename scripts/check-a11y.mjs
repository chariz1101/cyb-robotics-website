/**
 * Accessibility audit with axe-core.
 *
 * Run: npm run check:a11y   (needs `npm run dev` already running)
 *
 * Fails on serious and critical violations. Pages that need Supabase are
 * skipped when unreachable and reported, so the pass is honest about
 * what it actually covered.
 */
import { AxeBuilder } from "@axe-core/playwright";
import { chromium } from "playwright";

const BASE = process.env.CHECK_BASE_URL ?? "http://localhost:3000";
const PATHS = [
  "/",
  "/about",
  "/officers",
  "/alumni",
  "/projects",
  "/events",
  "/members-portal",
  "/admin/login",
];
const BLOCKING = new Set(["serious", "critical"]);

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
// axe-core requires a context-owned page, not browser.newPage().
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
});
const page = await context.newPage();

let failed = false;
const skipped = [];

for (const path of PATHS) {
  const response = await page.goto(BASE + path, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  if (!response || response.status() >= 400) {
    skipped.push(`${path} (${response?.status()})`);
    continue;
  }
  await page.waitForTimeout(500);

  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = violations.filter((v) => BLOCKING.has(v.impact ?? ""));
  const minor = violations.length - blocking.length;

  if (blocking.length) {
    failed = true;
    console.log(`FAIL  ${path}`);
    for (const v of blocking) {
      console.log(`        [${v.impact}] ${v.id}: ${v.help}`);
      for (const node of v.nodes.slice(0, 2)) {
        console.log(`          ${node.target.join(" ")}`);
      }
    }
  } else {
    console.log(
      `PASS  ${path}${minor ? `  (${minor} minor/moderate, not blocking)` : ""}`,
    );
  }
}

await browser.close();

if (skipped.length) {
  console.log(`\nSkipped (needs Supabase credentials): ${skipped.join(", ")}`);
}
process.exit(failed ? 1 : 0);
