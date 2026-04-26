import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeta } from "@/hooks/useMeta";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Loader2,
  Lock,
  Search,
  Server,
  Shield,
  Sparkles,
  XCircle,
  Layers,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const CATEGORY_ORDER = [
  "CMS",
  "CMS / eCommerce",
  "eCommerce",
  "Framework",
  "Library",
  "CSS Framework",
  "Analytics",
  "Tag Manager",
  "Advertising",
  "CRM / Marketing",
  "Customer Support",
  "Payments",
  "Security",
  "Fonts",
  "Icons",
  "CDN / Security",
  "CDN",
  "Hosting",
  "Web Server",
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  "CMS": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  "CMS / eCommerce": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  "eCommerce": { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", dot: "bg-green-500" },
  "Framework": { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  "Library": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  "CSS Framework": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500" },
  "Analytics": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  "Tag Manager": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  "Advertising": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
  "CRM / Marketing": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  "Customer Support": { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200", dot: "bg-teal-500" },
  "Payments": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  "Security": { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", dot: "bg-slate-500" },
  "Fonts": { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  "Icons": { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", dot: "bg-yellow-500" },
  "CDN / Security": { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", dot: "bg-orange-500" },
  "CDN": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200", dot: "bg-sky-500" },
  "Hosting": { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-200", dot: "bg-lime-500" },
  "Web Server": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", dot: "bg-gray-500" },
};

function defaultColor(cat: string) {
  return CATEGORY_COLORS[cat] || { bg: "bg-muted", text: "text-foreground", border: "border-border", dot: "bg-primary" };
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const map: Record<string, string> = {
    high: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[confidence] || map.medium}`}>
      {confidence === "high" ? "Confirmed" : confidence === "medium" ? "Likely" : "Possible"}
    </span>
  );
}

function TechCard({ tech }: { tech: any }) {
  const [open, setOpen] = useState(false);
  const colors = defaultColor(tech.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border ${colors.border} overflow-hidden`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left ${colors.bg} hover:brightness-95 transition-all`}
      >
        <span className="text-xl shrink-0">{tech.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold text-sm ${colors.text}`}>{tech.name}</span>
            {tech.version && (
              <span className="text-xs bg-white/60 border border-current/20 px-1.5 py-0.5 rounded font-mono opacity-70">
                v{tech.version}
              </span>
            )}
          </div>
        </div>
        <ConfidenceBadge confidence={tech.confidence} />
        {open ? <ChevronUp className={`w-4 h-4 ${colors.text} shrink-0`} /> : <ChevronDown className={`w-4 h-4 ${colors.text} shrink-0`} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CategoryGroup({ category, techs }: { category: string; techs: any[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const colors = defaultColor(category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} shrink-0`} />
        <span className="font-semibold text-base flex-1">{category}</span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
          {techs.length} detected
        </span>
        <div className="ml-2">
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
            : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-1 space-y-2 border-t border-border">
              {techs.map((t, i) => <TechCard key={`${t.name}-${i}`} tech={t} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TechStack() {
  useMeta({
    title: "Tech Stack Detector — See What Any Site Is Built With",
    description: "Instantly detect the CMS, frameworks, plugins, analytics, CDN, and hosting behind any website. Free — no account required.",
    path: "/tech-stack",
  });
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const fullUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    setUrl(fullUrl);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/detect-stack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fullUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Detection failed");
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Group and sort categories
  const groupedTechs = result
    ? (() => {
        const map: Record<string, any[]> = {};
        for (const tech of result.technologies) {
          if (!map[tech.category]) map[tech.category] = [];
          map[tech.category].push(tech);
        }
        const sorted: Record<string, any[]> = {};
        for (const cat of CATEGORY_ORDER) {
          if (map[cat]) sorted[cat] = map[cat];
        }
        for (const cat of Object.keys(map)) {
          if (!sorted[cat]) sorted[cat] = map[cat];
        }
        return sorted;
      })()
    : {};

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Layers className="w-4 h-4" />
              Free Tech Stack Detector
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              What's Any Website Built With?
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enter any URL and instantly see the CMS, hosting, analytics tools, JavaScript frameworks, payment processors, and more — all from the live site.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://anywebsite.com"
                className="h-13 pl-11 pr-4 text-base rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary"
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !url.trim()}
              className="h-13 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 shrink-0"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Detecting…</>
                : <><Search className="w-5 h-5 mr-2" /> Detect Stack</>}
            </Button>
          </motion.form>

          <p className="text-xs text-muted-foreground mt-4">
            Works on any public website — try your own, a competitor's, or a site you're curious about
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">Scanning <span className="text-foreground font-semibold">{url}</span>…</p>
              <p className="text-sm text-muted-foreground">Fingerprinting CMS, analytics, frameworks, hosting, and more</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800 text-lg mb-1">Could Not Scan Site</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {result && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Site card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={result.favicon} alt="" className="w-6 h-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{result.title}</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1">
                      {result.url} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Server className="w-4 h-4" /> {result.responseTime}ms
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="w-4 h-4" /> {new Date(result.detectedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-primary">{result.summary.totalDetected}</p>
                <p className="text-sm font-medium text-primary/80 mt-1">Technologies</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-foreground">{result.summary.categories.length}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Categories</p>
              </div>
              <div className={`rounded-2xl p-4 text-center border ${result.security?.https ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                {result.security?.https
                  ? <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
                  : <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />}
                <p className={`text-sm font-medium mt-0 ${result.security?.https ? "text-emerald-700" : "text-red-700"}`}>
                  {result.security?.https ? "HTTPS Secure" : "No HTTPS"}
                </p>
              </div>
              <div className={`rounded-2xl p-4 text-center border ${result.security?.hsts ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                <Shield className={`w-8 h-8 mx-auto mb-1 ${result.security?.hsts ? "text-emerald-500" : "text-amber-500"}`} />
                <p className={`text-sm font-medium mt-0 ${result.security?.hsts ? "text-emerald-700" : "text-amber-700"}`}>
                  {result.security?.hsts ? "HSTS Active" : "No HSTS"}
                </p>
              </div>
            </div>

            {/* Quick tech pills */}
            {result.technologies.length > 0 && (
              <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> All Detected Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.technologies.map((tech: any, i: number) => {
                    const colors = defaultColor(tech.category);
                    return (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        <span>{tech.icon}</span>
                        {tech.name}
                        {tech.version && <span className="opacity-60 text-xs">v{tech.version}</span>}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* By category */}
            <div className="space-y-4">
              <h2 className="font-bold text-xl">Breakdown by Category</h2>
              {Object.entries(groupedTechs).map(([cat, techs]) => (
                <CategoryGroup key={cat} category={cat} techs={techs} />
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-gray-950 to-gray-900 rounded-2xl p-8 text-white">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">See issues with this site's stack?</h3>
                  <p className="text-gray-400 text-sm">
                    Run a full audit to find SEO, security, and performance problems — then let AI generate the exact fixes.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Button
                    onClick={() => window.location.href = `/audit?url=${encodeURIComponent(result.url)}`}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-11 shadow-lg shadow-primary/30"
                  >
                    Full Site Audit →
                  </Button>
                  <Link href="/contact">
                    <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-5 h-11">
                      Talk to Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Enter any URL to scan its stack</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We fingerprint 50+ technologies across CMS, hosting, analytics, frameworks, payments, and more — all from the live public site.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm">
              {[
                { label: "CMS", icon: "🔵" },
                { label: "Hosting & CDN", icon: "☁️" },
                { label: "Analytics", icon: "📊" },
                { label: "JS Frameworks", icon: "⚛️" },
                { label: "Payments", icon: "💳" },
                { label: "Marketing Tools", icon: "🟠" },
              ].map((cat) => (
                <span key={cat.label} className="flex items-center gap-1.5 bg-card border border-border px-4 py-2 rounded-full">
                  <span>{cat.icon}</span> {cat.label}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
