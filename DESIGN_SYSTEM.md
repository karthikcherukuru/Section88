# SECTION 88 — Controlled Rebellion

The refined system preserves the original paper/ink/acid identity, Space Grotesk and Inter, square controls, numbered pieces, hairline rules, oversized wordmark, and dark editorial panel. This is the existing App Router storefront, with a more deliberate editorial hierarchy. It remains a prelaunch demonstration.

## Color roles

All values live in `src/app/globals.css`. No additional chromatic brand color was introduced.

| Primitive | Value |
|---|---|
| ink | #161813 |
| paper | #F3F1EA |
| surface | #EAE8E0 |
| border | #C9C9BF |
| muted | #66675F |
| acid | #D8FC5A |
| white | #FFFFFF |
| editorial | #20211D |

| Semantic token | Source / purpose |
|---|---|
| border-standard / border-strong | border / ink |
| background-muted / surface-inverse | surface / editorial |
| text-primary / text-secondary / text-inverse | ink / muted / paper |
| accent-surface | acid |
| hover-background | surface |
| selected-background | ink |
| focus-ring | ink; acid outline on inverse panels |
| error / success | ink; explicit words and alert/status semantics distinguish meaning |
| disabled-background | surface; muted label and semantic disabled |
| placeholder-background / placeholder-text / placeholder-border | #E3E3DA / #5F6257 / #CDCEC3 |
| placeholder-inverse / inverse-line / inverse-text | #30332B / #555A4B / #C6C8BC |
| wordmark-muted | #C1C5B9, decorative only |

Secondary neutrals are centralized inherited values. Acid is limited to primary hover, focus on dark panels, selection and small brand punctuation.

## Typography

Space Grotesk: display headings, product titles, wordmarks. Inter: functional text, body, navigation and metadata. The legacy `.mono` class now names an uppercase utility role using Inter, rather than adding a third type family.

| Role | Desktop | Mobile |
|---|---|---|
| Hero | fluid 80–138px; compact tablet 64–88px | 48–72px |
| Page title | fluid 60–96px | 40–56px |
| Campaign / editorial | 44–88px by composition | 34–48px |
| Section title | 32–64px featured display; compact 36px | 28–36px |
| Product detail title | 36–56px | 34px |
| Product card title / price | 17px / 16px | 14px / 14px (16px single-column) |
| Body | 16px | 15px |
| Supporting copy | 14–15px | 14–15px |
| Metadata | 12–13px | 12–13px |
| Navigation / buttons | 13–14px | 13–14px |
| Footer links | 14px | 14px |

Only decorative developer asset IDs use 10px; mobile cards hide these labels. Meaningful labels and pending-photo notices remain readable. Text lines cap around 65ch. Display tracking stops at -0.04em; line heights are composition-specific, generally .94–1.05 for display and 1.55 for body. Solid lettering carries hierarchy. The dominant outline is reserved for the manifesto teaser/story opening.

## Layout

Maximum site width 1920px. Desktop gutter `clamp(48px, 4vw, 80px)`; compact desktop/tablet 32px below 1101px; mobile baseline 16px, with 24px for selected editorial prose. Spacing uses 4/8/12/16/24/32/40/48/64/80/96/128px.

- Header: 72px desktop, 64px mobile; equal outer grid tracks center the logo independently of utilities. Sticky layer 20; skip navigation layer 30. Native dialogs occupy the browser top layer.
- Hero: 7:5 composition, text first on mobile, distinct 3:2 and 4:5 asset crops.
- Homepage: four configured featured pieces, one campaign, three substance modules, one dark story teaser, newsletter. No duplicate full catalogue.
- Collection: two columns. Featured: four columns above 1100px and two below. Related: three desktop, two mobile. Below 360px, one column preserves readability.
- Grid dividers belong to actual cells, with paper underneath. Incomplete rows never expose border-color blocks. No fake fill cards.
- PDP: 60:40 desktop. Heading and purchase information in the right column; mobile heading/price precede the gallery. One 4:5 main gallery and compact counter; desktop thumbnails only.
- Lookbook: 12-column archive, two landscapes and four portraits, staggered independent mobile insets.
- Story: opening statement, origin image, editable origin block, process section, portrait/philosophy, closing CTA.
- Supporting pages share the page-heading, reading-width, divider and form system.

## Buttons and state

`.button` is a 52px outline secondary CTA; `.button.ink` is primary ink/paper. The retained `.acid` alias resolves to the primary system for compatibility. Primary hover turns acid/ink; secondary hover becomes ink/paper. Arrows move 3px diagonally. A 1px press translation supplies tactile feedback without scaling. Disabled controls retain readable text, semantic disabled behavior and no hover. Loading labels retain dimensions.

`.text-link` has a 44px minimum target and a 1px underline. Utility, quantity, close and gallery buttons are at least 44px. Footer links have minimum width and height 44px. Filters use filled ink selection, not a faint border. Size buttons are at least 44×44, filled when selected and disabled/struck through when unavailable. Color controls use a checkmark, label, stronger border and aria-pressed.

Real cart additions are synchronous. No artificial network delay or fake order/success state was added. Cart confirmation, size validation, quantity cap and local persistence use existing domain logic. Newsletter retains its explicitly labeled demo loading state. Contact never claims delivery.

## Interaction and accessibility

Current-page links expose aria-current. Labeled native inputs and semantic tables remain. Fit-specific measurement records are configurable and null/pending until verified. Native dialogs preserve Escape, backdrop close, scroll lock, focus restoration, forward/backward focus containment, and internal scrolling with bottom safe-area padding. Accordions keep aria-expanded/controls and inert closed content.

CSS states are independent of hover: keyboard and touch complete the same journeys. Gallery touch uses horizontal intent with a vertical tolerance and pan-y. Counts derive from media length; zero media has an honest pending frame and no zoom/navigation, one media hides redundant navigation, and multiple media wrap safely.

## Motion

| Use | Duration |
|---|---|
| Button / color / border | 200ms |
| Arrow | 180ms |
| Product media crossfade | 320ms |
| Drawer | 320ms |
| Backdrop | 220ms |
| Modal opacity / accordion | 240ms |
| Editorial reveal | 480ms, 18px |
| Hero stagger | 480ms entries + up to 240ms delay (720ms total) |
| Ticker | 72s linear seamless loop, pause control |

Primary easing: `cubic-bezier(0.22, 1, 0.36, 1)`. Accordion track changes use ease-in-out. No spring, scroll hijacking, broad blur, or extra motion dependency. Reveals enhance visible default content; reduced motion disables continuous movement and reduces transitions to near-instant. Ticker content is repeated only visually and announced once.

## Asset behavior

ImagePlaceholder reserves ratio before loading, uses Next.js Image, responsive sizes, focalPoint, lazy loading below fold, and a centralized developer-label switch. Gallery view is consistently 4:5; square detail sources retain their native ratio in zoom. HeroMedia uses art-directed picture sources through Next's optimizer when both crops exist, so the browser can select the matching crop without preloading the other one. Default-alt wording must be replaced with accurate photography descriptions.

The generated sample fixtures accept source/alt/focalPoint overrides by exact asset ID in src/config/product-media.ts. The map stays empty until approved files exist, so the imagery task does not require editing the product generator.

See IMAGE_PLACEMENT_GUIDE.md for exact IDs and framing. See TEST_REPORT.md for actual verification and limits; this document is not a WCAG or performance certification.

