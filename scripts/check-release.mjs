// Pemeriksaan sebelum rilis (docs/deploy.md). Jalankan setelah `npm run build`.
// Gagal (exit 1) kalau masih ada placeholder di hasil build.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const patterns = [
  { re: /\[NAMA BRAND\]/, msg: "brandName belum diisi" },
  { re: /\[DOMAIN\]|https:\/\/example\.com/, msg: "domain belum diisi" },
  { re: /\[NOMOR WHATSAPP\]|wa\.me\/\?text=/, msg: "whatsappNumber belum diisi" },
  { re: /\[HARGA\]/, msg: "placeholder [HARGA] masih tampil" },
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let files;
try {
  files = walk(OUT).filter((f) => /\.(html|txt|xml)$/.test(f));
} catch {
  console.error("Folder out/ tidak ada. Jalankan `npm run build` dulu.");
  process.exit(1);
}

const problems = new Map();
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const { re, msg } of patterns) {
    if (re.test(text)) problems.set(msg, [...(problems.get(msg) ?? []), file]);
  }
}

if (problems.size === 0) {
  console.log("OK: tidak ada placeholder tersisa di out/.");
  console.log("Cek manual sisanya: badge gambar, tautan WA di HP, Lighthouse (docs/deploy.md).");
  process.exit(0);
}

console.error("Belum siap rilis:");
for (const [msg, list] of problems) {
  console.error(`- ${msg} (${list.length} file, contoh: ${list[0]})`);
}
console.error("Isi nilainya di src/config/site.ts lalu build ulang.");
process.exit(1);
