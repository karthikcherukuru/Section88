"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, resolveLine, MAX_QUANTITY } from "@/stores/cart";
import { ImagePlaceholder } from "./image-placeholder";
import { formatPrice } from "@/lib/format";
import { cartSubtotal } from "@/lib/cart";
import { productMedia } from "@/lib/media";

export function CartContent({ drawer = false, onNavigate }: { drawer?: boolean; onNavigate?: () => void }) {
  const lines = useCart((state) => state.lines);
  const hydrated = useCart((state) => state.hydrated);
  const update = useCart((state) => state.update);
  const remove = useCart((state) => state.remove);
  const warning = useCart((state) => state.storageWarning);
  const [feedback, setFeedback] = useState("");
  const resolved = lines.map(resolveLine).filter((line) => line !== null);
  const subtotal = cartSubtotal(lines);
  if (!hydrated) return <p className="bag-loading" role="status">Loading your local bag…</p>;
  return <div className={`cart-content ${drawer ? "cart-compact" : ""}`}>
    <p className="demo-note">Demonstration bag. Sample products and prices. No orders or payments are accepted.</p>
    {warning && <p role="alert" className="feedback">{warning}</p>}
    <p role="status" className="sr-only">{feedback}</p>
    {resolved.length === 0 ? <div className="empty-state"><span className="empty-number" aria-hidden="true">00</span><h3>Your story starts here.</h3><p>Your bag is empty. Find a piece that feels like you.</p><Link className="button acid" href="/shop" onClick={onNavigate}>Explore the drop <ArrowUpRight size={18} /></Link></div> : <>
      <div className="cart-layout"><div className="cart-items">{resolved.map((line) => <article className="cart-line" key={line.variantId}>
        <Link href={`/products/${line.product.slug}`} onClick={onNavigate} aria-label={`View ${line.product.name}`}><ImagePlaceholder slot={productMedia(line.product, line.color.id)[0] ?? { id: `${line.product.id}-pending`, label: "Product photography pending", kind: "product-card" }} kind="product-card" index={line.product.number} sizes="120px" /></Link>
        <div className="cart-line-info"><span className="mono muted">SAMPLE / OBJECT {line.product.number}</span><Link className="cart-line-name" href={`/products/${line.product.slug}`} onClick={onNavigate}>{line.product.name}</Link><p>{line.color.name} / {line.variant.size} / {line.product.fit}</p><span>{formatPrice(line.product.price)}</span>
          <div className="cart-line-actions"><div className="quantity-control" aria-label={`Quantity for ${line.product.name}`}>
            <button aria-label={`Decrease ${line.product.name} quantity`} disabled={line.quantity <= 1} onClick={() => { update(line.variantId, line.quantity - 1); setFeedback("Bag quantity updated."); }}><Minus size={14} /></button>
            <span aria-label="Quantity">{line.quantity}</span>
            <button aria-label={`Increase ${line.product.name} quantity`} disabled={line.quantity >= MAX_QUANTITY} onClick={() => { update(line.variantId, line.quantity + 1); setFeedback("Bag quantity updated."); }}><Plus size={14} /></button>
          </div><button className="icon-button" aria-label={`Remove ${line.product.name}`} onClick={() => { remove(line.variantId); setFeedback(`${line.product.name} removed.`); }}><Trash2 size={17} /></button></div>
        </div><span className="cart-line-total">{formatPrice(line.product.price * line.quantity)}</span>
      </article>)}</div>
      <div className="cart-summary"><div className="subtotal"><span>Subtotal</span><strong data-testid="subtotal">{formatPrice(subtotal)}</strong></div><p className="muted">Local sample subtotal only. Taxes, shipping and final pricing are not configured.</p>
        <button className="button ink" disabled>Checkout unavailable</button><p className="muted small">Real checkout will be available after payment, inventory and order services are connected.</p>
        {drawer && <Link className="button" href="/cart" onClick={onNavigate}>View shopping bag <ArrowUpRight size={18} /></Link>}
        <Link className="text-link" href="/shop" onClick={onNavigate}>Continue shopping <ArrowUpRight size={16} /></Link>
      </div></div>
    </>}
  </div>;
}
