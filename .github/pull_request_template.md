## What & why

<!-- What behavior/feature/fix does this PR deliver, and why. Link the doc/backlog item if relevant. -->

## Rebuild methodology checklist

CI verifies build + tests are green. This checklist covers what CI **can't**: that the
behavior-first, implementation-blind loop was actually followed. See `AGENTS.md` and
`REBUILD_METHODOLOGY.md`.

- [ ] **Contract first** — a test pins this behavior (Vitest / Playwright / axe). For a bug, the regression test was written first.
- [ ] **Built blind** — no legacy code copied; rebuilt against the contract + visual reference. Minimal, idiomatic code (grug).
- [ ] **Reduced motion** — `prefers-reduced-motion` fully reveals content with no animation.
- [ ] **Accessibility** — keyboard-reachable; ARIA on icon-only controls; focus visible.
- [ ] **Green locally** — `npm run build` and `npm run test` pass from `rebuild/`.
- [ ] **Docs** — live status / backlog updated in `rebuild/docs/PHASE_1A_STATUS.md` if this changes what's built.

## Notes for the reviewer

<!-- Trade-offs, anything intentionally deferred, parts that need a closer look. -->
