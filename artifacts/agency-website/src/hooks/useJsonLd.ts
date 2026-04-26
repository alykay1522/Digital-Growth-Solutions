import { useEffect } from "react";

export function useJsonLd(id: string, schema: object | null) {
  useEffect(() => {
    if (!schema) return;
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.id = id;
      el.type = "application/ld+json";
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [id, JSON.stringify(schema)]);
}
