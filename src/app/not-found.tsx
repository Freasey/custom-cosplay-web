import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container width="reading" className="py-20 text-center">
      <h1 className="text-section md:text-section-lg">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-ink-soft">Tautan yang kamu buka mungkin salah atau sudah dipindah.</p>
      <ButtonLink href="/" className="mt-7">
        Kembali ke beranda
      </ButtonLink>
    </Container>
  );
}
