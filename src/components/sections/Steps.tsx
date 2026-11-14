import { steps } from "@/content/steps";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Steps() {
  return (
    <section id="cara-pesan" aria-labelledby="cara-pesan-title" className="py-14 md:py-20">
      <Container>
        <SectionHeading
          id="cara-pesan-title"
          label="Cara pesan"
          title="Empat langkah sampai kostum di tanganmu"
        />

        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-card border border-border bg-surface p-5 md:p-6">
              <span className="font-heading text-[28px] font-bold leading-none text-primary" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-sans text-body font-semibold">
                <span className="sr-only">Langkah {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-1 text-caption-lg text-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
