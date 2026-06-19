import { test, expect, type Locator } from "@playwright/test";

/* Behavior contract for the Testimonials decorative quote-mark watermark
 * drawing in on scroll. Same primitive as the Featured numerals (svg-draw +
 * data-anim-fill), same observable signal: fill-opacity transitions from 0
 * (hidden) to 1 (solid) when scrolled into view. */

const QUOTE_PATH = '#testimonials [data-anim="svg-draw"] path';

const fillOpacityOf = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el).fillOpacity);

test.describe("svg-draw — Testimonials quote watermark reveal on scroll", () => {
  test("quote glyph starts hidden and fills in once scrolled into view", async ({
    page,
  }) => {
    await page.goto("/");

    const path = page.locator(QUOTE_PATH);
    await expect(path).toHaveCount(1);

    await expect.poll(() => fillOpacityOf(path)).toBe("0");

    await page.locator("#testimonials").scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect.poll(() => fillOpacityOf(path)).toBe("1");
  });
});

test.describe("svg-draw — Testimonials quote reduced motion", () => {
  test("quote glyph is solid immediately with no scroll/animation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const path = page.locator(QUOTE_PATH);
    await expect(path).toHaveCount(1);

    await expect.poll(() => fillOpacityOf(path)).toBe("1");
  });
});
