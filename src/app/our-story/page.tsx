import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { imageSlots } from "@/config/images";
import { editorial } from "@/config/editorial";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { Reveal } from "@/components/reveal";
export const metadata: Metadata = { title: "Our story", description: "The idea behind SECTION 88. A collection and a visual point of view in development." };
export default function Story() {
  return <><section className="story-opening"><p className="mono">Our story / A work in progress</p><h1>SECTION 88<br />IS AN IDEA<br />BEFORE IT’S<br /><span className="outline">A UNIFORM.</span></h1><div className="story-introduction"><p className="large-copy">{editorial.story.introduction}</p><p>Graphic T-shirts. Three sample silhouettes. A first collection taking shape. The words here are our provisional creative direction; the full story will follow.</p></div></section>
    <Reveal className="story-origin-image" distance={12}><ImagePlaceholder slot={imageSlots.storyOrigin} sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1100px) calc(100vw - 64px), (max-width: 1920px) 92vw, 1760px" /></Reveal>
    <section className="story-chapter"><span className="mono">The starting point</span><div><h2>WHAT’S IN<br />A SECTION?</h2><p>{editorial.story.origin}</p><span className="content-status">Brand origins / editorial content pending</span></div></section>
    <section className="story-process"><Reveal className="story-process-image" distance={12}><ImagePlaceholder slot={imageSlots.storyProcess} sizes="(max-width: 767px) 100vw, (max-width: 1920px) 58.333vw, 1120px" /></Reveal><div><span className="mono">In the studio</span><h2>FROM STUDY<br />TO SILHOUETTE.</h2><p>{editorial.story.process}</p></div></section>
    <section className="story-duo"><div><span className="mono">The point of view</span><h2>LESS NOISE.<br />MORE INTENT.</h2><p>{editorial.story.philosophy}</p><span className="content-status">Collection philosophy / draft</span></div><Reveal className="story-portrait-image" distance={12}><ImagePlaceholder slot={imageSlots.storyPortrait} sizes="(max-width: 767px) 300px, (max-width: 1920px) 36vw, 680px" /></Reveal></section>
    <section className="editorial-end story-closing"><h2>THE NEXT PART<br />IS HOW YOU<br />WEAR IT.</h2><Link className="button ink" href="/shop">Meet the collection<ArrowUpRight size={19} /></Link></section></>;
}

