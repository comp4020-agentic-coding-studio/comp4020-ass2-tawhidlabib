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

interface CourseApi {
  course: { code: string; level: number; startDate: string; endDate: string };
  nodes: ApiNode[];
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
