import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { services } from "@/content/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    ...services.map((service) => ({
      url: `${siteUrl}/${service.slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/syarat/`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
