import { readFile, writeFile, readdir } from "node:fs/promises";
import { products } from "../src/data/products.ts";
import { productMedia } from "../src/lib/media.ts";

const inventory = JSON.parse(await readFile("product-image-artifacts/inventory.json", "utf8"));
const visual = JSON.parse(await readFile("product-image-artifacts/visual-verification.json", "utf8"));
const playwright = JSON.parse(await readFile("product-image-artifacts/playwright-results.json", "utf8"));
const interrupted = playwright.stats.interrupted ?? 0;
const productFiles = inventory.flatMap((folder) => folder.files);
const rootFiles = (await readdir("public/images")).filter((file) => /\.(png|jpe?g|webp|avif)$/i.test(file));
const screenshots = visual.results.flatMap((result) => result.screenshots);
const modified = [
  "src/config/product-media.ts", "src/config/images.ts", "src/data/products.ts",
  "src/components/image-placeholder.tsx", "src/components/product-gallery.tsx", "src/app/globals.css",
  "tests/domain.test.mjs", "tests/browser/product-images.spec.ts", "IMAGE_PLACEMENT_GUIDE.md",
  "scripts/inventory-product-images.mjs", "scripts/verify-product-images.mjs", "scripts/report-product-images.mjs",
  "PRODUCT_IMAGE_INTEGRATION_REPORT.md",
];
let report = `# SECTION 88 — Product image integration report

## Result

Inspected **${productFiles.length} product PNGs** in ten folders, plus **${rootFiles.length} existing image in the root of public/images** (${productFiles.length + rootFiles.length} image files total; .gitkeep excluded). All ten products have complete **Ink** photography in front / back / on-body / detail order. Forty unique image files populate forty exact Ink slot IDs. No product images are missing or ambiguous after visual inspection. All five configured Paper sets (20 slots) remain explicitly pending; no white garments were supplied.

All originals are preserved at their existing paths. No normalized copies, conversions, generated photographs, external hosting, deployment or push were used. Original dimensions and SHA-256 hashes are recorded in [inventory.json](product-image-artifacts/inventory.json). The 14-test unit suite verifies each mapped file against those hashes and actual image dimensions. The original hero configuration, typography, palette, layouts, catalogue data, prices, fits, descriptions, availability and variant IDs are preserved.

## Product 01 relationship

**Confirmed: Charcoal Tee → 01 Signal Study.** The folder contains section88_signal_study_back.png, section88_signal_study_on_body.png and section88_signal_study_fabric_detail.png. Visual inspection shows the same charcoal garment, distressed cream concentric rings and lime signal line as Floating Charcoal Tee in Minimalist Studio.png. The back intentionally varies the placement of the ring artwork. The catalogue has no contradictory artwork specification; its description is a generic sample fixture. Signal Study remains the product name; no merchandise was renamed.

## Complete image mapping

Each filename below links to the untouched original. Runtime sources use /images/<encoded folder>/<encoded filename>. Spaces and commas are encoded per path segment with encodeURIComponent, because raw commas in the timestamped filenames caused reproducible Next.js static/optimizer 404s during initial testing. Encoding resolved these without copying or renaming files.

| Product | Color | Folder | Front / 0 | Back / 1 | On-body / 2 | Detail / 3 |
|---|---|---|---|---|---|---|
`;
for (const product of products) {
  const media = productMedia(product, "ink");
  const folder = decodeURIComponent(media[0].src).split("/")[2];
  const cells = media.map((slot) => `[${decodeURIComponent(slot.src.split("/").at(-1))}](public${slot.src})`);
  report += `| ${product.number} — ${product.name} | Ink (charcoal / washed black) | ${folder} | ${cells.join(" | ")} |\n`;
}
report += `
## Dimensions and inspected view identification

All 10 front images are 1122 × 1402. After Hours, Charcoal Tee, New Frequency, Off Register, Outside the Frame, Side Effect and Unwritten have 1600 × 2000 backs and model images, and 1600 × 1600 details. Common Ground, Open Channel and Static Motion have 1122 × 1402 backs and model images, and 1254 × 1254 details. All sources are PNG. Complete sizes, file bytes and hashes are in the inventory.

The timestamped -1 images show the back neckline and back artwork; -2 shows the model; -3 is the square print/fabric detail. This identification was established by inspecting the actual images, rather than inferring it from sequence numbers. [Contact sheet 1](product-image-artifacts/inventory-contact-sheet-1.png) and [contact sheet 2](product-image-artifacts/inventory-contact-sheet-2.png) preserve the visual inventory. Sheet columns follow the inventoried filename order, not gallery order; the table above is authoritative.

## Slots and reuse

| Product | Front | Back | On-body | Detail | Paper |
|---|---|---|---|---|---|
`;
for (const product of products) {
  report += `| ${product.number} ${product.name} | ${productMedia(product).map((slot) => `\`${slot.id}\``).join(" | ")} | ${product.colors.some((color) => color.id === "paper") ? "4 existing slots, photography pending" : "Not configured"} |\n`;
}
report += `
The existing productMedia resolver remains authoritative by color. Default cards, featured pieces, related products and search reuse slot 0; cart thumbnails resolve the actual cart color. Legacy uncolored slots retain their original IDs and receive the default Ink photography, while configured Paper mappings stay separate and unpopulated. Switching color remounts the gallery at index 0. Existing size validation retains M and clears XXL when selecting Paper; cart variant behavior remains unchanged.

## Rendering and performance

- Every product photograph uses the existing Next.js Image architecture. Original width/height metadata is retained in asset configuration. Reserved frames remain 4:5, preventing image loads or view changes from changing their geometry.
- Full-garment and model photographs use contain with a centered focal point. Square details also use contain so their complete artwork and texture remain visible; native square framing remains in the existing zoom dialog. Original backgrounds are preserved. No image stretching or garment scaling is introduced.
- Desktop cards crossfade to their own back image over 300ms with ease-out, only when hover and a fine pointer are available. The back is revealed only after it has loaded, preventing empty hover flashes. Existing reduced-motion rules disable prolonged transitions. Touch devices keep the front visible.
- A failed image displays the existing pending frame. Unsupported Paper does not fall through to Ink. Bag thumbnail pending text is now visible; developer labels remain hidden within the small bag frame.
- The initial product gallery front retains priority loading; later gallery views, thumbnails, cards and below-fold photos remain lazy. Gallery sizes account for the actual 60% desktop column and 640px maximum; thumbnails and zoom have separate responsive sizes. No image quality target or destructive conversion was applied.

## Visual verification

Ran the production application at http://127.0.0.1:3000 and inspected rendered screenshots. The independent visual script covered all requested widths and loaded every card's front/back on home and shop, plus four views for Signal Study and Open Channel at every width. Product 01 is included because its association is confirmed. Each product was also tested across all four views and zoom by the Playwright suite.

| Viewport | Screenshots | Overflow | Page JavaScript errors |
|---|---|---|---|
`;
for (const result of visual.results) report += `| ${result.width}px | ${result.screenshots.length} | ${result.checks.some((check) => check.overflow) ? "FAIL" : "None"} | ${result.pageErrors.length} |\n`;
report += `
**${screenshots.length} dedicated screenshots** are in [product-image-artifacts/screenshots](product-image-artifacts/screenshots). [Visual verification JSON](product-image-artifacts/visual-verification.json) contains route checks, layout-shift entries and network failures (${visual.networkFailures.length} failed HTTP responses in the final visual run). The browser suite separately captures its responsive route screenshots in test-results.

| Requested evidence | Desktop | Mobile |
|---|---|---|
| Featured collection | [1440px](product-image-artifacts/screenshots/home-featured-1440.png) | [390px](product-image-artifacts/screenshots/home-featured-390.png) |
| Complete catalogue | [1440px](product-image-artifacts/screenshots/shop-complete-1440.png) | [390px](product-image-artifacts/screenshots/shop-complete-390.png) |
| Signal Study product | [1440px](product-image-artifacts/screenshots/signal-study-product-1440.png) | [390px](product-image-artifacts/screenshots/signal-study-product-390.png) |
| Open Channel product | [1440px](product-image-artifacts/screenshots/open-channel-product-1440.png) | [390px](product-image-artifacts/screenshots/open-channel-product-390.png) |
| Paper gallery pending | [1440px](product-image-artifacts/screenshots/signal-study-paper-pending-1440.png) | [390px](product-image-artifacts/screenshots/signal-study-paper-pending-390.png) |
| Paper cart pending | [1440px](product-image-artifacts/screenshots/paper-cart-pending-1440.png) | [390px](product-image-artifacts/screenshots/paper-cart-pending-390.png) |

Desktop hover: [featured card](product-image-artifacts/screenshots/home-card-hover-1440.png), [shop card](product-image-artifacts/screenshots/shop-card-hover-1440.png). Each gallery's four separate views are saved as <slug>-front/back/on-body/detail-<width>.png. There are no products with multiple photographed color sets, so a real Ink-to-Paper photo switch cannot be demonstrated; pending Paper and return-to-Ink reset are captured instead.

For tall screenshots only, the capture tool puts the sticky header in its original document position and hides the skip link to prevent fixed UI being stamped over the photographed region. This is a screenshot-only style and does not alter the app. Full catalogue screenshots still include the header at its normal document position.

## Framing and remaining limitations

1. Back garments are larger within several supplied photographs than their corresponding fronts, especially the seven 1600 × 2000 back sets. The hover retains this source scale difference. Correcting it would require reworking approved photographs; no distortion, crop or synthetic rescaling was applied.
2. Model framing differs: Common Ground and Static Motion are cropped around the upper legs by the originals; Open Channel includes the full model, while the other seven use a wider full-length pose. Full source framing is retained. No missing feet or space were fabricated.
3. Static Motion uses a brighter, more open architectural background than the other products. It is preserved as supplied. Source front resolution is 1122 × 1402; high-density large displays remain limited by the delivered originals. Inspected desktop/mobile screenshots show readable graphics without visible distortion, but this is not a guarantee of print-quality resolution.
4. All five Paper sets remain pending: Signal Study, Open Channel, Common Ground, Static Motion and Outside the Frame. No white photo or substitute was fabricated.
5. Product records remain sample/demo merchandise with generic artwork/material descriptions, sample fit allocation and demo-only availability. This integration confirms visual associations; it does not approve commercial product specifications.
6. The existing shop Suspense fallback can move the closing strip/footer when the catalogue mounts. Layout-shift sources and values are recorded below. Product image frames stay reserved and gallery view changes retain their dimensions; the independent existing catalogue-loading behavior was not changed because the page composition is outside this image task.

### Observed layout shifts

`;
for (const result of visual.results) for (const check of result.checks) for (const shift of check.layoutShifts) report += `- ${result.width}px ${check.route}: ${shift.value.toFixed(6)}, sources: ${shift.sources?.join(", ") || "not reported"}.\n`;
report += `
## Test results

| Command | Actual final result |
|---|---|
| npm.cmd run typecheck | PASS, exit 0 |
| npm.cmd run lint | PASS, exit 0, zero warnings |
| npm.cmd run build | PASS, exit 0, 26 generated static pages |
| npm.cmd run test:unit | PASS, 14/14 |
| npm.cmd run audit:source | PASS, 47 TypeScript source files and existing contrast/source checks |
| npm.cmd run test -- --reporter=list,json,html | ${playwright.stats.unexpected === 0 && interrupted === 0 && playwright.errors.length === 0 ? "PASS" : "FAIL"}, ${playwright.stats.expected} passed, ${playwright.stats.unexpected} failed, ${playwright.stats.skipped} skipped, ${interrupted} interrupted, ${playwright.errors.length} runner errors |
| node scripts/verify-product-images.mjs | ${visual.results.length === 6 && visual.networkFailures.length === 0 ? "PASS" : "FAIL"}, ${visual.results.length}/6 requested widths |

Evidence: [Playwright JSON](product-image-artifacts/playwright-results.json), [HTML report](playwright-report/index.html), [visual JSON](product-image-artifacts/visual-verification.json), original hash assertions in tests/domain.test.mjs. Existing cart arithmetic/persistence, search, variants, filtering, keyboard access and responsive tests are included in the full browser run, along with 15 new image-focused tests.

Initial verification identified and resolved raw-comma URL 404s and hidden bag pending text. One new search-image test needed to wait for filtered suggestions before asserting its single image. An intermediate typecheck overlapped a build cleaning generated .next types; the final sequential typecheck passed. A browser run encountered Chromium ERR_NETWORK_IO_SUSPENDED while navigating /shop at 360px (40 tests passed and one navigation failed); its evidence is retained in [playwright-network-suspended-run.json](product-image-artifacts/playwright-network-suspended-run.json). The full suite was rerun after the independent screenshot browser finished. The final results above describe that complete rerun.

## Exact files changed or added

`;
for (const file of modified) report += `- [${file}](${file})\n`;
report += `
Generated verification artifacts: product-image-artifacts/inventory.json, two inventory contact sheets, visual-verification.json, playwright-results.json, ${screenshots.length} dedicated screenshots, and the standard Playwright test-results / playwright-report output. No original photograph was modified. The repository was already entirely untracked at the start, so this list records the files touched by this task rather than relying on git diff.
`;
await writeFile("PRODUCT_IMAGE_INTEGRATION_REPORT.md", report);
console.log(`Wrote report: ${productFiles.length} product images, ${products.length} mapped products, ${screenshots.length} screenshots, ${playwright.stats.expected} browser passes / ${playwright.stats.unexpected} failures.`);
