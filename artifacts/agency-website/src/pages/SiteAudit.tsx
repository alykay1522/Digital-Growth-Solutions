import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnalyzeSite } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  Info,
  Loader2,
  Lock,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  seo: { label: "SEO", icon: Search, color: "text-violet-600" },
  performance: { label: "Performance", icon: Zap, color: "text-amber-500" },
  security: { label: "Security", icon: Shield, color: "text-green-600" },
  accessibility: { label: "Accessibility", icon: Globe, color: "text-blue-600" },
  mobile: { label: "Mobile", icon: Smartphone, color: "text-pink-600" },
  content: { label: "Content", icon: Info, color: "text-slate-600" },
};

const SEVERITY_META = {
  critical: { label: "Critical", icon: XCircle, bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
  warning: { label: "Warning", icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  info: { label: "Info", icon: Info, bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-400" },
  pass: { label: "Pass", icon: CheckCircle2, bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
};

function ScoreRing({ score, label, icon: Icon, color }: { score: number; label: string; icon: React.ElementType; color: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{score}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function IssueRow({ issue }: { issue: any }) {
  const [open, setOpen] = useState(false);
  const sev = SEVERITY_META[issue.severity as keyof typeof SEVERITY_META] || SEVERITY_META.info;
  const SevIcon = sev.icon;

  if (issue.severity === "pass") {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${sev.bg} border ${sev.border}`}>
        <SevIcon className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="text-sm font-medium text-emerald-800">{issue.title}</span>
        {issue.value && <span className="ml-auto text-xs text-emerald-600 font-mono truncate max-w-[180px]">{issue.value}</span>}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${sev.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left ${sev.bg} hover:brightness-95 transition-all`}
      >
        <SevIcon className={`w-4 h-4 shrink-0 ${issue.severity === "critical" ? "text-red-600" : issue.severity === "warning" ? "text-amber-600" : "text-blue-600"}`} />
        <span className="text-sm font-semibold flex-1">{issue.title}</span>
        {issue.value && <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px] hidden sm:block">{issue.value}</span>}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sev.badge} hidden sm:inline-flex`}>{sev.label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 bg-white border-t border-gray-100 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Issue</p>
                <p className="text-sm text-foreground">{issue.description}</p>
              </div>
              {issue.fix && (
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">How to Fix</p>
                  <p className="text-sm text-emerald-800 font-mono">{issue.fix}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategorySection({ category, issues }: { category: string; issues: any[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = CATEGORY_META[category] || { label: category, icon: Info, color: "text-gray-500" };
  const Icon = meta.icon;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const passes = issues.filter((i) => i.severity === "pass").length;

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
        <Icon className={`w-5 h-5 ${meta.color}`} />
        <span className="font-semibold text-base">{meta.label}</span>
        <div className="flex items-center gap-2 ml-3">
          {critical > 0 && <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{critical} critical</span>}
          {warnings > 0 && <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{warnings} warnings</span>}
          {passes > 0 && <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{passes} passed</span>}
        </div>
        <div className="ml-auto">
          {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
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
            <div className="px-6 pb-6 space-y-2 border-t border-border pt-4">
              {issues.map((issue) => (
                <IssueRow key={issue.id} issue={issue} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SiteAudit() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const { mutate: analyze, data: result, isPending, error, reset } = useAnalyzeSite();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSubmittedUrl(url.trim());
    reset();
    analyze({ data: { url: url.trim() } });
  };

  const categories = result
    ? Array.from(new Set(result.issues.map((i: any) => i.category)))
    : [];

  const overallScore = result
    ? Math.round(
        (result.scores.seo + result.scores.performance + result.scores.security + result.scores.accessibility) / 4
      )
    : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Free Site Audit Tool
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Analyze Any Website Instantly
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enter a URL and get a full audit — SEO, performance, security, accessibility, and mobile-readiness — with actionable fixes.
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
                placeholder="https://yoursite.com"
                className="h-13 pl-11 pr-4 text-base rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary"
                disabled={isPending}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || !url.trim()}
              className="h-13 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 shrink-0"
            >
              {isPending ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Search className="w-5 h-5 mr-2" /> Analyze Site</>
              )}
            </Button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Loading */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20 gap-4"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">Fetching and analyzing <span className="text-foreground font-semibold">{submittedUrl}</span>…</p>
              <p className="text-sm text-muted-foreground">Checking SEO, security headers, performance, and more</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && !isPending && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800 text-lg mb-1">Could Not Analyze Site</h3>
            <p className="text-red-700 text-sm">{(error as any)?.error || "Something went wrong. Please check the URL and try again."}</p>
          </motion.div>
        )}

        {/* Results */}
        {result && !isPending && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Site preview card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={result.favicon}
                      alt="Favicon"
                      className="w-6 h-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <Globe className="w-5 h-5 text-muted-foreground hidden" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{result.title}</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate block">
                      {result.url}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Analyzed {new Date(result.fetchedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              {result.description && (
                <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">{result.description}</p>
              )}
            </div>

            {/* Summary strip */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-red-600">{result.summary.critical}</p>
                <p className="text-sm font-medium text-red-700 mt-1">Critical Issues</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-600">{result.summary.warnings}</p>
                <p className="text-sm font-medium text-amber-700 mt-1">Warnings</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600">{result.summary.passes}</p>
                <p className="text-sm font-medium text-emerald-700 mt-1">Passed</p>
              </div>
            </div>

            {/* Score rings */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-xl">Overall Score</h2>
                  <p className="text-muted-foreground text-sm">Across all audit categories</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-5xl font-black ${overallScore >= 80 ? "text-emerald-600" : overallScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                    {overallScore}
                  </span>
                  <span className="text-2xl text-muted-foreground font-light">/100</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                <ScoreRing score={result.scores.seo} label="SEO" icon={Search} color="text-violet-600" />
                <ScoreRing score={result.scores.performance} label="Performance" icon={Zap} color="text-amber-500" />
                <ScoreRing score={result.scores.security} label="Security" icon={Shield} color="text-green-600" />
                <ScoreRing score={result.scores.accessibility} label="Accessibility" icon={Globe} color="text-blue-600" />
              </div>
            </div>

            {/* Issues by category */}
            <div className="space-y-4">
              <h2 className="font-bold text-xl">Detailed Findings</h2>
              {categories.map((cat) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  issues={result.issues.filter((i: any) => i.category === cat)}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Need Help Fixing These Issues?</h3>
              <p className="text-white/80 mb-6">Our team can resolve every issue above and optimize your site for speed, security, and search rankings.</p>
              <a href="/contact">
                <Button className="bg-white text-primary hover:bg-white/90 font-semibold px-8 h-12 rounded-xl shadow-lg">
                  Get a Free Consultation
                </Button>
              </a>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !isPending && !error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Enter a URL above to get started</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We'll check your site for over 20 common issues across SEO, performance, security, and accessibility — and tell you exactly how to fix each one.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto text-sm">
              {Object.entries(CATEGORY_META).slice(0, 4).map(([key, val]) => (
                <div key={key} className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border">
                  <val.icon className={`w-6 h-6 ${val.color}`} />
                  <span className="font-medium text-foreground">{val.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
