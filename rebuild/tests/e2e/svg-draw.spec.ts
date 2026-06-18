import { test, expect, type Locator } from "@playwright/test";

/* Behavior contract for the Featured giant numerals (01/02/03) drawing in
 * on scroll. Pins observable behavior only — says nothing about DrawSVG vs
 * stroke-dash or any other implementation.
 *
 * The discriminating signal is the path's fill-opacity: hidden (0) until the
 * numeral scrolls into view, then solid (1). Keying on this (not the
 * always-present data-anim-shown attribute) means the test fails if the
 * reveal stops firing on scroll. */

const NUMERAL_PATHS = '#featured [data-anim="svg-draw"] path';

const fillOpacityOf = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el).fillOpacity);

test.describe("svg-draw — Featured numerals reveal on scroll", () => {
  test("a below-fold numeral starts hidden and fills in once scrolled into view", async ({
    page,
  }) => {
    await page.goto("/");

    const paths = page.locator(NUMERAL_PATHS);
    await expect(paths).toHaveCount(3);

    // The last numeral is well below the fold, so its reveal has not fired.
    const last = paths.last();
    await expect.poll(() => fillOpacityOf(last)).toBe("0");

    await page.locator("#featured").scrollIntoViewIfNeeded();
    await last.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    await expect.poll(() => fillOpacityOf(last)).toBe("1");
  });
});

test.describe("svg-draw — reduced motion", () => {
  test("numerals are solid immediately with no scroll/animation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const paths = page.locator(NUMERAL_PATHS);
    await expect(paths).toHaveCount(3);

    // No scroll: every numeral is already filled (no hidden start, no draw).
    for (let i = 0; i < 3; i++) {
      await expect.poll(() => fillOpacityOf(paths.nth(i))).toBe("1");
    }
  });
});
