import { writeFile } from "node:fs/promises";
import { products } from "../src/data/products.ts";
import { imageSlots, lookbookSlots, aspectRatios } from "../src/config/images.ts";

const descriptions = {
  heroDesktop: ["Home / desktop hero right 5/12 columns", "1800×1200", "Campaign wide", "Subject near center/right; garment and silhouette readable. Keep 8% crop safety. Headline is beside the photograph, not over it."],
  heroMobile: ["Home / mobile hero below CTA", "1200×1500", "Campaign portrait", "Independent portrait crop, full silhouette or deliberate waist-up crop. Center subject; retain 8% side clearance. No headline baked into image."],
  campaign: ["Home / campaign left 7/12 columns", "1920×1080", "Campaign wide", "Environment and styling, subject around 45–60% across. Keep composition coherent as a complete landscape on mobile."],
  fit: ["Home / The fit module", "1200×1600", "Silhouette", "Standing model/silhouette context, hem and shoulder fit visible, center subject with 10% clearance. Use actual approved garment fit."],
  graphic: ["Home / The graphic module", "1200×1200", "Graphic detail", "Close crop of approved artwork, key motif centered; avoid cutting essential lettering at the frame edge."],
  construction: ["Home / The detail module", "1200×1200", "Construction detail", "An actual seam, collar, finish or fabric surface. Show tactile detail without implying an unverified material."],
  story: ["Home / dark manifesto right panel", "1200×1600", "Editorial portrait", "Portrait or cultural context appropriate to approved brand direction. Subject centered or slightly left, 10% safe crop; tonal separation within dark surrounding panel."],
  storyOrigin: ["Our Story / first full reading-width image", "1800×1200", "Origin", "Real people, studio or reference context supplied by the brand. Balance across wide frame; no fictional founder scene."],
  storyProcess: ["Our Story / process split left 7/12 columns", "1800×1200", "Process", "Actual working process or approved concept context. Place meaningful activity around center; preserve hands/artwork with 10% safety."],
  storyPortrait: ["Our Story / philosophy right portrait", "1200×1600", "Editorial portrait", "Approved person or cultural scene. Center or slightly right focal point; preserve full face and key garment details."],
};
let guide = `# SECTION 88 — Image placement specification

No imagery was generated, downloaded or inserted during refinement. This document specifies the files to create next. Existing neutral frames are permanent layout reservations, not loading skeletons. Do not use the original website screenshots as merchandise photos.

## Configuration and replacement

Shared images: \`src/config/images.ts\` (imageSlots and lookbookSlots). Product media: \`src/data/products.ts\` (mediaByColor and fallback images). All IDs below are exact current configuration IDs; uppercase underscore versions appear as developer labels.

1. Supply approved files in \`public/images/\`, organized by collection/product/color.
2. Add \`src: "/images/filename.webp"\`, meaningful \`alt\`, and optional \`focalPoint: "55% 40%"\` to the corresponding slot. Never put a local Windows path in src.
3. Preserve stable IDs. Add optional caption and productSlug to a lookbook slot only when its actual styling/product relationship is confirmed.
4. Product mediaByColor is authoritative for a mapped color; an explicit empty array means photography pending. Fallback images are used only for an unmapped color. Populate per-color slots, not just the legacy fallback array.
5. Set \`showAssetLabels = false\` in images.ts to remove developer IDs and labels without affecting geometry. Generic “Photography pending” remains if an unfilled slot exists.
6. Keep local sources where possible. External images require narrowly scoped HTTPS remotePatterns in next.config.ts; no remote provider is currently configured.
7. Re-run crop, focal point, alt text, hover, zoom, responsive image sizing and loading checks with actual photography. The real-source image paths remain untested because this phase intentionally has no image assets.

Next.js Image supplies optimization and responsive sources. All frames reserve their ratio. HeroMedia selects a desktop/mobile crop through a picture source when both exist, eagerly loading the chosen image with high fetch priority. Other images lazy-load except the active product gallery. Object-position honors focalPoint; hero supports independent crop focal points. Use matching descriptive alt meaning for the two hero crops.

## Rules applying to every asset

- No baked-in UI, logos, captions, borders, crop marks or headings. All interface type stays in HTML.
- **No image has an editorial headline overlaid on it.** Only small developer IDs (until disabled), gallery zoom utilities and optional media controls sit above frames. Reserve 5–8% inset around crucial detail for those utilities.
- Background: consistent neutral/studio direction for product views; campaign/story may use approved environmental backgrounds. Do not introduce arbitrary colored frames into the site palette.
- Negative space: no typography void is required inside a photograph; aim for 8–12% breathing room around the intended subject and avoid critical details in frame corners.
- Composition directions below describe framing, not generated prompts or unsupported product claims.
- Export AVIF/WebP where appropriate; maintain accurate garment colors. Recommended dimensions are master sizes, not mandatory download sizes. Aim for roughly 150–350KB product exports and 250–600KB campaign exports when visual quality allows; measure rather than treating those as a guarantee.
- Alt text describes the actual approved scene and differentiates front/back/model/detail. Do not repeat an asset ID or SEO keywords. Decorative redundant detail may use empty alt only after a specific accessibility review.

## 1. Homepage — seven assets

### Product replacement shortcut

For the generated sample fixtures, edit src/config/product-media.ts rather than rewriting product records. Its productMediaAssets map accepts an exact slot ID as key and src/alt/focalPoint as values. For example, after approval add the sample-01-ink-0 key with the actual front photo path and description. Every card, gallery, search and bag view resolves the same configured slot. The map is deliberately empty until files are supplied.

| Config / asset ID | Exact placement | Ratio | Master pixels | Composition / focal position |
|---|---|---|---|---|
`;
for (const key of ["heroDesktop", "heroMobile", "campaign", "fit", "graphic", "construction", "story"]) {
  const slot = imageSlots[key], d = descriptions[key];
  guide += `| ${key} / \`${slot.id}\` | ${d[0]} | ${aspectRatios[slot.kind]} | ${d[1]} | ${d[3]} |\n`;
}
guide += `
Featured cards reuse the product front/back assets below. Home has no separate duplicate product-photo requirement. All seven shared slots work at desktop/mobile; the hero alone uses two independently authored crops. The fit module is 3:4; graphic/detail modules are 1:1. Mobile modules alternate image and text, so center-safe crops work on both sides.

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
| 3 — Graphic/fabric detail | 1600×1600 | 1:1 source/zoom; centered 4:5 gallery crop | Critical artwork/texture inside central 80% width; gallery cuts 10% from either side of a square; use focalPoint if needed | Actual motif, print, seam or texture, no unsupported textile claim |

There is no headline overlay. Lower-right zoom utility may occupy 44px plus margin. Additional media can be appended in any order; give each a unique ID, label, kind, src and alt. Counts are dynamic; empty arrays and single-image sets are safe. Color selection switches gallery media and resets the index; it preserves only still-valid size selection.

### Exact product/color slot matrix

| Product / color / source key | Front | Back | On body | Detail |
|---|---|---|---|---|
`;
for (const product of products) for (const color of product.colors) {
  guide += `| ${product.number} ${product.name} / ${color.name} / mediaByColor.${color.id} | ${product.mediaByColor[color.id].map(slot => `\`${slot.id}\``).join(" | ")} |\n`;
}
guide += `
Fallback IDs follow \`sample-NN-0\` through \`sample-NN-3\` (NN 01–10). If the corresponding per-color mapping is removed, these should point to the same approved default-color photo files. Never let an Ink photo silently represent Paper; keep explicit Paper mappings until those assets are ready.

## 4. Lookbook — six independent assets

All slots are in \`lookbookSlots\` in images.ts. Ratios remain stable between desktop and mobile. Captions currently say photography pending; replace them only with approved styling notes. Each supports caption/productSlug, focalPoint, src and alt.

| Asset ID | Desktop placement | Mobile placement | Ratio / master | Composition and subject position |
|---|---|---|---|---|
`;
for (let i = 0; i < lookbookSlots.length; i++) {
  const slot = lookbookSlots[i];
  const positions = [
    ["Opening full-width landscape", "Full width", "Wide campaign establishing scene, center-safe activity, readable environment and silhouette"],
    ["Left portrait, columns 1–5", "Left inset, 8/12", "Full or three-quarter figure centered, 10% clearance"],
    ["Offset right portrait, columns 7–11", "Right inset, 9/12", "Styling/pose with gaze or movement toward the page center; preserve face and garment"],
    ["Second full-width landscape", "Full width", "A distinct wide campaign moment; do not duplicate the opening crop"],
    ["Smaller inset left portrait, columns 2–5", "Left inset, 8/12", "Closer styling/detail portrait; key detail center-safe"],
    ["Larger final right portrait, columns 7–12", "Right inset, 10/12", "Closing campaign figure or scene, centered garment, a decisive final frame"],
  ][i];
  guide += `| \`${slot.id}\` | ${positions[0]} | ${positions[1]} | ${aspectRatios[slot.kind]} / ${slot.kind === "lookbook-landscape" ? "1800×1200" : "1200×1600"} | ${positions[2]}; 8–12% safety, approved scene background, no text overlay |\n`;
}
guide += `
## 5. Brand story — three assets

| Config / asset ID | Placement | Ratio / master | Framing, subject and background |
|---|---|---|---|
`;
for (const key of ["storyOrigin", "storyProcess", "storyPortrait"]) {
  const slot = imageSlots[key], d = descriptions[key];
  guide += `| ${key} / \`${slot.id}\` | ${d[0]} | ${aspectRatios[slot.kind]} / ${d[1]} | ${d[3]} No text overlay; actual approved context/background. |\n`;
}
guide += `
The home-story portrait is separate from the three story-page slots. It may intentionally reuse an approved portrait if the art direction supports both placements. No fourth story-page image is currently required. Founder identity, origins and studio claims need supplied facts; do not generate scenes that imply a fictional history.

## Next asset batch

1. Homepage: 2 hero crops, 1 landscape campaign, 3 product-substance details, 1 dark-panel story portrait.
2. Products: 10 default-color front/back pairs for cards, drawn from the detail sets below.
3. Product details: complete the remaining on-body/detail views; current demo data also supports 5 Paper sets. Supply all views per actual approved color rather than duplicating a mismatched color.
4. Lookbook: 2 landscapes + 4 portraits in the six listed placements.
5. Brand story: origin landscape, process landscape, editorial portrait.

Total current independently configured active slots: **76** (7 home + 60 product/color + 6 lookbook + 3 story). Shared product assets render in many locations. Confirm real styles and colors before generating all sample-color combinations. A smaller approved collection can use the same architecture without layout changes.
`;
await writeFile("IMAGE_PLACEMENT_GUIDE.md", guide);
console.log("Updated IMAGE_PLACEMENT_GUIDE.md from current slot configuration.");
