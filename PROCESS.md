# Process overview

SLOP3908, *Regulars: The Psychology of Third Places*, is twelve Mondays of
lecture and twelve Thursdays of fieldwork against one argument: a third place
is not a nice-to-have amenity but a structural need, and the exclusion that
makes a regular feel like a regular is the same mechanism that keeps everyone
else out. Fourteen readings, three assessments (field notes, a place audit, a
proposal), and no week reaches the theory from a definition.

**Live:** https://comp4020-agentic-coding-studio.github.io/comp4020-ass2-tawhidlabib/

The course began, honestly, as the shape an agent defaults to: a twelve-week
survey of "belonging," each week a different facet, no argument to hold onto.
I narrowed it to third places before writing a word of content
([`03f207a`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/03f207a))
because a survey lets every week stand alone, and I wanted weeks that argue
with each other — Oldenburg set in week 1 and disputed for eleven more. That
cost breadth: whole third-place literatures (libraries, community gardens) never
made the cut. It bought a course a student can actually hold in their head as
one claim instead of twelve.

The decisions that mattered went into `CLAUDE.md`, not just the readings.
"Describe the place before theorising it" and "no label-lists" are there
because the agent's default output *is* a label-list — `Core Concept:`
frontmatter dressed as prose — and I only caught it by reading the generated
lectures end to end, not by skimming. Three of those rules are held by a spec
test as well as a sentence
([`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60)):
every week has both a lecture and a Round, every week sets a reading, no
reading is orphaned. Two more rules came out of being caught rather than
anticipated: a DOI can be well-formed, resolve, and still be the wrong paper,
which is why `verify:citations` checks against Crossref instead of my memory
([`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477));
and the theme's own reveal-on-scroll defaults are the visual tell of generated
output, which is why motion is pinned to one gesture — transform and opacity
only, never a static `opacity: 0` at rest
([`d9fd569`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/d9fd569)).

What I left out was voice and ethics-in-practice: no test can tell prose from
slop, so "argue with the readings" stays a `CLAUDE.md` rule a person reads, not
an assertion. The ethics of observing strangers in a fieldwork course is a
policy page and a named excluded-sites list, not a principle a test could
enforce — a nervous 20-year-old needs a sentence they can say out loud, not a
green check.

I didn't take a green suite as proof. Every new assertion was mutation-tested
before landing, and two did not survive it —
the calendar test passed on a week missing its Round entirely, because it only
checked "session OR lecture," so I split it
([`3819c60`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/3819c60));
and a citation-completeness check I wrote by hand turned out redundant with the
content schema, which already throws before the test can even run
([`860c477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/860c477)).
The artwork was judged from rendered PNG proofs, not the SVG source that
generated it: the first pass had bottles floating off the counter, invisible
in the code and obvious in the image
([`b3ece25`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/b3ece25),
[`9b1aaca`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/9b1aaca)).
And the prose pass was a full read, not a sample — five specific slop tells
fixed by hand
([`ed317e3`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-tawhidlabib/commit/ed317e3)),
because a spot check would have missed exactly the sentence that gave the
whole thing away.

