import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("Accessibility", () => {
  test("home page has no critical a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .disableRules(["color-contrast"])
      .analyze();

    const critical = results.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );

    expect(critical).toEqual([]);
  });
});
