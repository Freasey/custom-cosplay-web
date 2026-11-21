import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { siteConfig, siteUrl } from "@/config/site";
import { homeTitle, pageMetadata, siteDescription } from "@/content/seo";
import { mediaOrigin } from "@/content/gallery";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteConfig.brandName,
  formatDetection: { telephone: false },
  ...pageMetadata({ title: homeTitle, description: siteDescription, path: "/" }),
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sora.variable} ${jakarta.variable}`}>
      <head>
        {/* Gambar dan video disimpan di Vercel Blob: sambungan dibuka lebih awal supaya hero cepat tampil. */}
        {mediaOrigin ? <link rel="preconnect" href={mediaOrigin} /> : null}
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
