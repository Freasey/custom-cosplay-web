import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? "";

/**
 * Memuat gtag hanya kalau NEXT_PUBLIC_GA_ID atau NEXT_PUBLIC_GADS_ID diisi.
 * Tanpa variabel itu, komponen ini tidak merender apa pun.
 */
export function Analytics() {
  const ids = [GA_ID, GADS_ID].filter((id) => /^[A-Z]{1,3}-[A-Z0-9-]+$/i.test(id));
  if (ids.length === 0) return null;

  const config = ids.map((id) => `gtag('config', ${JSON.stringify(id)});`).join("\n");

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids[0])}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${config}`}
      </Script>
    </>
  );
}
