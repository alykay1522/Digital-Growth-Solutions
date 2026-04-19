import { useEffect } from "react";

export function JsonLd({ id, schema }: { id: string; schema: object }) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, [id]);
  return null;
}
