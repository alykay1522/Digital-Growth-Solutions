import https from "https";
import http from "http";

export function httpGet(
  url: string,
  redirectsLeft = 5
): Promise<{ html: string; headers: Record<string, string>; status: number }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const lib = parsed.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; DGSAuditBot/1.0; +https://nexaagency.com)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "close",
        },
        timeout: 15000,
        rejectUnauthorized: false,
      },
      (res) => {
        const status = res.statusCode || 0;
        const headers: Record<string, string> = {};
        Object.entries(res.headers).forEach(([k, v]) => {
          if (typeof v === "string") headers[k.toLowerCase()] = v;
          else if (Array.isArray(v)) headers[k.toLowerCase()] = v[0];
        });

        if (
          [301, 302, 303, 307, 308].includes(status) &&
          headers.location &&
          redirectsLeft > 0
        ) {
          req.destroy();
          const nextUrl = headers.location.startsWith("http")
            ? headers.location
            : new URL(headers.location, url).href;
          httpGet(nextUrl, redirectsLeft - 1).then(resolve).catch(reject);
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          resolve({ html: Buffer.concat(chunks).toString("utf-8"), headers, status });
        });
        res.on("error", reject);
      }
    );

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out after 15 seconds"));
    });
    req.on("error", reject);
    req.end();
  });
}
