import { test, expect } from "@playwright/test";

const YEARLY_PRICES = [299, 899, 4599];

test.describe("Pricing billing toggle — yearly count-up", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-pricing-section]").scrollIntoViewIfNeeded();
  });

  test("yearly prices show correct final values after count-up", async ({
    page,
  }) => {
    await page
      .locator("[data-pricing-section] button", { hasText: /yearly/i })
      .click();
    // 1s animation + buffer
    await page.waitForTimeout(1300);

    const spans = page.locator("[data-yearly-price]");
    await expect(spans).toHaveCount(YEARLY_PRICES.length);

    for (let i = 0; i < YEARLY_PRICES.length; i++) {
      await expect(spans.nth(i)).toHaveText(
        YEARLY_PRICES[i].toLocaleString("en-US"),
      );
    }
  });

  test("count-up restarts correctly on re-toggle", async ({ page }) => {
    const yearlyBtn = page.locator("[data-pricing-section] button", {
      hasText: /yearly/i,
    });
    const monthlyBtn = page.locator("[data-pricing-section] button", {
      hasText: /monthly/i,
    });

    // First toggle to yearly
    await yearlyBtn.click();
    await page.waitForTimeout(1300);

    // Switch back to monthly, then yearly again
    await monthlyBtn.click();
    await page.waitForTimeout(400);
    await yearlyBtn.click();
    await page.waitForTimeout(1300);

    // After second yearly toggle, final values must still be correct
    const spans = page.locator("[data-yearly-price]");
    for (let i = 0; i < YEARLY_PRICES.length; i++) {
      await expect(spans.nth(i)).toHaveText(
        YEARLY_PRICES[i].toLocaleString("en-US"),
      );
    }
  });
});
