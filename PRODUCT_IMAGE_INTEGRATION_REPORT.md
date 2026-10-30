# SECTION 88 — Product image integration report

## Result

Inspected **40 product PNGs** in ten folders, plus **1 existing image in the root of public/images** (41 image files total; .gitkeep excluded). All ten products have complete **Ink** photography in front / back / on-body / detail order. Forty unique image files populate forty exact Ink slot IDs. No product images are missing or ambiguous after visual inspection. All five configured Paper sets (20 slots) remain explicitly pending; no white garments were supplied.

All originals are preserved at their existing paths. No normalized copies, conversions, generated photographs, external hosting, deployment or push were used. Original dimensions and SHA-256 hashes are recorded in [inventory.json](product-image-artifacts/inventory.json). The 14-test unit suite verifies each mapped file against those hashes and actual image dimensions. The original hero configuration, typography, palette, layouts, catalogue data, prices, fits, descriptions, availability and variant IDs are preserved.

## Product 01 relationship

**Confirmed: Charcoal Tee → 01 Signal Study.** The folder contains section88_signal_study_back.png, section88_signal_study_on_body.png and section88_signal_study_fabric_detail.png. Visual inspection shows the same charcoal garment, distressed cream concentric rings and lime signal line as Floating Charcoal Tee in Minimalist Studio.png. The back intentionally varies the placement of the ring artwork. The catalogue has no contradictory artwork specification; its description is a generic sample fixture. Signal Study remains the product name; no merchandise was renamed.

## Complete image mapping

Each filename below links to the untouched original. Runtime sources use /images/<encoded folder>/<encoded filename>. Spaces and commas are encoded per path segment with encodeURIComponent, because raw commas in the timestamped filenames caused reproducible Next.js static/optimizer 404s during initial testing. Encoding resolved these without copying or renaming files.

| Product | Color | Folder | Front / 0 | Back / 1 | On-body / 2 | Detail / 3 |
|---|---|---|---|---|---|---|
| 01 — Signal Study | Ink (charcoal / washed black) | Charcoal Tee | [Floating Charcoal Tee in Minimalist Studio.png](public/images/Charcoal%20Tee/Floating%20Charcoal%20Tee%20in%20Minimalist%20Studio.png) | [section88_signal_study_back.png](public/images/Charcoal%20Tee/section88_signal_study_back.png) | [section88_signal_study_on_body.png](public/images/Charcoal%20Tee/section88_signal_study_on_body.png) | [section88_signal_study_fabric_detail.png](public/images/Charcoal%20Tee/section88_signal_study_fabric_detail.png) |
| 02 — Off Register | Ink (charcoal / washed black) | Off Register | [Suspended Washed Black Graphic T-Shirt.png](public/images/Off%20Register/Suspended%20Washed%20Black%20Graphic%20T-Shirt.png) | [SECTION88_Off_Register_Back.png](public/images/Off%20Register/SECTION88_Off_Register_Back.png) | [SECTION88_Off_Register_On_Body.png](public/images/Off%20Register/SECTION88_Off_Register_On_Body.png) | [SECTION88_Off_Register_Fabric_Detail.png](public/images/Off%20Register/SECTION88_Off_Register_Fabric_Detail.png) |
| 03 — Open Channel | Ink (charcoal / washed black) | Open Channel | [Floating Portal Graphic T-Shirt.png](public/images/Open%20Channel/Floating%20Portal%20Graphic%20T-Shirt.png) | [ChatGPT Image Oct 30, 2026, 04_37_47 PM-1.png](public/images/Open%20Channel/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2004_37_47%20PM-1.png) | [ChatGPT Image Oct 30, 2026, 04_37_51 PM-2.png](public/images/Open%20Channel/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2004_37_51%20PM-2.png) | [ChatGPT Image Oct 30, 2026, 04_37_54 PM-3.png](public/images/Open%20Channel/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2004_37_54%20PM-3.png) |
| 04 — After Hours | Ink (charcoal / washed black) | After Hours | [Moonlit Brutalist Cityscape T-Shirt.png](public/images/After%20Hours/Moonlit%20Brutalist%20Cityscape%20T-Shirt.png) | [SECTION88_After_Hours_Back.png](public/images/After%20Hours/SECTION88_After_Hours_Back.png) | [SECTION88_After_Hours_On_Body.png](public/images/After%20Hours/SECTION88_After_Hours_On_Body.png) | [SECTION88_After_Hours_Fabric_Detail.png](public/images/After%20Hours/SECTION88_After_Hours_Fabric_Detail.png) |
| 05 — Common Ground | Ink (charcoal / washed black) | Common Ground | [Suspended Staircase Daisy Tee.png](public/images/Common%20Ground/Suspended%20Staircase%20Daisy%20Tee.png) | [ChatGPT Image Oct 30, 2026, 05_06_08 PM-1.png](public/images/Common%20Ground/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_06_08%20PM-1.png) | [ChatGPT Image Oct 30, 2026, 05_06_11 PM-2.png](public/images/Common%20Ground/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_06_11%20PM-2.png) | [ChatGPT Image Oct 30, 2026, 05_06_13 PM-3.png](public/images/Common%20Ground/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_06_13%20PM-3.png) |
| 06 — Side Effect | Ink (charcoal / washed black) | Side Effect | [Floating Black Tee with Glitch Sculpture Print.png](public/images/Side%20Effect/Floating%20Black%20Tee%20with%20Glitch%20Sculpture%20Print.png) | [SECTION88_Side_Effect_Back.png](public/images/Side%20Effect/SECTION88_Side_Effect_Back.png) | [SECTION88_Side_Effect_On_Body.png](public/images/Side%20Effect/SECTION88_Side_Effect_On_Body.png) | [SECTION88_Side_Effect_Fabric_Detail.png](public/images/Side%20Effect/SECTION88_Side_Effect_Fabric_Detail.png) |
| 07 — Static Motion | Ink (charcoal / washed black) | Static Motion | [Suspended Marble Orbit T-Shirt.png](public/images/Static%20Motion/Suspended%20Marble%20Orbit%20T-Shirt.png) | [ChatGPT Image Oct 30, 2026, 05_44_54 PM-1.png](public/images/Static%20Motion/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_44_54%20PM-1.png) | [ChatGPT Image Oct 30, 2026, 05_44_56 PM-2.png](public/images/Static%20Motion/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_44_56%20PM-2.png) | [ChatGPT Image Oct 30, 2026, 05_44_58 PM-3.png](public/images/Static%20Motion/ChatGPT%20Image%20Oct%2030%2C%202026%2C%2005_44_58%20PM-3.png) |
| 08 — New Frequency | Ink (charcoal / washed black) | New Frequency | [Daisy Wave Black T-Shirt.png](public/images/New%20Frequency/Daisy%20Wave%20Black%20T-Shirt.png) | [SECTION88_New_Frequency_Back.png](public/images/New%20Frequency/SECTION88_New_Frequency_Back.png) | [SECTION88_New_Frequency_On_Body.png](public/images/New%20Frequency/SECTION88_New_Frequency_On_Body.png) | [SECTION88_New_Frequency_Fabric_Detail.png](public/images/New%20Frequency/SECTION88_New_Frequency_Fabric_Detail.png) |
| 09 — Outside the Frame | Ink (charcoal / washed black) | Outside the Frame | [Surreal Concrete Horizon Graphic Tee.png](public/images/Outside%20the%20Frame/Surreal%20Concrete%20Horizon%20Graphic%20Tee.png) | [SECTION88_Outside_The_Frame_Back.png](public/images/Outside%20the%20Frame/SECTION88_Outside_The_Frame_Back.png) | [SECTION88_Outside_The_Frame_On_Body.png](public/images/Outside%20the%20Frame/SECTION88_Outside_The_Frame_On_Body.png) | [SECTION88_Outside_The_Frame_Fabric_Detail.png](public/images/Outside%20the%20Frame/SECTION88_Outside_The_Frame_Fabric_Detail.png) |
| 10 — Unwritten | Ink (charcoal / washed black) | Unwritten | [Floating Black Tee with Folded Paper Graphic.png](public/images/Unwritten/Floating%20Black%20Tee%20with%20Folded%20Paper%20Graphic.png) | [SECTION88_Unwritten_Back.png](public/images/Unwritten/SECTION88_Unwritten_Back.png) | [SECTION88_Unwritten_On_Body.png](public/images/Unwritten/SECTION88_Unwritten_On_Body.png) | [SECTION88_Unwritten_Fabric_Detail.png](public/images/Unwritten/SECTION88_Unwritten_Fabric_Detail.png) |

## Dimensions and inspected view identification

All 10 front images are 1122 × 1402. After Hours, Charcoal Tee, New Frequency, Off Register, Outside the Frame, Side Effect and Unwritten have 1600 × 2000 backs and model images, and 1600 × 1600 details. Common Ground, Open Channel and Static Motion have 1122 × 1402 backs and model images, and 1254 × 1254 details. All sources are PNG. Complete sizes, file bytes and hashes are in the inventory.

The timestamped -1 images show the back neckline and back artwork; -2 shows the model; -3 is the square print/fabric detail. This identification was established by inspecting the actual images, rather than inferring it from sequence numbers. [Contact sheet 1](product-image-artifacts/inventory-contact-sheet-1.png) and [contact sheet 2](product-image-artifacts/inventory-contact-sheet-2.png) preserve the visual inventory. Sheet columns follow the inventoried filename order, not gallery order; the table above is authoritative.

## Slots and reuse

| Product | Front | Back | On-body | Detail | Paper |
|---|---|---|---|---|---|
| 01 Signal Study | `sample-01-ink-0` | `sample-01-ink-1` | `sample-01-ink-2` | `sample-01-ink-3` | 4 existing slots, photography pending |
| 02 Off Register | `sample-02-ink-0` | `sample-02-ink-1` | `sample-02-ink-2` | `sample-02-ink-3` | Not configured |
| 03 Open Channel | `sample-03-ink-0` | `sample-03-ink-1` | `sample-03-ink-2` | `sample-03-ink-3` | 4 existing slots, photography pending |
| 04 After Hours | `sample-04-ink-0` | `sample-04-ink-1` | `sample-04-ink-2` | `sample-04-ink-3` | Not configured |
| 05 Common Ground | `sample-05-ink-0` | `sample-05-ink-1` | `sample-05-ink-2` | `sample-05-ink-3` | 4 existing slots, photography pending |
| 06 Side Effect | `sample-06-ink-0` | `sample-06-ink-1` | `sample-06-ink-2` | `sample-06-ink-3` | Not configured |
| 07 Static Motion | `sample-07-ink-0` | `sample-07-ink-1` | `sample-07-ink-2` | `sample-07-ink-3` | 4 existing slots, photography pending |
| 08 New Frequency | `sample-08-ink-0` | `sample-08-ink-1` | `sample-08-ink-2` | `sample-08-ink-3` | Not configured |
| 09 Outside the Frame | `sample-09-ink-0` | `sample-09-ink-1` | `sample-09-ink-2` | `sample-09-ink-3` | 4 existing slots, photography pending |
| 10 Unwritten | `sample-10-ink-0` | `sample-10-ink-1` | `sample-10-ink-2` | `sample-10-ink-3` | Not configured |

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
| 375px | 13 | None | 0 |
| 390px | 14 | None | 0 |
| 768px | 13 | None | 0 |
| 1024px | 13 | None | 0 |
| 1440px | 16 | None | 0 |
| 1920px | 13 | None | 0 |

**82 dedicated screenshots** are in [product-image-artifacts/screenshots](product-image-artifacts/screenshots). [Visual verification JSON](product-image-artifacts/visual-verification.json) contains route checks, layout-shift entries and network failures (0 failed HTTP responses in the final visual run). The browser suite separately captures its responsive route screenshots in test-results.

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

- 768px /shop: 0.187000, sources: closing-strip, site-footer.
- 768px /products/signal-study: 0.461000, sources: site-footer.
- 1024px /shop: 0.185000, sources: closing-strip, site-footer.
- 1440px /shop: 0.142000, sources: closing-strip, site-footer.
- 1920px /shop: 0.133000, sources: closing-strip, site-footer.

## Test results

| Command | Actual final result |
|---|---|
| npm.cmd run typecheck | PASS, exit 0 |
| npm.cmd run lint | PASS, exit 0, zero warnings |
| npm.cmd run build | PASS, exit 0, 26 generated static pages |
| npm.cmd run test:unit | PASS, 14/14 |
| npm.cmd run audit:source | PASS, 47 TypeScript source files and existing contrast/source checks |
| npm.cmd run test -- --reporter=list,json,html | PASS, 41 passed, 0 failed, 0 skipped, 0 interrupted, 0 runner errors |
| node scripts/verify-product-images.mjs | PASS, 6/6 requested widths |

Evidence: [Playwright JSON](product-image-artifacts/playwright-results.json), [HTML report](playwright-report/index.html), [visual JSON](product-image-artifacts/visual-verification.json), original hash assertions in tests/domain.test.mjs. Existing cart arithmetic/persistence, search, variants, filtering, keyboard access and responsive tests are included in the full browser run, along with 15 new image-focused tests.

Initial verification identified and resolved raw-comma URL 404s and hidden bag pending text. One new search-image test needed to wait for filtered suggestions before asserting its single image. An intermediate typecheck overlapped a build cleaning generated .next types; the final sequential typecheck passed. A browser run encountered Chromium ERR_NETWORK_IO_SUSPENDED while navigating /shop at 360px (40 tests passed and one navigation failed); its evidence is retained in [playwright-network-suspended-run.json](product-image-artifacts/playwright-network-suspended-run.json). The full suite was rerun after the independent screenshot browser finished. The final results above describe that complete rerun.

## Exact files changed or added

- [src/config/product-media.ts](src/config/product-media.ts)
- [src/config/images.ts](src/config/images.ts)
- [src/data/products.ts](src/data/products.ts)
- [src/components/image-placeholder.tsx](src/components/image-placeholder.tsx)
- [src/components/product-gallery.tsx](src/components/product-gallery.tsx)
- [src/app/globals.css](src/app/globals.css)
- [tests/domain.test.mjs](tests/domain.test.mjs)
- [tests/browser/product-images.spec.ts](tests/browser/product-images.spec.ts)
- [IMAGE_PLACEMENT_GUIDE.md](IMAGE_PLACEMENT_GUIDE.md)
- [scripts/inventory-product-images.mjs](scripts/inventory-product-images.mjs)
- [scripts/verify-product-images.mjs](scripts/verify-product-images.mjs)
- [scripts/report-product-images.mjs](scripts/report-product-images.mjs)
- [PRODUCT_IMAGE_INTEGRATION_REPORT.md](PRODUCT_IMAGE_INTEGRATION_REPORT.md)

Generated verification artifacts: product-image-artifacts/inventory.json, two inventory contact sheets, visual-verification.json, playwright-results.json, 82 dedicated screenshots, and the standard Playwright test-results / playwright-report output. No original photograph was modified. The repository was already entirely untracked at the start, so this list records the files touched by this task rather than relying on git diff.
