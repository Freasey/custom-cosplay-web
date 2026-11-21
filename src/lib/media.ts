/**
 * Skema data media (logo, hero, galeri) yang dikelola lewat halaman admin.
 *
 * File ini dipakai bersama oleh situs (Next.js), Worker admin, dan skrip build,
 * jadi hanya boleh berisi TypeScript murni tanpa import dari Next atau Node.
 * Import antar file di src/lib memakai akhiran .ts supaya bisa dijalankan langsung oleh Node.
 */

export const SERVICE_KEYS = ["kain", "armor", "props"] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

/**
 * `real`: foto asli hasil produksi, badge "Foto hasil asli".
 * `concept`: gambar buatan AI, badge "Ilustrasi konsep".
 * Badge ditentukan dari field ini, jangan ditulis manual di komponen.
 */
export const IMAGE_KINDS = ["concept", "real"] as const;
export type ImageKind = (typeof IMAGE_KINDS)[number];

export type GalleryImage = {
  /** URL gambar (Vercel Blob) atau path lokal yang diawali "/". */
  src: string;
  /** Deskripsi isi gambar. Untuk `concept`, awalan "Ilustrasi konsep" ditambahkan otomatis. */
  alt: string;
  category: ServiceKey;
  kind: ImageKind;
  /** Ukuran asli file dalam piksel. */
  width: number;
  height: number;
};

export type LogoImage = { src: string; width: number; height: number };

export type MediaManifest = {
  version: 1;
  /** Waktu terakhir disimpan (ISO 8601). */
  updatedAt: string;
  logo: LogoImage;
  hero: {
    /** Gambar utama hero, sekaligus poster video. null: hero menampilkan kotak kosong. */
    image: GalleryImage | null;
    /** Video hero tanpa suara (mp4). Hanya dipakai kalau `image` ada. */
    videoSrc: string | null;
  };
  /** Isi galeri. Foto `real` otomatis tampil lebih dulu daripada `concept`. */
  gallery: GalleryImage[];
};

export const ALT_MIN = 10;
export const ALT_MAX = 200;
export const GALLERY_MAX = 60;

const CONCEPT_PREFIX = "Ilustrasi konsep";

/** Alt yang dipakai di halaman. Ilustrasi selalu diawali "Ilustrasi konsep". */
export function imageAlt(image: Pick<GalleryImage, "alt" | "kind">): string {
  if (image.kind !== "concept") return image.alt;
  if (image.alt.toLowerCase().startsWith(CONCEPT_PREFIX.toLowerCase())) return image.alt;
  return `${CONCEPT_PREFIX}: ${image.alt.charAt(0).toLowerCase()}${image.alt.slice(1)}`;
}

/** Foto asli dulu, lalu ilustrasi. Urutan dalam tiap jenis dipertahankan. */
export function sortedGallery(images: GalleryImage[]): GalleryImage[] {
  return [...images.filter((i) => i.kind === "real"), ...images.filter((i) => i.kind === "concept")];
}

/** Semua URL file yang dipakai sebuah manifest. Dipakai untuk membersihkan file yatim. */
export function referencedUrls(manifest: MediaManifest): string[] {
  const urls = [manifest.logo.src, ...manifest.gallery.map((i) => i.src)];
  if (manifest.hero.image) urls.push(manifest.hero.image.src);
  if (manifest.hero.videoSrc) urls.push(manifest.hero.videoSrc);
  return urls;
}

/** Isi manifest tanpa `updatedAt`, untuk membandingkan draf dengan versi terbit. */
export function manifestFingerprint(manifest: MediaManifest): string {
  const { updatedAt: _ignored, ...rest } = manifest;
  void _ignored;
  return JSON.stringify(rest);
}

const BLOB_HOST = /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/;

/** URL yang boleh dipakai sebagai sumber media: Vercel Blob publik atau path lokal. */
export function isAllowedMediaUrl(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && BLOB_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

type Result = { ok: true; manifest: MediaManifest } | { ok: false; errors: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDimension(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 6000;
}

function checkImage(value: unknown, label: string, errors: string[]): GalleryImage | null {
  if (!isRecord(value)) {
    errors.push(`${label}: data tidak valid.`);
    return null;
  }
  const { src, alt, category, kind, width, height } = value;
  const start = errors.length;
  if (typeof src !== "string" || !isAllowedMediaUrl(src)) errors.push(`${label}: alamat file tidak valid.`);
  if (typeof alt !== "string") {
    errors.push(`${label}: teks alt wajib diisi.`);
  } else {
    const trimmed = alt.trim();
    if (trimmed.length < ALT_MIN) errors.push(`${label}: teks alt minimal ${ALT_MIN} karakter.`);
    if (trimmed.length > ALT_MAX) errors.push(`${label}: teks alt maksimal ${ALT_MAX} karakter.`);
    if (/[\u2014\u2013]/.test(trimmed)) errors.push(`${label}: teks alt tidak boleh memakai tanda pisah panjang.`);
  }
  if (!SERVICE_KEYS.includes(category as ServiceKey)) errors.push(`${label}: kategori tidak valid.`);
  if (!IMAGE_KINDS.includes(kind as ImageKind)) errors.push(`${label}: jenis gambar tidak valid.`);
  if (!isDimension(width) || !isDimension(height)) errors.push(`${label}: ukuran gambar tidak valid.`);
  if (errors.length > start) return null;
  return {
    src: src as string,
    alt: (alt as string).trim(),
    category: category as ServiceKey,
    kind: kind as ImageKind,
    width: width as number,
    height: height as number,
  };
}

/**
 * Memeriksa manifest dari luar (unggahan admin, file di Blob).
 * Mengembalikan salinan bersih, atau daftar kesalahan dalam bahasa Indonesia.
 */
export function validateManifest(input: unknown): Result {
  const errors: string[] = [];
  if (!isRecord(input) || input.version !== 1) return { ok: false, errors: ["Format data media tidak dikenal."] };

  const logo = input.logo;
  let cleanLogo: LogoImage | null = null;
  if (
    isRecord(logo) &&
    typeof logo.src === "string" &&
    isAllowedMediaUrl(logo.src) &&
    isDimension(logo.width) &&
    isDimension(logo.height)
  ) {
    cleanLogo = { src: logo.src, width: logo.width, height: logo.height };
  } else {
    errors.push("Logo: data tidak valid.");
  }

  const hero = input.hero;
  let heroImage: GalleryImage | null = null;
  let videoSrc: string | null = null;
  if (!isRecord(hero)) {
    errors.push("Hero: data tidak valid.");
  } else {
    if (hero.image !== null) heroImage = checkImage(hero.image, "Gambar hero", errors);
    if (hero.videoSrc !== null) {
      if (typeof hero.videoSrc !== "string" || !isAllowedMediaUrl(hero.videoSrc)) {
        errors.push("Video hero: alamat file tidak valid.");
      } else if (hero.image === null) {
        errors.push("Video hero butuh gambar hero sebagai poster.");
      } else {
        videoSrc = hero.videoSrc;
      }
    }
  }

  const gallery: GalleryImage[] = [];
  if (!Array.isArray(input.gallery)) {
    errors.push("Galeri: data tidak valid.");
  } else {
    if (input.gallery.length > GALLERY_MAX) errors.push(`Galeri maksimal ${GALLERY_MAX} gambar.`);
    input.gallery.forEach((item, index) => {
      const image = checkImage(item, `Galeri #${index + 1}`, errors);
      if (image) gallery.push(image);
    });
  }

  if (errors.length > 0 || !cleanLogo) return { ok: false, errors };
  return {
    ok: true,
    manifest: {
      version: 1,
      updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString(),
      logo: cleanLogo,
      hero: { image: heroImage, videoSrc },
      gallery,
    },
  };
}
