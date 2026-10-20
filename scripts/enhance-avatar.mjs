import fs from "node:fs";
import sharp from "sharp";

const input = process.argv[2] || "public/garden/aya-avatar-choice-original.png";
const target = "public/garden/aya-avatar-choice";
const metadata = await sharp(input).metadata();
if (input.replaceAll('\\','/') !== `${target}-original.png`) fs.copyFileSync(input, `${target}-original.png`);
for (const width of [480, 960, 1600]) {
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(`${target}-${width}.webp`);
}
const manifest = JSON.parse(
  fs.readFileSync("public/garden/manifest.json", "utf8"),
);
const item = {
  id: "aya-avatar-choice",
  url: "/garden/aya-avatar-choice-960.webp",
  original: "/garden/aya-avatar-choice-original.png",
  width: metadata.width,
  height: metadata.height,
  type: "upload",
  caption: "小天选用的原始头像 · 用户提供，未重绘",
  projectId: "",
};
fs.writeFileSync(
  "public/garden/manifest.json",
  JSON.stringify([...manifest.filter((m) => m.id !== item.id), item], null, 2) +
    "\n",
);
console.log("Original avatar retained; responsive WebP sizes prepared.");
