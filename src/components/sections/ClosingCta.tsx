import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppLink";

export function ClosingCta() {
  return (
    <section aria-labelledby="penutup-title" className="py-14 md:py-20">
      <Container>
        <div className="rounded-panel border border-border bg-surface px-6 py-10 text-center md:px-10 md:py-14">
          <h2 id="penutup-title" className="mx-auto max-w-[560px] text-section md:text-section-lg">
            Punya karakter yang ingin kamu perankan?
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-ink-soft">
            Kirim referensinya, kami bantu hitung harga dan waktunya.
          </p>
          <WhatsAppButton location="penutup" className="mt-7 w-full sm:w-auto">
            Konsultasi via WhatsApp
          </WhatsAppButton>
        </div>
      </Container>
    </section>
  );
}
