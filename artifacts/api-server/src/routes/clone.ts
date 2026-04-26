import { Router, type Request, type Response } from "express";
import https from "https";
import http from "http";
import { load } from "cheerio";
import { heavyLimiter } from "../middlewares/rateLimits";
import { requireToolToken } from "../middlewares/requireToolToken";
import { assertSafeUrl, secureLookup } from "../lib/assertSafeUrl";

const router = Router();

async function fetchRaw(rawUrl: string, timeoutMs = 10000): Promise<{ body: string; contentType: string }> {
  let parsed: URL;
  try {
    parsed = await assertSafeUrl(rawUrl);
  } catch (e: any) {
    throw new Error(`Invalid or disallowed URL: ${e.message}`);
  }
  const lib = parsed.protocol === "https:" ? https : http;
  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    rejectUnauthorized: true,
    lookup: secureLookup,
    timeout: timeoutMs,
  };

  return new Promise((resolve, reject) => {
    const req = lib.get(options, (res) => {
      if ((res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) && res.headers.location) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${parsed.protocol}//${parsed.hostname}${res.headers.location}`;
        fetchRaw(next, timeoutMs).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => resolve({
        body: Buffer.concat(chunks).toString("utf8"),
        contentType: String(res.headers["content-type"] || ""),
      }));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timed out")); });
  });
}

async function inlineCSS(cssUrl: string): Promise<string> {
  try {
    const { body } = await fetchRaw(cssUrl, 8000);
    // Fix relative URLs inside CSS (url(...), @import)
    const base = new URL(cssUrl);
    return body.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match, src) => {
      if (src.startsWith("data:") || src.startsWith("http")) return match;
      try {
        const abs = new URL(src, base).href;
        return `url("${abs}")`;
      } catch {
        return match;
      }
    });
  } catch {
    return `/* Failed to load: ${cssUrl} */`;
  }
}

function absoluteUrl(base: string, rel: string): string {
  if (!rel || rel.startsWith("data:") || rel.startsWith("//") || rel.startsWith("http")) {
    if (rel.startsWith("//")) return `https:${rel}`;
    return rel;
  }
  try {
    return new URL(rel, base).href;
  } catch {
    return rel;
  }
}

router.post("/clone", heavyLimiter, requireToolToken("site-cloner"), async (req: Request, res: Response) => {
  try {
    let { url, inlineStyles = true } = req.body as { url: string; inlineStyles?: boolean };
    if (!url?.trim()) return res.status(400).json({ error: "URL is required" });
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    try { await assertSafeUrl(url); } catch (e: any) { return res.status(400).json({ error: e.message }); }

    const { body: rawHtml } = await fetchRaw(url, 15000);
    const $ = load(rawHtml);
    const baseUrl = url;

    // --- Metadata extraction ---
    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content") || "";
    const faviconRel = $('link[rel~="icon"]').attr("href") || $('link[rel="shortcut icon"]').attr("href") || "/favicon.ico";
    const favicon = absoluteUrl(baseUrl, faviconRel);

    // --- Inline external stylesheets ---
    const cssPromises: Array<{ el: any; promise: Promise<string> }> = [];
    if (inlineStyles) {
      $('link[rel="stylesheet"]').each((_: number, el: any) => {
        const href = $(el).attr("href");
        if (href) {
          const absHref = absoluteUrl(baseUrl, href);
          cssPromises.push({ el, promise: inlineCSS(absHref) });
        }
      });
    }

    const cssResults = await Promise.all(cssPromises.map((c) => c.promise));
    if (inlineStyles) {
      cssPromises.forEach(({ el }, i) => {
        const css = cssResults[i];
        $(el).replaceWith(`<style data-inlined-from="${$(el).attr("href") || ""}">${css}</style>`);
      });
    }

    // --- Make all URLs absolute ---
    // Images
    $("img").each((_: number, el: any) => {
      const src = $(el).attr("src");
      if (src) $(el).attr("src", absoluteUrl(baseUrl, src));
      const srcset = $(el).attr("srcset");
      if (srcset) {
        const newSrcset = srcset.split(",").map((part) => {
          const [s, ...rest] = part.trim().split(/\s+/);
          return [absoluteUrl(baseUrl, s), ...rest].join(" ");
        }).join(", ");
        $(el).attr("srcset", newSrcset);
      }
      // Remove lazy loading so images show immediately
      $(el).removeAttr("loading");
      const dataSrc = $(el).attr("data-src");
      if (dataSrc) $(el).attr("src", absoluteUrl(baseUrl, dataSrc));
    });

    // Links
    $("a").each((_: number, el: any) => {
      const href = $(el).attr("href");
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        $(el).attr("href", absoluteUrl(baseUrl, href));
      }
    });

    // Scripts src
    $("script[src]").each((_: number, el: any) => {
      const src = $(el).attr("src");
      if (src) $(el).attr("src", absoluteUrl(baseUrl, src));
    });

    // Video/audio/source
    $("source, video, audio").each((_: number, el: any) => {
      const src = $(el).attr("src");
      if (src) $(el).attr("src", absoluteUrl(baseUrl, src));
    });

    // Background images in style attributes
    $("[style]").each((_: number, el: any) => {
      const style = $(el).attr("style") || "";
      const updated = style.replace(/url\(['"]?([^'")]+)['"]?\)/g, (match: string, src: string) => {
        if (src.startsWith("data:") || src.startsWith("http")) return match;
        return `url("${absoluteUrl(baseUrl, src)}")`;
      });
      $(el).attr("style", updated);
    });

    // Meta OG images
    $('meta[property="og:image"], meta[name="twitter:image"]').each((_: number, el: any) => {
      const content = $(el).attr("content");
      if (content) $(el).attr("content", absoluteUrl(baseUrl, content));
    });

    // Base tag — set it so relative resources that were missed still resolve
    if ($("base").length === 0) {
      $("head").prepend(`<base href="${baseUrl}">`);
    } else {
      $("base").attr("href", baseUrl);
    }

    // Inject a banner so the user knows this is a clone
    const banner = `
<div id="nexa-clone-banner" style="position:fixed;bottom:0;left:0;right:0;background:#1e293b;color:#f8fafc;font-family:system-ui,sans-serif;font-size:13px;padding:10px 20px;display:flex;align-items:center;justify-content:space-between;z-index:2147483647;box-shadow:0 -2px 12px rgba(0,0,0,.3)">
  <span>🔍 <strong>Digital Growth Solutions Agency Site Clone</strong> — cloned from <a href="${url}" target="_blank" style="color:#60a5fa">${url}</a></span>
  <button onclick="document.getElementById('nexa-clone-banner').remove()" style="background:transparent;border:1px solid rgba(255,255,255,.3);color:#f8fafc;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:12px">Dismiss</button>
</div>`;
    $("body").append(banner);

    // Generate final HTML
    const clonedHtml = $.html();

    // Analyze the clone
    const cssLinkCount = (rawHtml.match(/<link[^>]+rel=["']stylesheet["']/gi) || []).length;
    const scriptCount = (rawHtml.match(/<script/gi) || []).length;
    const imgCount = $("img").length;

    res.json({
      html: clonedHtml,
      meta: {
        title,
        description,
        favicon,
        url,
        originalSize: rawHtml.length,
        clonedSize: clonedHtml.length,
        cssInlined: inlineStyles ? cssLinkCount : 0,
        totalScripts: scriptCount,
        totalImages: imgCount,
        clonedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to clone site" });
  }
});

export default router;
