import { test, expect } from "@playwright/test";
test.describe("Шапка", () => {
  test("в шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/hw/store/");
    await expect(page.locator(".navbar")).toHaveScreenshot("navbar.png", {
      mask: [page.getByText(/Cart/)],
      maxDiffPixels: 10,
    });
  });

  test(`на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("http://localhost:3000/hw/store/");
    await expect(page.locator(".navbar")).toHaveScreenshot(
      "navbar.mobile.png",
      {
        maxDiffPixels: 10,
      }
    );
  });

  test(`при выборе элемента из меню "гамбургера", меню должно закрываться`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto(`http://localhost:3000/hw/store?bug_id=${process.env.BUG_ID}`);
    await page.locator(".Application-Toggler").click();
    await page.locator(`.nav-link`).first().click();
    await expect(page.locator(".navbar")).toHaveScreenshot(
      "navbar.mobile.png",
      {
        maxDiffPixels: 10,
      }
    );
  });
});
