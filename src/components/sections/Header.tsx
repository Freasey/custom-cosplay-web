import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { WhatsAppIcon } from "@/components/ui/icons";

const navLinks = [
  { href: "/#cara-pesan", label: "Cara pesan" },
  { href: "/#layanan", label: "Layanan" },
  { href: "/#harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-surface">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-2.5 font-heading text-[18px] font-bold text-ink"
        >
          <Image
            src="/images/logo-cospwork.webp"
            alt=""
            width={32}
            height={32}
            loading="eager"
            className="size-8"
          />
          {siteConfig.brandName}
        </Link>

        <nav aria-label="Menu utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-chip px-3 text-caption-lg font-semibold text-ink-soft transition-colors duration-150 hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppLink
          location="header"
          className="inline-flex min-h-11 items-center gap-2 rounded-button bg-primary px-4 text-caption-lg font-semibold text-white transition-colors duration-150 hover:bg-primary-hover md:hidden"
        >
          <WhatsAppIcon size={18} />
          <span>WhatsApp</span>
        </WhatsAppLink>
      </Container>
    </header>
  );
}
