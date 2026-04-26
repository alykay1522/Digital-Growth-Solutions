import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ToolPaywall } from "@/components/ToolPaywall";
import { useMeta } from "@/hooks/useMeta";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Globe,
  ImageOff,
  Loader2,
  Package,
  Search,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getToolToken } from "@/utils/toolAccess";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

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

const PLATFORM_COLORS: Record<string, string> = {
  Shopify: "bg-green-100 text-green-700 border-green-200",
  WooCommerce: "bg-violet-100 text-violet-700 border-violet-200",
  BigCommerce: "bg-blue-100 text-blue-700 border-blue-200",
  Squarespace: "bg-gray-100 text-gray-700 border-gray-200",
  Magento: "bg-orange-100 text-orange-700 border-orange-200",
  WordPress: "bg-sky-100 text-sky-700 border-sky-200",
  Unknown: "bg-muted text-muted-foreground border-border",
};

const EXAMPLE_URLS = [
  "https://allbirds.com/collections/mens",
  "https://gymshark.com/collections/mens-t-shirts",
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const [imgErr, setImgErr] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const mainImg = product.images[0];
  const hasDiscount =
    product.comparePrice &&
    product.price &&
    parseFloat(product.comparePrice.replace(/[^0-9.]/g, "")) >
      parseFloat(product.price.replace(/[^0-9.]/g, ""));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
      className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-primary/30 transition-all group"
    >
      <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
        {mainImg && !imgErr ? (
          <img
            src={mainImg}
            alt={product.name}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
        {product.inStock === false && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
            Out of Stock
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
            Sale
          </div>
        )}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded-full">
            +{product.images.length - 1} more
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-secondary leading-snug mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-2">
          {product.price ? (
            <span className="text-base font-bold text-secondary">{product.price}</span>
          ) : (
            <span className="text-xs text-muted-foreground italic">Price unavailable</span>
          )}
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{product.comparePrice}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.category && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
              {product.category}
            </span>
          )}
          {product.sku && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-mono">
              {product.sku}
            </span>
          )}
        </div>

        {product.description && (
          <div className="mb-3">
            <p className={`text-xs text-muted-foreground leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
              {product.description}
            </p>
            {product.description.length > 100 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary mt-1 hover:underline"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Less" : "More"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {product.images.length} image{product.images.length !== 1 ? "s" : ""}
          </span>
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function downloadCsv(result: SniffResult) {
  const headers = ["Name", "Price", "Compare Price", "SKU", "Category", "In Stock", "URL", "Image 1", "Description"];
  const rows = result.products.map((p) => [
    p.name,
    p.price || "",
    p.comparePrice || "",
    p.sku || "",
    p.category || "",
    p.inStock === null ? "" : p.inStock ? "Yes" : "No",
    p.url || "",
    p.images[0] || "",
    (p.description || "").replace(/"/g, "'"),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `products-${new URL(result.url).hostname}-${Date.now()}.csv`;
  a.click();
}

function SniffTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SniffResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");

  const handleSniff = async (targetUrl?: string) => {
    const sniffUrl = (targetUrl ?? url).trim();
    if (!sniffUrl) { setError("Please enter a website URL."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const toolToken = getToolToken("product-sniffer");
      const res = await fetch(`${BASE_URL}/api/sniff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(toolToken ? { "x-tool-token": toolToken } : {}),
        },
        body: JSON.stringify({ url: sniffUrl, limit: 60 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setFilterCategory("All");
    } catch (e: any) {
      setError(e?.message || "Failed to analyze the site. Make sure it's a public URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result.products, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = result
    ? ["All", ...Array.from(new Set(result.products.map((p) => p.category).filter(Boolean) as string[]))]
    : ["All"];

  const filtered =
    result && filterCategory !== "All"
      ? result.products.filter((p) => p.category === filterCategory)
      : result?.products || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <ShoppingBag className="w-4 h-4" />
            Free Product Extractor
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
            Website Product Sniffer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any eCommerce store URL — Shopify, WooCommerce, BigCommerce, and more. Extract every product with name, price, images, SKU, and description instantly.
          </p>

          {/* Platform badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              { label: "Shopify", color: "bg-green-50 text-green-700 border-green-200" },
              { label: "WooCommerce", color: "bg-violet-50 text-violet-700 border-violet-200" },
              { label: "BigCommerce", color: "bg-blue-50 text-blue-700 border-blue-200" },
              { label: "Magento", color: "bg-orange-50 text-orange-700 border-orange-200" },
              { label: "Any Site", color: "bg-gray-50 text-gray-700 border-gray-200" },
            ].map(({ label, color }) => (
              <span key={label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${color}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Input card */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Store or Collection URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSniff()}
                placeholder="https://yourstore.com/collections/all"
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button
              onClick={() => handleSniff()}
              disabled={loading}
              className="h-12 px-7 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 shrink-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sniffing…</>
              ) : (
                <><Search className="w-4 h-4 mr-2" />Sniff</>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Tips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium">Try:</span>
            {EXAMPLE_URLS.map((ex) => (
              <button
                key={ex}
                onClick={() => { setUrl(ex); handleSniff(ex); }}
                className="text-primary hover:underline"
              >
                {new URL(ex).hostname}{new URL(ex).pathname}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
            {[
              { icon: ShoppingBag, label: "Shopify API", color: "text-green-600 bg-green-50" },
              { icon: Package, label: "WooCommerce", color: "text-violet-600 bg-violet-50" },
              { icon: Zap, label: "JSON-LD schema", color: "text-amber-600 bg-amber-50" },
              { icon: Globe, label: "HTML fallback", color: "text-blue-600 bg-blue-50" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl ${color}`}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-primary animate-pulse" />
              </div>
            </div>
            <p className="font-semibold text-secondary mb-1">Sniffing the site…</p>
            <p className="text-sm text-muted-foreground">
              Fetching and parsing product data. This usually takes 5–15 seconds.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 pb-20"
          >
            {/* Summary bar */}
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-5">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-semibold ${
                    PLATFORM_COLORS[result.platform] || PLATFORM_COLORS.Unknown
                  }`}
                >
                  {result.platform}
                  {result.platformConfidence === "high" && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Products found</p>
                  <p className="text-2xl font-display font-bold text-secondary leading-none">{result.totalFound}</p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Page type</p>
                  <p className="text-sm font-semibold text-secondary capitalize">{result.pageType}</p>
                </div>

                <div className="max-w-[240px]">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Site</p>
                  <p className="text-sm font-semibold text-secondary truncate">{result.siteTitle}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-xl gap-1.5">
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy JSON"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadCsv(result)} className="rounded-xl gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  CSV
                </Button>
              </div>
            </div>

            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      filterCategory === cat
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* No products state */}
            {result.products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-10 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="font-bold text-secondary text-xl mb-2">No products detected</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                  We couldn't extract products from this page. Try linking directly to a product listing or collection page, or a single product page.
                </p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <p className="font-medium text-secondary">Tips:</p>
                  <p>• Use a collection URL like <code className="bg-gray-100 px-1 rounded">/collections/all</code></p>
                  <p>• Try a direct product page URL</p>
                  <p>• Shopify: append <code className="bg-gray-100 px-1 rounded">/products.json</code> to the domain</p>
                </div>
              </div>
            ) : (
              <>
                {/* Product grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* CTA */}
                <div className="bg-secondary rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-display font-bold mb-3">Thinking about migrating?</h3>
                  <p className="text-white/70 mb-6 max-w-lg mx-auto">
                    We migrate product catalogs between Shopify, WooCommerce, and custom platforms — cleanly, without losing SEO equity or customer data.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/contact">
                      <Button className="bg-accent hover:bg-accent/90 text-secondary font-bold rounded-xl h-11 px-6">
                        Talk to a migration expert
                      </Button>
                    </Link>
                    <Link href="/compare">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6">
                        Compare two stores
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !result && (
        <div className="max-w-3xl mx-auto px-4 pb-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: ShoppingBag, title: "Enter any store URL", desc: "Works with collection pages, product pages, or store homepages" },
              { icon: Zap, title: "Instant extraction", desc: "We detect the platform and use the best available method to extract products" },
              { icon: Download, title: "Export in seconds", desc: "Download as CSV for Excel / Sheets, or copy as JSON for developers" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-border p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-bold text-secondary mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sniff() {
  useMeta({
    title: "Product Sniffer — Extract Store Data",
    description: "Extract every product from any Shopify, WooCommerce, or BigCommerce store in seconds. Names, prices, images, SKUs — download as CSV. $9.99 for 24-hour access.",
    path: "/sniff",
  });
  return (
    <ToolPaywall
      toolKey="product-sniffer"
      toolName="Product Sniffer"
      tagline="Extract every product — name, price, images, SKU, and description — from any Shopify, WooCommerce, or BigCommerce store in seconds."
      price="$9.99"
      priceLabel="24-hour access"
      accentClass="text-pink-600"
      iconBgClass="bg-pink-50"
      features={[
        "Extract up to 60 products per scan including names, prices, SKUs and images",
        "Supports Shopify, WooCommerce, BigCommerce, Magento and more",
        "Download results as CSV for Excel or Google Sheets",
        "Copy full product data as JSON for developers",
        "Category filtering to browse by product type",
        "Unlimited scans for 24 hours — scan as many stores as you like",
      ]}
    >
      <SniffTool />
    </ToolPaywall>
  );
}
