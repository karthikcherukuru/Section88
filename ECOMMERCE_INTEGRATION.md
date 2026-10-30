# Commerce integration boundary

This build is a frontend with a working **local demonstration bag**. It accepts no orders or payments. Checkout is visibly unavailable. There is no database, authentication provider, payment gateway, Shopify integration or backend form destination.

## Existing functionality

The local catalogue adapter supplies products and valid variants. Zustand persists product/variant IDs and quantities in the browser. Manual post-mount hydration keeps server and initial client output consistent. Rehydration sanitizes malformed/stale entries, resolves current catalogue prices, and excludes invalid variants. Quantity changes, removal, subtotal, bag count, drawer and cart page share that state. Storage failure is surfaced to the user, with an in-memory visit remaining usable.

Pure logic is isolated in `src/lib/cart.ts`; catalogue access is isolated in `src/lib/catalogue.ts`; browser persistence lives in `src/stores/cart.ts`. Product presentation, dialogs and editorial page components can remain while these adapters gain backend implementations. The current local subtotal is informational and must never be used as an authoritative payment amount.

## Real checkout

Before enabling a checkout action, implement a server-owned quote and checkout endpoint that receives product/variant IDs and quantities, validates current inventory, calculates authoritative prices/taxes/shipping, and starts a provider checkout session. Keep payment secrets server-only. Use a hosted or properly scoped payment integration; never collect raw card data through these frontend forms.

Payment success redirects must not mark an order paid. Verify provider webhooks, signatures and event identity server-side, using raw payload verification when required by the provider. Make checkout creation, webhook handling and inventory updates idempotent. Account for delayed confirmation, duplicate delivery, cancellation, failed payment and refunds. Add integration tests against the chosen provider’s sandbox before taking real money.

## Inventory and orders

Introduce durable product, variant, inventory, quote, checkout, order, order-line and fulfillment records. Confirm schema and lifecycle before selecting storage. Reserve or atomically decrement stock to avoid overselling, expire reservations safely, and record the accepted price/tax/shipping snapshot on each order. Keep order numbers and payment-provider IDs unique. Reconcile provider events against server records and notify the customer only after confirmed state changes.

The sample `available` boolean and quantity cap are not inventory. Add API validation at cart mutation and quote/checkout time; handle product changes and unavailable variants with actionable feedback. Replace local persistence with an anonymous server cart/token when needed, retaining hydration-safe display. Define a deliberate migration path from `section88-demo-bag` rather than silently treating demonstration contents as real orders.

## Shipping, customer support and policies

Supply approved delivery regions, rates, dispatch/delivery estimates, tracking, return eligibility and refund rules. Connect carrier/rate services only after these business rules exist. Publish official support details. Replace the pending size chart with measured fit/product charts and verified care information. Have the final privacy policy and terms reviewed for the actual business and service configuration.

## Newsletter/contact and optional accounts

Replace local form demonstrations with server endpoints and a verified destination. Add server-side validation, length limits, abuse controls, consent where appropriate, error handling, retention rules and a clear privacy notice. Keep confirmation truthful: success must mean the destination actually accepted the submission. Real newsletter workflows may need verification and unsubscribe handling. No account icon or sign-in screen should appear until a real account workflow exists.

## Security and operations

- Treat all client data as untrusted, including prices, quantities, product identifiers and persisted storage.
- Authenticate/authorize order administration and any customer-specific endpoints; verify ownership before exposing orders.
- Keep secrets outside the client bundle and repository; scope preview and production credentials separately.
- Use provider signature verification, replay/idempotency controls, input validation, rate limiting and explicit cross-origin/request protections suitable for the chosen endpoints.
- Avoid sensitive data in logs, URLs or browser persistence. Define access controls, retention, backups and recovery for the eventual database.
- Monitor payment/order failures and reconcile inventory and payment state. Verify the complete browser → server → provider/database → response flow before launch.

No external service was selected, provisioned or configured in this implementation. Those integrations require their own product choices, credentials and verified end-to-end testing.
