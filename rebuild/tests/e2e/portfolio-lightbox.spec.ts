import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/* Behavior contract for the Portfolio lightbox (#16). Implementation-agnostic:
 * asserts the accessible modal dialog and the enlarged image the user sees, not
 * any PhotoSwipe-specific class. Survives a lightbox-library swap. The section
 * is scrolled into view first so the clicked thumbnail has actually loaded
 * (its natural size feeds the real dimensions path, not the fallback). */

const dialog = "[role='dialog']";

async function openFirst(page) {
  await page.locator("#portfolio").scrollIntoViewIfNeeded();
  // Let lazy thumbnails decode before opening.
  await page.waitForTimeout(300);
  await page.locator("#portfolio a").first().click();
  await expect(page.locator(dialog)).toBeVisible();
  // Let the open (fade) settle so focus lands in the dialog before we drive it.
  await page.waitForTimeout(450);
}

test.describe("Portfolio lightbox", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("clicking an item opens the lightbox with the enlarged image", async ({
    page,
  }) => {
    await openFirst(page);
    await expect(
      page.locator(`${dialog} img[src*='red-sky']`).first(),
    ).toBeVisible();
  });

  test("Escape closes the lightbox", async ({ page }) => {
    await openFirst(page);
    await page.keyboard.press("Escape");
    await expect(page.locator(dialog)).toBeHidden();
  });

  test("arrow key navigates to the next image", async ({ page }) => {
    await openFirst(page);
    await page.keyboard.press("ArrowRight");
    await expect(
      page.locator(`${dialog} img[src*='silver-nail']`).first(),
    ).toBeVisible();
  });

  test("no critical a11y violations while the lightbox is open", async ({
    page,
  }) => {
    await openFirst(page);
    const results = await new AxeBuilder({ page })
      .include("[role='dialog']")
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(serious).toEqual([]);
  });
});

test.describe("Portfolio lightbox — reduced motion", () => {
  test("opens and closes under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await openFirst(page);
    await page.keyboard.press("Escape");
    await expect(page.locator(dialog)).toBeHidden();
  });
});
