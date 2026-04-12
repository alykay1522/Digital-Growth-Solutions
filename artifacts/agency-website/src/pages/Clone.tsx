import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ToolPaywall } from "@/components/ToolPaywall";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Image,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  Code2,
  Layers,
  RefreshCw,
  Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

interface CloneMeta {
  title: string;
  description: string;
  favicon: string;
  url: string;
  originalSize: number;
  clonedSize: number;
  cssInlined: number;
  totalScripts: number;
  totalImages: number;
  clonedAt: string;
}

type ViewportMode = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<ViewportMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const EXAMPLE_SITES = [
  "https://vercel.com",
  "https://stripe.com",
  "https://linear.app",
  "https://notion.so",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function CloneTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [meta, setMeta] = useState<CloneMeta | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleClone = async (targetUrl?: string) => {
    const cloneUrl = (targetUrl ?? url).trim();
    if (!cloneUrl) { setError("Enter a URL to clone."); return; }
    setError("");
    setLoading(true);
    setHtml(null);
    setMeta(null);
    setTab("preview");

    try {
      const res = await fetch(`${BASE_URL}/api/clone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cloneUrl, inlineStyles: true }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHtml(data.html);
      setMeta(data.meta);
    } catch (e: any) {
      setError(e?.message || "Failed to clone the site. Try a different URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!html || !meta) return;
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const domain = (() => { try { return new URL(meta.url).hostname; } catch { return "clone"; } })();
    a.download = `${domain}-clone.html`;
    a.click();
  };

  const handleCopyHtml = () => {
    if (!html) return;
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const iframeSrc = html
    ? `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-sm font-semibold mb-5">
            <Scissors className="w-4 h-4" />
            Free Site Cloner
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
            Clone Any Website
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any public URL. We'll fetch it, inline all the CSS, fix every asset path, and hand you a self-contained HTML file you can open anywhere — no server required.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
            {[
              { icon: Layers, label: "CSS inlined" },
              { icon: Globe, label: "Assets made absolute" },
              { icon: Image, label: "Images preserved" },
              { icon: Download, label: "Single-file download" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-border text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-violet-500" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* URL input */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Website URL to Clone
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClone()}
                placeholder="https://example.com"
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button
              onClick={() => handleClone()}
              disabled={loading}
              className="h-12 px-7 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 shrink-0"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Cloning…</>
              ) : (
                <><Scissors className="w-4 h-4 mr-2" />Clone</>
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium">Try:</span>
            {EXAMPLE_SITES.map((s) => (
              <button
                key={s}
                onClick={() => { setUrl(s); handleClone(s); }}
                className="text-violet-600 hover:underline"
              >
                {new URL(s).hostname}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-3">
            Works on any publicly accessible website. The clone is a static snapshot — interactive features like logins and forms won't function.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-3xl mx-auto px-4 pb-10">
          <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
              <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
              <div className="absolute inset-3 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-violet-500" />
              </div>
            </div>
            <p className="font-semibold text-secondary text-lg mb-1">Cloning the site…</p>
            <p className="text-sm text-muted-foreground">Fetching HTML, inlining CSS, resolving assets. Usually takes 5–15 seconds.</p>
            <div className="mt-4 flex justify-center gap-3 text-xs text-muted-foreground">
              {["Fetching HTML", "Inlining CSS", "Fixing assets"].map((step, i) => (
                <div key={step} className="flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin text-violet-400" style={{ animationDelay: `${i * 0.3}s` }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      <AnimatePresence>
        {html && meta && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 pb-20"
          >
            {/* Stats bar */}
            <div className="bg-white rounded-2xl border border-border p-4 shadow-sm mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-5">
                {/* Favicon + title */}
                <div className="flex items-center gap-2">
                  <img
                    src={meta.favicon}
                    alt="favicon"
                    className="w-5 h-5 rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <span className="font-semibold text-secondary text-sm truncate max-w-[200px]">{meta.title || meta.url}</span>
                </div>

                <StatChip label="CSS sheets inlined" value={String(meta.cssInlined)} />
                <StatChip label="Images" value={String(meta.totalImages)} />
                <StatChip label="Clone size" value={formatBytes(meta.clonedSize)} />

                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
                >
                  Original <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyHtml} className="rounded-xl gap-1.5">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy HTML"}
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownload}
                  className="rounded-xl gap-1.5 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .html
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClone()}
                  className="rounded-xl gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Re-clone
                </Button>
              </div>
            </div>

            {/* Tabs + viewport switcher */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-1 bg-white border border-border rounded-xl p-1">
                <button
                  onClick={() => setTab("preview")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === "preview" ? "bg-secondary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Monitor className="w-3.5 h-3.5 inline mr-1.5" />Preview
                </button>
                <button
                  onClick={() => setTab("code")}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${tab === "code" ? "bg-secondary text-white" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Code2 className="w-3.5 h-3.5 inline mr-1.5" />HTML
                </button>
              </div>

              {tab === "preview" && (
                <div className="flex gap-1 bg-white border border-border rounded-xl p-1">
                  {(["desktop", "tablet", "mobile"] as ViewportMode[]).map((v) => {
                    const Icon = v === "desktop" ? Monitor : v === "tablet" ? Tablet : Smartphone;
                    return (
                      <button
                        key={v}
                        onClick={() => setViewport(v)}
                        className={`p-1.5 rounded-lg transition-colors ${viewport === v ? "bg-secondary text-white" : "text-muted-foreground hover:text-foreground"}`}
                        title={v}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Preview iframe */}
            {tab === "preview" && (
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white border border-border rounded-lg px-3 py-1 text-xs text-muted-foreground truncate">
                      {meta.url}
                    </div>
                  </div>
                </div>
                <div
                  className="transition-all duration-300 overflow-x-auto"
                  style={{ background: "#f3f4f6" }}
                >
                  <div
                    className="mx-auto transition-all duration-300"
                    style={{ width: VIEWPORT_WIDTHS[viewport] }}
                  >
                    <iframe
                      ref={iframeRef}
                      src={iframeSrc}
                      className="w-full border-0"
                      style={{ height: "70vh", minHeight: 500 }}
                      title="Site Clone Preview"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* HTML code view */}
            {tab === "code" && (
              <div className="bg-gray-900 rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
                  <span className="text-xs font-mono text-gray-400">{(() => { try { return new URL(meta.url).hostname; } catch { return "clone"; } })()}-clone.html</span>
                  <span className="text-xs text-gray-500">{formatBytes(meta.clonedSize)}</span>
                </div>
                <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
                  <pre className="text-xs text-green-300 font-mono p-5 leading-relaxed whitespace-pre-wrap break-all">
                    {html.slice(0, 20000)}
                    {html.length > 20000 && (
                      <span className="text-gray-500">{`\n\n... ${formatBytes(html.length - 20000)} more (download for full file)`}</span>
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 bg-secondary rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-display font-bold mb-3">Like what you see?</h3>
              <p className="text-white/70 mb-6 max-w-lg mx-auto">
                We rebuild sites like this — faster, cleaner, SEO-optimized, and built to convert. Get a free quote for your rebuild.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <Button className="bg-accent hover:bg-accent/90 text-secondary font-bold rounded-xl h-11 px-6">
                    Get a Free Rebuild Quote <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/audit">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6">
                    Audit this site's performance
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !html && (
        <div className="max-w-3xl mx-auto px-4 pb-20">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Layers, title: "Full CSS inline", desc: "Every external stylesheet is fetched and embedded directly in the HTML — no separate files needed" },
              { icon: Globe, title: "Assets resolved", desc: "Images, videos, fonts and links are all converted to absolute URLs so everything loads correctly" },
              { icon: Download, title: "Single-file output", desc: "Download one .html file, open it in any browser — completely offline, zero dependencies" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl border border-border p-5 shadow-sm text-center">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-violet-600" />
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

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">{label}</p>
      <p className="text-sm font-bold text-secondary">{value}</p>
    </div>
  );
}

export default function Clone() {
  return (
    <ToolPaywall
      toolKey="site-cloner"
      toolName="Site Cloner"
      tagline="Clone any public website into a single, self-contained HTML file with all CSS inlined and assets resolved — no server required."
      price="$9.99"
      priceLabel="24-hour access"
      accentClass="text-violet-600"
      iconBgClass="bg-violet-50"
      features={[
        "Fetches and clones any public website as a single .html file",
        "All CSS stylesheets are inlined — no external dependencies",
        "Images, fonts and links are converted to absolute URLs",
        "Live preview with desktop, tablet and mobile viewports",
        "View the raw HTML source code directly in-browser",
        "Unlimited clones for 24 hours — use as many times as you need",
      ]}
    >
      <CloneTool />
    </ToolPaywall>
  );
}
