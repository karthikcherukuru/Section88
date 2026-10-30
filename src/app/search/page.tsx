import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
export const metadata: Metadata = { title: "Search", description: "Search SECTION 88 sample product titles and explore available fits." };
export default function SearchPage() { return <><section className="page-heading"><p className="mono">THE COLLECTION INDEX</p><h1>FIND YOUR PIECE.</h1><p>Search the sample collection. Refine by fit or size.</p></section><p className="catalogue-notice">Sample catalogue / all prices and availability are demonstration data.</p><Suspense fallback={<p className="page-loading" role="status">Loading search…</p>}><Catalogue search /></Suspense></>; }
