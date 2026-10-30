# SECTION 88 — Image placement specification

This document records image placement and current integration. All five homepage editorial images, five Lookbook photographs, all ten Ink sets (40 local originals), and all three Our Story photographs are integrated. See [EDITORIAL_IMAGE_INTEGRATION_REPORT.md](EDITORIAL_IMAGE_INTEGRATION_REPORT.md), [LOOKBOOK_IMAGE_INTEGRATION_REPORT.md](LOOKBOOK_IMAGE_INTEGRATION_REPORT.md), [PRODUCT_IMAGE_INTEGRATION_REPORT.md](PRODUCT_IMAGE_INTEGRATION_REPORT.md) and [story-artifacts/STORY_IMAGE_INTEGRATION.md](story-artifacts/STORY_IMAGE_INTEGRATION.md) for verification. Twenty Paper photos and one optional hidden Lookbook slot remain pending. The exact secondary hero source is missing and its optional layer is disabled. Existing frames reserve their layouts. Do not use website screenshots as merchandise photos.

## Configuration and replacement

Shared images: `src/config/images.ts` (imageSlots and lookbookSlots). Product media: `src/data/products.ts` (mediaByColor and fallback images). All IDs below are exact current configuration IDs; uppercase underscore versions appear as developer labels.

1. Supply approved files in `public/images/`, organized by collection/product/color.
2. Add `src: "/images/filename.webp"`, meaningful `alt`, original width/height, and optional `focalPoint: "55% 40%"` and `mobileFocalPoint` (below 768px) to the corresponding slot. Never put a local Windows path in src.
3. Preserve stable IDs. Add optional caption and productSlug to a lookbook slot only when its actual styling/product relationship is confirmed.
4. Product mediaByColor is authoritative for a mapped color; an explicit empty array means photography pending. Fallback images are used only for an unmapped color. Populate per-color slots, not just the legacy fallback array.
5. Set `showAssetLabels = false` in images.ts to remove developer IDs and labels without affecting geometry. Generic “Photography pending” remains if an unfilled slot exists.
6. Keep local sources where possible. External images require narrowly scoped HTTPS remotePatterns in next.config.ts; no remote provider is currently configured.
7. Re-run crop, focal point, alt text, hover, zoom, responsive image sizing and loading checks when photography changes. Encode each path segment with encodeURIComponent: the supplied timestamped filenames contain commas that otherwise return 404s through Next.js. Preserve originals; normalized copies are unnecessary.

Next.js Image supplies optimization and responsive sources. All frames reserve their ratio. HeroMedia selects a desktop/mobile crop through a picture source when both exist, eagerly loading the chosen image with high fetch priority. Other images lazy-load except the active product gallery. Object-position honors focalPoint; hero supports independent crop focal points. Use matching descriptive alt meaning for the two hero crops.

## Rules applying to every asset

- No baked-in UI, logos, captions, borders, crop marks or headings. All interface type stays in HTML.
- **No image has an editorial headline overlaid on it.** Only small developer IDs (until disabled), gallery zoom utilities and optional media controls sit above frames. Reserve 5–8% inset around crucial detail for those utilities.
- Background: consistent neutral/studio direction for product views; campaign/story may use approved environmental backgrounds. Do not introduce arbitrary colored frames into the site palette.
- Negative space: no typography void is required inside a photograph; aim for 8–12% breathing room around the intended subject and avoid critical details in frame corners.
- Composition directions below describe framing, not generated prompts or unsupported product claims.
- Export AVIF/WebP where appropriate; maintain accurate garment colors. Recommended dimensions are master sizes, not mandatory download sizes. Aim for roughly 150–350KB product exports and 250–600KB campaign exports when visual quality allows; measure rather than treating those as a guarantee.
- Alt text describes the actual approved scene and differentiates front/back/model/detail. Do not repeat an asset ID or SEO keywords. Decorative redundant detail may use empty alt only after a specific accessibility review.

## 1. Homepage — eight configured slots (including the secondary hero layer)

### Integrated editorial images — 2026-10-30

All files below are in `public/images/`, loaded through local `/images/...` URLs with their exact filenames. The existing `imageSlots` configuration remains authoritative. `ImagePlaceholder` renders Next.js Image with `fill`, reserved frame ratios and responsive `sizes`. All five images lazy-load; their original dimensions are recorded in the slots.

| Slot ID | Exact filename | Original pixels | Frame | Focal point (desktop / mobile) |
|---|---|---|---|---|
| home-campaign | Lone Figure in Golden Concrete Light.png | 1086 × 1448 | 16:9 | 50% 52% / 50% 50% |
| home-fit | Sunlit Brutalist Elegance.png | 1672 × 941 | 3:4 | 66% 50% / same |
| home-graphic | Origami Print on Black Cotton.png | 1254 × 1254 | 1:1 | 50% 50% / same |
| home-construction | Moody Black T-Shirt on Stone.png | 1254 × 1254 | 1:1 | 50% 50% / same |
| home-story | Moody Minimalist Streetwear Portrait.png | 1086 × 1448 | 3:4 | 50% 50% / same |

All five use `object-fit: cover` without filters, lasting opacity reduction, zoom or additional borders. Campaign's portrait original cannot fit a landscape cover frame in full: its deliberate head-to-thigh crop preserves the head, shoulders, sleeves, graphic and hem; lower legs and part of the architecture are outside the frame. Fit crops the wide environment around the model while preserving the head and complete T-shirt. Its responsive source sizing accounts for the wide original behind the portrait crop. Graphic, Construction and Story retain their full compositions.

Mobile preserves the alternating Fit / Graphic / Detail image-text arrangement and the 300px maximum story portrait. Opacity reveals use the existing 480ms motion token and easing; Campaign and Story retain the existing Reveal component with 12px entrance travel. Reduced motion disables both reveals. Alt text describes visible scenes without material or manufacturing claims.

The primary hero original exists. Recursive inventory found no exact Daisy-Headed Wanderer image, so `home-hero-bloom` retains its slot ID and focal point but has no source and renders no secondary layer until the approved image is supplied. It is not replaced or reassigned. The master sizes and composition directions below are the original asset brief; the verified editorial source dimensions and focal points above describe the integrated assets.

### Product replacement shortcut

For the sample fixtures, edit src/config/product-media.ts rather than rewriting product records. Its productMediaAssets map uses the exact slot ID as key, with src/alt/focalPoint, original width/height and objectFit as values. Forty Ink slots are now populated. Every card, gallery, search and bag view resolves the same configured slot. Paper slots remain unpopulated, so they display Photography pending. Product 01 retains its Signal Study name; the Charcoal Tee folder contains three explicitly named Signal Study views with matching artwork.

| Config / asset ID | Exact placement | Ratio | Master pixels | Composition / focal position |
|---|---|---|---|---|
| heroDesktop / `home-hero-desktop` | Home / desktop hero right 5/12 columns | 3 / 2 | 1800×1200 | Subject near center/right; garment and silhouette readable. Keep 8% crop safety. Headline is beside the photograph, not over it. |
| heroMobile / `home-hero-mobile` | Home / mobile hero below CTA | 4 / 5 | 1200×1500 | Independent portrait crop, full silhouette or deliberate waist-up crop. Center subject; retain 8% side clearance. No headline baked into image. |
| campaign / `home-campaign` | Home / campaign left 7/12 columns | 16 / 9 | 1920×1080 | Environment and styling, subject around 45–60% across. Keep composition coherent as a complete landscape on mobile. |
| fit / `home-fit` | Home / The fit module | 3 / 4 | 1200×1600 | Standing model/silhouette context, hem and shoulder fit visible, center subject with 10% clearance. Use actual approved garment fit. |
| graphic / `home-graphic` | Home / The graphic module | 1 / 1 | 1200×1200 | Close crop of approved artwork, key motif centered; avoid cutting essential lettering at the frame edge. |
| construction / `home-construction` | Home / The detail module | 1 / 1 | 1200×1200 | An actual seam, collar, finish or fabric surface. Show tactile detail without implying an unverified material. |
| story / `home-story` | Home / dark manifesto right panel | 3 / 4 | 1200×1600 | Portrait or cultural context appropriate to approved brand direction. Subject centered or slightly left, 10% safe crop; tonal separation within dark surrounding panel. |

Featured cards reuse the product front/back assets below. Home has no separate duplicate product-photo requirement. The five editorial slots render at desktop/mobile with the verified focal points above. The existing hero uses independent responsive focal points and a separate secondary layer. The fit module is 3:4; graphic/detail modules are 1:1. Mobile modules alternate image and text.

## 2. Products — catalogue / card assets

Create a front and back for each approved product/color. Default Ink fronts and backs supply collection, featured and related cards; front also supplies search results and bag thumbnails. A second source enables the desktop hover crossfade. There is no quick-add overlay.

| View | Master / display | Subject position | Negative space / background | Alt approach |
|---|---|---|---|---|
| Front | 1600×2000 / 4:5 | Centered, complete garment; consistent scale across all products | 10–12% around garment; neutral consistent studio background | Product name + color + front view + visible artwork if relevant |
| Back / hover | 1600×2000 / 4:5 | Same scale, horizon and camera as front | Same studio background and margins; align the garment between hover frames | Product name + color + back view |

The exact front/back IDs are slots 0 and 1 in the full matrix below. Current sample colors are demonstration fixtures; do not treat them as confirmed merchandise.

## 3. Product details — sixty active slots, reused across the store

Each of ten products has four views for each configured color: ten Ink sets and five Paper sets. That is 60 active slots. No extra separate catalogue generation is necessary: 0/1 are reused. Legacy uncolored images arrays are fallbacks, not an additional 40-image brief.

| Slot | Master | Display / crop | Subject / negative space | Alt approach |
|---|---|---|---|---|
| 0 — Front | 1600×2000 | 4:5 card and gallery | Center garment, full hem/sleeves, 10–12% clearance, neutral backdrop | Product/color/front |
| 1 — Back | 1600×2000 | 4:5 card hover and gallery | Match front composition and scale exactly | Product/color/back |
| 2 — On body | 1600×2000 | 4:5 gallery | Actual model and garment, silhouette visible; leave 8–10% clearance at shoulders and hem | Actual styling and garment view; include model details only if verified |
| 3 — Graphic/fabric detail | 1600×1600 | 1:1 source/zoom; contain inside the reserved 4:5 gallery | The delivered close-ups retain their complete artwork and texture; centered focal points avoid additional crop | Actual motif, print, seam or texture, no unsupported textile claim |

There is no headline overlay. Lower-right zoom utility may occupy 44px plus margin. Additional media can be appended in any order; give each a unique ID, label, kind, src and alt. Counts are dynamic; empty arrays and single-image sets are safe. Color selection switches gallery media and resets the index; it preserves only still-valid size selection.

### Exact product/color slot matrix

| Product / color / source key | Front | Back | On body | Detail |
|---|---|---|---|---|
| 01 Signal Study / Ink / mediaByColor.ink | `sample-01-ink-0` | `sample-01-ink-1` | `sample-01-ink-2` | `sample-01-ink-3` |
| 01 Signal Study / Paper / mediaByColor.paper | `sample-01-paper-0` | `sample-01-paper-1` | `sample-01-paper-2` | `sample-01-paper-3` |
| 02 Off Register / Ink / mediaByColor.ink | `sample-02-ink-0` | `sample-02-ink-1` | `sample-02-ink-2` | `sample-02-ink-3` |
| 03 Open Channel / Ink / mediaByColor.ink | `sample-03-ink-0` | `sample-03-ink-1` | `sample-03-ink-2` | `sample-03-ink-3` |
| 03 Open Channel / Paper / mediaByColor.paper | `sample-03-paper-0` | `sample-03-paper-1` | `sample-03-paper-2` | `sample-03-paper-3` |
| 04 After Hours / Ink / mediaByColor.ink | `sample-04-ink-0` | `sample-04-ink-1` | `sample-04-ink-2` | `sample-04-ink-3` |
| 05 Common Ground / Ink / mediaByColor.ink | `sample-05-ink-0` | `sample-05-ink-1` | `sample-05-ink-2` | `sample-05-ink-3` |
| 05 Common Ground / Paper / mediaByColor.paper | `sample-05-paper-0` | `sample-05-paper-1` | `sample-05-paper-2` | `sample-05-paper-3` |
| 06 Side Effect / Ink / mediaByColor.ink | `sample-06-ink-0` | `sample-06-ink-1` | `sample-06-ink-2` | `sample-06-ink-3` |
| 07 Static Motion / Ink / mediaByColor.ink | `sample-07-ink-0` | `sample-07-ink-1` | `sample-07-ink-2` | `sample-07-ink-3` |
| 07 Static Motion / Paper / mediaByColor.paper | `sample-07-paper-0` | `sample-07-paper-1` | `sample-07-paper-2` | `sample-07-paper-3` |
| 08 New Frequency / Ink / mediaByColor.ink | `sample-08-ink-0` | `sample-08-ink-1` | `sample-08-ink-2` | `sample-08-ink-3` |
| 09 Outside the Frame / Ink / mediaByColor.ink | `sample-09-ink-0` | `sample-09-ink-1` | `sample-09-ink-2` | `sample-09-ink-3` |
| 09 Outside the Frame / Paper / mediaByColor.paper | `sample-09-paper-0` | `sample-09-paper-1` | `sample-09-paper-2` | `sample-09-paper-3` |
| 10 Unwritten / Ink / mediaByColor.ink | `sample-10-ink-0` | `sample-10-ink-1` | `sample-10-ink-2` | `sample-10-ink-3` |

Fallback IDs follow `sample-NN-0` through `sample-NN-3` (NN 01–10). If the corresponding per-color mapping is removed, these should point to the same approved default-color photo files. Never let an Ink photo silently represent Paper; keep explicit Paper mappings until those assets are ready.

## 4. Lookbook — five integrated photographs, one optional hidden slot

All six stable slots remain in `lookbookSlots` in images.ts. The public gallery filters slots without `src`, preserving layout by slot ID and numbering visible frames sequentially from FRAME 001 to FRAME 005. `lookbook-5` remains unpopulated and hidden; adding its approved source and alt text later restores it between the second landscape and the closing portrait. The closing portrait remains in `lookbook-6`, independent of the number of visible images.

| Visible frame | Slot | Exact local URL | Source pixels / native ratio | Caption |
|---|---|---|---|---|
| 001 | `lookbook-1` | `/images/lookbook/01_Establishing.png` | 1536 × 1024 / 3:2 | The Arrival |
| 002 | `lookbook-2` | `/images/lookbook/02_The_Individual.png` | 1086 × 1448 / 3:4 | The Individual |
| 003 | `lookbook-3` | `/images/lookbook/03_The_Reflection.png` | 1086 × 1448 / 3:4 | The Reflection |
| 004 | `lookbook-4` | `/images/lookbook/04_Impossible_Space.png` | 1536 × 1024 / 3:2 | The Impossible Space |
| 005 | `lookbook-6` | `/images/lookbook/05_Closing_Portrait.png` | 1086 × 1448 / 3:4 | The Closing Frame |

All five images match their reserved frames, use centered `cover`, and retain their complete source composition without filters or added crops. The supplied files 01, 03, 04 and 05 were found directly under `public/images/`; byte-identical copies now live in `public/images/lookbook/`, with those root originals preserved. The existing `Lookbook` directory casing was normalized to `lookbook`; no image filename changed. File 02 was already in that directory. Existing per-segment URL encoding in product media is unchanged; these filenames contain only URL-safe characters.

The first frame receives image priority because it begins within the initial viewport; all other frames lazy-load. Responsive `sizes` follow the existing 12-column grid, gutters and mobile insets. Reveals use the existing component at 480ms with 12px travel and respect reduced motion. There is no new hover crop or lightbox. The original layout specifications below remain in force; the optional fifth slot is omitted from public output until populated.

| Asset ID | Desktop placement | Mobile placement | Ratio / master | Composition and subject position |
|---|---|---|---|---|
| `lookbook-1` | Opening full-width landscape | Full width | 3 / 2 / 1800×1200 | Wide campaign establishing scene, center-safe activity, readable environment and silhouette; 8–12% safety, approved scene background, no text overlay |
| `lookbook-2` | Left portrait, columns 1–5 | Left inset, 8/12 | 3 / 4 / 1200×1600 | Full or three-quarter figure centered, 10% clearance; 8–12% safety, approved scene background, no text overlay |
| `lookbook-3` | Offset right portrait, columns 7–11 | Right inset, 9/12 | 3 / 4 / 1200×1600 | Styling/pose with gaze or movement toward the page center; preserve face and garment; 8–12% safety, approved scene background, no text overlay |
| `lookbook-4` | Second full-width landscape | Full width | 3 / 2 / 1800×1200 | A distinct wide campaign moment; do not duplicate the opening crop; 8–12% safety, approved scene background, no text overlay |
| `lookbook-5` | Smaller inset left portrait, columns 2–5 | Left inset, 8/12 | 3 / 4 / 1200×1600 | Closer styling/detail portrait; key detail center-safe; 8–12% safety, approved scene background, no text overlay |
| `lookbook-6` | Larger final right portrait, columns 7–12 | Right inset, 10/12 | 3 / 4 / 1200×1600 | Closing campaign figure or scene, centered garment, a decisive final frame; 8–12% safety, approved scene background, no text overlay |

## 5. Brand story — three assets

| Config / asset ID | Placement | Ratio / master | Framing, subject and background |
|---|---|---|---|
| storyOrigin / `story-origin` | Our Story / first full reading-width image | 3 / 2 / source 1536×1024 | Integrated: `/images/our-story/story-origin.png`. Surreal ivory architectural threshold; solitary figure and doorway remain visible. Center focal point; no text overlay. |
| storyProcess / `story-process` | Our Story / process split left 7/12 columns | 3 / 2 / source 1536×1024 | Integrated: `/images/our-story/story-process.png`. Conceptual workspace with hands, translucent artwork, paper and dark fabric. Center focal point; no manufacturing claims. |
| storyPortrait / `story-portrait` | Our Story / philosophy right portrait | 3 / 4 / source 1086×1448 | Integrated: `/images/our-story/story-portrait.png`. Model in a black T-shirt beside frosted glass. Center focal point; no text overlay. |

The home-story portrait is separate from the three story-page slots. It may intentionally reuse an approved portrait if the art direction supports both placements. No fourth story-page image is currently required. Founder identity, origins and studio claims need supplied facts; do not generate scenes that imply a fictional history.

## Next asset batch

1. Homepage: all five editorial slots are integrated. The primary Frosted Silhouette hero is intact. The optional `home-hero-bloom` slot is safely disabled until its exact approved source is supplied; no substitute is used.
2. Products: all 10 Ink front/back pairs are integrated and reused by cards.
3. Product details: all 10 Ink on-body/detail pairs are integrated; current demo data also supports 5 Paper sets, whose photography remains pending. Supply all views per actual approved color rather than duplicating a mismatched color.
4. Lookbook: two landscapes and three portraits are integrated. Only optional `lookbook-5` remains pending and hidden.
5. Brand story: origin landscape, process landscape and editorial portrait are integrated. See [the integration report](story-artifacts/STORY_IMAGE_INTEGRATION.md).

Total current independently configured active slots: **77** (8 home including the secondary hero layer + 60 product/color + 6 lookbook + 3 story). Shared product assets render in many locations. Confirm real styles and colors before generating all sample-color combinations. A smaller approved collection can use the same architecture without layout changes.

## Remaining unfilled slots

- `home-hero-bloom` (reserved optional secondary hero layer; exact source absent, layer disabled).
- `lookbook-5` (one optional slot, hidden from the public gallery).
- `sample-01-paper-0` through `sample-01-paper-3`, and the same four Paper views for `sample-03`, `sample-05`, `sample-07`, `sample-09` (twenty).

Total: **22 unfilled slots**: 20 Paper product views, one optional Lookbook slot and the reserved `home-hero-bloom` secondary layer. All forty Ink product views remain populated.
