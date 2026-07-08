---
description: Run one iteration of the Infinito work loop — wrap the previous merged ticket, pick the next one from the pinned Execution order issue, build it per the methodology, open an auto-merging PR, and stop at the human gate.
disable-model-invocation: true
allowed-tools: Read, Edit, Write, Glob, Grep, Bash(git:*), Bash(gh:*), Bash(npm:*), Bash(npx:*)
---

# /next — one loop iteration

You are running one full iteration of the delivery loop for this repo. AGENTS.md governs everything here; if this file and AGENTS.md ever disagree, AGENTS.md wins. **One ticket per invocation. Never two.**

## Phase 0 — Sync & wrap the previous ticket

1. `git checkout main && git pull`. If the working tree is dirty, STOP and report — never start a ticket on top of uncommitted work.
2. If any PR authored by this loop is still open (`gh pr list --author @me`), STOP and report its number — the human hasn't merged yet; do not stack work.
3. Find the roadmap: the open issue titled "🗺 Execution order" (`gh api repos/{owner}/{repo}/issues?state=open&per_page=100`, match on title). Store its number as ROADMAP.
4. Housekeeping on ROADMAP's body (this is the step humans forget — you never do):
   - For every `- [ ]` line whose referenced issue(s) are ALL closed, flip to `- [x]`. Lines referencing several issues (e.g. `#8 · #11 · #20 · #22`) tick only when every one is closed.
   - For every epic whose sub-issues are all closed (`gh api repos/{owner}/{repo}/issues/N` → `sub_issues_summary.completed == total`), close the epic with a one-line completion comment, then tick its roadmap line.
   - PATCH the updated body back with `gh api repos/{owner}/{repo}/issues/$ROADMAP -X PATCH -f body=...`.

## Phase 1 — Pick the next ticket

1. Read ROADMAP's body top to bottom. The next ticket is the **first unchecked line above the first unmet 🚧 gate**. Gates are hard walls: if everything above a gate is checked but the gate's condition isn't verifiably true, STOP and report what the gate needs.
2. If the line is a human-only action (fidelity sign-off, a gate check, anything AGENTS.md reserves for humans), STOP and tell the human exactly what to do and where.
3. Otherwise open the issue (`gh issue view N`), read its body, its parent epic, and the docs its labels imply (ANIMATION_AUDIT row for effects, index-section-map for sections, ENVATO_COMPLIANCE for release-gate items). Comment on the issue: "Starting — /next loop, <date>."
4. State a one-paragraph plan before touching code.

## Phase 2 — Build (REBUILD_METHODOLOGY is law)

- **Visual behavior?** Verify `rebuild/docs/baseline/<effect>/` exists first. If the baseline is missing, capture it now (serve `Final_Files/` locally) — or if that's impossible in this environment, STOP and ask the human to run the capture. Never rebuild a visual blind without a captured reference.
- Contract first: write the failing Vitest/Playwright test from the issue's stated contract before implementing.
- Then go implementation-blind and build the simplest thing that passes, per the grug rules in AGENTS.md.
- Verify library APIs against the INSTALLED version (`node_modules/*/dist/*.d.ts` or a 10-line spike) — never from memory.
- Verify locally: `npm run build`, `npm run test`, and `npm run test:perf` when routes/styles/scripts changed.
- Discovered problems outside this ticket's scope: comment them on the current issue prefixed "Discovered:" — do not fix them, do not open issues unprompted.

## Phase 3 — PR

1. Branch `feat/issue-N-<slug>` (or `fix/`/`docs/` as appropriate), conventional commits.
2. **Same-PR documentation:** update `rebuild/docs/PHASE_1A_STATUS.md` (live narrative) and any doc whose single-home fact this change alters (docs router in AGENTS.md). Doc drift is a bug; the PR that changes reality updates the record.
3. `gh pr create` with:
   - Title matching the issue; body starting with `Closes #N`.
   - **Evidence section** (non-negotiable per AGENTS.md): test run output, LHCI numbers for touched routes, and for anything visual a side-by-side of new render vs. baseline frames.
   - The attestations from `.github/pull_request_template.md`, answered honestly.
4. `gh pr merge --auto --squash` — the PR merges itself the moment CI is green AND the human approves. You never merge directly and never bypass review.
5. Visual tickets: also post the side-by-side on the corresponding fidelity sign-off issue and say sign-off is awaited there.

## Phase 4 — Stop & report

End with exactly this shape, then stop:

- **Done:** what was built, one paragraph.
- **Awaiting human:** PR #N (review/approve), plus any fidelity sign-off issue.
- **On deck:** which roadmap line the next `/next` will pick up.

Do not start the next ticket. Do not "quickly also" anything. The loop's integrity is worth more than one extra ticket of throughput.
