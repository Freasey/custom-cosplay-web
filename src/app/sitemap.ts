import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/syarat/`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
