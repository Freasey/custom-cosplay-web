import { Analytics } from "@/components/Analytics";
import { SiteChrome } from "@/components/sections/SiteChrome";

/** Layout halaman publik: header, footer, tombol WhatsApp melayang, dan analytics. */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteChrome>{children}</SiteChrome>
      <Analytics />
    </>
  );
}
