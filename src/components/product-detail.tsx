"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Minus, Plus } from "lucide-react";
import { sizes, type Product, type Size } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { productMedia } from "@/lib/media";
import { useCart, MAX_QUANTITY } from "@/stores/cart";
import { useUi } from "@/stores/ui";
import { ProductGallery } from "./product-gallery";
import { Accordion } from "./accordion";
import { Dialog } from "./dialog";
import { SizeChart } from "./size-chart";

export function ProductDetail({ product }: { product: Product }) {
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [guide, setGuide] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const sizeRef = useRef<HTMLFieldSetElement>(null);
  const hydrated = useCart((state) => state.hydrated);
  const add = useCart((state) => state.add);
  const setOverlay = useUi((state) => state.setOverlay);
  const selected = product.variants.find((variant) => variant.size === size && variant.colorId === colorId && variant.available);
  const available = product.availability !== "unavailable";
  return <div className="product-detail">
    <header className="product-heading">
      <p className="mono">SECTION 88 / PIECE {product.number.padStart(3, "0")}</p>
      <h1>{product.name}</h1>
      <div className="product-price"><span>{formatPrice(product.price, product.currency)}</span><span className="mono">Sample piece</span></div>
    </header>
    <ProductGallery key={colorId} media={productMedia(product, colorId)} name={product.name} number={product.number} />
    <div className="product-information">
      <div className="product-intro"><span className="fit-label">FIT / {product.fit}</span><p>{product.description}</p></div>
      <fieldset className="color-options"><legend>Color: {product.colors.find((color) => color.id === colorId)?.name}</legend><div>{product.colors.map((color) => <button type="button" key={color.id} aria-label={`Color ${color.name}`} aria-pressed={colorId === color.id} onClick={() => {
        setColorId(color.id);
        if (!product.variants.some((variant) => variant.colorId === color.id && variant.size === size && variant.available)) setSize(null);
        setFeedback(null);
      }}><span style={{ backgroundColor: color.hex }} aria-hidden="true" />{color.name}{colorId === color.id && <Check size={14} aria-hidden="true" />}</button>)}</div></fieldset>
      <fieldset className="size-options" ref={sizeRef}><legend>Select size</legend><button type="button" className="size-guide-trigger text-link" onClick={() => setGuide(true)}>Size guide<ArrowUpRight size={14} /></button><div>{sizes.map((item) => {
        const enabled = available && product.variants.some((variant) => variant.size === item && variant.colorId === colorId && variant.available);
        return <button key={item} aria-pressed={size === item} disabled={!enabled} aria-label={enabled ? `Size ${item}` : `Size ${item} unavailable`} onClick={() => { setSize(item); setFeedback(null); }}>{item}</button>;
      })}</div></fieldset>
      <div className="purchase-row"><div className="quantity-control">
        <button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}><Minus size={16} /></button>
        <span aria-label="Quantity">{quantity}</span>
        <button aria-label="Increase quantity" disabled={quantity >= MAX_QUANTITY} onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
      </div><button className="button ink add-to-bag" disabled={!hydrated || !available} onClick={() => {
        if (!selected) {
          setFeedback({ ok: false, message: "Choose an available size before adding to your bag." });
          sizeRef.current?.querySelector<HTMLButtonElement>('div > button:not(:disabled)')?.focus();
          return;
        }
        const result = add({ productId: product.id, variantId: selected.id, quantity });
        setFeedback(result);
        if (result.ok) setOverlay("cart");
      }}>{!available ? "Unavailable" : !hydrated ? "Loading bag…" : feedback?.ok ? "Added to bag" : "Add to bag"}<ArrowUpRight size={19} /></button></div>
      {feedback && <p className="feedback" role={feedback.ok ? "status" : "alert"}>{feedback.message}</p>}
      <p className="demo-note">Prelaunch preview. Sample price and availability. Your bag is saved locally; checkout is unavailable.</p>
      <div className="product-accordions">
        <Accordion title="Product details"><p>Artwork notes and final garment specifications will be added with the approved collection.</p></Accordion>
        <Accordion title="Fit & measurements"><p>{product.fitDetails ?? "Final fit details are pending."}</p><button className="text-link" onClick={() => setGuide(true)}>Open size guide<ArrowUpRight size={15} /></button></Accordion>
        <Accordion title="Fabric & care"><p>{product.fabricDetails ?? "Fabric composition, weight and verified care instructions are awaiting approval."}</p></Accordion>
        <Accordion title="Shipping & returns"><p>Delivery regions, rates, dispatch estimates and return terms are being finalized.</p><Link className="text-link" href="/shipping-returns">Read the policy status<ArrowUpRight size={15} /></Link></Accordion>
      </div>
    </div>
    <Dialog open={guide} onClose={() => setGuide(false)} title="Size guide"><SizeChart initialFit={product.fit} /></Dialog>
  </div>;
}

