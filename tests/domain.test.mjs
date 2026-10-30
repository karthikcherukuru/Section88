import test from "node:test";
import assert from "node:assert/strict";
import { products, sizes } from "../src/data/products.ts";
import { availableFits, filterProducts, normalizeQuery, catalogue } from "../src/lib/catalogue.ts";
import { addCartLine, sanitizeLines, resolveLine, cartSubtotal, MAX_QUANTITY } from "../src/lib/cart.ts";
import { formatPrice } from "../src/lib/format.ts";
import { productMedia, galleryIndex } from "../src/lib/media.ts";
import { imageSlots, lookbookSlots } from "../src/config/images.ts";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const first = products[0];
const variant = first.variants.find((item) => item.available);
const line = { productId: first.id, variantId: variant.id, quantity: 2 };

test("all forty mapped photographs are unique, preserve original bytes and report real dimensions", async () => {
  const inventory = JSON.parse(await readFile(new URL("../product-image-artifacts/inventory.json", import.meta.url), "utf8"));
  const originals = inventory.flatMap((folder) => folder.files);
  const media = products.flatMap((product) => productMedia(product, "ink"));
  assert.equal(originals.length, 40);
  assert.equal(media.length, 40);
  assert.equal(new Set(media.map((slot) => slot.src)).size, 40);
  assert.equal(new Set(originals.map((file) => file.sha256)).size, 40);
  for (const slot of media) {
    const original = originals.find((file) => file.src === decodeURIComponent(slot.src));
    assert.ok(original, `Not an inventoried original: ${slot.src}`);
    const bytes = await readFile(new URL(`../public${slot.src}`, import.meta.url));
    const metadata = await sharp(bytes).metadata();
    assert.equal(createHash("sha256").update(bytes).digest("hex"), original.sha256);
    assert.equal(slot.width, metadata.width);
    assert.equal(slot.height, metadata.height);
    assert.equal(slot.objectFit, "contain");
    assert.ok(slot.alt?.includes("Ink"));
  }
});

test("all products keep stable view order and unphotographed Paper stays pending", () => {
  for (const product of products) {
    const media = productMedia(product, "ink");
    assert.deepEqual(media.map((slot) => slot.id), [0, 1, 2, 3].map((view) => `${product.id}-ink-${view}`));
    assert.match(media[0].alt, /front view/);
    assert.match(media[1].alt, /back view/);
    assert.match(media[2].alt, /model wearing/);
    assert.match(media[3].alt, /close-up/);
    assert.deepEqual(product.images.map((slot) => slot.src), media.map((slot) => slot.src));
    if (product.colors.some((color) => color.id === "paper")) {
      assert.equal(productMedia(product, "paper").length, 4);
      assert.ok(productMedia(product, "paper").every((slot) => !slot.src));
    }
  }
});

test("missing secondary hero stays disabled and the optional Lookbook slot stays unpopulated", () => {
  assert.equal(imageSlots.heroBloom.id, "home-hero-bloom");
  assert.equal(imageSlots.heroBloom.src, undefined);
  assert.equal(imageSlots.heroDesktop.src, "/images/Frosted Silhouette in Minimal Light.png");
  assert.equal(lookbookSlots.find((slot) => slot.id === "lookbook-5")?.src, undefined);
  assert.equal(lookbookSlots.filter((slot) => slot.src).length, 5);
});

test("visually identified timestamped assets keep front, back, model and detail associations", () => {
  for (const [index, front, times] of [
    [2, "Floating Portal Graphic T-Shirt.png", ["04_37_47 PM-1", "04_37_51 PM-2", "04_37_54 PM-3"]],
    [4, "Suspended Staircase Daisy Tee.png", ["05_06_08 PM-1", "05_06_11 PM-2", "05_06_13 PM-3"]],
    [6, "Suspended Marble Orbit T-Shirt.png", ["05_44_54 PM-1", "05_44_56 PM-2", "05_44_58 PM-3"]],
  ]) {
    const media = productMedia(products[index]);
    assert.ok(decodeURIComponent(media[0].src).endsWith(front));
    times.forEach((time, i) => assert.ok(decodeURIComponent(media[i + 1].src).includes(time)));
  }
});

test("media uses exact color mappings, preserves empty arrays and falls back only when unmapped", () => {
  const base = { ...first, mediaByColor: { ink: first.images.slice(0, 2), paper: [] } };
  assert.equal(productMedia(base, "ink").length, 2);
  assert.deepEqual(productMedia(base, "paper"), []);
  assert.equal(productMedia(base, "unknown"), first.images);
  assert.equal(productMedia({ ...first, mediaByColor: undefined }), first.images);
});

test("gallery wrapping is safe for zero, one, two, four and six images", () => {
  for (const count of [0, 1, 2, 4, 6]) {
    assert.equal(galleryIndex(count, count), 0);
    assert.equal(galleryIndex(-1, count), count > 0 ? count - 1 : 0);
    assert.ok(Number.isFinite(galleryIndex(20, count)));
  }
});
test("ten unique, explicitly labeled sample objects with integer-paise prices", () => {
  assert.equal(products.length, 10);
  assert.equal(new Set(products.map((product) => product.id)).size, 10);
  assert.equal(new Set(products.map((product) => product.slug)).size, 10);
  for (const product of products) {
    assert.equal(product.displayStatus, "sample");
    assert.equal(product.availability, "demo-only");
    assert.ok(Number.isInteger(product.price) && product.price >= 250000);
    assert.equal(product.currency, "INR");
    assert.equal(product.images.length, 4);
  }
});
test("available size lists reflect actual variant availability", () => {
  for (const product of products) for (const size of sizes) assert.equal(product.availableSizes.includes(size), product.variants.some((variant) => variant.available && variant.size === size));
});
test("fit, size and title filters combine and empty states are correct", () => {
  assert.deepEqual(availableFits, ["Oversized", "Boxy", "Regular"]);
  assert.equal(filterProducts({ fit: "Boxy" }).length, 3);
  assert.equal(filterProducts({ q: "SIGNAL" }).length, 1);
  assert.equal(filterProducts({ q: "Signal", fit: "Boxy" }).length, 0);
  assert.equal(filterProducts({ q: "does not exist" }).length, 0);
  assert.equal(filterProducts({ fit: "Regular", size: "M" }).length, 3);
});
test("sorts use paise prices and alphabetical titles", () => {
  const prices = filterProducts({ sort: "price-asc" }).map((product) => product.price);
  assert.deepEqual(prices, [...prices].sort((a, b) => a - b));
  const names = filterProducts({ sort: "name-asc" }).map((product) => product.name);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  assert.deepEqual(filterProducts({ sort: "name-desc" }).map((product) => product.name), [...names].reverse());
});
test("unknown URL filter values normalize safely", () => {
  assert.deepEqual(normalizeQuery({ fit: "invented", size: "invalid", sort: "invalid" }), { q: "", fit: "", size: "", sort: "featured" });
  assert.equal(normalizeQuery({ q: "x".repeat(200) }).q.length, 100);
  assert.equal(catalogue.bySlug("unknown"), undefined);
});
test("cart retains exact size/color variants and merges only identical variants", () => {
  const result = addCartLine([], line);
  assert.equal(result.ok, true);
  assert.equal(resolveLine(result.lines[0]).variant.size, variant.size);
  assert.equal(resolveLine(result.lines[0]).color.id, variant.colorId);
  const merged = addCartLine(result.lines, { ...line, quantity: 1 });
  assert.equal(merged.lines[0].quantity, 3);
  const otherVariant = first.variants.find((item) => item.available && item.id !== variant.id);
  assert.equal(addCartLine(result.lines, { ...line, variantId: otherVariant.id }).lines.length, 2);
});
test("unavailable, mismatched and excessive additions are rejected", () => {
  assert.equal(addCartLine([], { ...line, variantId: first.variants.find((item) => !item.available).id }).ok, false);
  assert.equal(addCartLine([], { ...line, productId: products[1].id }).ok, false);
  for (const quantity of [0, -1, 1.5, Infinity, NaN, MAX_QUANTITY + 1]) assert.equal(addCartLine([], { ...line, quantity }).ok, false);
  assert.equal(addCartLine([{ ...line, quantity: MAX_QUANTITY }], line).ok, false);
});
test("rehydration rejects corrupt data and clamps oversized quantities", () => {
  assert.deepEqual(sanitizeLines(null), []);
  assert.deepEqual(sanitizeLines([null, "bad", {}, { ...line, quantity: -4 }, { ...line, quantity: Infinity }, { ...line, variantId: "unknown" }]), []);
  const restored = sanitizeLines([{ ...line, quantity: 999, price: 1 }, { ...line, variantId: "bad" }]);
  assert.deepEqual(restored, [{ ...line, quantity: MAX_QUANTITY }]);
  assert.equal(cartSubtotal(restored), first.price * MAX_QUANTITY);
});
test("subtotals use live catalogue prices and integer arithmetic", () => {
  const second = products[1];
  const secondLine = { productId: second.id, variantId: second.variants.find((item) => item.available).id, quantity: 3 };
  assert.equal(cartSubtotal([line, secondLine]), first.price * 2 + second.price * 3);
  assert.equal(cartSubtotal([]), 0);
  assert.equal(formatPrice(250000), "₹2,500");
  assert.equal(formatPrice(250050), "₹2,500.50");
});
