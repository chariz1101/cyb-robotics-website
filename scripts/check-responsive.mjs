/**
 * Checks the public pages for horizontal overflow at phone, tablet and
 * desktop widths, and that the mobile nav actually opens.
 *
 * Run: npm run check:responsive   (needs `npm run dev` already running)
 *
 * Pages that read from Supabase are skipped when the server returns an
 * error, so this is useful without credentials and covers everything once
 * they are present.
 */
import { chromium } from "playwright";

const BASE = process.env.CHECK_BASE_URL ?? "http://localhost:3000";
const PATHS = ["/", "/about", "/officers", "/alumni", "/projects", "/events", "/admin/login"];
const WIDTHS = [390, 768, 1400];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

let failed = false;
const skipped = [];

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });

  for (const path of PATHS) {
    const response = await page.goto(BASE + path, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    if (!response || response.status() >= 400) {
      if (width === WIDTHS[0]) skipped.push(`${path} (${response?.status()})`);
      continue;
    }
    await page.waitForTimeout(600);

    // An error boundary lays out fine at every width; measuring it would
    // report a pass for a page that never rendered.
    if (await page.locator("[data-page-error]").count()) {
      if (width === WIDTHS[0]) skipped.push(`${path} (error boundary)`);
      continue;
    }

    const { scrollWidth, culprits } = await page.evaluate((vw) => {
      const culprits = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.right > vw + 1 && r.width > 0) {
          culprits.push(
            `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 50)}"> right=${Math.round(r.right)}`,
          );
        }
      }
      return {
        scrollWidth: document.documentElement.scrollWidth,
        culprits: culprits.slice(0, 3),
      };
    }, width);

    const ok = scrollWidth <= width + 1;
    if (!ok) failed = true;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${String(width).padStart(4)}px  ${path}` +
        (ok ? "" : `  scrollWidth=${scrollWidth}\n        ${culprits.join("\n        ")}`),
    );
  }

  await page.close();
}

// The mobile nav is the one piece of the shell that only exists on phones.
const page = await browser.newPage({ viewport: { width: 390, height: 800 } });
await page.goto(BASE + "/about", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);

const toggle = page.locator('button[aria-label="Toggle navigation"]');
const menu = page.locator("#mobile-nav");

const checks = [
  ["hamburger is visible at 390px", await toggle.isVisible()],
  ["menu is closed initially", !(await menu.isVisible())],
];
await toggle.click();
await page.waitForTimeout(300);
checks.push(["menu opens on tap", await menu.isVisible()]);
checks.push(["menu lists every destination", (await menu.locator("a").count()) === 7]);

for (const [name, pass] of checks) {
  if (!pass) failed = true;
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);
}

await browser.close();

if (skipped.length) {
  console.log(`\nNOT CHECKED — these pages did not render: ${skipped.join(", ")}`);
}
process.exit(failed ? 1 : 0);
