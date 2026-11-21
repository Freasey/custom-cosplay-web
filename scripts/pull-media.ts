// Dijalankan otomatis sebelum `npm run build` (script "prebuild").
//
// Mengambil data media versi terbit dari Vercel Blob dan menulisnya ke src/content/media.json,
// supaya galeri dan hero tertanam langsung di HTML statis. Tidak ada gambar yang dimuat lewat
// JavaScript di browser, jadi mesin pencari selalu melihat isi lengkap.
//
// - BLOB_READ_WRITE_TOKEN kosong: memakai media.json yang ada di repo (untuk build lokal).
// - Token ada tapi pengambilan gagal, data tidak valid, atau ada file yang tidak bisa dibuka:
//   build DIHENTIKAN. Situs yang sedang tayang tetap versi lama, tidak pernah tayang dengan galeri rusak.
import { writeFileSync } from "node:fs";
import { createBlobClient } from "../src/lib/blob.ts";
import { referencedUrls } from "../src/lib/media.ts";
import { PUBLISHED_PREFIX, loadLatest } from "../src/lib/media-store.ts";

const OUTPUT = "src/content/media.json";
const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

function fail(message: string): never {
  console.error(`\n[pull-media] GAGAL: ${message}\n`);
  process.exit(1);
}

if (!token) {
  console.warn(`[pull-media] BLOB_READ_WRITE_TOKEN kosong: memakai ${OUTPUT} dari repo.`);
  process.exit(0);
}

const client = createBlobClient(token);

let manifest;
try {
  manifest = await loadLatest(client, PUBLISHED_PREFIX);
} catch (error) {
  fail(`tidak bisa membaca data media dari Vercel Blob. ${(error as Error).message}`);
}
if (!manifest) fail("belum ada data media yang diterbitkan. Buka /admin lalu tekan Terbitkan.");

// Pastikan setiap file benar-benar bisa dibuka sebelum situs dibangun.
const remote = [...new Set(referencedUrls(manifest))].filter((url) => url.startsWith("https://"));
const broken: string[] = [];
await Promise.all(
  remote.map(async (url) => {
    const response = await fetch(url, { method: "HEAD" }).catch(() => null);
    if (!response?.ok) broken.push(`${url} (${response ? `HTTP ${response.status}` : "tidak terjangkau"})`);
  }),
);
if (broken.length > 0) fail(`file media tidak bisa dibuka:\n- ${broken.join("\n- ")}`);

writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  `[pull-media] OK: versi terbit ${manifest.updatedAt}, ${manifest.gallery.length} gambar galeri, ${remote.length} file dicek.`,
);
