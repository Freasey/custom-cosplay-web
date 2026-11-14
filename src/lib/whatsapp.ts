import { isPlaceholder, siteConfig } from "@/config/site";

/** Lokasi tombol WhatsApp, dipakai sebagai parameter event `whatsapp_click`. */
export type WhatsAppLocation =
  | "header"
  | "hero"
  | "layanan"
  | "siapkan"
  | "faq"
  | "penutup"
  | "melayang"
  | "syarat"
  | "footer";

/**
 * Membuat tautan https://wa.me/<nomor>?text=<pesan> dari konfigurasi.
 * `context` menambahkan keterangan ke pesan awal, misalnya nama layanan.
 */
export function whatsappUrl(context?: string): string {
  const base = siteConfig.whatsappMessage;
  const message = context
    ? base.replace("custom cosplay.", `custom cosplay (${context}).`)
    : base;
  const text = encodeURIComponent(message);
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");

  // Selama nomor belum diisi, wa.me tanpa nomor tetap membuka WhatsApp
  // dengan pesan terisi, jadi tombol bisa diuji tanpa nomor asli.
  if (isPlaceholder(siteConfig.whatsappNumber) || number === "") {
    return `https://wa.me/?text=${text}`;
  }
  return `https://wa.me/${number}?text=${text}`;
}
