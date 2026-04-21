import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import https from "https";
import http from "http";
import { heavyLimiter } from "../middlewares/rateLimits";
import { assertSafeUrl } from "../lib/assertSafeUrl";

const router: IRouter = Router();

interface SiteIssue {
  id: string;
  category: "seo" | "performance" | "security" | "accessibility" | "mobile" | "content";
  severity: "critical" | "warning" | "info" | "pass";
  title: string;
  description: string;
  fix: string;
  value?: string;
}

function httpGet(url: string, redirectsLeft = 5): Promise<{ html: string; headers: Record<string, string>; status: number }> {
  return new Promise((resolve, reject) => {
    let parsed: URL;
    try {
      parsed = assertSafeUrl(url);
    } catch (e: any) {
      return reject(e);
    }
    const lib = parsed.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SiteAuditBot/1.0; +https://digitalgrowthsolutionsagency.com)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Connection: "close",
        },
        timeout: 15000,
        rejectUnauthorized: true,
      },
      (res) => {
        const status = res.statusCode || 0;
        const headers: Record<string, string> = {};
        Object.entries(res.headers).forEach(([k, v]) => {
          if (typeof v === "string") headers[k.toLowerCase()] = v;
          else if (Array.isArray(v)) headers[k.toLowerCase()] = v[0];
        });

        // Follow redirects
        if ((status === 301 || status === 302 || status === 303 || status === 307 || status === 308) && headers.location && redirectsLeft > 0) {
          req.destroy();
          const nextUrl = headers.location.startsWith("http") ? headers.location : new URL(headers.location, url).href;
          httpGet(nextUrl, redirectsLeft - 1).then(resolve).catch(reject);
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => {
          const html = Buffer.concat(chunks).toString("utf-8");
          resolve({ html, headers, status });
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

async function fetchSite(url: string): Promise<{ html: string; headers: Record<string, string>; status: number; responseTime: number }> {
  const start = Date.now();
  const { html, headers, status } = await httpGet(url);
  return { html, headers, status, responseTime: Date.now() - start };
}

function analyzeSEO($: cheerio.CheerioAPI, url: string): SiteIssue[] {
  const issues: SiteIssue[] = [];

  // Title
  const title = $("title").text().trim();
  if (!title) {
    issues.push({ id: "seo-no-title", category: "seo", severity: "critical", title: "Missing Page Title", description: "No <title> tag found. Search engines use the title to understand and rank pages.", fix: "Add a descriptive <title> tag between 50–60 characters to every page.", value: "(none)" });
  } else if (title.length < 30) {
    issues.push({ id: "seo-short-title", category: "seo", severity: "warning", title: "Title Too Short", description: `Title is only ${title.length} characters. Short titles miss keyword opportunities.`, fix: "Expand the title to 50–60 characters including your primary keyword.", value: title });
  } else if (title.length > 60) {
    issues.push({ id: "seo-long-title", category: "seo", severity: "warning", title: "Title Too Long", description: `Title is ${title.length} characters and may be truncated in search results.`, fix: "Shorten the title to 50–60 characters.", value: title });
  } else {
    issues.push({ id: "seo-title-ok", category: "seo", severity: "pass", title: "Page Title Present", description: "Title tag is well-sized and present.", fix: "", value: title });
  }

  // Meta description
  const metaDesc = $('meta[name="description"]').attr("content")?.trim() || "";
  if (!metaDesc) {
    issues.push({ id: "seo-no-description", category: "seo", severity: "critical", title: "Missing Meta Description", description: "No meta description found. Search engines often show this in search result snippets.", fix: 'Add <meta name="description" content="Your description..."> (120–160 characters).', value: "(none)" });
  } else if (metaDesc.length < 80) {
    issues.push({ id: "seo-short-desc", category: "seo", severity: "warning", title: "Meta Description Too Short", description: `Meta description is only ${metaDesc.length} characters.`, fix: "Write a compelling description of 120–160 characters.", value: metaDesc });
  } else if (metaDesc.length > 160) {
    issues.push({ id: "seo-long-desc", category: "seo", severity: "warning", title: "Meta Description Too Long", description: `Meta description is ${metaDesc.length} characters and may be cut off.`, fix: "Trim to 120–160 characters.", value: metaDesc });
  } else {
    issues.push({ id: "seo-desc-ok", category: "seo", severity: "pass", title: "Meta Description Present", description: "Meta description is well-sized.", fix: "", value: metaDesc.substring(0, 80) + "..." });
  }

  // H1
  const h1s = $("h1");
  if (h1s.length === 0) {
    issues.push({ id: "seo-no-h1", category: "seo", severity: "critical", title: "Missing H1 Tag", description: "No H1 heading found. H1 is a primary signal for search engines about page content.", fix: "Add exactly one <h1> tag with your main keyword to every page." });
  } else if (h1s.length > 1) {
    issues.push({ id: "seo-multiple-h1", category: "seo", severity: "warning", title: "Multiple H1 Tags", description: `Found ${h1s.length} H1 tags. Having multiple H1s dilutes keyword relevance.`, fix: "Use only one <h1> tag per page.", value: `${h1s.length} H1 tags found` });
  } else {
    issues.push({ id: "seo-h1-ok", category: "seo", severity: "pass", title: "Single H1 Tag", description: "Exactly one H1 tag found.", fix: "", value: h1s.first().text().trim().substring(0, 60) });
  }

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  if (!canonical) {
    issues.push({ id: "seo-no-canonical", category: "seo", severity: "warning", title: "Missing Canonical URL", description: "No canonical tag found. This can lead to duplicate content issues.", fix: 'Add <link rel="canonical" href="' + url + '"> to your page <head>.' });
  } else {
    issues.push({ id: "seo-canonical-ok", category: "seo", severity: "pass", title: "Canonical URL Set", description: "Canonical tag is present.", fix: "", value: canonical });
  }

  // Open Graph
  const ogTitle = $('meta[property="og:title"]').attr("content");
  const ogImage = $('meta[property="og:image"]').attr("content");
  if (!ogTitle || !ogImage) {
    issues.push({ id: "seo-no-og", category: "seo", severity: "warning", title: "Missing Open Graph Tags", description: "Open Graph tags are missing. These control how your site appears when shared on social media.", fix: 'Add <meta property="og:title">, <meta property="og:description">, and <meta property="og:image"> to your <head>.' });
  } else {
    issues.push({ id: "seo-og-ok", category: "seo", severity: "pass", title: "Open Graph Tags Present", description: "og:title and og:image are set for social sharing.", fix: "" });
  }

  // Robots meta
  const robotsMeta = $('meta[name="robots"]').attr("content") || "";
  if (robotsMeta.includes("noindex")) {
    issues.push({ id: "seo-noindex", category: "seo", severity: "critical", title: "Page Blocked from Indexing", description: 'meta robots contains "noindex" — search engines will not index this page.', fix: 'Remove "noindex" from the robots meta tag unless intentional.', value: robotsMeta });
  }

  return issues;
}

function analyzeAccessibility($: cheerio.CheerioAPI): SiteIssue[] {
  const issues: SiteIssue[] = [];

  // Images without alt
  const imgsWithoutAlt = $("img:not([alt])");
  const imgsWithEmptyAlt = $('img[alt=""]');
  if (imgsWithoutAlt.length > 0) {
    issues.push({ id: "a11y-img-alt", category: "accessibility", severity: "critical", title: `${imgsWithoutAlt.length} Image(s) Missing Alt Text`, description: "Images without alt attributes are inaccessible to screen readers and harm SEO.", fix: "Add descriptive alt text to every meaningful image. Decorative images should have alt=\"\".", value: `${imgsWithoutAlt.length} images without alt` });
  } else {
    issues.push({ id: "a11y-img-alt-ok", category: "accessibility", severity: "pass", title: "All Images Have Alt Attributes", description: "Good — all img tags have alt attributes.", fix: "" });
  }

  // Lang attribute
  const langAttr = $("html").attr("lang");
  if (!langAttr) {
    issues.push({ id: "a11y-lang", category: "accessibility", severity: "warning", title: "Missing Language Declaration", description: "The <html> tag has no lang attribute. Screen readers need this to determine pronunciation.", fix: 'Add lang="en" (or appropriate language code) to your <html> tag.' });
  } else {
    issues.push({ id: "a11y-lang-ok", category: "accessibility", severity: "pass", title: "Language Declared", description: `Language is set to "${langAttr}".`, fix: "", value: langAttr });
  }

  // Form inputs without labels
  const inputsWithoutLabel = $("input:not([type='hidden']):not([type='submit']):not([type='button']):not([aria-label]):not([aria-labelledby])").filter((_, el) => {
    const id = $(el).attr("id");
    return !id || $(`label[for="${id}"]`).length === 0;
  });
  if (inputsWithoutLabel.length > 0) {
    issues.push({ id: "a11y-form-labels", category: "accessibility", severity: "warning", title: `${inputsWithoutLabel.length} Form Input(s) Without Labels`, description: "Form inputs without labels are confusing for screen reader users.", fix: "Associate each input with a <label for='inputId'> or add aria-label attributes.", value: `${inputsWithoutLabel.length} unlabeled inputs` });
  }

  return issues;
}

function analyzeMobile($: cheerio.CheerioAPI): SiteIssue[] {
  const issues: SiteIssue[] = [];

  const viewport = $('meta[name="viewport"]').attr("content");
  if (!viewport) {
    issues.push({ id: "mobile-no-viewport", category: "mobile", severity: "critical", title: "Missing Viewport Meta Tag", description: "No viewport meta tag found. The page will not render correctly on mobile devices.", fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to your <head>.' });
  } else if (!viewport.includes("width=device-width")) {
    issues.push({ id: "mobile-viewport-wrong", category: "mobile", severity: "warning", title: "Viewport Not Set to Device Width", description: "The viewport meta tag exists but may not be configured correctly for responsive layouts.", fix: 'Set content="width=device-width, initial-scale=1"', value: viewport });
  } else {
    issues.push({ id: "mobile-viewport-ok", category: "mobile", severity: "pass", title: "Mobile Viewport Configured", description: "Viewport is correctly set for responsive design.", fix: "", value: viewport });
  }

  return issues;
}

function analyzeSecurity(headers: Record<string, string>, url: string): SiteIssue[] {
  const issues: SiteIssue[] = [];

  // HTTPS
  if (!url.startsWith("https://")) {
    issues.push({ id: "sec-no-https", category: "security", severity: "critical", title: "Not Using HTTPS", description: "The site is served over HTTP, not HTTPS. This exposes user data and hurts SEO rankings.", fix: "Install an SSL certificate and redirect all HTTP traffic to HTTPS. Most hosts offer free Let's Encrypt certificates." });
  } else {
    issues.push({ id: "sec-https-ok", category: "security", severity: "pass", title: "HTTPS Enabled", description: "Site is served securely over HTTPS.", fix: "" });
  }

  // X-Frame-Options
  if (!headers["x-frame-options"] && !headers["content-security-policy"]?.includes("frame-ancestors")) {
    issues.push({ id: "sec-clickjack", category: "security", severity: "warning", title: "No Clickjacking Protection", description: "Missing X-Frame-Options or CSP frame-ancestors header. The page could be embedded in a malicious iframe.", fix: 'Add header: X-Frame-Options: SAMEORIGIN or add frame-ancestors in your Content-Security-Policy.' });
  } else {
    issues.push({ id: "sec-clickjack-ok", category: "security", severity: "pass", title: "Clickjacking Protection Active", description: "X-Frame-Options or CSP frame-ancestors is set.", fix: "" });
  }

  // X-Content-Type-Options
  if (!headers["x-content-type-options"]) {
    issues.push({ id: "sec-content-type", category: "security", severity: "warning", title: "Missing X-Content-Type-Options Header", description: "Without this header, browsers may sniff MIME types leading to XSS attacks.", fix: "Add header: X-Content-Type-Options: nosniff" });
  } else {
    issues.push({ id: "sec-content-type-ok", category: "security", severity: "pass", title: "MIME Sniffing Protected", description: "X-Content-Type-Options: nosniff is set.", fix: "" });
  }

  // HSTS
  if (url.startsWith("https://") && !headers["strict-transport-security"]) {
    issues.push({ id: "sec-hsts", category: "security", severity: "warning", title: "Missing HSTS Header", description: "HTTP Strict Transport Security is not set. Browsers won't automatically enforce HTTPS on repeat visits.", fix: "Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains" });
  } else if (headers["strict-transport-security"]) {
    issues.push({ id: "sec-hsts-ok", category: "security", severity: "pass", title: "HSTS Enabled", description: "Strict-Transport-Security is set.", fix: "", value: headers["strict-transport-security"] });
  }

  return issues;
}

function analyzePerformance($: cheerio.CheerioAPI, responseTime: number): SiteIssue[] {
  const issues: SiteIssue[] = [];

  // Response time
  if (responseTime > 3000) {
    issues.push({ id: "perf-slow", category: "performance", severity: "critical", title: "Slow Server Response Time", description: `Server took ${responseTime}ms to respond. Google recommends under 200ms for TTFB.`, fix: "Enable server-side caching, use a CDN, optimize database queries, or upgrade your hosting plan.", value: `${responseTime}ms` });
  } else if (responseTime > 1000) {
    issues.push({ id: "perf-moderate", category: "performance", severity: "warning", title: "Moderate Server Response Time", description: `Server responded in ${responseTime}ms. Aim for under 500ms.`, fix: "Enable caching (e.g. WP Rocket, W3 Total Cache), use a CDN, and optimize images.", value: `${responseTime}ms` });
  } else {
    issues.push({ id: "perf-fast", category: "performance", severity: "pass", title: "Fast Server Response", description: `Server responded in ${responseTime}ms.`, fix: "", value: `${responseTime}ms` });
  }

  // Render-blocking scripts in <head>
  const renderBlockingScripts = $("head script[src]:not([async]):not([defer])").length;
  if (renderBlockingScripts > 0) {
    issues.push({ id: "perf-render-block", category: "performance", severity: "warning", title: `${renderBlockingScripts} Render-Blocking Script(s) in <head>`, description: "Scripts without async or defer in <head> block page rendering and slow down the initial load.", fix: "Add async or defer attribute to non-critical scripts, or move them to just before </body>.", value: `${renderBlockingScripts} scripts` });
  } else {
    issues.push({ id: "perf-scripts-ok", category: "performance", severity: "pass", title: "No Render-Blocking Scripts", description: "All scripts use async/defer or are placed correctly.", fix: "" });
  }

  // Inline styles (excessive)
  const inlineStyles = $("[style]").length;
  if (inlineStyles > 20) {
    issues.push({ id: "perf-inline-styles", category: "performance", severity: "info", title: "Heavy Use of Inline Styles", description: `Found ${inlineStyles} elements with inline styles. This increases HTML size and prevents browser caching of CSS.`, fix: "Move styles to external CSS files so they can be cached by browsers.", value: `${inlineStyles} elements` });
  }

  // Images without width/height (layout shift)
  const imgsWithoutDimensions = $("img:not([width]):not([height])").length;
  if (imgsWithoutDimensions > 0) {
    issues.push({ id: "perf-img-dimensions", category: "performance", severity: "warning", title: `${imgsWithoutDimensions} Image(s) Missing Width/Height`, description: "Images without explicit dimensions cause Cumulative Layout Shift (CLS), which hurts Core Web Vitals.", fix: "Add width and height attributes to all img tags to reserve space during loading.", value: `${imgsWithoutDimensions} images` });
  } else {
    issues.push({ id: "perf-img-dimensions-ok", category: "performance", severity: "pass", title: "Images Have Dimensions", description: "All images have width/height attributes set.", fix: "" });
  }

  return issues;
}

function scoreCategory(issues: SiteIssue[], category: string): number {
  const catIssues = issues.filter((i) => i.category === category);
  if (catIssues.length === 0) return 100;
  let score = 100;
  catIssues.forEach((i) => {
    if (i.severity === "critical") score -= 25;
    else if (i.severity === "warning") score -= 10;
    else if (i.severity === "info") score -= 3;
  });
  return Math.max(0, score);
}

router.post("/analyze", heavyLimiter, async (req, res) => {
  let { url } = req.body as { url?: string };

  if (!url || typeof url !== "string") {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  // Normalize URL
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    new URL(url); // Validate URL format
  } catch {
    res.status(400).json({ error: "Invalid URL format. Please enter a valid website URL." });
    return;
  }

  req.log.info({ url }, "Starting site analysis");

  let html: string;
  let headers: Record<string, string>;
  let responseTime: number;

  try {
    ({ html, headers, responseTime } = await fetchSite(url));
  } catch (err: any) {
    const msg = err.name === "AbortError" ? "Request timed out after 15 seconds" : `Could not reach the URL: ${err.message}`;
    res.status(400).json({ error: msg, details: "Make sure the URL is publicly accessible and try again." });
    return;
  }

  const $ = cheerio.load(html);

  const title = $("title").text().trim() || "(No title found)";
  const description = $('meta[name="description"]').attr("content")?.trim() || "";
  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    new URL(url).origin + "/favicon.ico";

  const issues: SiteIssue[] = [
    ...analyzeSEO($, url),
    ...analyzeAccessibility($),
    ...analyzeMobile($),
    ...analyzeSecurity(headers, url),
    ...analyzePerformance($, responseTime),
  ];

  const scores = {
    seo: scoreCategory(issues, "seo"),
    performance: scoreCategory(issues, "performance"),
    security: scoreCategory(issues, "security"),
    accessibility: scoreCategory(issues, "accessibility"),
  };

  const summary = {
    critical: issues.filter((i) => i.severity === "critical").length,
    warnings: issues.filter((i) => i.severity === "warning").length,
    passes: issues.filter((i) => i.severity === "pass").length,
  };

  req.log.info({ url, summary }, "Site analysis complete");

  res.json({
    url,
    title,
    description,
    favicon,
    fetchedAt: new Date().toISOString(),
    scores,
    issues,
    summary,
  });
});

export default router;
