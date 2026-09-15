// Verify every reading's citation against Crossref.
//
// The reading list was drafted from memory, DOIs included, which is the one
// place in this site where a plausible-looking mistake survives every check
// the build runs: a wrong DOI is well-formed, passes the link checker (which
// only walks internal links) and resolves to somebody else's paper. So the
// citations are checked against the registry instead of against my memory.
//
// This is deliberately NOT part of `pnpm check`. It needs the network, and a
// gate that fails when Crossref is slow is a gate people learn to skip. Run it
// with `pnpm verify:citations` when the reading list changes. The offline half
// of the contract -- that a reading declares an author, a year and a venue, and
// that any `url` is a doi.org link -- is asserted in `spec/course-contract.test.ts`.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const DIR = "src/content/readings";
const CSL = "application/vnd.citationstyles.csl+json";

/** Pull the scalar frontmatter keys we cite with. Nested keys are not used here. */
function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
    const pair = line.match(/^([a-z][\w-]*): (.*)$/i);
    if (pair) data[pair[1]] = pair[2].trim().replace(/^["']|["']$/g, "");
  }
  return data;
}

// Titles and venues are stored for reading, not for matching: em dashes stand
// in for the colons YAML would choke on, and publishers emit `&amp;`. Compare
// on letters and digits alone.
const fold = (value) =>
  String(value)
    .replace(/&amp;/g, "&")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const first = (value) => (Array.isArray(value) ? value[0] : value);

async function crossref(doi) {
  const url = `https://api.crossref.org/works/${doi}/transform/${CSL}`;
  const response = await fetch(url, {
    headers: { Accept: CSL, "User-Agent": "SLOP3908 citation check" },
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`Crossref said ${response.status}`);
  return response.json();
}

/** Compare one entry against the registry. Returns a list of disagreements. */
function compare(data, record) {
  const problems = [];
  const year = (record.issued?.["date-parts"] ?? [[]])[0][0];
  if (String(year) !== String(data.year)) {
    problems.push(`year: frontmatter ${data.year}, Crossref ${year}`);
  }

  const title = fold(first(record.title));
  if (fold(data.title) !== title) {
    problems.push(`title: frontmatter "${data.title}", Crossref "${first(record.title)}"`);
  }

  // The venue line carries volume, issue and pages too, so the journal name
  // has to be contained in it rather than equal to it.
  const venue = fold(first(record["container-title"]));
  if (venue && !fold(data.venue).includes(venue)) {
    problems.push(`venue: "${data.venue}" does not contain "${first(record["container-title"])}"`);
  }

  // Author lines are human-readable ("Allen, Kern, Rozek, McInerney & Slavich"),
  // so every surname the registry lists has to appear, in any form.
  const authors = fold(data.author);
  for (const author of record.author ?? []) {
    const family = fold(author.family ?? author.literal ?? "");
    if (family && !authors.includes(family)) {
      problems.push(`author: "${data.author}" is missing ${author.family ?? author.literal}`);
    }
  }
  return problems;
}

const files = (await readdir(DIR)).filter((name) => name.endsWith(".md")).sort();
let failures = 0;
let checked = 0;
const byHand = [];

for (const file of files) {
  const slug = file.replace(/\.md$/, "");
  const data = frontmatter(await readFile(join(DIR, file), "utf8"));
  const doi = data.url?.match(/^https:\/\/doi\.org\/(.+)$/)?.[1];

  if (!doi) {
    // Books and book chapters predate the DOI and have none. Nothing to check
    // against, so say so out loud rather than reporting a silent pass.
    byHand.push(`${slug} (${data.year}, ${data.venue})`);
    continue;
  }

  try {
    const problems = compare(data, await crossref(doi));
    checked += 1;
    if (problems.length === 0) {
      console.log(`  ok    ${slug}`);
    } else {
      failures += 1;
      console.log(`  WRONG ${slug}`);
      for (const problem of problems) console.log(`          ${problem}`);
    }
  } catch (error) {
    failures += 1;
    console.log(`  WRONG ${slug}: ${data.url} did not verify — ${error.message}`);
  }
}

console.log(`\nChecked ${checked} DOI(s) against Crossref — ${failures} disagreement(s).`);
if (byHand.length > 0) {
  console.log(`No DOI, so verify these against the book itself:`);
  for (const line of byHand) console.log(`  - ${line}`);
}
process.exit(failures > 0 ? 1 : 0);
