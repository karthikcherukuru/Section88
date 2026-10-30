import type { Product } from "@/data/products";
import { ProductCard } from "./product-card";
export function ProductGrid({ products, variant = "collection" }: { products: Product[]; variant?: "collection" | "featured" | "related" }) {
  const sizes = variant === "featured" ? "(max-width: 359px) 100vw, (max-width: 1100px) 50vw, 25vw" : variant === "related" ? "(max-width: 359px) 100vw, (max-width: 767px) 50vw, 33vw" : "(max-width: 359px) 100vw, 50vw";
  return <div className={`product-grid product-grid-${variant}`}>{products.map((product) => <ProductCard key={product.id} product={product} sizes={sizes} />)}</div>;
}
