import { test, expect } from "@playwright/test";

/* Cross-cutting contract for the one-shot scroll reveals (slide-up, fade-up,
 * fade-in, rotate-in). Pins the observable behavior only — says nothing about
 * GSAP vs IntersectionObserver vs CSS. The discriminating signal is the
 * data-anim-shown attribute: absent below the fold, present once scrolled
 * into view. This is the regression net that guards the reveal-engine swap. */

test.describe("reveal — one-shot scroll reveals", () => {
  test("a below-fold slide-up starts hidden and is revealed on scroll", async ({
    page,
  }) => {
    await page.goto("/");

    // Testimonials is deep below the fold; its header uses slide-up.
    const reveal = page.locator('#testimonials [data-anim="slide-up"]').first();
    await expect(reveal).not.toHaveAttribute("data-anim-shown", "");

    await page.locator("#testimonials").scrollIntoViewIfNeeded();
    await expect(reveal).toHaveAttribute("data-anim-shown", "", {
      timeout: 4000,
    });
  });
});

test.describe("reveal — reduced motion", () => {
  test("every reveal element is shown immediately with no scroll", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const anims = page.locator("[data-anim]");
    const total = await anims.count();
    expect(total).toBeGreaterThan(0);

    // No scroll: under reduced motion all animated elements are revealed.
    await expect
      .poll(() => page.locator("[data-anim]:not([data-anim-shown])").count())
      .toBe(0);
  });
});
