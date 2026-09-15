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
- `src/layouts/PageLayout.astro` is the layout every page renders through, and
  site-wide styling belongs there, not copied between pages.
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
