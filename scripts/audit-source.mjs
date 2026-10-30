import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const files = [];
function walk(directory) { for (const entry of readdirSync(directory, { withFileTypes: true })) { const file = join(directory, entry.name); if (entry.isDirectory()) walk(file); else files.push(file); } }
walk(join(root, "src"));
for (const file of files.filter((file) => /\.(ts|tsx)$/.test(file))) {
  const code = readFileSync(file, "utf8");
  for (const [, specifier] of code.matchAll(/(?:from\s+|import\s*)["']([^"']+)["']/g)) {
    if (!specifier.startsWith("@/") && !specifier.startsWith(".")) continue;
    const target = specifier.startsWith("@/") ? join(root, "src", specifier.slice(2)) : resolve(dirname(file), specifier);
    assert.ok([target, `${target}.ts`, `${target}.tsx`, `${target}.css`, join(target, "index.ts"), join(target, "index.tsx")].some(existsSync), `Missing local import: ${file} -> ${specifier}`);
  }
}
console.log(`PASS: local imports resolve in ${files.filter((file) => /\.(ts|tsx)$/.test(file)).length} TypeScript source files`);
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
assert.ok(!Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).some((name) => /shopify/i.test(name)));
console.log("PASS: no Shopify dependencies");
const css = readFileSync("src/app/globals.css", "utf8");
const tokens = Object.fromEntries([...css.matchAll(/--(ink|paper|surface|muted|acid):\s*(#[\da-f]{6})/gi)].map(([, name, value]) => [name, value]));
function luminance(hex) { const [r, g, b] = hex.slice(1).match(/../g).map((part) => { const value = parseInt(part, 16) / 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; }); return .2126 * r + .7152 * g + .0722 * b; }
function contrast(a, b) { const values = [luminance(a), luminance(b)].sort((a, b) => b - a); return (values[0] + .05) / (values[1] + .05); }
const frame = css.match(/--placeholder-background:\s*(#[\da-f]{6})/i)[1];
const frameText = css.match(/--placeholder-text:\s*(#[\da-f]{6})/i)[1];
const editorial = css.match(/--editorial:\s*(#[\da-f]{6})/i)[1];
const inverseText = css.match(/--inverse-text:\s*(#[\da-f]{6})/i)[1];
for (const [label, foreground, background] of [["Ink on paper", tokens.ink, tokens.paper], ["Muted on paper", tokens.muted, tokens.paper], ["Ink on acid", tokens.ink, tokens.acid], ["Muted on secondary surface", tokens.muted, tokens.surface], ["Placeholder labels", frameText, frame], ["Story body", inverseText, editorial]]) {
  const ratio = contrast(foreground, background);
  console.log(`${ratio >= 4.5 ? "PASS" : "FAIL"}: ${label} ${ratio.toFixed(2)}:1`);
  assert.ok(ratio >= 4.5, `${label} needs 4.5:1 contrast`);
}
console.log("Static checks passed. These checks do not replace TypeScript, ESLint or a browser accessibility audit.");
