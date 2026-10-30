import { chromium, firefox, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";

const base = process.env.REFINEMENT_URL ?? "http://127.0.0.1:3139";
const directory = "refinement-artifacts/screenshots";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const observations = [];
const pages = [["homepage", "/"], ["shop", "/shop"], ["product", "/products/signal-study"], ["lookbook", "/lookbook"], ["story", "/our-story"], ["cart-empty", "/cart"], ["search-results", "/search?q=signal"], ["faq", "/faq"], ["contact", "/contact"], ["size-guide-page", "/size-guide"], ["shipping", "/shipping-returns"], ["privacy", "/privacy"], ["terms", "/terms"], ["404", "/not-in-the-index"]];
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const ready = async route => {
    await page.goto(base + route);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    if (route.startsWith("/shop") || route.startsWith("/search")) await page.locator(".product-card").first().waitFor();
  };
  const shot = async name => {
    const file = `${name}-${width}.png`;
    await page.screenshot({ path: `${directory}/${file}`, fullPage: true, animations: "disabled" });
    if (name.endsWith("open")) await page.screenshot({ path: `${directory}/${name}-viewport-${width}.png`, animations: "disabled" });
    observations.push({ screenshot: file, width, ...await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth,
      headline: document.querySelector("h1")?.textContent,
    })) });
  };
  for (const [name, route] of pages) { await ready(route); await shot(name); }
  await ready("/");
  await page.locator(".hero").screenshot({ path: `${directory}/hero-${width}.png` });
  await page.locator(".site-footer").screenshot({ path: `${directory}/footer-${width}.png` });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole("button", { name: "Open menu", exact: true }).click();
  await page.getByRole("dialog", { name: "Explore SECTION 88" }).waitFor();
  await shot("navigation-open");
  await page.keyboard.press("Escape");
  await page.getByRole("dialog", { name: "Explore SECTION 88" }).waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "Open search", exact: true }).click();
  const search = page.getByRole("dialog", { name: "Search", exact: true });
  await search.getByRole("textbox", { name: "Search the collection" }).fill("signal");
  await search.getByText("1 suggestions", { exact: true }).waitFor();
  await shot("search-open");
  await page.keyboard.press("Escape");
  await ready("/shop");
  await page.locator(".product-grid").screenshot({ path: `${directory}/product-grid-${width}.png` });
  await page.locator(".product-card").first().hover();
  await page.locator(".product-card").first().screenshot({ path: `${directory}/product-card-hover-${width}.png` });
  const productLinks = await page.locator(".product-image-link").evaluateAll(links => links.map(link => link.getAttribute("href")));
  for (const route of productLinks) {
    const response = await page.goto(base + route);
    assert.equal(response.status(), 200);
    await page.locator("main h1").waitFor();
  }
  if (width < 768) {
    await ready("/shop");
    await page.getByRole("button", { name: "Filter & sort", exact: true }).click();
    await shot("filters-open");
    await page.keyboard.press("Escape");
  }
  await ready("/products/signal-study");
  await page.getByRole("button", { name: "Size guide", exact: true }).click();
  await shot("size-guide-open");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Size M", exact: true }).click();
  await page.locator(".product-information").screenshot({ path: `${directory}/purchase-region-${width}.png` });
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await page.getByRole("dialog", { name: /Your bag/ }).waitFor();
  await shot("bag-open");
  await page.keyboard.press("Escape");
  await ready("/cart");
  await page.getByRole("button", { name: "Checkout unavailable" }).waitFor();
  await shot("cart-populated");
  observations.push({ width, pageErrors: errors });
  assert.deepEqual(errors, []);
  await context.close();
}
// 200% desktop zoom reflow equivalent: half the CSS viewport, doubled output scale.
const zoomContext = await browser.newContext({ viewport: { width: 720, height: 450 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const zoomPage = await zoomContext.newPage();
for (const route of ["/", "/shop", "/products/signal-study"]) {
  await zoomPage.goto(base + route);
  await zoomPage.waitForLoadState("networkidle");
  assert.ok(await zoomPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}
observations.push({ reflowEquivalent: "200% of 1440x900 desktop", cssViewport: "720x450", overflow: false, note: "Zoom-equivalent layout check, not browser UI zoom or assistive-technology certification." });
await zoomContext.close();
await browser.close();

const browserCoverage = [];
for (const [name, engine] of [["firefox", firefox], ["webkit", webkit]]) {
  let other;
  try { other = await engine.launch(); }
  catch (error) { browserCoverage.push({ browser: name, status: "unavailable", reason: error.message.split("\n")[0] }); continue; }
  try {
    const page = await other.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    await page.goto(base + "/products/signal-study");
    await page.getByRole("button", { name: "Size M", exact: true }).click();
    await page.getByRole("button", { name: "Add to bag", exact: true }).click();
    await page.getByRole("dialog", { name: /Your bag/ }).waitFor();
    await page.keyboard.press("Escape");
    await page.goto(base + "/shop");
    await page.getByRole("button", { name: "Boxy", exact: true }).click();
    assert.equal(await page.locator(".product-card").count(), 3);
    browserCoverage.push({ browser: name, status: "smoke passed" });
  } catch (error) { browserCoverage.push({ browser: name, status: "failed", reason: error.message }); }
  finally { await other.close(); }
}
await writeFile("refinement-artifacts/observations.json", JSON.stringify({ observations, browserCoverage }, null, 2));
console.log(JSON.stringify({ captures: observations.filter(item => item.screenshot).length, browserCoverage }, null, 2));
