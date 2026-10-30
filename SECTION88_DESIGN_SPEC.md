# SECTION 88 — Editorial Streetwear Shopify Storefront
## Wireframe / Concept 01 — Design and implementation specification

**Project:** SECTION 88, premium unisex graphic T-shirt brand  
**Catalogue:** 10 SKUs (mixed fits; accurate fit allocation to be confirmed)  
**Positioning:** ₹2,500+ per product; exact prices not supplied  
**Store platform:** Shopify  
**Priority:** Brand expression, culture, and editorial storytelling, then frictionless commerce  
**Status:** Responsive interactive **design wireframe only**, not a Shopify theme, product database, checkout, or finished commerce website.

## 1. Creative direction

**Concept:** NOT MADE TO BLEND IN.

A bold premium youth-culture store where Swiss-style information architecture meets expressive graphic streetwear. Borrow the ORVIA reference's disciplined grids, fine rules, centered wordmark, and modular content sections without reproducing its generic marketplace filters or product card hierarchy. Aim for a distinctive editorial voice rather than anonymous e-commerce.

**Visual grammar**
- Oversized, compressed grotesk-type headlines with selected outlined text.
- Monochrome / warm paper surfaces; deliberate fluorescent lime accents for primary promotional actions.
- Small uppercase monospace annotations in a numbered design-specimen vocabulary: DROP 01, OBJECT 03 OF 10, FIT REFERENCE, CHAPTER 001.
- Hairline rules, square corners and asymmetric editorial split panels. No generic floating-card UI, shadows, pill-heavy navigation, or glassmorphism.
- Product and campaign imagery remains replaceable placeholder slots. No fabricated prints, collection names, materials, dimensions, prices, review scores, sustainability assertions, discount percentages, or delivery promises.

## 2. Color and type tokens (prototype)

| Token | Value | Use |
|---|---|---|
| `--paper` | `#f3f1ea` | Site background, editorial blank space |
| `--white` | `#faf9f4` | Raised paper / contrasted light surface |
| `--ink` | `#161813` | Text, solid controls, dark backgrounds |
| `--ink2` | `#252821` | Secondary dark surfaces |
| `--lime` | `#d8fc5a` | Brand punctuation, active accents, primary purchase CTA |
| `--muted` | `#777a73` | Metadata and non-interactive captions |
| `--line` | `#c9c9bf` | 1px grid boundaries and field borders |
| `--mist` | `#e4e4dc` | Image placeholder surfaces |

The HTML intentionally uses locally available Arial/Helvetica and Courier New so the file works without hosted assets. For a production build, test a licensed/free modern grotesk (e.g., Inter, Space Grotesk) and a compatible mono, then refine optical spacing. Do not finalize a font solely from this wireframe.

## 3. Information architecture — included screens

1. **Homepage** — utility bar, centered-wordmark header, ticker, split hero with campaign slot, section manifesto, four-featured product cards, editorial/culture panel, lookbook preview, brand values, signup, oversized footer.
2. **Shop / Collection** — 10 numbered product placeholders in modular grid, horizontal fit filters (All / Oversized / Boxy / Regular), sorting, magazine-style collection introduction, closing branded promotional strip; no pagination needed for 10 items.
3. **Product detail** — breadcrumb, front/back/on-body/fabric-close-up photo slots, name and fit, price placeholder, XS–XXL selectable sizes, size guide modal, add-to-demo-bag, product information accordions, related products.
4. **Lookbook** — full-bleed editorial photo-story layout with multiple replaceable campaign slots, no fake photography.
5. **Our Story** — hero manifesto, two editorial image slots, design philosophy, visual statements and culture narrative.
6. **Bag / Cart** — empty and populated states, quantity controls, remove controls, subtotal pending price data, Shopify checkout handoff explanation.
7. **Help / FAQ** — expandable information sections with deliberately uncommitted policies.
8. **Contact** — contact form layout with non-sending wireframe behaviour.
9. **Account** — reserved Shopify customer-account handoff page, not a fake login.
10. **Checkout** — a clear Shopify checkout handoff screen, not an imitation payment page.

**Additional interface states:** side navigation drawer, search results overlay, quick bag drawer, size guide modal, FAQ accordion open/closed, mobile navigation, fit filter states, size-selection state, feedback message, and screen index drawer.

## 4. Detailed page composition

### Header
- Single centered SECTION 88 identity; square utility cells on each side.
- Desktop: menu, shop, story left; lookbook, search, bag right.
- Mobile: remove tertiary links; menu at left, center logo, search/bag at right.
- Sticky on scroll. Use explicit accessible labels and visible focus states.

### Hero
- Desktop: editorial type left (~54%), campaign image slot right (~46%).
- Mobile: type-first followed by full-width image slot; maintain sufficient contrast and tap targets.
- Suggested headline: **NOT MADE TO BLEND IN.** This is positioning copy for approval, not final brand claim.
- Primary CTA: **ENTER THE DROP** → Collection.
- Placeholder should accept different crops on desktop and mobile.

### Catalogue
- This is a 10-item collection, *not* a many-category marketplace. Avoid fixed category sidebars, enormous filter menus, and pagination.
- Desktop grid: 3 columns in shop, 4 compact items in featured shelf.
- Mobile grid: 2 columns; on-body assets may require 1-column editorial modules elsewhere.
- Product placeholders show sequential IDs 01–10, fit, pending photo, and pending price.
- Never display made-up discounts or scarcity labels.
- Filters for confirmed fit names only; add real colors / sizes only when SKU inventory is known.

### Product detail
- Image gallery needs front, back, styled/on-body, and detail/print close-up at minimum.
- Selection logic: one available size required before the demo add-to-bag; validate inventory and variant availability in Shopify at launch.
- Real price, fabric construction, measurements, availability, shipping, washing guidance and return policy must come from merchant records.
- On mobile, test a sticky purchase control once real content and variant data are available; do not obscure the gallery or accessibility controls.

### Editorial modules
- The dark culture panel is the emotional beat after the first product shelf.
- Lookbook previews: large linked photo surfaces rather than busy sliders.
- Brand-value panels use 01/02/03 numbering to echo ORVIA's trust strip but change content to brand philosophy, fit, and carefully limited collection scope.
- Footer ends with gigantic ghosted SECTION 88 typography, preserving the reference's structural idea.

## 5. Interaction specification

| UI element | Prototype state | Production Shopify requirement |
|---|---|---|
| Menu | Responsive slide-in nav | Accessible nav section / theme drawer |
| Search | Filters 10 placeholder titles and fits | Shopify predictive search + search results |
| Fit controls | Client-only filter, All / Oversized / Boxy / Regular | Product metadata / tags / filter mapping |
| Sort | Basic demo sort | Shopify collection sorting |
| Product open | Routed HTML hash navigation | `/products/{product-handle}` |
| Size selection | Single-selected size chips | Selected product variant + stock validity |
| Add to Bag | Demo client-side cart, no persistence | Shopify Ajax cart API or native theme cart forms |
| Cart drawer | Demo overlay with quantity handling | Persistent cart with real pricing |
| Checkout | Handoff explanation only | Native Shopify checkout (do not implement fake payment UI) |
| Account | Handoff explanation | Shopify customer accounts |
| FAQ | Collapsible sections | Merchant-approved policies / Liquid sections |
| Newsletter/contact | Simulated submission only | Consent-aware forms and a verified delivery destination |

Always preserve keyboard navigation, ESC dismissal, visible focus styling, aria-expanded updates, sufficiently sized tap targets and user `prefers-reduced-motion` settings.

## 6. Photography / visual asset production plan

Nothing needs to be generated yet. Once the visual identity and designs are ready, commission or create the assets below. Suggested output dimensions are targets for production assets, not mandatory screen sizes.

| Slot | Priority | Suggested asset / capture | Suggested master crop |
|---|---|---|---|
| Home hero desktop | P0 | Editorial campaign model/photo, with subject placement allowing headline elsewhere | 4:5 or 3:4 vertical, 2400px+ long edge |
| Home hero mobile | P0 | Mobile-specific crop / separate shot preserving subject | 3:4 vertical, 1800px+ long edge |
| Product front ×10 | P0 | Consistent front shot, T-shirt design accurate | 4:5, 1800 × 2250px or greater |
| Product back ×10 | P0 | Consistent rear shot | 4:5, match front |
| On-body / styled ×10 | P0 | Fit-readable unisex styling, diverse casting | 4:5, 1800 × 2250px or greater |
| Print & fabric detail ×10 | P0 | Accurate artwork detail, texture and stitching | 1:1 or 4:5 |
| Culture / manifesto panel | P1 | Expressive street-style campaign photo | 4:5 vertical |
| Lookbook panel ×4–6 | P1 | Coherent editorial image sequence | Mixed 4:5 and 3:2 |
| Story / behind-the-brand ×2 | P1 | Brand process, details or genuine documentary photographs | 4:5 |
| Social sharing cover | P1 | Brand-led share graphic | 1200 × 630px |

Recommended content conventions: use photography with real garment sizing and artwork; ensure color accuracy; standardize product photography framing and lighting; avoid fake reviews and verified-claim language until documented. Supply descriptive alt text rather than repeating SKU names.

## 7. Responsive rules

- Desktop: 1440px design reference, 3-column collection; split hero and split product detail.
- Tablet: allow columns to collapse elegantly without over-dense nav; gallery becomes stacked where necessary.
- Mobile: validated at 390px width; centered compact wordmark, 2-column shop, horizontal filter pills; hero and story become stacked.
- Test additional widths: 320, 360, 375, 430, 768, 1024, 1280, 1920; verify long translated text, browser zoom, keyboard focus and reduced motion.

## 8. Shopify implementation map

Create an **Online Store 2.0 Shopify theme** built with Liquid templates/sections, CSS and small scripts, using native Shopify cart, inventory, checkout, customer accounts, and collection routing. Avoid lifting the prototype's hash routes into production.

- Homepage: `templates/index.json` + custom section blocks (hero, editorial band, featured collection, lookbook, brand values, newsletter).
- Collection page: `templates/collection.json` + filtering/sorting UI using supported Shopify storefront structures.
- Product page: `templates/product.json` + real product media, selected variants, inventory checks, purchase controls, accordions, and recommendations.
- Cart: native Shopify cart page plus optional drawer.
- Story / Lookbook / Help / Contact: page templates and reusable content sections.
- Checkout: Shopify-hosted checkout. Branding options are subject to store plan and configuration.

A headless storefront is an alternative, but this wireframe does not require it. Choose based on launch budget, team capacity, and need for nonstandard experiences.

## 9. Pending business/content inputs

- Final logo lockup and permitted brand color palette.
- Final 10 design names, SKU IDs, inventory, size/fit mapping and availability.
- True prices, taxes and shipping regions.
- Real product photography and campaign story.
- Garment measurements per fit, wash care, fabric construction and material statements.
- Shipping/returns terms and official contact / social URLs.
- Newsletter consent language, analytics and cookie consent requirements.

**Note:** “NOT MADE TO BLEND IN,” “THE FIRST TEN,” “THE FIT IS THE MESSAGE,” and “NO FIXED FORM” are exploratory brand messaging, not approved final copy.
