# SECTION 88 — Homepage editorial image integration

Completed locally on 2026-10-30. All five supplied images were opened, inspected, dimension-checked and integrated into the existing `imageSlots` / `ImagePlaceholder` architecture. No push or deployment was performed.

## Confirmed mappings

Every filename is preserved exactly under `public/images/`; its URL is `/images/` followed by that filename. Original PNGs are unchanged.

| Configuration ID | Exact filename | Source pixels | Frame ratio | Focal point |
|---|---|---|---|---|
| `home-campaign` | `Lone Figure in Golden Concrete Light.png` | 1086 × 1448 | 16:9 | Desktop 50% 52%; mobile 50% 50% |
| `home-fit` | `Sunlit Brutalist Elegance.png` | 1672 × 941 | 3:4 | 66% 50% |
| `home-graphic` | `Origami Print on Black Cotton.png` | 1254 × 1254 | 1:1 | 50% 50% |
| `home-construction` | `Moody Black T-Shirt on Stone.png` | 1254 × 1254 | 1:1 | 50% 50% |
| `home-story` | `Moody Minimalist Streetwear Portrait.png` | 1086 × 1448 | 3:4 | 50% 50% |

## Implementation

- `src/config/images.ts`: the five sources, observed alt descriptions, original dimensions, cover treatment and focal points; added optional `mobileFocalPoint` to the existing slot type.
- `src/components/image-placeholder.tsx`: passes desktop/mobile focal points to the existing frame via CSS variables. Continues to use optimized Next.js Image, `fill`, reserved ratios, lazy loading and the existing error fallback.
- `src/app/page.tsx`: responsive `sizes`, editorial image classes, and 12px travel for the existing Campaign/Story reveals. Fit source sizing accounts for its wide source behind a portrait crop.
- `src/components/reveal.tsx`: optional entrance distance; other callers retain their existing default.
- `src/app/globals.css`: responsive focal positioning and an editorial opacity reveal using the existing keyframe, 480ms token and easing. Motion is enabled only for `prefers-reduced-motion: no-preference`.
- `IMAGE_PLACEMENT_GUIDE.md`: current mappings, framing decisions and remaining slots.
- `scripts/verify-editorial-images.mjs`: repeatable browser verification, screenshots, original-file hashes and pending-slot inventory. Run against the production preview with `node scripts/verify-editorial-images.mjs`; defaults to `http://127.0.0.1:3140`, overridable with `EDITORIAL_URL`.

Hero sources, hero rendering, all product media mappings, product data, navigation, text, buttons and cart code were preserved. SHA-256 checks confirm all 46 original image files are unchanged, including all forty product photographs. No new animation dependencies or image configuration system were introduced.

## Visual review and framing limits

All section screenshots were opened and visually inspected at 375, 390, 768, 1024, 1440 and 1920px. Full homepage screenshots were inspected at 390px and 1440px. The shared black garments, geometric print, warm architectural light and concrete surfaces maintain a consistent editorial sequence.

- Campaign: the portrait source cannot display a full standing figure within a 16:9 cover frame. The chosen crop preserves the head, complete T-shirt, sleeves, back graphic and hem, plus surrounding architecture. Lower legs and upper architecture are intentionally outside the frame. A full-body version would require a landscape source or a contain treatment.
- Fit: rightward focal positioning preserves the head, shoulders, sleeves, print and hem. The side environment is cropped. Full-size originals limit detail on large, high-density displays; no additional blur or sharpening is applied.
- Graphic / Construction: square sources retain the full print, fabric folds, neckline and visible stitching. Alt text does not claim a material specification or construction method.
- Story: the entire portrait remains visible, including footwear and reflection. Its original grading provides separation from the dark panel without filters. Mobile retains the existing 300px maximum image width.
- Existing borders, whitespace, headings, CTAs and the alternating mobile image/text sequence remain intact. No stretching, horizontal overflow, image-decoding layout shift, permanent opacity reduction or obstructed CTA was detected.

## Screenshot paths

All paths are relative to `C:\Users\karthik\Desktop\section88`.

| Capture | Desktop (1440px) | Mobile (390px) |
|---|---|---|
| Campaign | [campaign-1440.png](editorial-image-artifacts/screenshots/campaign-1440.png) | [campaign-390.png](editorial-image-artifacts/screenshots/campaign-390.png) |
| Fit / Graphic / Construction | [substance-1440.png](editorial-image-artifacts/screenshots/substance-1440.png) | [substance-390.png](editorial-image-artifacts/screenshots/substance-390.png) |
| Dark manifesto | [story-1440.png](editorial-image-artifacts/screenshots/story-1440.png) | [story-390.png](editorial-image-artifacts/screenshots/story-390.png) |
| Full homepage | [homepage-1440.png](editorial-image-artifacts/screenshots/homepage-1440.png) | [homepage-390.png](editorial-image-artifacts/screenshots/homepage-390.png) |

The same four captures also exist for widths 375, 768, 1024 and 1920: `editorial-image-artifacts/screenshots/{campaign,substance,story,homepage}-{width}.png` (24 screenshots total). Capture-only styling places the sticky header in normal document flow to prevent it obscuring section captures; production styling is untouched.

## Verification results

| Check | Result |
|---|---|
| `npm.cmd run typecheck` | Pass |
| `npm.cmd run lint` | Pass, zero warnings |
| `npm.cmd run build` | Pass, 26 static pages generated |
| `npm.cmd run test:unit` | 14 passed |
| Existing Playwright suite | 41 passed, 4.4 minutes |
| Editorial browser audit | Pass at all six requested widths |
| Original and optimized image URLs | All five return HTTP 200 at each width |
| Reserved frame geometry | Unchanged before/after image decoding; correct ratios |
| Editorial loading | All five lazy; local Next.js optimized URLs |
| Horizontal overflow / browser page errors | None across all six editorial captures |
| Mobile layout | Image left / right / left retained |
| Image reveal | 480ms opacity; Campaign/Story entrance 12px |
| Reduced motion | No editorial CSS reveal or JS entrance animation |
| Existing image originals | 46/46 SHA-256 hashes unchanged |

The existing Playwright tests ran against the fresh production build on port 3140 using `playwright.refinement.config.ts`, with the existing test cases unchanged. This suite covers product images, galleries, hover, zoom, search, cart persistence/arithmetic, filters, keyboard controls, navigation, responsive routes, reduced motion and demo forms.

Machine-readable evidence: [verification.json](editorial-image-artifacts/verification.json), [playwright-results.json](editorial-image-artifacts/playwright-results.json), [source-image-baseline.json](editorial-image-artifacts/source-image-baseline.json).

## Existing issues observed

1. The optional `home-hero-bloom` source was absent from the current recursive image inventory and is now safely unpopulated. The primary Frosted Silhouette hero remains configured and loads. No unrelated image is substituted. See [PRE_PUSH_IMAGE_AUDIT.md](PRE_PUSH_IMAGE_AUDIT.md) for fresh 1440px/390px route checks.
2. The initial route shell can shift the footer when the existing loading placeholder is replaced by the full homepage. The final audit recorded an initial shift of 0.461 at 768px before the image-decoding phase; the footer's prior y=534 matches the existing 116px header plus 418px loading placeholder. This is distinct from image-frame geometry: all five frames remained stable and the image-decoding phase recorded zero shifts at every width. The loading architecture was not changed by this task.

## Remaining unfilled image slots

- `lookbook-1`, `lookbook-2`, `lookbook-3`, `lookbook-4`, `lookbook-5`, `lookbook-6`.
- `story-origin`, `story-process`, `story-portrait`.
- `sample-01-paper-0` through `sample-01-paper-3`.
- `sample-03-paper-0` through `sample-03-paper-3`.
- `sample-05-paper-0` through `sample-05-paper-3`.
- `sample-07-paper-0` through `sample-07-paper-3`.
- `sample-09-paper-0` through `sample-09-paper-3`.

Total at the time of this original editorial integration: 29 unfilled slots. The current optional secondary hero source is unpopulated; see [PRE_PUSH_IMAGE_AUDIT.md](PRE_PUSH_IMAGE_AUDIT.md) for the latest inventory and remaining slots.
