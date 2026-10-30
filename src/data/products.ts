import type { ImageSlot } from "@/config/images";
import { productMediaAssets } from "../config/product-media.ts";

export const sizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof sizes)[number];
export type Fit = "Oversized" | "Boxy" | "Regular";
export type ProductColor = { id: string; name: string; hex: string };
export type Variant = { id: string; size: Size; colorId: string; available: boolean };
export type Product = {
  id: string; slug: string; number: string; name: string; description: string;
  fit: Fit; price: number; currency: "INR"; availableSizes: Size[];
  colors: ProductColor[]; images: ImageSlot[]; collection: string;
  /** Color-specific media; an explicit empty array means photography is pending. */
  mediaByColor?: Record<string, ImageSlot[]>;
  displayStatus: "sample" | "published" | "hidden";
  availability: "demo-only" | "available" | "unavailable";
  variants: Variant[]; fabricDetails?: string; fitDetails?: string;
};

/** SAMPLE DATA ONLY. Names, prices, fits and availability are layout fixtures,
 * not confirmed SECTION 88 merchandise. Prices are integer paise, never rupees.
 * Replace variants with actual inventory before connecting real checkout.
 */
const sampleNames = ["Signal Study", "Off Register", "Open Channel", "After Hours", "Common Ground", "Side Effect", "Static Motion", "New Frequency", "Outside the Frame", "Unwritten"];
const sampleFits: Fit[] = ["Oversized", "Boxy", "Regular", "Oversized", "Boxy", "Regular", "Oversized", "Boxy", "Regular", "Oversized"];
export const products: Product[] = sampleNames.map<Product>((name, index) => {
  const number = String(index + 1).padStart(2, "0");
  const id = `sample-${number}`;
  const colors: ProductColor[] = [{ id: "ink", name: "Ink", hex: "#161813" }, ...(index % 2 === 0 ? [{ id: "paper", name: "Paper", hex: "#F3F1EA" }] : [])];
  const variants = colors.flatMap((color) => sizes.map((size) => ({
    id: `${id}-${color.id}-${size.toLowerCase()}`, size, colorId: color.id,
    available: !(size === "XS" || (color.id === "paper" && size === "XXL")),
  })));
  return {
    id, number, slug: name.toLowerCase().replaceAll(" ", "-"), name,
    description: "A sample graphic T-shirt concept for exploring the SECTION 88 collection. Artwork, materials and final garment specifications are still to be confirmed.",
    fit: sampleFits[index], price: 250000 + (index % 5) * 15000, currency: "INR",
    availableSizes: sizes.filter((size) => variants.some((variant) => variant.size === size && variant.available)),
    colors, variants, collection: "DROP 001", displayStatus: "sample", availability: "demo-only",
    images: ["Front", "Back", "On body", "Fabric detail"].map((label, slot) => ({
      id: `${id}-${slot}`, label: `Object ${number} / ${label}`, kind: slot === 3 ? "fabric" : "product-gallery",
      ...productMediaAssets[`${id}-ink-${slot}`],
    })),
    mediaByColor: Object.fromEntries(colors.map((color) => [color.id, ["Front", "Back", "On body", "Fabric detail"].map((label, slot) => ({
      id: `${id}-${color.id}-${slot}`, label: `Object ${number} / ${label}`, kind: slot === 3 ? "fabric" as const : "product-gallery" as const,
      ...productMediaAssets[`${id}-${color.id}-${slot}`],
    }))])),
    fitDetails: "Sample fit allocation only. Final garment measurements will be added after fit approval.",
  };
});
