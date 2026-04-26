import React, { useMemo } from "react";
import { Link, useSearch } from "wouter";
import { useMeta } from "@/hooks/useMeta";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  Search,
  Shield,
  Smartphone,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SharedResult {
  url: string;
  title: string;
  overall: number;
  scores: { seo: number; performance: number; security: number; accessibility: number; mobile: number };
  issueCount: { critical: number; warning: number; info: number; pass: number };
  scannedAt: string;
}

const CATEGORIES = [
  { key: "seo" as const, label: "SEO", icon: Search, color: "text-violet-600", bg: "bg-violet-500", track: "bg-violet-100" },
  { key: "performance" as const, label: "Performance", icon: Zap, color: "text-amber-600", bg: "bg-amber-500", track: "bg-amber-100" },
  { key: "security" as const, label: "Security", icon: Shield, color: "text-green-600", bg: "bg-green-500", track: "bg-green-100" },
  { key: "accessibility" as const, label: "Accessibility", icon: Globe, color: "text-blue-600", bg: "bg-blue-500", track: "bg-blue-100" },
  { key: "mobile" as const, label: "Mobile", icon: Smartphone, color: "text-pink-600", bg: "bg-pink-500", track: "bg-pink-100" },
];

function gradeFromScore(score: number) {
  if (score >= 90) return { grade: "A", label: "Excellent", color: "text-green-600", ring: "ring-green-500" };
  if (score >= 75) return { grade: "B", label: "Good", color: "text-blue-600", ring: "ring-blue-500" };
  if (score >= 60) return { grade: "C", label: "Needs Work", color: "text-amber-600", ring: "ring-amber-500" };
  if (score >= 40) return { grade: "D", label: "Poor", color: "text-orange-600", ring: "ring-orange-500" };
  return { grade: "F", label: "Critical", color: "text-red-600", ring: "ring-red-500" };
}

export default function Results() {
  useMeta({
    title: "Audit Results",
    description: "View the detailed website audit report including SEO, performance, security, and mobile-friendliness scores with actionable recommendations.",
    path: "/results",
  });
  const search = useSearch();
  const { toast } = useToast();

  const data = useMemo<SharedResult | null>(() => {
    try {
      const params = new URLSearchParams(search);
      const r = params.get("r");
      if (!r) return null;
      const json = atob(r.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json) as SharedResult;
    } catch {
      return null;
    }
  }, [search]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({ title: "Link copied!", description: "Share this URL to show your audit results." });
    });
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-secondary mb-3">Invalid Share Link</h1>
          <p className="text-muted-foreground mb-6">
            This link may be expired or malformed. Run a fresh audit to get a new shareable link.
          </p>
          <Link href="/audit">
            <Button className="rounded-xl">Run a New Audit</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { grade, label, color, ring } = gradeFromScore(data.overall);
  const domain = (() => { try { return new URL(data.url).hostname; } catch { return data.url; } })();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-border pb-10 pt-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs text-muted-foreground font-medium mb-5">
            <Globe className="w-3.5 h-3.5" />
            Site Audit Results for {domain}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-2">
            {data.title || domain}
          </h1>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {data.url} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Overall score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-border p-8 shadow-sm text-center"
        >
          <p className="text-sm font-medium text-muted-foreground mb-4">Overall Website Score</p>
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ring-4 ${ring} bg-white shadow-lg mb-4`}>
            <div>
              <p className={`text-5xl font-display font-bold ${color}`}>{grade}</p>
            </div>
          </div>
          <p className={`text-4xl font-bold ${color} mb-1`}>{data.overall}<span className="text-xl text-muted-foreground">/100</span></p>
          <p className={`text-lg font-semibold ${color}`}>{label}</p>

          {/* Issue summary */}
          <div className="grid grid-cols-4 gap-3 mt-6 pt-6 border-t border-border">
            {[
              { label: "Critical", count: data.issueCount.critical, color: "text-red-600", bg: "bg-red-50" },
              { label: "Warnings", count: data.issueCount.warning, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Info", count: data.issueCount.info, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Passing", count: data.issueCount.pass, color: "text-green-600", bg: "bg-green-50" },
            ].map(({ label, count, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3`}>
                <p className={`text-2xl font-bold ${color}`}>{count}</p>
                <p className="text-xs text-muted-foreground font-medium">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category scores */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-secondary mb-5">Score Breakdown</h2>
          <div className="space-y-4">
            {CATEGORIES.map(({ key, label, icon: Icon, color, bg, track }) => {
              const score = data.scores[key] ?? 0;
              const g = gradeFromScore(score);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-sm font-medium text-secondary">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${g.color}`}>{score}/100</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${g.color} ${track}`}>
                        {g.grade}
                      </span>
                    </div>
                  </div>
                  <div className={`h-2 ${track} rounded-full overflow-hidden`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      className={`h-full ${bg} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Scanned info */}
        <p className="text-center text-xs text-muted-foreground">
          Audited on {new Date(data.scannedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} by Digital Growth Solutions Agency Site Audit
        </p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-secondary rounded-2xl p-7 text-white"
        >
          <h3 className="text-xl font-display font-bold mb-2">Ready to fix these issues?</h3>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Run a fresh audit on your site to get AI-generated, copy-paste-ready code fixes for every issue — or talk to our team about handling it for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/audit">
              <Button className="bg-accent hover:bg-accent/90 text-secondary font-bold rounded-xl h-11 px-6 w-full sm:w-auto">
                Run New Audit <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6"
            >
              <Copy className="mr-2 w-4 h-4" /> Copy Share Link
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl h-11 px-6 w-full sm:w-auto">
                Get it Fixed
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
