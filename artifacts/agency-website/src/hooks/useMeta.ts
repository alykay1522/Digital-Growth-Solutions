import { useEffect } from "react";

const SITE_NAME = "Digital Growth Solutions Agency";
const SITE_URL = "https://digitalgrowthsolutions.org";
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-default.png`;

interface MetaOptions {
  title: string;
  description: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
}

export function useMeta({ title, description, image, path = "", type = "website" }: MetaOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const ogImage = image || DEFAULT_OG_IMAGE;
    const canonicalUrl = `${SITE_URL}${path}`;

    document.title = fullTitle;

    const setMeta = (name: string, content: string, isProp = false) => {
      const attr = isProp ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // Standard
    setMeta("description", description);

    // Open Graph
    setMeta("og:type", type, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:url", canonicalUrl, true);

    // Twitter Card
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:site", "@digitalgrowthsolutions");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Canonical
    setLink("canonical", canonicalUrl);
  }, [title, description, image, path, type]);
}
