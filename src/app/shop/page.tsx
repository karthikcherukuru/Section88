import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
import { catalogue } from "@/lib/catalogue";
export const metadata: Metadata = { title: "Shop the drop", description: "Explore ten sample SECTION 88 styles. Filter by fit and size and find your form." };
export default function ShopPage() { return <><section className="page-heading shop-heading"><p className="mono">SECTION 88 / COLLECTION 001</p><h1>THE COLLECTION.</h1><div className="page-heading-bottom"><p>Graphic studies. Everyday silhouettes.</p><span className="mono">{String(catalogue.list().length).padStart(2, "0")} pieces / The sample collection</span></div></section><p className="catalogue-notice">Sample products, prices and availability / not confirmed merchandise.</p><Suspense fallback={<p className="page-loading" role="status">Loading catalogue controls…</p>}><Catalogue /></Suspense><div className="closing-strip">TEN PIECES. ONE POINT OF VIEW.<span>SECTION 88.</span></div></>; }
