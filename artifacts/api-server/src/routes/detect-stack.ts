import { Router, type IRouter } from "express";
import * as cheerio from "cheerio";
import { httpGet } from "../utils/fetchUrl.js";

const router: IRouter = Router();

export interface DetectedTech {
  name: string;
  category: string;
  confidence: "high" | "medium" | "low";
  description: string;
  icon: string;
  version?: string;
}

type Pattern = { html?: string[]; headers?: Record<string, string>; scripts?: string[] };

interface FingerprintDef {
  name: string;
  category: string;
  description: string;
  icon: string;
  patterns: Pattern;
  versionPattern?: { source: "html" | "header"; key: string; regex: string };
}

const FINGERPRINTS: FingerprintDef[] = [
  // ── CMS ──────────────────────────────────────────────────────────────────────
  {
    name: "WordPress",
    category: "CMS",
    description: "The world's most popular CMS, powering 43% of the web.",
    icon: "🔵",
    patterns: { html: ["/wp-content/", "/wp-includes/", 'content="WordPress'] },
    versionPattern: { source: "html", key: "", regex: 'content="WordPress (\\d+\\.\\d+[.\\d]*)' },
  },
  {
    name: "Shopify",
    category: "CMS / eCommerce",
    description: "Leading hosted eCommerce platform.",
    icon: "🟢",
    patterns: { html: ["cdn.shopify.com", "Shopify.shop", "shopify-section", "myshopify.com"] },
  },
  {
    name: "Wix",
    category: "CMS",
    description: "Website builder platform.",
    icon: "⚫",
    patterns: { html: ["static.wixstatic.com", "wixapps.net", "X-Wix-Published-Version"] },
  },
  {
    name: "Squarespace",
    category: "CMS",
    description: "Design-focused website builder.",
    icon: "⬛",
    patterns: { html: ["squarespace.com", "squarespace-cdn.com", 'content="Squarespace'] },
  },
  {
    name: "Webflow",
    category: "CMS",
    description: "Visual web design tool with CMS.",
    icon: "🔷",
    patterns: { html: ["webflow.io", "webflow.js", 'generator" content="Webflow'] },
  },
  {
    name: "Ghost",
    category: "CMS",
    description: "Open-source publishing platform.",
    icon: "👻",
    patterns: { html: ["ghost.io", 'content="Ghost'] },
  },
  {
    name: "Drupal",
    category: "CMS",
    description: "Enterprise-grade open-source CMS.",
    icon: "💧",
    patterns: { html: ["Drupal.settings", 'content="Drupal', "/sites/default/files/"] },
  },
  {
    name: "Joomla",
    category: "CMS",
    description: "Popular open-source CMS.",
    icon: "🔴",
    patterns: { html: ['content="Joomla', "/media/jui/", "/components/com_"] },
  },

  // ── eCommerce ──────────────────────────────────────────────────────────────
  {
    name: "WooCommerce",
    category: "eCommerce",
    description: "WordPress eCommerce plugin.",
    icon: "🛍️",
    patterns: { html: ["woocommerce", "wc-block", "/wc-api/"] },
  },
  {
    name: "Magento",
    category: "eCommerce",
    description: "Enterprise eCommerce platform.",
    icon: "🧲",
    patterns: { html: ["MAGE_", "mage/", "magentocdn.com"] },
  },
  {
    name: "BigCommerce",
    category: "eCommerce",
    description: "Cloud eCommerce platform.",
    icon: "🏪",
    patterns: { html: ["cdn.bigcommerce.com", "bigcommerce.com/s-"] },
  },
  {
    name: "PrestaShop",
    category: "eCommerce",
    description: "Open-source eCommerce solution.",
    icon: "🎯",
    patterns: { html: ["prestashop", "modules/blocklayered"] },
  },

  // ── JavaScript Frameworks ─────────────────────────────────────────────────
  {
    name: "Next.js",
    category: "Framework",
    description: "React framework for production by Vercel.",
    icon: "▲",
    patterns: { html: ["/_next/static/", "__NEXT_DATA__", "__next"] },
  },
  {
    name: "Nuxt.js",
    category: "Framework",
    description: "Vue.js framework for universal apps.",
    icon: "💚",
    patterns: { html: ["/_nuxt/", "__NUXT__", "nuxt.js"] },
  },
  {
    name: "Gatsby",
    category: "Framework",
    description: "React-based static site generator.",
    icon: "💜",
    patterns: { html: ["gatsby-", "___gatsby", "gatsby.js"] },
  },
  {
    name: "Remix",
    category: "Framework",
    description: "Full-stack React framework.",
    icon: "⚡",
    patterns: { html: ["__remix", "remix-run"] },
  },
  {
    name: "React",
    category: "Library",
    description: "JavaScript library for building user interfaces.",
    icon: "⚛️",
    patterns: { html: ["react.development.js", "react.production.min.js", "data-reactroot", "__react"] },
  },
  {
    name: "Vue.js",
    category: "Library",
    description: "Progressive JavaScript framework.",
    icon: "🟩",
    patterns: { html: ["vue.min.js", "vue.js", "__vue__", "v-cloak"] },
  },
  {
    name: "Angular",
    category: "Framework",
    description: "TypeScript-based web application framework by Google.",
    icon: "🔺",
    patterns: { html: ["ng-version", "angular.min.js", "ng-app", "angular.js"] },
  },
  {
    name: "jQuery",
    category: "Library",
    description: "Fast, small, feature-rich JavaScript library.",
    icon: "🔵",
    patterns: { html: ["jquery.min.js", "jquery.js", "/jquery/"] },
  },
  {
    name: "Bootstrap",
    category: "CSS Framework",
    description: "Popular CSS framework for responsive design.",
    icon: "🅱️",
    patterns: { html: ["bootstrap.min.css", "bootstrap.css", "bootstrap.min.js"] },
  },
  {
    name: "Tailwind CSS",
    category: "CSS Framework",
    description: "Utility-first CSS framework.",
    icon: "🌊",
    patterns: { html: ["tailwindcss", "tailwind.css", "cdn.tailwindcss.com"] },
  },

  // ── Analytics & Marketing ─────────────────────────────────────────────────
  {
    name: "Google Analytics 4",
    category: "Analytics",
    description: "Google's latest analytics platform.",
    icon: "📊",
    patterns: { html: ["gtag/js?id=G-", "googletagmanager.com/gtag", "G-"] },
  },
  {
    name: "Google Analytics (UA)",
    category: "Analytics",
    description: "Universal Analytics (legacy Google Analytics).",
    icon: "📈",
    patterns: { html: ["google-analytics.com/analytics.js", "UA-", "ga.js"] },
  },
  {
    name: "Google Tag Manager",
    category: "Tag Manager",
    description: "Manage marketing tags without code changes.",
    icon: "🏷️",
    patterns: { html: ["googletagmanager.com/gtm.js", "GTM-", "googletagmanager.com/ns.html"] },
  },
  {
    name: "Hotjar",
    category: "Analytics",
    description: "Behavior analytics: heatmaps and session recordings.",
    icon: "🔥",
    patterns: { html: ["hotjar.com", "hjid:"] },
  },
  {
    name: "Meta Pixel",
    category: "Advertising",
    description: "Facebook/Meta conversion tracking.",
    icon: "🔵",
    patterns: { html: ["connect.facebook.net/en_US/fbevents.js", "fbq("] },
  },
  {
    name: "HubSpot",
    category: "CRM / Marketing",
    description: "All-in-one CRM and marketing platform.",
    icon: "🟠",
    patterns: { html: ["js.hs-scripts.com", "js.hubspot.com", "hubspot"] },
  },
  {
    name: "Intercom",
    category: "Customer Support",
    description: "Customer messaging platform.",
    icon: "💬",
    patterns: { html: ["intercomcdn.com", "window.Intercom", "intercom-messenger"] },
  },
  {
    name: "Zendesk",
    category: "Customer Support",
    description: "Customer service and engagement platform.",
    icon: "🎧",
    patterns: { html: ["static.zdassets.com", "zendesk.com", "zopim"] },
  },
  {
    name: "Crisp",
    category: "Customer Support",
    description: "Live chat and customer messaging platform.",
    icon: "💭",
    patterns: { html: ["client.crisp.chat", "crisp.chat"] },
  },
  {
    name: "Segment",
    category: "Analytics",
    description: "Customer data platform.",
    icon: "🔶",
    patterns: { html: ["cdn.segment.com", "analytics.js"] },
  },
  {
    name: "Mixpanel",
    category: "Analytics",
    description: "Product analytics platform.",
    icon: "📉",
    patterns: { html: ["cdn.mxpnl.com", "mixpanel"] },
  },
  {
    name: "Plausible",
    category: "Analytics",
    description: "Privacy-first, lightweight analytics.",
    icon: "🌱",
    patterns: { html: ["plausible.io/js"] },
  },
  {
    name: "Matomo",
    category: "Analytics",
    description: "Open-source web analytics platform.",
    icon: "🔍",
    patterns: { html: ["matomo.js", "piwik.js"] },
  },

  // ── Fonts ─────────────────────────────────────────────────────────────────
  {
    name: "Google Fonts",
    category: "Fonts",
    description: "Free web fonts by Google.",
    icon: "🅰️",
    patterns: { html: ["fonts.googleapis.com", "fonts.gstatic.com"] },
  },
  {
    name: "Adobe Fonts",
    category: "Fonts",
    description: "Professional web fonts by Adobe.",
    icon: "🔤",
    patterns: { html: ["use.typekit.net", "p.typekit.net"] },
  },
  {
    name: "Font Awesome",
    category: "Icons",
    description: "Popular icon library.",
    icon: "⭐",
    patterns: { html: ["use.fontawesome.com", "fontawesome.com", "fa-", "font-awesome"] },
  },

  // ── CDN & Hosting ─────────────────────────────────────────────────────────
  {
    name: "Cloudflare",
    category: "CDN / Security",
    description: "Global CDN, DDoS protection, and performance.",
    icon: "☁️",
    patterns: { headers: { "server": "cloudflare", "cf-ray": "" } },
  },
  {
    name: "AWS CloudFront",
    category: "CDN",
    description: "Amazon Web Services content delivery network.",
    icon: "🟡",
    patterns: { headers: { "x-cache": "cloudfront", "via": "cloudfront" } },
  },
  {
    name: "Fastly",
    category: "CDN",
    description: "Edge cloud platform.",
    icon: "⚡",
    patterns: { headers: { "x-served-by": "cache-", "x-cache": "HIT", "fastly-restarts": "" } },
  },
  {
    name: "Vercel",
    category: "Hosting",
    description: "Platform for frontend frameworks and static sites.",
    icon: "▲",
    patterns: { headers: { "x-vercel-id": "", "server": "vercel" } },
  },
  {
    name: "Netlify",
    category: "Hosting",
    description: "Platform for web apps and static sites.",
    icon: "💚",
    patterns: { headers: { "x-nf-request-id": "", "netlify-cdn-cache-control": "" } },
  },
  {
    name: "GitHub Pages",
    category: "Hosting",
    description: "Static site hosting from GitHub repositories.",
    icon: "⬛",
    patterns: { headers: { "server": "github.com" } },
  },
  {
    name: "WP Engine",
    category: "Hosting",
    description: "Managed WordPress hosting.",
    icon: "🔵",
    patterns: { headers: { "x-cacheable": "", "x-cache-group": "" } },
  },
  {
    name: "Pantheon",
    category: "Hosting",
    description: "Managed Drupal & WordPress hosting.",
    icon: "⚪",
    patterns: { headers: { "x-pantheon-styx-hostname": "", "x-styx-req-id": "" } },
  },

  // ── Web Servers ───────────────────────────────────────────────────────────
  {
    name: "nginx",
    category: "Web Server",
    description: "High-performance HTTP server and reverse proxy.",
    icon: "🟢",
    patterns: { headers: { "server": "nginx" } },
  },
  {
    name: "Apache",
    category: "Web Server",
    description: "The most widely used web server software.",
    icon: "🪶",
    patterns: { headers: { "server": "apache" } },
  },
  {
    name: "Microsoft IIS",
    category: "Web Server",
    description: "Microsoft's web server for Windows.",
    icon: "🪟",
    patterns: { headers: { "server": "microsoft-iis" } },
  },
  {
    name: "Caddy",
    category: "Web Server",
    description: "Modern, automatic HTTPS web server.",
    icon: "🦆",
    patterns: { headers: { "server": "caddy" } },
  },
  {
    name: "LiteSpeed",
    category: "Web Server",
    description: "High-performance web server.",
    icon: "🚀",
    patterns: { headers: { "server": "litespeed", "x-litespeed-tag": "" } },
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    name: "reCAPTCHA",
    category: "Security",
    description: "Google's bot protection service.",
    icon: "🤖",
    patterns: { html: ["www.google.com/recaptcha", "hcaptcha.com"] },
  },
  {
    name: "Cloudflare Turnstile",
    category: "Security",
    description: "Privacy-friendly CAPTCHA alternative.",
    icon: "🔄",
    patterns: { html: ["challenges.cloudflare.com/turnstile"] },
  },

  // ── Payment ───────────────────────────────────────────────────────────────
  {
    name: "Stripe",
    category: "Payments",
    description: "Online payment processing platform.",
    icon: "💳",
    patterns: { html: ["js.stripe.com", "stripe.com/v3"] },
  },
  {
    name: "PayPal",
    category: "Payments",
    description: "Global online payment system.",
    icon: "🅿️",
    patterns: { html: ["paypal.com/sdk/js", "paypalobjects.com"] },
  },
];

function detectTech(html: string, headers: Record<string, string>): DetectedTech[] {
  const detected: DetectedTech[] = [];
  const lowerHtml = html.toLowerCase();

  for (const fp of FINGERPRINTS) {
    let matched = false;
    let confidence: DetectedTech["confidence"] = "medium";
    let matchCount = 0;

    // Check HTML patterns
    if (fp.patterns.html) {
      for (const pat of fp.patterns.html) {
        if (lowerHtml.includes(pat.toLowerCase())) {
          matchCount++;
        }
      }
      if (matchCount >= 2) { matched = true; confidence = "high"; }
      else if (matchCount === 1) { matched = true; confidence = "medium"; }
    }

    // Check header patterns
    if (fp.patterns.headers) {
      for (const [hKey, hVal] of Object.entries(fp.patterns.headers)) {
        const actualVal = (headers[hKey] || "").toLowerCase();
        if (hVal === "" ? actualVal.length > 0 : actualVal.includes(hVal.toLowerCase())) {
          matched = true;
          confidence = "high";
        }
      }
    }

    if (matched) {
      let version: string | undefined;
      // Try version extraction
      if (fp.versionPattern) {
        const src = fp.versionPattern.source === "html" ? html : Object.values(headers).join(" ");
        const match = src.match(new RegExp(fp.versionPattern.regex));
        if (match?.[1]) version = match[1];
      }
      detected.push({
        name: fp.name,
        category: fp.category,
        confidence,
        description: fp.description,
        icon: fp.icon,
        ...(version ? { version } : {}),
      });
    }
  }

  return detected;
}

router.post("/detect-stack", async (req, res) => {
  const { url: rawUrl } = req.body as { url?: string };
  if (!rawUrl?.trim()) {
    res.status(400).json({ error: "url is required" });
    return;
  }

  let url = rawUrl.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  try {
    new URL(url);
  } catch {
    res.status(400).json({ error: "Invalid URL format" });
    return;
  }

  try {
    const start = Date.now();
    const { html, headers, status } = await httpGet(url);
    const responseTime = Date.now() - start;

    if (status >= 400 && status < 600) {
      res.status(400).json({ error: `Site returned HTTP ${status}` });
      return;
    }

    const $ = cheerio.load(html);
    const title = $("title").first().text().trim() || url;
    const favicon =
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="icon"]').attr("href") ||
      `${new URL(url).origin}/favicon.ico`;

    const technologies = detectTech(html, headers);

    // Group by category for summary
    const categoryMap: Record<string, number> = {};
    for (const t of technologies) {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
    }

    const securityFeatures = {
      https: url.startsWith("https://"),
      hsts: !!headers["strict-transport-security"],
      csp: !!headers["content-security-policy"],
      xFrameOptions: !!headers["x-frame-options"],
      xContentType: !!headers["x-content-type-options"],
    };

    res.json({
      url,
      title,
      favicon: favicon.startsWith("http") ? favicon : new URL(favicon, url).href,
      detectedAt: new Date().toISOString(),
      responseTime,
      technologies,
      summary: {
        totalDetected: technologies.length,
        categories: Object.keys(categoryMap),
        categoryMap,
      },
      security: securityFeatures,
    });
  } catch (err: any) {
    res.status(400).json({
      error: `Could not reach the URL: ${err.message}`,
      details: "Make sure the URL is publicly accessible and try again.",
    });
  }
});

export default router;
