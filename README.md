# Infinito

> Modernization of the **Infinito** premium HTML template into a sellable Envato product on a clean Astro + Tailwind + Alpine + GSAP stack — preserving the legacy template's visual identity and animation breadth, retiring the dead weight, and adding the polish (typography, copy, accessibility, performance) the original lacked.

## Repo layout

```
infinito/
├── Final_Files/             # Legacy distribution (74 HTML, 97 CSS, 69 JS) — UNTOUCHED
├── working_dir/             # Legacy source tree (Grunt-based) — UNTOUCHED
├── Documentation/           # Legacy single-page docs — UNTOUCHED
├── Licensing/               # Legacy license text — UNTOUCHED
│
├── rebuild/                 # ⬅ The new product. All new work goes here.
│   ├── src/
│   │   ├── pages/           # Astro routes (currently: /, /_smoke)
│   │   ├── layouts/         # BaseLayout (head, fonts, animation boot)
│   │   ├── components/
│   │   │   ├── shell/       # Tier A — Nav, Footer, PageShell, LoadingScreen
│   │   │   ├── sections/    # Tier B — 15 home-page section components
│   │   │   └── atoms/       # Tier D — Button, Input, Textarea, GradientText, etc.
│   │   ├── lib/             # animations.ts (GSAP/ScrollTrigger primitives)
│   │   ├── data/            # index.ts — single source of truth for all home-page copy
│   │   └── styles/          # global.css, fonts.css, design tokens
│   ├── public/img/          # Migrated assets (selectively copied from legacy)
│   ├── docs/                # Internal working docs (section maps, phase status)
│   ├── astro.config.mjs
│   ├── tailwind.config.mjs
│   └── package.json
│
├── MODERNIZATION_PLAN.md    # Audit & migration strategy (start here)
├── ANIMATION_AUDIT.md       # Per-effect inventory, tiering, replacement plan
└── README.md                # This file
```

The legacy folders (`Final_Files/`, `working_dir/`, `Documentation/`) are treated as the canonical design and interaction reference for the rebuild and are not modified.

## Status

**Current phase:** Phase 1A — vertical slice of the home page (`/`). Validates the architecture top-to-bottom on one route before scaling to the rest.

- ✅ Phase 0 — Foundation (Astro + Tailwind + Alpine + GSAP, design tokens, fonts, animation primitives).
- ✅ Phase 1A — Home-page rebuild (15 sections, centralized data, asset migration, full integration, in-browser verification + bug-fix pass).
- ⏳ Phase 1B — Animation parity (cover/reveal animations, draw-in numerals, marquee logos), inner-page rebuild, polish.
- ⏳ Phase 2 — Marquee hero effects (Tier 1 WebGL: tilt, video rotator, ripples, distort, fluid).
- ⏳ Phase 3 — Secondary effects, docs site, Envato submission package.

For detailed Phase 1A status (everything built, today's fix log, known remaining issues, next-day backlog) see **[`rebuild/docs/PHASE_1A_STATUS.md`](rebuild/docs/PHASE_1A_STATUS.md)**.

## Getting started

```bash
cd rebuild
npm install
npm run dev          # starts Astro dev server at http://localhost:4321
npm run build        # static build → rebuild/dist/
npm run preview      # serves the built output
```

Optional environment variables (`rebuild/.env`):

```
PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/<your-id>
```

If unset, the contact and subscribe forms render with a small inline notice instructing the buyer to set the variable.

## Editing content

All home-page copy and asset paths live in **[`rebuild/src/data/index.ts`](rebuild/src/data/index.ts)** as typed exports (`hero`, `about`, `featured`, `services`, `portfolio`, `team`, `pricing`, `testimonials`, `logos`, `contact`, etc.). A buyer can rebrand the demo by editing only this file.

## Documentation

- **[`MODERNIZATION_PLAN.md`](MODERNIZATION_PLAN.md)** — the audit, migration strategy, phased roadmap, and risk list. The "Implementation Progress" section near the top tracks live status.
- **[`ANIMATION_AUDIT.md`](ANIMATION_AUDIT.md)** — per-effect inventory of every legacy animation with a tiered replacement plan. The "Implementation Status" section near the top tracks which primitives are now live.
- **[`rebuild/docs/index-section-map.md`](rebuild/docs/index-section-map.md)** — section-by-section reference extracted from `Final_Files/index.html` while building the rebuild.
- **[`rebuild/docs/PHASE_1A_STATUS.md`](rebuild/docs/PHASE_1A_STATUS.md)** — current phase handoff: components built, fix log, known issues, next-day backlog.
