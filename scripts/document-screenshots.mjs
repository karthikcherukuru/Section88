import { readFile, readdir, writeFile } from "node:fs/promises";
const { browserCoverage } = JSON.parse(await readFile("refinement-artifacts/observations.json", "utf8"));
const files = (await readdir("refinement-artifacts/screenshots")).filter(file => file.endsWith(".png")).sort();
let report = `# SECTION 88 — Screenshot review

Final production screenshot pass: 30 October 2026, Chromium. Server http://127.0.0.1:3140, built before the browser run; no assets rebuilt during inspection. Original audit screenshots remain under audit-artifacts and root references remain unchanged.

## Capture inventory

**${files.length} PNGs** in refinement-artifacts/screenshots/. Most full pages use 1440×900 and 390×900 CSS viewports. Focused crops use the same widths, with element-derived heights. “viewport” images show fixed modal/drawer composition within the 900px window; full-page overlay images also show the underlying document, which is not an expanded-height modal.

| File | Viewport / capture |
|---|---|
`;
for (const file of files) report += `| [${file}](refinement-artifacts/screenshots/${file}) | ${file.includes("1440") ? "1440px desktop" : "390px mobile"} / ${file.includes("viewport") ? "viewport overlay" : /^(hero|footer|product-grid|product-card-hover|purchase-region)-/.test(file) ? "focused element" : "full page"} |\n`;
report += `
## Visual assessment

| Surface | Observations and corrections |
|---|---|
| Homepage | Solid two-line desktop statement, independent stacked mobile hero, four-piece collection, split campaign and staggered substance modules. Removed repeated seven-product grid and generic pillars. Dark manifesto remains a deliberate interruption. |
| Collection | Two-column desktop grid; five complete rows for ten pieces. Paper underneath filtered partial rows. Metadata above images and product name/price below. One-column fallback at 320px preserves reading size. |
| Product | Mobile title and price precede the image. One main frame and counter replace a tall thumbnail strip. Ink CTA, checkmarked colors, strong selected sizes and readable accordions. Three related products leave clean paper in an incomplete mobile row. |
| Lookbook | Six independently configurable frames, varied desktop scale, staggered left/right mobile insets; captions remain honest pending content. |
| Story | Different jobs for origin, process and philosophy sections. Provisional brand copy is marked; no invented founder or material narrative. |
| Cart | Aligned item/variant/quantity hierarchy and subtotal; honest disabled checkout. Empty and populated states captured. Drawer internally scrolls on constrained screens. |
| Navigation/search | Full mobile panel, clear large links and 44px close controls. Search retains readable query, real local results and clear actions. |
| Filters / sizing | Bottom sheet with explicit clear/apply; fit-specific pending measurement table, readable units and measurement method. |
| Supporting pages | Shared headings, consistent reading width, distinct labels/fields, generous accordion targets, preserved policy/demo disclosures. 404 recovery has a clear collection CTA. |
| Footer | Legible navigation, functional 44px link targets, compact legal row and intentional large wordmark without horizontal overflow. |
| Motion/hover | Restrained utility/arrow feedback. Placeholders do not scale; only real photography will gain scale/crossfade. Hero sequence finishes within 720ms. Reduced-motion captures keep all content visible. |

An initial overlay screenshot pass retained the footer scroll position after a focused footer capture. The collector now scrolls to the top before opening navigation and waits for search debounce results; viewport crops were added for meaningful modal review. These were capture corrections, not hidden source defects.

## Measured comparison

| Measure | Audit baseline | Refined | Interpretation |
|---|---:|---:|---|
| Homepage, 1440px | 7888px | 4882px | About 38% shorter; complete editorial sequence remains |
| Homepage, 390px | 6978px | 5949px | About 15% shorter while increasing readable type |
| Product page, 390px | 3345px | 3360px | Total length is similar because related/footer content remains; the important change is immediate title/price and earlier purchase context, not hiding content |

All eleven widths (320/360/375/390/430/768/990/1024/1280/1440/1920) passed route overflow checks. Tablet variants were reviewed through the responsive captures in refinement-artifacts/test-results. A 720×450 CSS viewport at 2× output scale passed a 200% desktop zoom-equivalent reflow check for home, shop and product; this is not a browser UI text-zoom certification.

## Remaining visual dependencies

Neutral frames intentionally remain. Actual crop quality, photographic contrast, color matching, front/back alignment, texture clarity, image payloads and real-asset hover/zoom need review after image delivery. No stock, fabricated garment illustration, or generated photography was used. Browser/device screenshots do not establish formal WCAG conformance.

Browser availability: ${browserCoverage.map(item => `${item.browser}: ${item.status}`).join("; ")}. Missing engine binaries are recorded in refinement-artifacts/observations.json. No physical iOS/Android device or assistive-technology session is claimed. The supplemental search-idle viewport image was captured during the preceding inspection on port 3139; its composition is unchanged. The reproducible final collector produces the other 58 PNGs.
`;
await writeFile("SCREENSHOT_REVIEW.md", report);
console.log(`Wrote screenshot review for ${files.length} PNGs.`);
