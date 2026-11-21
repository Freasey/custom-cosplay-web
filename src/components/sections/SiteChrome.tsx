import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { FloatingWhatsApp } from "@/components/sections/FloatingWhatsApp";

/** Kerangka halaman publik. Dipakai layout (site) dan halaman 404. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
