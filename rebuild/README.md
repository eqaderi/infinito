# Infinito — Rebuild

The modern rebuild on **Astro + Tailwind + Alpine + GSAP 3**. All new product work lives in this folder.

The legacy template (`../Final_Files/`, `../working_dir/`, `../Documentation/`) is the design and interaction reference — never modified.

## Commands (run from this folder)

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321 |
| `npm run build` | Static build to `./dist/` |
| `npm run preview` | Preview the production build |

## What to read

This file is intentionally thin to avoid duplicating the docs that own each topic:

- **Conventions, architecture, gotchas, docs router** → [`../CLAUDE.md`](../CLAUDE.md)
- **Repo overview + getting started** → [`../README.md`](../README.md)
- **Live status & backlog** → [`docs/PHASE_1A_STATUS.md`](docs/PHASE_1A_STATUS.md)
- **How we rebuild (the loop + contracts)** → [`../REBUILD_METHODOLOGY.md`](../REBUILD_METHODOLOGY.md)

Quick orientation: design tokens are in `src/styles/global.css`, the Tailwind theme in `tailwind.config.mjs`, and all home-page copy in `src/data/index.ts`.
