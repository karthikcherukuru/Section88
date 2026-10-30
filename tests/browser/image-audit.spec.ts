import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { imageSlots } from "../../src/config/images";

const routes = [
  "/", "/shop", "/products/signal-study", "/lookbook", "/our-story",
  "/search", "/cart", "/size-guide", "/faq", "/contact", "/shipping-returns",
];

for (const width of [390, 1440]) {
  test(`no failed local image requests on storefront routes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    const failed: string[] = [];
    const successful: string[] = [];
    page.on("response", response => {
      const request = response.request();
      const url = new URL(response.url());
      const localImage = request.resourceType() === "image" && (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/images/"));
      if (!localImage) return;
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
      else successful.push(response.url());
    });
    page.on("requestfailed", request => {
      if (request.resourceType() === "image") failed.push(`FAILED ${request.url()}`);
    });

    for (const route of routes) {
      const navigation = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(navigation?.ok(), `${route} document response`).toBe(true);
      await page.locator("img").evaluateAll(images => { for (const element of images) (element as HTMLImageElement).loading = "eager"; });
      const images = await page.locator("img").evaluateAll(async elements => Promise.all(elements.map(async element => {
        const image = element as HTMLImageElement;
        await image.decode();
        return { source: image.currentSrc, naturalWidth: image.naturalWidth };
      })));
      expect(images.every(image => image.source && image.naturalWidth > 0), `${route} all rendered images decode`).toBe(true);

      if (route === "/") {
        const primary = page.locator(".hero-image-layer-primary img");
        await expect(primary).toHaveCount(1);
        await expect.poll(() => primary.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        const primarySource = await primary.evaluate(image => (image as HTMLImageElement).currentSrc);
        expect(new URL(primarySource).searchParams.get("url")).toBe(imageSlots.heroDesktop.src);
        await expect(page.locator(".hero-image-layer-bloom")).toHaveCount(0);
      }
      if (route === "/lookbook") {
        await expect(page.locator(".lookbook-frame")).toHaveCount(5);
        await expect(page.locator(".lookbook-frame-5")).toHaveCount(0);
      }
      if (route === "/our-story") await expect(page.locator("main img")).toHaveCount(3);
    }

    expect(failed).toEqual([]);
    expect(successful.length).toBeGreaterThan(0);
    if (width === 390 || width === 1440) {
      await mkdir("audit-artifacts/image-audit", { recursive: true });
      await page.goto("/", { waitUntil: "networkidle" });
      await page.locator("img").evaluateAll(images => { for (const element of images) (element as HTMLImageElement).loading = "eager"; });
      await page.locator("img").evaluateAll(images => Promise.all(images.map(image => (image as HTMLImageElement).decode())));
      await page.screenshot({ path: `audit-artifacts/image-audit/home-${width}.png`, fullPage: true, animations: "disabled" });
    }
  });
}

test("Paper photography stays pending in preview and the optional Lookbook slot stays hidden", async ({ page }) => {
  await page.goto("/products/signal-study");
  await page.getByRole("button", { name: "Color Paper" }).click();
  await expect(page.locator(".gallery-main")).toContainText("Photography pending");
  await expect(page.locator(".gallery-main img")).toHaveCount(0);
  await expect(page.locator(".product-detail .product-information > .demo-note")).toContainText("Prelaunch preview");
  await page.goto("/lookbook");
  await expect(page.locator(".lookbook-frame")).toHaveCount(5);
  await expect(page.locator(".lookbook-frame-5")).toHaveCount(0);
});
