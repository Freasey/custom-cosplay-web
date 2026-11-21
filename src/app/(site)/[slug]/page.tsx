import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig, siteUrl } from "@/config/site";
import { gallery, sortedGallery } from "@/content/gallery";
import { pageMetadata } from "@/content/seo";
import { serviceBySlug, services } from "@/content/services";
import { JsonLd } from "@/components/JsonLd";
import { Steps } from "@/components/sections/Steps";
import { Container } from "@/components/ui/Container";
import { MediaImage } from "@/components/ui/MediaImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppLink";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: `${service.metaTitle} | ${siteConfig.brandName}`,
    description: service.metaDescription,
    path: `/${service.slug}/`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();

  const images = sortedGallery(gallery).filter((image) => image.category === service.key);
  const others = services.filter((item) => item.key !== service.key);
  const pageUrl = `${siteUrl}/${service.slug}/`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.pageTitle,
        serviceType: service.pageTitle,
        description: service.metaDescription,
        url: pageUrl,
        provider: { "@id": `${siteUrl}/#organization` },
        areaServed: { "@type": "Country", name: "Indonesia" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: service.name, item: pageUrl },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={structuredData} />

      <section aria-labelledby="layanan-title" className="pb-14 pt-8 md:pb-20 md:pt-14">
        <Container>
          <nav aria-label="Jejak halaman" className="text-caption-lg text-muted">
            <Link href="/" className="inline-flex min-h-11 items-center underline-offset-4 hover:text-primary hover:underline">
              Beranda
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            <span aria-current="page">{service.name}</span>
          </nav>

          <div className="mt-2 max-w-[720px]">
            <p className="mb-3 text-label font-semibold uppercase tracking-[2px] text-primary">Layanan</p>
            <h1 id="layanan-title" className="text-hero md:text-hero-lg">
              {service.pageTitle}
            </h1>
            <p className="mt-4 text-lead text-ink-soft md:text-lead-lg">{service.intro}</p>
            <WhatsAppButton location="layanan" context={service.name} className="mt-7 w-full sm:w-auto">
              Diskusikan {service.name.toLowerCase()}
            </WhatsAppButton>
            <p className="mt-4 text-caption-lg text-muted">
              Harga bergantung pada desain, bahan, dan tingkat kesulitannya. Kirim referensinya, kami
              hitungkan untukmu.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="dibuat-title" className="bg-surface py-14 md:py-20">
        <Container className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 id="dibuat-title" className="text-section md:text-section-lg">
              Yang bisa dibuat
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {service.makes.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <CheckIcon size={22} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-section md:text-section-lg">Yang perlu kamu kirim</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {service.send.map((item) => (
                <li key={item} className="flex gap-3 text-ink-soft">
                  <CheckIcon size={22} className="mt-0.5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {images.length > 0 ? (
        <section aria-labelledby="contoh-title" className="py-14 md:py-20">
          <Container>
            <h2 id="contoh-title" className="text-section md:text-section-lg">
              Gambaran {service.name.toLowerCase()}
            </h2>
            <p className="mt-3 max-w-[640px] text-ink-soft">
              Gambar berlabel &quot;Ilustrasi konsep&quot; adalah gambaran desain, bukan foto hasil
              produksi.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <li key={image.src}>
                  <MediaImage
                    image={image}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/5]"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <div className="bg-surface">
        <Steps />
      </div>

      <section aria-labelledby="tanya-title" className="py-14 md:py-20">
        <Container width="reading">
          <h2 id="tanya-title" className="text-section md:text-section-lg">
            Pertanyaan soal {service.name.toLowerCase()}
          </h2>
          <dl className="mt-6 flex flex-col gap-4">
            {service.questions.map((item) => (
              <div key={item.question} className="rounded-card border border-border bg-surface p-5 md:p-6">
                <dt className="font-semibold text-ink">{item.question}</dt>
                <dd className="mt-2 text-ink-soft">{item.answer}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/syarat/"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary transition-colors duration-150 hover:text-primary-hover"
          >
            Baca syarat pemesanan lengkap
            <ArrowRightIcon size={16} />
          </Link>

          <div className="mt-10 rounded-panel border border-border bg-surface p-6 md:p-8">
            <p className="font-heading text-card font-semibold text-ink md:text-card-lg">
              Punya referensinya?
            </p>
            <p className="mt-2 text-ink-soft">Kirim gambarnya, kami bantu hitung harga dan waktunya.</p>
            <WhatsAppButton location="penutup" context={service.name} className="mt-6 w-full sm:w-auto">
              Konsultasi via WhatsApp
            </WhatsAppButton>
          </div>

          <p className="mt-10 text-caption-lg text-muted">Layanan lain:</p>
          <ul className="mt-1 flex flex-wrap gap-x-6">
            {others.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/${item.slug}/`}
                  className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary transition-colors duration-150 hover:text-primary-hover"
                >
                  {item.name}
                  <ArrowRightIcon size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
