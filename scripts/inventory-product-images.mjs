import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/images");
const output = path.resolve("product-image-artifacts");
await mkdir(output, { recursive: true });
const inventory = [];
const folders = (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory());
for (const folder of folders) {
  const files = [];
  for (const file of await readdir(path.join(root, folder.name))) {
    const source = path.join(root, folder.name, file);
    const buffer = await readFile(source);
    const metadata = await sharp(buffer).metadata();
    files.push({ file, src: `/images/${folder.name}/${file}`, width: metadata.width, height: metadata.height, format: metadata.format, bytes: buffer.length, sha256: createHash("sha256").update(buffer).digest("hex") });
  }
  inventory.push({ folder: folder.name, files });
}
await writeFile(path.join(output, "inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
for (let group = 0; group < Math.ceil(inventory.length / 5); group++) {
  const rows = inventory.slice(group * 5, group * 5 + 5);
  const layers = [];
  for (let row = 0; row < rows.length; row++) {
    for (let column = 0; column < rows[row].files.length; column++) {
      const file = rows[row].files[column];
      const thumbnail = await sharp(path.join("public", file.src)).resize(320, 440, { fit: "contain", background: "#dddddd" }).png().toBuffer();
      layers.push({ input: thumbnail, left: column * 320, top: row * 480 + 40 });
      const label = `${rows[row].folder} / ${column + 1} (${file.width}x${file.height})`;
      layers.push({ input: Buffer.from(`<svg width="320" height="40"><rect width="320" height="40" fill="white"/><text x="8" y="25" font-size="15" font-family="Arial">${label}</text></svg>`), left: column * 320, top: row * 480 });
    }
  }
  await sharp({ create: { width: 1280, height: rows.length * 480, channels: 3, background: "white" } }).composite(layers).png().toFile(path.join(output, `inventory-contact-sheet-${group + 1}.png`));
}
console.log(JSON.stringify(inventory.map(({ folder, files }) => ({ folder, files: files.map(({ file, width, height }) => ({ file, width, height })) })), null, 2));
