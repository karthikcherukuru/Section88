import { expect, test, type Locator } from "@playwright/test";
import { products } from "../../src/data/products";
import { productMedia } from "../../src/lib/media";

async function loaded(image: Locator, source?: string) {
  if (source) await expect(image).toHaveAttribute("src", new RegExp(encodeURIComponent(source).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute("data-loaded", "true");
  expect(await image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  if (source) expect(await image.getAttribute("src")).toContain(encodeURIComponent(source));
}

test("catalogue cards load each product's own front and back, crossfade and preserve their frames", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/shop");
  for (const product of products) {
    const link = page.locator(`.product-image-link[href="/products/${product.slug}"]`);
    const front = link.locator(":scope > .image-frame img");
    const back = link.locator(".product-alternate img");
    await loaded(front, productMedia(product)[0].src);
    await loaded(back, productMedia(product)[1].src);
    await expect(front).toHaveCSS("object-fit", "contain");
    await page.mouse.move(0, 0);
    const before = await link.boundingBox();
    await expect(link.locator(".product-alternate")).toHaveCSS("opacity", "0");
    await link.hover();
    await expect(link.locator(".product-alternate")).toHaveCSS("opacity", "1");
    await expect(link.locator(".product-alternate")).toHaveCSS("transition-duration", "0.3s");
    await expect(link.locator(".product-alternate")).toHaveCSS("transition-timing-function", "ease-out");
    const after = await link.boundingBox();
    expect(after?.width).toBe(before?.width);
    expect(after?.height).toBe(before?.height);
    expect(after!.width / after!.height).toBeCloseTo(4 / 5, 2);
    expect(await front.evaluate((node) => getComputedStyle(node).transform)).toBe("none");
  }
});

test("featured, related, search and Ink cart thumbnails reuse the confirmed front", async ({ page }) => {
  await page.goto("/");
  for (const card of await page.locator(".featured-collection .product-card").all()) {
    const href = await card.locator(".product-image-link").getAttribute("href");
    const product = products.find((item) => href?.endsWith(item.slug))!;
    await loaded(card.locator(".product-image-link > .image-frame img"), productMedia(product)[0].src);
    await card.locator(".product-image-link").hover();
    await expect(card.locator(".product-alternate")).toHaveCSS("opacity", "1");
  }
  await page.goto("/products/signal-study");
  for (const image of await page.locator(".product-grid-related .product-image-link > .image-frame img").all()) await loaded(image);
  await page.getByRole("button", { name: "Open search", exact: true }).click();
  const search = page.getByRole("dialog", { name: "Search", exact: true });
  await search.getByRole("textbox", { name: "Search the collection" }).fill("signal");
  await expect(search.locator(".search-results img")).toHaveCount(1);
  await loaded(search.locator(".search-results img"), productMedia(products[0])[0].src);
  await search.getByRole("textbox", { name: "Search the collection" }).press("Enter");
  await expect(page).toHaveURL(/search\?q=signal/);
  await loaded(page.locator(".product-image-link > .image-frame img"), productMedia(products[0])[0].src);
  await page.goto("/products/signal-study");
  await page.getByRole("button", { name: "Size M", exact: true }).click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  const bag = page.getByRole("dialog", { name: /Your bag/ });
  await loaded(bag.locator(".cart-line img"), productMedia(products[0])[0].src);
  await bag.getByRole("link", { name: /View shopping bag/ }).click();
  await loaded(page.locator("main .cart-line img"), productMedia(products[0])[0].src);
});

for (const product of products) {
  test(`${product.number} ${product.name}: four ordered views, thumbnails, zoom and gallery geometry`, async ({ page }) => {
    await page.goto(`/products/${product.slug}`);
    const main = page.locator(".gallery-main");
    const frame = main.locator(".image-frame");
    const dimensions = await frame.boundingBox();
    const media = productMedia(product);
    for (let view = 0; view < 4; view++) {
      await page.getByRole("button", { name: `Show ${media[view].label}`, exact: true }).click();
      await loaded(main.locator("img"), media[view].src);
      await expect(main).toContainText(`0${view + 1} / 04`);
      await expect(main.locator("img")).toHaveAttribute("alt", media[view].alt!);
      await expect(main.locator("img")).toHaveCSS("object-fit", "contain");
      expect((await frame.boundingBox())?.height).toBe(dimensions?.height);
      await main.getByRole("button", { name: /^Zoom/ }).click();
      const zoom = page.getByRole("dialog", { name: `${product.name} / image ${view + 1}`, exact: true });
      await loaded(zoom.locator("img"), media[view].src);
      await page.keyboard.press("Escape");
    }
    await main.getByRole("button", { name: "Next image", exact: true }).click();
    await expect(main).toContainText("01 / 04");
    await main.getByRole("button", { name: "Previous image", exact: true }).click();
    await expect(main).toContainText("04 / 04");
  });
}

test("Paper stays pending in gallery and bag; returning to Ink resets the image and keeps only valid sizes", async ({ page }) => {
  for (const product of products.filter((item) => item.colors.some((color) => color.id === "paper"))) {
    await page.goto(`/products/${product.slug}`);
    await page.getByRole("button", { name: "Size XXL", exact: true }).click();
    await page.getByRole("button", { name: "Next image", exact: true }).click();
    await page.getByRole("button", { name: "Color Paper", exact: true }).click();
    await expect(page.locator(".gallery-main img")).toHaveCount(0);
    await expect(page.locator(".gallery-main")).toContainText("Photography pending");
    await expect(page.locator(".gallery-main")).toContainText("01 / 04");
    await expect(page.getByRole("button", { name: "Size XXL unavailable", exact: true })).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("button", { name: "Size M", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    const bag = page.getByRole("dialog", { name: /Your bag/ });
    await expect(bag.locator(".cart-line img")).toHaveCount(0);
    await expect(bag.getByText("Photography pending", { exact: true }).first()).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Color Ink", exact: true }).click();
    await expect(page.locator(".gallery-main")).toContainText("01 / 04");
    await loaded(page.locator(".gallery-main img"), productMedia(product)[0].src);
    await expect(page.getByRole("button", { name: "Size M", exact: true })).toHaveAttribute("aria-pressed", "true");
  }
});

test("a failed front or hover image shows the pending fallback without an empty hover flash", async ({ page }) => {
  await page.route("**/_next/image?*", async (route) => {
    const source = new URL(route.request().url()).searchParams.get("url") ?? "";
    if (decodeURIComponent(source).includes("/Off Register/")) await route.abort();
    else await route.continue();
  });
  await page.goto("/shop");
  const card = page.locator('.product-image-link[href="/products/off-register"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator("img")).toHaveCount(0);
  await expect(card.locator(":scope > .image-frame")).toContainText("Photography pending");
  await card.hover();
  await expect(card.locator(".product-alternate")).toHaveCSS("opacity", "0");
});

test("touch devices keep fronts on hover, swipe through real media and keep purchase controls early", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/shop");
  const card = page.locator(".product-image-link").first();
  await loaded(card.locator(":scope > .image-frame img"));
  await card.hover();
  await expect(card.locator(".product-alternate")).toHaveCSS("opacity", "0");
  await page.goto("/products/open-channel");
  const media = productMedia(products[2]);
  const main = page.locator(".gallery-main");
  await expect(page.locator(".gallery-thumbnails")).not.toBeVisible();
  expect((await page.locator(".product-heading").boundingBox())!.y).toBeLessThan((await main.boundingBox())!.y);
  for (let view = 0; view < 4; view++) {
    await loaded(main.locator("img"), media[view].src);
    await expect(main).toContainText(`0${view + 1} / 04`);
    await main.evaluate((element) => {
      for (const [name, property, x] of [["touchstart", "touches", 280], ["touchend", "changedTouches", 50]] as const) {
        const event = new Event(name, { bubbles: true });
        Object.defineProperty(event, property, { value: [{ clientX: x, clientY: 240 }] });
        element.dispatchEvent(event);
      }
    });
  }
  await expect(main).toContainText("01 / 04");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
