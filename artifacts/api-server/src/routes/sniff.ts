import { Router, type Request, type Response } from "express";
import https from "https";
import http from "http";
import { load } from "cheerio";

const router = Router();

interface Product {
  id: string;
  name: string;
  price: string | null;
  comparePrice: string | null;
  description: string | null;
  images: string[];
  url: string | null;
  sku: string | null;
  category: string | null;
  inStock: boolean | null;
  currency: string | null;
}

interface SniffResult {
  url: string;
  platform: string;
  platformConfidence: "high" | "medium" | "low";
  siteTitle: string;
  pageType: "product" | "collection" | "homepage" | "unknown";
  products: Product[];
  totalFound: number;
  scrapedAt: string;
}

function fetchUrl(rawUrl: string): Promise<{ body: string; finalUrl: string; headers: Record<string, string> }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(rawUrl);
    const lib = parsed.protocol === "https:" ? https : http;
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DGSAuditBot/1.0)",
        Accept: "text/html,application/json,*/*",
      },
      rejectUnauthorized: false,
      timeout: 12000,
    };

    const req = lib.get(options, (res) => {
      // Handle redirects
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : `${parsed.protocol}//${parsed.hostname}${res.headers.location}`;
        fetchUrl(next).then(resolve).catch(reject);
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => {
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.headers)) {
          if (typeof v === "string") headers[k] = v;
          else if (Array.isArray(v)) headers[k] = v[0];
        }
        resolve({ body: Buffer.concat(chunks).toString("utf8"), finalUrl: rawUrl, headers });
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Request timed out")); });
  });
}

function cleanPrice(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 60);
}

function cleanText(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 500);
}

function absoluteUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

function detectPlatform(body: string, headers: Record<string, string>): { platform: string; confidence: "high" | "medium" | "low" } {
  const lower = body.toLowerCase();
  const powered = headers["x-powered-by"] || "";

  if (lower.includes("shopify") && (lower.includes("cdn.shopify") || lower.includes("shopifypreview"))) {
    return { platform: "Shopify", confidence: "high" };
  }
  if (lower.includes("woocommerce") || lower.includes("wc-") && lower.includes("product")) {
    return { platform: "WooCommerce", confidence: "high" };
  }
  if (lower.includes("bigcommerce") || lower.includes("cdn.bigcommerce")) {
    return { platform: "BigCommerce", confidence: "high" };
  }
  if (lower.includes("squarespace") || lower.includes("static.squarespace")) {
    return { platform: "Squarespace", confidence: "high" };
  }
  if (lower.includes("magento") || lower.includes("mage/cookies")) {
    return { platform: "Magento", confidence: "high" };
  }
  if (lower.includes("wp-content") || lower.includes("wordpress")) {
    return { platform: "WordPress", confidence: "high" };
  }
  if (powered.toLowerCase().includes("shopify")) return { platform: "Shopify", confidence: "high" };
  if (lower.includes("etsy.com") || lower.includes("listing")) return { platform: "Etsy", confidence: "medium" };
  return { platform: "Unknown", confidence: "low" };
}

function parseJsonLdProducts(body: string, baseUrl: string): Product[] {
  const products: Product[] = [];
  const scriptRe = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRe.exec(body)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const items: any[] = Array.isArray(data) ? data : [data];
      for (const item of items) {
        const nodes: any[] = item["@graph"] || [item];
        for (const node of nodes) {
          if (node["@type"] === "Product") {
            const offers = node.offers
              ? Array.isArray(node.offers)
                ? node.offers[0]
                : node.offers
              : null;
            products.push({
              id: `jsonld-${products.length}`,
              name: node.name || "",
              price: offers?.price ? `${offers.priceCurrency || ""} ${offers.price}`.trim() : null,
              comparePrice: null,
              description: cleanText(node.description || ""),
              images: (node.image ? (Array.isArray(node.image) ? node.image : [node.image]) : []).map((img: any) =>
                typeof img === "string" ? absoluteUrl(baseUrl, img) : absoluteUrl(baseUrl, img?.url || "")
              ).filter(Boolean).slice(0, 5),
              url: node.url ? absoluteUrl(baseUrl, node.url) : null,
              sku: node.sku || offers?.sku || null,
              category: node.category || null,
              inStock: offers?.availability ? !offers.availability.toLowerCase().includes("outofstock") : null,
              currency: offers?.priceCurrency || null,
            });
          }
        }
      }
    } catch {}
  }
  return products;
}

function parseShopifyProducts(body: string, baseUrl: string): Product[] {
  // Try to extract from Shopify's window.meta or product JSON in page
  const products: Product[] = [];

  // Check for product JSON blobs (Shopify embeds product data in script tags)
  const productJsonRe = /var\s+meta\s*=\s*(\{[\s\S]+?\});/;
  const match = productJsonRe.exec(body);
  if (match) {
    try {
      const meta = JSON.parse(match[1]);
      if (meta.product) {
        const p = meta.product;
        const variant = p.variants?.[0];
        products.push({
          id: String(p.id || "shopify-0"),
          name: p.title || "",
          price: variant?.price ? `${(parseInt(variant.price) / 100).toFixed(2)}` : null,
          comparePrice: variant?.compare_at_price ? `${(parseInt(variant.compare_at_price) / 100).toFixed(2)}` : null,
          description: cleanText(p.description?.replace(/<[^>]+>/g, " ") || ""),
          images: (p.images || []).map((img: any) => img?.src || img).filter(Boolean).slice(0, 5),
          url: p.handle ? `${baseUrl}/products/${p.handle}` : null,
          sku: variant?.sku || null,
          category: p.type || null,
          inStock: p.available !== false,
          currency: null,
        });
      }
    } catch {}
  }
  return products;
}

function parseHtmlProducts($: ReturnType<typeof load>, baseUrl: string, platform: string): Product[] {
  const products: Product[] = [];

  // WooCommerce product listing
  if (platform === "WooCommerce") {
    $(".product, .woocommerce-LoopProduct-link, li.product").each((_: number, el: any) => {
      const elem = $(el);
      const name = elem.find(".woocommerce-loop-product__title, h2, h3").first().text().trim();
      if (!name) return;
      const priceEl = elem.find(".price .woocommerce-Price-amount").first();
      const price = priceEl.text().trim();
      const compareEl = elem.find(".price del .woocommerce-Price-amount").first();
      const comparePrice = compareEl.text().trim();
      const imgEl = elem.find("img").first();
      const imgSrc = imgEl.attr("data-src") || imgEl.attr("src") || "";
      const linkEl = elem.find("a.woocommerce-LoopProduct-link, a").first();
      const url = linkEl.attr("href") || null;
      products.push({
        id: `wc-${products.length}`,
        name,
        price: price || null,
        comparePrice: comparePrice || null,
        description: null,
        images: imgSrc ? [absoluteUrl(baseUrl, imgSrc)] : [],
        url: url ? absoluteUrl(baseUrl, url) : null,
        sku: null,
        category: null,
        inStock: !elem.find(".out-of-stock, .outofstock").length,
        currency: null,
      });
    });
  }

  // Generic product card patterns
  if (!products.length) {
    const candidates = [
      ".product-card", ".product-item", "[data-product]", ".card.product",
      ".product-tile", ".product-grid-item", ".item-product",
    ];
    for (const sel of candidates) {
      if ($(sel).length > 0) {
        $(sel).each((_: number, el: any) => {
          const elem = $(el);
          const name =
            elem.find("h2,h3,h4,.product-title,.product-name,.item-title").first().text().trim() ||
            elem.find("[data-product-title]").first().text().trim();
          if (!name || name.length < 2) return;
          const priceEl =
            elem.find(".price,.product-price,.amount,[data-price],[data-product-price]").first();
          const price = priceEl.text().trim();
          const imgEl = elem.find("img").first();
          const imgSrc = imgEl.attr("data-src") || imgEl.attr("data-lazy-src") || imgEl.attr("src") || "";
          const linkEl = elem.find("a").first();
          const url = linkEl.attr("href") || null;
          products.push({
            id: `generic-${products.length}`,
            name: name.slice(0, 200),
            price: price ? cleanPrice(price) : null,
            comparePrice: null,
            description: elem.find(".product-description, .description, p").first().text().trim().slice(0, 300) || null,
            images: imgSrc ? [absoluteUrl(baseUrl, imgSrc)] : [],
            url: url ? absoluteUrl(baseUrl, url) : null,
            sku: elem.attr("data-sku") || null,
            category: null,
            inStock: null,
            currency: null,
          });
        });
        if (products.length) break;
      }
    }
  }

  return products;
}

function detectPageType(body: string, $: ReturnType<typeof load>): "product" | "collection" | "homepage" | "unknown" {
  const lower = body.toLowerCase();
  if (lower.includes('"@type":"product"') || lower.includes('"@type": "product"')) return "product";
  if ($(".woocommerce-product-details__short-description, .product-single__title, .product__title").length) return "product";
  if ($(".products, .product-grid, .collection-products, [class*=product-list]").length > 0) return "collection";
  if ($("body.home, body.front-page").length || lower.includes("homepage")) return "homepage";
  return "unknown";
}

router.post("/sniff", async (req: Request, res: Response) => {
  try {
    let { url, limit = 50 } = req.body as { url: string; limit?: number };
    if (!url?.trim()) {
      return res.status(400).json({ error: "URL is required" });
    }

    // Normalize URL
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
    const parsedBase = new URL(url);
    const baseOrigin = `${parsedBase.protocol}//${parsedBase.hostname}`;
    const maxProducts = Math.min(limit, 100);

    // Fetch main page
    const { body, finalUrl, headers } = await fetchUrl(url);
    const { platform, confidence } = detectPlatform(body, headers);
    const $ = load(body);
    const pageType = detectPageType(body, $);
    const siteTitle = $("title").first().text().trim() || parsedBase.hostname;

    let products: Product[] = [];

    // Strategy 1: Shopify API endpoint — try /products.json for collection pages
    if (platform === "Shopify" && (pageType === "collection" || pageType === "homepage" || pageType === "unknown")) {
      try {
        const apiUrl = `${baseOrigin}/products.json?limit=${maxProducts}`;
        const { body: apiBody } = await fetchUrl(apiUrl);
        const data = JSON.parse(apiBody);
        if (data.products?.length) {
          for (const p of data.products.slice(0, maxProducts)) {
            const variant = p.variants?.[0];
            products.push({
              id: String(p.id),
              name: p.title,
              price: variant?.price || null,
              comparePrice: variant?.compare_at_price || null,
              description: cleanText((p.body_html || "").replace(/<[^>]+>/g, " ")),
              images: (p.images || []).map((img: any) => img.src).slice(0, 5),
              url: `${baseOrigin}/products/${p.handle}`,
              sku: variant?.sku || null,
              category: p.product_type || null,
              inStock: p.available !== false,
              currency: null,
            });
          }
        }
      } catch {}
    }

    // Strategy 2: Shopify single product JSON endpoint
    if (platform === "Shopify" && !products.length && pageType === "product") {
      try {
        const productApiUrl = url.replace(/\?.*$/, "") + ".json";
        const { body: pBody } = await fetchUrl(productApiUrl);
        const data = JSON.parse(pBody);
        if (data.product) {
          const p = data.product;
          const variant = p.variants?.[0];
          products.push({
            id: String(p.id),
            name: p.title,
            price: variant?.price || null,
            comparePrice: variant?.compare_at_price || null,
            description: cleanText((p.body_html || "").replace(/<[^>]+>/g, " ")),
            images: (p.images || []).map((img: any) => img.src).slice(0, 5),
            url: `${baseOrigin}/products/${p.handle}`,
            sku: variant?.sku || null,
            category: p.product_type || null,
            inStock: p.available !== false,
            currency: null,
          });
        }
      } catch {}
    }

    // Strategy 3: JSON-LD schema.org/Product
    if (!products.length) {
      products = parseJsonLdProducts(body, baseOrigin);
    }

    // Strategy 4: Shopify embedded meta
    if (!products.length && platform === "Shopify") {
      products = parseShopifyProducts(body, baseOrigin);
    }

    // Strategy 5: HTML parsing
    if (!products.length) {
      products = parseHtmlProducts($, baseOrigin, platform);
    }

    // Strategy 6: Look for WooCommerce product JSON in page scripts
    if (!products.length && platform === "WooCommerce") {
      const wcDataRe = /wc_add_to_cart_params\s*=\s*({[\s\S]+?});/;
      const wcMatch = wcDataRe.exec(body);
      if (wcMatch) {
        // We have WooCommerce but couldn't extract products — try category URL pattern
        const catApiUrl = url.includes("?") ? `${url}&per_page=50` : `${url}?per_page=50`;
        try {
          const { body: catBody } = await fetchUrl(catApiUrl);
          const cat$ = load(catBody);
          const parsed = parseHtmlProducts(cat$, baseOrigin, platform);
          products.push(...parsed);
        } catch {}
      }
    }

    // Deduplicate by name
    const seen = new Set<string>();
    products = products.filter((p) => {
      const key = p.name.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    products = products.slice(0, maxProducts);

    const result: SniffResult = {
      url: finalUrl,
      platform,
      platformConfidence: confidence,
      siteTitle,
      pageType,
      products,
      totalFound: products.length,
      scrapedAt: new Date().toISOString(),
    };

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to sniff the website" });
  }
});

export default router;
