import { test, expect } from "@playwright/test";

test.describe("Каталог", () => {
  test("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", async ({
    request,
    page,
  }) => {
    await page.goto(`http://localhost:3000/hw/store/catalog?bug_id=${process.env.BUG_ID}`);

    const products = await request
      .get(`http://localhost:3000/hw/store/api/products?bug_id=${process.env.BUG_ID}`)
      .then((result) => result.json());

    for (const product of products) {
      const cardItem = await page
        .getByTestId(product.id)
        .locator(".ProductItem");

      expect(await cardItem.locator(".ProductItem-Name").textContent()).toBe(
        product.name
      );
      expect(await cardItem.locator(".ProductItem-Price").textContent()).toBe(
        `$${product.price}`
      );
      expect(
        await cardItem.locator(".ProductItem-DetailsLink").getAttribute("href")
      ).toBe(`/hw/store/catalog/${product.id}`);
    }
  });

  test('на странице с подробной информацией отображаются: название товара, описание, цена, цвет, материал и кнопка "добавить в корзину"', async ({
    request,
    page,
  }) => {
    const products = await request
      .get(`http://localhost:3000/hw/store/api/products?bug_id=${process.env.BUG_ID}`)
      .then((result) => result.json());

    for (const { id } of products.slice(0, 5)) {
      const fullProduct = await request
        .get(`http://localhost:3000/hw/store/api/products/${id}?bug_id=${process.env.BUG_ID}`)
        .then((result) => result.json());

      expect(id).toBe(fullProduct.id);

      await page.goto(
        `http://localhost:3000/hw/store/catalog/${fullProduct.id}?bug_id=${process.env.BUG_ID}`
      );

      expect(await page.locator(".ProductDetails-Name").textContent()).toBe(
        fullProduct.name
      );
      expect(
        await page.locator(".ProductDetails-Description").textContent()
      ).toBe(fullProduct.description);
      expect(await page.locator(".ProductDetails-Price").textContent()).toBe(
        `$${fullProduct.price}`
      );
      expect(await page.locator(".ProductDetails-Color").textContent()).toBe(
        fullProduct.color
      );
      expect(await page.locator(".ProductDetails-Material").textContent()).toBe(
        fullProduct.material
      );
      await expect(
        page.locator(".ProductDetails-AddToCart.btn.btn-primary.btn-lg")
      ).toHaveCount(1);
    }
  });
});
