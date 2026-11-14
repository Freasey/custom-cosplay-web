import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Teks metadata dari docs/seo.md. */
export const homeTitle = `Jasa Custom Cosplay: Kostum, Armor, dan Props | ${siteConfig.brandName}`;

export const siteDescription =
  "Pesan kostum cosplay custom sesuai karakter pilihanmu. Kirim referensi dan ukuran, kami kabari harga dan estimasi pengerjaan lewat WhatsApp. Kirim ke seluruh Indonesia.";

export const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.brandName}: jasa custom cosplay untuk kostum kain, armor, dan props`,
};

type PageMetaInput = {
  /** Judul lengkap, sudah termasuk nama brand. */
  title: string;
  description: string;
  /** Path dengan garis miring di akhir, contoh "/syarat/". */
  path: string;
};

/**
 * Metadata lengkap satu halaman: title, description, canonical, Open Graph, Twitter.
 * Next.js mengganti objek openGraph dan twitter secara utuh per halaman,
 * jadi setiap halaman memakai helper ini supaya tidak ada field yang hilang.
 */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName: siteConfig.brandName,
      url: path,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
