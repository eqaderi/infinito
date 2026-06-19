# Phase 1A — Status & Handoff

> Vertical slice of `index.html` rebuilt on Astro + Tailwind + Alpine + GSAP.
> Last updated: **2026-06-19** — Portfolio lightbox shipped (PhotoSwipe v5); Swiper carousel migration + Pricing yearly count-up already merged.

This is the working memory for the rebuild. If you're picking it up after a break, read this first, then [`index-section-map.md`](./index-section-map.md) for the page reference, then [`MODERNIZATION_PLAN.md` §1.5](../../MODERNIZATION_PLAN.md#15-implementation-progress-live) for the high-level roadmap, then [`ANIMATION_AUDIT.md` §0](../../ANIMATION_AUDIT.md#0-implementation-status-phase-1a) for the per-primitive status.

> **Backlog now lives in GitHub issues** (`eqaderi/infinito`). Epics map to milestones (Phase 1B / 2 / 3); tasks are native sub-issues. This doc still carries the live narrative + "what's built"; GitHub is the assignable task tracker. The draft that seeded the issues is [`github-backlog.md`](./github-backlog.md).

---

## 1. What Phase 1A is

A **single Astro route (`/`)** rendering the legacy `Final_Files/index.html` page top-to-bottom on the new component model. The goal is to validate the architecture (component tiers, animation primitives, design tokens, data layer, build pipeline) end-to-end on one route before scaling to the rest of the demo set.

**Out of scope for 1A:** the other home-demo variants, inner pages, Swiper, LightGallery v2, SplitText/DrawSVG (formerly Club GreenSock, free since April 2025), Isotope/Muuri masonry, marquee, smooth-scroll, the full megamenu, and any WebGL hero effect.

---

## 2. Stack & key conventions

- **Astro 6** static site generator (`rebuild/`). Output is plain HTML/CSS/JS in `rebuild/dist/`.
- **Tailwind CSS 4** via the `@tailwindcss/vite` plugin. Theme is CSS-first in `src/styles/global.css` (`@theme {…}`) — there is **no** `tailwind.config.mjs` anymore.
  - ⚠️ **Custom `zIndex` scale** — `z-1`…`z-10` map to **100**…**1000** (via `--z-index-*` in `@theme`). Arbitrary values like `z-[55]` therefore stack **below** `z-10`. Modal/drawer/overlay layers should use `z-[60]+` or extend the scale.
  - Custom breakpoint `nav` for the navigation collapse point (`--breakpoint-*` in `@theme`; defaults reset so only the project's screens exist).
- **Alpine.js** for component-local interactivity (drawer, search, portfolio filter, pricing toggle).
- **Swiper** is the single carousel library (Testimonials, ProcessCarousel) — `src/lib/carousels.ts`.
- **PhotoSwipe v5** (MIT) is the lightbox — `src/lib/lightbox.ts`. Chosen over LightGallery v2 to avoid a paid redistribution license in a sold template.
- **GSAP 3 + ScrollTrigger** for scroll-driven reveals and parallax. GSAP went 100% free in April 2025, so the former Club plugins (**DrawSVG**, SplitText, MorphSVG) are now available — DrawSVG powers the Featured numeral draw-in. SplitText/MorphSVG remain unused for now.
- **Lucide** icons (inline SVG, hand-picked per component).
- **Self-hosted fonts** via `@fontsource` packages, loaded in `BaseLayout.astro`.
- **Centralized data** — every piece of home-page copy and asset path lives in `src/data/index.ts` as a typed export. Components consume it; no copy lives inside components.
- **Forms** — Formspree via `PUBLIC_FORMSPREE_ENDPOINT`; graceful inline notice when unset.
- **Reduced motion** — `BaseLayout` adds `html.has-anim` only when motion is allowed; `global.css` has visibility fallbacks; `mount()` early-returns without the class.

---

## 3. What's built

### Tier A — Shell (`src/components/shell/`)

| Component             | Notes                                                                                                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseLayout.astro`    | `<head>`, fonts, theme color, animation boot, reduced-motion gate, slot for page content.                                                                                                                        |
| `PageShell.astro`     | Wraps a route with `LoadingScreen` + `Nav` + `<main>` + `Footer`. Accepts `transparentNav` for hero-overlap pages.                                                                                               |
| `LoadingScreen.astro` | Fades out on `window.load`. Static SVG infinity loop + "Infinito" wordmark. Stroke-draw on the wordmark is deferred to Phase 1B.                                                                                 |
| `Nav.astro`           | **Rewritten in the bug-fix pass.** See §5 below. Header + sibling drawer + sibling search overlay, all under one Alpine `x-data`. Body scroll lock, ESC to close, staggered link entry, scroll-aware background. |
| `Footer.astro`        | Dark footer: brand + 4 link columns + back-to-top + copyright + social icons + signature.                                                                                                                        |

### Tier B — Sections (`src/components/sections/`) — 15 total, page order

1. `Hero.astro` — full-viewport background image, centered title + subline, scroll-down arrow.
2. `About.astro` — eyebrow + display heading + paragraph + rotate-in CTA.
3. `Featured.astro` — 3 alternating rows; image + giant background numeral + heading + subhead + paragraph. **Parallax-Y** on image and numeral. **Cover-reveal** (`cover-d-r-img`) clip-path wipe on image columns. Numeral is now an inline SVG glyph (`NumeralGlyph.astro`) that **draws in via DrawSVG** (`svg-draw` + `data-anim-fill`), nested inside the parallax-Y wrapper.
4. `Services.astro` — 5 cards in a 6-column grid; row 2 (cards 4–5) centered via `md:col-start-2` on the 4th item.
5. `VideoStrip.astro` — parallax background image + play button → **Alpine lightbox iframe modal**. Vimeo/YouTube watch-URL → embed-URL conversion.
6. `Portfolio.astro` — Alpine filter tabs + 12-column dense grid with fixed row heights + `x-transition` opacity. Items open in a **PhotoSwipe v5 lightbox** (prev/next, captions, keyboard, lazy core import). Dimensions resolved at runtime from thumbnail natural size; open uses `fade`. Contract: `tests/e2e/portfolio-lightbox.spec.ts`.
7. `ProcessCarousel.astro` — **Swiper**-driven slide panels; the timeline (dots, labels, progress line) is derived from Swiper's `activeIndex` on `slideChange`. Dot+label `<button>`s `slideTo`. Contract: `tests/e2e/process-carousel.spec.ts`.
8. `TeamGrid.astro` — 3 portrait cards with hover-revealed socials.
9. `CtaStrip.astro` — dark stats band: 3 odometer counters in the legacy 1-2-3 column shuffle.
10. `BlogPreview.astro` — 3 post cards with hover-expand body and "read more" CTA. **Cover-up** vertical clip-path wipe reveal on each card.
11. `Subscribe.astro` — dark band, email input + Formspree submit.
12. `Pricing.astro` — Alpine monthly/yearly toggle; switching to yearly **counts the price up from 0** (GSAP tween via a `pricing:billing` event → `registerPricingToggle`). Gradient SVG icons. Contract: `tests/e2e/pricing-toggle.spec.ts`.
13. `Testimonials.astro` — **Swiper** fade carousel (Navigation + gradient-pill Pagination + Keyboard + A11y); gradient author label. Contract: `tests/e2e/testimonials.spec.ts`.
14. `LogoCloud.astro` — two static rows of 5 partner logos (marquee deferred).
15. `Contact.astro` — Formspree form (2x2 + textarea + submit) + 3 contact-info columns + **Google Maps no-API embed iframe** with "Open in Google Maps" overlay.

### Tier D — Atoms (`src/components/atoms/`)

`Button`, `GradientText`, `SectionTitle`, `Input`, `Textarea`, `IconLine`, `Link`, `NumeralGlyph` (Featured 01/02/03 SVG glyphs), `QuoteGlyph` (Testimonials double-quote watermark).

### Animations (`src/lib/animations.ts`)

**Two engines, split by cost** (since the perf overhaul). The `data-anim="…"` markup API is unchanged; only what drives it differs:

- **CSS + one shared `IntersectionObserver`** (`registerReveals`) handles the one-shot reveals: `slide-up`, `fade-up`, `fade-in`, `rotate-in`, `cover-up`. The observer flips `data-anim-shown` when an element scrolls in; CSS transitions (reusing the `--ease-out-*` tokens in `global.css`) do the motion on the compositor. `data-anim-delay` → `transition-delay`. No GSAP, no per-element ScrollTrigger.
- **GSAP + ScrollTrigger**, kept only where it earns its weight: `registerParallaxBg`/`registerParallaxY` (scroll-scrubbed, with scoped `will-change: transform`), `registerCoverDR` (clip-path wipe + image scale settle), `registerOdometer` (count-up), `registerSvgDraw` (DrawSVG outline draw; opt-in `data-anim-fill` fades the fill in for filled glyphs — Featured numerals + Testimonials quote). `mountIntro` is the one-shot load intro (no scroll trigger).

This cut ScrollTriggers ~85 → ~21 and persistent `will-change` layers ~72 → ~7 with no change to how anything looks (see the Phase 1B perf row). GSAP boot is deferred to `requestIdleCallback`.
Deferred: `bars`, line-by-line splits, `cover-transp` text line reveals (depends on line splitter).

### Data (`src/data/index.ts`)

Typed exports: `hero`, `about`, `featured`, `services`, `portfolio`, `process`, `team`, `stats`, `blog`, `subscribe`, `pricing`, `testimonials`, `logos`, `contact`, `nav`, `footer`. A buyer can rebrand the demo by editing only this file.

---

## 4. Routes

- `/` — the home-page vertical slice (everything above).
- `/_smoke` — internal route for visual regression of atoms/sections in isolation. Not for production.

---

## 5. Today (2026-04-20) — bug-fix pass (9 issues)

After the initial Phase 1A integration was verified in-browser, manual testing surfaced 9 critical issues. All fixed and verified.

| #   | Issue                                                             | Root cause                                                                                                                                                                                | Fix                                                                                                                                                                                                                                                                         | File(s)                               |
| --- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1   | Hamburger menu opened (icon flipped to X) but drawer not visible. | Drawer was nested inside `<header>` → trapped in header's stacking context. Compounded by Tailwind custom `zIndex`: Hero's `z-10` resolved to `1000`, drawer's `z-[55]` resolved to `55`. | Hoisted drawer (and search overlay) to be **siblings of `<header>`** under one shared `x-data`. Switched from `x-show`+`x-transition` to opacity/visibility class toggles. Lowered Hero content from `z-10` → `z-[1]`. Body scroll lock, ESC handler, staggered link entry. | `Nav.astro`, `Hero.astro`             |
| 2   | Search button did nothing.                                        | Not implemented.                                                                                                                                                                          | Added a full-screen search overlay sibling under same `x-data`. Auto-focuses input via `x-ref`, ESC + backdrop-click close, body scroll lock.                                                                                                                               | `Nav.astro`                           |
| 3   | Featured (Modern/Flexible/Quality) lost the parallax.             | No primitive existed; only background-position parallax was implemented.                                                                                                                  | New `registerParallaxY` primitive — scroll-scrubbed `y` translate. Strength + direction via data attrs. Applied to the item image (strength 60) and the giant background numeral (strength 160, direction "down").                                                          | `lib/animations.ts`, `Featured.astro` |
| 4   | Services row 2 not centered (5 items with last 2 right-aligned).  | `md:grid-cols-3` left items 4–5 in cols 1–2 of the second row.                                                                                                                            | Changed to `md:grid-cols-6` with `md:col-span-2` per item, `md:col-start-2` on the 4th item.                                                                                                                                                                                | `Services.astro`                      |
| 5   | Video play button opened a new tab.                               | `<a href={vimeoUrl} target="_blank">`.                                                                                                                                                    | Replaced with `<button>` toggling Alpine `open`. Fixed-position iframe modal, `<template x-if="open">` for the iframe (mounted on open, unmounted on close), Vimeo/YouTube `toEmbed()` URL conversion, ESC + body lock.                                                     | `VideoStrip.astro`                    |
| 6   | Portfolio filter flicker; image sizes inconsistent.               | Variable `col-span` + dynamic reflow on filter; images were `h-auto`.                                                                                                                     | Switched to 12-col grid with fixed row heights (`auto-rows-[260px] sm:auto-rows-[300px]`) and `grid-auto-flow: dense`. Rebalanced `spanCls` (4/4/6/8). Images are now `absolute inset-0 h-full w-full object-cover`. Explicit `x-transition` for smooth opacity.            | `Portfolio.astro`                     |
| 7   | Process timeline: hover only on dot; progress line short of dot.  | Each dot was its own `<button>`; label was outside. Progress width math used wrong divisor.                                                                                               | Wrapped dot+label in one `<button>`. Progress width = `(active / (count − 1)) * 100`, with `px-1.5`/`inset-x-1.5`/`left-1.5` offsets so the line terminates at dot centers.                                                                                                 | `ProcessCarousel.astro`               |
| 8   | Pricing toggle (monthly/yearly) had no animation.                 | `x-text` on a single span — instant value swap.                                                                                                                                           | Two stacked `<span>` in a `relative inline-grid` (col-start-1/row-start-1 each), each with `x-show` + `x-transition` (300ms enter / 150ms leave, scale 0.9 + ±2px translate-y + opacity).                                                                                   | `Pricing.astro`                       |
| 9   | Contact section had no Google Map.                                | Was a static CSS placeholder.                                                                                                                                                             | Replaced with no-API Google Maps iframe (`maps.google.com/maps?q={addr}&output=embed`). Added "Open in Google Maps" pill button overlay. CSS-filter desaturation (`grayscale-[0.2] contrast-95`).                                                                           | `Contact.astro`                       |

### Verification notes

- `npm run build` is green with zero warnings.
- All edited files lint clean (no new `ReadLints` errors).
- In-browser smoke test passed for: drawer + search overlay, pricing toggle scale+fade, video lightbox open/close, contact map render.
- ⚠️ **IDE browser tool limitation** — `browser_resize` to wide viewports (e.g. 1440px) consistently snaps back to ~753–1011px in this environment. Some desktop-specific layout checks (Services 6-col centering at `md`+, Portfolio dense pack at `md`+, parallax timing) are best verified in an external browser at a real desktop width before commit.

---

## 6. Known remaining issues / Phase 1B backlog

These were either explicitly deferred from the 1A scope or surfaced during the bug-fix pass and accepted as "small/non-blocking":

### Animation parity

- ~~`cover-d-r-img` and `cover-up` primitives~~ — **done** (Phase 1B step 1, 2026-06-18). `cover-transp` text line reveals still deferred (depends on line splitter).
- `slide-up2__lines` line-by-line split — currently animates the whole block; needs per-line split. **SplitText is now free** (GSAP 3.15, already installed) — use it instead of a vanilla splitter.
- ~~Featured giant numerals (01/02/03) draw-in~~ — **done** (Phase 1B). Montserrat glyph paths in `NumeralGlyph.astro`, drawn via DrawSVG (`data-anim-fill`). Contract: `tests/e2e/svg-draw.spec.ts`.
- ~~Testimonials background quote-mark watermark~~ — **done** (Phase 1B step 3). `QuoteGlyph.astro` drawn via DrawSVG (`data-anim-fill`). Contract: `tests/e2e/quote-draw.spec.ts`.
- ~~Pricing yearly count-up~~ — **done** (PR #5). GSAP count-up on toggle to yearly. Contract: `tests/e2e/pricing-toggle.spec.ts`.
- LoadingScreen wordmark draw-in — currently snaps in. Now unblocked by `registerSvgDraw` (DrawSVG). _(GitHub #8)_

### Carousels & galleries

- ~~Testimonials and ProcessCarousel → **Swiper**~~ — **done** (PR #40, GitHub #13/#14). Swiper is now the single carousel library (`src/lib/carousels.ts`).
- ~~Portfolio lightbox~~ — **done** (GitHub #16). **PhotoSwipe v5** (MIT), not LightGallery (paid). `src/lib/lightbox.ts`. _Remaining in the lightbox epic (#15):_ **VideoStrip lightbox upgrade (#17)** and **Portfolio AJAX load-more (#18)**.
- ⚠️ **Known edge (follow-up):** when a portfolio filter is active, the lightbox prev/next still cycles through filtered-out items (gallery binds all anchors). Acceptable for now; revisit by scoping Swiper/PhotoSwipe to visible items.
- LogoCloud — currently two static rows; legacy is two Owl marquees. Migrate to a CSS-keyframe marquee or Swiper autoplay. _(GitHub #20)_

### Layout & polish

- Team-section hover/reveal animation parity vs. legacy — deferred (was cancelled in the today's todo list).
- Megamenu — Phase 1A drawer is single-level link list; legacy is a full megamenu with cart + search dropdowns. Megamenu deferred.
- Cart dropdown — not implemented (legacy has a small cart popover in the nav).
- Stats odometer "999999 → ~1 Million+" string-swap — currently counts to whatever `data-number-end` is; the visual swap behaviour from legacy is missing.

### Inner pages (none built yet)

`about.html`, `contact.html`, `services-01..03`, `projects-02`, `project-01..02`, `blog`, `blog-3`, `blog-post-01..02`, `404`, `coming-soon`, `pricing`. These are Phase 1B.

### Other home demos

None built. Phase 2+ (the WebGL Tier-1 demos) is the next major chapter.

---

## 7. Phase 1B progress

| #   | Task                              | Status  | Date       | Notes                                                                                                                                                                                            |
| --- | --------------------------------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Cover/reveal primitives           | ✅ Done | 2026-06-18 | `registerCoverDR` (clip-path horizontal wipe + scale settle) on Featured images. `registerCoverUp` (clip-path vertical wipe) on Blog cards.                                                      |
| —   | Test tooling setup                | ✅ Done | 2026-06-18 | Vitest + Playwright + @axe-core/playwright. Initial contracts for cover-reveal, nav drawer, search overlay, a11y. `toEmbed()` extracted to `src/lib/video.ts` for unit testing.                  |
| —   | Dependency majors update          | ✅ Done | 2026-06-18 | Tailwind 3→4 (`@tailwindcss/vite`, theme → CSS `@theme`), Astro 5→6, in-range bumps.                                                                                                             |
| 2   | Featured numeral SVG draw-in      | ✅ Done | 2026-06-18 | `NumeralGlyph.astro` (Montserrat glyph paths) drawn via DrawSVG — now free. `registerSvgDraw` gained opt-in `data-anim-fill` (draw outline + fade fill). Contract: `tests/e2e/svg-draw.spec.ts`. |
| 3   | Testimonials quote-mark watermark | ✅ Done | 2026-06-19 | `QuoteGlyph.astro` atom (double-quote SVG glyph) replaces static text `"`. Uses `svg-draw` + `data-anim-fill` (same pipeline as numerals). Contract: `tests/e2e/quote-draw.spec.ts`.             |
| —   | Animation performance overhaul    | ✅ Done | 2026-06-19 | Reveal engine → one `IntersectionObserver` + CSS transitions (`registerReveals`); ScrollTriggers ~85 → ~21, `will-change` ~72 → ~7. Removed global `will-change` + `scroll-behavior:smooth`; throttled nav scroll; odometer skips redundant writes; deferred GSAP boot; `decoding="async"` + hero LCP preload. Contract: `tests/e2e/reveal.spec.ts`. Deferred to a separate task: Astro `<Image>` migration, GIF→video, font-weight trim. |
| 4   | Pricing yearly count-up           | ✅ Done | 2026-06-19 | PR #5. GSAP count-up on toggle to yearly via a `pricing:billing` event → `registerPricingToggle`; reduced-motion snaps to final. Contract: `tests/e2e/pricing-toggle.spec.ts`. |
| 5   | Swiper carousel migration         | ✅ Done | 2026-06-19 | PR #40 (GitHub #12/#13/#14). Testimonials + ProcessCarousel → Swiper; new `src/lib/carousels.ts` mounted from `BaseLayout`. Single carousel library. Contracts: `testimonials.spec.ts`, `process-carousel.spec.ts`. |
| 6   | Portfolio lightbox                | ✅ Done | 2026-06-19 | GitHub #16. **PhotoSwipe v5** (MIT) in `src/lib/lightbox.ts`; runtime dimensions from thumbnail natural size, lazy core import, `fade` open, dialog `aria-label`. Contract: `portfolio-lightbox.spec.ts`. |

Phase 1B onward follows the full rebuild methodology loop: understand → evaluate → **contract first** → go blind → rebuild → verify. See `REBUILD_METHODOLOGY.md`.

---

## 8. Recommended next order of work

**Tracking is now GitHub issues** (`eqaderi/infinito`, milestone "Phase 1B"). The list below mirrors the open issues. Each item follows the full methodology loop (contract first, then build blind, then verify; `npm run test` must stay green).

Done so far in Phase 1B: cover/reveal primitives, Featured numeral draw-in, Testimonials quote watermark, animation performance overhaul, **Pricing yearly count-up (#7)**, **Swiper migration (#13/#14 — epic #12 closed)**, **Portfolio lightbox (#16)**.

**START HERE next session → finish the lightbox epic (#15), then the small wins.** In order:

1. **VideoStrip lightbox upgrade (#17)** — align the play-button modal with PhotoSwipe (custom HTML/video slide) for prev/next + consistent UX. Same `src/lib/lightbox.ts`.
2. **Portfolio AJAX load-more (#18)** — replace legacy jQuery fragments with `fetch()` + IntersectionObserver; `aria-live` for new items. Also fixes the filter↔lightbox edge noted in §6.
3. **LogoCloud marquee (#20)** — CSS-keyframe marquee; reduced-motion → static rows; no new dep.
4. **Stats odometer string-swap (#22)** — final value can be a custom string ("~1 Million+") via a small Alpine/JS state machine on top of the odometer.
5. **LoadingScreen wordmark draw-in (#8)** — DrawSVG on the wordmark (pipeline already exists via `registerSvgDraw`).
6. **Inner pages (epic #23)** — `BlogGrid`/`BlogPost` Tier B components first, then `about`, `contact`, services, project detail, blog. Each re-uses existing sections.

**Deferred performance follow-up (separate task, not blocking):** Astro `<Image>` migration (needs moving `public/img` → `src/assets` + a glob resolver, which touches the buyer-editable string-path data contract), Portfolio GIF → video/animated-webp, and font-weight trim in `fonts.css`. Pair the `<Image>` move with the GIF conversion. Rationale in the perf row of §7 and the commit `perf(animations): cut scroll jank`.

Once Phase 1B is closed, the route is open to Phase 2 (Tier-1 WebGL hero effects, lazy-loaded per demo).

---

## 9. Smoke checklist before any commit

```bash
cd rebuild
npm run build            # must succeed with 0 warnings
npm run preview          # eyeball /
```

In the browser, confirm:

- [ ] Hero loads with intro animation; scroll-down arrow visible at the bottom.
- [ ] Hamburger opens the drawer (full-screen, dark, staggered link entry); X closes it; ESC closes it; body scroll is locked while open.
- [ ] Search icon opens the search overlay; input is auto-focused; ESC + backdrop click close.
- [ ] Featured images reveal with a left-to-right clip-path wipe + subtle zoom settle on scroll (cover-d-r-img).
- [ ] Featured image and giant numeral move at different speeds on scroll (parallax-Y).
- [ ] Services: at md+ width, the 4th and 5th cards are centered in row 2.
- [ ] VideoStrip: clicking play opens a modal iframe (not a new tab); ESC closes it.
- [ ] Portfolio: filter tabs filter without flicker; all visible images are the same height; gaps are consistent. Clicking an item opens the PhotoSwipe lightbox; arrows/swipe navigate; ESC closes.
- [ ] Process timeline: clicking the label area (not just the dot) advances the Swiper; the progress line ends inside the active dot; swipe/keyboard work.
- [ ] Testimonials: arrows + gradient-pill bullets change the quote (fade); swipe + arrow keys work.
- [ ] Pricing: switching to yearly counts the price up from 0 (~1s); switching back to monthly is instant.
- [ ] Blog cards reveal with a bottom-to-top clip-path wipe on scroll (cover-up).
- [ ] Contact: Google Maps iframe renders; "Open in Google Maps" link works.
- [ ] No console errors.
- [ ] At `prefers-reduced-motion: reduce`, the page is fully visible without animations.
