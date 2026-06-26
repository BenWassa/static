---
name: Static
description: A calm, scannable, mobile-first reading experience for autistic and AuDHD self-discovery.
colors:
  deep-void: "#0d0d0d"
  warm-shadow: "#141311"
  dim-ember: "#1b1916"
  low-ash: "#242019"
  electric-amber: "#f5a623"
  amber-dim: "#b97d1c"
  amber-ink: "#1a1206"
  signal-cyan: "#6fc3d4"
  signal-dim: "#2c4a52"
  parchment: "#f0ede8"
  parchment-soft: "#c9c3b8"
  parchment-mute: "#908a7e"
  confirm-green: "#8fbf7f"
  caution-amber: "#e0a35a"
typography:
  display:
    fontFamily: "\"Barlow Condensed\", \"Arial Narrow\", system-ui, sans-serif"
    fontSize: "clamp(2.60rem, 1.90rem + 3.50vw, 4.40rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "0.01em"
  headline:
    fontFamily: "\"Barlow Condensed\", \"Arial Narrow\", system-ui, sans-serif"
    fontSize: "clamp(1.50rem, 1.30rem + 1.00vw, 2.05rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "0.01em"
  title:
    fontFamily: "\"Barlow Condensed\", \"Arial Narrow\", system-ui, sans-serif"
    fontSize: "clamp(1.20rem, 1.10rem + 0.50vw, 1.45rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "0.01em"
  body:
    fontFamily: "\"Source Serif 4\", Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(1.00rem, 0.96rem + 0.20vw, 1.10rem)"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "\"IBM Plex Mono\", ui-monospace, \"SF Mono\", Menlo, monospace"
    fontSize: "clamp(0.80rem, 0.77rem + 0.15vw, 0.88rem)"
    fontWeight: 400
    letterSpacing: "0.04em"
rounded:
  full: "999px"
  md: "14px"
  sm: "9px"
spacing:
  xs: "0.35rem"
  sm: "0.6rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.2rem"
  xxl: "3.2rem"
  xxxl: "4.5rem"
components:
  chip-default:
    backgroundColor: "transparent"
    textColor: "{colors.parchment-soft}"
    rounded: "{rounded.full}"
    padding: "0.45rem 0.8rem"
  chip-active:
    backgroundColor: "{colors.electric-amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.full}"
    padding: "0.45rem 0.8rem"
  btn-ghost:
    backgroundColor: "{colors.warm-shadow}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.full}"
    padding: "0.7rem 1.1rem"
  btn-accent:
    backgroundColor: "{colors.electric-amber}"
    textColor: "{colors.amber-ink}"
    rounded: "{rounded.full}"
    padding: "0.7rem 1.1rem"
  card-default:
    backgroundColor: "{colors.warm-shadow}"
    textColor: "{colors.parchment}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  tag-default:
    backgroundColor: "transparent"
    textColor: "{colors.parchment-soft}"
    rounded: "{rounded.full}"
    padding: "0.28rem 0.55rem"
  tag-accent:
    backgroundColor: "transparent"
    textColor: "{colors.electric-amber}"
    rounded: "{rounded.full}"
    padding: "0.28rem 0.55rem"
  tag-signal:
    backgroundColor: "transparent"
    textColor: "{colors.signal-cyan}"
    rounded: "{rounded.full}"
    padding: "0.28rem 0.55rem"
---

# Design System: Static

## 1. Overview

**Creative North Star: "The Field Manual"**

Static is designed as a document issued to someone who actually needs it. Not a consumer product designed for delight, not a clinical portal designed to manage patients. A field manual: stripped of decoration, dense with truth, portable enough to use while depleted. The interface is paper-dark rather than screen-black, warm-neutral rather than corporate grey. The typography shifts registers deliberately: condensed sans for wayfinding and structure, optical-size serif for reading, monospace for data and system labels. Each register has its role and does not bleed into the others.

The reading experience is designed around what the audience brings: limited working memory, a leaky sensory gate, interest-led attention, and a low tolerance for anything that wastes it. That means every element earns its presence or it is not there. There is no ambient decoration, no motion that was not asked for, no color used for its own sake. The electric amber accent is a signal, not a style choice. When it appears, it means something: a location, a state change, an affordance.

This system rejects the aesthetics of wellness apps (performed calm in pastels), the ADHD influencer register (loud neon, energetic microtype), clinical portals (healthcare-teal, patient hierarchy), and SaaS landing pages (hero metrics, gradient text, benefit bullets). It also refuses the Notion-public-page reflex: beige and Helvetica and database tables. Static is a reading experience, not a workspace.

**Key Characteristics:**
- Dark and warm, not dark and cold: backgrounds tinted brown-black toward amber, never blue-black
- Three-register typography with strict role separation: condensed sans, optical serif, monospace
- Single accent color carrying all navigational, state, and interactive meaning
- Tonal depth through background layering, never shadows
- Motion strictly gated behind `prefers-reduced-motion: no-preference`
- All interactive targets at minimum 44px touch target height

## 2. Colors: The Amber-Dark System

A near-monochrome dark system with a single electric accent and one navigational secondary. The warmth is structural: every neutral is tinted toward brown-amber, not blue.

### Primary
- **Electric Amber** (#f5a623): Used exclusively as the accent signal. Active tab states, kicker labels, list markers, arrow indicators, interactive affordances, selection highlight, focus rings. When this color appears, something is interactive, active, or worthy of attention. **Rarity is the point.**
- **Amber Dim** (#b97d1c): Subdued accent for hover borders on cards and doors; the `.chev` chevron in open disclosure panels. The amber vocabulary in a lower key.
- **Amber Ink** (#1a1206): Text color on amber backgrounds (`.btn--accent`, `.chip` active state, `::selection`). Near-black, warm-tinted.

### Secondary
- **Signal Cyan** (#6fc3d4): The mechanism and system tag color. Used for cognitive/neurological system labels that are distinct from navigational amber. Appears on `.tag--signal`, `.kicker--signal`, differential column headings, and the sensory profile slider track. It never competes with amber; it occupies a different semantic lane.
- **Signal Dim** (#2c4a52): Background tint behind cyan tags; toggle drain state highlight.

### Tertiary
- **Confirm Green** (#8fbf7f): Strong strategy evidence tags (`.tag--strong`). Appears only in strategy filtering as evidence-weight metadata.
- **Caution Amber** (#e0a35a): Moderate strategy evidence tags (`.tag--moderate`). Warm but distinct from the primary amber.

### Neutral
- **Deep Void** (#0d0d0d): Root background. Nearly black but warm-tinted, never pure black.
- **Warm Shadow** (#141311): Primary surface layer. Cards, nav bars. One step up from void.
- **Dim Ember** (#1b1916): Secondary surface. Flip card backs, active toggles.
- **Low Ash** (#242019): Tertiary surface. The deepest exposed layer.
- **Parchment** (#f0ede8): Primary text. Warm off-white; never pure white.
- **Parchment Soft** (#c9c3b8): Secondary text, prose body, subdued UI labels.
- **Parchment Mute** (#908a7e): Muted text, timestamps, empty states, icon marks at rest.

### Named Rules

**The Electric Signal Rule.** The amber accent is used on ≤10% of any given screen surface. It marks location, state, and affordance. It does not decorate. If you find yourself reaching for amber as a background fill for anything except a button or chip in active state, stop.

**The Warm-Dark Rule.** All backgrounds are tinted brown-amber, not blue-grey. The hexadecimal red channel is always higher than the blue channel in neutrals. `#0d0d0d` not `#0a0a0f`. This is not incidental; it is the system's warmth against the cold-screen reflex.

## 3. Typography: Three Registers, Three Purposes

**Display/Heading Font:** Barlow Condensed (with Arial Narrow, system-ui, sans-serif)
**Body Font:** Source Serif 4 (with Georgia, Times New Roman, serif; optical sizing enabled)
**Label/System Font:** IBM Plex Mono (with ui-monospace, SF Mono, Menlo, monospace)

**Character:** The condensed sans dominates structure and wayfinding; the optical serif carries meaning; the monospace handles system data, labels, and navigation buttons. The contrast between registers does more typographic work than weight or size alone. A kicker in uppercase monospace and a heading in bold condensed tell two entirely different stories even when they are the same size.

### Hierarchy

- **Display** (700, clamp(2.60rem–4.40rem), line-height 0.92): Hero titles only. The home screen's STATIC wordmark at near-viewport scale. Letter-spaced slightly (0.01em), uppercase, tight-leaded.
- **Headline** (600, clamp(1.50rem–2.05rem), line-height 1.04): Section and channel headings. Board channel titles. Barlow Condensed at h2 level.
- **Title** (600, clamp(1.20rem–1.45rem), line-height 1.04): Card titles, chapter titles, sub-section headings. The workhorse display size.
- **Body** (400, clamp(1.00rem–1.10rem), line-height 1.62): Source Serif 4. All prose content. Max line length 65ch via the `.view` max-width of 720px on mobile-first layout.
- **Label** (400, clamp(0.80rem–0.88rem), letter-spacing 0.04–0.18em, uppercase): IBM Plex Mono. Navigation tabs, kickers, tags, chips, disclosure summaries, pager labels, topbar buttons. Never used for body content.

### Named Rules

**The Register Rule.** Display font for structure. Serif for reading. Mono for system. A condensed sans heading inside a prose paragraph is a category error. A serif label on a chip is a category error. The three registers do not mix roles.

**The Kicker Rule.** Kickers (`.kicker`) appear above a heading in monospace uppercase at 0.18em letter-spacing. They identify content type (a chapter, a section, a signal category). They are never the first thing on a screen; they set context for what follows.

## 4. Elevation

Static uses tonal layering, not shadows. The system has four named background steps, each warmer and lighter than the last: `--bg` (void) → `--bg-1` (warm shadow) → `--bg-2` (dim ember) → `--bg-3` (low ash). Depth is expressed through this warmth ramp. A card on a void background reads as elevated because it is warmer, not because it casts a shadow.

Box shadows would add sensory load (edges, glow, rendered light sources) that contradicts the low-stimulus design intent. The backdrop-filter blur used on the topbar and tabbar is the only permitted depth mechanism beyond tonal layering, and it is used only on fixed navigation overlays.

### Named Rules

**The Tonal Layering Rule.** Depth is expressed by moving up the warmth ramp: void → warm shadow → dim ember → low ash. `box-shadow` is prohibited on all surfaces. If a surface needs to "lift", use the next background step.

**The Blur Exception Rule.** `backdrop-filter: blur()` is permitted only on the fixed topbar and tabbar, where it marks the boundary between navigation and content. It is never used decoratively on cards, modals, or content surfaces.

## 5. Components

### Navigation (Topbar + Tabbar)

The topbar is a three-column grid: back button (start) / current location label (center) / map button (end). A persistent, predictable escape route at all times. The location label uses display font uppercase. Both fixed bars use translucent background with blur (12px backdrop-filter) and a 1px border in `--line` to separate from content.

The tabbar is a 5-column fixed grid. Inactive tabs: monospace uppercase label + unicode glyph icon, `--ink-mute`. Active tab: `--accent` amber. No filled background, no pill indicator. The amber alone signals location.

- **Touch targets:** minimum 44px height on all interactive elements.
- **Small screen (<380px):** topbar button text labels are hidden; glyphs only.

### Cards

Cards (`.card`) are the primary navigable unit. Warm shadow background (`--bg-1`), 1px `--line` border, 14px radius. On hover: border shifts to `--accent-dim`. On active/press: scale(0.985). An arrow glyph in `--ink-mute` indicates navigation. Cards never nest inside cards.

The `.door` variant (home entry points) uses a flex layout with an amber numeral mark as a leading anchor, followed by heading and description. The `.channel` variant (signal board) adds a subtle vertical gradient (`--bg-1` to `--bg`) and a position-absolute count.

- **Shape:** Gently rounded (14px). Never sharp. Never fully circular.
- **Border:** 1px at 10% ink opacity at rest; 10–18% on active.
- **Never:** Side-stripe accent borders. Nested cards. Cards with identical height in a grid.

### Chips (Filter Controls)

Chips (`.chip`) are pill-shaped filter toggles. At rest: no background, `--line-2` border, `--ink-soft` text, monospace uppercase. When active (`aria-pressed="true"`): filled amber background, `--accent-ink` text. Press: scale(0.95). 36px minimum height. Used exclusively as content filters (strategies, explore).

### Tags (Metadata Labels)

Tags (`.tag`) are read-only metadata indicators. Smaller than chips (0.66rem vs 0.72rem), pill-shaped, uppercase monospace. Four variants:
- **Default:** ink border, soft text. Signal type, source labels.
- **Accent:** amber border, amber text. Highlighted or primary categories.
- **Signal:** cyan border, cyan text. Neurological system labels.
- **Evidence strength:** green (strong) or warn-amber (moderate) background tints. Strategy filtering only.

### Disclosure Panels (Progressive Disclosure)

`.disc` expanders handle all optional depth. A `<details>` element with a `<summary>` containing a label and a right-aligned chevron in amber. Closed: chevron points right. Open: chevron rotates 90 degrees (0.2s ease). The body padding is inset from the summary to create readable separation. Reduced-motion: rotation removed.

### Buttons

Two variants only:
- **Ghost (`.btn`):** `--bg-1` background, `--ink` text, `--line-2` border, full-pill radius (999px), monospace label. Touch target 44px min.
- **Accent (`.btn--accent`):** amber background, `--accent-ink` text, amber border. Same shape and size. Used for primary calls to action (reset, primary filter clear).
- **Active state (both):** scale(0.97). No color change.

### Flip Cards (Behaviour Mechanics)

The behavior card is a 3D flip component. Front face: `--bg-1`, standard card treatment. Back face: `--bg-2`, same radius, overflow scroll for long content. Flip: `rotateY(180deg)` at 0.5s ease. A small monospace hint ("tap to see mechanism") sits below the front content. Under `prefers-reduced-motion: reduce`, flip is instantaneous (transition: none).

### Signature Component: The Capacity Cup

A visual metaphor tool, not an assessment. A 180×240px vessel rendered in CSS: `--bg-1` background, `--line-2` border (no top), 26px bottom radius. A fill div animates height from 0–100%, colored amber; beyond 100% capacity, it transitions to a red-orange gradient. A percentage readout uses `mix-blend-mode: difference` to remain legible at all fill levels. Adjacent toggle list uses amber weight indicators for energy-drain items and cyan for energy-drain recoveries.

## 6. Do's and Don'ts

### Do:

- **Do** use the three typography registers for their assigned roles: Barlow Condensed for headings and structure, Source Serif 4 for all prose reading, IBM Plex Mono for labels, tags, navigation, and system data.
- **Do** express depth through background tonal layering (void → warm shadow → dim ember → low ash). Step up one level to elevate a surface.
- **Do** gate all animation behind `@media (prefers-reduced-motion: no-preference)`. View transitions, stagger animations, flip card rotations, and cup fill transitions must all be inside this block.
- **Do** maintain minimum 44px touch targets on every interactive element (buttons, chips, tabs, disclosure summaries, toggles).
- **Do** use the amber accent to signal location, state, and interactivity. Its presence always means something. Ration it to ≤10% of any screen surface.
- **Do** use amber (`--accent`) for navigational/state signaling and cyan (`--signal`) for neurological system/mechanism tagging. These semantic lanes do not cross.
- **Do** tint all neutrals toward warm brown-amber. The red channel must exceed the blue channel in every background and text value.
- **Do** use pill-radius (999px) for chips, tags, buttons, and cross-links; use card-radius (14px) for content containers.
- **Do** cap body text line length at 65ch (achieved by the 720px max-width container at mobile-first base).
- **Do** cite PRODUCT.md principles when a design decision is contested. "Does this feel calm enough for someone in burnout? Can they get to the core and back out without effort?" is the canonical test.

### Don't:

- **Don't** use box-shadows on any surface. Prohibited. If depth is needed, use the warmth ramp.
- **Don't** use `border-left` or `border-right` greater than 1px as a decorative accent stripe. The `.truth` block is the one sanctioned full-height left-border and it is a content element (pull quote), not a card decoration.
- **Don't** use `background-clip: text` with a gradient. All text is a single solid color.
- **Don't** add motion outside a `prefers-reduced-motion: no-preference` media query. This audience has real sensory sensitivity to unexpected motion.
- **Don't** design for wellness app aesthetics: no pastels, no round illustrations, no "calm" as a performed style rather than a structural quality.
- **Don't** reach for the ADHD influencer register: no neon, no energetic motion, no memes-as-content-format, no bold-typeface-yelling.
- **Don't** use clinical portal patterns: healthcare-teal palettes, patient-portal hierarchy, form-heavy grid layouts.
- **Don't** build SaaS landing page elements: hero metric panels, gradient text overlays, benefit bullet towers, CTA stacks, testimonial carousels.
- **Don't** use Notion-public-page aesthetic: beige backgrounds, Helvetica or Inter body text, database table layouts as primary UI.
- **Don't** use `#000000` or `#ffffff` anywhere. Black is `#0d0d0d` (warm-tinted). White is `#f0ede8` (parchment-warm).
- **Don't** nest cards inside cards. Ever.
- **Don't** reach for a modal as the first solution to any interaction problem. Disclosure panels (`<details>`), inline expand, or route navigation are all preferred.
- **Don't** add content or decoration that cannot answer: "does this serve someone reading this in cognitive overload?" If the answer is unclear, remove it.
