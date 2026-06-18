import { test, expect } from "@playwright/test";

test.describe("Nav drawer", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("hamburger opens the drawer; toggling again closes it", async ({
    page,
  }) => {
    const toggle = page.getByRole("button", { name: "Toggle menu" });
    const drawer = page.locator("aside");

    await toggle.click();
    await expect(drawer).toHaveClass(/visible/);

    await toggle.click();
    await expect(drawer).toHaveClass(/invisible/);
  });

  test("ESC closes the drawer", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Toggle menu" });
    const drawer = page.locator("aside");

    await toggle.click();
    await expect(drawer).toHaveClass(/visible/);

    await page.keyboard.press("Escape");
    await expect(drawer).toHaveClass(/invisible/);
  });
});

test.describe("Search overlay", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("search button opens overlay with focused input", async ({ page }) => {
    const searchBtn = page.getByRole("button", { name: "Search" });
    await searchBtn.click();

    const input = page.locator('input[type="search"]');
    await expect(input).toBeVisible();
    await expect(input).toBeFocused({ timeout: 2000 });
  });
});
