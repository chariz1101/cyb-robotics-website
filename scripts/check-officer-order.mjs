/**
 * Verifies groupOfficers() puts the roster in the org's published order.
 * Runs without a database: node scripts/check-officer-order.mjs
 */
import { groupOfficers } from "../src/lib/officers.ts";

const POSITIONS = [
  ["President", 1, "executive"],
  ["Secretary", 2, "executive"],
  ["Treasurer", 3, "executive"],
  ["Auditor", 4, "executive"],
  ["Vice President for Logistics", 5, "executive"],
  ["Vice President for Income-Generating Projects", 6, "executive"],
  ["Vice President for Research and Development", 7, "executive"],
  ["Vice President for Programs", 8, "executive"],
  ["Vice President for Public Relations", 9, "executive"],
  ["Board Member for Logistics", 10, "board"],
  ["Board Member for Income-Generating Projects", 11, "board"],
  ["Board Member for Research and Development", 12, "board"],
  ["Board Member for Programs", 13, "board"],
  ["Board Member for Public Relations", 14, "board"],
  ["Adviser", 15, "adviser"],
];

const ROSTER = [
  ["Clarence Anthony Bolivar", "President"],
  ["Elaijah Aman", "Secretary"],
  ["Marielle Louise Dorado", "Treasurer"],
  ["Gwen Tricia Cirujales", "Auditor"],
  ["Steven Ken Pontillas", "Vice President for Logistics"],
  ["Zyrus Canteras", "Vice President for Income-Generating Projects"],
  ["Fritz Marick Fernandez", "Vice President for Research and Development"],
  ["Samantha Galan", "Vice President for Programs"],
  ["Megan Maligad", "Vice President for Public Relations"],
  ["Lorin Sernicula", "Board Member for Logistics"],
  ["Oliver Ledesma", "Board Member for Logistics"],
  ["Carlos John Aristoki", "Board Member for Income-Generating Projects"],
  ["Angel Guelos", "Board Member for Income-Generating Projects"],
  ["Diosylle Auditor", "Board Member for Research and Development"],
  ["James Remegio", "Board Member for Research and Development"],
  ["Mary Anne Labiscase", "Board Member for Programs"],
  ["Sean Genona", "Board Member for Programs"],
  ["Rania Dwayne Bravo", "Board Member for Public Relations"],
  ["Mikhaela Cruz", "Board Member for Public Relations"],
  ["Engr. Lea M. Gabawa", "Adviser"],
];

const byTitle = new Map(
  POSITIONS.map(([title, display_order, role_group]) => [
    title,
    { id: title, title, display_order, role_group, term_year: "2026-2027", committee: null },
  ]),
);

// Shuffled, the way Postgres returns rows without an ORDER BY.
const rows = [...ROSTER]
  .map(([full_name, title]) => ({
    id: full_name,
    full_name,
    officer_positions: byTitle.get(title),
  }))
  .sort(() => Math.random() - 0.5);

const grouped = groupOfficers(rows);

const EXPECTED_EXEC = [
  "Clarence Anthony Bolivar",
  "Elaijah Aman",
  "Marielle Louise Dorado",
  "Gwen Tricia Cirujales",
  "Steven Ken Pontillas",
  "Zyrus Canteras",
  "Fritz Marick Fernandez",
  "Samantha Galan",
  "Megan Maligad",
];

const actualExec = grouped.executive.map((m) => m.full_name);
const actualBoard = grouped.board.map((m) => m.full_name);
const actualAdviser = grouped.adviser.map((m) => m.full_name);

let failed = false;
function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) {
    failed = true;
    console.log("   expected:", expected);
    console.log("   actual:  ", actual);
  }
}

check("President is first", actualExec[0], "Clarence Anthony Bolivar");
check("executive order matches the announcement", actualExec, EXPECTED_EXEC);
check(
  "board members are ordered by committee, paired",
  actualBoard,
  // Within a shared position, ties break alphabetically — roster order is
  // not stored anywhere, so alphabetical is the only stable choice.
  [
    "Lorin Sernicula",
    "Oliver Ledesma",
    "Angel Guelos",
    "Carlos John Aristoki",
    "Diosylle Auditor",
    "James Remegio",
    "Mary Anne Labiscase",
    "Sean Genona",
    "Mikhaela Cruz",
    "Rania Dwayne Bravo",
  ],
);
check("adviser is alone in her own block", actualAdviser, ["Engr. Lea M. Gabawa"]);

console.log("\nRendered page order:");
[...actualExec, ...actualBoard, ...actualAdviser].forEach((n, i) =>
  console.log(`  ${String(i + 1).padStart(2)}. ${n}`),
);

process.exit(failed ? 1 : 0);
