/**
 * Contrast audit of the design tokens themselves.
 *
 * Run: npm run check:contrast
 *
 * Needs no server and no database, so it covers the colour pairings used
 * on pages an automated browser pass cannot reach without credentials.
 * Thresholds are WCAG AA: 4.5:1 for body text, 3:1 for large text and UI
 * borders.
 */
const TOKENS = {
  brand: "#145C41",
  "brand-deep": "#0C3B2A",
  "brand-mid": "#5F9C82",
  "brand-soft": "#8FC4AA",
  "brand-pale": "#A8D3BD",
  "brand-tint": "#CFE6DA",
  "brand-wash": "#E4EDE7",
  canvas: "#F6F6F1",
  surface: "#FFFFFF",
  "surface-alt": "#F1F2EE",
  "surface-sunk": "#FAFAF7",
  ink: "#0B0D0C",
  "ink-body": "#31362F",
  "ink-soft": "#4A504B",
  muted: "#666C66",
  faint: "#6E746E",
  danger: "#A32020",
};

/** Foreground/background pairings the site actually renders. */
const PAIRS = [
  ["ink-body", "canvas", "body copy"],
  ["ink-body", "surface", "card copy"],
  ["ink-soft", "surface", "secondary card copy"],
  ["muted", "canvas", "captions"],
  ["muted", "surface", "metadata in cards"],
  ["muted", "surface-alt", "table headers"],
  ["faint", "surface", "timestamps, sizes"],
  ["faint", "surface-sunk", "table footers"],
  ["brand", "canvas", "links and eyebrows"],
  ["brand", "surface", "labels on cards"],
  ["brand", "surface-alt", "section rules"],
  ["danger", "surface", "errors and delete"],
  ["canvas", "brand-deep", "hero copy"],
  ["canvas", "brand", "solid green buttons"],
  ["canvas", "ink", "header and footer"],
  ["brand-soft", "brand-deep", "labels on deep green"],
  ["brand-soft", "ink", "initials on the officer card"],
  ["brand-mid", "ink", "footer meta"],
  ["brand-pale", "brand", "label on the event panel"],
  ["brand-tint", "brand", "meta on the event panel"],
  ["brand", "brand-wash", "member initial chips"],
];

function luminance(hex) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failed = false;
for (const [fg, bg, usage] of PAIRS) {
  const r = ratio(TOKENS[fg], TOKENS[bg]);
  const pass = r >= 4.5;
  if (!pass) failed = true;
  console.log(
    `${pass ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  ${fg} on ${bg}  — ${usage}`,
  );
}

console.log(
  failed
    ? "\nBelow 4.5:1 is unreadable for small text. Darken the foreground token."
    : "\nAll text pairings meet WCAG AA.",
);
process.exit(failed ? 1 : 0);
