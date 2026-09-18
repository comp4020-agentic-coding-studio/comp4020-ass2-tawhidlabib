# COMP4020 course site

The platform under this repo is fixed and documented in `README.md` --- read it
there rather than restating it here. The
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or build.

This file is the harness: the rules I hold the agent to. It came forward from
`comp4020-crit5-tawhidlabib`.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
  It serves under the base path, so the address is `http://localhost:4321/<repo>/`
  --- bare `localhost:4321` is a 404.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## This repo is Astro, under a base path

The base path is **derived, never hardcoded** --- `scripts/pages-base.ts` reads
it from `GITHUB_REPOSITORY` in CI or the `origin` remote locally. Do not write a
literal `/comp4020-ass2-...` anywhere.

- Markdown links and the theme's components are rewritten for the base path
  automatically. A hand-written root-absolute link in an `.astro` file
  (`href="/sessions/"`) skips that handling and 404s on the live site --- the
  build's link checker catches it, so read the build output rather than trusting
  localhost.
- Site-wide styling belongs in a layout, never copied between pages. There are
  two layouts and which one applies is not obvious --- see "Site-wide CSS has
  exactly two doors" below before you add any.
- Commit `pnpm-lock.yaml` with any dependency change: CI installs with
  `--frozen-lockfile`.
- The collection key is the whole address: file, page, API path and `related:`
  ref all agree by construction, so renaming one means renaming all four.

## Red is not always wrong

"Never commit a red state" means the shipped checks and any test that was
passing. It does **not** mean this deliverable's own spec tests: those are
written before the site exists and are supposed to start red. Red-to-green
across the work is the record of the work. Never edit a spec test to make it
pass --- change the site.

## The link-preview card

The shared-link image comes from `socialImage:` in `src/site-config.ts` (1200x630),
with `socialImageAlt:` describing it; the theme turns it into `og:image` and
re-encodes it to JPEG. A page with its own artwork overrides the site-wide card
with a `socialImage:` frontmatter key. Both values ship as placeholders, and
`pnpm check:evidence` hashes the starter images and fails on them --- replace
them or delete them. Nothing checks whether the card *renders*, so look at the
deployed head.

## What this course has to hold to

These are course-design rules, not platform facts. `spec/course-contract.test.ts`
holds the three that a machine can check --- every week has a lecture and a
Round, every week sets a reading, no reading is orphaned. The rest are here
because they are the difference between a course and a set of pages.

- **Describe the place before theorising it.** No lecture opens on a
  definition --- that is the hard rule. Where the week has a room it opens on
  that room --- a counter, a chair, a laundromat --- and reaches the theory from
  there; where the week is a study or a number (Cyberball, the minimal groups,
  308,000 people) it opens on that instead, described as concretely as a room.
  The home page opens on a room. A page that opens with a definition has got it
  backwards, and so has a student's Place Audit.
- **Every week names its reading and says what the reading is *for*.** Not a
  citation in a list: a sentence about why this course sets this paper and what
  to take from it, which is deliberately not always what the paper is about.
- **Argue with the readings.** Oldenburg is set in week 1 and disputed for
  eleven weeks. A lecture that summarises its paper has wasted the week.
- **No label-lists.** No `Core Concept:` / `Key Text:` frontmatter-in-prose, no
  bulleted summaries standing in for an argument. That shape is the tell of
  generated curriculum, and the brief penalises it directly. Bullets are for
  instructions --- what to count, what to bring --- not for ideas.
- **Student-facing prose is second person and concrete.** "Sit where you can see
  the door" beats "students should position themselves advantageously".
- **Every Round brief gives a method, not just a destination.** Where, when, how
  long, what to fix in writing beforehand, and what has to be true by the end.
  The `spec:` key carries the last of those.
- **Ethics are stated as rules with a list, never as principles.** A named
  excluded-sites list, a sentence a student can say out loud if challenged. A
  principle a nervous 20-year-old cannot apply in a doorway is not a policy.
- **Name the boundary.** The course's own position is that belonging and
  exclusion are one mechanism, so any page claiming a place keeps nobody out is
  wrong by the course's own argument.

## Motion is the second ink pass, and nothing else

Every animation on this site is one gesture: a second ink drum landing out of
register and sliding into it. That is the medium the artwork is already in, so
it is the only motion vocabulary the site gets. No scroll-triggered fade-ups,
no easing that overshoots, nothing that moves without a reason in the print
metaphor --- generic reveal-on-scroll is the visual tell of generated output and
the brief penalises it.

Two rules in `src/styles/register.css`, both load-bearing:

- **The resting state is the finished page.** Animations only ever run
  *towards* it, so a static `opacity: 0` is banned --- with reduced motion, or
  in a browser missing whatever timeline the animation wanted, the content
  would simply be gone. `spec/course-contract.test.ts` asserts this against the
  source, because the theme's own CSS is bundled into the same file and does
  hide `.at-heading-anchor` at rest by design.
- **Transform and opacity only**, so motion can never shift layout.

Site-wide CSS has exactly two doors: `src/layouts/CourseLayout.astro` for
`.astro` pages and `src/layouts/PageLayout.astro` (wired as the MDX
`defaultLayout` in `astro.config.ts`, which is why nothing appears to import
it) for everything else. A new page that reaches for the theme's
`ContentLayout` directly builds clean, passes every other check, and silently
loses the site's styling --- so a spec test asserts every built page links the
stylesheet. Use `CourseLayout`, never the theme's layout directly.

## Citations get checked against the registry, not against my memory

The reading list was drafted from memory and every DOI in it was plausible. A
wrong DOI is the one mistake on this site that survives everything `pnpm check`
runs: it is well-formed, the link checker only walks internal links, and it
resolves --- to somebody else's paper. `pnpm verify:citations` compares each
reading's author, year, venue and title against Crossref. It stays out of `pnpm
check` on purpose: it needs the network, and a gate that fails when an API is
slow is a gate you learn to skip. Run it whenever the reading list changes. The
five books have no DOI, so it names them for checking by hand instead of
reporting a silent pass.

## Look at the generated artwork, not the code that generates it

`pnpm artwork` rebuilds the four images from `tools/make-artwork.mjs`. Set
`ARTWORK_PROOFS=/tmp/art-proofs` to also emit small PNG proofs, because avif and
a 2560px hero are both awkward to open and judging SVG by reading it does not
work. The first pass had bottles floating off the counter and a head detached
from its shoulders; neither was visible in the source and both were obvious in
the proof.

## The checks

`pnpm check` is types, the production build and the `spec/` suite; `pnpm build`
is itself several checks (axe, base-path links, dangling refs, decks, the API).
`pnpm check:evidence` is the extra gate before shipping. Read the failure before
changing anything.

`spec/README.md`, `PROCESS.md` and `reflections/README.md` say what they are for.

## This file is yours

A starting point, not a rulebook: what I add to it is the harness, and the
harness is assessed. This file and the sensors wired into `check` carry across
the course --- both come with me into the next repo. The prototype doesn't:
source, and the tests answering this deliverable's published spec, stay behind.

As I learn what this site needs --- a convention the work has to hold to, a
sensor that keeps catching me out, a fact about the stack that is easy to get
wrong --- write it down here and wire it into `check`. Growing this file is the
work.
