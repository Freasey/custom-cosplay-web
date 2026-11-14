import { services } from "@/content/services";
import { gallery, sortedGallery } from "@/content/gallery";
import { Container } from "@/components/ui/Container";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Gallery() {
  const images = sortedGallery(gallery);
  // Judul "Hasil kerja kami" hanya dipakai kalau semua gambar sudah foto asli.
  const allReal = images.length > 0 && images.every((image) => image.kind === "real");

  return (
    <section id="contoh" aria-labelledby="contoh-title" className="bg-surface py-14 md:py-20">
      <Container>
        {allReal ? (
          <SectionHeading id="contoh-title" label="Hasil kerja" title="Hasil kerja kami">
            <p>Setiap kostum dibuat custom sesuai permintaan. Semua gambar di bawah adalah foto hasil produksi.</p>
          </SectionHeading>
        ) : (
          <SectionHeading id="contoh-title" label="Contoh" title="Gambaran yang bisa kami kerjakan">
            <p>
              Setiap kostum dibuat custom sesuai permintaan. Gambar berlabel &quot;Ilustrasi konsep&quot;
              adalah gambaran desain, bukan foto hasil produksi.
            </p>
          </SectionHeading>
        )}

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.length > 0
            ? images.map((image) => (
                <li key={image.src}>
                  <MediaImage
                    image={image}
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="aspect-[4/5]"
                  />
                </li>
              ))
            : services.map((service) => (
                <li key={service.key}>
                  <ImagePlaceholder
                    label={`Gambar ${service.name.toLowerCase()} menyusul`}
                    className="aspect-[4/5]"
                  />
                </li>
              ))}
        </ul>
      </Container>
    </section>
  );
}
