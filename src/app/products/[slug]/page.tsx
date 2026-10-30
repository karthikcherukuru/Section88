import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { catalogue } from "@/lib/catalogue";
import { ProductDetail } from "@/components/product-detail";
import { ProductGrid } from "@/components/product-grid";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return catalogue.list().map((product) => ({ slug: product.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const product = catalogue.bySlug((await params).slug); return { title: product?.name ?? "Object not found", description: product?.description }; }
export default async function ProductPage({ params }: Props) {
  const product = catalogue.bySlug((await params).slug);
  if (!product) notFound();
  const related = catalogue.list().filter((item) => item.id !== product.id).sort((a, b) => Number(b.fit === product.fit) - Number(a.fit === product.fit)).slice(0, 3);
  return <><nav className="breadcrumbs mono" aria-label="Breadcrumb"><Link href="/shop">The collection</Link><span>/</span><span aria-current="page">{product.name}</span></nav><ProductDetail product={product} /><section className="collection-section"><div className="section-heading compact"><h2>KEEP EXPLORING.</h2><Link href="/shop" className="text-link">View all <ArrowUpRight size={18} /></Link></div><ProductGrid products={related} variant="related" /></section></>;
}
