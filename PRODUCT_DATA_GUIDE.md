# Product data guide

`src/data/products.ts` is the source of the current ten **sample** catalogue objects. None of the names, prices, fit allocations or availability are confirmed merchandise. The sample labels appear throughout the interface. Do not change those labels to published until actual merchandise information has been approved.

## Fields

| Field | Meaning |
| --- | --- |
| `id` | Stable product identifier, referenced in local bags |
| `slug` | Unique public product route |
| `number` | Two-character editorial index |
| `name`, `description` | Approved title and description, currently sample copy |
| `fit` | Fit value; filters derive their options from product data |
| `price` | Integer paise: ₹2,500 = `250000` |
| `currency` | `INR` for the current store |
| `availableSizes` | Sizes with at least one available variant |
| `colors` | Stable color IDs, names and swatch hex values |
| `images` | Ordered front, back, on-body and detail image slots |
| `mediaByColor` | Optional color ID → ordered media array; an explicit empty array means photography pending, an absent key falls back to images |
| `collection` | Drop / collection name |
| `displayStatus` | `sample`, `published` or `hidden` |
| `availability` | `demo-only`, `available` or `unavailable` |
| `variants` | Unique ID, size, color ID and availability per combination |
| `fabricDetails`, `fitDetails` | Optional confirmed copy; omitted fields use transparent pending text |

Current sample fixture generation cycles Oversized, Boxy and Regular fits. XS is deliberately unavailable. For sample products with Paper, XXL/Paper is also unavailable. These rules exist to exercise variant controls; they are not inventory statements.

## Updating merchandise

1. Replace generated fixtures with approved explicit records using the `Product` type.
2. Keep IDs and slugs stable where possible. Resolve redirect requirements before changing published URLs.
3. Add actual color/size variants, each with a unique ID and valid color reference. Never treat size availability as independent of color.
4. Derive `availableSizes` from available variants. Add or remove sizes in the shared `sizes` definition and size-guide structure when necessary. Add new fit values to the `Fit` type; filters derive actual options automatically.
5. Set real prices in paise; do not use floating-point rupee arithmetic. Confirm tax treatment before real checkout.
6. Add approved image sources/alt text following `IMAGE_PLACEMENT_GUIDE.md`.
7. Add verified fabric, fit, care and measurement content. The current size chart intentionally contains only Pending cells. Fit-specific charts need a model keyed by fit/product before actual guidance is published.
8. Mark approved records `published`. Hidden records are excluded from listing, lookup and cart restoration. `unavailable` blocks additions. Published/available data alone does not enable checkout.

The catalogue currently assumes one currency. Gallery view count is dynamic: zero shows a pending frame without zoom/navigation, one hides redundant navigation, and multiple images wrap safely. Labels derive from slot data. Product gallery displays a stable 4:5 frame; zoom uses the slot's native ratio. There is no pagination for ten styles; future API-backed growth belongs in the catalogue adapter.

## Refined editorial and media configuration

For the current generated fixtures, add actual asset sources through `src/config/product-media.ts`: `productMediaAssets` maps the exact IDs in the asset guide to `{ src, alt, focalPoint }`. It is empty until approved files exist. This avoids rewriting fixtures merely to add photography. The generated per-color and fallback slots merge these overrides; no product, variant, or cart identifier changes.

`src/config/editorial.ts` contains provisional brand copy and four featured product IDs. It makes no founder, material, delivery or inventory claims. Change those fields when approved information arrives. `src/config/measurements.ts` contains per-fit, per-size measurement records with null/missing values rendered as Pending, in centimetres.

`src/lib/media.ts` resolves color-specific media. Color changes reset gallery index and preserve a selected size only when that combination is still available. Cards/search use default-color media; the bag uses the actual selected-color media. Populate `mediaByColor` first for mapped colors; editing only the legacy fallback array will not replace a mapped placeholder. Add `focalPoint` to control crop position and `caption`/`productSlug` for approved lookbook metadata. All exact slot IDs and framing requirements are in IMAGE_PLACEMENT_GUIDE.md.

## Filtering and search

`src/lib/catalogue.ts` implements a replaceable `CatalogueAdapter`. Query keys are `q`, `fit`, `size`, `sort`. Unknown values normalize safely. Title search is case-insensitive. Sort options include both price directions and A–Z/Z–A. Filters combine immediately; mobile filter-sheet changes apply when the user chooses Show objects. Clear All resets all filter/search/sort state. Native history updates keep state in the URL, including after refresh.

## Bag behavior

The bag stores only product ID, variant ID and quantity, never a trusted price. Refresh restores valid entries, discards removed/unavailable variants and clamps malformed or excessive quantities. Different variants remain separate lines; matching variants merge. The cap of ten per variant is a demonstration safeguard, not a stock claim. Edit `MAX_QUANTITY` in `src/lib/cart.ts` if the demo cap changes.

Run `npm.cmd run test:unit` after updating the domain model. Its sample-fixture expectations intentionally need updating when real merchandise replaces fixtures. Run the compiler, lint, build and browser suites before publishing any changes.
