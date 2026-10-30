"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Search, X } from "lucide-react";
import { filterProducts } from "@/lib/catalogue";
import { formatPrice } from "@/lib/format";
import { ImagePlaceholder } from "./image-placeholder";
import { productMedia } from "@/lib/media";

export function SearchPanel({ onNavigate }: { onNavigate: () => void }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useEffect(() => { const timer = setTimeout(() => setDebounced(query), 200); return () => clearTimeout(timer); }, [query]);
  const results = filterProducts({ q: debounced }).slice(0, 5);
  return <div className="search-panel"><form onSubmit={(event) => { event.preventDefault(); onNavigate(); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }} role="search">
    <label htmlFor="overlay-search" className="mono">Search the collection</label>
    <div className="search-field"><Search size={20} aria-hidden="true" /><input ref={input} id="overlay-search" name="q" placeholder="Find your next graphic" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={100} autoComplete="off" />
      {query && <button type="button" className="icon-button" aria-label="Clear search" onClick={() => { setQuery(""); input.current?.focus(); }}><X size={18} /></button>}
      <button className="icon-button" aria-label="Show search results"><ArrowUpRight size={22} /></button>
    </div></form>
    <div className="search-results" aria-busy={query !== debounced}><p className="mono muted" role="status">{debounced ? `${results.length} suggestions` : "Discover the sample drop"}</p>
      {results.length ? <ul>{results.map((product) => <li key={product.id}><Link href={`/products/${product.slug}`} onClick={onNavigate}>
        <ImagePlaceholder slot={productMedia(product)[0] ?? { id: `${product.id}-pending`, label: "Product photography pending", kind: "product-card" }} kind="product-card" index={product.number} sizes="64px" /><span>{product.name}<small>{product.fit} / sample</small></span><span>{formatPrice(product.price)}</span><ArrowUpRight size={18} />
      </Link></li>)}</ul> : <div className="empty-state"><h3>No matches yet.</h3><p>Try another product title, or clear your search.</p><button className="button" onClick={() => { setQuery(""); input.current?.focus(); }}>Clear search</button></div>}
      <Link href={`/search?q=${encodeURIComponent(query.trim())}`} onClick={onNavigate} className="text-link">View all results <ArrowUpRight size={18} /></Link>
    </div>
  </div>;
}
