# SECTION 88

Custom Next.js App Router storefront for a premium unisex graphic T-shirt brand. Editorial grids, paper/ink/acid tokens, responsive layouts, a sample collection, and a persistent browser demonstration bag. No Shopify architecture or dependencies.

**Current handoff:** application source is implemented, but this sandbox could not install dependencies. Production build, TypeScript, ESLint, browser interactions and responsive screenshots are **not verified**. See [TEST_REPORT.md](TEST_REPORT.md) for exact results and blockers. Do not treat this handoff as a verified deployment.

## Preserved work

`SECTION88_DESIGN_SPEC.md` and all eight original `section88_*.png` reference screenshots remain unchanged at the root. They describe the earlier concept, including superseded Shopify implementation notes. They are reference artifacts, not screenshots of this application. No Shopify theme was found or removed. The latest Next.js brief governs this implementation.

## Requirements and installation

Node.js 20.9+; Node 24 is recommended for the native TypeScript domain tests. Use Windows PowerShell with the `.cmd` npm/npx launchers when `.ps1` scripts are blocked.

```powershell
npm.cmd install --cache .npm-cache
npm.cmd run dev
```

Open http://localhost:3000. Once an installation succeeds, retain and commit the generated `package-lock.json`. It could not be generated in the current sandbox. Use `npm.cmd ci` for subsequent clean, repeatable installations.

The project declares Next.js 16.4.3 and React 19.3.1, checked against the npm registry’s stable tags on 2026-10-30. Tailwind v4 uses `@tailwindcss/postcss` and the CSS import configuration. No GSAP or animation library is needed for the implemented CSS and IntersectionObserver motion.

## Local commands

```powershell
npm.cmd run dev
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run test:unit
npm.cmd run audit:source
npm.cmd run build
npm.cmd run start
```

`test:unit` and `audit:source` run using Node built-ins, without installed packages. They do not replace compiler, lint or browser checks.

For browser tests, first build the application, install Chromium, then let Playwright start the production server:

```powershell
npx.cmd playwright install chromium
npm.cmd run build
npm.cmd test
```

Playwright writes its report to `playwright-report`, traces and screenshots to `test-results`. Both folders are ignored by Git. The responsive suite covers all ten requested widths and all routes, with full-page captures of five main page types at each width.

## Architecture

```text
src/app/                   App Router pages, metadata, robots and sitemap
src/components/            Server-rendered page pieces and isolated interactive controls
src/config/images.ts       Shared editorial image slots and aspect ratios
src/config/site.ts         Site metadata and prelaunch index control
src/data/products.ts       Ten explicitly labeled sample products and variants
src/data/info-pages.ts     Editable support and draft policy content
src/lib/catalogue.ts       Local catalogue adapter, filtering and sorting
src/lib/cart.ts            Pure variant, cart restoration and subtotal logic
src/stores/cart.ts         Zustand persistence adapter with manual hydration
src/stores/ui.ts           Ephemeral global overlay state
tests/                     Native domain tests and Playwright browser suites
public/images/             Add approved photography here
```

Routes: `/`, `/shop`, `/products/[slug]`, `/lookbook`, `/our-story`, `/cart`, `/search`, `/size-guide`, `/faq`, `/contact`, `/shipping-returns`, `/privacy`, `/terms`, and a custom 404. Support/policy routes share `src/app/[info]/page.tsx`; unknown keys return 404.

## Demonstration boundaries

- All current products, prices, fit allocations and availability are sample fixtures.
- Cart entries store product ID, variant ID and quantity in `section88-demo-bag` local storage. Totals derive from current local product data.
- Checkout is explicitly disabled. No payment, order, database, authentication or account UI exists.
- Newsletter and contact forms are transparent, local demonstrations. They send and save no form content.
- Garment measurements, materials, contact details and business policies are pending. No measurements or delivery promises have been invented.

See [PRODUCT_DATA_GUIDE.md](PRODUCT_DATA_GUIDE.md), [IMAGE_PLACEMENT_GUIDE.md](IMAGE_PLACEMENT_GUIDE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [ECOMMERCE_INTEGRATION.md](ECOMMERCE_INTEGRATION.md).

## Git and Vercel preparation

A local repository was initialized with an unborn `main` branch. This sandbox’s `.git` permissions prevented creating `feature/section88-storefront`; **HEAD remains on main and no commit was made**. Git also reported that the sandbox account differs from the workspace owner. No global Git ownership exception or security setting was changed.

After the administrator resolves scoped `.git` write access and workspace trust for this repository, create the development branch before committing:

```powershell
git switch -c feature/section88-storefront
git add .
git commit -m "Build SECTION 88 editorial storefront"
```

Create `main` as the production branch when the initial work is reviewed. No remote has been configured, and no GitHub repository, push or deployment has been created or authorized.

After all checks pass and remote creation/push are authorized, import the GitHub repository into Vercel using the standard **Next.js** framework preset. Keep root directory `.`, the default build command `npm run build`, and the framework’s output settings. No `vercel.json` override is needed. Use a compatible Node runtime, install from the committed lockfile, use previews for the feature branch, and use `main` for production after review.

Optional `SITE_URL` sets the canonical origin; see `.env.example`. It is not a secret. `site.isLaunched` is deliberately false: metadata disallows indexing, robots disallows crawling and the sitemap is empty. This is launch control, not access protection. Enable indexing only after merchandise, imagery, policies and real commerce are approved. No runtime filesystem writes are required.

## Environment blockers

The source folder is writable, but npm registry requests fail with `EACCES` and `.git/HEAD.lock` creation fails with `Permission denied`. Resolve those scoped managed permissions while keeping the workspace sandbox enabled. Dependency installation also requires access to the npm registry; Next.js font optimization needs access to its configured font sources during builds. Playwright’s browser installer needs its download hosts. Do not switch to unrestricted access or disable security to run the project.

Official setup references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation), [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [Zustand persistence](https://zustand.docs.pmnd.rs/integrations/persisting-store-data).
