# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Modernization of the **Infinito** legacy HTML template into an Envato product on **Astro + Tailwind CSS + Alpine.js + GSAP 3**. The rebuild is under `rebuild/`. Legacy trees (`Final_Files/`, `working_dir/`, `Documentation/`) are read-only design references — do not modify them.

## Commands (all run from `rebuild/`)

```bash
cd rebuild
npm run dev        # Astro dev server → http://localhost:4321
npm run build      # Static build → rebuild/dist/
npm run preview    # Serve built output
```

No test suite exists. No linter is configured. Type-check via the build.

## Architecture

### Directory layout

```
rebuild/src/
  components/
    shell/      # Tier A — Nav, Footer, PageShell, LoadingScreen
    sections/   # Tier B — 15 home-page sections (Hero, About, Featured, …)
    atoms/      # Tier D — Button, GradientText, SectionTitle, Input, Textarea, etc.
  data/
    index.ts    # Single source of truth for all home-page copy + asset paths (typed)
  layouts/
    BaseLayout.astro  # <head>, fonts, animation boot, reduced-motion gate
  lib/
    animations.ts     # GSAP + ScrollTrigger primitives (data-attribute driven)
  pages/
    index.astro       # Home page route
    _smoke.astro      # Integration smoke-test route
  styles/
    global.css        # Design tokens as CSS custom props, Tailwind directives
    fonts.css         # @fontsource imports
```

### Data flow

All home-page content lives in `src/data/index.ts` as typed named exports (`hero`, `about`, `featured`, `services`, `portfolio`, `team`, `pricing`, `testimonials`, `logos`, `contact`, etc.). Section components import and render from this file only — no copy lives inside components. Buyers rebrand by editing `index.ts` alone.

### Animation system (`src/lib/animations.ts`)

Data-attribute driven — no class soup. Apply animations by adding `data-anim="<type>"` to elements:

| Attribute value | Effect |
|---|---|
| `slide-up` | Scroll-triggered slide + fade up |
| `fade-up` / `fade-in` | Scroll-triggered fade (with/without Y translate) |
| `rotate-in` | Scale + fade in on scroll |
| `parallax-bg` | Background element parallax (strength via `data-anim-strength`) |
| `parallax-y` | Element Y-scrub parallax |
| `odometer` | Count-up on scroll (`data-anim-end`, `data-anim-duration`) |
| `svg-draw` | Stroke-dash draw-in on scroll |
| `intro-up/down/fade` | One-shot entry animation (no scroll trigger) |

Entry point: `mount()` in `animations.ts` — called once in `BaseLayout.astro`. When `prefers-reduced-motion` is set, all `[data-anim]` elements are immediately revealed, no GSAP runs.

### Alpine.js usage

Component-local interactivity only (nav drawer, search overlay, video lightbox, portfolio filter, process carousel, pricing toggle). State is scoped with `x-data` per component; no global store.

### Tailwind gotchas

- **Custom `zIndex` scale:** `z-1`…`z-10` map to **100–1000**. Arbitrary values like `z-[55]` stack *below* `z-10`. Use `z-[60]+` or extend the scale for modals/overlays.
- **Custom breakpoints:** `xs` 480px, `sm` 768px, `nav` 856px (nav collapse), `md` 992px, `lg` 1200px, `xl` 1440px.
- **Design tokens:** accent gradient (`--accent-from`/`--accent-to`/`--accent-text`) and all easing curves live in `global.css` as CSS custom props; theme swapping via `[data-theme="..."]` on `<html>`.

### Forms

Contact and Subscribe submit to Formspree via `PUBLIC_FORMSPREE_ENDPOINT` env var (set in `rebuild/.env`). When unset, components render an inline buyer notice — no runtime error.

## Current phase

Phase 1A is complete (home page `/` fully built and bug-fix passed). Phase 1B is next:
- Cover/reveal CSS animations
- SVG draw-in for Featured numerals
- Swiper integration (replace Alpine carousels in Testimonials + ProcessCarousel)
- LightGallery v2 for Portfolio + VideoStrip
- Marquee for LogoCloud
- Inner pages (`about`, `contact`, `services-*`, `projects/*`, `blog`, `blog-post-*`, `404`)

Detailed backlog: `rebuild/docs/PHASE_1A_STATUS.md`. Full roadmap: `MODERNIZATION_PLAN.md`. Animation inventory: `ANIMATION_AUDIT.md`.
