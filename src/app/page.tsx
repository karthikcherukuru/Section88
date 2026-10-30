import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandTicker } from "@/components/brand-ticker";
import { ImagePlaceholder } from "@/components/image-placeholder";
import { ProductGrid } from "@/components/product-grid";
import { Newsletter } from "@/components/newsletter";
import { Reveal } from "@/components/reveal";
import { imageSlots } from "@/config/images";
import { editorial, featuredProductIds } from "@/config/editorial";
import { catalogue } from "@/lib/catalogue";
import { HeroMedia } from "@/components/hero-media";

export default function Home() {
  const featured = featuredProductIds.flatMap((id) => { const product = catalogue.byId(id); return product ? [product] : []; });
  return <>
    <section className="hero">
      <HeroMedia />
      <div className="hero-copy"><p className="mono">SECTION 88 / DROP 001</p>
        <h1>NOT MADE<br />TO BLEND<br className="mobile-break" /> IN<span className="hero-period">.</span></h1>
        <div className="hero-bottom"><p>{editorial.hero.introduction}</p><Link href="/shop" className="button ink">Explore the drop<ArrowUpRight size={20} /></Link></div>
      </div>
      <div className="hero-art">
        <div className="hero-art-rail"><span className="mono">The first chapter</span><span className="drop-number">001</span></div>
      </div>
      <div className="hero-rail mono"><span>Controlled rebellion.</span><span>Unisex / Graphic T-shirts</span><span>Collection preview</span></div>
    </section>
    <BrandTicker />
    <section className="featured-collection" aria-labelledby="featured-title">
      <div className="section-heading"><div><p className="mono">001 / THE DROP</p><h2 id="featured-title">THE FIRST DROP.</h2></div><Link href="/shop" className="text-link">View the collection<ArrowUpRight size={18} /></Link></div>
      <ProductGrid products={featured} variant="featured" /><p className="catalogue-notice">Sample collection / names, prices and availability are for preview.</p>
    </section>
    <Reveal distance={12}><section className="campaign-section"><div className="campaign-media"><ImagePlaceholder slot={imageSlots.campaign} className="editorial-image" sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1920px) calc(58.333vw - 48px), 1072px" /></div><div className="campaign-copy"><span className="mono">The campaign / 001</span><h2>WEAR YOUR<br />OWN STORY.</h2><p>{editorial.campaign}</p><Link href="/lookbook" className="button">View lookbook<ArrowUpRight size={19} /></Link></div></section></Reveal>
    <section className="substance-section"><div className="substance-heading"><h2>THE FIT.<br />THE GRAPHIC.<br /><span className="muted">THE DETAIL.</span></h2><p>Three ways into a piece.<br />The collection, up close.</p></div>
      <div className="substance-grid">{editorial.substance.map((item, index) => <article className={`substance-item substance-item-${index + 1}`} key={item.slot}><ImagePlaceholder slot={imageSlots[item.slot]} className="editorial-image" sizes={item.slot === "fit" ? "(max-width: 767px) calc(95vw - 64px), (max-width: 1920px) 76vw, 1432px" : "(max-width: 767px) calc(40vw - 27px), (max-width: 1920px) 30vw, 550px"} /><div><h3><span className="mono">0{index + 1}</span>{item.title}</h3><p>{item.copy}</p><Link href={item.href} className="text-link">{item.link}<ArrowUpRight size={16} /></Link></div></article>)}</div>
    </section>
    <Reveal distance={12}><section className="story-teaser"><div className="story-teaser-copy"><span className="mono">Behind SECTION 88</span><h2>AN IDEA.<br />THEN A<br /><span className="outline">UNIFORM.</span></h2><p>{editorial.story.introduction}</p><Link href="/our-story" className="button">Our story<ArrowUpRight size={19} /></Link></div><div className="story-teaser-image"><ImagePlaceholder slot={imageSlots.story} className="editorial-image" sizes="(max-width: 767px) 300px, (max-width: 1920px) calc(40vw - 64px), 704px" /></div></section></Reveal>
    <Newsletter />
  </>;
}

