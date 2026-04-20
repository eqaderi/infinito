# `index.html` section map

Working reference extracted from [`Final_Files/index.html`](../../Final_Files/index.html)
during Phase 1A (vertical slice). Used to drive the rebuild of each
section component. Not a deliverable.

For each section: line range in the legacy file, structural notes, key
classes, animation triggers, and asset paths the rebuild must keep.

## Shell

### Loading screen `#loading-screen` — lines 2241–2266

- Fixed full-viewport overlay anchored at the bottom of `<body>`.
- Slides up (`y: -100%`) and fades out after page load.
- Renders an inline SVG of the Infinito infinity-loop ("snake" + "bg"
  paths) and the word "Infinito" with stroke-draw animation.
- Phase 1A scope: render the same SVG, fade out after `window.load`
  (no svg-draw animation yet — Phase 1B).

### Nav `#nav-wrapper` — lines 60–881

Variant used by the home page:
`nav-wrapper nav-bar-wrapper hover--bg-flow nav--theme-02 navbar--layout--01 nav--fade navbar-transparent-white-text nav--elastic`.

- Fixed top bar, transparent background, white text on hero, then turns
  opaque after the user scrolls past the hero.
- Left: logo (inline SVG infinity loop + "infinito" wordmark).
- Centered/right: hamburger button `#nav__toggle` with hamburger lines +
  word "Menu". Clicking opens a full-screen drawer.
- Right cluster: cart dropdown + search dropdown.
- Drawer (`<nav id="nav">`) is one massive megamenu in the legacy.
  Phase 1A scope: simplified to a single-level link list for the home
  page (Home, About, Portfolio, Blog, Contact), no megamenu / cart /
  search dropdown until Phase 1B+.

### Footer `#footer.footer.footer--dark` — lines 2157–2234

- Dark background.
- Upper row: brand logo (left col) + 4 link columns
  (about, services, contact, get in touch).
- Lower row: "back to top" button (left), copyright + legal links
  (center), 4 social icons (right).
- "Made with heart by Ershad" signature on the right.

## Sections (in order)

### 1. Hero — `<header id="hero" class="hero center-child">` lines 886–906

- Full-viewport. Background image: `images/backgrounds/IMG_1432.jpg`
  (variable `$img-bg__hero--background` from
  `Final_Files/scss/base/all_demos_variables/_variables__index-01.scss`
  line 576; resolved in `Final_Files/scss/theme/_theme.scss` line 322).
- Inner: `.hero__background.mask` overlay, `.hero__content` centered
  with `h1.hero__text--03.font--03` ("Denouement.") and `.title--small`
  subline ("The resolution of a mystery").
- Below: scroll-down indicator pointing at `#about`, with three
  flashing arrows.
- Animation: `slide-up-intro__el` on title + subline (slide up on
  load), `fade-up-intro__el` on the scroll-down arrow,
  `hero_img-intro__el` on the background mask.
- `data-fade-up-intro-delay="1"` on the stage.

### 2. About — `<section id="about">` lines 907–927

- Class: `section background--gray text-center slide-up slide-up2 rotate-in`.
- Container > `section__header`:
  - eyebrow `h2.title--small.font--02` "Est. 2018" — slide-up
  - display `h2.text--display.font--03` "Infinoto; The ultimate theme"
    — slide-up by lines
  - paragraph `p.text--highlighted.slide-up2__lines.cover-transp`
    centered in 8/12 col
- `section__action`: rotate-in CTA button `btn--cube btn--gradient-to-white` "see our works"
- Trigger delays: `data-slide-up2-delay="0.3"`, `data-rotate-in-delay="0.7"`.

### 3. Featured — `<section id="featured" class="section featured-items">` lines 928–1044

3 items, each a `featured-item illusional-field` row:

- 50/50 layout with image left for items 1 & 3, right for item 2
  (`col-sm-push-6` / `col-sm-pull-6`).
- Image col: `.illusional-object` (image + colored overlay + a small
  hover effect — the "illusional" hover that shifts the image up/right
  and reveals an offset color block).
- Text col: a giant background SVG numeral (01/02/03 — drawn as the
  "0" + "1/2/3" digits as one path) sitting behind the heading; then
  `h2.font--03` heading, `.title--small.font--02 .text--gradient`
  subhead, `p.text--section.slide-up2__lines.cover-transp`.
- Animations: `cover-d-r-img` (image is revealed via diagonal cover),
  `slide-up`, `slide-up2`, `svg-draw` on the giant numeral.
- Asset paths: `images/portfolio/2018-02-14-05.00.5{0,1,2}-1.jpg`.
- Copy:
  1. "Modern Approach" / "used latest technology"
  2. "Flexible Design" / "infinite available options"
  3. "Quality Design" / "High standard coding"

### 4. SVG-draw services — `<section class="section background--gray td-hover ...">` lines 1045–1192

- Title: none — purely 5 cards in a 3 + 2 grid (3 on top row, 2 centered on bottom row at md+).
- Each card: `.quick-info.td-hover__item` containing
  `.quick-info__icon` (inline gradient-stroked SVG), `h4.title--small`
  heading, paragraph.
- SVG fills are `linearGradient` from `#ccd1db` → `#7a7e95` (gray-blue
  gradient) — these stroke-draw on scroll.
- Cards:
  1. Web Applications
  2. Ecommerce
  3. Websites
  4. Consultancy
  5. branding
- Animations: section-level `slide-up` + `svg-draw svg-draw--filled svg-draw--fast`. Each card's icon, heading, and text fade up
  individually via `slide-up__el-set`.

### 5. Parallax video strip — `<section class="section--small parallax background--image js-lightgallery-video">` lines 1193–1211

- Background image: `images/backgrounds/IMG_1431.jpg` (defined in
  `Final_Files/scss/theme/_theme.scss` line 467).
- Centered play button (SVG circle with triangle) linking to
  `https://vimeo.com/40234826`.
- Below: `h2.title--small.font--02` "watch our awesome story 2019."
- Phase 1A scope: render the play button + caption; click opens the
  Vimeo URL in a new tab (no in-page modal). The lightgallery popup
  is a Phase 1B item.

### 6. Portfolio — `<section id="portfolio">` lines 1212–1368

- Header (sticky in legacy via `js-portfolio__header--fixed`): left
  col eyebrow "featured works", right col filter tabs:
  show all · branding · print · photography
  Filter tabs are `nav-tabs--box btn-group gradient`.
- Grid: 5 items in legacy (with isotope masonry). Each item:
  `.hover-item.col-md-{4|3|5|7|5}` with image, bottom-left info
  (title + subline), top-right action icons (eye = lightbox, link =
  external).
- Items + categories:
  1. red sky — `print photography` — `2018-02-14-04.37.01-1.jpg`
  2. silver nail — `branding print` — `2018-02-14-01.59.33-1.jpg`
  3. golden tail — `branding photography` — `zuza.jpg`
  4. death rose — `print photography` — `2018-02-14-04.37.02-1.jpg`
  5. shining star — `branding photography` — `video-26-.gif`
- Below: AJAX "more" button (`#more-portfolio`).
- Phase 1A scope: Alpine state for active filter, CSS grid with
  `display: none` toggle (no Isotope shuffle, no AJAX). Lightbox is
  deferred — eye icon opens image in a new tab; link icon stays as `#`.

### 7. Process carousel — `<section class="section background--dark">` lines 1369–1465

- Header: eyebrow "the history lesson", display "we did grow over the years".
- Below: timeline strip with 4 dots positioned at left: 0%, 18%,
  53%, right: 0% — labels: "1997: Est." / "2001: growing" /
  "2006: reputation" / "2018: success".
- Below the timeline: `#process .owl-carousel` — 4 slides, each
  with a 2-col paragraph.
- Phase 1A scope: render the 4-button timeline as the Swiper
  pagination, sync each click to a Swiper slide change. Animated
  progress bar can be CSS-only.

### 8. Team — `<section id="team">` lines 1466–1568

- Header: eyebrow "the team", left display "Meet our talents & experts",
  right paragraph (description).
- Grid: 3 cards. Each `.hover-item.team-el` with portrait image,
  bottom-left info (name + role), top-right hover-revealed social icons.
- Members:
  1. John Conley — Front-end Developer — `t_01.jpg` — twitter, stack-overflow, vimeo
  2. Rebeca Jones — President + Creative Director — `t_02.jpg` — instagram, google-plus
  3. Stephen Dorff — Project Manager — `t_03.jpg` — github, facebook, codepen
- Below: rotate-in CTA button "get to know us even better!" (`btn--gradient-to-gray`).

### 9. Stats strip (CTA bar) — `<section class="section--small background--dark">` lines 1569–1594

- Dark band. 3 odometer stats, but the layout pushes the first item to
  the middle col (`col-md-push-4`) and the second to the left
  (`col-md-pull-4`):
  1. ~1 Million+ — "lines of codes" (the odometer counts up to 999999
     then visually swaps to "~1 Million+" via `js-odometer__letters-inside`)
  2. 9235 — "users"
  3. 53 — "apps"

### 10. Blog preview — `<section id="blog">` lines 1596–1682

- Class: `blog-preview-section background--gray blog-preview--style-02`.
- 3 blog cards. Each card has two layers:
  - `.blog-preview__visible`: title (gradient text) + meta line ("Posted on DATE by AUTHOR in CATEGORY").
  - `.blog-preview__hidden`: revealed on hover/expand. Author thumb
    (left) + paragraph (middle) + "read more" button (right).
- Hover effect (`hover--bg-flow--horizontal`): a colored bg sweeps in
  horizontally on hover.
- Posts:
  1. Graphic Romance — Joe biden — Lifestyle — author 01
  2. Tacos & Paint — Linda Jobs — technology — author 02
  3. We've moved into our new office. — Tony montana — news — author 03
- Below: fade-in "read more stories" CTA.

### 11. Subscribe strip — `<div class="section--small background--dark">` lines 1683–1714

- Dark band. Email input + "Subscribe" submit button.
- Mailchimp action URL in legacy. We replace with Formspree env var.

### 12. Pricing tables — `<section class="section ... js-odometer--simple">` lines 1715–1901

- Header: eyebrow "the plans" (left) + monthly/yearly toggle (right,
  `nav-tabs` switcher).
- 3 plans (`.pricing-table`, middle one `.pricing-table.featured`):
  1. individuals — Single user license — $299/mo or $29/yr — 256MB · Free Hosting · Unlimited Bandwidth
  2. Small Team (featured) — Up to 5 users — $899/mo or $89/yr — 512MB · Free Hosting · Unlimited Bandwidth · Small Social media package
  3. Organization — Unlimited users — $4599/mo or $469/yr — Unlimited Memory · Free Hosting · Unlimited Bandwidth · Full Social media package · Analytics Integration
- Each card has an inline SVG icon (gradient-stroked horizontal lines
  forming a logo shape) that draws on scroll.
- Toggle behaviour: clicking "yearly" hides
  `.pricing-table__tag-value--02` (the monthly price) and the
  `.pricing-table__tag-duration` ("mo"), shows the yearly value and
  "yr" suffix; the yearly values use odometer count-up.

### 13. Testimonials — `<section class="section background--gray">` lines 1902–1956

- Header centered: eyebrow "testimonials", display "what people say!".
- Centered quote slider, 8/12 col. Background SVG: a giant pair of
  curly opening-quote marks (`color--gray--02`, drawn via `svg-draw`).
- Slider (`master-slider` in legacy): 3 quotes:
  1. "Balanced between ease of use and power features…" — Justin Ronaldo / Talent Unit
  2. "Everyone I've worked with…" — james mattis / US Marines
  3. "Infinito has given us a simple way to reach…" — Tess Brighton / Clomedia Group Inc.
- Author label uses gradient text + cite tag.
- Phase 1A scope: Swiper, "fade" effect, dot pagination under, prev/next arrows outside.

### 14. Logo cloud — `<section class="section">` lines 1957–2031

- Header eyebrow only: "our partners".
- Two stacked rows (each is an Owl Carousel marquee in legacy):
  - Row 1: client-logo-1, -14, -13, -8, -15
  - Row 2: client-logo-6, -16, -4, -17, -10
- Phase 1A scope: render two static rows of 5 logos each. Marquee
  animation deferred to Phase 1B.

### 15. Contact — `<section id="contact">` lines 2033–2156

- Header: eyebrow "contact us", left display "write us / visit us",
  right paragraph (same copy block as Team).
- Form (1 col, centered, 10/12): 2x2 grid of inputs (First/Last,
  Email/Phone) + textarea + "send" submit button.
- Inputs use floating labels (legacy `.fieldset__label` with
  `data-content` placeholder).
- Below the form: 3 contact info columns ("text us", "Call us",
  "Visit us") + map embed (`#map` Google Maps with
  `data-address="799-701 Pomona Ave Albany, CA 94706"` and a
  custom dark-blue style).
- Phase 1A scope: Formspree-wired form (action from
  `import.meta.env.PUBLIC_FORMSPREE_ENDPOINT`); map → static SVG
  placeholder image with the address overlay (real Google Maps
  integration deferred).

## Asset manifest (Phase 1A)

Copied from `Final_Files/images/` → `rebuild/public/img/`:

```
backgrounds/IMG_1432.jpg            → public/img/backgrounds/hero.jpg
backgrounds/IMG_1431.jpg            → public/img/backgrounds/parallax-strip.jpg
portfolio/2018-02-14-05.00.50-1.jpg → public/img/featured/featured-1.jpg
portfolio/2018-02-14-05.00.51-1.jpg → public/img/featured/featured-2.jpg
portfolio/2018-02-14-05.00.52-1.jpg → public/img/featured/featured-3.jpg
portfolio/2018-02-14-04.37.01-1.jpg → public/img/portfolio/red-sky.jpg
portfolio/2018-02-14-01.59.33-1.jpg → public/img/portfolio/silver-nail.jpg
portfolio/zuza.jpg                  → public/img/portfolio/golden-tail.jpg
portfolio/2018-02-14-04.37.02-1.jpg → public/img/portfolio/death-rose.jpg
portfolio/video-26-.gif             → public/img/portfolio/shining-star.gif
team/t_01.jpg                       → public/img/team/john.jpg
team/t_02.jpg                       → public/img/team/rebeca.jpg
team/t_03.jpg                       → public/img/team/stephen.jpg
blog-authors/blog-author-01.jpg     → public/img/blog/author-01.jpg
blog-authors/blog-author-02.jpg     → public/img/blog/author-02.jpg
blog-authors/blog-author-03.jpg     → public/img/blog/author-03.jpg
clients/client-logo-1.png           → public/img/clients/logo-1.png
clients/client-logo-14.png          → public/img/clients/logo-14.png
clients/client-logo-13.png          → public/img/clients/logo-13.png
clients/client-logo-8.png           → public/img/clients/logo-8.png
clients/client-logo-15.png          → public/img/clients/logo-15.png
clients/client-logo-6.png           → public/img/clients/logo-6.png
clients/client-logo-16.png          → public/img/clients/logo-16.png
clients/client-logo-4.png           → public/img/clients/logo-4.png
clients/client-logo-17.png          → public/img/clients/logo-17.png
clients/client-logo-10.png          → public/img/clients/logo-10.png
```

## Animation triggers used

Mapped to `rebuild/src/lib/animations.ts` register-functions:

| Legacy class                                    | Modern primitive          | Notes                                             |
| ----------------------------------------------- | ------------------------- | ------------------------------------------------- |
| `slide-up-intro` / `slide-up-intro__el`         | `mountIntro()` (one-shot) | runs once on load, no scroll trigger              |
| `fade-up-intro` / `fade-up-intro__el`           | `mountIntro()` (one-shot) | same                                              |
| `fade-down-intro` / `fade-down-intro__el`       | `mountIntro()` (one-shot) | same                                              |
| `hero_img-intro` / `hero_img-intro__el`         | `mountIntro()` (one-shot) | hero background reveal                            |
| `slide-up` / `slide-up__el` / `slide-up__lines` | `registerSlideUp()`       | scroll-triggered, opacity 0→1 + y +24px → 0       |
| `slide-up2` / `slide-up2__lines`                | `registerSlideUp()` (dly) | same with `data-slide-up2-delay`                  |
| `fade-up` / `fade-up__el`                       | `registerFadeUp()`        | scroll-triggered                                  |
| `fade-in` / `fade-in__el`                       | `registerFadeUp()` (no y) | opacity only                                      |
| `rotate-in` / `rotate-in__el`                   | `registerRotateIn()`      | scale .8 + opacity 0 → 1                          |
| `cover-d-r-img` / `cover-d-r-img__el`           | (deferred to Phase 1B)    | diagonal cover reveal — needs clip-path animation |
| `cover-up` / `cover-up__el`                     | (deferred to Phase 1B)    | upward cover reveal                               |
| `svg-draw` / `svg-draw__el`                     | `registerSvgDraw()`       | stroke-dasharray draw on scroll                   |
| `js-odometer--simple`                           | `registerOdometer()`      | counts to `data-number-end`                       |
| `parallax` + `parallax__el`                     | `registerParallaxBg()`    | bg image translateY on scroll                     |
