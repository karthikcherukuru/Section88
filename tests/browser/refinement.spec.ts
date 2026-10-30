import { expect, test } from "@playwright/test";

test("homepage curates four pieces and mobile product context precedes photography", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".featured-collection .product-card")).toHaveCount(4);
  await page.goto("/products/signal-study");
  const title = await page.locator("main h1").boundingBox();
  const gallery = await page.locator(".gallery-main").boundingBox();
  expect(title!.y + title!.height).toBeLessThan(gallery!.y);
  expect(title!.y).toBeLessThan(400);
  await expect(page.locator(".gallery-thumbnails")).not.toBeVisible();
  await page.getByRole("button", { name: "Color Paper", exact: true }).click();
  await expect(page.getByRole("button", { name: "Color Paper", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".gallery-main .slot-top")).toContainText("PAPER");
  await expect(page.getByRole("button", { name: "Size XXL unavailable", exact: true })).toBeDisabled();
});

test("partial product rows use paper for all required counts", async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/shop");
    await expect(page.locator(".product-card")).toHaveCount(10);
    for (const count of [1, 2, 3, 5, 7, 9, 10]) {
      // Exercise the real grid's incomplete-row CSS without adding production products.
      await page.locator(".product-card").evaluateAll((cards, total) => cards.forEach((card, index) => { (card as HTMLElement).style.display = index < total ? "" : "none"; }), count);
      await expect(page.locator(".product-grid")).toHaveCSS("background-color", "rgb(243, 241, 234)");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    }
  }
});

test("navigation marks current route and wraps focus backwards", async ({ page }) => {
  await page.goto("/lookbook");
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Explore SECTION 88" });
  await expect(dialog.getByRole("link", { name: /Lookbook/ })).toHaveAttribute("aria-current", "page");
  await dialog.getByRole("button", { name: "Close Explore SECTION 88" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: /Contact/ })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu", exact: true })).toBeFocused();
});

test("mobile sort and fit-specific pending measurements are usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/shop");
  await expect(page.locator(".product-card")).toHaveCount(10);
  await page.getByRole("button", { name: "Sort / Featured" }).click();
  const sheet = page.getByRole("dialog", { name: "Filter & sort" });
  await sheet.getByLabel("Sort by", { exact: true }).selectOption("price-asc");
  await sheet.getByRole("button", { name: "Show 10 objects" }).click();
  await expect(page).toHaveURL(/sort=price-asc/);
  await page.goto("/size-guide");
  await page.getByRole("button", { name: "Boxy", exact: true }).click();
  await expect(page.getByRole("table")).toHaveAccessibleName(/Boxy/);
  await expect(page.getByText("Pending", { exact: true }).first()).toBeVisible();
});

test("every menu destination and footer route remains reachable", async ({ page }) => {
  for (const [name, route] of [[/Shop all/, "/shop"], [/Lookbook/, "/lookbook"], [/Our story/, "/our-story"], [/Size guide/, "/size-guide"], [/Help/, "/faq"], [/Contact/, "/contact"]] as const) {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await page.getByRole("dialog", { name: "Explore SECTION 88" }).getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.locator("main h1")).toBeVisible();
  }
  const routes = await page.locator(".site-footer a").evaluateAll(links => [...new Set(links.map(link => link.getAttribute("href")!))]);
  for (const route of routes) expect((await page.request.get(route)).status()).toBe(200);
});

test("header wordmark stays centered without colliding with utilities", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 390, 768, 990, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    const logo = (await page.locator(".wordmark").boundingBox())!;
    const menu = (await page.getByRole("button", { name: "Open menu", exact: true }).boundingBox())!;
    const search = (await page.getByRole("button", { name: "Open search", exact: true }).boundingBox())!;
    expect(Math.abs(logo.x + logo.width / 2 - width / 2)).toBeLessThan(1);
    expect(menu.x + menu.width).toBeLessThanOrEqual(logo.x);
    expect(logo.x + logo.width).toBeLessThanOrEqual(search.x);
  }
});
