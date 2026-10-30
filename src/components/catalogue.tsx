"use client";
import { useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { availableFits, availableSizes, filterProducts, normalizeQuery, sortOptions, type CatalogueQuery } from "@/lib/catalogue";
import { ProductGrid } from "./product-grid";
import { Dialog } from "./dialog";

function FilterFields({ value, onChange, prefix }: { value: Required<CatalogueQuery>; onChange: (value: CatalogueQuery) => void; prefix: string }) {
  return <><div className="filter-group"><label htmlFor={`${prefix}-fit`}>Fit</label><select id={`${prefix}-fit`} value={value.fit} onChange={(event) => onChange({ fit: event.target.value })}><option value="">All fits</option>{availableFits.map((fit) => <option key={fit}>{fit}</option>)}</select></div>
    <div className="filter-group"><label htmlFor={`${prefix}-size`}>Size</label><select id={`${prefix}-size`} value={value.size} onChange={(event) => onChange({ size: event.target.value })}><option value="">All sizes</option>{availableSizes.map((size) => <option key={size}>{size}</option>)}</select></div>
    <div className="filter-group"><label htmlFor={`${prefix}-sort`}>Sort by</label><select id={`${prefix}-sort`} value={value.sort} onChange={(event) => onChange({ sort: event.target.value })}>{sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
  </>;
}
export function Catalogue({ search = false }: { search?: boolean }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const query = normalizeQuery({ q: params.get("q") ?? "", fit: params.get("fit") ?? "", size: params.get("size") ?? "", sort: params.get("sort") ?? "" });
  const [sheet, setSheet] = useState(false);
  const [draft, setDraft] = useState(query);
  const input = useRef<HTMLInputElement>(null);
  const results = filterProducts(query);
  const active = Boolean(query.fit || query.size || query.q || query.sort !== "featured");
  function update(changes: CatalogueQuery, clear = false) {
    const next = normalizeQuery(clear ? {} : { ...query, ...changes });
    const nextParams = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) if (value && value !== "featured") nextParams.set(key, value);
    const suffix = nextParams.toString();
    window.history.replaceState(null, "", `${pathname}${suffix ? `?${suffix}` : ""}`);
  }
  return <div className="catalogue">{search && <p className="catalogue-notice" role="status">{query.q ? `Results for “${query.q}”` : "Explore all sample pieces"}</p>}<div className="catalogue-search"><label htmlFor="catalogue-search" className="sr-only">Search product titles</label><Search size={19} aria-hidden="true" /><input ref={input} id="catalogue-search" value={query.q} maxLength={100} placeholder={search ? "Search the collection" : "Search product titles"} onChange={(event) => update({ q: event.target.value })} />{query.q && <button aria-label="Clear product search" className="icon-button" onClick={() => { update({ q: "" }); input.current?.focus(); }}><X size={17} /></button>}</div>
    <div className="filter-bar"><div className="fit-tabs" role="group" aria-label="Filter by fit"><button aria-pressed={!query.fit} onClick={() => update({ fit: "" })}>All styles</button>{availableFits.map((fit) => <button aria-pressed={query.fit === fit} key={fit} onClick={() => update({ fit })}>{fit}</button>)}</div><button className="mobile-filter button" onClick={() => { setDraft(query); setSheet(true); }}><SlidersHorizontal size={17} /> Filter & sort</button><p className="result-count mono" role="status">{String(results.length).padStart(2, "0")} {results.length === 1 ? "OBJECT" : "OBJECTS"}</p></div>
    <div className="mobile-sort-row"><button className="mobile-sort text-link" onClick={() => { setDraft(query); setSheet(true); requestAnimationFrame(() => document.getElementById("mobile-sort")?.focus()); }}>Sort / {sortOptions.find((option) => option.value === query.sort)?.label}<ArrowUpRight size={16} /></button></div>
    <div className="desktop-filters"><FilterFields value={query} onChange={update} prefix="desktop" />{active && <button className="text-link" onClick={() => update({}, true)}>Clear filters <X size={15} /></button>}</div>
    {results.length ? <ProductGrid products={results} /> : <div className="empty-state"><span className="empty-number" aria-hidden="true">00</span><h2>No objects in this view.</h2><p>Try another title, fit or size.</p><button className="button" onClick={() => update({}, true)}>Clear all filters <ArrowUpRight size={18} /></button></div>}
    <Dialog open={sheet} onClose={() => setSheet(false)} title="Filter & sort" side="bottom"><div className="mobile-filter-fields"><FilterFields value={draft} onChange={(changes) => setDraft((current) => normalizeQuery({ ...current, ...changes }))} prefix="mobile" /><button className="text-link" onClick={() => setDraft(normalizeQuery({}))}>Clear all <X size={16} /></button><button className="button ink" onClick={() => { update(draft); setSheet(false); }}>Show {filterProducts(draft).length} objects <ArrowUpRight size={18} /></button></div></Dialog>
  </div>;
}
