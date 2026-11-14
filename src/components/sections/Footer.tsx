import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/icons";

const linkClass =
  "inline-flex min-h-11 items-center gap-2 text-caption-lg text-white underline-offset-4 transition-colors duration-150 hover:underline";

export function Footer() {
  const { instagram, tiktok } = siteConfig.social;

  return (
    <footer className="bg-ink text-white">
      <Container className="py-14 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-[420px]">
            <p className="font-heading text-[18px] font-bold text-white">{siteConfig.brandName}</p>
            <p className="mt-2 text-caption-lg text-on-ink-soft">{siteConfig.tagline}</p>
          </div>

          <nav aria-label="Tautan footer">
            <ul className="flex flex-col gap-1">
              <li>
                <Link href="/syarat/" className={linkClass}>
                  Syarat pemesanan
                </Link>
              </li>
              <li>
                <WhatsAppLink location="footer" className={linkClass}>
                  <WhatsAppIcon size={18} />
                  WhatsApp
                </WhatsAppLink>
              </li>
              {instagram ? (
                <li>
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <InstagramIcon size={18} />
                    Instagram
                  </a>
                </li>
              ) : null}
              {tiktok ? (
                <li>
                  <a href={tiktok} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <TikTokIcon size={18} />
                    TikTok
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-ink-soft pt-6 text-caption text-on-ink-soft">
          © {new Date().getFullYear()} {siteConfig.brandName}
        </p>
      </Container>
    </footer>
  );
}
