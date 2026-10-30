import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";

const baseURL = process.env.HERO_URL ?? "http://127.0.0.1:3000";
const baseline = process.argv.includes("--baseline");
console.log(`Checking ${baseURL}`);
const directory = `hero-artifacts/${baseline ? "baseline" : "screenshots"}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const observations = [];

try {
  for (const width of [375, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 750 ? 844 : 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    const imageRequests = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.url().includes("/_next/image")) imageRequests.push({ url: response.url(), status: response.status() });
    });
    await page.addInitScript(() => {
      window.heroLayoutShift = 0;
      window.heroLayoutShiftSources = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.heroLayoutShift += entry.value;
            window.heroLayoutShiftSources.push({ value: entry.value, sources: entry.sources.map(source => ({ node: source.node?.outerHTML.slice(0, 200), previous: source.previousRect, current: source.currentRect })) });
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("networkidle");
    await page.locator(".hero img").evaluateAll(images => Promise.all(images.map(image => image.decode().catch(() => {}))));
    await page.screenshot({ path: `${directory}/homepage-${width}.png`, animations: "disabled" });
    await page.locator(".hero").screenshot({ path: `${directory}/hero-${width}.png`, animations: "disabled" });
    const observation = await page.evaluate(() => {
      const rect = selector => {
        const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return { x, y, width, height };
      };
      const headline = document.querySelector(".hero h1");
      const headlineStyle = getComputedStyle(headline);
      return {
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        layoutShift: window.heroLayoutShift,
        layoutShiftSources: window.heroLayoutShiftSources,
        hero: rect(".hero"), copy: rect(".hero-copy"), headline: rect(".hero h1"),
        cta: rect(".hero-bottom .button"), rail: rect(".hero-rail"),
        headlineText: headline.textContent,
        headlineColor: headlineStyle.color,
        headlineOpacity: headlineStyle.opacity,
        headlineTransform: headlineStyle.transform,
        headlineFilter: headlineStyle.filter,
        layers: [...document.querySelectorAll(".hero-image-layer")].map(layer => ({
          className: layer.className,
          opacity: getComputedStyle(layer).opacity,
          animation: getComputedStyle(layer).animationName,
          images: [...layer.querySelectorAll("img")].map(image => ({
            alt: image.alt, complete: image.complete, naturalWidth: image.naturalWidth,
            currentSrc: image.currentSrc,
            position: getComputedStyle(image).objectPosition,
          })),
        })),
      };
    });
    assert.equal(observation.overflow, false, `${width}px horizontal overflow`);
    assert.deepEqual(errors, [], `${width}px browser errors`);
    if (!baseline) {
      assert.equal(observation.headlineColor, "rgb(0, 0, 0)");
      assert.equal(observation.headlineOpacity, "1");
      assert.equal(observation.headlineTransform, "none");
      assert.equal(observation.headlineFilter, "none");
      assert.equal(observation.layoutShift, 0, `${width}px layout shift`);
      assert.equal(observation.layers[0].animation, "none");
      assert.ok(observation.layers[0].images[0].naturalWidth > 0);
      assert.ok(observation.cta.x >= 0 && observation.cta.x + observation.cta.width <= width);
      assert.ok(observation.headline.x >= 0 && observation.headline.x + observation.headline.width <= width);
      assert.ok(imageRequests.every(request => request.status === 200));
      if (width < 750) assert.ok(!imageRequests.some(request => decodeURIComponent(request.url).includes("Daisy-Headed")), "Mobile must not fetch the desktop bloom");
      await page.locator(".hero-bottom .button").click();
      await page.waitForURL("**/shop");
      await page.getByRole("heading", { level: 1 }).waitFor();
    }
    observations.push({ ...observation, imageRequests, errors });
    await context.close();
  }

  if (!baseline) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "no-preference" });
    const page = await context.newPage();
    await page.goto(baseURL);
    const animation = await page.locator(".hero-image-layer-primary").evaluate(element => {
      const style = getComputedStyle(element);
      return { name: style.animationName, duration: style.animationDuration };
    });
    assert.deepEqual(animation, { name: "hero-atmosphere-in", duration: "0.9s" });
    assert.equal(await page.locator(".hero h1").evaluate(element => getComputedStyle(element).animationName), "none");
    await page.waitForTimeout(1000);
    assert.equal(await page.locator(".hero-image-layer-primary").evaluate(element => getComputedStyle(element).opacity), "0.24");
    observations.push({ motion: animation, headlineAnimation: "none", reducedMotion: "none at all six widths" });
    await context.close();
  }
  await writeFile(`hero-artifacts/${baseline ? "baseline" : "verification"}.json`, JSON.stringify(observations, null, 2));
  console.log(JSON.stringify({ status: "passed", mode: baseline ? "baseline" : "verification", widths: observations.filter(item => item.width).map(item => item.width), directory }));
} finally {
  await browser.close();
}
