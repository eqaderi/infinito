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

// Offset of the first line below its mask's top edge, in px.
const firstLineOffset = (para: Locator) =>
  para
    .locator(".cover-transp__line")
    .first()
    .evaluate((line) => {
      const mask = line.parentElement as HTMLElement;
      return (
        line.getBoundingClientRect().top - mask.getBoundingClientRect().top
      );
    });

test.describe("cover-transp — per-line text reveal", () => {
  test("lines start clipped below their mask and wipe up on scroll", async ({
    page,
  }) => {
    await page.goto("/");

    // Deepest instance is safely below the fold at load, so it stays gated.
    const para = page.locator('[data-anim="cover-transp"]').last();
    await expect(para).toHaveAttribute("data-anim-shown", "");

    // Split into per-line wrappers, each held clipped below its mask.
    await expect
      .poll(() => para.locator(".cover-transp__line").count())
      .toBeGreaterThan(0);
    expect(await firstLineOffset(para)).toBeGreaterThan(5);

    await para.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Every line has wiped up to rest — flush with its mask, fully visible.
    expect(await firstLineOffset(para)).toBeLessThan(2);
    const notShown = await para
      .locator(".cover-transp__line")
      .evaluateAll(
        (els) =>
          els.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
            .length,
      );
    expect(notShown).toBe(0);
  });
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
      expect(await firstLineOffset(para)).toBeLessThan(2);
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
  });
});
