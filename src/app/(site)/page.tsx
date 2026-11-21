import { siteConfig, siteUrl } from "@/config/site";
import { faqItems } from "@/content/faq";
import { siteDescription } from "@/content/seo";
import { JsonLd } from "@/components/JsonLd";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { Faq } from "@/components/sections/Faq";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Prepare } from "@/components/sections/Prepare";
import { Services } from "@/components/sections/Services";
import { Steps } from "@/components/sections/Steps";

function structuredData() {
  const sameAs = [siteConfig.social.instagram, siteConfig.social.tiktok].filter(Boolean);
  const organizationId = `${siteUrl}/#organization`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.brandName,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo.png`,
        ...(sameAs.length > 0 ? { sameAs } : {}),
      },
      {
        // Nama situs yang ditampilkan Google di hasil pencarian.
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteConfig.brandName,
        alternateName: siteConfig.brandName.replace(/\s+/g, ""),
        url: `${siteUrl}/`,
        inLanguage: "id-ID",
        publisher: { "@id": organizationId },
      },
      {
        "@type": "Service",
        serviceType: "Jasa pembuatan kostum cosplay custom",
        name: "Jasa custom cosplay",
        description: siteDescription,
        provider: { "@id": organizationId },
        areaServed: { "@type": "Country", name: "Indonesia" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={structuredData()} />
      <Hero />
      <Services />
      <Steps />
      <Gallery />
      <Prepare />
      <Faq />
      <ClosingCta />
    </>
  );
}
