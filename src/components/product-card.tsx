import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { productMedia } from "@/lib/media";

export function ProductCard({ product, sizes = "(max-width: 359px) 100vw, 50vw" }: { product: Product; sizes?: string }) {
  const media = productMedia(product);
  const front = media[0] ?? { id: `${product.id}-front-pending`, label: "Product photography pending", kind: "product-card" as const };
  return <article className="product-card">
    <div className="product-caption-top mono"><span>S88 / {product.number.padStart(3, "0")}</span><span>{product.fit}</span></div>
    <Link href={`/products/${product.slug}`} className="product-image-link" aria-label={`View ${product.name}`}>
      <ImagePlaceholder slot={front} kind="product-card" index={product.number} sizes={sizes} />
      {front.src && media[1]?.src && <div className="product-alternate"><ImagePlaceholder slot={media[1]} kind="product-card" sizes={sizes} /></div>}
    </Link>
    <div className="product-caption">
      <div className="product-name-price"><Link href={`/products/${product.slug}`} className="product-title"><h3>{product.name}</h3></Link><span className="product-card-price">{formatPrice(product.price, product.currency)}</span></div>
      <div className="product-caption-bottom"><span>{product.displayStatus === "sample" ? "Sample piece" : product.collection} / {product.fit} fit</span><ArrowUpRight size={16} aria-hidden="true" /></div>
    </div>
  </article>;
}
