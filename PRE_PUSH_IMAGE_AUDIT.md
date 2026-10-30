# SECTION 88 — Pre-Push Image Audit

**Audit date:** 2026-10-31

## Homepage hero

The recursive inventory of `public/images` contains 62 image files and no exact `Daisy-Headed Wanderer Amid Floating Ruins.png` file. There are similarly named daisy product photographs, but neither is the approved secondary hero image, so neither was substituted.

The `home-hero-bloom` slot ID and focal point remain configured, but its `src` was removed. The existing `HeroMedia` component conditionally omits the secondary layer when the source is absent. The primary hero remains `/images/Frosted Silhouette in Minimal Light.png`; no hero image was copied, renamed, or deleted.

**Path removed from the optional slot:** `/images/Daisy-Headed Wanderer Amid Floating Ruins.png`. No other image path was changed for the hero.

## Pending photography and commerce state

- Twenty Paper product photo slots remain unfilled across the five Paper color variants. Their explicit empty media mappings still render the existing “Photography pending” state in preview. No Ink photos were reused, no replacements were generated, and the Paper variants and `demo-only` availability were not changed. Product pages continue to identify the catalog as a prelaunch preview and checkout as unavailable.
- `lookbook-5` remains in configuration without a source and is filtered out of the public gallery. The gallery still displays exactly five approved photographs.
- The three Our Story images and all approved homepage, product Ink, and Lookbook images remain in place.

The guide now lists 22 unfilled configured slots: 20 Paper views, optional `lookbook-5`, and the reserved, disabled `home-hero-bloom` slot.

## Browser audit and screenshots

Added `tests/browser/image-audit.spec.ts`. It checks image responses and decode status at 390px and 1440px on `/`, `/shop`, `/products/signal-study`, `/lookbook`, `/our-story`, `/search`, `/cart`, `/size-guide`, `/faq`, `/contact`, and `/shipping-returns`. It also verifies the primary hero source, absence of the disabled secondary layer, five visible Lookbook frames, three Our Story images, and the Paper pending preview.

No local image requests failed on the audited routes. Desktop and mobile homepage screenshots were inspected:

- [Homepage at 1440px](audit-artifacts/image-audit/home-1440.png)
- [Homepage at 390px](audit-artifacts/image-audit/home-390.png)

The primary Frosted Silhouette remains visible in both. No missing-image indicator or unexpected visual change appeared.

## Checks

| Check | Result |
|---|---|
| `npm.cmd run typecheck` | Passed |
| `npm.cmd run lint` | Passed with zero warnings |
| `npm.cmd run build` | Passed; all 26 static pages generated |
| `npm.cmd run test:unit` | Passed; 15 tests |
| `npm.cmd run audit:source` | Passed |
| Full Playwright suite | Passed; 58 tests in Chromium, including the route image audit and existing storefront, Lookbook, product, responsive, and Story checks |
| Desktop/mobile visual inspection | Completed at 1440px and 390px |

## GitHub readiness

**Ready for a GitHub push.** No local image request fails, all integration checks pass, and the absent Daisy image is safely disabled without affecting the primary hero. The Paper variants remain preview-only with unfilled photos; this audit does not approve them for sale or enable checkout. No push or deployment was performed.
