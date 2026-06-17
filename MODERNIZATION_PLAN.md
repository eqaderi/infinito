# Infinito — Modernization Plan

> Audit & migration strategy for turning the legacy Infinito HTML template into a modern, sellable Envato product.
> This document is **planning only**. The original `Final_Files/`, `working_dir/`, and `Documentation/` trees are preserved intact and are treated as the canonical design and interaction reference for the rebuild.

---

## 1. Executive Summary

Infinito is a late-2010s premium HTML template originally built on **Bootstrap 3, jQuery 3, Grunt, GSAP/TweenMax, ScrollMagic, MasterSlider, Owl Carousel, Pixi.js v3 and Three.js r84**. It ships **~30 main HTML pages** (18 home variants, 3 blog listings, 3 blog posts, 3 service pages, 3 project/portfolio pages) plus **44 supporting HTML fragments** (AJAX partials, plugin demos, icon references), an 8.5k‑line monolithic `scripts.js`, ~52k lines of SCSS across 40 partials, a 19‑file gradient recolor system, and ~8 vendored animation/effect libraries.

The codebase has two faces:

- **Strong product identity** — exceptional animation breadth, a recognizable visual language (gradient text, illusional split images, masked covers, parallax video bands), and a richer-than-average inner-page set for an HTML template.
- **Weak product engineering** — Bootstrap 3 grid, jQuery-coupled monolith, Grunt build, no design tokens, no module system, dormant code paths, scope bugs, copy/branding inconsistencies ("Infinoto", "Chanllenge"), CRLF noise, and a PHP mailer.

**The product opportunity is clear:** rebuild as a **Creative Agency / Portfolio multipurpose HTML template** on **modern HTML + Tailwind CSS + GSAP 3 + Alpine.js**, preserving the **top 6–8 hero effects** as the marquee selling points, retiring the dead weight, and adding the polish (typography, copy, SEO, accessibility, performance) that the original lacks.

**The animation system is the single largest commercial asset** of this template and must be treated as a first-class deliverable, not a side concern.

---

## 1.1 How we rebuild (methodology)

Every feature, function, and visual is rebuilt **behavior-first and implementation-blind**, never ported. For each thing we keep: understand what it does → evaluate whether it's worth keeping → pin the behavior down as a **test contract** that says nothing about implementation → close the legacy source → rebuild from scratch with modern, minimal code → verify against the contract.

The legacy tree is a **specification of behavior and visuals, never a source of code.** The full loop, the four contract types (functional / accessibility / performance / visual), the tooling, and the Phase 1A backfill plan live in **[`REBUILD_METHODOLOGY.md`](REBUILD_METHODOLOGY.md)**. This governs every phase below.

---

## 1.5 Implementation Progress (live)

> Last updated: **2026-04-20**. The detailed Phase 1A handoff lives in [`rebuild/docs/PHASE_1A_STATUS.md`](rebuild/docs/PHASE_1A_STATUS.md).

The new product lives under **`rebuild/`** and is built on **Astro + Tailwind + Alpine.js + GSAP 3** (the "Strong alternative" row from §5.1, promoted to primary). The legacy `Final_Files/`, `working_dir/`, and `Documentation/` trees are untouched and remain the design reference.

### ✅ Phase 0 — Foundation (complete)

- Astro project scaffolded under `rebuild/` (`astro.config.mjs`, Tailwind integration, TypeScript strict).
- Tailwind config with custom design tokens (colors, breakpoints incl. `nav` breakpoint, font stacks, gradient utilities, custom `zIndex` scale).
  - ⚠️ **Watch-out for future-me:** the custom `zIndex` scale maps `z-1`…`z-10` to `100`…`1000`. Arbitrary values like `z-[55]` therefore stack **below** `z-10`. Use `z-[60]+` or extend the scale when layering modals.
- Self-hosted fonts via `@fontsource` (Playfair Display, Cormorant Garamond, Josefin Sans, Montserrat, Roboto), loaded in `BaseLayout.astro` via `src/styles/fonts.css`.
- Lucide icons available via inline SVG.
- GSAP 3 + ScrollTrigger free-tier primitives in `src/lib/animations.ts` (no Club plugins yet — `SplitText`/`DrawSVG` deferred). See [`ANIMATION_AUDIT.md` §0](ANIMATION_AUDIT.md#0-implementation-status-phase-1a).
- `prefers-reduced-motion` honored: `BaseLayout` adds `html.has-anim` only when motion is allowed; `global.css` has visibility fallbacks so reduced-motion users still see all content.

### ✅ Phase 1A — Vertical slice of `index.html` (complete)

One Astro route (`/`) renders the full home page using the new component model.

- **Tier A shell** — `Nav`, `Footer`, `LoadingScreen`, `PageShell`, `BaseLayout`.
- **Tier B sections (15)** — `Hero`, `About`, `Featured`, `Services`, `VideoStrip`, `Portfolio`, `ProcessCarousel`, `TeamGrid`, `CtaStrip`, `BlogPreview`, `Subscribe`, `Pricing`, `Testimonials`, `LogoCloud`, `Contact`.
- **Tier D atoms** — `Button`, `GradientText`, `SectionTitle`, `Input`, `Textarea`, `IconLine`, `Link`.
- **Centralized data** — `src/data/index.ts` is the single source of truth for all home-page copy and asset paths (typed).
- **Forms** — Contact + Subscribe wired to Formspree via `PUBLIC_FORMSPREE_ENDPOINT` env var; graceful inline notice when unset.
- **Carousels** — Alpine-driven (no Swiper yet) for Testimonials and ProcessCarousel.
- **Assets** — only `index.html`-referenced assets selectively copied to `rebuild/public/img/` (see `rebuild/docs/index-section-map.md` "Asset manifest").
- **Bug-fix pass** — 9 critical issues from manual testing resolved (nav drawer, search overlay, Featured parallax, Services row 2 centering, video lightbox modal, Portfolio dense-pack + flicker, Process timeline click target + line/dot alignment, Pricing toggle animation, Contact Google Maps embed). Full log in [`rebuild/docs/PHASE_1A_STATUS.md`](rebuild/docs/PHASE_1A_STATUS.md#today-2026-04-20--bug-fix-pass-9-issues).

### ⏳ Phase 1B — next up

- Cover/reveal animations (`cover-d-r-img`, `cover-up`, `cover-transp` lines) — currently deferred placeholders.
- SVG draw-in for the giant Featured numerals (currently rendered as static text).
- Real Swiper integration for Testimonials + ProcessCarousel (replace Alpine carousels).
- LightGallery v2 wiring for Portfolio + VideoStrip (currently a vanilla iframe lightbox).
- Marquee animation for the LogoCloud rows.
- Inner pages: `about.html`, `contact.html`, `services-01..03`, `projects/*`, `blog`, `blog-post-*`, `404`, `coming-soon`, `pricing`.
- Phase 1B-only deferred polish items tracked in [`PHASE_1A_STATUS.md` "Known remaining issues"](rebuild/docs/PHASE_1A_STATUS.md#known-remaining-issues--phase-1b-backlog).

### Decisions changed since the original plan

| Decision                | Original plan (§5)              | Actual                                                                                |
| ----------------------- | ------------------------------- | ------------------------------------------------------------------------------------- |
| Primary stack           | HTML + Vite + Tailwind + Alpine | **Astro + Tailwind + Alpine + GSAP** (§5.1 "Strong alternative" promoted to primary). |
| Per-demo HTML files     | One static HTML per demo        | One Astro route per demo, statically rendered. Buyer ships `dist/`.                   |
| Initial GSAP plugin set | ScrollTrigger + SplitText       | ScrollTrigger only for Phase 1A. SplitText/DrawSVG deferred to Phase 1B.              |
| Carousel library        | Swiper from day one             | Alpine carousels for Phase 1A; Swiper integration is a Phase 1B task.                 |

---

## 2. Strongest Demos to Reuse (Ranked)

Ranking blends **visual impact**, **technical viability today**, **uniqueness on Envato**, and **rebuild cost**.

| Rank | Demo file                                    | Effect / hook                                              | Why it sells                                                        | Rebuild cost                                  |
| ---: | -------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------- |
|    1 | `index__04--distort.html`                    | Pixi.js liquid distortion slideshow                        | Strongest "wow" hero in the pack; instantly demo-reel material      | Medium (modernize Pixi v7+ port)              |
|    2 | `index__12--ripples.html` (+ 5 sub‑variants) | WebGL ripple hero with `data-color` recolor                | Interactive, mouse-reactive, recolors trivially → 6 sub-demos cheap | Medium (custom shader, current Three.js)      |
|    3 | `index__03--fluid.html`                      | Custom WebGL `HeaderScroller` displacement                 | Scroll-driven distortion; rare in HTML templates                    | Medium‑High (custom shader, well-isolated)    |
|    4 | `index__06--tilt.html`                       | Multi-layer 3D tilt parallax (Codrops `tiltfx.js`)         | Cheap, light, strong perceived value                                | Low                                           |
|    5 | `index__11--prism-slider.html`               | Masked prism/diamond image transitions                     | Highly visual, distinctive                                          | Medium (custom; drop React dep)               |
|    6 | `index__09--mslider-text.html`               | Three.js "blub-cloudy" + rotating headline + odometer      | Unique organic blob hero; dense showcase of stats/scroll            | Medium‑High (port shader to current Three.js) |
|    7 | `index__02--video-text-rotator.html`         | Video background + lettering-driven word rotator           | Versatile, evergreen, low complexity                                | Low                                           |
|    8 | `index__05--shinejs.html`                    | Animated gradient canvas (Granim) + Shine.js specular text | Distinctive on dark hero, but dated tech                            | Medium (find replacements)                    |
|    9 | `index__10--planetygon.html`                 | Wireframe Three.js globe of segments                       | Niche but eye-catching for tech/agency pitches                      | Medium                                        |
|   10 | `index__08--mslider-cinematograph.html`      | Cinemagraph (GIF) hero via slider                          | Cheap to keep if MasterSlider is replaced cleanly                   | Low                                           |
|   11 | `index__07--mslider.html`                    | Standard MasterSlider hero                                 | Not unique; replace with Swiper, keep as "classic slider" demo      | Low                                           |
|   12 | `index__13--white-hero.html`                 | Mouse-parallax light hero                                  | Useful as a "minimal" counterweight to dark/spectacle demos         | Low                                           |
|   13 | `index.html` (default)                       | Parallax intro hero                                        | Baseline showcase; rebuild as "starter" demo                        | Low                                           |

> Sub-variants of `index__12--ripples` (`--02` … `--06`) are essentially the same hero with different palettes and content. Keep as **one demo with a color picker / theme switcher** in the rebuild — no need to ship 6 separate HTML files.

---

## 3. Pages: Keep, Rebuild, Drop

### 3.1 Home demos

| Action                   | Pages                                                                                                                      | Notes                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Rebuild (priority 1)** | `index__04--distort`, `index__12--ripples`, `index__03--fluid`, `index__06--tilt`, `index.html`                            | Anchor demos; ship in v1             |
| **Rebuild (priority 2)** | `index__11--prism-slider`, `index__09--mslider-text`, `index__02--video-text-rotator`                                      | Differentiators; ship in v1.1        |
| **Rebuild (priority 3)** | `index__05--shinejs`, `index__10--planetygon`, `index__13--white-hero`                                                     | Round out the demo set; ship in v1.2 |
| **Consolidate**          | `index__12--ripples--02..06` → one demo with palette switcher                                                              | Removes 5 duplicate files            |
| **Consolidate**          | `index__07--mslider`, `index__08--mslider-cinematograph` → one "classic slider" demo with image/video/cinemagraph variants | Removes 1 file                       |

**Result:** ~18 home HTML files → **11 distinct home demos** (12 if cinemagraph stays separate).

### 3.2 Inner pages

| Action             | Pages                                                                                                                                                                                      | Notes                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| **Keep & rebuild** | `blog.html`, `blog-3.html`, `blog-post-01.html`, `blog-post-02.html`, `services-01.html`, `services-02.html`, `services-03.html`, `projects-02.html`, `project-01.html`, `project-02.html` | These are the saleable inner-page set                   |
| **Drop / merge**   | `blog-2.html` (variant of `blog`), `blog-post-03.html` (variant of `blog-post-02`)                                                                                                         | Marginal differentiation, raises support cost           |
| **Add (new)**      | `about.html`, `contact.html`, `404.html`, `coming-soon.html`, `pricing.html`                                                                                                               | Standard expectations of a modern multipurpose template |

### 3.3 Supporting HTML

| Action           | Files                                                                                                                      | Notes                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Re-architect** | `Final_Files/portfolio__ajax-els/**` (20 fragments), `Final_Files/blog__ajax-els/**` (7 fragments)                         | Replace AJAX-fragment pattern with a single component + JSON content source (or keep, but generated from one template) |
| **Drop**         | `Final_Files/plugins/LiquidDistortion/index*.html`, `Final_Files/plugins/Shtick/index.html`, `Final_Files/icons/**/*.html` | Plugin demo pages and icon reference HTML; keep the libraries, drop the demos                                          |
| **Replace**      | `Documentation/index.html`                                                                                                 | Rebuild as a static docs site (Astro/Vitepress) with a clean changelog                                                 |

---

## 4. Animation Preservation Strategy

The full per-system inventory lives in **[`ANIMATION_AUDIT.md`](ANIMATION_AUDIT.md)**. The four tiers below are the executive summary of that audit.

### Tier 1 — Must preserve (product identity)

These are the reasons a buyer chooses Infinito over a generic Tailwind template.

- **Liquid distortion hero** (Pixi.js) — port to current Pixi
- **WebGL ripples hero** — port custom shader to current Three.js
- **Fluid scroll displacement (`HeaderScroller`)** — port to current Three.js
- **Tilt 3D parallax** — replace `tiltfx.js` with `vanilla-tilt.js` or modern equivalent
- **Scroll-driven section reveals (cover, slide-up, fade-in, parallax, double-cover)** — reimplement as GSAP 3 + ScrollTrigger components
- **Lettering-based hero text rotators** — preserve as a small component using GSAP SplitText or equivalent
- **Number odometer + animated bars** — preserve via lightweight library (CountUp.js + custom bar component)
- **SVG draw-on intro** — preserve via GSAP DrawSVG (or stroke-dasharray fallback)
- **Direction-aware portfolio hover (`jquery.entry`)** — reimplement as ~30 lines of vanilla JS

### Tier 2 — Preserve but simplify

Strong ideas, dated execution. Keep the visual outcome, modernize the implementation.

- **Prism slider** — keep the masked transition; drop the React dependency, rewrite as a small vanilla module (~200 lines)
- **Three.js "blub-cloudy" blob** — keep the silhouette; port to current Three.js, simpler shader
- **Three.js planetygon** — keep; modernize Three.js version, use OrbitControls from current `three/examples`
- **MasterSlider sliders** — replace entirely with **Swiper** (MIT, modern, covers all current use cases including testimonials, logos, full-bleed, fade)
- **Owl Carousel** — also replace with **Swiper** (single slider library across the product)
- **LightGallery** — keep (still actively maintained), upgrade to v2.x
- **Isotope masonry filtering** — keep, but evaluate `Muuri` as a modern alternative; AJAX load-more rewrites cleanly with `fetch` + IntersectionObserver

### Tier 3 — Optional (per-demo opt-in, not bundled by default)

- **Shine.js specular text** — niche; keep as opt-in module
- **Granim animated gradient canvas** — replace with a CSS-animated conic/linear gradient where possible; keep canvas version as opt-in
- **Cinemagraph slider** — really just a slider with a looping video; fold into the unified slider component
- **Vide video backgrounds** — replace with native `<video autoplay muted loop playsinline>` (Vide is a workaround for problems modern browsers no longer have)
- **SmoothScroll wheel smoothing** — drop by default (modern browsers + `scroll-behavior: smooth` cover this; aggressive smoothing now hurts UX and accessibility)

### Tier 4 — Remove (commercially or technically unjustified)

- **Pace.js** preloader — modern performance practice favors progressive rendering; replace with a tiny GSAP intro timeline triggered on `DOMContentLoaded`/`load`
- **`glitch()` canvas effect** — dormant in the codebase (no HTML uses `.glitch-image`); drop
- **`liquid_distort.js`** in `js/plugins/` — unused alternate; drop (the Pixi version is the one used)
- **Velocity.js** — present but unused; drop
- **`SrollMagic.min.js`** (typo'd duplicate file) — drop
- **Barba.js comments / partial integration** — never wired; drop comments
- **jQuery + jQuery Easing + hoverIntent + Enquire.js + jquery.entry** — drop as runtime dependencies; replace with ~150 lines of vanilla JS total
- **bounty.js** number animation — replaced by CountUp or simple GSAP tween
- **Modernizr** — replace with targeted `CSS.supports()` checks where actually needed (almost never in 2026)
- **FontFaceOnload** — replace with `document.fonts.ready` (native)

---

## 5. Technology Recommendation

### 5.1 Comparison Matrix

| Stack                                | Envato fit                                                | Migration cost                 | Animation fidelity               | Buyer pool                  | SEO / static export      | Verdict                       |
| ------------------------------------ | --------------------------------------------------------- | ------------------------------ | -------------------------------- | --------------------------- | ------------------------ | ----------------------------- |
| **HTML + Tailwind + Alpine + GSAP**  | Excellent — matches "HTML Templates" category             | Medium                         | High (GSAP is the gold standard) | Largest (HTML buyers)       | Native                   | **Recommended v1**            |
| React + Next.js + Tailwind + GSAP    | Good for "Site Templates / React" sub-category            | High (component model rewrite) | High                             | Smaller, more sophisticated | App Router static export | Future v2 fork                |
| Vue + Nuxt + Tailwind + GSAP         | OK — small Envato Vue audience                            | High                           | High                             | Smaller still               | Native                   | Not recommended               |
| Svelte + SvelteKit + Tailwind + GSAP | Niche — best DX, smallest Envato audience                 | High                           | High                             | Smallest                    | Native                   | Not recommended               |
| Astro + Tailwind + Alpine + GSAP     | Excellent for content/marketing sites; emerging on Envato | Medium-High                    | High                             | Growing                     | Best-in-class            | **Strong alternative for v1** |

### 5.2 Final Recommendation

**Primary product: HTML + Tailwind CSS + Alpine.js + GSAP 3 (with ScrollTrigger, SplitText, DrawSVG via Club GreenSock).**

**Optional: build the same templates with Astro** as the project structure, exporting static HTML. This gives you:

- Component reuse across 11+ demos without runtime framework cost (Astro renders to plain HTML)
- The "HTML Template" Envato listing remains valid (the buyer still gets static HTML)
- Vastly better DX than copy-pasting sections into 11 HTML files

**Why not React/Vue/Svelte as the primary product:**

1. **Envato buyer data:** HTML templates outsell framework templates by a wide margin in the creative/agency category. Buyers in this segment want static HTML they can drop into WordPress, Webflow, or hand to a back-end developer.
2. **Migration leverage:** Once the HTML/Tailwind product exists and sells, a React or Next.js port becomes a high-margin v2 listing with most of the design work done.
3. **Animation fidelity:** GSAP is the same in all stacks. Choosing the stack that maximizes buyer reach first is the commercially correct call.

**Build tooling:** **Vite** (replaces Grunt). PostCSS + Tailwind CLI for CSS. ESBuild for JS bundles.

**Form handling:** Provide three documented options — **Formspree**, **Netlify Forms**, and a minimal `mailer.php` for buyers on legacy LAMP hosting. Default the demo to Formspree.

**Animation runtime:** **GSAP 3 + ScrollTrigger** (single library replaces ScrollMagic + TweenMax + TimelineMax + custom jQuery animation code). License under GreenSock's "No Charge" or "Business Green" tier as appropriate to Envato's distribution terms — this is a known-solved problem for ThemeForest authors.

---

## 6. Component Extraction Strategy

The legacy template has **no components**, only HTML pages with shared classnames. The rebuild needs an explicit component model.

### 6.1 Component tiers

**Tier A — Layout shell** (used on every page)

- `Nav` (variants: light, dark, transparent-dark-text, transparent-white-text, side, sticky)
- `Footer` (variants: dark, light, minimal)
- `PageShell` (head, intro/loader, nav slot, content slot, footer slot)

**Tier B — Section components** (used across multiple demos)

- `Hero` (slots for background effect, headline, CTAs; preserves the variant taxonomy)
- `Featured` ("illusional" image + copy split)
- `Portfolio` (Isotope/Muuri grid + filter bar + AJAX load-more + LightGallery wiring)
- `BlogGrid` (masonry mode + sidebar mode)
- `BlogPost` (header, body, meta, tags, comments, share)
- `Services` (card grid, process steps, pricing table)
- `Stats` (odometer + bars)
- `Testimonials` (Swiper-based)
- `LogoCloud` (Swiper-based)
- `TeamGrid`
- `ContactForm`
- `CTA` (gradient bar, parallax bar)

**Tier C — Hero effect components** (per demo; lazy-loaded)

- `HeroFluid`, `HeroDistort`, `HeroRipples`, `HeroTilt`, `HeroPrism`, `HeroBlob`, `HeroPlanetygon`, `HeroShine`, `HeroVideoRotator`, `HeroParallaxLight`

**Tier D — Atoms**

- `Button` (gradient, gradient-to-white, transparent-to-gradient, shuffle, ajax)
- `GradientText`
- `IconLine` (single icon system replacing 5 packs)
- `Input`, `Textarea`, `FloatingLabel`
- `Badge`, `Tag`, `Quote`, `Divider`

### 6.2 Extraction process

1. Pick the **anchor demo** for each section (e.g., the cleanest implementation of `Featured` across all demos becomes the canonical version).
2. Build the component in isolation in a Storybook-like sandbox or a `/_components` page.
3. Recompose each demo from components, demo by demo.
4. Document each component's props and slots in the docs site.

### 6.3 Lazy-loading contract

Each Tier C hero effect must be **dynamically imported** so demos that don't use Three.js never ship Three.js. Use Vite's `import()` and an init function pattern:

```js
// Pseudocode contract for hero effect modules
export async function init(rootEl, options) {
  /* ... */ return { destroy() {} };
}
```

---

## 7. Styling / Design-System Migration

### 7.1 From SCSS variables to design tokens

The current system has:

- `scss/base/_variables.scss` (~880 lines of tokens)
- `scss/base/all_demos_variables/_variables__index-NN.scss` (per-demo variable packs, ~900 lines each)
- `css/theme--color/gradient--NN.css` (19 large parallel overrides)

Replace with **CSS custom properties** under a Tailwind theme:

```css
:root {
  --color-accent-from: #0000ff;
  --color-accent-to: #8080ff;
  --font-display: "Playfair Display", serif;
  --font-body: "Roboto", system-ui, sans-serif;
  /* ... */
}
[data-theme="purple-pink"] {
  --color-accent-from: #e5b2ca;
  --color-accent-to: #7028e4;
}
```

The 19-gradient swap then becomes a `data-theme` attribute switch, not 19 separate CSS files. The runtime `styleChanger()` panel (currently in `scripts.js`) becomes a 30-line Alpine component.

### 7.2 Tailwind configuration

- Map the existing color/typography tokens into `tailwind.config.js`
- Use `@layer components` for the recurring utility patterns the legacy SCSS encodes (`.btn--gradient`, `.text--gradient`, `.cover-d-r-img`, etc.)
- Use Tailwind's arbitrary values for one-off cases instead of bespoke SCSS

### 7.3 Typography

- Keep the legacy palette: **Playfair Display** (display), **Cormorant Garamond / Josefin Sans** (alt display), **Montserrat** (UI), **Roboto** (body)
- Self-host fonts via `@fontsource` packages (kill the HTTP Google Fonts links from the legacy docs)
- Switch to **fluid typography** (`clamp()`) for hero headlines

### 7.4 Icons

Consolidate **5 icon packs** down to **one**:

- **Lucide** (recommended) — 1500+ icons, MIT, current, tree-shakeable, matches the Linearicons aesthetic
- Provide a small "legacy icon shim" CSS for buyers porting from the original

### 7.5 Grid

- Drop Bootstrap 3 entirely
- Use Tailwind's grid + CSS Grid for asymmetric layouts (the blog masonry, the project case-study columns)
- Drop `enquire.js` — Tailwind handles all responsive needs

---

## 8. Phased Migration Roadmap

> Every phase follows the [rebuild methodology](REBUILD_METHODOLOGY.md): each kept behavior is characterized, evaluated, pinned as a test contract, then rebuilt implementation-blind. A phase is not complete until its behaviors' contracts (functional, accessibility, performance, visual) are green — this is implied in every "Exit criteria" below.

### Phase 0 — Foundation (1–2 weeks)

**Goal:** Project scaffold, design tokens, build pipeline. No demos yet.

- New repo structure: `legacy/` (the current files, untouched), `src/` (new build), `public/` (assets), `docs/` (rebuilt documentation)
- Vite + Tailwind + Alpine + GSAP installed and configured
- Design tokens extracted from `_variables.scss` into Tailwind config
- Self-hosted fonts via `@fontsource`
- Lucide icons set up
- Component sandbox page for visual regression
- ESLint + Prettier + Stylelint
- CI: build + Lighthouse + Percy/Playwright visual diff

**Exit criteria:** Empty `index.html` renders with the design system's typography, colors, and a button row that visually matches the legacy.

### Phase 1 — Anchor demo + core components (3–4 weeks)

**Goal:** One fully rebuilt demo (`index.html` default) end-to-end, plus the inner-page set.

- Build Tier A (Nav, Footer, PageShell) and Tier B (Hero, Featured, Portfolio, BlogGrid, BlogPost, Services, Stats, Testimonials, LogoCloud, TeamGrid, ContactForm, CTA)
- Build Tier D atoms
- Build the GSAP ScrollTrigger primitives: `slide-up`, `fade-in`, `cover`, `double-cover`, `parallax`, `svg-draw`, `odometer`, `bars`
- Rebuild `index.html`, `about.html`, `contact.html`, `services-01.html`, `services-02.html`, `services-03.html`, `projects-02.html`, `project-01.html`, `project-02.html`, `blog.html`, `blog-3.html`, `blog-post-01.html`, `blog-post-02.html`, `404.html`, `coming-soon.html`, `pricing.html`
- Form handling via Formspree by default

**Exit criteria:** A buyer could ship an agency site from Phase 1 alone.

### Phase 2 — Marquee hero effects (3–4 weeks)

**Goal:** The Tier 1 "must preserve" hero effects, each as a lazy-loaded module.

- `HeroFluid` — port `HeaderScroller` to current Three.js
- `HeroDistort` — port `LiquidDistortion` to current Pixi.js
- `HeroRipples` — port custom ripples shader to current Three.js, with `data-color` recolor
- `HeroTilt` — replace `tiltfx.js` with `vanilla-tilt`
- `HeroVideoRotator` — native `<video>` + GSAP-based rotator
- Build the 6 corresponding demo pages
- Theme/palette switcher for Ripples (replaces 5 sub-variant HTML files)

**Exit criteria:** 6 hero demos shipped; each one is a standalone lazy-loaded module under 100KB gzipped.

### Phase 3 — Secondary effects + polish (2–3 weeks)

**Goal:** Round out the demo set, finalize docs, prepare submission.

- `HeroPrism` — drop React, rewrite as vanilla
- `HeroBlob`, `HeroPlanetygon` — port to current Three.js
- `HeroShine`, `HeroParallaxLight` — port or replace
- Unified slider demo replacing MasterSlider + cinemagraph variants
- Documentation site rebuild
- Performance pass: Lighthouse > 90 on every demo (mobile)
- Accessibility pass: keyboard nav, focus states, ARIA, `prefers-reduced-motion` honored everywhere
- SEO pass: per-page meta, sitemap, robots, OpenGraph
- Copy pass: replace placeholder text, fix typos, consistent branding
- Final visual QA against the legacy reference

**Exit criteria:** Envato submission package ready.

### Phase 4 — Post-launch / v2 considerations (deferred)

- React/Next.js port as a separate ThemeForest listing
- Astro variant if Phase 1 used plain HTML
- WordPress conversion as a third listing
- Figma design file as an add-on product

---

## 9. Risk List

| Risk                                                                               | Likelihood | Impact | Mitigation                                                                                                                   |
| ---------------------------------------------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| GreenSock licensing for redistribution on Envato                                   | Medium     | High   | Verify ThemeForest's current GSAP policy; budget for a Business Green license if required                                    |
| Pixi.js v3 → v7+ shader/API breaking changes for liquid distortion                 | High       | Medium | Build a minimal proof-of-concept in Phase 0; if cost is too high, evaluate `ogl` or hand-rolled WebGL                        |
| Custom WebGL effects (ripples, fluid HeaderScroller) have undocumented shader code | High       | Medium | Treat the legacy JS as the spec; reimplement against the visual outcome, not the source                                      |
| MasterSlider feature parity in Swiper                                              | Low        | Low    | Swiper has thumbnail, fade, parallax, autoplay, keyboard, lazy — all current uses are covered                                |
| Buyer expects framework variants (React/Vue) at launch                             | Low        | Medium | Lead with HTML; market framework variants as a roadmap item or paid add-on                                                   |
| Three.js scenes hurt mobile performance                                            | High       | High   | Lazy-load all WebGL hero modules; offer static image fallback; respect `prefers-reduced-motion` and `navigator.deviceMemory` |
| Visual regressions vs the legacy buyers loved                                      | Medium     | Medium | Side-by-side visual diff in CI for every section component                                                                   |
| Scope creep from "let's also add a SaaS demo"                                      | High       | High   | Lock the product shape (creative/agency/portfolio) in a written scope doc; new verticals are separate listings               |
| Documentation under-investment hurts ratings                                       | Medium     | High   | Treat docs as a Phase 3 deliverable, not a postscript                                                                        |
| Browser/device matrix (iOS Safari quirks with WebGL, low-end Android)              | Medium     | Medium | Document browser support explicitly; provide `data-no-webgl` graceful degradation                                            |
| Form spam without a real backend                                                   | Medium     | Low    | Default to Formspree (handles spam); document hCaptcha integration for self-hosted forms                                     |
| Removing animations buyers expected hurts perceived value                          | Low        | Medium | The Tier 4 removals are dead/dormant code or trivially replaceable; document the rationale in the changelog                  |

---

## 10. Open Questions / Assumptions

### Assumptions

1. **Target marketplace:** ThemeForest's "Site Templates / Creative" category is the primary listing target.
2. **License posture:** Standard ThemeForest Regular + Extended licenses; no SaaS bundling at launch.
3. **The original buyers of Infinito (if any) are not within scope.** This is treated as a fresh product built on the legacy codebase as a design reference, not a free upgrade for past purchasers.
4. **No backend product.** The HTML template is the deliverable; integrations (Formspree, Netlify, MailChimp) are documented but not bundled servers.
5. **The legacy `Final_Files/`, `working_dir/`, and `Documentation/` trees stay untouched** in the repo as the spec/reference. The rebuild lives under a new path (e.g., `src/` or a new top-level folder).
6. **Branding:** The product will be re-named or have its branding cleaned up ("Infinito" stays, the variants "Infinto" / "Infinoto" are removed).
7. **No PWA, no app-shell behavior in v1** — this is a marketing/portfolio template, not an app.

### Open questions for the product owner

1. **Branding:** Keep the name "Infinito" or rebrand entirely? (Affects domain, listing slug, asset names.)
2. **Scope of demo set:** Ship all 11 home demos in v1, or stagger (e.g., 6 in v1.0, 5 added in a free v1.1 update — common Envato strategy)?
3. **Astro vs plain HTML/Vite:** Astro gives huge component-reuse wins; plain HTML is simplest for the buyer to modify. Pick one as the canonical source of truth.
4. **GSAP licensing:** Confirm current ThemeForest policy on bundling GSAP plugins (ScrollTrigger is free; SplitText/DrawSVG require a Club license).
5. **Pricing tier:** Standard ($19–24) or premium ($49+)? The animation breadth justifies premium pricing if execution is polished.
6. **Form back-end default:** Formspree (third-party, requires buyer signup) or `mailer.php` (no signup, but legacy)?
7. **Inner pages to add:** Confirm the new page list (`about`, `contact`, `404`, `coming-soon`, `pricing`) — anything to add (e.g., `careers`, `case-studies-index`)?
8. **Design refresh:** Modernize visually (typography scale, spacing, micro-interactions) or be faithful to the original look? Affects rebuild scope significantly.
9. **Documentation format:** Static HTML docs (matches Envato norms) or a hosted docs site (Vitepress/Astro Starlight)?
10. **WordPress / React variants:** Plan for them in the roadmap, or hard out-of-scope?

---

## 11. Appendix — Repository inventory snapshot

For traceability, the audit was performed against the following repository state:

- `Final_Files/` — 74 HTML files, 97 CSS files, 69 JS files, 42 SCSS files; full distribution tree
- `working_dir/src/` — 30 HTML, 0 CSS, 46 JS, 40 SCSS; partial source tree (HTML + SCSS + JS only)
- `working_dir/` — Grunt build (`Gruntfile.js`, `package.json`); targets `dist/`
- `Documentation/` — single-page HTML docs
- `Licensing/` — license text
- 18 home variants, 6 blog pages, 3 service pages, 3 project pages
- 19 gradient theme files
- ~52,710 lines of SCSS across 40 files
- 8,532-line `Final_Files/js/scripts.js` orchestrating all behavior

The detailed animation system inventory is in **[`ANIMATION_AUDIT.md`](ANIMATION_AUDIT.md)**.
