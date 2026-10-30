# SECTION 88 — Screenshot review

Final production screenshot pass: 30 October 2026, Chromium. Server http://127.0.0.1:3140, built before the browser run; no assets rebuilt during inspection. Original audit screenshots remain under audit-artifacts and root references remain unchanged.

## Capture inventory

**59 PNGs** in refinement-artifacts/screenshots/. Most full pages use 1440×900 and 390×900 CSS viewports. Focused crops use the same widths, with element-derived heights. “viewport” images show fixed modal/drawer composition within the 900px window; full-page overlay images also show the underlying document, which is not an expanded-height modal.

| File | Viewport / capture |
|---|---|
| [404-1440.png](refinement-artifacts/screenshots/404-1440.png) | 1440px desktop / full page |
| [404-390.png](refinement-artifacts/screenshots/404-390.png) | 390px mobile / full page |
| [bag-open-1440.png](refinement-artifacts/screenshots/bag-open-1440.png) | 1440px desktop / full page |
| [bag-open-390.png](refinement-artifacts/screenshots/bag-open-390.png) | 390px mobile / full page |
| [bag-open-viewport-1440.png](refinement-artifacts/screenshots/bag-open-viewport-1440.png) | 1440px desktop / viewport overlay |
| [bag-open-viewport-390.png](refinement-artifacts/screenshots/bag-open-viewport-390.png) | 390px mobile / viewport overlay |
| [cart-empty-1440.png](refinement-artifacts/screenshots/cart-empty-1440.png) | 1440px desktop / full page |
| [cart-empty-390.png](refinement-artifacts/screenshots/cart-empty-390.png) | 390px mobile / full page |
| [cart-populated-1440.png](refinement-artifacts/screenshots/cart-populated-1440.png) | 1440px desktop / full page |
| [cart-populated-390.png](refinement-artifacts/screenshots/cart-populated-390.png) | 390px mobile / full page |
| [contact-1440.png](refinement-artifacts/screenshots/contact-1440.png) | 1440px desktop / full page |
| [contact-390.png](refinement-artifacts/screenshots/contact-390.png) | 390px mobile / full page |
| [faq-1440.png](refinement-artifacts/screenshots/faq-1440.png) | 1440px desktop / full page |
| [faq-390.png](refinement-artifacts/screenshots/faq-390.png) | 390px mobile / full page |
| [filters-open-390.png](refinement-artifacts/screenshots/filters-open-390.png) | 390px mobile / full page |
| [filters-open-viewport-390.png](refinement-artifacts/screenshots/filters-open-viewport-390.png) | 390px mobile / viewport overlay |
| [footer-1440.png](refinement-artifacts/screenshots/footer-1440.png) | 1440px desktop / focused element |
| [footer-390.png](refinement-artifacts/screenshots/footer-390.png) | 390px mobile / focused element |
| [hero-1440.png](refinement-artifacts/screenshots/hero-1440.png) | 1440px desktop / focused element |
| [hero-390.png](refinement-artifacts/screenshots/hero-390.png) | 390px mobile / focused element |
| [homepage-1440.png](refinement-artifacts/screenshots/homepage-1440.png) | 1440px desktop / full page |
| [homepage-390.png](refinement-artifacts/screenshots/homepage-390.png) | 390px mobile / full page |
| [lookbook-1440.png](refinement-artifacts/screenshots/lookbook-1440.png) | 1440px desktop / full page |
| [lookbook-390.png](refinement-artifacts/screenshots/lookbook-390.png) | 390px mobile / full page |
| [navigation-open-1440.png](refinement-artifacts/screenshots/navigation-open-1440.png) | 1440px desktop / full page |
| [navigation-open-390.png](refinement-artifacts/screenshots/navigation-open-390.png) | 390px mobile / full page |
| [navigation-open-viewport-1440.png](refinement-artifacts/screenshots/navigation-open-viewport-1440.png) | 1440px desktop / viewport overlay |
| [navigation-open-viewport-390.png](refinement-artifacts/screenshots/navigation-open-viewport-390.png) | 390px mobile / viewport overlay |
| [privacy-1440.png](refinement-artifacts/screenshots/privacy-1440.png) | 1440px desktop / full page |
| [privacy-390.png](refinement-artifacts/screenshots/privacy-390.png) | 390px mobile / full page |
| [product-1440.png](refinement-artifacts/screenshots/product-1440.png) | 1440px desktop / full page |
| [product-390.png](refinement-artifacts/screenshots/product-390.png) | 390px mobile / full page |
| [product-card-hover-1440.png](refinement-artifacts/screenshots/product-card-hover-1440.png) | 1440px desktop / focused element |
| [product-card-hover-390.png](refinement-artifacts/screenshots/product-card-hover-390.png) | 390px mobile / focused element |
| [product-grid-1440.png](refinement-artifacts/screenshots/product-grid-1440.png) | 1440px desktop / focused element |
| [product-grid-390.png](refinement-artifacts/screenshots/product-grid-390.png) | 390px mobile / focused element |
| [purchase-region-1440.png](refinement-artifacts/screenshots/purchase-region-1440.png) | 1440px desktop / focused element |
| [purchase-region-390.png](refinement-artifacts/screenshots/purchase-region-390.png) | 390px mobile / focused element |
| [search-idle-viewport-390.png](refinement-artifacts/screenshots/search-idle-viewport-390.png) | 390px mobile / viewport overlay |
| [search-open-1440.png](refinement-artifacts/screenshots/search-open-1440.png) | 1440px desktop / full page |
| [search-open-390.png](refinement-artifacts/screenshots/search-open-390.png) | 390px mobile / full page |
| [search-open-viewport-1440.png](refinement-artifacts/screenshots/search-open-viewport-1440.png) | 1440px desktop / viewport overlay |
| [search-open-viewport-390.png](refinement-artifacts/screenshots/search-open-viewport-390.png) | 390px mobile / viewport overlay |
| [search-results-1440.png](refinement-artifacts/screenshots/search-results-1440.png) | 1440px desktop / full page |
| [search-results-390.png](refinement-artifacts/screenshots/search-results-390.png) | 390px mobile / full page |
| [shipping-1440.png](refinement-artifacts/screenshots/shipping-1440.png) | 1440px desktop / full page |
| [shipping-390.png](refinement-artifacts/screenshots/shipping-390.png) | 390px mobile / full page |
| [shop-1440.png](refinement-artifacts/screenshots/shop-1440.png) | 1440px desktop / full page |
| [shop-390.png](refinement-artifacts/screenshots/shop-390.png) | 390px mobile / full page |
| [size-guide-open-1440.png](refinement-artifacts/screenshots/size-guide-open-1440.png) | 1440px desktop / full page |
| [size-guide-open-390.png](refinement-artifacts/screenshots/size-guide-open-390.png) | 390px mobile / full page |
| [size-guide-open-viewport-1440.png](refinement-artifacts/screenshots/size-guide-open-viewport-1440.png) | 1440px desktop / viewport overlay |
| [size-guide-open-viewport-390.png](refinement-artifacts/screenshots/size-guide-open-viewport-390.png) | 390px mobile / viewport overlay |
| [size-guide-page-1440.png](refinement-artifacts/screenshots/size-guide-page-1440.png) | 1440px desktop / full page |
| [size-guide-page-390.png](refinement-artifacts/screenshots/size-guide-page-390.png) | 390px mobile / full page |
| [story-1440.png](refinement-artifacts/screenshots/story-1440.png) | 1440px desktop / full page |
| [story-390.png](refinement-artifacts/screenshots/story-390.png) | 390px mobile / full page |
| [terms-1440.png](refinement-artifacts/screenshots/terms-1440.png) | 1440px desktop / full page |
| [terms-390.png](refinement-artifacts/screenshots/terms-390.png) | 390px mobile / full page |

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

Browser availability: firefox: unavailable; webkit: unavailable. Missing engine binaries are recorded in refinement-artifacts/observations.json. No physical iOS/Android device or assistive-technology session is claimed. The supplemental search-idle viewport image was captured during the preceding inspection on port 3139; its composition is unchanged. The reproducible final collector produces the other 58 PNGs.
