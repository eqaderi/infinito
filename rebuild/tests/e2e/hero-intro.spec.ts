import { test, expect } from "@playwright/test";

/* Above-the-fold contract (issue #43): the hero entrance must never be gated
 * behind the JS animation runtime. LCP is the hero <h1>; if it sits at
 * opacity:0 until GSAP boots (~2.4s under CPU throttle), FCP — and therefore
 * LCP — can't beat that boot. These tests pin the observable invariant:
 * the hero paints from CSS at parse, independent of the animation module.
 * The performance budget itself lives in lighthouserc.json (the real contract);
 * these guard against a regression that re-introduces the JS gate. */

test.describe("hero intro — not gated behind JS", () => {
  test("hero h1 paints even when the animation runtime never loads", async ({
    page,
  }) => {
    // Abort external JS bundles so GSAP never boots and never sets
    // [data-anim-shown]. The inline boot script (is:inline) still runs and adds
    // `has-anim`, so the FOUC gate is active. Pre-fix the h1 stays opacity:0
    // forever; post-fix the CSS intro animation reveals it.
    await page.route("**/*.js", (route) => route.abort());
    await page.goto("/");

    const h1 = page.locator("#hero h1");
    await expect(h1).toHaveCSS("opacity", "1", { timeout: 3000 });
  });

  test("hero h1 is visible with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    const h1 = page.locator("#hero h1");
    await expect(h1).toHaveCSS("opacity", "1");
    await context.close();
  });
});
