/**
 * Penyimpanan manifest media di Vercel Blob.
 *
 * Setiap simpan membuat file baru dengan nama unik (tidak menimpa), lalu versi
 * terbaru dicari lewat API list. Dengan begitu tidak ada masalah cache CDN yang basi.
 *
 * - content/draft-*      : hasil "Simpan draf" di admin.
 * - content/published-*  : hasil "Terbitkan". Build situs hanya membaca ini.
 */
import type { BlobClient, BlobItem } from "./blob.ts";
import { validateManifest, type MediaManifest } from "./media.ts";

export const DRAFT_PREFIX = "content/draft-";
export const PUBLISHED_PREFIX = "content/published-";
export const MEDIA_PREFIX = "media/";

/** Jumlah versi lama yang disimpan per jenis. File media yang dipakai versi ini tidak dihapus. */
const KEEP_VERSIONS = 10;

function newestFirst(items: BlobItem[]): BlobItem[] {
  return [...items].sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt));
}

async function readManifest(item: BlobItem): Promise<MediaManifest> {
  const response = await fetch(item.url);
  if (!response.ok) throw new Error(`Gagal membaca ${item.pathname}: HTTP ${response.status}`);
  const result = validateManifest(await response.json());
  if (!result.ok) throw new Error(`${item.pathname} tidak valid: ${result.errors.join(" ")}`);
  return result.manifest;
}

/** Manifest terbaru dengan awalan tertentu, atau null kalau belum ada. */
export async function loadLatest(client: BlobClient, prefix: string): Promise<MediaManifest | null> {
  const [latest] = newestFirst(await client.list(prefix));
  return latest ? readManifest(latest) : null;
}

/** Semua versi yang masih disimpan (dipakai saat membersihkan file media). */
export async function loadAllVersions(client: BlobClient, prefix: string): Promise<MediaManifest[]> {
  const items = newestFirst(await client.list(prefix));
  return Promise.all(items.map(readManifest));
}

/** Simpan manifest sebagai versi baru, lalu hapus versi yang lebih lama dari batas simpan. */
export async function saveVersion(client: BlobClient, prefix: string, manifest: MediaManifest): Promise<MediaManifest> {
  const saved: MediaManifest = { ...manifest, updatedAt: new Date().toISOString() };
  await client.put(`${prefix}${Date.now()}.json`, JSON.stringify(saved, null, 2), {
    contentType: "application/json",
    addRandomSuffix: true,
    cacheControlMaxAge: 31536000,
  });
  const old = newestFirst(await client.list(prefix)).slice(KEEP_VERSIONS);
  await client.del(old.map((item) => item.url));
  return saved;
}
