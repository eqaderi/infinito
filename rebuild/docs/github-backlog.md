# GitHub backlog draft — review before push

This is the **source of truth for the `gh` issue-creation pass**. Edit titles/bodies/labels freely; what's here is exactly what gets created. Nothing is pushed to GitHub until this file is approved.

- Repo: `eqaderi/infinito`
- Milestones map to phases. Epics get the `epic` label + an area label. Tasks become **native sub-issues** of their epic.
- Phase 1B is fully broken down; Phase 2 & 3 are epic-level stubs only.

---

## Labels to create

| Label | Color | Description |
| --- | --- | --- |
| `epic` | `5319e7` | Parent tracking issue (has sub-issues) |
| `animation` | `1d76db` | GSAP / reveal / scroll animation work |
| `carousel` | `0e8a16` | Swiper / slider migration |
| `lightbox` | `fbca04` | Gallery / lightbox / load-more |
| `inner-page` | `c5def5` | New routes beyond the home page |
| `hero-webgl` | `b60205` | Tier-1 WebGL hero effects |
| `perf` | `d4c5f9` | Performance / Lighthouse |
| `a11y` | `bfd4f2` | Accessibility |
| `docs` | reuse `documentation` | — |

(Reuse existing defaults: `enhancement`, `bug`, `documentation`.)

## Milestones

| Title | Description |
| --- | --- |
| Phase 1B | Vertical-slice polish (animation parity, carousels, lightbox, inner pages) |
| Phase 2 | Marquee WebGL hero effects (lazy-loaded per demo) |
| Phase 3 | Secondary effects, perf/a11y/SEO polish, docs, Envato submission |

---

# Phase 1B (milestone: Phase 1B)

## EPIC 1 — Animation parity
**Labels:** `epic`, `animation`
**Body:** Close the remaining animation gaps between the legacy template and the rebuild. Each sub-issue is one effect rebuilt behavior-first with a test contract.

### Tasks (sub-issues)

**1.1 Pricing yearly count-up** — `animation`
> When billing toggles to "yearly", price digits count up from 0 instead of snap-fading. **Done — covered by PR #5** (`feat/pricing-yearly-count-up`). Link PR, close on merge.

**1.2 LoadingScreen wordmark draw-in** — `animation`
> "Infinito" wordmark currently snaps in. Draw the stroke via DrawSVG (now free) using the existing `registerSvgDraw` pipeline. Honor `prefers-reduced-motion`.

**1.3 `cover-transp` text-line reveals** — `animation`
> Per-line text reveal from the legacy. Needs a line splitter (GSAP SplitText). Contract: lines reveal in sequence on scroll; full text visible under reduced motion.

**1.4 `slide-up2__lines` line-by-line split** — `animation`
> Currently animates the whole block. Split into per-line stagger via SplitText. Shares the splitter from 1.3.

**1.5 `registerBars` animated bars** — `animation`
> Skill/stat bars that grow on scroll (CSS `scaleX/scaleY` + ScrollTrigger, ~20 lines). Needed by about/blog inner pages. Reduced-motion → bars rendered full.

---

## EPIC 2 — Carousels → Swiper
**Labels:** `epic`, `carousel`
**Body:** Replace the two hand-rolled Alpine carousels with one Swiper instance each, for swipe gestures, lazy-load, and keyboard a11y consistency across the product.

### Tasks (sub-issues)

**2.1 Migrate Testimonials to Swiper** — `carousel`
> Replace Alpine fade carousel. Keep gradient author label. Add keyboard nav + swipe. Contract: next/prev + keyboard advance slides; a11y scan clean.

**2.2 Migrate ProcessCarousel to Swiper** — `carousel`
> Replace Alpine timeline carousel. Preserve dot+label click targets and progress line. Contract: clicking a label advances; keyboard reachable.

---

## EPIC 3 — Galleries & lightbox
**Labels:** `epic`, `lightbox`
**Body:** Proper lightbox + load-more for Portfolio and VideoStrip. **Open decision:** PhotoSwipe v5 (MIT) vs LightGallery v2 (paid redistribution license) — decide before implementing 3.1.

### Tasks (sub-issues)

**3.1 Portfolio lightbox** — `lightbox`
> Portfolio items currently open in a new tab. Wire a lightbox with prev/next + captions. Library TBD (see epic note). Contract: open/close/keyboard nav.

**3.2 VideoStrip lightbox upgrade** — `lightbox`
> Current vanilla iframe modal works but is minimal. Align with chosen lightbox lib; keep Vimeo/YouTube embed conversion. ESC + backdrop close.

**3.3 Portfolio AJAX load-more** — `lightbox`
> Replace legacy jQuery AJAX fragments with `fetch()` + IntersectionObserver (optional auto-load). `aria-live` region for newly loaded items.

---

## EPIC 4 — LogoCloud marquee
**Labels:** `epic`, `animation`
**Body:** Replace the two static logo rows with a continuous marquee.

### Tasks (sub-issues)

**4.1 CSS-keyframe marquee** — `animation`
> Two scrolling rows via CSS keyframes. Pause-on-hover optional. Reduced-motion → static rows. Swiper autoplay only if buyers ask for it.

---

## EPIC 5 — Stats odometer string-swap
**Labels:** `epic`, `animation`
**Body:** Legacy stat counts up then swaps to a custom string ("~1 Million+"). The rebuild only counts to a number.

### Tasks (sub-issues)

**5.1 Custom final string on odometer** — `animation`
> Small Alpine state machine wraps the odometer so the final displayed value can be an arbitrary string after the count completes. Contract: counts up, then shows the custom string.

---

## EPIC 6 — Inner pages
**Labels:** `epic`, `inner-page`
**Body:** Build the inner routes, reusing existing Tier B sections. Two new Tier B components are prerequisites. Dropped per plan: `blog-2`, `blog-post-03`.

### Tasks (sub-issues)

**6.0 Tier B: BlogGrid + BlogPost components** — `inner-page`
> `BlogGrid` (masonry + sidebar variants via props) and `BlogPost` (header, body, meta, tags, share). Prerequisite for the blog routes below.

**6.1 `about` page** — `inner-page`
**6.2 `contact` page** — `inner-page`
**6.3 `services-01` / `services-02` / `services-03`** — `inner-page` *(one issue, three layouts via props)*
**6.4 `projects-02` (portfolio listing)** — `inner-page`
**6.5 `project-01` + `project-02` (project detail)** — `inner-page`
**6.6 `blog` + `blog-3` (listing variants)** — `inner-page`
**6.7 `blog-post-01` + `blog-post-02`** — `inner-page`
**6.8 `404` page** — `inner-page`
**6.9 `coming-soon` page** — `inner-page`
**6.10 `pricing` page** — `inner-page`

> Note: services/project/blog tasks are grouped by shared layout to avoid a flood of near-duplicate issues. Split later if a route diverges.

---

# Phase 2 — WebGL heroes (milestone: Phase 2, epic stubs only)

## EPIC 7 — Tier 1 WebGL heroes
**Labels:** `epic`, `hero-webgl`
**Body:** The five "must-preserve" hero effects, each a lazy-loaded module exposing `init(rootEl, options) → { destroy() }`. No WebGL on first paint; static fallback + reduced-motion respected.
> - Liquid distortion slideshow → Pixi.js v7+ (or `ogl`)
> - WebGL ripples → Three.js r150+, **one demo + runtime palette switcher** (replaces 6 variants)
> - Fluid HeaderScroller → current Three.js + GSAP ScrollTrigger
> - 3D tilt parallax → `vanilla-tilt.js`, preserve `data-tilt-options`
> - Video + text rotator → native `<video>` + GSAP SplitText

## EPIC 8 — Hero text effects
**Labels:** `epic`, `animation`
**Body:** SplitText headline rotator, shuffle-letters button, Codrops `.cd-headline` rotator — vanilla/GSAP rebuilds.

## EPIC 9 — Slider/gallery consolidation
**Labels:** `epic`, `carousel`
**Body:** Collapse MasterSlider + Owl + cinemagraph variants into one Swiper-based demo; convert GIF backgrounds to MP4/WebM.

---

# Phase 3 — Polish & docs (milestone: Phase 3, epic stubs only)

## EPIC 10 — Polish & submission
**Labels:** `epic`, `perf`, `a11y`
**Body:** Lighthouse mobile > 90 on every demo; a11y pass (keyboard nav, visible focus, ARIA on icon-only controls, `aria-live` for AJAX); SEO (per-page meta, sitemap, robots, OpenGraph); copy pass; final visual QA vs legacy.

## EPIC 11 — Documentation site
**Labels:** `epic`, `documentation`
**Body:** Rebuild buyer docs from the legacy static HTML (Astro Starlight or static, TBD).
