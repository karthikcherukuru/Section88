import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { lookbookSlots } from "../../src/config/images";

const approved = lookbookSlots.filter(slot => slot.src);
const expectedIds = ["lookbook-1", "lookbook-2", "lookbook-3", "lookbook-4", "lookbook-6"];
const directory = "lookbook-image-artifacts/screenshots";

for (const width of [375, 390, 768, 1024, 1440, 1920]) {
  test(`Lookbook: five loaded frames and editorial composition at ${width}px`, async ({ browser }) => {
    await mkdir(directory, { recursive: true });
    const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 1000 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors: string[] = [];
    const failures: string[] = [];
    const responses: { source: string; status: number }[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
      if (response.url().includes("/_next/image")) responses.push({ source: new URL(response.url()).searchParams.get("url") ?? "", status: response.status() });
    });
    await page.addInitScript(() => {
      const state = window as unknown as { lookbookShifts: number[]; imagesReleased: boolean };
      state.lookbookShifts = [];
      state.imagesReleased = false;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (state.imagesReleased && !shift.hadRecentInput) state.lookbookShifts.push(shift.value);
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    let releaseImages!: () => void;
    const imageGate = new Promise<void>(resolve => { releaseImages = resolve; });
    await page.route("**/_next/image?*", async route => {
      if (new URL(route.request().url()).searchParams.get("url")?.startsWith("/images/lookbook/")) await imageGate;
      await route.continue();
    });
    try {
      await page.goto("/lookbook", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator(".lookbook-grid img")).toHaveCount(5);
      expect(approved.map(slot => slot.id)).toEqual(expectedIds);
      await expect(page.locator(".lookbook-frame-5")).toHaveCount(0);
      await expect(page.locator(".lookbook-grid .slot-center")).toHaveCount(0);
      const measure = () => page.locator(".lookbook-grid .image-frame").evaluateAll(frames => frames.map(frame => {
        const r = frame.getBoundingClientRect();
        return { x: r.x, top: r.y + scrollY, width: r.width, height: r.height };
      }));
      const before = await measure();
      await page.evaluate(() => { (window as unknown as { imagesReleased: boolean }).imagesReleased = true; });
      releaseImages();
      const images = [];
      for (const [index, slot] of approved.entries()) {
        const frame = page.locator(`.${slot.id.replace("lookbook-", "lookbook-frame-")}`);
        const image = frame.locator("img");
        await image.scrollIntoViewIfNeeded();
        await expect(image).toHaveAttribute("data-loaded", "true");
        await expect(image).toHaveAttribute("alt", slot.alt!);
        if (index > 0) await expect(image).toHaveAttribute("loading", "lazy");
        else expect(await image.getAttribute("loading")).not.toBe("lazy");
        await expect(frame.locator("figcaption .mono")).toHaveText(`FRAME ${String(index + 1).padStart(3, "0")}`);
        const info = await image.evaluate((node: HTMLImageElement) => ({ complete: node.complete, naturalWidth: node.naturalWidth, source: node.currentSrc, fit: getComputedStyle(node).objectFit, position: getComputedStyle(node).objectPosition, filter: getComputedStyle(node).filter }));
        expect(info.complete && info.naturalWidth > 0).toBe(true);
        expect(new URL(info.source).searchParams.get("url")).toBe(slot.src);
        expect(info.fit).toBe("cover");
        expect(info.position).toBe("50% 50%");
        expect(info.filter).toBe("none");
        expect(before[index].width / before[index].height).toBeCloseTo(slot.width! / slot.height!, 2);
        const original = await context.request.get(slot.src!);
        expect(original.status()).toBe(200);
        images.push({ id: slot.id, ...info });
      }
      expect(new Set(images.map(image => image.source)).size).toBe(5);
      expect(await measure()).toEqual(before);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const shifts = await page.evaluate(() => (window as unknown as { lookbookShifts: number[] }).lookbookShifts);
      expect(shifts).toEqual([]);
      const columns = await page.locator(".lookbook-frame").evaluateAll(frames => frames.map(frame => ({ column: getComputedStyle(frame).gridColumn, paddingTop: getComputedStyle(frame).paddingTop })));
      expect(columns.map(item => item.column)).toEqual(width < 768 ? ["1 / 13", "1 / 9", "4 / 13", "1 / 13", "3 / 13"] : ["1 / 13", "1 / 6", "7 / 12", "1 / 13", "7 / 13"]);
      expect(columns[2].paddingTop).toBe(width < 768 ? "0px" : "80px");
      const style = ".site-header { position: static !important; } .skip-link { visibility: hidden !important; }";
      for (const [name, selector] of [["opening", ".lookbook-frame-1"], ["impossible-space", ".lookbook-frame-4"], ["closing", ".lookbook-frame-6"]]) await page.locator(selector).screenshot({ path: `${directory}/${name}-${width}.png`, animations: "disabled", style });
      await page.evaluate(() => scrollTo(0, 0));
      const pair = await page.evaluate(() => {
        const first = document.querySelector(".lookbook-frame-2")!.getBoundingClientRect();
        const second = document.querySelector(".lookbook-frame-3")!.getBoundingClientRect();
        return { x: 0, y: first.top + scrollY, width: innerWidth, height: second.bottom - first.top };
      });
      await page.screenshot({ path: `${directory}/portrait-pair-${width}.png`, fullPage: true, clip: pair, animations: "disabled", style });
      await page.screenshot({ path: `${directory}/lookbook-${width}.png`, fullPage: true, animations: "disabled", style });
      for (const slot of approved) expect(responses.some(response => response.source === slot.src && response.status === 200)).toBe(true);
      expect(errors).toEqual([]);
      expect(failures).toEqual([]);
      await writeFile(`lookbook-image-artifacts/verification-${width}.json`, JSON.stringify({ width, frames: before, columns, images, shifts, responses, errors, failures }, null, 2));
      await page.locator(".editorial-end").getByRole("link", { name: "Explore the drop" }).click();
      await expect(page).toHaveURL(/\/shop$/);
      await expect(page.locator(".product-card")).toHaveCount(10);
      await page.getByRole("button", { name: "Open menu", exact: true }).click();
      await page.getByRole("dialog").getByRole("link", { name: /Lookbook/ }).click();
      await expect(page).toHaveURL(/\/lookbook$/);
      await expect(page.locator(".lookbook-grid img")).toHaveCount(5);
    } finally {
      releaseImages();
      await context.close();
    }
  });
}

test("Lookbook reveals stay within motion limits and respect reduced motion", async ({ browser }) => {
  for (const reducedMotion of ["no-preference", "reduce"] as const) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion });
    const page = await context.newPage();
    await page.addInitScript(() => {
      const state = window as unknown as { lookbookAnimations: { frame: string; distance: string; duration: number }[] };
      state.lookbookAnimations = [];
      const animate = Element.prototype.animate;
      Element.prototype.animate = function (keyframes, options) {
        if (this.classList.contains("lookbook-frame")) state.lookbookAnimations.push({ frame: this.className, distance: (keyframes as Keyframe[])[0].transform as string, duration: (options as KeyframeAnimationOptions).duration as number });
        return animate.call(this, keyframes, options);
      };
    });
    await page.goto("/lookbook");
    for (const frame of await page.locator(".lookbook-frame").all()) {
      await frame.scrollIntoViewIfNeeded();
      await expect(frame.locator("img")).toHaveAttribute("data-loaded", "true");
      // IntersectionObserver runs asynchronously after the scroll/layout frame.
      if (reducedMotion === "no-preference") await expect.poll(() => frame.evaluate(node => (window as unknown as { lookbookAnimations: { frame: string }[] }).lookbookAnimations.some(animation => animation.frame === node.className))).toBe(true);
    }
    const motion = await page.evaluate(() => (window as unknown as { lookbookAnimations: { distance: string; duration: number }[] }).lookbookAnimations);
    expect(motion).toHaveLength(reducedMotion === "reduce" ? 0 : 5);
    for (const animation of motion) expect(animation).toMatchObject({ distance: "translateY(12px)", duration: 480 });
    await context.close();
  }
});
