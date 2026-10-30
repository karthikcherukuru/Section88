import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";

const directory = "product-image-artifacts/screenshots";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
const networkFailures = new Set();
const baseURL = "http://127.0.0.1:3000";

async function loadImages(locator) {
  for (const image of await locator.all()) {
    if (!await image.isVisible()) continue;
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveAttribute("data-loaded", "true");
    if (!await image.evaluate((node) => node.complete && node.naturalWidth > 0)) throw new Error("Undecoded product photograph");
  }
}

try {
  for (const width of [375, 390, 768, 1024, 1440, 1920]) {
    const mobile = width < 768;
    const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, hasTouch: mobile, isMobile: mobile, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      window.productImageLayoutShifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.productImageLayoutShifts.push({ value: entry.value, sources: entry.sources?.map((source) => source.node?.className ?? source.node?.nodeName) });
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => { if (response.status() >= 400) networkFailures.add(`${response.status()} ${response.url()}`); });
    const checks = [];
    const screenshots = [];
    async function capture(name, target, fullPage = false) {
      const file = `${directory}/${name}-${width}.png`;
      // Keep the global sticky header in its original document position while
      // capturing a region taller than the viewport. Production styles are untouched.
      const style = ".site-header { position: static !important; } .skip-link { visibility: hidden !important; }";
      if (target) await target.screenshot({ path: file, animations: "disabled", style });
      else await page.screenshot({ path: file, fullPage, animations: "disabled", style });
      screenshots.push(file);
    }
    async function verifyPage(route, images) {
      await page.goto(`${baseURL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(images).first()).toBeVisible();
      await loadImages(page.locator(images));
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      checks.push({ route, overflow: false, layoutShifts: await page.evaluate(() => window.productImageLayoutShifts) });
    }
    await verifyPage("/", ".featured-collection .product-image-link img");
    await capture("home-featured", page.locator(".featured-collection"));
    if (width === 1440) {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      const link = page.locator(".featured-collection .product-image-link").first();
      await link.hover();
      await expect(link.locator(".product-alternate")).toHaveCSS("opacity", "1");
      await capture("home-card-hover", page.locator(".featured-collection .product-card").first());
      await page.emulateMedia({ reducedMotion: "reduce" });
    }
    await verifyPage("/shop", ".product-image-link img");
    expect(await page.locator(".product-card").count()).toBe(10);
    await page.mouse.move(width - 1, 1);
    await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0); });
    await capture("shop-complete", null, true);
    if (width === 1440) {
      const link = page.locator(".product-image-link").nth(4);
      await link.hover();
      await expect(link.locator(".product-alternate")).toHaveCSS("opacity", "1");
      await capture("shop-card-hover", page.locator(".product-card").nth(4));
    }
    for (const slug of ["signal-study", "open-channel"]) {
      await verifyPage(`/products/${slug}`, ".gallery-main img, .gallery-thumbnails img");
      const main = page.locator(".gallery-main");
      const initialFrame = await main.locator(".image-frame").boundingBox();
      await capture(`${slug}-product`, page.locator(".product-detail"));
      for (const [index, view] of ["front", "back", "on-body", "detail"].entries()) {
        await expect(main).toContainText(`0${index + 1} / 04`);
        await loadImages(main.locator("img"));
        expect((await main.locator(".image-frame").boundingBox()).height).toBe(initialFrame.height);
        await capture(`${slug}-${view}`, main);
        await main.getByRole("button", { name: "Next image", exact: true }).click();
      }
      await page.getByRole("button", { name: "Color Paper", exact: true }).click();
      await expect(main.locator("img")).toHaveCount(0);
      await expect(main).toContainText("Photography pending");
      if (slug === "signal-study") await capture(`${slug}-paper-pending`, page.locator(".product-detail"));
      if (slug === "signal-study" && [390, 1440].includes(width)) {
        await page.getByRole("button", { name: "Size M", exact: true }).click();
        await page.getByRole("button", { name: "Add to bag", exact: true }).click();
        const bag = page.getByRole("dialog", { name: /Your bag/ });
        await expect(bag.getByText("Photography pending", { exact: true })).toBeVisible();
        await capture("paper-cart-pending", bag.locator(".dialog-panel"));
        await page.keyboard.press("Escape");
        await expect(bag).not.toBeVisible();
      }
      await page.getByRole("button", { name: "Color Ink", exact: true }).click();
      await loadImages(main.locator("img"));
      await expect(main).toContainText("01 / 04");
    }
    expect(errors).toEqual([]);
    results.push({ width, mobile, screenshots, checks, pageErrors: errors });
    await context.close();
    console.log(`PASS ${width}px: complete catalogue, featured cards, two four-view galleries, pending Paper and reset; ${screenshots.length} screenshots`);
  }
} finally {
  await writeFile("product-image-artifacts/visual-verification.json", `${JSON.stringify({ results, networkFailures: [...networkFailures] }, null, 2)}\n`);
  await browser.close();
}
