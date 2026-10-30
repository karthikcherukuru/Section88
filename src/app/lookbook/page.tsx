import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/reveal";
import { lookbookSlots, type ImageSlot } from "@/config/images";
export const metadata: Metadata = { title: "Lookbook", description: "SECTION 88 visual archive. Surrealist fashion photography for the first collection." };

function frameSizes(slot: ImageSlot) {
  if (slot.kind === "lookbook-landscape") return "(max-width: 767px) calc(100vw - 32px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1200px) calc(100vw - 96px), (max-width: 1920px) 92vw, 1767px";
  if (slot.id === "lookbook-6") return "(max-width: 767px) calc(83.333vw - 29px), (max-width: 1100px) calc(50vw - 48px), (max-width: 1200px) calc(50vw - 64px), (max-width: 1920px) calc(46vw - 16px), 868px";
  const mobile = slot.id === "lookbook-3" ? "calc(75vw - 28px)" : "calc(66.667vw - 27px)";
  if (slot.id === "lookbook-5") return `(max-width: 767px) ${mobile}, (max-width: 1100px) calc(33.333vw - 43px), (max-width: 1200px) calc(33.333vw - 54px), (max-width: 1920px) calc(30.667vw - 22px), 568px`;
  return `(max-width: 767px) ${mobile}, (max-width: 1100px) calc(41.667vw - 45px), (max-width: 1200px) calc(41.667vw - 59px), (max-width: 1920px) calc(38.333vw - 19px), 718px`;
}

export default function Lookbook() {
  const frames = lookbookSlots.filter(slot => slot.src);
  return <><section className="page-heading lookbook-heading"><p className="mono">SECTION 88 / VISUAL ARCHIVE</p><h1>THE LOOKBOOK<span className="hero-period">.</span></h1><div className="page-heading-bottom"><p>The collection, outside the product frame.</p><span className="mono">Chapter 001</span></div></section>
    <div className="lookbook-grid">{frames.map((slot, index) => <Reveal key={slot.id} distance={12} className={`lookbook-frame ${slot.id.replace("lookbook-", "lookbook-frame-")}`}><figure><ImagePlaceholder slot={slot} index={String(index + 1).padStart(3, "0")} sizes={frameSizes(slot)} priority={index === 0} /><figcaption><span className="mono">FRAME {String(index + 1).padStart(3, "0")}</span>{slot.caption && <span>{slot.caption}</span>}{slot.productSlug && <Link className="text-link" href={`/products/${slot.productSlug}`}>View the piece<ArrowUpRight size={16} /></Link>}</figcaption></figure>{slot.id === "lookbook-3" && <p className="archive-note">A change of scene.<br />A different way to wear it.</p>}</Reveal>)}</div>
    <section className="editorial-end"><span className="mono">From the archive to the everyday.</span><h2>TAKE IT<br />FROM HERE.</h2><Link className="button ink" href="/shop">Explore the drop<ArrowUpRight size={20} /></Link></section>
  </>;
}

