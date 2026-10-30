import type { MetadataRoute } from "next";
import { catalogue } from "@/lib/catalogue";
import { site } from "@/config/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.isLaunched || !site.url) return [];
  const paths = ["", "/shop", "/lookbook", "/our-story", "/size-guide", "/faq", "/contact", "/shipping-returns", "/privacy", "/terms", ...catalogue.list().map((product) => `/products/${product.slug}`)];
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
