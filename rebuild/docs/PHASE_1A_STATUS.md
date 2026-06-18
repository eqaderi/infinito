# Phase 1A — Status & Handoff

> Vertical slice of `index.html` rebuilt on Astro + Tailwind + Alpine + GSAP.
> Last updated: **2026-06-18** — after Phase 1B step 1 (cover-reveal primitives).

This is the working memory for the rebuild. If you're picking it up after a break, read this first, then [`index-section-map.md`](./index-section-map.md) for the page reference, then [`MODERNIZATION_PLAN.md` §1.5](../../MODERNIZATION_PLAN.md#15-implementation-progress-live) for the high-level roadmap, then [`ANIMATION_AUDIT.md` §0](../../ANIMATION_AUDIT.md#0-implementation-status-phase-1a) for the per-primitive status.

---

## 1. What Phase 1A is

A **single Astro route (`/`)** rendering the legacy `Final_Files/index.html` page top-to-bottom on the new component model. The goal is to validate the architecture (component tiers, animation primitives, design tokens, data layer, build pipeline) end-to-end on one route before scaling to the rest of the demo set.

**Out of scope for 1A:** the other home-demo variants, inner pages, Swiper, LightGallery v2, SplitText/DrawSVG (Club GreenSock plugins), Isotope/Muuri masonry, marquee, smooth-scroll, the full megamenu, and any WebGL hero effect.

---

## 2. Stack & key conventions

- **Astro** static site generator (`rebuild/`). Output is plain HTML/CSS/JS in `rebuild/dist/`.
- **Tailwind CSS** with custom design tokens in `rebuild/tailwind.config.mjs`.
  - ⚠️ **Custom `zIndex` scale** — `z-1`…`z-10` map to **100**…**1000**. Arbitrary values like `z-[55]` therefore stack **below** `z-10`. Modal/drawer/overlay layers should use `z-[60]+` or extend the scale.
  - Custom breakpoint `nav` for the navigation collapse point.
- **Alpine.js** for component-local interactivity (drawer, search, filters, carousels, lightbox, pricing toggle).
- **GSAP 3 + ScrollTrigger** (free tier only — no SplitText/DrawSVG yet) for scroll-driven reveals and parallax.
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
3. `Featured.astro` — 3 alternating rows; image + giant background numeral + heading + subhead + paragraph. **Parallax-Y** on image and numeral. **Cover-reveal** (`cover-d-r-img`) clip-path wipe on image columns.
4. `Services.astro` — 5 cards in a 6-column grid; row 2 (cards 4–5) centered via `md:col-start-2` on the 4th item.
5. `VideoStrip.astro` — parallax background image + play button → **Alpine lightbox iframe modal**. Vimeo/YouTube watch-URL → embed-URL conversion.
6. `Portfolio.astro` — Alpine filter tabs + 12-column dense grid with fixed row heights + `x-transition` opacity.
7. `ProcessCarousel.astro` — Alpine timeline with dot+label `<button>` click targets, evenly distributed progress line.
8. `TeamGrid.astro` — 3 portrait cards with hover-revealed socials.
9. `CtaStrip.astro` — dark stats band: 3 odometer counters in the legacy 1-2-3 column shuffle.
10. `BlogPreview.astro` — 3 post cards with hover-expand body and "read more" CTA. **Cover-up** vertical clip-path wipe reveal on each card.
11. `Subscribe.astro` — dark band, email input + Formspree submit.
12. `Pricing.astro` — Alpine monthly/yearly toggle with **scale+fade `x-transition`** on the price digits; gradient SVG icons.
13. `Testimonials.astro` — Alpine fade carousel; gradient author label.
14. `LogoCloud.astro` — two static rows of 5 partner logos (marquee deferred).
15. `Contact.astro` — Formspree form (2x2 + textarea + submit) + 3 contact-info columns + **Google Maps no-API embed iframe** with "Open in Google Maps" overlay.

### Tier D — Atoms (`src/components/atoms/`)

`Button`, `GradientText`, `SectionTitle`, `Input`, `Textarea`, `IconLine`, `Link`.

### Animations (`src/lib/animations.ts`)

Live primitives: `mountIntro`, `registerSlideUp`, `registerFadeUp`, `registerRotateIn`, `registerParallaxBg`, `registerParallaxY`, `registerCoverDR`, `registerCoverUp`, `registerOdometer`, `registerSvgDraw` (paths only).
Deferred: `bars`, line-by-line splits, draw-on for filled SVG numerals, `cover-transp` text line reveals (depends on line splitter).

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
- `slide-up2__lines` line-by-line split — currently animates the whole block; needs SplitText (or a vanilla word/line splitter) to animate per-line.
- Featured giant numerals (01/02/03) — currently rendered as a static text glyph; legacy renders them as outlined paths that draw-in with `svg-draw`. Needs SVG path assets and DrawSVG (or stroke-dasharray fallback).
- Testimonials background quote-mark watermark — currently absent. Needs a draw-in SVG.
- Pricing yearly count-up — toggling to "yearly" should trigger an odometer count-up on each plan's price; currently just a snap fade.
- LoadingScreen wordmark draw-in — currently snaps in.

### Carousels & galleries

- Testimonials and ProcessCarousel use Alpine; should migrate to **Swiper** for swipe gestures, lazy-load, and keyboard a11y consistency. Swiper will be the single carousel library across the product.
- Portfolio lightbox + AJAX load-more — currently `<a href={item.href}>` opens in new tab; legacy uses LightGallery. Migrate to LightGallery v2.
- LogoCloud — currently two static rows; legacy is two Owl marquees. Migrate to a CSS-keyframe marquee or Swiper autoplay.

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

| #   | Task                              | Status | Date       | Notes                                                                                                                                        |
| --- | --------------------------------- | ------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Cover/reveal primitives           | ✅ Done | 2026-06-18 | `registerCoverDR` (clip-path horizontal wipe + scale settle) on Featured images. `registerCoverUp` (clip-path vertical wipe) on Blog cards. |
| —   | Test tooling setup                | ✅ Done | 2026-06-18 | Vitest + Playwright + @axe-core/playwright. Initial contracts for cover-reveal, nav drawer, search overlay, a11y. `toEmbed()` extracted to `src/lib/video.ts` for unit testing. |

Phase 1B onward follows the full rebuild methodology loop: understand → evaluate → **contract first** → go blind → rebuild → verify. See `REBUILD_METHODOLOGY.md`.

---

## 8. Recommended next order of work

Picking up Phase 1B from here:

1. ~~Cover/reveal primitives~~ — **done**.
2. **Featured numeral SVG draw-in** — produce the 01/02/03 outlined paths, drop into `Featured.astro`, register with `registerSvgDraw`.
3. **Testimonials quote-mark watermark** — same approach.
4. **Pricing yearly count-up** — re-trigger `registerOdometer` on Alpine `billing` change.
5. **Swiper migration for Testimonials + ProcessCarousel** — single library, replaces the Alpine carousels.
6. **LightGallery v2 wiring for Portfolio + VideoStrip** — proper lightbox with prev/next, captions, lazy-load.
7. **LogoCloud marquee** — CSS-keyframe approach first; Swiper autoplay if buyers ask for pause-on-hover.
8. **Stats odometer string-swap** — wrap odometer in a small Alpine state machine so the final value can be a custom string.
9. **Inner pages** — start with `about.html`, then `contact.html`, then services, then portfolio detail, then blog. Each one re-uses the existing Tier B sections.

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
- [ ] Portfolio: filter tabs filter without flicker; all visible images are the same height; gaps are consistent.
- [ ] Process timeline: clicking the label area (not just the dot) advances; the progress line ends inside the active dot.
- [ ] Pricing: monthly→yearly transition is smooth (~300ms scale+fade), not a snap.
- [ ] Blog cards reveal with a bottom-to-top clip-path wipe on scroll (cover-up).
- [ ] Contact: Google Maps iframe renders; "Open in Google Maps" link works.
- [ ] No console errors.
- [ ] At `prefers-reduced-motion: reduce`, the page is fully visible without animations.
