import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useMeta } from "@/hooks/useMeta";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Loader2,
  Search,
  Shield,
  Smartphone,
  Trophy,
  Vs,
  XCircle,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

interface SiteResult {
  url: string;
  title: string;
  responseTime: number;
  overall: number;
  scores: { seo: number; performance: number; security: number; accessibility: number };
  metrics: {
    hasTitle: boolean;
    hasMetaDesc: boolean;
    h1Count: number;
    hasCanonical: boolean;
    hasOgTags: boolean;
    hasStructuredData: boolean;
    isHttps: boolean;
    hasHsts: boolean;
    hasCSP: boolean;
    hasXFrame: boolean;
    hasLang: boolean;
    hasMobile: boolean;
    scriptCount: number;
    totalImgs: number;
    imgsWithoutAlt: number;
  };
  technologies: { name: string; category: string }[];
}

interface CompareResult {
  siteA: SiteResult | null;
  siteB: SiteResult | null;
  errorA: string | null;
  errorB: string | null;
}

const CATEGORY_CONFIG = [
  { key: "seo" as const, label: "SEO", icon: Search, color: "text-violet-600", bg: "bg-violet-500" },
  { key: "performance" as const, label: "Performance", icon: Zap, color: "text-amber-600", bg: "bg-amber-500" },
  { key: "security" as const, label: "Security", icon: Shield, color: "text-green-600", bg: "bg-green-500" },
  { key: "accessibility" as const, label: "Accessibility", icon: Globe, color: "text-blue-600", bg: "bg-blue-500" },
];

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
}

function scoreGrade(score: number) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function MetricRow({
  label,
  a,
  b,
}: {
  label: string;
  a: boolean | number | string;
  b: boolean | number | string;
}) {
  const aGood = typeof a === "boolean" ? a : (a as number) > 0;
  const bGood = typeof b === "boolean" ? b : (b as number) > 0;
  return (
    <div className="grid grid-cols-3 items-center py-2 border-b border-border/50 last:border-0">
      <div className={`flex items-center gap-2 ${aGood ? "text-green-600" : "text-red-500"}`}>
        {aGood ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
        <span className="text-xs">{typeof a === "boolean" ? (a ? "Yes" : "No") : a}</span>
      </div>
      <p className="text-xs text-center text-muted-foreground font-medium">{label}</p>
      <div className={`flex items-center justify-end gap-2 ${bGood ? "text-green-600" : "text-red-500"}`}>
        <span className="text-xs">{typeof b === "boolean" ? (b ? "Yes" : "No") : b}</span>
        {bGood ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
      </div>
    </div>
  );
}

function SiteCard({ site, label, isWinner }: { site: SiteResult; label: string; isWinner: boolean }) {
  const domain = (() => {
    try { return new URL(site.url).hostname; } catch { return site.url; }
  })();

  return (
    <div className={`bg-white rounded-2xl border-2 p-6 ${isWinner ? "border-primary shadow-xl shadow-primary/10" : "border-border"}`}>
      {isWinner && (
        <div className="flex items-center gap-2 mb-4 text-primary">
          <Trophy className="w-5 h-5 fill-primary" />
          <span className="text-sm font-bold uppercase tracking-wide">Winning Overall</span>
        </div>
      )}
      <div className="mb-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <h3 className="text-lg font-bold text-secondary truncate mt-1">{domain}</h3>
        <p className="text-xs text-muted-foreground truncate">{site.title}</p>
        <p className="text-xs text-muted-foreground mt-1">{site.responseTime}ms response time</p>
      </div>

      {/* Overall score */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className={`text-5xl font-display font-bold ${scoreColor(site.overall)}`}>
          {scoreGrade(site.overall)}
        </div>
        <div>
          <p className="text-2xl font-bold text-secondary">{site.overall}/100</p>
          <p className="text-xs text-muted-foreground">Overall score</p>
        </div>
      </div>

      {/* Category scores */}
      <div className="space-y-3 mb-6">
        {CATEGORY_CONFIG.map(({ key, label, icon: Icon, color, bg }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
              <span className={`text-sm font-bold ${scoreColor(site.scores[key])}`}>{site.scores[key]}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${site.scores[key]}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${bg}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tech stack */}
      {site.technologies.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {site.technologies.slice(0, 6).map((t) => (
              <span
                key={t.name}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Compare() {
  useMeta({
    title: "Competitor Comparison — Your Site vs Any Competitor",
    description: "Compare your website head-to-head against any competitor. See SEO scores, performance, mobile-friendliness, and security side by side. Free tool.",
    path: "/compare",
  });
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState("");

  const handleCompare = async () => {
    if (!urlA.trim() || !urlB.trim()) {
      setError("Please enter both URLs to compare.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${BASE_URL}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urlA: urlA.trim(), urlB: urlB.trim() }),
      });
      const data: CompareResult = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Please check the URLs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const winnerSide = result?.siteA && result?.siteB
    ? result.siteA.overall >= result.siteB.overall ? "A" : "B"
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium mb-5">
            <span>⚔️</span>
            <span>Free Competitor Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
            Your Site vs. Your Competitor
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any two URLs. We'll analyze both — SEO, performance, security, accessibility, and tech stack — and show you side-by-side who's winning and where.
          </p>
        </div>
      </div>

      {/* URL inputs */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Site</label>
              <Input
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                placeholder="https://yoursite.com"
                className="h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              />
            </div>
            <div className="flex items-end justify-center pb-1">
              <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center">
                <span className="text-xs font-black text-muted-foreground">VS</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Competitor's Site</label>
              <Input
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                placeholder="https://competitor.com"
                className="h-12 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleCompare()}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-5 flex justify-center">
            <Button
              onClick={handleCompare}
              disabled={loading}
              className="h-12 px-10 text-base rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing both sites…
                </>
              ) : (
                <>Analyze Both Sites</>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-3">
            Analysis typically takes 10–20 seconds · Works on any public website
          </p>
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto px-4 pb-20"
          >
            {/* Error states */}
            {(result.errorA || result.errorB) && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                {result.errorA && <p>⚠️ Site A error: {result.errorA}</p>}
                {result.errorB && <p>⚠️ Site B error: {result.errorB}</p>}
              </div>
            )}

            {/* Winner banner */}
            {winnerSide && result.siteA && result.siteB && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-5 bg-primary rounded-2xl text-white text-center"
              >
                <p className="text-sm font-medium text-white/80 mb-1">Overall Winner</p>
                <p className="text-2xl font-display font-bold">
                  🏆 {winnerSide === "A"
                    ? (() => { try { return new URL(result.siteA!.url).hostname; } catch { return result.siteA!.url; } })()
                    : (() => { try { return new URL(result.siteB!.url).hostname; } catch { return result.siteB!.url; } })()}
                </p>
                <p className="text-sm text-white/70 mt-1">
                  {Math.abs(result.siteA.overall - result.siteB.overall)} points ahead overall
                </p>
              </motion.div>
            )}

            {/* Side-by-side cards */}
            {result.siteA && result.siteB && (
              <>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <SiteCard site={result.siteA} label="Your Site" isWinner={winnerSide === "A"} />
                  <SiteCard site={result.siteB} label="Competitor" isWinner={winnerSide === "B"} />
                </div>

                {/* Metric-by-metric comparison */}
                <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-8">
                  <h3 className="text-lg font-bold text-secondary mb-5">Detailed Comparison</h3>
                  <div className="grid grid-cols-3 mb-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {(() => { try { return new URL(result.siteA.url).hostname; } catch { return "Site A"; } })()}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground text-center">Metric</span>
                    <span className="text-xs font-semibold text-muted-foreground text-right">
                      {(() => { try { return new URL(result.siteB.url).hostname; } catch { return "Site B"; } })()}
                    </span>
                  </div>
                  <MetricRow label="Page Title" a={result.siteA.metrics.hasTitle} b={result.siteB.metrics.hasTitle} />
                  <MetricRow label="Meta Description" a={result.siteA.metrics.hasMetaDesc} b={result.siteB.metrics.hasMetaDesc} />
                  <MetricRow label="Single H1 Tag" a={result.siteA.metrics.h1Count === 1} b={result.siteB.metrics.h1Count === 1} />
                  <MetricRow label="Canonical Tag" a={result.siteA.metrics.hasCanonical} b={result.siteB.metrics.hasCanonical} />
                  <MetricRow label="Open Graph Tags" a={result.siteA.metrics.hasOgTags} b={result.siteB.metrics.hasOgTags} />
                  <MetricRow label="HTTPS" a={result.siteA.metrics.isHttps} b={result.siteB.metrics.isHttps} />
                  <MetricRow label="HSTS Header" a={result.siteA.metrics.hasHsts} b={result.siteB.metrics.hasHsts} />
                  <MetricRow label="Content Security Policy" a={result.siteA.metrics.hasCSP} b={result.siteB.metrics.hasCSP} />
                  <MetricRow label="Lang Attribute" a={result.siteA.metrics.hasLang} b={result.siteB.metrics.hasLang} />
                  <MetricRow label="Mobile Viewport" a={result.siteA.metrics.hasMobile} b={result.siteB.metrics.hasMobile} />
                  <MetricRow
                    label="JS Scripts"
                    a={`${result.siteA.metrics.scriptCount} scripts`}
                    b={`${result.siteB.metrics.scriptCount} scripts`}
                  />
                  <MetricRow
                    label="Images Missing Alt"
                    a={result.siteA.metrics.imgsWithoutAlt === 0}
                    b={result.siteB.metrics.imgsWithoutAlt === 0}
                  />
                </div>

                {/* CTA */}
                <div className="bg-secondary rounded-2xl p-8 text-white text-center">
                  <h3 className="text-2xl font-display font-bold mb-3">Want to close the gap?</h3>
                  <p className="text-white/70 mb-6 max-w-lg mx-auto">
                    Run a full audit on your site for specific, code-level fixes — or talk to us about a performance and SEO optimization project.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/audit">
                      <Button className="bg-accent hover:bg-accent/90 text-secondary font-bold rounded-xl h-11 px-6">
                        Run Full Site Audit
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6">
                        Talk to an Expert <ArrowRight className="ml-2 w-4 h-4" />
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
        <div className="max-w-4xl mx-auto px-4 pb-20">
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚔️</span>
            </div>
            <p className="font-medium text-secondary mb-1">Enter two URLs above to compare</p>
            <p className="text-sm">Try your site vs. a competitor's — see who's winning on SEO, speed, and security</p>
          </div>
        </div>
      )}
    </div>
  );
}
