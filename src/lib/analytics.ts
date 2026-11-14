/**
 * Pembungkus pelacakan konversi. Aman dipanggil walaupun analitik belum
 * dipasang: kalau gtag tidak ada, event hanya disimpan ke dataLayer.
 */

import type { WhatsAppLocation } from "@/lib/whatsapp";

type Gtag = (command: "event", name: string, params: Record<string, unknown>) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export function trackWhatsappClick(location: WhatsAppLocation): void {
  if (typeof window === "undefined") return;

  const params = { location };

  if (typeof window.gtag === "function") {
    window.gtag("event", "whatsapp_click", params);
    return;
  }

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "whatsapp_click", ...params });
}
