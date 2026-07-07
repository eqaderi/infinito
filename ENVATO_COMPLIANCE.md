# ENVATO_COMPLIANCE.md — Release Gate

> The single home for everything that must be true before the package is uploaded to ThemeForest. Owned by Phase 3, but §1 (the dependency ledger) is maintained continuously — every new dependency gets a row **at the moment it's added**, per `AGENTS.md`. Nothing here is optional; a submission with an open row below is blocked.

---

## 1. Dependency & asset license ledger (live — update on every add)

Rule: only licenses permitting **bundled commercial redistribution** may ship (MIT / BSD / ISC / Apache-2.0 / OFL / GSAP free license). GPL, "free for personal use", and paid plugins are forbidden in `package.json` and `dist/`.

| Dependency | Version | License | Verdict |
| --- | --- | --- | --- |
| astro | 6.x | MIT | ✅ (dev-only; not shipped) |
| tailwindcss / @tailwindcss/vite | 4.x | MIT | ✅ (compiled output ships) |
| alpinejs / @astrojs/alpinejs | 3.x | MIT | ✅ |
| gsap (+ ScrollTrigger, DrawSVG, SplitText) | 3.15+ | GSAP free (100% free incl. all plugins, Apr 2025) | ✅ |
| swiper | 12.x | MIT | ✅ |
| photoswipe | 5.x | MIT | ✅ (chosen specifically over lightGallery's paid redistribution license) |
| lucide | 1.x | ISC | ✅ |
| @fontsource/playfair-display, cormorant-garamond, josefin-sans, montserrat, roboto | 5.x | OFL-1.1 / Apache-2.0 (font upstreams) | ✅ — include each font's license text in `Licensing/` |
| vitest / @playwright/test / @axe-core/playwright / @lhci/cli | — | MIT/Apache | ✅ (dev-only; not shipped) |
| *(Phase 2)* three | current | MIT | ✅ when added — use `three/addons`, never CDN/CodePen copies |
| *(Phase 2)* pixi.js | v8+ | MIT | ✅ when added |

**Forbidden list (already decided, do not re-add):** MasterSlider (paid), lightGallery (paid redistribution for templates), Isotope (paid commercial license), Owl Carousel (abandoned — superseded by Swiper), any CDN-hotlinked script.

## 2. Image & media rights audit

- [ ] Every image/video that ships in `rebuild/public/` has a row in `Licensing/ASSET-CREDITS.md`: source, license, redistributable vs preview-only.
- [ ] Legacy photography of unknown origin is **replaced** with licensed/generated equivalents before submission — do not assume the 2017 files were cleared.
- [ ] Preview-only assets are flagged in the item description per Envato policy.
- [ ] Cinemagraph GIFs are converted to WebM+MP4 loops with posters (also a §6 budget requirement).

## 3. Licensing folder (ships in the zip)

`Licensing/` currently holds only the legacy license text. Before submission it must contain: license text for every ✅ row in §1 that ships in `dist/`, every font license, `ASSET-CREDITS.md`, and a top-level `CREDITS.md`. Cross-check: §1 table ↔ folder contents, 100% coverage.

## 4. Forms deliverable

Demo default stays **Formspree** (env-driven, graceful notice when unset). The final package additionally bundles a hardened **`php/mailer.php` + `config.sample.php`** (header-injection-proof, honeypot, JSON responses, PHP 8.x) for LAMP-hosting buyers, with setup docs. No personal email addresses or live endpoints anywhere in the package — grep before packaging.

## 5. RTL (decision: ship it — Phase 3)

Logical Tailwind utilities (`ms-*`/`me-*`/`start-*`/`end-*`) are preferred in all new code from now on (see `AGENTS.md` Tailwind gotchas). Phase 3 runs the sweep: convert remaining physical utilities, mirror direction-dependent icons, set slider `dir` handling, add a `dir="rtl"` Playwright smoke test per page. Only after that QA pass may RTL be advertised in the listing.

## 6. Performance & quality gates (verified on the release build, all pages)

- [ ] Lighthouse CI budgets green on **every** route (budgets live in `AGENTS.md`; config in `rebuild/lighthouserc.json`).
- [ ] Zero console errors/warnings on every page; broken-link crawl clean; W3C (vnu) validation clean — the top three soft-reject causes.
- [ ] axe-core scan clean (critical + serious) per page; keyboard-only pass on nav/drawer/lightbox/sliders/forms.
- [ ] `prefers-reduced-motion` verified per demo; WebGL demos show poster fallback with WebGL disabled.
- [ ] No WebGL on first paint anywhere; hero modules verified lazy via network trace.

## 7. Package assembly

- [ ] Zip contains: `dist/` (the buyer-ready static site), `src/` rebuild project + build instructions, `documentation/` (beginner-level HTML docs: quick start, customization via `data/index.ts` + theme tokens, forms, effect toggles, adding content, credits, changelog), `Licensing/`, `php/`.
- [ ] Zip **excludes**: `Final_Files/`, `working_dir/`, `Documentation/` (legacy), `node_modules/`, `test-results/`, `playwright-report/`, `.git`, baselines, source maps, `.DS_Store`/`__MACOSX` (run a junk sweep; note: the uploaded working zip contained both).
- [ ] Item title is brand-first ("Infinito — Creative Portfolio HTML Template"), no keyword stuffing or subjective words; description leads with the before/after performance numbers and the demo set.
- [ ] Preview images + thumbnail regenerated to Envato's current formatting standards; live-preview images watermarked.
- [ ] Tag `v1.0.0`; keep a branch open for the near-certain soft-reject iteration and handle reviewer feedback as issues, not ad-hoc edits.

## 8. Standing security items

- [ ] **Rotate/restrict the legacy Google Maps API key** (`Final_Files/*.html`, `key=AIzaSy…VZAtcI`). The rebuild doesn't use it, but it's live, billable, and sitting in a repo and old zips. Do this now, not at release.
- [ ] `.gitignore`: add `test-results/` and `playwright-report/`.
- [ ] Grep the release build for `AIzaSy`, `@gmail.`, `formspree.io/f/` (real IDs), and any other live credential before zipping.
