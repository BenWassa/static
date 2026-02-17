# STATIC
## Full Website Commission Document
### Version 1.0

---

## PROJECT OVERVIEW

**Name:** Static
**Type:** Web guide — free, open access
**Primary audience:** Adults self-discovering autistic patterns
**Primary device:** Desktop first
**Distribution:** Public web, GitHub hosted or similar
**License:** Creative Commons (open access)

**Core purpose:**
Enable self-discovering adults to understand the neurological reality of their experience, identify their specific patterns, and deploy practical strategies — through a web experience that itself demonstrates understanding of its audience.

---

## DESIGN DIRECTION

### Aesthetic: Signal / Noise / Clarity

The name "Static" drives the visual language.

**Concept:** The experience of an unfiltered nervous system — too much signal, no gate. The design moves from static → clarity as the reader progresses through the guide. Arrival feels like noise. Understanding feels like signal resolving.

**Palette:**
- Primary: Near-black background (#0D0D0D) — not pure black, slightly warm
- Signal white: Off-white text (#F0EDE8) — warm, not clinical
- Static accent: A single electric color used sparingly — consider electric amber (#F5A623) or cold cyan (#00D4FF) — to be decided in Sprint 1
- Interference: Subtle grain/noise texture overlay on backgrounds
- Clarity moments: Clean white sections when content reaches resolution

**Typography:**
- Display / Headlines: Something with tension — condensed, slightly industrial
  Candidates: Bebas Neue, Barlow Condensed, DM Serif Display
- Body: Highly readable, warm — NOT Inter
  Candidates: Source Serif 4, Lora, Freight Text
- Monospace accent: For biological/mechanical labels — IBM Plex Mono or Fira Code
- Rationale: The pairing of serif body (human, warm) + condensed display (signal, sharp) + mono accents (scientific, precise) embodies the guide's voice

**Motion:**
- Scroll-triggered reveals — text resolves into clarity as you scroll
- Noise-to-signal transitions (grain dissolves when sections resolve)
- Nothing aggressive, nothing autoplaying with sound
- Subtle — the audience is sensory-sensitive. Motion serves clarity, not spectacle
- One signature animation: the capacity cup filling/draining

**Spatial composition:**
- Generous whitespace
- Left-heavy text columns with right-side annotation/label space
- Section breaks use full-bleed graphic moments
- Grid-breaking pull quotes and mechanism labels
- Desktop: wide viewport used architecturally, not just for wider paragraphs

---

## SITE ARCHITECTURE

```
STATIC/
├── / (Entry Experience — Scrollytelling)
│   ├── Opening question (4 doors)
│   ├── Narrative A: "I've been exhausted for years"
│   ├── Narrative B: "Something clicked recently"
│   ├── Narrative C: "I want to understand someone in my life"
│   ├── Narrative D: "I just received a diagnosis"
│   └── Convergence → Signal Board
│
├── /signal-board (Navigation Hub)
│
├── /part-1-the-machine/ (Understanding the Mechanics)
│   ├── /sensory-processing
│   ├── /social-processing
│   ├── /executive-function
│   ├── /emotional-processing
│   ├── /capacity-model          ← The Cup (interactive)
│   └── /masking-mechanics       ← Masking Cost (interactive)
│
├── /part-2-your-patterns/ (Self-Knowledge)
│   ├── /sensory-profile          ← Radar map (interactive)
│   ├── /triggers
│   ├── /warning-signs
│   └── /energy-accounting
│
├── /part-3-strategies/ (Operating Manual)
│   ├── /sensory-overwhelm
│   ├── /social-demands
│   ├── /executive-function
│   ├── /emotional-dysregulation
│   ├── /communication-breakdowns
│   └── /energy-burnout
│
├── /explore/ (Tools & Reference)
│   ├── /behavior-cards           ← Behavior → Mechanism flip cards
│   ├── /differential-explorer    ← Autism vs ADHD vs anxiety vs trauma
│   ├── /infographics             ← Standalone visual explanations
│   └── /strategy-library         ← Filterable strategy cards
│
└── /about
    ├── /approach                 ← Philosophy, what this is/isn't
    └── /sources                  ← Research references
```

---

## SPRINT PLAN

Each sprint = one shippable section.
Sprints are ordered by dependency and user journey.

---

### SPRINT 0: Foundation
**What:** Design system, component library, site skeleton
**Deliverables:**
- CSS custom properties (colors, typography, spacing, motion)
- Base layout components (page wrapper, section, column grid)
- Typography scale implemented
- Navigation component (minimal, persistent)
- Noise/grain texture system
- Scroll-trigger utility (Intersection Observer setup)
- Dark/light section switching
- Responsive breakpoints (desktop primary, tablet secondary)
- Empty page shells for all routes

**Dependencies:** None
**Blocks:** All other sprints
**Estimated complexity:** High — everything depends on this

---

### SPRINT 1: Entry Experience (Scrollytelling)
**What:** The landing experience — 4 narrative doors → convergence → Signal Board
**Deliverables:**
- Opening screen: project name, single orienting question, 4 door options
- 4 narrative paths (2-minute scroll reads each):
  - Narrative A: Day-in-life accumulation story
  - Narrative B: Recognition/discovery moment
  - Narrative C: Outside-in then inside-out perspective shift
  - Narrative D: Post-diagnosis gap story
- Scroll-triggered text reveals
- Ambient background state changes (calm → loaded → overflow → quiet)
- Convergence screen: "There are names for all of this"
- Transition into Signal Board

**Character approach:**
- No names. Second person ("you") throughout narratives A, B, D
- Third person for Narrative C (watching someone, then perspective flip)
- This removes the name problem entirely and increases identification

**Content:**
- ~200-300 words per narrative
- Spare, precise prose — not overwrought
- No clinical language in narratives — pure experience description
- Mechanism names introduced only at convergence point

**Dependencies:** Sprint 0
**Blocks:** Nothing — can be experienced as standalone
**Estimated complexity:** High — most complex UX in the project

---

### SPRINT 2: Signal Board
**What:** Navigation hub / conceptual map
**Deliverables:**
- Full-viewport dashboard layout
- 5 signal channels displayed architecturally:
  - SENSORY / PROCESSING / OUTPUT / LOAD / RECOVERY
- Each channel = entry point into relevant section
- Brief descriptor for each (one sentence)
- Visual state: calm, resolved — contrast to narrative chaos
- Secondary navigation: Parts 1, 2, 3 + Explore

**Design note:**
Signal Board should feel like arriving in a control room after chaos. Ordered. Readable. The visual relief is intentional.

**Dependencies:** Sprint 0
**Blocks:** Nothing critical
**Estimated complexity:** Medium

---

### SPRINT 3: Part 1 — The Machine (Content Pages)
**What:** The six core mechanics chapters
**Deliverables — per chapter:**
- Chapter header with signal-type label
- Lead explanation (Einstein-simple, 2-3 sentences)
- Behavior → Mechanism cards (3-5 per chapter)
- Biological detail section (expandable — progressive disclosure)
- Scenario illustrations (1-2 per chapter)
- Variability note (how this differs across people)
- Navigation: previous / next chapter + Signal Board

**Six chapters:**
1. Sensory Processing
2. Social Processing
3. Executive Function
4. Emotional Processing
5. The Capacity Model ← interactive cup lives here
6. Masking Mechanics ← masking cost interactive lives here

**Interactive: The Cup (Chapter 5)**
- Visual capacity cup
- User selects inputs from their day
- Cup fills visually
- Recovery inputs drain it
- No scoring — pure visualization
- Makes the accumulation model tangible

**Interactive: Masking Cost (Chapter 6)**
- Checklist of masking behaviors
- Each checked item adds visible weight
- Running "cognitive cost" visual accumulates
- No score — invisible labor made visible

**Dependencies:** Sprint 0, Cross-reference map data
**Blocks:** Part 2 (patterns reference mechanisms)
**Estimated complexity:** High — most content-heavy sprint

---

### SPRINT 4: Part 2 — Your Patterns
**What:** Self-observation frameworks
**Deliverables:**
- Sensory Profile Radar (interactive)
  - 8 axes: auditory, visual, tactile, olfactory, taste, proprioceptive, vestibular, interoceptive
  - Sliders per axis (hypo ← neutral → hyper)
  - Generates personal radar shape
  - No scoring, no labels like "severe"
  - Printable / saveable output
- Triggers page (observational framework, not checklist)
- Warning Signs page (how to read your early indicators)
- Energy Accounting page (drain vs. restoration framework)

**Design note:**
Part 2 pages are more spacious, more reflective in tone. Less mechanical, more personal. Typography shifts slightly warmer here.

**Dependencies:** Sprint 3 (references mechanisms)
**Blocks:** Nothing critical
**Estimated complexity:** Medium-High

---

### SPRINT 5: Part 3 — Strategies (Operating Manual)
**What:** The strategy library by challenge type
**Deliverables:**
- Six challenge-type sections:
  1. Sensory Overwhelm
  2. Social Demands
  3. Executive Function
  4. Emotional Dysregulation
  5. Communication Breakdowns
  6. Energy & Burnout

**Per section structure:**
- Challenge description (what this feels like)
- Three tiers per strategy:
  - Immediate (in the moment)
  - Preventive (structural design)
  - Recovery (when it goes wrong anyway)
- Strategy cards (expandable):
  - What it is
  - Why it works (one sentence mechanism)
  - How to implement (concrete steps)
  - Evidence level (strong / moderate / anecdotal)
- Cross-links to relevant Part 1 mechanisms

**Filterable Strategy Library (/explore/strategy-library):**
- Filter by: challenge type / timing / effort level
- Card grid layout
- Fast, utilitarian — this is a reference tool

**Dependencies:** Sprint 3, Sprint 4
**Blocks:** Nothing
**Estimated complexity:** Medium-High

---

### SPRINT 6: Explore Section
**What:** Tools, reference materials, interactive explorations
**Deliverables:**

**Behavior Cards (/explore/behavior-cards)**
- All 25 behavior cards
- Front: behavior name + observable pattern
- Flip: neurological mechanism (Einstein-simple)
- Organized by cluster (sensory / social / executive / emotional)
- Searchable

**Differential Explorer (/explore/differential-explorer)**
- Select a challenge
- Side-by-side comparison: autism vs ADHD vs anxiety vs trauma
- Mechanism-level distinctions
- "Can co-occur" notes
- No diagnosis implied — purely mechanistic comparison

**Infographic Library (/explore/infographics)**
- 6-8 standalone visual explainers:
  1. The Thalamocortical Gate
  2. The Autonomic Ladder (regulation → meltdown → shutdown)
  3. The Masking Budget
  4. The Capacity Model
  5. Sensory Processing Pathways
  6. The Emotional Processing Gap (alexithymia)
  7. The Double Empathy Problem
  8. Meltdown vs Shutdown Pathways
- Each: shareable, downloadable as image
- Designed for recognition + sharing

**Dependencies:** Sprint 3, Sprint 5
**Blocks:** Nothing
**Estimated complexity:** Medium

---

### SPRINT 7: About & Sources
**What:** Project context and research foundation
**Deliverables:**

**Approach page:**
- What Static is (and isn't)
- The philosophy: mechanical, direct, no validation theater
- What "pattern recognition" means vs. diagnosis
- The research foundation (7 deep research runs)
- No identity politics, no superpower framing

**Sources page:**
- Research references organized by domain
- Links to primary sources where available
- Transparent about evidence strength differences

**Dependencies:** All content sprints
**Blocks:** Nothing
**Estimated complexity:** Low

---

## TECHNICAL STACK

**Recommended:**
- **HTML/CSS/JS** — pure, no framework dependency
- Or **React** if component reuse becomes complex
- **GSAP** for scroll-triggered animations (ScrollTrigger plugin)
- **D3.js** for radar chart and cup visualization
- **CSS custom properties** throughout — no hardcoded values
- **Intersection Observer API** for scroll triggers (fallback if no GSAP)
- **No backend required** — fully static (appropriate for the name)
- **GitHub Pages or Netlify** for hosting

**Performance requirements:**
- Fast load — audience may be in cognitive overload
- No autoplaying media
- Reduced motion media query respected throughout
- High contrast mode supported
- Font loading strategy: system font fallbacks while custom loads

**Accessibility:**
- WCAG AA minimum
- Keyboard navigable
- Screen reader compatible
- Reduced motion: all animations disabled/simplified if prefers-reduced-motion

---

## CONTENT REQUIREMENTS PER SPRINT

### What needs to be written before each sprint:

| Sprint | Content Needed |
|--------|---------------|
| 0 | Design tokens only |
| 1 | 4 narratives (~250 words each), convergence text |
| 2 | Signal Board descriptors (5 × one sentence) |
| 3 | All Part 1 chapter text (from manuscript) |
| 4 | All Part 2 observational frameworks |
| 5 | All Part 3 strategy content |
| 6 | All behavior card text, differential comparisons, infographic copy |
| 7 | Approach statement, sources list |

---

## SPRINT EXECUTION NOTES

**Each sprint delivers:**
- Working HTML/CSS/JS (or React component)
- Fully styled to design system
- Responsive to tablet breakpoint
- Accessible
- Ready to integrate into full site

**Each sprint review asks:**
- Does this feel calm enough for someone in burnout?
- Is the content scannable and modular?
- Does progressive disclosure work (simple first, depth available)?
- Are cross-links between sections functional?
- Does it feel like Static — signal resolving from noise?

---

## WHAT WE DEFER

These are explicit deferrals — not cut, just later:

- Mobile optimization (post-desktop launch)
- Dark/light mode toggle (starts dark, light version later)
- Search functionality (post-launch enhancement)
- User accounts / saving personal profiles (privacy implications, deferred indefinitely)
- Translations (post-English launch)
- Audio guide version (post-launch)
- Print stylesheet (post-launch)
- Community/comments (explicitly excluded from scope)

---

## OPEN DECISIONS

Items requiring decision before relevant sprint begins:

| Decision | Needed By | Options |
|----------|-----------|---------|
| Accent color | Sprint 0 | Electric amber vs cold cyan vs other |
| Display font | Sprint 0 | Bebas Neue vs Barlow Condensed vs other |
| Body font | Sprint 0 | Source Serif 4 vs Lora vs other |
| Tech stack | Sprint 0 | Pure HTML/JS vs React |
| Narrative prose style | Sprint 1 | Who writes the 4 narratives |
| Infographic tool | Sprint 6 | Built in CSS/SVG vs designed externally |

---

## SUCCESS CRITERIA

**The website succeeds if:**
- A reader in burnout can navigate it without additional overload
- Every page makes sense as a standalone entry point
- The biology explanations feel clarifying, not overwhelming
- The interactive elements add understanding, not complexity
- A reader finishes with concrete tools they can use today
- The design itself communicates: "we understand your nervous system"

**The website fails if:**
- It's visually noisy or aggressive
- Pages require reading from the beginning to make sense
- Interactive elements feel like tests or diagnostics
- The content is so abstract it doesn't connect to daily life
- Loading performance degrades the experience

---

*Commission document v1.0*
*Project: Static*
*Next action: Sprint 0 — Design system and foundation*
