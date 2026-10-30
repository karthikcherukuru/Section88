import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { imageSlots } from "../../src/config/images";

const slots = [imageSlots.storyOrigin, imageSlots.storyProcess, imageSlots.storyPortrait];
const selectors = [".story-origin-image", ".story-process-image", ".story-portrait-image"];
const names = ["origin", "process", "individual"];
const directory = "story-artifacts/screenshots";

for (const width of [375, 390, 768, 1024, 1440, 1920]) {
  test(`Our Story photographs remain complete and responsive at ${width}px`, async ({ browser }) => {
    await mkdir(directory, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, hasTouch: width < 768, isMobile: width < 768, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors: string[] = [];
    const failures: string[] = [];
    const optimized: { source: string; status: number }[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
      if (response.url().includes("/_next/image")) optimized.push({ source: new URL(response.url()).searchParams.get("url") ?? "", status: response.status() });
    });
    await page.addInitScript(() => {
      const state = window as unknown as { storyShifts: number[]; imagesReleased: boolean };
      state.storyShifts = [];
      state.imagesReleased = false;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (state.imagesReleased && !shift.hadRecentInput) state.storyShifts.push(shift.value);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    let releaseImages!: () => void;
    const imageGate = new Promise<void>(resolve => { releaseImages = resolve; });
    await page.route("**/_next/image?*", async route => {
      if (new URL(route.request().url()).searchParams.get("url")?.startsWith("/images/our-story/")) await imageGate;
      await route.continue();
    });
    try {
      await page.goto("/our-story", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("main img")).toHaveCount(3);
      await expect(page.locator("main .slot-center")).toHaveCount(0);
      const measure = () => Promise.all(selectors.map(selector => page.locator(`${selector} .image-frame`).evaluate(frame => {
        const rect = frame.getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })));
      const before = await measure();
      await page.evaluate(() => { (window as unknown as { imagesReleased: boolean }).imagesReleased = true; });
      releaseImages();
      const images = [];
      for (const [index, slot] of slots.entries()) {
        const image = page.locator(selectors[index]).locator("img");
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveAttribute("data-loaded", "true");
        await expect(image).toHaveAttribute("loading", "lazy");
        await expect(image).toHaveAttribute("alt", slot.alt!);
        const details = await image.evaluate((node: HTMLImageElement) => ({ complete: node.complete, naturalWidth: node.naturalWidth, source: node.currentSrc, fit: getComputedStyle(node).objectFit, position: getComputedStyle(node).objectPosition, filter: getComputedStyle(node).filter, opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform }));
        expect(details.complete && details.naturalWidth > 0).toBe(true);
        expect(new URL(details.source).searchParams.get("url")).toBe(slot.src);
        expect(details).toMatchObject({ fit: "cover", position: "50% 50%", filter: "none", opacity: "1", transform: "none" });
        expect(before[index].width / before[index].height).toBeCloseTo(slot.width! / slot.height!, 2);
        expect((await context.request.get(slot.src!)).status()).toBe(200);
        images.push({ id: slot.id, ...details });
      }
      expect(await measure()).toEqual(before);
      expect(new Set(images.map(image => image.source)).size).toBe(3);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.evaluate(() => (window as unknown as { storyShifts: number[] }).storyShifts)).toEqual([]);
      const order = await page.evaluate(() => {
        const processImage = document.querySelector(".story-process-image")!.getBoundingClientRect();
        const processCopy = document.querySelector(".story-process > div:last-child")!.getBoundingClientRect();
        const portraitCopy = document.querySelector(".story-duo > div:first-child")!.getBoundingClientRect();
        const portraitImage = document.querySelector(".story-portrait-image")!.getBoundingClientRect();
        return { process: processImage.left < processCopy.left ? "side" : processImage.top < processCopy.top ? "stack" : "wrong", portrait: portraitImage.left > portraitCopy.left ? "side" : portraitImage.top > portraitCopy.top ? "stack" : "wrong" };
      });
      expect(order).toEqual(width < 768 ? { process: "stack", portrait: "stack" } : { process: "side", portrait: "side" });
      expect(errors).toEqual([]);
      expect(failures).toEqual([]);
      for (const slot of slots) expect(optimized.some(response => response.source === slot.src && response.status === 200)).toBe(true);
      const style = ".site-header { position: static !important; } .skip-link { visibility: hidden !important; }";
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${directory}/story-${width}.png`, fullPage: true, animations: "disabled", style });
      if (width === 390 || width === 1440) for (const [index, name] of names.entries()) await page.locator(selectors[index]).screenshot({ path: `${directory}/${name}-${width}.png`, animations: "disabled", style });
      await writeFile(`story-artifacts/verification-${width}.json`, JSON.stringify({ width, frames: before, images, order, optimized, errors, failures }, null, 2));
      await page.locator(".story-closing").getByRole("link", { name: "Meet the collection" }).click();
      await expect(page).toHaveURL(/\/shop$/);
      await expect(page.locator(".product-card")).toHaveCount(10);
    } finally {
      releaseImages();
      await context.close();
    }
  });
}

test("Our Story image reveals use restrained motion and honor reduced motion", async ({ browser }) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const state = window as unknown as { storyAnimations: { className: string; distance: string; duration: number }[] };
      state.storyAnimations = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (/story-(origin|process|portrait)-image/.test(this.className)) state.storyAnimations.push({ className: this.className, distance: (keyframes as Keyframe[])[0].transform as string, duration: (options as KeyframeAnimationOptions).duration as number });
        return animate.call(this, keyframes, options);
      };
    });
    await page.goto("/our-story");
    for (const selector of selectors) {
      const reveal = page.locator(selector);
      await reveal.scrollIntoViewIfNeeded();
      await expect(reveal.locator("img")).toHaveAttribute("data-loaded", "true");
      if (reducedMotion === "no-preference") await expect.poll(() => reveal.evaluate(node => (window as unknown as { storyAnimations: { className: string }[] }).storyAnimations.some(animation => animation.className === node.className))).toBe(true);
    }
    const motion = await page.evaluate(() => (window as unknown as { storyAnimations: { className: string; distance: string; duration: number }[] }).storyAnimations);
    expect(motion).toHaveLength(reducedMotion === "reduce" ? 0 : 3);
    for (const animation of motion) expect(animation).toMatchObject({ distance: "translateY(12px)", duration: 480 });
    await context.close();
  }
});
