import type { MetadataRoute } from "next";
import { site } from "@/config/site";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", ...(site.isLaunched ? { allow: "/" } : { disallow: "/" }) }, ...(site.isLaunched && site.url ? { sitemap: `${site.url}/sitemap.xml` } : {}) }; }
