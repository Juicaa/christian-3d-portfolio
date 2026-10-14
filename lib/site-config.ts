type SiteEnvironment = {
  VERCEL_ENV?: string;
  VERCEL_URL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

function parsePublicOrigin(value: string, source: string): URL {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${source} must be an absolute HTTP(S) origin.`);
  }

  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (
    (url.protocol !== "https:" && !(localHost && url.protocol === "http:")) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(`${source} must be an HTTPS origin without credentials, path, query, or fragment.`);
  }

  return new URL(`${url.origin}/`);
}

export function resolveSiteConfig(
  environment: SiteEnvironment = {
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
) {
  const configuredOrigin = environment.NEXT_PUBLIC_SITE_URL?.trim();
  const metadataBase = configuredOrigin
    ? parsePublicOrigin(configuredOrigin, "NEXT_PUBLIC_SITE_URL")
    : environment.VERCEL_ENV === "preview" && environment.VERCEL_URL
      ? parsePublicOrigin(`https://${environment.VERCEL_URL}`, "VERCEL_URL")
      : null;

  // Index only an explicitly configured Production domain. Preview, local,
  // CI, and Production deployments without that domain fail closed.
  const indexable = environment.VERCEL_ENV === "production" && Boolean(configuredOrigin);

  return { metadataBase, indexable };
}
