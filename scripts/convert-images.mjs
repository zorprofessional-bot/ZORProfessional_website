// Optimizacija statičnih slika u /public za brže učitavanje.
//
// Što radi:
//  1) Briše neiskorištene izvorne PNG-ove.
//  2) Sve korištene foto-PNG-ove (deck, production-line) i wordmark pretvara u
//     WebP, uz smanjenje na max 2048px širine (pokriva sve Next deviceSizes).
//  3) Favicon/app-icon (brand/zor-icon.png) ostaje PNG, ali se smanjuje s
//     1024x1024 na 256x256 radi manje datoteke i Apple touch-icon kompatibilnosti.
//
// Pokretanje:  npm run images:convert
import { readdir, stat, unlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const MAX_WIDTH = 2048;
const PHOTO_QUALITY = 80;
const WORDMARK_QUALITY = 90;

// Izvorne slike koje nigdje nisu referencirane u kodu — uklanjamo ih.
const unused = [
  "visuals/hero-paper.png",
  "visuals/product-range.png",
  "visuals/calculator-preview.png",
  "visuals/careers-workspace.png",
  "visuals/deck/calculator-intro.png",
  "visuals/deck/calculator-result.png",
  "visuals/deck/careers-training.png",
  "brand/zor-logo.png",
];

async function fileSize(p) {
  try {
    return (await stat(p)).size;
  } catch {
    return 0;
  }
}

const fmt = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

async function toWebp(srcRel, { quality = PHOTO_QUALITY } = {}) {
  const src = path.join(publicDir, srcRel);
  if (!existsSync(src)) {
    console.warn(`skip (missing): ${srcRel}`);
    return;
  }

  const dest = src.replace(/\.png$/i, ".webp");
  const before = await fileSize(src);

  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(dest);

  const after = await fileSize(dest);
  await unlink(src);
  console.log(`webp  ${srcRel}  ${fmt(before)} -> ${fmt(after)}`);
}

async function main() {
  // 1) Brisanje neiskorištenih izvornika.
  for (const rel of unused) {
    const p = path.join(publicDir, rel);
    if (existsSync(p)) {
      await unlink(p);
      console.log(`del   ${rel}`);
    }
  }

  // 2) Svi preostali PNG-ovi u deck mapi -> WebP.
  const deckDir = path.join(publicDir, "visuals", "deck");
  const deckFiles = (await readdir(deckDir)).filter((f) =>
    f.toLowerCase().endsWith(".png"),
  );
  for (const f of deckFiles) {
    await toWebp(path.join("visuals", "deck", f));
  }

  // 3) Ostale korištene samostalne slike.
  await toWebp("visuals/production-line.png");

  // 4) Wordmark (vektorski tip slova -> viša kvaliteta, zadržava alfu).
  await toWebp("brand/zor-wordmark.png", { quality: WORDMARK_QUALITY });

  // 5) Favicon/app-icon: ostaje PNG, smanjen na 256x256.
  const icon = path.join(publicDir, "brand", "zor-icon.png");
  if (existsSync(icon)) {
    const before = await fileSize(icon);
    const buf = await sharp(icon)
      .resize(256, 256, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(icon, buf);
    const after = await fileSize(icon);
    console.log(`icon  brand/zor-icon.png  ${fmt(before)} -> ${fmt(after)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
