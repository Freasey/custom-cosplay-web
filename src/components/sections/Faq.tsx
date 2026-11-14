import Link from "next/link";
import { faqItems } from "@/content/faq";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/ui/icons";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-surface py-14 md:py-20">
      <Container width="reading" className="md:max-w-[800px]">
        <SectionHeading id="faq-title" label="FAQ" title="Pertanyaan yang sering ditanyakan" />

        <div className="mt-8 divide-y divide-border-soft rounded-card border border-border">
          {faqItems.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 font-semibold text-ink transition-colors duration-150 hover:text-primary md:px-6">
                <span>{item.question}</span>
                <ChevronDownIcon
                  size={20}
                  className="shrink-0 text-muted transition-transform duration-150 group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-ink-soft md:px-6">{item.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
          <Link
            href="/syarat/"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary transition-colors duration-150 hover:text-primary-hover"
          >
            Baca syarat pemesanan lengkap
            <ArrowRightIcon size={16} />
          </Link>
          <WhatsAppLink
            location="faq"
            className="inline-flex min-h-11 items-center font-semibold text-ink-soft underline-offset-4 transition-colors duration-150 hover:text-primary-hover hover:underline"
          >
            Pertanyaan lain? Tanya lewat WhatsApp
          </WhatsAppLink>
        </div>
      </Container>
    </section>
  );
}
