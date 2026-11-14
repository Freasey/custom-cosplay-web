import type { ServiceKey } from "@/config/site";

/**
 * `real`: foto asli hasil produksi, badge "Foto hasil asli".
 * `concept`: gambar buatan AI, badge "Ilustrasi konsep".
 * Badge ditentukan dari field ini, jangan ditulis manual di komponen.
 */
export type ImageKind = "real" | "concept";

export type GalleryImage = {
  /** Path di folder public, contoh: "/images/armor-ksatria-biru-konsep.webp". */
  src: string;
  /** Deskripsi isi gambar. Untuk `concept`, awalan "Ilustrasi konsep" ditambahkan otomatis. */
  alt: string;
  category: ServiceKey;
  kind: ImageKind;
  /** Ukuran asli file dalam piksel. Rasio tampilan galeri 4:5. */
  width: number;
  height: number;
};

/**
 * Gambar utama hero. Isi null selama belum ada gambar:
 * hero menampilkan kotak gambar kosong.
 *
 * Contoh:
 * {
 *   src: "/images/hero-armor-perak-konsep.webp",
 *   alt: "Armor perak dengan detail ukiran dipasang di manekin, latar abu polos",
 *   category: "armor",
 *   kind: "concept",
 *   width: 1200,
 *   height: 1500,
 * }
 */
export const heroImage: GalleryImage | null = null;

/**
 * Isi galeri #contoh. Selama kosong, galeri menampilkan kotak gambar kosong
 * per kategori. Foto `real` otomatis tampil lebih dulu daripada `concept`.
 */
export const gallery: GalleryImage[] = [];

const CONCEPT_PREFIX = "Ilustrasi konsep";

/** Alt yang dipakai di halaman. Ilustrasi selalu diawali "Ilustrasi konsep". */
export function imageAlt(image: GalleryImage): string {
  if (image.kind !== "concept") return image.alt;
  if (image.alt.toLowerCase().startsWith(CONCEPT_PREFIX.toLowerCase())) return image.alt;
  return `${CONCEPT_PREFIX}: ${image.alt.charAt(0).toLowerCase()}${image.alt.slice(1)}`;
}

/** Foto asli dulu, lalu ilustrasi. Urutan dalam tiap jenis dipertahankan. */
export function sortedGallery(images: GalleryImage[] = gallery): GalleryImage[] {
  return [...images.filter((i) => i.kind === "real"), ...images.filter((i) => i.kind === "concept")];
}
