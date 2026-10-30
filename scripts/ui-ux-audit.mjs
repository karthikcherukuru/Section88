import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory = 'audit-artifacts';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const findings = [];
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const routes = ['/', '/shop', '/products/signal-study', '/lookbook', '/our-story', '/cart', '/search', '/size-guide', '/faq', '/contact', '/shipping-returns', '/privacy', '/terms', '/not-in-the-index'];
  for (const [index, route] of routes.entries()) {
    const response = await page.goto(`http://127.0.0.1:3001${route}`);
    await page.waitForLoadState('networkidle');
    if (route === '/shop' || route === '/search') await page.locator('.product-card').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (index < 5) await page.screenshot({ path: `${directory}/${['homepage', 'collection', 'product-detail', 'lookbook', 'brand-story'][index]}-${width}.png`, fullPage: true, animations: 'disabled' });
    findings.push({ width, route, status: response.status(), ...await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      height: document.documentElement.scrollHeight,
      h1: document.querySelector('h1')?.textContent,
      smallControls: [...document.querySelectorAll('button, a, input, select')].filter(el => el.getBoundingClientRect().width && !el.closest('dialog:not([open])')).filter(el => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).map(el => ({ text: el.getAttribute('aria-label') || el.textContent, width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) }))
    })) });
  }
  await page.goto('http://127.0.0.1:3001/shop');
  await page.locator('.product-card').first().waitFor();
  const links = await page.locator('.product-image-link').evaluateAll(elements => elements.map(el => el.getAttribute('href')));
  for (const route of links) { const response = await page.goto(`http://127.0.0.1:3001${route}`); findings.push({ width, product: route, status: response.status(), title: await page.locator('main h1').textContent() }); }
  findings.push({ width, errors });
  await context.close();
}
await writeFile(`${directory}/browser-observations.json`, JSON.stringify(findings, null, 2));
await browser.close();
console.log('Saved ten full-page screenshots and route/control observations to audit-artifacts.');
