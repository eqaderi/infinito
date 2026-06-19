# Rebuild Methodology — Behavior-First, Implementation-Blind

> How every feature, function, and visual in Infinito gets rebuilt.
> Companion to [`MODERNIZATION_PLAN.md`](MODERNIZATION_PLAN.md) (strategy) and [`ANIMATION_AUDIT.md`](ANIMATION_AUDIT.md) (per-effect inventory).
> Runs on top of the **grug simplicity-first principles** in [`CLAUDE.md`](CLAUDE.md) (source: [grugbrain.dev](https://grugbrain.dev/)): complexity is the enemy, the simplest thing that works wins, and the bar is code a tired mid-level dev can debug at 3 AM.

---

## The core idea

The legacy template is from a different era. The code is jQuery-coupled, dead in places, buggy, and slow. **We do not port it.** Copying old code forward means inheriting its rot.

Instead we treat the legacy tree (`Final_Files/`, `working_dir/`, `Documentation/`) as a **specification of behavior and visuals — never as a source of code.** For each thing we keep, we:

1. Learn exactly what it does.
2. Decide whether it's worth keeping.
3. Pin that behavior down as a **test contract** that says nothing about how it's built.
4. Close the legacy source — go **implementation-blind**.
5. Rebuild it from scratch with modern, minimal, performant, idiomatic code.
6. Prove the new code satisfies the contract.

The contract is the point. Once a behavior is captured as a test, the implementation underneath is free to be anything — and it can be replaced, refactored, or rewritten later without fear, because the test still guards the behavior.

---

## The loop (per feature / function / visual)

### 1. Understand

Read the legacy implementation **only enough to describe what it does** — not to memorize how. Write down the observable behavior:

- What triggers it? (load, scroll, click, hover, focus, media query)
- What are its inputs and outputs? (data attributes, props, DOM it touches)
- What are the edge cases? (empty state, reduced motion, keyboard, no-JS, small screen)
- What does it _look_ like at start, mid, and end?

Most of this already exists in [`ANIMATION_AUDIT.md`](ANIMATION_AUDIT.md) ("What it does") and [`rebuild/docs/index-section-map.md`](rebuild/docs/index-section-map.md). Extend those rather than starting fresh.

This step is characterization, not study. You are recording behavior, not learning to reproduce code.

### 2. Evaluate — is it actually good?

A behavior existing in the legacy is **not** a reason to keep it. Decide deliberately, using the audit tiers:

| Tier   | Decision                                               |
| ------ | ------------------------------------------------------ |
| **T1** | Keep. Core to the product's value. Rebuild faithfully. |
| **T2** | Keep the _outcome_, simplify the means.                |
| **T3** | Optional. Ship opt-in, not bundled.                    |
| **T4** | Drop. Dead, redundant, or superseded by the platform.  |

Ask: does this earn its weight? Is it good UX in 2026, or a 2010s tic? Smooth-scroll wheel hijacking, full-page preloaders, glitch canvases nobody used — these were kept out _because we evaluated them_, not because the legacy lacked them. Killing a bad behavior is a valid and common outcome of this step.

This step is **Chesterton's Fence** applied to the legacy: understand what a behavior does and why it might exist before deciding to drop or replace it. "The legacy didn't have it" and "the legacy did have it" are equally weak arguments — the decision is whether it earns its keep now.

### 3. Specify the contract (before writing new code)

Write the behavior down as something verifiable, **with zero reference to implementation**. A contract is honest about what kind of behavior it is — not everything is a unit test:

| Contract type     | What it pins                                                                                                                                                     | How it's checked                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Functional**    | Observable behavior: drawer opens on click, ESC closes it, body scroll locks, filter hides non-matching items, `toEmbed()` converts a watch URL to an embed URL. | Vitest (pure logic) / Playwright (DOM + interaction) |
| **Accessibility** | Keyboard reachable, focus trapped + restored, ARIA present, `prefers-reduced-motion` fully reveals content with no animation.                                    | `@axe-core/playwright`, Playwright keyboard driving  |
| **Performance**   | Bundle stays under budget; no WebGL on first paint; Lighthouse mobile > 90.                                                                                      | Lighthouse CI, bundle-size assertion                 |
| **Visual**        | It _looks_ right. The legacy render is the reference image.                                                                                                      | Screenshot / visual diff + a human sign-off          |

**The tests are the contract.** They live in the codebase, not in this doc. A feature's contract is authored when that feature enters its phase.

A contract pins **behavior, not internals** (grug testing). Favor functional/integration and a small reliable E2E set around the stable boundary; avoid brittle unit tests that freeze implementation details — those defeat the whole point, since the contract has to survive the implementation being swapped out (e.g. Pixi → `ogl`). For a fixed bug, write the regression test first when practical.

Be honest about the visual ones: you cannot unit-test "the liquid distortion looks premium." That's a reference screenshot plus a human eye, backed by functional tests for the parts that _are_ deterministic (it initializes, it lazy-loads, it exposes `destroy()`, it falls back to a static image without WebGL).

### 4. Go blind

Close the legacy file. From here on you implement against **the contract and the visual reference only**. Do not translate the old code line by line. Do not open `scripts.js` "just to check how they did it." If the contract is missing something, fix the contract — then keep building blind.

This is the step that produces clean code instead of a modernized translation of a mess.

### 5. Rebuild

Write the simplest modern code on the new stack (Astro + Tailwind + Alpine + GSAP 3) that satisfies the contract. Prefer the platform: CSS over JS, native APIs over libraries, one well-chosen library over five. If a thing can be 50 lines, it is not 200. World-class means _clear and minimal_, not clever and dense.

Apply grug here: reuse an existing component/token/util before inventing one; don't factor until a real cut point emerges (multiple call sites wanting the same concept for the same reason); accept small obvious duplication over a confusing abstraction; keep behavior local instead of scattering it across files; don't optimize without a measurement. Name any new complexity and justify it. The bar is code a tired mid-level dev can debug at 3 AM.

### 6. Verify

The feature is done when:

- [ ] Functional contract is green.
- [ ] Accessibility contract is green (keyboard, ARIA, reduced motion).
- [ ] Performance budget is met.
- [ ] Visual diff vs. the legacy reference is signed off.
- [ ] No legacy code was copied; the new code is idiomatic and minimal.

If any fails, the feature is not done — regardless of how good the demo looks.

---

## Why this matters for _this_ project

- **The legacy is the spec, the bug, and the trap at once.** Behavior-first lets us harvest the good (the visual identity, the animation breadth) while leaving the bad (jQuery coupling, dead code, perf debt) behind.
- **Implementation freedom.** A contract test means we can ship a Pixi v7 port now and swap it for `ogl` later, with the test still guarding the behavior. The audit's "Modern replacement" choices stop being one-way doors.
- **No silent regressions.** Phase 1A surfaced 9 bugs only through manual testing. Without contracts, those fixes can regress and nobody notices until a buyer does.

---

## Tooling

Test infrastructure lives under `rebuild/`. Run from there.

| Need           | Tool                                    | Status     | Used for                                                                                                         |
| -------------- | --------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Unit / logic   | **Vitest**                              | ✅ Live    | Pure functions: `toEmbed()`, filter matching, odometer math, split-text helper, direction-aware-hover edge math. |
| Behavior / E2E | **Playwright**                          | ✅ Live    | Interaction contracts: drawer, search overlay, filters, lightbox, pricing toggle, form states, scroll spy.       |
| Accessibility  | **@axe-core/playwright**                | ✅ Live    | Per-page a11y assertions; keyboard + focus-trap flows.                                                           |
| Performance    | **Lighthouse CI** + a bundle-size check | ⏳ Planned | The §15 budgets (mobile > 90, no WebGL on first paint, lazy hero modules).                                       |
| Visual         | **Playwright screenshots** (or Percy)   | ⏳ Planned | Diff sections against captured legacy references.                                                                |

```bash
npm run test        # all (unit + e2e)
npm run test:unit   # Vitest only
npm run test:e2e    # Playwright only (auto-builds + previews)
```

Keep it lean. The goal is a contract per kept behavior, not coverage theater.

---

## Where Phase 1A stands against this

Phase 1A was built behavior-first **informally** — `index-section-map.md` characterizes the legacy behavior, and the bug-fix pass found 9 issues by hand. But there is **no automated contract**, so every one of those behaviors can regress silently.

Adoption plan:

1. **Phase 1B onward:** every kept behavior follows the full loop, contract-first.
2. **Backfill:** the behaviors already shipped in Phase 1A (nav drawer + search, Featured parallax, Services grid, video lightbox, Portfolio filter, Process timeline, Pricing toggle, Contact map) get retroactive contract tests so the 9 fixes are locked before Phase 1B builds on top of them.

### What's already covered (as of 2026-06-19)

Initial contract tests established alongside tooling setup:

- **Unit (Vitest):** `toEmbed()` — Vimeo, YouTube, youtu.be URL conversion, unknown host fallback, invalid URL fallback.
- **E2E (Playwright):** cover-d-r-img (Featured image reveal via `data-anim-shown`), cover-up (Blog card reveal), svg-draw (Featured numerals — path `fill-opacity` 0→1 on scroll; solid immediately under reduced motion), quote-draw (Testimonials quote watermark — same `fill-opacity` signal), nav drawer open/close/ESC, search overlay open + input focus.
- **A11y (@axe-core/playwright):** home page WCAG 2.0 AA scan (critical + serious violations).
