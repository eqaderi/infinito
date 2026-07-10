import { test, expect, type Locator } from "@playwright/test";

/* Contract for the `cover-transp` per-line text reveal (issue #9).
 * Behavior only — nothing about SplitText/GSAP internals.
 *
 * Legacy: `slide-up2__lines cover-transp` — text split into lines, each line
 * wipes up from inside a clip mask, staggered top→bottom on scroll into view.
 * Baseline: rebuild/docs/baseline/cover-transp/.
 *
 * Discriminating signal: a line's vertical offset inside its own clip mask.
 * Pre-reveal the line is pushed a full line-height below the mask (clipped,
 * invisible); once revealed it settles flush with the mask top. */

// Offset of the nth line below its mask's top edge, in px. Pre-reveal a line
// is pushed a full line-height below its mask (clipped); settled it is ~0.
const lineOffset = (para: Locator, nth: number) =>
  para
    .locator(".cover-transp__line")
    .nth(nth)
    .evaluate((line) => {
      const mask = line.parentElement as HTMLElement;
      return (
        line.getBoundingClientRect().top - mask.getBoundingClientRect().top
      );
    });

test.describe("cover-transp — per-line text reveal", () => {
  test("multi-line copy wipes up line-by-line, staggered top→bottom", async ({
    page,
  }) => {
    await page.goto("/");

    // Deepest instance is safely below the fold at load; it is a long,
    // multi-line paragraph so the per-line stagger is observable.
    const para = page.locator('[data-anim="cover-transp"]').last();
    const lines = para.locator(".cover-transp__line");

    // Split into MORE THAN ONE line — this is what distinguishes the per-line
    // reveal from the whole-block slide-up it replaces (which never splits).
    await expect.poll(() => lines.count()).toBeGreaterThan(1);
    const last = (await lines.count()) - 1;

    // All lines start clipped below their masks.
    expect(await lineOffset(para, 0)).toBeGreaterThan(5);
    expect(await lineOffset(para, last)).toBeGreaterThan(5);

    // Reveal, sampling the whole wipe in-page at frame cadence (no per-sample
    // round-trip, so the short window is never missed). During a top→bottom
    // stagger the last line lags the first, so their offsets diverge mid-wipe;
    // a zero-stagger (whole-block) reveal keeps every line in lockstep and the
    // peak spread stays ~0.
    await para.scrollIntoViewIfNeeded();
    const peakSpread = await para.evaluate((p) => {
      const ls = p.querySelectorAll<HTMLElement>(".cover-transp__line");
      const off = (el: HTMLElement) =>
        el.getBoundingClientRect().top -
        (el.parentElement as HTMLElement).getBoundingClientRect().top;
      const first = ls[0];
      const lastEl = ls[ls.length - 1];
      return new Promise<number>((resolve) => {
        let max = 0;
        const t0 = performance.now();
        const tick = () => {
          max = Math.max(max, off(lastEl) - off(first));
          if (performance.now() - t0 < 1800) requestAnimationFrame(tick);
          else resolve(max);
        };
        tick();
      });
    });
    expect(peakSpread).toBeGreaterThan(3);

    // Everything settles flush and fully visible.
    expect(await lineOffset(para, 0)).toBeLessThan(2);
    expect(await lineOffset(para, last)).toBeLessThan(2);
    const notShown = await lines.evaluateAll(
      (els) =>
        els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
          .length,
    );
    expect(notShown).toBe(0);
  });
});

test.describe("cover-transp — Team + Contact intro copy (issue #10)", () => {
  // Legacy marks both intro paragraphs `slide-up2__lines cover-transp` — a
  // per-line reveal. The rebuild previously animated them whole-block
  // (`slide-up`), which never splits. Assert each section's intro paragraph is
  // the per-line splitter, not the block reveal.
  for (const section of ["team", "contact"]) {
    test(`#${section} intro paragraph splits into lines`, async ({ page }) => {
      await page.goto("/");
      const para = page.locator(`#${section} p[data-anim="cover-transp"]`);
      await expect(para).toHaveCount(1);
      const lines = para.locator(".cover-transp__line");
      // >1 line is what distinguishes the per-line reveal from the whole-block
      // slide-up it replaces.
      await expect.poll(() => lines.count()).toBeGreaterThan(1);
    });
  }
});

test.describe("cover-transp — re-split on resize", () => {
  test("resizing re-splits without stale wrappers and keeps lines settled", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const para = page.locator('[data-anim="cover-transp"]').last();
    await para.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    const text = (await para.textContent())?.trim();

    // Narrow → wide → narrow forces re-splits at different line counts.
    for (const width of [360, 1280, 480]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(800);

      // Copy intact after every re-split.
      expect((await para.textContent())?.trim()).toBe(text);

      // Exactly one clip mask per line — no orphaned wrappers accumulating
      // (SplitText wraps each line as mask <div> > line <div>).
      const lines = await para.locator(".cover-transp__line").count();
      const wrappers = await para.locator("div").count();
      expect(lines).toBeGreaterThan(0);
      expect(wrappers).toBe(lines * 2);

      // Reveal survives the re-split: lines end flush with their mask.
      expect(await lineOffset(para, 0)).toBeLessThan(2);
    }
  });
});

test.describe("cover-transp — reduced motion", () => {
  test("full text is shown immediately, no scroll, no split required", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const para = page.locator('[data-anim="cover-transp"]').first();
    await expect(para).toHaveAttribute("data-anim-shown", "");
    await expect(para).toBeVisible();
    await expect(para).not.toBeEmpty();
    // The splitter is skipped entirely — no line wrappers injected.
    await expect(para.locator(".cover-transp__line")).toHaveCount(0);
  });
});
