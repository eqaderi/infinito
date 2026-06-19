import { test, expect } from "@playwright/test";

/* Behavior contract for the Process timeline carousel (#14 Swiper migration).
 * The panels carry identical placeholder copy, so the observable signal is the
 * timeline itself — which step label is current and how far the progress line
 * has advanced. These are the component's actual deliverable per the issue
 * ("preserve dot+label click targets and progress line"). Addressed by our own
 * [data-step] / [data-active] / [data-progress-fill] hooks, not Swiper classes. */

const LABELS = ["1997: Est.", "2001: growing", "2006: reputation", "2018: success"];

function progressWidth(page) {
  return page
    .locator("[data-process] [data-progress-fill]")
    .evaluate((el) => el.getBoundingClientRect().width);
}

/* The fill animates over 500ms; poll until the width stops changing so we
   compare settled values, not mid-transition frames. */
async function settledWidth(page) {
  let prev = -1;
  for (let i = 0; i < 12; i++) {
    const w = await progressWidth(page);
    if (Math.abs(w - prev) < 0.5) return w;
    prev = w;
    await page.waitForTimeout(80);
  }
  return prev;
}

test.describe("Process timeline carousel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("[data-process]").scrollIntoViewIfNeeded();
  });

  test("renders one panel per step", async ({ page }) => {
    await expect(page.locator("[data-process] [data-step-panel]")).toHaveCount(
      LABELS.length,
    );
    await expect(page.locator("[data-process] [data-step]")).toHaveCount(
      LABELS.length,
    );
  });

  test("first step is current on load, progress starts at zero", async ({
    page,
  }) => {
    const steps = page.locator("[data-process] [data-step]");
    await expect(steps.nth(0)).toHaveAttribute("data-active", "");
    await expect(steps.nth(1)).not.toHaveAttribute("data-active", "");
    expect(await progressWidth(page)).toBeLessThanOrEqual(1);
  });

  test("clicking a label advances the timeline and the progress line", async ({
    page,
  }) => {
    const steps = page.locator("[data-process] [data-step]");

    await steps.nth(3).click();
    await expect(steps.nth(3)).toHaveAttribute("data-active", "");
    await expect(steps.nth(0)).not.toHaveAttribute("data-active", "");
    const wide = await settledWidth(page);
    expect(wide).toBeGreaterThan(1);

    await steps.nth(1).click();
    await expect(steps.nth(1)).toHaveAttribute("data-active", "");
    const narrow = await settledWidth(page);
    expect(narrow).toBeLessThan(wide);
  });

  test("step controls are keyboard operable", async ({ page }) => {
    const steps = page.locator("[data-process] [data-step]");
    await steps.nth(2).focus();
    await page.keyboard.press("Enter");
    await expect(steps.nth(2)).toHaveAttribute("data-active", "");
  });
});

test.describe("Process timeline carousel — reduced motion", () => {
  test("clicking a label still activates it", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.locator("[data-process]").scrollIntoViewIfNeeded();

    const steps = page.locator("[data-process] [data-step]");
    await steps.nth(2).click();
    await expect(steps.nth(2)).toHaveAttribute("data-active", "");
  });
});
