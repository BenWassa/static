# Static

# Static is a practical guide for adults recognizing autistic patterns in themselves.

## The mobile site

A full, dependency-free mobile web app lives at the repository root (`index.html`). It
turns the manuscript and research into a calm, scannable, drill-down guide designed
specifically for autistic and AuDHD readers — deep focus on what grabs you, scannable
surfaces, and a one-tap escape back out at every step.

- **Read it locally:** open `index.html` directly, or run any static server from the repo
  root (e.g. `python3 -m http.server`) and visit the printed URL.
- **What's inside:** the six mechanics chapters, 25 behaviour→mechanism flip cards, 5
  differential comparisons, 15 worked scenarios, 34 filterable strategies, and two
  interactive tools (the Capacity Cup and the Sensory Profile radar).
- **Design rationale:** see [`PRINCIPLES.md`](PRINCIPLES.md) — the ten AuDHD-informed
  principles the build follows. They are also browsable in-app under *Principles*.

### How it's built
- Vanilla HTML/CSS/JS single-page app with a hash router — no framework, no build step at
  runtime, no backend, no tracking. Robust, private, fast on a phone in low signal.
- Content is generated from the existing markdown by `tools/build-data.mjs`, which writes
  `assets/site/data.js`. Re-run after editing the manuscript: `node tools/build-data.mjs`.

### Deploying to GitHub Pages
A workflow is included at `.github/workflows/pages.yml`. To go live:
1. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
2. Push to `main` (or run the workflow manually). The site deploys from the repo root.

`.nojekyll` is present so the static assets are served as-is.

## Purpose

Enable self-discovering adults to:
1. Understand the neurological reality of their experiences
2. Identify their specific manifestation patterns  
3. Deploy effective strategies for challenges they face

## Structure

**Part 1: Understanding the Machine** — Neurological mechanics explained simply
**Part 2: Reading Your Own Patterns** — Self-observation frameworks
**Part 3: Operating Manual** — Strategies by challenge type

## Status

🔬 Research phase complete (7 deep research runs)  
✍️ Manuscript in progress  
📅 Target completion: TBD

## Approach

- Biological accuracy without unnecessary complexity
- Concrete scenarios grounding every concept
- Direct language, no validation theater
- Reader agency in all applications

## Not Included

- Diagnostic tools or clinical pathways
- Childhood development guidance
- Medication/treatment advice
- Identity politics or philosophy debates

## License

[TBD - likely CC BY-NC-SA or similar]
