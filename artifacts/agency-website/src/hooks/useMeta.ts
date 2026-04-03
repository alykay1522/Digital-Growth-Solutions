import { useEffect } from "react";

export function useMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    const base = "NexaAgency";
    document.title = title ? `${title} | ${base}` : base;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", `${title} | ${base}`, true);
    setMeta("og:description", description, true);
    setMeta("twitter:title", `${title} | ${base}`);
    setMeta("twitter:description", description);
  }, [title, description]);
}
