# Infinito — Rebuild

Modern rebuild of the Infinito HTML template, on Astro + Tailwind + Alpine + GSAP.

The **legacy source** lives alongside this folder under
`../Final_Files/`, `../working_dir/`, and `../Documentation/`.
It is preserved as the design and interaction reference for the rebuild
and is not modified by this project.

See [`../MODERNIZATION_PLAN.md`](../MODERNIZATION_PLAN.md) and
[`../ANIMATION_AUDIT.md`](../ANIMATION_AUDIT.md) for the overall plan.

## Stack

- [Astro](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com) v3 — utility-first styling
- [Alpine.js](https://alpinejs.dev) — lightweight interactivity
- [GSAP](https://gsap.com) 3 — animation runtime (core + ScrollTrigger; free tier)
- [Lucide](https://lucide.dev) — icons
- `@fontsource/*` — self-hosted fonts (Playfair Display, Montserrat, Roboto, Josefin Sans)

## Commands

All commands run from `rebuild/`.

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm install`     | Install dependencies                  |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Static build to `./dist/`             |
| `npm run preview` | Preview the production build locally  |

## Project layout

```
rebuild/
  src/
    pages/        Astro pages (routes)
    layouts/      Shared layouts
    components/   Reusable components (Phase 1+)
    styles/       global.css (tokens) + fonts.css (@fontsource)
    lib/          JS utilities (animation primitives, form helpers, …)
  public/         Static assets copied verbatim into the build
  astro.config.mjs
  tailwind.config.mjs
  tsconfig.json
  package.json
```

## Design tokens

- CSS custom properties live in [`src/styles/global.css`](src/styles/global.css):
  `--accent-from`, `--accent-to`, `--accent-text`, the easing curves, and
  page-transition tokens.
- Tailwind theme mapping in [`tailwind.config.mjs`](tailwind.config.mjs)
  (fonts, colors, breakpoints, z-index scale).
- Alternate palettes are scoped under `[data-theme="..."]` — these replace
  the legacy 19 `gradient--NN.css` files.

## Status

**Phase 0 — scaffold.** The current home page (`/`) is a smoke-test
validating fonts, color tokens, GSAP animation, Alpine interactivity,
Lucide icons, and the theme switcher. Real demos and components arrive
in Phase 1.
