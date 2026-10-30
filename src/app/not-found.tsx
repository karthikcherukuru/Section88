import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() { return <section className="not-found"><span className="mono">SECTION 88 / PAGE NOT FOUND</span><div className="not-found-number" aria-hidden="true">404</div><h1>OUTSIDE THE SECTION.</h1><p>This page isn’t part of the collection. Find your way back to the drop.</p><Link href="/shop" className="button ink">Return to collection <ArrowUpRight size={19} /></Link></section>; }
