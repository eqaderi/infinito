import { test, expect } from "@playwright/test";

test.describe("cover-d-r-img — Featured image reveal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Featured images are revealed after scrolling through the section", async ({
    page,
  }) => {
    const items = page.locator('[data-anim="cover-d-r-img"]');
    const count = await items.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      await items.nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
    }

    const shown = page.locator(
      '[data-anim="cover-d-r-img"][data-anim-shown]',
    );
    await expect(shown).toHaveCount(3);
  });
});

test.describe("cover-up — Blog card reveal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Blog cards are revealed after scrolling into view", async ({
    page,
  }) => {
    const blog = page.locator("#blog");
    await blog.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);

    const shown = blog.locator('[data-anim="cover-up"][data-anim-shown]');
    await expect(shown).toHaveCount(3);
  });
});
