# Static — Design Principles

**The website has to demonstrate, in its own structure, that it understands the nervous system it is describing.**

This guide is read by self-discovering autistic and AuDHD (autism + ADHD) adults. The
person reading it tends to want **deep focus on the content that grabs them**, but they
also need that content **organised, scannable, and escapable**. They will tap *in* to a
core idea in a few moves, and they need to zoom *out* again just as fast — without losing
their place or their working memory. These principles encode that.

---

## The reader we are building for

A monotropic, interest-led attention system. Limited and fast-depleting working memory.
A leaky sensory gate. A low tolerance for ambiguity, clutter, and surprise. High
intelligence, low patience for validation theatre. Often reading while already depleted.

Two pulls that look opposite but come from the same architecture:

- **Drill down** — when something is relevant, follow it all the way to the mechanism.
- **Zoom out** — the moment it isn't, escape cleanly, with one move, no penalty.

The site is designed around letting the reader do both, on their terms, at all times.

---

## The ten principles

### 1. Scannable surface, deep core
Every screen leads with a single plain-language truth and a grid of scannable cards.
Detail is never the first thing you see — it is always one tap underneath. You can read
the whole site at the surface and understand it; you can drill any single card to the
neurology and still understand it.

### 2. Few taps in, one tap out
Getting to the core of any idea is two or three taps. Getting back out is always **one** —
a persistent back affordance and a persistent route home, on every screen, in the same
place. No dead ends. No "where am I." The escape hatch is a fixed part of the furniture.

### 3. Progressive disclosure by default
Depth is collapsed until asked for. Mechanisms, sources, and long detail sit behind
expanders. The reader controls density. Nobody is forced to carry more than they came for.

### 4. Predictable, repeating structure
Every chapter uses the same shape. Every behaviour card uses the same shape. Every
strategy uses the same shape. You learn the pattern once and then never spend working
memory re-learning the interface. Sameness is an accommodation, not a limitation.

### 5. Non-linear, interest-led navigation
No forced sequence. The hub (the **Signal Board**) is a map of entry points, and every
page is a legitimate place to start. Follow the thread that has your attention; the cross-links
are there when you want to jump sideways. This respects monotropism instead of fighting it.

### 6. Low sensory load
A calm, dark, warm palette. Generous whitespace. No autoplay, no sound, no aggressive
motion, no surprise movement. Animation is subtle, brief, and optional — and fully removed
under `prefers-reduced-motion`. The interface should feel like the quiet room, not the mall.

### 7. Always show where you are and where you can go
Section labels, signal-type tags, and clear forward/back links reduce the working-memory
cost of orientation. The reader should never have to hold their location in their head.

### 8. Tools visualise — they never test or score
The interactive elements (the Capacity Cup, the Sensory Profile) make invisible load
*visible*. They produce no score, no label, no "severity," no diagnosis. They are mirrors,
not assessments. Nothing on the site grades the reader.

### 9. Direct language, no validation theatre
Mechanical, precise, whole-body. The voice explains *why*, then points to *what helps*.
It does not reassure for the sake of reassuring, and it does not pathologise. The respect
is in the accuracy.

### 10. Works depleted, works offline, works on a phone
Fast load, mobile-first, no backend, no tracking. It runs as a static site so it is robust
and private. Keyboard navigable and screen-reader friendly. It has to work for someone in
cognitive overload on a train with one bar of signal — that is the actual use case.

---

## How the principles map to the build

| Principle | Where you see it |
|---|---|
| Scannable surface, deep core | Signal Board → card grids → expandable mechanism sections |
| Few taps in, one tap out | Persistent back + home bar on every view; hash routing keeps history |
| Progressive disclosure | `<details>` expanders for mechanisms, key systems, sources |
| Predictable structure | Shared templates for chapters / behaviours / strategies |
| Non-linear navigation | Signal Board hub; cross-links; every route deep-linkable |
| Low sensory load | Dark warm palette, reduced-motion support, no autoplay |
| Orientation always visible | Signal-type tags, part labels, section headers |
| Tools visualise not test | Capacity Cup and Sensory Profile produce no scores |
| Direct language | Content taken verbatim from the manuscript's mechanical voice |
| Works depleted/offline/mobile | Static SPA, GitHub Pages, ~no dependencies, responsive |

---

*These principles govern every decision in the `/index.html` app. When a design choice is
unclear, the question is always: **does this feel calm enough for someone in burnout, and
can they still get to the core — and back out — without effort?***
