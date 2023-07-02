import { test, expect } from "@playwright/test";

test.describe("Корзина", () => {
  test("При оформлении заказа появляется сообщение с валидным номером заказа", async ({
    page,
    request,
  }) => {
    await page.goto(
      `http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`
    );
    await page.getByText("Add to Cart").click();

    await page.goto(
      `http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`
    );

    await page.locator("#f-name").fill("Ivan Ivanov");
    await page.locator("#f-phone").fill("12345678910");
    await page.locator("#f-address").fill("Address");

    await page.locator(".Form-Submit").click();

    await expect(await page.locator(".Cart-Number")).toHaveCount(1)
    const orderNumber = await page.locator(".Cart-Number").textContent();

    const latestOrders = await request
      .get(
        `http://localhost:3000/hw/store/api/orders?bug_id=${process.env.BUG_ID}`
      )
      .then((result) => result.json());

    expect(orderNumber).toBe((latestOrders[latestOrders.length - 1]?.id).toString());
  });

  test("Если данные в форме потверждения заказа не валидны, то должно появляться сообщение об ошибке", async ({
    page,
  }) => {
    await page.goto(
      `http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`
    );
    await page.getByText("Add to Cart").click();

    await page.goto(
      `http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`
    );

    await page.locator("#f-name").fill("    ");
    await page.locator("#f-phone").fill("2123");
    await page.locator("#f-address").fill("    ");

    await page.locator(".Form-Submit").click();

    await expect(page.locator(".Form")).toHaveScreenshot({
      mask: [page.locator("input")],
      maxDiffPixels: 100,
    });
  });

  test("содержимое корзины должно сохраняться между перезагрузками страницы", async ({
    page,
  }) => {
    await page.goto(
      `http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`
    );
    await page.getByText("Add to Cart").click();

    await page.goto(
      `http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`
    );
    await page.reload();

    expect(await page.getByText(/Cart is empty/).count()).toBe(0);
  });

  test("При потверждении заказа, должно появляться сообщение об успешном заказе", async ({page}) => {
    await page.goto(
      `http://localhost:3000/hw/store/catalog/0?bug_id=${process.env.BUG_ID}`
    );
    await page.getByText("Add to Cart").click();

    await page.goto(
      `http://localhost:3000/hw/store/cart?bug_id=${process.env.BUG_ID}`
    );

    await page.locator("#f-name").fill("Ivan Ivanov");
    await page.locator("#f-phone").fill("12345678910");
    await page.locator("#f-address").fill("address");

    await page.locator(".Form-Submit").click();

    await expect(page.locator(".Cart-SuccessMessage.alert.alert-success")).toHaveCount(1);
    await expect(page.locator(".Cart-SuccessMessage.alert.alert-success")).toHaveScreenshot({
      mask: [page.getByText(/Order #/)],
      maxDiffPixels: 100,
    });
  });
});
