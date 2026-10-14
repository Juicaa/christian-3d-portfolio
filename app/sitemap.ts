import type { MetadataRoute } from "next";
import { resolveSiteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const { metadataBase, indexable } = resolveSiteConfig();
  if (!indexable || !metadataBase) return [];

  return [
    {
      url: metadataBase.toString(),
      changeFrequency: "yearly",
      priority: 1,
    },
  ];
}
