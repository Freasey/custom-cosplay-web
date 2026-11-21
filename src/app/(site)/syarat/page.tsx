import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/content/seo";
import { terms } from "@/content/terms";
import { Container } from "@/components/ui/Container";
import { WhatsAppButton } from "@/components/ui/WhatsAppLink";

export const metadata: Metadata = pageMetadata({
  title: `Syarat Pemesanan | ${siteConfig.brandName}`,
  description:
    "Syarat pemesanan custom cosplay: DP 50%, revisi, ukuran, estimasi waktu, pelunasan, dan pengiriman ke seluruh Indonesia.",
  path: "/syarat/",
});

export default function TermsPage() {
  return (
    <Container width="reading" className="py-14 md:py-20">
      <p className="mb-3 text-label font-semibold uppercase tracking-[2px] text-primary">Syarat</p>
      <h1 className="text-section md:text-section-lg">Syarat pemesanan</h1>
      <p className="mt-3 text-ink-soft">
        Baca ini sebelum membayar DP. Kalau ada yang belum jelas, tanyakan dulu lewat WhatsApp.
      </p>

      <ol className="mt-8 flex flex-col gap-4">
        {terms.map((term, index) => (
          <li key={term.title} className="rounded-card border border-border bg-surface p-5 md:p-6">
            <h2 className="flex items-baseline gap-3 font-heading text-card font-semibold md:text-card-lg">
              <span className="text-primary" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {term.title}
            </h2>
            <p className="mt-2 text-ink-soft">{term.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-panel border border-border bg-surface p-6 md:p-8">
        <p className="font-heading text-card font-semibold text-ink md:text-card-lg">Siap pesan?</p>
        <p className="mt-2 text-ink-soft">
          Kirim referensi, ukuran badan, dan tanggal pakai. Kami kabari harga dan estimasinya.
        </p>
        <WhatsAppButton location="syarat" className="mt-6 w-full sm:w-auto">
          Konsultasi via WhatsApp
        </WhatsAppButton>
      </div>
    </Container>
  );
}
