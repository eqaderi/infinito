# AGENTS.md

Canonical guidance for any AI coding agent working in this repository (Cursor, Claude Code, or otherwise). `CLAUDE.md` is a symlink to this file; the Cursor rule in `.cursor/rules/rebuild-methodology.mdc` points here too. **One source of truth — edit this file.**

## Project overview

Modernization of the **Infinito** legacy HTML template into an Envato product on **Astro + Tailwind CSS + Alpine.js + GSAP 3**. The rebuild is under `rebuild/`. Legacy trees (`Final_Files/`, `working_dir/`, `Documentation/`) are read-only design references — do not modify them.

**Rebuild methodology (non-negotiable):** every feature/function/visual is rebuilt **behavior-first and implementation-blind** — never ported. Understand what the legacy does → evaluate whether it's worth keeping → pin the behavior as a test contract (implementation-agnostic) → close the legacy source → rebuild from scratch with modern, minimal code → verify against the contract. Treat the legacy as a spec of behavior and visuals, never a source of code. Full loop in [`REBUILD_METHODOLOGY.md`](REBUILD_METHODOLOGY.md).

**The product contract (ordered):**

1. **Fidelity** — every *visible* legacy effect ships (T1–T3 in the audit; T4 is dead/dormant code only). Consolidations (e.g. ripples ×6 → one demo + palette switcher) are fine when the rendered outcome is preserved. Dropping a visible behavior requires human sign-off, recorded in the audit.
2. **Performance** — the budgets below pass in CI on every page. A beautiful effect over budget is a failed task: optimize it, don't ship it heavy, don't silently cut it.
3. **License cleanliness** — nothing enters `package.json` or ships in `dist/` unless its license permits bundled commercial redistribution (MIT/BSD/ISC/Apache-2.0/OFL, or GSAP's free license). GPL, "free for personal use", and paid plugins are forbidden. Check the license BEFORE writing code that imports it; log every new dependency (name, version, license, gz size) in [`ENVATO_COMPLIANCE.md`](ENVATO_COMPLIANCE.md) §1.

When these conflict, stop and ask the human. Never resolve a fidelity-vs-performance trade-off silently.

## How work is enforced (read before building)

These docs are advisory; the gates below are not. Any change — regardless of which tool or human produced it — must clear them:

1. **Follow the loop.** Before rebuilding any kept behavior, work the steps in [`REBUILD_METHODOLOGY.md`](REBUILD_METHODOLOGY.md): understand → evaluate → **capture the visual baseline** → **contract first** → go blind → rebuild → verify.
2. **Definition of Done (every behavior-bearing change):**
   - [ ] A **test contract** exists for the behavior (Vitest for pure logic, Playwright for interaction, `@axe-core/playwright` for a11y). For a bug, the regression test is written first.
   - [ ] Built **implementation-blind** — no legacy code copied; new code is minimal and idiomatic (grug, below).
   - [ ] `prefers-reduced-motion` honored; keyboard-reachable; ARIA on icon-only controls.
   - [ ] `npm run build` and `npm run test` are green; **Lighthouse budgets pass** (`npm run test:perf`).
   - [ ] For visual effects: side-by-side frames vs. the legacy baseline presented, **human signs off** — the agent never self-approves fidelity.
3. **CI is the merge gate.** GitHub Actions runs build + unit + e2e/a11y + Lighthouse budgets on every PR (`.github/workflows/ci.yml`). Red CI blocks merge — no exceptions.
4. **The PR checklist** (`.github/pull_request_template.md`) is where you attest to the things CI can't check: that a new behavior got a contract, that the rebuild was done blind, and that any visual change carries its baseline comparison.

## Performance budgets (enforced by Lighthouse CI — `rebuild/lighthouserc.json`)

| Metric | Budget |
| --- | --- |
| Lighthouse Performance (mobile emulation) | ≥ 90 every page |
| LCP | ≤ 2.5 s (real-throttle target; verified via `throttlingMethod: devtools`). LHCI enforces a **3400 ms** ceiling on the default `simulate` method, which over-models a text LCP ~1.1 s past visual completion — see `rebuild/lighthouserc.json` + issue #79. |
| CLS | < 0.1 |
| TBT (INP proxy in lab) | ≤ 200 ms |
| JS per standard page | ≤ 150 KB gz |
| JS per WebGL demo page | ≤ 300 KB gz (hero module lazy-loaded; **no WebGL on first paint**) |
| CSS per page | ≤ 90 KB gz |

Never claim a performance improvement without a number from LHCI or a trace. Never optimize without a measurement.

## AI discipline (your known failure modes, pre-empted)

1. **Do not trust training data for library APIs.** Astro 6, Tailwind 4 (CSS-first `@theme`, no config file), Swiper 12, PhotoSwipe 5, GSAP 3.15, Pixi v8+, current Three.js — several are newer than your training data. Before first use of any API: read the installed package's types (`node_modules/*/dist/*.d.ts`) or bundled docs at the INSTALLED version; if uncertain, write a 10-line spike and run it. Never invent an option name.
2. **Run everything you claim.** "Should work" is banned. Build it, run the test, capture the output. If you cannot execute something, say so and mark the task "needs human verification" — never mark it done.
3. **Evidence-based done.** Before closing any task: re-read the acceptance criteria line by line, run the full suite, and record evidence (test output, LH score, screenshot path) in the PR. A task without evidence is not done.
4. **Dependencies are gated.** Adding any dependency not already in `package.json` requires a human yes + a license row in `ENVATO_COMPLIANCE.md` §1. Pin exact versions (no `^`) when adding new deps.
5. **Delete in the same change.** Replacing something means removing the old file in the same PR. `dist/` ships zero unused files.
6. **No silent downgrades.** If the modern approach fails, implement the fallback at full fidelity or escalate — never quietly ship a worse effect.
7. **Session ritual.** Start: read this file → `rebuild/docs/PHASE_1A_STATUS.md` → the current GitHub issue → state the session plan in one paragraph → verify env (`npm ci && npm run test:unit` green). End: run full CI locally → update the status doc → conventional commit → stop at a clean boundary, never mid-refactor.
8. **Honesty over progress.** Reporting a blocker or a failed approach is success behavior. Papering over it with a plausible-looking stub is the worst thing you can do here.

## Commands (all run from `rebuild/`)

```bash
cd rebuild
npm run dev        # Astro dev server → http://localhost:4321
npm run build      # Static build → rebuild/dist/
npm run preview    # Serve built output
npm run test       # Run all tests (unit + e2e)
npm run test:unit  # Vitest unit tests only
npm run test:e2e   # Playwright E2E tests — previews rebuild/dist/, so run `npm run build` first
npm run test:perf  # Lighthouse CI budget assertions against rebuild/dist/
```

Test tooling is live. Vitest for pure-function unit contracts, Playwright + `@axe-core/playwright` for behavior and a11y contracts, **Lighthouse CI for the §budgets**. Visual contracts use captured legacy baselines under `rebuild/docs/baseline/` (see `REBUILD_METHODOLOGY.md` step 3) diffed by eye + Playwright screenshots; a human signs off.

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

**Above-the-fold rule (never gate first paint on JS — issue #43):** content that renders in the initial viewport is never hidden pending the GSAP runtime. Note the FOUC gate `html.has-anim [data-anim]:not([data-anim-shown]) { opacity: 0 }` hides **every** `[data-anim]` by default and its exceptions in `global.css` are scoped by **animation type, not fold position**: self-managing GSAP types (`parallax-bg`, `odometer`, `svg-draw`) and the CSS-first `intro-*` entrances are excepted to `opacity: 1`; the transition-driven reveal types (`slide-up`, `fade-up`, `fade-in`, `rotate-in`) stay gated even above the fold. So **use `intro-*` for above-the-fold entrances** — they run CSS-first (keyframes fire at parse because the inline boot adds `has-anim` synchronously; `animation-fill-mode: both` holds the from-state through the inline `--intro-delay` stagger). Any GSAP entrance on above-the-fold content must be visible-by-default (`gsap.from()`, never `gsap.to()` from a hidden start), and WebGL heroes render their **poster in the served HTML**, not injected on boot. Rationale: the hero `<h1>` is the LCP element; JS-gating it under CPU throttle delayed first paint by ~2.4 s (≈2.85 s of LCP render delay) and blew the budget.

**WebGL/canvas lifecycle (Phase 2 rule):** every canvas hero must lazy-load via dynamic `import()` on approach (IntersectionObserver), pause when off-screen and on `visibilitychange`, cap `devicePixelRatio` at 2, expose `destroy()` that fully disposes GPU resources, and render a static poster fallback when WebGL is unavailable or reduced-motion is set. Idle CPU when off-screen must be ~0.

### Alpine.js usage

Component-local interactivity only (nav drawer, search overlay, video lightbox, portfolio filter, process carousel, pricing toggle). State is scoped with `x-data` per component; no global store.

### Tailwind gotchas

- **Custom `zIndex` scale:** `z-1`…`z-10` map to **100–1000**. Arbitrary values like `z-[55]` stack _below_ `z-10`. Use `z-[60]+` or extend the scale for modals/overlays.
- **Custom breakpoints:** `xs` 480px, `sm` 768px, `nav` 856px (nav collapse), `md` 992px, `lg` 1200px, `xl` 1440px.
- **Design tokens:** accent gradient (`--accent-from`/`--accent-to`/`--accent-text`) and all easing curves live in `global.css` as CSS custom props; theme swapping via `[data-theme="..."]` on `<html>`.
- **RTL:** prefer logical utilities (`ms-*`/`me-*`, `start-*`/`end-*`, `ps-*`/`pe-*`) over physical (`ml-*`/`left-*`) in new code — RTL ships in Phase 3 (see `ENVATO_COMPLIANCE.md` §5) and logical-first now makes that sweep nearly free.

### Forms

Contact and Subscribe submit to Formspree via `PUBLIC_FORMSPREE_ENDPOINT` env var (set in `rebuild/.env`). When unset, components render an inline buyer notice — no runtime error. A hardened `mailer.php` ships in the final package for LAMP buyers (Phase 3 task; see `ENVATO_COMPLIANCE.md` §4) — Formspree stays the demo default.

## Where to look (docs router)

Live status changes per session and is **not** tracked here — read the right doc for the task. Each fact below has exactly one home; don't restate it elsewhere.

| Need | Read |
| --- | --- |
| Live status: what's built, current phase, next-up backlog | `rebuild/docs/PHASE_1A_STATUS.md` |
| How to rebuild any feature — the loop + test contracts | `REBUILD_METHODOLOGY.md` |
| Strategy, phased roadmap, demo ranking, risks | `MODERNIZATION_PLAN.md` |
| Per-effect inventory + chosen modern replacement | `ANIMATION_AUDIT.md` |
| Legacy `index.html`, section by section | `rebuild/docs/index-section-map.md` |
| Release gate: licensing ledger, packaging, previews, RTL, Envato checklist | `ENVATO_COMPLIANCE.md` |
