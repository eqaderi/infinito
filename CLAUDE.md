# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Modernization of the **Infinito** legacy HTML template into an Envato product on **Astro + Tailwind CSS + Alpine.js + GSAP 3**. The rebuild is under `rebuild/`. Legacy trees (`Final_Files/`, `working_dir/`, `Documentation/`) are read-only design references — do not modify them.

**Rebuild methodology (non-negotiable):** every feature/function/visual is rebuilt **behavior-first and implementation-blind** — never ported. Understand what the legacy does → evaluate whether it's worth keeping → pin the behavior as a test contract (implementation-agnostic) → close the legacy source → rebuild from scratch with modern, minimal code → verify against the contract. Treat the legacy as a spec of behavior and visuals, never a source of code. Full loop in [`REBUILD_METHODOLOGY.md`](REBUILD_METHODOLOGY.md).

## Commands (all run from `rebuild/`)

```bash
cd rebuild
npm run dev        # Astro dev server → http://localhost:4321
npm run build      # Static build → rebuild/dist/
npm run preview    # Serve built output
npm run test       # Run all tests (unit + e2e)
npm run test:unit  # Vitest unit tests only
npm run test:e2e   # Playwright E2E tests only (builds + previews automatically)
```

Test tooling is live. Vitest for pure-function unit contracts, Playwright + `@axe-core/playwright` for behavior and a11y contracts. Lighthouse CI (perf) and Playwright screenshot diffs (visual) are planned but not set up yet. See [`REBUILD_METHODOLOGY.md`](REBUILD_METHODOLOGY.md).

## Engineering principles — grug (simplicity-first)

Complexity is the enemy. This **reinforces** the simplicity / surgical-change / no-speculation bias already in the always-applied workspace rules — it does not repeat it. Source: [grugbrain.dev](https://grugbrain.dev/) via [grug-claude-plugin](https://github.com/eqaderi/grug-claude-plugin). What grug adds on top:

- **Reuse before inventing.** Find an existing component/token/util; make the smallest change that fits. Name and justify any new complexity.
- **Say no with an 80/20.** Push back on one-use abstractions, a new dep for a small problem, indirection across files, and DRY refactors that add callbacks/config. Small obvious duplication beats a bad abstraction; keep behavior local.
- **Chesterton's Fence.** Understand why working code exists before replacing it — for the legacy, that's steps 1–2 of the rebuild loop.
- **Tests protect behavior, not internals.** No brittle unit tests that freeze implementation; regression test first for bugs.
- **No factoring before real cut points; no optimizing without a measurement.**
- **The bar:** code a tired mid-level dev can debug at 3 AM. If something's too complex, say so and propose a simpler shape.

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

| Attribute value       | Effect                                                          |
| --------------------- | --------------------------------------------------------------- |
| `slide-up`            | Scroll-triggered slide + fade up                                |
| `fade-up` / `fade-in` | Scroll-triggered fade (with/without Y translate)                |
| `rotate-in`           | Scale + fade in on scroll                                       |
| `parallax-bg`         | Background element parallax (strength via `data-anim-strength`) |
| `parallax-y`          | Element Y-scrub parallax                                        |
| `cover-d-r-img`       | Horizontal clip-path wipe + content scale/shift settle          |
| `cover-up`            | Vertical clip-path wipe (bottom → top)                          |
| `odometer`            | Count-up on scroll (`data-anim-end`, `data-anim-duration`)      |
| `svg-draw`            | Stroke-dash draw-in on scroll                                   |
| `intro-up/down/fade`  | One-shot entry animation (no scroll trigger)                    |

Entry point: `mount()` in `animations.ts` — called once in `BaseLayout.astro`. When `prefers-reduced-motion` is set, all `[data-anim]` elements are immediately revealed, no GSAP runs.

### Alpine.js usage

Component-local interactivity only (nav drawer, search overlay, video lightbox, portfolio filter, process carousel, pricing toggle). State is scoped with `x-data` per component; no global store.

### Tailwind gotchas

- **Custom `zIndex` scale:** `z-1`…`z-10` map to **100–1000**. Arbitrary values like `z-[55]` stack _below_ `z-10`. Use `z-[60]+` or extend the scale for modals/overlays.
- **Custom breakpoints:** `xs` 480px, `sm` 768px, `nav` 856px (nav collapse), `md` 992px, `lg` 1200px, `xl` 1440px.
- **Design tokens:** accent gradient (`--accent-from`/`--accent-to`/`--accent-text`) and all easing curves live in `global.css` as CSS custom props; theme swapping via `[data-theme="..."]` on `<html>`.

### Forms

Contact and Subscribe submit to Formspree via `PUBLIC_FORMSPREE_ENDPOINT` env var (set in `rebuild/.env`). When unset, components render an inline buyer notice — no runtime error.

## Where to look (docs router)

Live status changes per session and is **not** tracked here — read the right doc for the task. Each fact below has exactly one home; don't restate it elsewhere.

| Need | Read |
| --- | --- |
| Live status: what's built, current phase, next-up backlog | `rebuild/docs/PHASE_1A_STATUS.md` |
| How to rebuild any feature — the loop + test contracts | `REBUILD_METHODOLOGY.md` |
| Strategy, phased roadmap, demo ranking, risks | `MODERNIZATION_PLAN.md` |
| Per-effect inventory + chosen modern replacement | `ANIMATION_AUDIT.md` |
| Legacy `index.html`, section by section | `rebuild/docs/index-section-map.md` |
