import { test, expect } from "@playwright/test";

/* Behavior contract for the Testimonials carousel (#13 Swiper migration).
 * Implementation-agnostic: says nothing about Swiper classes or internals.
 * The observable signal for a fade carousel is which slide the user actually
 * sees — the active slide renders at opacity 1, the rest at opacity 0. Slides
 * are addressed by their own [data-quote] hook, not by any library class. */

const AUTHORS = ["Justin Ronaldo", "James Mattis", "Tess Brighton"];

/* Index of the slide currently shown to the user (opacity 1). */
async function shownIndex(page) {
  const slides = page.locator("#testimonials [data-quote]");
  const n = await slides.count();
  for (let i = 0; i < n; i++) {
    const op = await slides.nth(i).evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    if (op > 0.9) return i;
  }
  return -1;
}

test.describe("Testimonials carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#testimonials").scrollIntoViewIfNeeded();
  });

  test("first quote is shown on load", async ({ page }) => {
    await expect(page.locator("#testimonials [data-quote]")).toHaveCount(
      AUTHORS.length,
    );
    await expect.poll(() => shownIndex(page)).toBe(0);
    await expect(page.locator("#testimonials")).toContainText(AUTHORS[0]);
  });

  test("next / prev buttons advance the carousel", async ({ page }) => {
    const next = page.locator('#testimonials [aria-label="Next testimonial"]');
    const prev = page.locator(
      '#testimonials [aria-label="Previous testimonial"]',
    );

    await next.click();
    await expect.poll(() => shownIndex(page)).toBe(1);

    await next.click();
    await expect.poll(() => shownIndex(page)).toBe(2);

    await prev.click();
    await expect.poll(() => shownIndex(page)).toBe(1);
  });

  test("pagination bullets jump to a slide", async ({ page }) => {
    const bullets = page.locator("#testimonials [data-pagination] button");
    await expect(bullets).toHaveCount(AUTHORS.length);

    await bullets.nth(2).click();
    await expect.poll(() => shownIndex(page)).toBe(2);

    await bullets.nth(0).click();
    await expect.poll(() => shownIndex(page)).toBe(0);
  });

  test("keyboard arrows advance when carousel is focused", async ({ page }) => {
    const next = page.locator('#testimonials [aria-label="Next testimonial"]');
    await next.focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => shownIndex(page)).toBe(1);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => shownIndex(page)).toBe(0);
  });
});

test.describe("Testimonials carousel — reduced motion", () => {
  test("first quote shown and navigation still works", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator("#testimonials").scrollIntoViewIfNeeded();

    await expect.poll(() => shownIndex(page)).toBe(0);
    await page.locator('#testimonials [aria-label="Next testimonial"]').click();
    await expect.poll(() => shownIndex(page)).toBe(1);
  });
});
