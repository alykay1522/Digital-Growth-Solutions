import { Router, type IRouter, type Request, type Response } from "express";
import * as cheerio from "cheerio";
import { httpGet } from "../utils/fetchUrl.js";

const router: IRouter = Router();

const TECH_FINGERPRINTS: Array<{
  name: string;
  category: string;
  test: (html: string, headers: Record<string, string>) => boolean;
}> = [
  { name: "WordPress", category: "CMS", test: (h) => h.includes("wp-content") || h.includes("wp-includes") },
  { name: "Shopify", category: "eCommerce", test: (h) => h.includes("myshopify.com") || h.includes("Shopify.theme") },
  { name: "WooCommerce", category: "eCommerce", test: (h) => h.includes("woocommerce") },
  { name: "Wix", category: "CMS", test: (h, hd) => h.includes("wix.com") || !!hd["x-wix-published-version"] },
  { name: "Webflow", category: "CMS", test: (h) => h.includes("webflow.com") || h.includes("data-wf-page") },
  { name: "Squarespace", category: "CMS", test: (h) => h.includes("squarespace") },
  { name: "Next.js", category: "JS Framework", test: (h) => h.includes("__NEXT_DATA__") || h.includes("/_next/") },
  { name: "React", category: "JS Framework", test: (h) => /react[\.\-]dom/i.test(h) || h.includes("__reactFiber") },
  { name: "Vue.js", category: "JS Framework", test: (h) => h.includes("data-v-app") || /vue[\.\-]/i.test(h) },
  { name: "Angular", category: "JS Framework", test: (h) => h.includes("ng-version") || h.includes("ng-app") },
  { name: "Nuxt.js", category: "JS Framework", test: (h) => h.includes("__NUXT__") || h.includes("/_nuxt/") },
  { name: "Gatsby", category: "JS Framework", test: (h) => h.includes("___gatsby") || h.includes("/gatsby-") },
  { name: "Google Analytics", category: "Analytics", test: (h) => h.includes("google-analytics.com") || h.includes("gtag(") },
  { name: "Google Tag Manager", category: "Tag Manager", test: (h) => h.includes("googletagmanager.com/gtm") },
  { name: "Hotjar", category: "Analytics", test: (h) => h.includes("hotjar.com") },
  { name: "HubSpot", category: "CRM/Marketing", test: (h) => h.includes("js.hs-scripts.com") || h.includes("hubspot") },
  { name: "Intercom", category: "Support", test: (h) => h.includes("widget.intercom.io") },
  { name: "Stripe", category: "Payments", test: (h) => h.includes("js.stripe.com") },
  { name: "PayPal", category: "Payments", test: (h) => h.includes("paypal.com/sdk") },
  { name: "Cloudflare", category: "CDN/Security", test: (h, hd) => !!hd["cf-ray"] || h.includes("cloudflare") },
  { name: "Vercel", category: "Hosting", test: (_, hd) => !!hd["x-vercel-id"] },
  { name: "Netlify", category: "Hosting", test: (_, hd) => !!hd["x-nf-request-id"] },
  { name: "AWS CloudFront", category: "CDN", test: (_, hd) => !!hd["x-amz-cf-id"] || !!hd["x-amz-cf-pop"] },
  { name: "Nginx", category: "Web Server", test: (_, hd) => (hd["server"] || "").toLowerCase().includes("nginx") },
  { name: "Apache", category: "Web Server", test: (_, hd) => (hd["server"] || "").toLowerCase().includes("apache") },
];

async function quickAudit(rawUrl: string) {
  let url = rawUrl.trim();
  if (!url.startsWith("http")) url = `https://${url}`;

  const startTime = Date.now();
  const { html, headers, status } = await httpGet(url);
  const responseTime = Date.now() - startTime;

  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const hasTitle = !!title;
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const hasMetaDesc = metaDesc.length > 10;
  const h1Count = $("h1").length;
  const hasCanonical = $('link[rel="canonical"]').length > 0;
  const hasOgTags = $('meta[property="og:title"]').length > 0;
  const hasStructuredData = html.includes("application/ld+json");

  const scriptCount = $("script[src]").length;
  const totalImgs = $("img").length;
  const imgsWithoutAlt = $("img:not([alt])").length;
  const imgsWithoutDims = $("img:not([width]):not([height])").length;

  const isHttps = url.startsWith("https://");
  const hasHsts = !!headers["strict-transport-security"];
  const hasCSP = !!headers["content-security-policy"];
  const hasXFrame = !!headers["x-frame-options"];
  const hasXContent = !!headers["x-content-type-options"];

  const hasLang = !!$("html").attr("lang");
  const hasMobile =
    ($('meta[name="viewport"]').attr("content") || "").includes("width=device-width");

  const seoPoints = [hasTitle, hasMetaDesc, h1Count === 1, hasCanonical, hasOgTags, hasStructuredData].filter(Boolean).length;
  const seoScore = Math.round((seoPoints / 6) * 100);

  const rtPenalty = Math.floor(responseTime / 500) * 5;
  const perfScore = Math.max(10, Math.min(100, 100 - scriptCount * 3 - imgsWithoutDims * 2 - rtPenalty));

  const secPoints = [isHttps, hasHsts, hasCSP, hasXFrame, hasXContent].filter(Boolean).length;
  const secScore = Math.round((secPoints / 5) * 100);

  const altRatio = totalImgs === 0 ? 1 : (totalImgs - imgsWithoutAlt) / totalImgs;
  const a11yPoints = [hasLang, hasMobile, altRatio > 0.8].filter(Boolean).length;
  const a11yScore = Math.round((a11yPoints / 3) * 100);

  const overall = Math.round((seoScore + perfScore + secScore + a11yScore) / 4);

  const technologies = TECH_FINGERPRINTS.filter((f) => f.test(html, headers)).map((f) => ({
    name: f.name,
    category: f.category,
  }));

  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    "/favicon.ico";

  return {
    url,
    title: title || new URL(url).hostname,
    favicon,
    status,
    responseTime,
    overall,
    scores: { seo: seoScore, performance: perfScore, security: secScore, accessibility: a11yScore },
    metrics: {
      hasTitle,
      hasMetaDesc,
      h1Count,
      hasCanonical,
      hasOgTags,
      hasStructuredData,
      isHttps,
      hasHsts,
      hasCSP,
      hasXFrame,
      hasLang,
      hasMobile,
      scriptCount,
      totalImgs,
      imgsWithoutAlt,
    },
    technologies,
  };
}

router.post("/compare", async (req: Request, res: Response) => {
  try {
    const { urlA, urlB } = req.body as { urlA: string; urlB: string };

    if (!urlA || !urlB) {
      res.status(400).json({ error: "urlA and urlB are required" });
      return;
    }

    const [resultA, resultB] = await Promise.allSettled([
      quickAudit(urlA),
      quickAudit(urlB),
    ]);

    const siteA = resultA.status === "fulfilled" ? resultA.value : null;
    const siteB = resultB.status === "fulfilled" ? resultB.value : null;
    const errorA = resultA.status === "rejected" ? String((resultA as any).reason?.message ?? (resultA as any).reason) : null;
    const errorB = resultB.status === "rejected" ? String((resultB as any).reason?.message ?? (resultB as any).reason) : null;

    res.json({ siteA, siteB, errorA, errorB });
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "Comparison failed" });
  }
});

export default router;
