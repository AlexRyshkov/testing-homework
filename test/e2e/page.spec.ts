import { test, expect } from "@playwright/test";

const breakpoints = [
  { width: 360, height: 560 },
  { width: 640, height: 720 },
  { width: 1024, height: 900 },
  { width: 1280, height: 1024 },
];

test.describe("Страница", () => {
  test("вёрстка должна адаптироваться под ширину экрана", async ({ page }) => {
    await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);

    for (const breakpoint of breakpoints) {
      await page.setViewportSize(breakpoint);

      await expect(page).toHaveScreenshot(`page${breakpoint.width}w.png`, {
        maxDiffPixels: 10,
      });
    }
  });
});
