import type { Product } from "../data/products.ts";
import type { ImageSlot } from "../config/images.ts";

export function productMedia(product: Product, colorId = product.colors[0]?.id): ImageSlot[] {
  return (colorId ? product.mediaByColor?.[colorId] : undefined) ?? product.images;
}

export function galleryIndex(index: number, count: number): number {
  return count > 0 ? ((index % count) + count) % count : 0;
}
