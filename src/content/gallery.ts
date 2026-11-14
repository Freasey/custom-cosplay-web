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
 * Gambar utama hero. Isi null kalau belum ada gambar:
 * hero menampilkan kotak gambar kosong.
 * Sumber: frame depan dari video yang dikirim pemilik (720p).
 */
export const heroImage: GalleryImage | null = {
  src: "/images/hero-armor-perak-jubah-hitam-konsep.webp",
  alt: "Armor perak berukir dengan jubah hitam, dipasang di manekin, latar abu polos",
  category: "armor",
  kind: "concept",
  width: 600,
  height: 720,
};

/**
 * Isi galeri #contoh. Kalau kosong, galeri menampilkan kotak gambar kosong
 * per kategori. Foto `real` otomatis tampil lebih dulu daripada `concept`.
 */
export const gallery: GalleryImage[] = [
  {
    src: "/images/kostum-seragam-akademi-biru-tua-konsep.webp",
    alt: "Seragam akademi biru tua dengan jubah bahu pendek dan rok lipit, di manekin",
    category: "kain",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/armor-ksatria-hitam-emas-konsep.webp",
    alt: "Armor ksatria hitam dengan tepi emas, di manekin",
    category: "armor",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/props-pedang-besar-perak-konsep.webp",
    alt: "Props pedang besar perak dengan permata biru, di atas dudukan",
    category: "props",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/kostum-gaun-penyihir-ungu-konsep.webp",
    alt: "Gaun penyihir ungu berlapis dengan sulaman emas, di manekin",
    category: "kain",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/armor-helm-pelindung-bahu-perunggu-konsep.webp",
    alt: "Helm dan pelindung bahu warna perunggu, di manekin setengah badan",
    category: "armor",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/props-tongkat-sihir-kristal-konsep.webp",
    alt: "Props tongkat sihir dengan kristal toska, di atas dudukan",
    category: "props",
    kind: "concept",
    width: 896,
    height: 1200,
  },
  {
    src: "/images/kostum-jubah-pengelana-hijau-konsep.webp",
    alt: "Jubah pengelana hijau dengan tunik krem dan sabuk kulit, di manekin",
    category: "kain",
    kind: "concept",
    width: 896,
    height: 1200,
  },
];

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
