import { catalogue } from "./catalogue.ts";

export type CartLine = { productId: string; variantId: string; quantity: number };
export const MAX_QUANTITY = 10;
export function resolveLine(line: CartLine) {
  const product = catalogue.byId(line.productId);
  const variant = product?.variants.find((item) => item.id === line.variantId && item.available);
  const color = product?.colors.find((item) => item.id === variant?.colorId);
  return product && variant && color && product.availability !== "unavailable" ? { ...line, product, variant, color } : null;
}
export function sanitizeLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const clean = new Map<string, CartLine>();
  for (const raw of value.slice(0, 200)) {
    if (!raw || typeof raw !== "object") continue;
    const line = raw as Partial<CartLine>;
    if (typeof line.productId !== "string" || typeof line.variantId !== "string" || typeof line.quantity !== "number" || !Number.isFinite(line.quantity) || line.quantity < 1) continue;
    const quantity = Math.min(MAX_QUANTITY, Math.floor(line.quantity));
    const entry = { productId: line.productId, variantId: line.variantId, quantity };
    if (resolveLine(entry)) clean.set(line.variantId, entry);
  }
  return [...clean.values()];
}
export function addCartLine(lines: CartLine[], line: CartLine): { ok: boolean; message: string; lines: CartLine[] } {
  if (!resolveLine(line) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > MAX_QUANTITY) return { ok: false, message: "Please choose an available size and color.", lines };
  const existing = lines.find((item) => item.variantId === line.variantId);
  if ((existing?.quantity ?? 0) + line.quantity > MAX_QUANTITY) return { ok: false, message: `The demo bag allows up to ${MAX_QUANTITY} of each variant.`, lines };
  return { ok: true, message: "Added to your demonstration bag.", lines: existing ? lines.map((item) => item.variantId === line.variantId ? { ...item, quantity: item.quantity + line.quantity } : item) : [...lines, line] };
}
export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => { const resolved = resolveLine(line); return total + (resolved ? resolved.product.price * line.quantity : 0); }, 0);
}
