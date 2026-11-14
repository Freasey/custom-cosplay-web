import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

import { ogImage } from "@/content/seo";

export const dynamic = "force-static";

// Warna disalin dari token design system karena ImageResponse tidak membaca Tailwind.
const colors = { bg: "#F4F6FA", surface: "#FFFFFF", ink: "#10182B", inkSoft: "#2A3550", primary: "#2B4EFF", border: "#C9D1E0" };

/** Gambar Open Graph 1200x630 berbasis teks, dibuat saat build ke out/og.png. Tidak memakai ilustrasi AI. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: colors.bg,
          padding: 72,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: colors.ink }}>{siteConfig.brandName}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: colors.primary, fontWeight: 700 }}>
            JASA CUSTOM COSPLAY
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 68, lineHeight: 1.1, fontWeight: 700, color: colors.ink, maxWidth: 900 }}>
            Kostum kain, armor, dan props sesuai karaktermu
          </div>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {["DP 50%", "Foto progres", "Kirim ke seluruh Indonesia"].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                background: colors.surface,
                border: `2px solid ${colors.border}`,
                borderRadius: 12,
                padding: "12px 22px",
                fontSize: 26,
                color: colors.inkSoft,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { width: ogImage.width, height: ogImage.height },
  );
}
