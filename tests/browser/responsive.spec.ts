import { expect, test } from "@playwright/test";
const widths = [320, 360, 375, 390, 430, 768, 990, 1024, 1280, 1440, 1920];
const routes = ["/", "/shop", "/products/signal-study", "/lookbook", "/our-story", "/cart", "/search", "/size-guide", "/faq", "/contact", "/shipping-returns", "/privacy", "/terms", "/not-in-the-index"];
for (const width of widths) {
  test(`routes and responsive screenshots at ${width}px`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
      expect(overflow.scroll, `${route} horizontal overflow at ${width}px`).toBeLessThanOrEqual(overflow.viewport + 1);
      if (routes.indexOf(route) < 5) await page.screenshot({ path: testInfo.outputPath(`${route.replaceAll("/", "_") || "home"}-${width}.png`), fullPage: true, animations: "disabled" });
    }
    expect(errors).toEqual([]);
  });
}
