// The checkable half of this deliverable's published spec.
//
// These read the production build (`dist/api/index.json` and the rendered
// pages), not the source, so they assert what the site actually ships. Content
// marked `published: false` is absent from that build on purpose --- a week you
// are still staging does not count towards the twelve.
//
// The spec lines a machine cannot judge --- whether the course is niche, whether
// the curriculum coheres, whether the prose has a voice rather than reading as
// slop, and whether it works at both marking viewports --- are not here. They
// are still the larger half of the mark.
import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface ApiEdge {
  from: string;
  to: string;
}

interface CourseApi {
  course: { code: string; level: number; startDate: string; endDate: string };
  nodes: ApiNode[];
  edges: ApiEdge[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

// The three digits this repo was provisioned with. No other course in the
// cohort has them, so they are fixed; only the leading level digit is mine.
const ALLOCATED_DIGITS = "908";
// ANU levels: 1--4 undergraduate, 6 and 8 postgraduate.
const LEVEL_DIGITS = "123468";
const TEACHING_WEEKS = 12;

const nodesOfType = (...types: string[]): ApiNode[] =>
  api.nodes.filter((node) => types.includes(node.type));

describe("the course record", () => {
  it("keeps the three digits this repo was allocated", () => {
    expect(api.course.code).toMatch(new RegExp(`^SLOP[${LEVEL_DIGITS}]${ALLOCATED_DIGITS}$`));
  });

  it("declares a level that agrees with the code's first digit", () => {
    expect(api.course.level).toBe(Number(api.course.code.at(4)));
  });
});

describe("the teaching calendar", () => {
  it(`runs across ${TEACHING_WEEKS} dated teaching weeks`, () => {
    const dated = nodesOfType("sessions", "lectures").filter((node) =>
      /^\d{4}-\d{2}-\d{2}/.test(String(node.meta?.date)),
    );
    const weeks = new Set(dated.map((node) => Number(node.meta?.week)));
    const missing = Array.from({ length: TEACHING_WEEKS }, (_, i) => i + 1).filter(
      (week) => !weeks.has(week),
    );
    expect(missing, `no dated session or lecture for week(s) ${missing.join(", ")}`).toEqual([]);
  });
});

// Edges are undirected in the graph but stored one way round in the API, and
// each edge is declared exactly once in frontmatter --- the lecture owns its
// reading edges, the assessment owns its week edges. So a neighbour lookup has
// to read both ends.
const neighbours = (id: string): string[] =>
  api.edges.flatMap((edge) =>
    edge.from === id ? [edge.to] : edge.to === id ? [edge.from] : [],
  );

const weekOf = (node: ApiNode): number => Number(node.meta?.week);

// The two checks below are course-design decisions rather than platform facts.
// Nothing in the starter requires a course to run a field visit every week or
// to set a reading for each one; this course does, and these fail if a later
// edit quietly drops one.
describe("the shape of a week", () => {
  it(`gives all ${TEACHING_WEEKS} weeks both a lecture and a Round`, () => {
    const lectureWeeks = new Set(nodesOfType("lectures").map(weekOf));
    const roundWeeks = new Set(nodesOfType("sessions").map(weekOf));
    const incomplete = Array.from({ length: TEACHING_WEEKS }, (_, i) => i + 1)
      .filter((week) => !lectureWeeks.has(week) || !roundWeeks.has(week))
      .map((week) => `week ${week}: ${lectureWeeks.has(week) ? "" : "no lecture"}${
        !lectureWeeks.has(week) && !roundWeeks.has(week) ? " and " : ""
      }${roundWeeks.has(week) ? "" : "no Round"}`);
    expect(incomplete, incomplete.join("; ")).toEqual([]);
  });
});

describe("the reading list", () => {
  it("sets at least one reading for every week", () => {
    const lectures = nodesOfType("lectures");
    expect(lectures.length, "no lectures in the build").toBe(TEACHING_WEEKS);
    const unread = lectures
      .filter((lecture) => !neighbours(lecture.id).some((id) => id.startsWith("readings/")))
      .map((lecture) => `week ${weekOf(lecture)}`);
    expect(unread, `no reading set for ${unread.join(", ")}`).toEqual([]);
  });

  it("leaves no reading unattached to a week", () => {
    const readings = nodesOfType("readings");
    expect(readings.length, "no readings in the build").toBeGreaterThan(0);
    const orphans = readings
      .filter((reading) => neighbours(reading.id).length === 0)
      .map((reading) => reading.id);
    expect(orphans, `nothing links ${orphans.join(", ")}`).toEqual([]);
  });

  // Whether a citation is *correct* is checked against Crossref by
  // `pnpm verify:citations`, which needs the network and so is not part of
  // `pnpm check`. This is what can be asserted offline and is not already
  // guaranteed elsewhere: the `readings` schema makes author, year and venue
  // required, so an assertion about those can never fail from source, but it
  // accepts any well-formed `url`. A DOI outlives a publisher's URL scheme,
  // and it is also what makes the Crossref check above possible at all.
  it("links every paper by DOI rather than by publisher URL", () => {
    const readings = nodesOfType("readings");
    expect(readings.length, "no readings in the build").toBeGreaterThan(0);
    const notDoi = readings
      .map((reading) => [reading.id, reading.meta?.url] as const)
      .filter(([, url]) => url !== undefined && !String(url).startsWith("https://doi.org/"))
      .map(([id, url]) => `${id} -> ${String(url)}`);
    expect(notDoi, `not a doi.org URL: ${notDoi.join(", ")}`).toEqual([]);
  });
});

describe("assessment", () => {
  it("adds up to 100%", () => {
    const weights = nodesOfType("assessments").map((node) => Number(node.meta?.weight));
    expect(weights.length, "no assessments in the build").toBeGreaterThan(0);
    for (const weight of weights) expect(Number.isFinite(weight)).toBe(true);
    expect(weights.reduce((total, weight) => total + weight, 0)).toBe(100);
  });
});

describe("slides", () => {
  it("has at least one lecture linking a deck that built", () => {
    const lecturePages = globSync("dist/lectures/*/index.html");
    expect(lecturePages.length, "no lecture pages in the build").toBeGreaterThan(0);

    const linked = lecturePages.flatMap((page) =>
      Array.from(readFileSync(page, "utf8").matchAll(/href="[^"]*\/decks\/([^"/]+)\/"/g)).map(
        (match) => match[1],
      ),
    );
    expect(linked.length, "no lecture page links a deck").toBeGreaterThan(0);

    for (const deck of new Set(linked)) {
      expect(
        existsSync(resolve(`dist/decks/${deck}/index.html`)),
        `a lecture links /decks/${deck}/ but no such deck built`,
      ).toBe(true);
    }
  });
});

/** Strip `@keyframes NAME { ... }` blocks, brace-matched, from minified CSS. */
function withoutKeyframes(css: string): string {
  let out = "";
  let i = 0;
  while (i < css.length) {
    const at = css.indexOf("@keyframes", i);
    if (at === -1) return out + css.slice(i);
    out += css.slice(i, at);
    const open = css.indexOf("{", at);
    if (open === -1) return out;
    let depth = 0;
    let j = open;
    for (; j < css.length; j += 1) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}" && (depth -= 1) === 0) break;
    }
    i = j + 1;
  }
  return out;
}

describe("the motion layer", () => {
  // `src/styles/register.css` reaches `.astro` pages through
  // `src/layouts/CourseLayout.astro` and MDX pages through
  // `src/layouts/PageLayout.astro`. A new page that imports the theme's
  // ContentLayout directly still builds, still passes every other check, and
  // silently loses the site's own styling. That is the mistake this asserts
  // against -- it is the reason the wrapper layout exists.
  const bundles = globSync("dist/_astro/*.css").map((path) => ({
    file: path.split("/").pop() as string,
    css: readFileSync(path, "utf8"),
  }));
  const motionBundles = bundles.filter((bundle) => bundle.css.includes("@keyframes reg-settle"));

  it("ships the site's own stylesheet", () => {
    expect(motionBundles.length, "no built CSS bundle defines the reg-settle keyframes").toBe(1);
  });

  it("reaches every page that renders through a layout", () => {
    const pages = globSync("dist/**/index.html");
    expect(pages.length, "no pages in the build").toBeGreaterThan(0);
    const names = motionBundles.map((bundle) => bundle.file);
    const missing = pages.filter((page) => {
      // Decks are astromotion's own layout with its own stylesheet, and have
      // no cards, no hero and no prose column to style.
      if (page.includes("/decks/")) return false;
      const html = readFileSync(page, "utf8");
      return !names.some((name) => html.includes(name));
    });
    expect(missing, `not styled by the site's stylesheet: ${missing.join(", ")}`).toEqual([]);
  });

  // Unlike its neighbours this one reads source, deliberately. Astro
  // concatenates the theme's stylesheets into the same bundle, and the theme
  // hides `.at-heading-anchor` at rest by design, so the rule can only ever
  // hold over the CSS this repo actually writes. That it *ships* is what the
  // two tests above are for.
  it("never hides content at rest waiting to be animated in", () => {
    // Every animation in this file runs *towards* the resting state, so the
    // resting state is the finished page. A static `opacity: 0` breaks that:
    // under reduced motion, or on a scroll-driven timeline the browser does
    // not support, the content is simply gone. Keyframes may start at 0.
    const source = readFileSync(resolve("src/styles/register.css"), "utf8");
    const rules = withoutKeyframes(source);
    const offenders = rules
      .split("\n")
      .map((line, index) => [index + 1, line] as const)
      .filter(([, line]) => /(^|[^-\w])opacity:\s*0\s*(;|$|})/.test(line));
    expect(
      offenders.map(([line, text]) => `line ${line}: ${text.trim()}`),
      "register.css sets opacity: 0 outside a @keyframes block",
    ).toEqual([]);
  });
});
