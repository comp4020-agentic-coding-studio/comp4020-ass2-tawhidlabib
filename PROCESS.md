# Process overview

## What I Created

SLOP3908, *Regulars: The Psychology of Third Places*, is a mix of lecture content and fieldwork against one argument: a third place
is not an amenity but a structural need in life, and the what makes a regular feel special is the same mechanism that keeps everyone else out. This course is designed to teach people about the psychological benefits of "Third Places" as it has been a particular interest of mine recently.

**Live:** https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-tawhidlabib/

## The decisions that mattered

### Narrowing the topic before writing content

Initially, the course was based on the topic of "Belonging" as I believed that was the core concept of "Third Places"; the course used passive learning about the psychological need. With Claude, I was able to brainstorm how to develop the course into a better niche with an interesting, active learning structure that I have not yet encountered in university.

The commit where I narrowed it down to third places:
([`03f207a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/03f207a)),
because a survey lets every week stand alone and I wanted weeks that argue with
each other; Oldenburg set in week 1 and disputed for eleven more.

### Encoding the rules a machine can hold

The agent's default output *is* a label-list — `Core Concept:` frontmatter
dressed as prose — and I only caught it by reading the lectures end to end.

I wrote the rules into `CLAUDE.md`, then gave three of them a test as well as a
sentence
([`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60)):
every week has a lecture and a Round, every week sets a reading, no reading is
orphaned. Motion is pinned to one gesture, never a static `opacity: 0` at rest
([`d9fd569`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d9fd569)).

Rules a test holds get held. The rest are prose a person has to read.

### A check that could not fail

Four navigation pages shipped with no `<h1>` while axe reported all fifty-two
clean, every time.

I read the worker, not its report: it returns `results.violations` and never
reads `results.incomplete`, and under jsdom a missing heading can only come
back incomplete. I added them, and a test that counts them
([`d2283c3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d2283c3)).

A check that cannot fail launders absence of evidence into evidence. I now ask
of a green check what would make it red.

### Contradictions that lived between pages

Ten claims disagreed across the site while every page stayed internally
consistent — the home page offered waiting rooms no Round visits.

I read across the files instead of through them one at a time, which is how
they were written
([`2ea4cb9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/2ea4cb9)).

Single-file review cannot see a contradiction that needs two files to exist.

### Trusting the sources, then checking them

A DOI can be well-formed, resolve, and still be the wrong paper.

`verify:citations` now checks every reading against Crossref instead of my
memory
([`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477)).
I swept the prose claims the same way and found two readings misstating their
own papers
([`b95d05b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b95d05b)).

Twelve claim-sets were right; being right twelve times is not evidence about
the thirteenth.

### Auditing the audit

A green suite is not proof, and neither is this document.

I mutation-tested the suite and five of its twelve assertions could not fail
([`a9b41d3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/a9b41d3)).
Then I turned it on this page: four of its claims were contradicted by the repo
([`bc3df86`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/bc3df86)).
The artwork was judged from rendered proofs, not the SVG that made it
([`b3ece25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b3ece25)),
and the prose pass was a full read, not a sample
([`ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed317e3)).

The last thing to audit is always the instrument you audited with.

## What I left out

No test can tell prose from slop, so "argue with the readings" stays a
`CLAUDE.md` rule a person reads. The ethics of observing strangers is a policy
page and a named excluded-sites list, not an assertion — a nervous 20-year-old
needs a sentence they can say out loud, not a green check.
