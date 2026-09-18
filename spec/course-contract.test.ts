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

  // Mutation testing showed this one cannot fail: `slopCourseMetaSchema`'s
  // `superRefine` in src/course-config.ts rejects the mismatch before a build
  // exists, so there is no edit to the source that reaches here red. It stays
  // because the contract is about the *shipped* API, not the source that
  // generated it, and a future change to that pipeline could break the
  // agreement without touching the schema. It is not evidence of anything.
  it("declares a level that agrees with the code's first digit", () => {
    expect(api.course.level, `code ${api.course.code} against level ${api.course.level}`).toBe(
      Number(api.course.code.at(4)),
    );
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

  // The course commits in prose to Monday lectures and Thursday Rounds, on
  // every listing page and in the week 1 deck. Nothing checked it, and nothing
  // checked that a dated week actually falls inside the session either --- a
  // week silently outside the teaching period reads as invented rather than
  // scheduled, which is precisely what the brief penalises.
  it("lectures on Mondays and runs Rounds on Thursdays, inside the teaching period", () => {
    const WEEKDAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const wantedDay: Record<string, number> = { lectures: 1, sessions: 4 };
    const dated = nodesOfType("sessions", "lectures").filter((node) =>
      /^\d{4}-\d{2}-\d{2}/.test(String(node.meta?.date)),
    );
    expect(dated.length, "no dated lectures or Rounds in the build").toBe(TEACHING_WEEKS * 2);
    const wrong = dated.flatMap((node) => {
      const iso = String(node.meta?.date).slice(0, 10);
      const day = new Date(`${iso}T00:00:00Z`).getUTCDay();
      const problems: string[] = [];
      if (day !== wantedDay[node.type]) {
        problems.push(
          `${node.id} is dated ${iso}, a ${WEEKDAY[day]}, not a ${WEEKDAY[wantedDay[node.type]]}`,
        );
      }
      if (iso < api.course.startDate || iso > api.course.endDate) {
        problems.push(
          `${node.id} (${iso}) falls outside ${api.course.startDate}..${api.course.endDate}`,
        );
      }
      return problems;
    });
    expect(wrong, wrong.join("; ")).toEqual([]);
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
    expect(
      lectures.length,
      `expected ${TEACHING_WEEKS} lectures in the build, found ${lectures.length}`,
    ).toBe(TEACHING_WEEKS);
    const unread = lectures
      .filter((lecture) => !neighbours(lecture.id).some((id) => id.startsWith("readings/")))
      .map((lecture) => `week ${weekOf(lecture)}`);
    expect(unread, `no reading set for ${unread.join(", ")}`).toEqual([]);
  });

  it("leaves no reading unattached to a week", () => {
    const readings = nodesOfType("readings");
    expect(readings.length, "no readings in the build").toBeGreaterThan(0);
    // `neighbours().length === 0` counted *any* neighbour, so a reading
    // attached only to another reading passed a test called "unattached to a
    // week". Filter to the teaching nodes the name actually claims.
    const orphans = readings
      .filter(
        (reading) =>
          !neighbours(reading.id).some(
            (id) => id.startsWith("lectures/") || id.startsWith("sessions/"),
          ),
      )
      .map((reading) => reading.id);
    expect(orphans, `no week links ${orphans.join(", ")}`).toEqual([]);
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
    // `url !== undefined` meant deleting the DOI outright made this pass ---
    // and silently dropped that reading from `pnpm verify:citations`, which is
    // the worse outcome of the two. The five books legitimately have none, so
    // they are named here rather than exempted by accident.
    const BOOKS = new Set([
      "readings/allen-2020",
      "readings/bowlby-1982",
      "readings/oldenburg-1989",
      "readings/putnam-2000",
      "readings/tajfel-turner-1979",
    ]);
    const notDoi = readings
      .map((reading) => [reading.id, reading.meta?.url] as const)
      .filter(([id, url]) =>
        BOOKS.has(id) ? false : !String(url ?? "").startsWith("https://doi.org/"),
      )
      .map(([id, url]) => `${id} -> ${url === undefined ? "no url at all" : String(url)}`);
    expect(notDoi, `not a doi.org URL: ${notDoi.join(", ")}`).toEqual([]);
  });
});

describe("assessment", () => {
  it("adds up to 100%", () => {
    const weights = nodesOfType("assessments").map((node) => Number(node.meta?.weight));
    expect(weights.length, "no assessments in the build").toBeGreaterThan(0);
    for (const weight of weights) expect(Number.isFinite(weight)).toBe(true);
    const breakdown = nodesOfType("assessments")
      .map((node) => `${node.id} ${String(node.meta?.weight)}`)
      .join(" + ");
    expect(
      weights.reduce((total, weight) => total + weight, 0),
      `weights do not sum to 100: ${breakdown}`,
    ).toBe(100);
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

/**
 * Blank out `@keyframes NAME { ... }` bodies, brace-matched, replacing every
 * character with a space so that line numbers in the result still match the
 * original file. The previous version deleted the blocks outright, so it
 * reported line 190 for a rule that was on line 209.
 */
function maskKeyframes(css: string): string {
  const out = css.split("");
  let i = 0;
  for (;;) {
    const at = css.indexOf("@keyframes", i);
    if (at === -1) break;
    const open = css.indexOf("{", at);
    if (open === -1) break;
    let depth = 0;
    let j = open;
    for (; j < css.length; j += 1) {
      if (css[j] === "{") depth += 1;
      else if (css[j] === "}" && (depth -= 1) === 0) break;
    }
    for (let k = at; k <= Math.min(j, css.length - 1); k += 1) {
      if (out[k] !== "\n") out[k] = " ";
    }
    i = j + 1;
  }
  return out.join("");
}

describe("page structure", () => {
  // The theme's axe worker (node_modules/astro-theme-university/a11y-worker.mjs)
  // returns `results.violations` and reads `results.incomplete` nowhere. Under
  // its jsdom harness `page-has-heading-one`, `landmark-one-main` and
  // `color-contrast` come back *incomplete* on every page, healthy ones
  // included --- so "axe clean on all 52 pages" can never see a missing <h1>.
  // Four of the six nav destinations shipped without one: they each set
  // `heroTitle:` with no `heroImage:`, and BaseLayout.astro gates the Hero
  // (the only source of an <h1> on an MDX page) on both props at once.
  it("gives every page exactly one h1", () => {
    const pages = globSync("dist/**/index.html").filter((page) => !page.includes("/decks/"));
    expect(pages.length, "no pages in the build").toBeGreaterThan(0);
    const wrong = pages
      .map((page) => [page, (readFileSync(page, "utf8").match(/<h1[\s>]/g) ?? []).length] as const)
      .filter(([, count]) => count !== 1)
      .map(([page, count]) => `${page}: ${count}`);
    expect(wrong, `pages without exactly one <h1>: ${wrong.join(", ")}`).toEqual([]);
  });

  // `socialImage:` in src/site-config.ts can point at nothing and the build
  // stays green, axe stays clean and every other test here passes, while
  // og:image is dropped from every page in the site. Nothing rendered it.
  it("ships a link-preview image that is actually in the build", () => {
    const home = readFileSync(resolve("dist/index.html"), "utf8");
    const found = /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/.exec(home);
    expect(found, "no og:image meta tag on the home page").not.toBeNull();
    const url = found?.[1] ?? "";
    const withoutOrigin = url.replace(/^https?:\/\/[^/]+\//, "");
    // Locally the URL carries the derived Pages base path; strip it if the
    // first segment is not itself a directory in the build.
    const candidates = [withoutOrigin, withoutOrigin.replace(/^[^/]+\//, "")];
    expect(
      candidates.some((candidate) => existsSync(resolve("dist", candidate))),
      `og:image is ${url}, which is not a file in dist/ (tried ${candidates.join(", ")})`,
    ).toBe(true);
  });
});

describe("the motion layer", () => {
  // `src/styles/register.css` reaches `.astro` pages through
  // `src/layouts/CourseLayout.astro` and MDX pages through
  // `src/layouts/PageLayout.astro` (the MDX `defaultLayout`). A page that
  // imports the theme's ContentLayout directly still builds, still passes
  // every other check, and silently loses the site's own styling. That is the
  // mistake this asserts against.
  //
  // This used to be two tests: one counting bundles under `dist/_astro/` that
  // define the keyframes, and one asking whether each page's HTML named that
  // bundle. Mutation testing showed the verdict was a function of a byte
  // count rather than of the site. Astro's `build.inlineStylesheets: "auto"`
  // inlines any CSS chunk under Vite's 4096-byte `assetsInlineLimit` and emits
  // no file at all --- so pointing one page family away from the layout shrank
  // register.css's entry set, Rollup split it into a 3,064-byte chunk, Astro
  // inlined it, the glob found zero bundles, and the second test blamed all 51
  // pages when 14 had broken. Padding register.css to 4,680 bytes made both
  // tests pass with the defect fully present. So: follow the stylesheet from
  // each page, and count the pages, not the files.
  const reaches = (page: string): boolean => {
    const html = readFileSync(page, "utf8");
    if (html.includes("reg-settle")) return true; // inlined into a <style> tag
    for (const [, href] of html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) {
      const rel = href.replace(/^.*?(_astro\/)/, "$1");
      try {
        if (readFileSync(resolve("dist", rel), "utf8").includes("@keyframes reg-settle")) {
          return true;
        }
      } catch {
        // A stylesheet outside the build is not one that carries the motion
        // layer; the page still has to get it from somewhere else.
      }
    }
    return false;
  };

  it("reaches every page that renders through a layout", () => {
    // Decks are astromotion's own layout with its own stylesheet, and have no
    // cards, no hero and no prose column to style.
    const pages = globSync("dist/**/index.html").filter((page) => !page.includes("/decks/"));
    expect(pages.length, "no pages in the build").toBeGreaterThan(0);
    const missing = pages.filter((page) => !reaches(page));
    expect(missing, `not styled by the site's stylesheet: ${missing.join(", ")}`).toEqual([]);
  });

  // Unlike its neighbour this one reads source, deliberately. Astro
  // concatenates the theme's stylesheets into the same bundle, and the theme
  // hides `.at-heading-anchor` at rest by design, so the rule can only ever
  // hold over the CSS this repo actually writes.
  it("never hides content at rest waiting to be animated in", () => {
    // Every animation this site writes runs *towards* the resting state, so
    // the resting state is the finished page. A static `opacity: 0` breaks
    // that: under reduced motion, or on a timeline the browser does not
    // support, the content is simply gone. Keyframes may start at 0.
    //
    // It used to read register.css and nothing else, which left the rule
    // unenforced in the one other place this repo writes CSS --- the scoped
    // `<style>` block in src/pages/index.astro. It was also blind to
    // `opacity: 0.0` and to `visibility: hidden`, which fail identically.
    const sources: Array<readonly [string, string]> = [
      ["src/styles/register.css", readFileSync(resolve("src/styles/register.css"), "utf8")],
    ];
    for (const page of globSync("src/pages/**/*.{astro,mdx}")) {
      const markup = readFileSync(page, "utf8");
      for (const [, block] of markup.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        sources.push([page, block]);
      }
    }
    expect(sources.length, "no authored CSS found to check").toBeGreaterThan(1);

    const offenders: string[] = [];
    for (const [file, css] of sources) {
      maskKeyframes(css)
        .split("\n")
        .forEach((line, index) => {
          if (/(^|[^-\w])(opacity:\s*0(\.0+)?\s*(;|$|})|visibility:\s*hidden)/.test(line)) {
            offenders.push(`${file}:${index + 1}: ${line.trim()}`);
          }
        });
    }
    expect(
      offenders,
      "a static opacity: 0 or visibility: hidden hides content at rest",
    ).toEqual([]);
  });
});
