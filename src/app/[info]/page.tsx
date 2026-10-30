import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { infoPages } from "@/data/info-pages";
import { Accordion } from "@/components/accordion";
import { ContactForm } from "@/components/contact-form";
type Props = { params: Promise<{ info: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(infoPages).map((info) => ({ info })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = infoPages[(await params).info]; return { title: page?.title ?? "Not found", description: page?.intro }; }
export default async function InfoPage({ params }: Props) {
  const { info } = await params;
  const page = Object.hasOwn(infoPages, info) ? infoPages[info] : undefined;
  if (!page) notFound();
  return <><section className="page-heading"><p className="mono">SECTION 88 / {page.title}</p><h1>{page.headline}</h1><p>{page.intro}</p></section><div className={`info-layout ${info === "faq" ? "faq-layout" : ""}`}><aside><span className="mono">{info === "faq" ? "ANSWERS / THE PREVIEW" : "CONTENT STATUS / PRELAUNCH"}</span><p>{info === "faq" ? "Still finding your way? The contact page explains how to reach us once our details are confirmed." : "Draft content. Details are awaiting approval before the store opens."}</p></aside><div className="info-content">{page.sections.map((section) => info === "faq" ? <Accordion key={section.title} title={section.title}>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Accordion> : <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}{info === "contact" && <ContactForm />}</div></div></>;
}
