import Link from "next/link";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { startingPriceLabel } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ArrowRightIcon } from "@/components/ui/icons";

export function Services() {
  return (
    <section id="layanan" aria-labelledby="layanan-title" className="bg-surface py-14 md:py-20">
      <Container>
        <SectionHeading id="layanan-title" label="Layanan" title="Apa saja yang bisa dibuat">
          <p>
            Kostum kain, armor, dan props. Semua dikerjakan pengrajin berpengalaman sesuai referensi
            dan ukuranmu.
          </p>
        </SectionHeading>

        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <li key={service.key}>
              <Card className="flex h-full flex-col">
                <h3 className="text-card md:text-card-lg">{service.name}</h3>
                <p className="mt-1 text-caption-lg text-muted">{service.description}</p>
                <p className="mt-4 font-semibold text-primary">
                  {startingPriceLabel(siteConfig.startingPrices[service.key])}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 pt-3">
                  <Link
                    href={`/${service.slug}/`}
                    className="inline-flex min-h-11 items-center gap-1.5 text-caption-lg font-semibold text-primary transition-colors duration-150 hover:text-primary-hover"
                  >
                    Lihat detail
                    <span className="sr-only"> {service.name.toLowerCase()}</span>
                    <ArrowRightIcon size={16} />
                  </Link>
                  <WhatsAppLink
                    location="layanan"
                    context={service.name}
                    className="inline-flex min-h-11 items-center text-caption-lg font-semibold text-ink-soft underline-offset-4 transition-colors duration-150 hover:text-primary-hover hover:underline"
                  >
                    Diskusikan
                    <span className="sr-only"> {service.name.toLowerCase()}</span>
                  </WhatsAppLink>
                </div>
              </Card>
            </li>
          ))}
        </ul>

        <p id="harga" className="mt-6 max-w-[640px] text-caption-lg text-muted">
          Harga bergantung pada barang yang kamu inginkan: desain, bahan, dan tingkat kesulitannya.
          Kirim referensinya lewat WhatsApp, kami hitungkan untukmu.
        </p>
      </Container>
    </section>
  );
}
