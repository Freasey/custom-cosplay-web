import { preload } from "react-dom";
import { heroImage, heroVideoSrc } from "@/content/gallery";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HeroVideo } from "@/components/ui/HeroVideo";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppLink";

const assurances = ["DP 50%", "Foto progres selama produksi", "Kirim ke seluruh Indonesia"];

export function Hero() {
  // Poster video ditemukan browser belakangan, jadi dimuat lebih awal supaya hero cepat tampil.
  if (heroImage && heroVideoSrc) preload(heroImage.src, { as: "image", fetchPriority: "high" });

  return (
    <section id="hero" aria-labelledby="hero-title" className="pb-14 pt-8 md:pb-20 md:pt-14">
      <Container className="grid items-center gap-8 md:grid-cols-2 md:gap-10">
        <div>
          <h1 id="hero-title" className="text-hero md:text-hero-lg">
            Jasa custom cosplay untuk karakter favoritmu
          </h1>
          <p className="mt-4 text-lead text-ink-soft md:text-lead-lg">
            Jasa pembuatan kostum cosplay: kain, armor, dan props. Kirim referensi, ukuran, dan
            tanggal event. Harga dan estimasinya kami kabari lewat WhatsApp.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton location="hero">Konsultasi gratis</WhatsAppButton>
            <ButtonLink href="#cara-pesan" variant="secondary">
              Lihat cara pesan
            </ButtonLink>
          </div>

          <ul className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption-lg text-muted">
            {assurances.map((item, index) => (
              <li key={item} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">·</span> : null}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {heroImage && heroVideoSrc ? (
          <HeroVideo poster={heroImage} videoSrc={heroVideoSrc} className="h-[360px] md:h-[420px]" />
        ) : heroImage ? (
          <MediaImage
            image={heroImage}
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-[360px] md:h-[420px]"
          />
        ) : (
          <ImagePlaceholder label="Foto utama kostum menyusul" className="h-[300px] md:h-[420px]" />
        )}
      </Container>
    </section>
  );
}
