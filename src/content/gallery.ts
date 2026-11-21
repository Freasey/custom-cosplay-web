import { validateManifest, type GalleryImage, type LogoImage } from "@/lib/media";
import data from "./media.json";

export type { GalleryImage, ImageKind } from "@/lib/media";
export { imageAlt, sortedGallery } from "@/lib/media";

/**
 * Data media situs: logo, hero, dan galeri.
 *
 * Sumber aslinya ada di Vercel Blob dan dikelola lewat halaman /admin.
 * File media.json adalah salinan versi terbit yang diambil `scripts/pull-media.ts`
 * sebelum build, jadi semua gambar sudah tertanam di HTML statis (aman untuk SEO).
 * Jangan mengedit media.json manual kecuali untuk darurat: build berikutnya akan menimpanya.
 */
const result = validateManifest(data);
if (!result.ok) {
  throw new Error(`src/content/media.json tidak valid:\n- ${result.errors.join("\n- ")}`);
}
const manifest = result.manifest;

export const logo: LogoImage = manifest.logo;

/**
 * Gambar utama hero, sekaligus poster video. null: hero menampilkan kotak gambar kosong.
 */
export const heroImage: GalleryImage | null = manifest.hero.image;

/** Video hero (tanpa suara, berulang). null: hanya gambar. */
export const heroVideoSrc: string | null = manifest.hero.videoSrc;

/** Isi galeri #contoh. Kalau kosong, galeri menampilkan kotak gambar kosong per kategori. */
export const gallery: GalleryImage[] = manifest.gallery;

/** Origin file media dari luar situs (Vercel Blob), untuk preconnect. null kalau semuanya lokal. */
export const mediaOrigin: string | null = (() => {
  const remote = [logo.src, heroImage?.src, heroVideoSrc, ...gallery.map((i) => i.src)].find(
    (src) => src?.startsWith("https://"),
  );
  return remote ? new URL(remote).origin : null;
})();
