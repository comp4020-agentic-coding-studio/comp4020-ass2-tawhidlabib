# Process overview

<!-- TEMPLATE: scaffolding, not prose. Every `[ ... ]` below is a slot for you
     to write; the commit links are already correct and are there to be cited,
     moved or deleted. The reference ledger at the bottom of this file is the
     drawer you pull facts out of — it is an HTML comment, so it does not
     render on GitHub and does not count towards the word count.

     Delete this comment and the ledger last. `pnpm check:evidence` fails while
     the word TEMPLATE is still in this file, which is how you know you have
     not finished.

     THE BRIEF, in its own words, for what this file has to be:
       - 400–600 words, "your own account, written by you for a reader"
       - "Write it as one narrative: how directing this particular course
         changed what you asked the agent for and what you accepted back,
         rather than a run of fixes with a commit hash apiece."
       - "that narrative has a spine: what you decided a good university course
         looks like, which of those decisions you encoded in the harness — as a
         rule in CLAUDE.md or a check in spec/ — and which you deliberately
         left out."
       - "What lifts a PROCESS.md into the HD is the part no commit can supply
         on its own — why a call beat the obvious one, and how you knew the
         result was right before you accepted it."
       - Process is 45% of the mark. Corroboration is the floor of the band,
         not the top of it.

     The four `###` headings below are the spine, made visible so you can write
     into it. The brief asks for ONE NARRATIVE — so once the paragraphs exist,
     consider deleting the three `###` lines under "How I got here" and letting
     the paragraph order carry the spine on its own. That is a judgement call
     and it is yours. -->

## What I built

[60–80 words. The course, the site, and the one idea the course carries for
twelve weeks. Name the code and title (SLOP3908, *Regulars: The Psychology of
Third Places*), the shape (twelve Mondays of lecture, twelve Thursdays of
fieldwork, three assessments, fourteen readings), and the position the course
takes — not a summary of the topic but the claim it argues. State the live URL.
Do not explain the platform: the marker has the README.]

**Live:** https://tawhidlabib.github.io/comp4020-ass2-tawhidlabib/ <!-- CHECK
THIS. Pages serves from the org that owns the repo, so the real URL is
https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-tawhidlabib/
unless you fork it to your own account. `/ship` prints the one that is actually
live — paste that, do not guess. -->

## How I got here

### What I decided a good course looks like

[90–120 words. This is the part no commit can supply, so it goes first. What
did you conclude a good course *is*, and where did that conclusion come from?
Callingbullshit / How to Make (Almost) Anything / CS007 are in the brief and
are fair to cite, but the marker has read the brief — what they have not read
is which of those you rejected and why. The position that actually drove this
repo was: a course is one argument held for twelve weeks, the primary material
is the student's own observation rather than the reading list, and a page that
opens with a definition has got it backwards. Say whether that was your
position from the start or something you arrived at.

The strongest single fact available here: the course began as a twelve-week
survey of *belonging* and was narrowed to third places before any content was
written — [`03f207a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/03f207a).
A survey is the shape an agent produces by default. Say what the narrowing
cost and what it bought.]

### What I encoded in the harness

[150–200 words, and the heart of the file. A rule in `CLAUDE.md` or a check in
`spec/` — the brief names both, so cover both. Explain *why* each rule exists,
which means naming the failure it was written against. A rule with no failure
behind it reads as decoration.

The rules are in `CLAUDE.md` under "What this course has to hold to" —
[`7b522f3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/7b522f3) —
and the checks that hold three of them are
[`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60).
Two later rules came out of being caught: the citation registry
([`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477))
and the motion vocabulary
([`d9fd569`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d9fd569)).
The full inventory of rules and checks, and which commit each landed in, is in
the ledger at the bottom of this file. Pick the two or three that carry your
argument; citing all thirteen tests is the "run of fixes" the brief warns
against.]

### What I left out, and why

[70–100 words. The brief asks for this explicitly and it is the easiest section
to skip. A decision left out of the harness is a decision you judged
unmachinable, not one you forgot — say which, and say what holds it instead.
Candidates the repo actually contains: voice (no check can tell prose from
slop, so it is a `CLAUDE.md` rule read by a person); the ethics of observing
strangers (a policy page and a rule, no test); `verify:citations`, which is
deliberately outside `pnpm check` because it needs the network and a gate that
fails when an API is slow is a gate you learn to skip.]

### How I knew it was right before I accepted it

[90–120 words. The other half of the HD. Not "the checks passed" — *how you
knew the checks were worth passing.*

The concrete material: every new assertion was mutation-tested before it
landed, and two were deleted after mutation proved they could not fail
(recorded in [`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60)
and [`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477)).
The reading list was drafted from memory, every DOI in it was plausible, and
nine were checked against Crossref — a wrong DOI is well-formed, resolves, and
survives every gate in `pnpm check`. The artwork was judged from rendered
proofs, not source: the first pass had bottles floating off the counter
([`b3ece25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b3ece25),
[`9b1aaca`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/9b1aaca)).
And the prose was read end to end rather than sampled
([`ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed317e3)).
Pick the ones that make the point; leave the rest.]

<!-- OPTIONAL: a screenshot earns its place only where it carries the point
     better than a sentence does — a failing check beside its fix, the home
     page at 390×844. Commit the image and link it RELATIVELY or it will not
     render on GitHub: ![alt](docs/before.png). Images are free against the
     word count. Nothing checks that they render, so open this file on GitHub
     before you ship. -->

<!-- ═══════════════════════════════════════════════════════════════════════
     REFERENCE LEDGER — delete before shipping

     Everything below is fact, gathered from the repo. Nothing here is prose
     you should ship; it is the drawer you pull citations out of.

     Repo: comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib (PRIVATE
     until the cutoff; `/ship` flips it and enables Pages)
     Commit URL:  https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/<sha>
     Compare URL: https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/compare/<sha>...<sha>

     ── THE COMMITS, oldest first (current as of ed317e3) ──────────────────

     [`42d8c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/42d8c11) Initial commit — the provisioned starter, 58 files
     [`08743ab`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/08743ab) course code: SLOP1908 — the allocated three digits, level not yet chosen
     [`e9a0dd8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/e9a0dd8) harness: carry forward from crit-5 — CLAUDE.md +75/-9, before any course work
     [`f047abb`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/f047abb) spec: assert the checkable lines of the A2 spec — 5 tests, the calendar one RED
     [`03f207a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/03f207a) course: SLOP3908 Regulars — the narrowing from "belonging" to third places
     [`b3ece25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b3ece25) artwork: generate the four images, and a cast to go with them
     [`e2c795f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/e2c795f) readings: add the fifth collection, and the twelve papers
     [`7ee9ebf`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/7ee9ebf) weeks 1-4: the eight rules, the need, exclusion, the counter
     [`92117f0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/92117f0) weeks 5-8: the chair, weak ties, involuntary places, the collapse
     [`dc51162`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/dc51162) weeks 9-12: the guild hall, the server, what it costs, the proposal — calendar test RED→GREEN here
     [`04e2959`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/04e2959) assessment: field notes, the place audit, the proposal — 25/30/45
     [`ed5250f`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed5250f) policies: the ethics page a fieldwork course actually needs
     [`5234445`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/5234445) front matter: home page, collection indexes, and a real week 1 deck
     [`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60) spec: assert the course's own shape, not just the platform's — 3 tests, all mutation-tested
     [`7b522f3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/7b522f3) harness: the course-design rules, and how to check the artwork
     [`9b1aaca`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/9b1aaca) artwork: quantise the card to a 128-colour palette
     [`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477) readings: check the citations against Crossref — tools/verify-citations.mjs
     [`d9fd569`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d9fd569) motion: the second ink pass — and CourseLayout.astro, the missing door for site-wide CSS
     [`889d4fe`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/889d4fe) motion: leave the type alone on hover
     [`ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed317e3) prose: fix the five things the slop audit actually found

     Useful ranges:
       the twelve weeks, written:  [`7ee9ebf...dc51162`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/compare/7ee9ebf...dc51162)
       starter to shipped course:  [`42d8c11...ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/compare/42d8c11...ed317e3)

     To regenerate this ledger after more commits:
       git log --reverse --format='%h %s'

     ── CLAUDE.md: WHICH SECTION LANDED WHERE ──────────────────────────────

     e9a0dd8  carried forward from crit-5, before any course work:
                How to work in here · This repo is Astro, under a base path ·
                Red is not always wrong · The link-preview card · The checks ·
                This file is yours
     7b522f3  written for this course:
                What this course has to hold to  ← the 7 course-design rules
                Look at the generated artwork, not the code that generates it
     860c477  Citations get checked against the registry, not against my memory
     d9fd569  Motion is the second ink pass, and nothing else

     The seven course-design rules in "What this course has to hold to":
       1. Describe the place before theorising it
       2. Every week names its reading and says what the reading is FOR
       3. Argue with the readings
       4. No label-lists (no `Core Concept:` / `Key Text:`) — the tell of
          generated curriculum, and the brief penalises it directly
       5. Student-facing prose is second person and concrete
       6. Every Round brief gives a method, not just a destination
       7. Ethics are stated as rules with a list, never as principles
       + Name the boundary — the course's own position, so any page claiming a
         place keeps nobody out is wrong by the course's own argument
     Rules 1–3 and 5–7 are held by a person. Nothing checks them. That is the
     "left out" section's material.

     ── spec/: 13 TESTS IN 2 FILES ─────────────────────────────────────────

     data-integrity.test.ts  (shipped with the starter, 1 test)
       keeps every scheduled date inside the teaching period

     course-contract.test.ts (yours, 12 tests)
       f047abb — answering published A2 spec lines:
         keeps the three digits this repo was allocated
         declares a level that agrees with the code's first digit
         runs across 12 dated teaching weeks            ← started RED
         assessment adds up to 100%
         has at least one lecture linking a deck that built
       3819c60 — encoding course-design decisions, not spec lines:
         gives all 12 weeks both a lecture and a Round
         sets at least one reading for every week
         leaves no reading unattached to a week
       860c477:
         links every paper by DOI rather than by publisher URL
       d9fd569 — the motion layer:
         ships the site's own stylesheet
         reaches every page that renders through a layout
         never hides content at rest waiting to be animated in

     Every assertion reads the PRODUCTION BUILD, not source — with one
     deliberate exception, the last one, because Astro concatenates the theme's
     CSS into the same bundle and the theme hides `.at-heading-anchor` at rest
     by design. The exception is commented in the test.

     ── MUTATION TESTING: THE TWO DELETED ASSERTIONS ───────────────────────

     Every new assertion was mutation-tested before landing. Two were deleted
     after mutation proved they could not fail:
       · in 3819c60 — the calendar test passes if a week has a session OR a
         lecture, so deleting a Round left it green; confirmed by deleting one.
         That is why "both a lecture and a Round" is a separate test.
       · in 860c477 — an arm checking author/year/venue presence. Deleting
         `venue:` throws InvalidContentEntryDataError at content-sync, before
         vitest runs: the Zod schema already held it.
     Also found: unpublishing a Round without removing the reference never
     reaches the tests, because the build's dangling-ref check kills it first.
     The platform already holds that edge.

     ── THE OTHER SENSORS ──────────────────────────────────────────────────

     pnpm check            typecheck + production build + spec/
     pnpm build            axe on every page · base-path link check ·
                           dangling-ref check · deck compile · API emit ·
                           broken-link check
     pnpm check:evidence   the pre-ship gate (PROCESS.md, CLAUDE.md, artwork
                           hashes)
     pnpm verify:citations 9 DOIs against Crossref, 5 books named for hand
                           checking. DELIBERATELY OUTSIDE `pnpm check`: needs
                           the network, and a gate that fails when an API is
                           slow is a gate you learn to skip.
     pnpm artwork          regenerates the 4 images; ARTWORK_PROOFS=/tmp/... 
                           also emits PNG proofs, because judging SVG by
                           reading it does not work

     Current state: 52 pages · axe clean · 13 tests green · 44 API nodes,
     38 edges · 9 DOIs agreeing with Crossref.

     ── NUMBERS YOU MIGHT WANT ─────────────────────────────────────────────

     21 commits · 16,268 words of course prose · 12 lectures · 12 Rounds ·
     14 readings (9 with DOIs) · 3 assessments (25/30/45) · 2 staff ·
     1 deck (week 1, "The eight rules") · 52 built pages

     Em-dash density across the corpus: 7.9 per 1000 words. The slop lexicon
     (delve, leverage, landscape, tapestry, underscore, robust, nuanced,
     pivotal, foster, + ~50 more) returns nothing; no "not just X but Y"; no
     sentence opens Moreover / Furthermore / Additionally / Indeed / Ultimately.
     Cite this only if you want to claim the audit was mechanical as well as
     read — and note what it did NOT catch: seven reading titles punctuated
     with an em-dash where the published title uses a colon, which
     verify:citations folds away before comparing.

     ── BEFORE YOU SHIP ────────────────────────────────────────────────────

     1. Write the sections. Delete every `[ ... ]` slot.
     2. Word count, target 400–600:
          sed '/^<!--/,/-->$/d' PROCESS.md | wc -w
     3. Delete the TEMPLATE comment at the top and this whole ledger.
     4. pnpm check && pnpm check:evidence   (both must be green)
     5. Open PROCESS.md on GitHub and read it rendered. That page is what the
        marker sees.
     6. /ship — flips the repo public, enables Pages, confirms the live URL.
        Nothing is pushed yet; the repo is still private.
     ═══════════════════════════════════════════════════════════════════════ -->
