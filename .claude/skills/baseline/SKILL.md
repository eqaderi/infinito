---
description: Capture the legacy baseline for an effect (REBUILD_METHODOLOGY step 3) — serve Final_Files, screenshot the key states into rebuild/docs/baseline/<effect>/, and log capture metadata. Usage; /baseline <effect-name> <legacy-page.html>
argument-hint: <effect-name> <legacy-page.html>
disable-model-invocation: true
allowed-tools: Read, Write, Glob, Grep, Bash(npx:*), Bash(node:*), Bash(git:*), Bash(mkdir:*), Bash(ls:*), Bash(kill:*)
---

# /baseline — capture a legacy reference

Arguments: `$ARGUMENTS` = effect name + the legacy HTML page that shows it (e.g. `/baseline distort index__04--distort.html`). If either is missing, list the T1/T2 effects from ANIMATION_AUDIT.md that still lack a folder under `rebuild/docs/baseline/` and ask which to capture.

This step is the point of no return for a blind rebuild — once the legacy source closes, its exact look survives only in these files. Be thorough, not fast.

## Procedure

1. **Guard:** if `rebuild/docs/baseline/<effect>/` already exists and is non-empty, STOP — baselines are immutable evidence (the guard hook enforces this too). Report and let the human decide.
2. Read the effect's row in ANIMATION_AUDIT.md ("What it does") to learn its trigger, states, and interactions — that dictates WHICH states to capture.
3. Serve the legacy statically: `npx serve Final_Files -l 4173 &` (or `npx http-server`). Verify it responds before capturing.
4. Write a throwaway Playwright script (in `/tmp`, never committed) using the repo's installed `@playwright/test` Chromium. Capture per REBUILD_METHODOLOGY step 3:
   - `initial.png` — page loaded, before any interaction, after network idle + a settle delay (legacy is slow; wait for its preloader to clear).
   - Motion states: for scroll effects, screenshots at documented scroll offsets (`scroll-25.png`, `scroll-50.png`, …); for timed/looping effects, frames at documented timestamps (`t1500ms.png`, …); for pointer effects, screenshots with the mouse at center / corner / mid-gesture (`hover-center.png`, `pointer-topleft.png`, …). 3–6 frames minimum, per the audit's description of the effect.
   - For anything continuously animated (WebGL, canvas, video), also record a short clip via Playwright's video recording (`recordVideo`), saved as `motion.webm`.
   - Viewport 1440×900 desktop; add 390×844 mobile shots if the effect renders differently there.
5. Write `capture-notes.md` in the folder: date, page URL, viewport, exactly what each frame's state is (scroll offset / timestamp / pointer position), and any quirks observed (e.g. "preloader takes ~3s", "effect only starts after first pointermove").
6. Kill the server. `git add rebuild/docs/baseline/<effect>/` and commit as `docs(baseline): capture <effect> legacy reference` — baselines merge via a normal PR like everything else.
7. Report: frame list, anything you could NOT capture faithfully (e.g. an interaction Playwright can't reproduce), flagged for the human to capture manually.

Never retouch, crop, or "improve" captures. They are evidence, not assets.
