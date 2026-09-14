/**
 * Exercises the real resizeImage() in a browser.
 *
 * Run: node scripts/check-image-resize.mjs
 *
 * src/lib/image.ts is bundled and injected into a blank page, so this
 * tests the shipped function rather than a reimplementation of it.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";
import { chromium } from "playwright";

const OUT = "/tmp/cyb-image-bundle.js";

execFileSync("npx", [
  "esbuild",
  "src/lib/image.ts",
  "--bundle",
  "--format=iife",
  "--global-name=CybImage",
  `--outfile=${OUT}`,
  "--log-level=error",
]);

const bundle = readFileSync(OUT, "utf8");

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});
const page = await browser.newPage();
await page.goto("about:blank");
await page.addScriptTag({ content: bundle });

const results = await page.evaluate(async () => {
  const { resizeImage, MAX_IMAGE_EDGE } = window.CybImage;

  // Build a real image file of a given size, with noise so it does not
  // compress to almost nothing and mask a size regression.
  async function makeImage(w, h, type = "image/png") {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(w, h);
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = Math.random() * 255;
      img.data[i + 1] = Math.random() * 255;
      img.data[i + 2] = Math.random() * 255;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const blob = await new Promise((r) => c.toBlob(r, type));
    return new File([blob], "photo." + type.split("/")[1], { type });
  }

  async function dimensions(blob) {
    const bmp = await createImageBitmap(blob);
    const out = { w: bmp.width, h: bmp.height };
    bmp.close();
    return out;
  }

  const out = [];

  // A phone-sized photo must be scaled down, aspect ratio intact.
  const big = await makeImage(4000, 3000);
  const resized = await resizeImage(big);
  const dim = await dimensions(resized);
  out.push({
    name: "4000x3000 is capped at MAX_IMAGE_EDGE",
    pass: Math.max(dim.w, dim.h) === MAX_IMAGE_EDGE,
    detail: `${dim.w}x${dim.h}`,
  });
  out.push({
    name: "aspect ratio preserved (4:3)",
    pass: Math.abs(dim.w / dim.h - 4 / 3) < 0.01,
    detail: (dim.w / dim.h).toFixed(3),
  });
  out.push({
    name: "resized file is smaller than the original",
    pass: resized.size < big.size,
    detail: `${Math.round(big.size / 1024)}KB -> ${Math.round(resized.size / 1024)}KB`,
  });
  out.push({
    name: "resized output is JPEG",
    pass: resized.type === "image/jpeg",
    detail: resized.type,
  });

  // A portrait photo must cap on its long edge, not its width.
  const tall = await makeImage(1200, 3600);
  const tallOut = await dimensions(await resizeImage(tall));
  out.push({
    name: "portrait caps on the long edge",
    pass: tallOut.h === MAX_IMAGE_EDGE && tallOut.w < tallOut.h,
    detail: `${tallOut.w}x${tallOut.h}`,
  });

  // An already-small image must pass through untouched.
  const small = await makeImage(400, 300);
  const smallOut = await resizeImage(small);
  out.push({
    name: "small image returned unchanged",
    pass: smallOut === small,
    detail: smallOut === small ? "same File" : "re-encoded",
  });

  // A non-image must never be run through the canvas.
  const pdf = new File([new Uint8Array([1, 2, 3])], "letter.pdf", {
    type: "application/pdf",
  });
  const pdfOut = await resizeImage(pdf);
  out.push({
    name: "non-image passes through untouched",
    pass: pdfOut === pdf,
    detail: pdfOut.type,
  });

  return out;
});

await browser.close();
rmSync(OUT, { force: true });

let failed = false;
for (const r of results) {
  if (!r.pass) failed = true;
  console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}  (${r.detail})`);
}
process.exit(failed ? 1 : 0);
