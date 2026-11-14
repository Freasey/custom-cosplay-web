import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { siteConfig, siteUrl } from "@/config/site";
import { homeTitle, pageMetadata, siteDescription } from "@/content/seo";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";
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
      <body className="antialiased">
        <a
          href="#isi"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-primary focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
        >
          Langsung ke isi
        </a>
        <Header />
        <main id="isi">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <Analytics />
      </body>
    </html>
  );
}
