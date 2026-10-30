import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { chromium, expect } from "@playwright/test";
import { imageSlots, lookbookSlots } from "../src/config/images.ts";
import { products } from "../src/data/products.ts";

const baseURL = process.env.EDITORIAL_URL ?? "http://127.0.0.1:3140";
const directory = "editorial-image-artifacts/screenshots";
await mkdir(directory, { recursive: true });
const slots = ["campaign", "fit", "graphic", "construction", "story"].map(key => imageSlots[key]);
const report = { widths: [], motion: [], originalFilesUnchanged: 0, unfilled: [], missingConfiguredSources: [] };
const baseline = JSON.parse(await readFile("editorial-image-artifacts/source-image-baseline.json", "utf8"));
for (const file of baseline) {
  const bytes = await readFile(`public/images/${file.file}`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), file.sha256, file.file);
  report.originalFilesUnchanged++;
}
for (const slot of [...Object.values(imageSlots), ...lookbookSlots, ...products.flatMap(p => Object.values(p.mediaByColor).flat())]) {
  if (!slot.src) report.unfilled.push(slot.id);
  else {
    try { await readFile(`public${decodeURIComponent(slot.src)}`); }
    catch { report.missingConfiguredSources.push({ id: slot.id, src: slot.src }); }
  }
}
const browser = await chromium.launch();
try {
  for (const width of [375, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, deviceScaleFactor: 1, hasTouch: width < 768, isMobile: width < 768, reducedMotion: "reduce" });
    await context.addInitScript(() => {
      window.editorialShifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.editorialShifts.push({ time: entry.startTime, value: entry.value, sources: entry.sources.map(source => ({ node: source.node?.className ?? source.node?.nodeName, previous: source.previousRect.toJSON(), current: source.currentRect.toJSON() })) });
      }).observe({ type: "layout-shift", buffered: true });
    });
    const page = await context.newPage();
    const errors = [], requests = [], failures = [], screenshots = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.url().includes("/_next/image")) requests.push({ url: response.url(), status: response.status() });
      if (response.status() >= 400) failures.push({ url: response.url(), status: response.status() });
    });
    await page.goto(baseURL);
    await page.evaluate(() => document.fonts.ready);
    // Record initial document/font layout separately from the image-decoding phase.
    const initialLayoutShifts = await page.evaluate(() => {
      const shifts = window.editorialShifts;
      window.editorialShifts = [];
      return shifts;
    });
    const framesBefore = await page.locator(".editorial-image").evaluateAll(frames => frames.map(frame => ({ width: frame.clientWidth, height: frame.clientHeight })));
    const images = [];
    for (const slot of slots) {
      const image = page.getByAltText(slot.alt, { exact: true });
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("data-loaded", "true");
      const info = await image.evaluate(node => {
        const style = getComputedStyle(node), frame = node.parentElement.getBoundingClientRect();
        return { alt: node.alt, source: node.currentSrc, loading: node.loading, naturalWidth: node.naturalWidth, complete: node.complete, fit: style.objectFit, position: style.objectPosition, filter: style.filter, opacity: style.opacity, transform: style.transform, animation: style.animationName, width: frame.width, height: frame.height };
      });
      assert.ok(info.complete && info.naturalWidth > 0, slot.id);
      assert.equal(new URL(info.source).searchParams.get("url"), slot.src);
      assert.equal(info.loading, "lazy");
      assert.equal(info.fit, "cover");
      assert.equal(info.opacity, "1");
      assert.equal(info.filter, "none");
      assert.equal(info.transform, "none");
      assert.equal(info.animation, "none");
      const ratio = slot.kind === "campaign" ? 16 / 9 : slot.kind === "fabric" ? 1 : 3 / 4;
      assert.ok(Math.abs(info.width / info.height - ratio) < 0.01, `${slot.id} aspect ratio`);
      const raw = await context.request.get(`${baseURL}${slot.src.split("/").map(encodeURIComponent).join("/")}`);
      assert.equal(raw.status(), 200, `${slot.id} original URL`);
      images.push({ id: slot.id, ...info });
    }
    // Load the product row too, so full-page evidence has no unrequested lazy images.
    for (const image of await page.locator(".featured-collection img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("data-loaded", "true");
    }
    const framesAfter = await page.locator(".editorial-image").evaluateAll(frames => frames.map(frame => ({ width: frame.clientWidth, height: frame.clientHeight })));
    assert.deepEqual(framesAfter, framesBefore, "Image decoding must not resize frames");
    const layout = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      shifts: window.editorialShifts,
      mobileOrder: [...document.querySelectorAll(".substance-item")].map(item => {
        const image = item.querySelector(".image-frame").getBoundingClientRect();
        const copy = item.querySelector(":scope > div:not(.image-frame)").getBoundingClientRect();
        return image.x < copy.x ? "image-left" : "image-right";
      }),
    }));
    assert.equal(layout.overflow, false);
    assert.deepEqual(layout.shifts, [], "No image-induced layout shifts");
    if (width < 768) assert.deepEqual(layout.mobileOrder, ["image-left", "image-right", "image-left"]);
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, [], "No image or page requests should fail");
    for (const slot of slots) assert.ok(requests.some(request => new URL(request.url).searchParams.get("url") === slot.src && request.status === 200), `${slot.id} optimized response`);
    const style = ".site-header { position: static !important; } .skip-link { visibility: hidden !important; }";
    for (const [name, selector] of [["campaign", ".campaign-section"], ["substance", ".substance-section"], ["story", ".story-teaser"]]) {
      const path = `${directory}/${name}-${width}.png`;
      await page.locator(selector).screenshot({ path, animations: "disabled", style });
      screenshots.push(path);
    }
    await page.evaluate(() => scrollTo(0, 0));
    const path = `${directory}/homepage-${width}.png`;
    await page.screenshot({ path, fullPage: true, animations: "disabled", style });
    screenshots.push(path);
    // Trial clicks check hit targets and obstructions without navigating away.
    for (const selector of [".campaign-copy a", ".substance-item-1 a", ".substance-item-2 a", ".substance-item-3 a", ".story-teaser-copy a"]) await page.locator(selector).click({ trial: true });
    report.widths.push({ width, initialLayoutShifts, ...layout, images, requests, failures, errors, screenshots });
    console.log(`Verified ${width}px: five optimized images, stable frames, no overflow, four screenshots.`);
    await context.close();
  }
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    await context.addInitScript(() => {
      window.editorialReveals = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (frames, options) {
        if (this.querySelector(".campaign-section, .story-teaser")) window.editorialReveals.push({ frames, options });
        return animate.call(this, frames, options);
      };
    });
    const page = await context.newPage();
    await page.goto(baseURL);
    for (const slot of slots) {
      const img = page.getByAltText(slot.alt, { exact: true });
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute("data-loaded", "true");
      const motion = await img.evaluate(node => ({ name: getComputedStyle(node).animationName, duration: getComputedStyle(node).animationDuration }));
      assert.equal(motion.name, reducedMotion === "reduce" ? "none" : "hero-atmosphere-in");
      if (reducedMotion === "no-preference") assert.equal(motion.duration, "0.48s");
    }
    const reveals = await page.evaluate(() => window.editorialReveals);
    assert.equal(reveals.length, reducedMotion === "reduce" ? 0 : 2);
    for (const reveal of reveals) { assert.equal(reveal.options.duration, 480); assert.equal(reveal.frames[0].transform, "translateY(12px)"); }
    report.motion.push({ reducedMotion, reveals });
    await context.close();
  }
  await writeFile("editorial-image-artifacts/verification.json", JSON.stringify(report, null, 2));
  console.log(`PASS: ${report.originalFilesUnchanged} originals unchanged; ${report.unfilled.length} unfilled slots; ${report.missingConfiguredSources.length} pre-existing missing source.`);
} finally { await browser.close(); }
