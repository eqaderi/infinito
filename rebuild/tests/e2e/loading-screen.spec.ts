import { test, expect, type Locator } from "@playwright/test";

/* Behavior contract for the LoadingScreen "infinito" wordmark drawing itself
 * in on page load (legacy §6.1 SVG draw-on intro) instead of snapping in.
 *
 * Pins observable behavior only — says nothing about DrawSVG vs stroke-dash.
 * The discriminating signal is the glyph paths' fill-opacity: they draw their
 * outline then fill to solid (1). Keying on fill-opacity (not a presence
 * attribute) means the test fails if the wordmark ever snaps in without the
 * draw. The loader must also disappear after the sequence so it never traps
 * the page. */

const WORDMARK_PATHS = "#loading-screen [data-loader-word] path";

const fillOpacityOf = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el).fillOpacity);

const loaderHidden = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const el = document.querySelector<HTMLElement>("#loading-screen");
    if (!el) return true;
    const cs = getComputedStyle(el);
    return cs.display === "none" || cs.opacity === "0";
  });

test.describe("LoadingScreen — wordmark draws in", () => {
  test("the wordmark is an SVG whose glyphs fill in, then the loader hides", async ({
    page,
  }) => {
    await page.goto("/");

    // The wordmark is drawable SVG geometry, not a plain snapping text node.
    const paths = page.locator(WORDMARK_PATHS);
    await expect(paths.first()).toBeAttached();

    // The draw completes: every glyph ends solid (fill-opacity 1)…
    const count = await paths.count();
    for (let i = 0; i < count; i++) {
      await expect.poll(() => fillOpacityOf(paths.nth(i)), {
        timeout: 8000,
      }).toBe("1");
    }

    // …and the loader gets out of the way once the intro is done.
    await expect.poll(() => loaderHidden(page), { timeout: 8000 }).toBe(true);
  });
});

test.describe("LoadingScreen — reduced motion", () => {
  test("wordmark is solid immediately and the loader still hides", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const paths = page.locator(WORDMARK_PATHS);
    await expect(paths.first()).toBeAttached();

    // No draw: glyphs are already filled (never stuck at drawSVG:0 / opacity 0).
    const count = await paths.count();
    for (let i = 0; i < count; i++) {
      await expect.poll(() => fillOpacityOf(paths.nth(i))).toBe("1");
    }

    await expect.poll(() => loaderHidden(page), { timeout: 8000 }).toBe(true);
  });
});
