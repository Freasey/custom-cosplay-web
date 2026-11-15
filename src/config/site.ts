/**
 * Konfigurasi situs. Semua nilai yang belum final dibaca dari sini.
 *
 * Nilai dalam kurung siku, misalnya "[NAMA BRAND]", adalah placeholder.
 * Ganti dengan nilai asli sebelum rilis (lihat docs/deploy.md, "Sebelum rilis").
 */

export type ServiceKey = "kain" | "armor" | "props";

export type SiteConfig = {
  /** Nama brand, tampil di header, footer, judul halaman, dan metadata. */
  brandName: string;
  /** Satu kalimat deskripsi brand untuk footer. */
  tagline: string;
  /** Domain tanpa protokol, contoh: "namabrand.com". */
  domain: string;
  /** Nomor WhatsApp format internasional tanpa plus, contoh: "6281234567890". */
  whatsappNumber: string;
  /** Pesan awal yang otomatis terisi saat chat WhatsApp dibuka. */
  whatsappMessage: string;
  /**
   * Harga mulai per layanan dalam rupiah, contoh: 350000.
   * Keputusan pemilik: harga tidak ditampilkan dulu, jadi biarkan null.
   * Kartu layanan akan menampilkan "Harga dibahas saat konsultasi".
   */
  startingPrices: Record<ServiceKey, number | null>;
  /** URL lengkap akun media sosial. Kosongkan ("") untuk menyembunyikan. */
  social: {
    instagram: string;
    tiktok: string;
  };
};

export const siteConfig: SiteConfig = {
  brandName: "Cospwork Id",
  tagline:
    "Jasa custom cosplay untuk kostum kain, armor, dan props. Konsultasi dan pemesanan lewat WhatsApp.",
  domain: "cosp.worksell.id",
  whatsappNumber: "6281717812783",
  whatsappMessage:
    "Halo, saya mau tanya custom cosplay. Karakter: ... Tanggal dipakai: ...",
  startingPrices: {
    kain: null,
    armor: null,
    props: null,
  },
  social: {
    instagram: "",
    tiktok: "",
  },
};

/** True kalau nilai masih berupa placeholder seperti "[DOMAIN]" atau kosong. */
export function isPlaceholder(value: string): boolean {
  return value.trim() === "" || /^\[.*\]$/.test(value.trim());
}

/**
 * URL dasar situs, dipakai untuk canonical, sitemap, robots, dan Open Graph.
 * Selama domain belum diisi, memakai example.com supaya build tetap jalan.
 */
export const siteUrl = isPlaceholder(siteConfig.domain)
  ? "https://example.com"
  : `https://${siteConfig.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
