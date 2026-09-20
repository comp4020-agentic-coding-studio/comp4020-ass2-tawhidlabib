# Process overview

## What I Created

SLOP3908, *Regulars: The Psychology of Third Places*, is a mix of lecture
content and fieldwork against one argument: a third place is not an amenity but
a structural need in life, and what makes a regular feel special is the same
mechanism that keeps everyone else out. This course is designed to teach people
about the psychological benefits of "Third Places" as it has been a particular
interest of mine recently.

**Live:** https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-tawhidlabib/

## The decisions that mattered

### Narrowing the topic before writing content

Initially, the course was based on the topic of "Belonging" as I believed that
was the core concept of "Third Places"; the course used passive learning about
the psychological need. With Claude, I was able to brainstorm how to develop the
course into a better niche with an interesting, active learning structure that I
have not yet encountered in university.

The commit where I narrowed it down to third places:
([`03f207a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/03f207a)),
because a survey lets every week stand alone and I wanted weeks that argue with
each other; Oldenburg set in week 1 and disputed for eleven more.

### Encoding the rules a machine can hold

The agent's default output is a label-list, `Core Concept:` frontmatter
dressed as prose which was only caught by reading the lectures end to end.

I wrote the rules into `CLAUDE.md` and gave three tests
([`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60)):
every week has a lecture and a Round, a reading, and no orphans. Motion is
pinned to one gesture
([`d9fd569`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d9fd569)).

Creating a well structured claude md file with strict instructions on the rules the course creation must follow allowed me to use six agents that all inherited the same `CLAUDE.md` and argued about one course instead of inventing six completely different versions.

### Contradictions that lived between pages

Ten claims disagreed across the site while every page stayed internally
consistent.

This project was my first time running numerous agents as a team. I used six agents, that held a different
job against the same rules. Contradictions were found from the agent creating 1 page at a time; 2 pages must be considered to avoid a contradiction and are created from only considering 1 at a time
([`2ea4cb9`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/2ea4cb9)).

Utilising all the agents running concurrently allowed the audit of the site to be done significantly quicker. All agents reporting back to one place ensured that all course contradictions were found as both halves of a contradiction ended up together.

### Trusting the sources, then checking them

A DOI can be well-formed, resolve, and still be the wrong paper.

`verify:citations` checks every reading against Crossref instead of my memory
([`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477)).
The lane auditing empirical claims hit the budget cap and died with its
findings, so I swept by hand and found two readings misstating their own papers
([`b95d05b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b95d05b)).

An agent's findings are gone when the agent is, unless they land in a file.

### Auditing the audit

Four navigation pages shipped with no `<h1>` while axe called all fifty-two
clean, and six lanes reported confidently on top.

I read the worker, not its report: it returns `results.violations` and never
`results.incomplete`, where a missing heading under jsdom can only land
([`d2283c3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d2283c3)).
I mutation-tested the suite the lanes had blessed: five of twelve assertions
could not fail
([`a9b41d3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/a9b41d3)).
The same pass on this page found four claims the repo contradicted
([`bc3df86`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/bc3df86));
artwork was judged from rendered proofs, not the SVG
([`b3ece25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b3ece25)),
and prose from a full read, not a sample
([`ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed317e3)).

A check that cannot fail launders absence of evidence into evidence. The agent team
was worth it for reach.
