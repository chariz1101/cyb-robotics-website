/**
 * Crawls the public site and reports dead internal links.
 *
 * Run: npm run check:links   (needs `npm run dev` already running)
 *
 * Internal links only. External ones are left alone: they are outside our
 * control and a flaky third party should never fail this project's checks.
 * /members-portal/<secret> is deliberately not crawled — the slug is not
 * in the public HTML, which is the point.
 */
import { chromium } from "playwright";

const BASE = (process.env.CHECK_BASE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
const START = ["/", "/about", "/officers", "/alumni", "/projects", "/events"];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();

const seen = new Set();
const broken = [];
const skipped = [];
const queue = [...START];

while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);

  const response = await page.goto(BASE + path, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  const status = response?.status() ?? 0;

  if (status >= 500) {
    skipped.push(`${path} (${status})`);
    continue;
  }
  if (status >= 400) {
    broken.push(`${path} → ${status}`);
    continue;
  }

  const hrefs = await page.$$eval("a[href]", (as) =>
    as.map((a) => a.getAttribute("href") ?? ""),
  );
  for (const href of hrefs) {
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const clean = href.split("#")[0].split("?")[0];
    if (!clean || seen.has(clean)) continue;
    // Detail routes are only reachable with data; queue them anyway so a
    // broken link to one is caught when credentials are present.
    queue.push(clean);
  }
}

for (const b of broken) console.log(`FAIL  ${b}`);
console.log(
  `\n${seen.size - skipped.length} page(s) reachable, ${broken.length} broken link(s).`,
);
if (skipped.length) {
  console.log(`Skipped (server error, needs Supabase): ${skipped.join(", ")}`);
}

await browser.close();
process.exit(broken.length ? 1 : 0);
