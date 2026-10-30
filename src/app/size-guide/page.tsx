import type { Metadata } from "next";
import { SizeChart } from "@/components/size-chart";
export const metadata: Metadata = { title: "Size guide", description: "SECTION 88 sizing information. Final garment measurements are pending approval." };
export default function SizeGuidePage() { return <><section className="page-heading"><p className="mono">FIT REFERENCE</p><h1>FIND YOUR FIT.</h1><p>Three silhouettes. Measurements will be added after fit approval.</p></section><section className="size-guide-page"><h2>The measurement chart</h2><SizeChart /></section></>; }
