import type { MetadataRoute } from "next";
import { resolveSiteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const { metadataBase, indexable } = resolveSiteConfig();

  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? undefined : "/",
    },
    sitemap:
      indexable && metadataBase
        ? new URL("/sitemap.xml", metadataBase).toString()
        : undefined,
  };
}
