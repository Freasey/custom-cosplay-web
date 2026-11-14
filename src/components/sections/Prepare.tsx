import { prepareItems } from "@/content/prepare";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppLink";
import { CheckIcon } from "@/components/ui/icons";

export function Prepare() {
  return (
    <section id="siapkan" aria-labelledby="siapkan-title" className="py-14 md:py-20">
      <Container>
        <div className="rounded-panel border border-border bg-surface p-6 md:p-10">
          <SectionHeading id="siapkan-title" title="Sebelum chat, siapkan ini" />
          <ul className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
            {prepareItems.map((item) => (
              <li key={item} className="flex gap-3 text-ink-soft">
                <CheckIcon size={22} className="mt-0.5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <WhatsAppButton location="siapkan" className="mt-8 w-full sm:w-auto">
            Kirim referensi lewat WhatsApp
          </WhatsAppButton>
        </div>
      </Container>
    </section>
  );
}
