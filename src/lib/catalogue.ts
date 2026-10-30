import { products, type Fit, type Product, type Size } from "../data/products.ts";

export type CatalogueQuery = { q?: string; fit?: string; size?: string; sort?: string };
export const sortOptions = [
  { value: "featured", label: "Featured" }, { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" }, { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];
export interface CatalogueAdapter {
  list: () => Product[];
  bySlug: (slug: string) => Product | undefined;
  byId: (id: string) => Product | undefined;
}
// Replace this adapter with an API-backed implementation when commerce is added.
export const catalogue: CatalogueAdapter = {
  list: () => products.filter((product) => product.displayStatus !== "hidden"),
  bySlug: (slug) => products.find((product) => product.slug === slug && product.displayStatus !== "hidden"),
  byId: (id) => products.find((product) => product.id === id && product.displayStatus !== "hidden"),
};
export const availableFits = [...new Set(catalogue.list().map((product) => product.fit))];
export const availableSizes = [...new Set(catalogue.list().flatMap((product) => product.availableSizes))];
export function normalizeQuery(query: CatalogueQuery): Required<CatalogueQuery> {
  return {
    q: (query.q ?? "").slice(0, 100),
    fit: availableFits.includes(query.fit as Fit) ? query.fit! : "",
    size: availableSizes.includes(query.size as Size) ? query.size! : "",
    sort: sortOptions.some((option) => option.value === query.sort) ? query.sort! : "featured",
  };
}
export function filterProducts(query: CatalogueQuery) {
  const { q, fit, size, sort } = normalizeQuery(query);
  const results = catalogue.list().filter((product) =>
    product.name.toLowerCase().includes(q.trim().toLowerCase()) &&
    (!fit || product.fit === fit) && (!size || product.availableSizes.includes(size as Size)),
  );
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  if (sort === "name-asc") results.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name-desc") results.sort((a, b) => b.name.localeCompare(a.name));
  return results;
}
