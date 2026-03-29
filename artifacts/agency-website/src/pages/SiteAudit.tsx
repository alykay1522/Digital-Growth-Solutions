import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAnalyzeSite } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Globe,
  Info,
  Loader2,
  Lock,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Square,
  SquareCheckBig,
  Wand2,
  XCircle,
  Zap,
  ArrowUpDown,
  RotateCcw,
  Check,
} from "lucide-react";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  seo: { label: "SEO", icon: Search, color: "text-violet-600" },
  performance: { label: "Performance", icon: Zap, color: "text-amber-500" },
  security: { label: "Security", icon: Shield, color: "text-green-600" },
  accessibility: { label: "Accessibility", icon: Globe, color: "text-blue-600" },
  mobile: { label: "Mobile", icon: Smartphone, color: "text-pink-600" },
  content: { label: "Content", icon: Info, color: "text-slate-600" },
};

const SEVERITY_META = {
  critical: { label: "Critical", icon: XCircle, bg: "bg-red-50", border: "border-red-200", badge: "bg-red-100 text-red-700" },
  warning: { label: "Warning", icon: AlertTriangle, bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700" },
  info: { label: "Info", icon: Info, bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  pass: { label: "Pass", icon: CheckCircle2, bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
};

const SEVERITY_ORDER: Record<string, number> = { critical: 0, warning: 1, info: 2, pass: 3 };

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
          <motion.circle cx="40" cy="40" r={radius} fill="none" stroke={scoreColor} strokeWidth="6"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }} />
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

function IssueRow({
  issue,
  selected,
  onToggleSelect,
}: {
  issue: any;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}) {
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
    <div className={`rounded-lg border ${selected ? "border-primary ring-1 ring-primary/30" : sev.border} overflow-hidden transition-all`}>
      <div className={`w-full flex items-center gap-2 px-3 py-3 text-left ${sev.bg}`}>
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggleSelect(issue.id)}
          className="shrink-0 text-primary hover:scale-110 transition-transform"
          aria-label={selected ? "Deselect issue" : "Select issue for AI fix"}
        >
          {selected
            ? <SquareCheckBig className="w-5 h-5 text-primary" />
            : <Square className="w-5 h-5 text-muted-foreground/50 hover:text-primary/60" />}
        </button>

        {/* Expand row button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 flex-1 min-w-0 hover:brightness-95 transition-all"
        >
          <SevIcon className={`w-4 h-4 shrink-0 ${issue.severity === "critical" ? "text-red-600" : issue.severity === "warning" ? "text-amber-600" : "text-blue-600"}`} />
          <span className="text-sm font-semibold flex-1 text-left truncate">{issue.title}</span>
          {issue.value && <span className="text-xs font-mono text-muted-foreground truncate max-w-[120px] hidden sm:block">{issue.value}</span>}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sev.badge} hidden sm:inline-flex shrink-0`}>{sev.label}</span>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
        </button>
      </div>

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
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">Quick Fix Hint</p>
                  <p className="text-sm text-emerald-800 font-mono">{issue.fix}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => onToggleSelect(issue.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  selected
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {selected ? "✓ Selected for AI Fix" : "+ Add to AI Fix Queue"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategorySection({
  category,
  issues,
  selectedIssues,
  onToggleSelect,
}: {
  category: string;
  issues: any[];
  selectedIssues: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const meta = CATEGORY_META[category] || { label: category, icon: Info, color: "text-gray-500" };
  const Icon = meta.icon;
  const critical = issues.filter((i) => i.severity === "critical").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const passes = issues.filter((i) => i.severity === "pass").length;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <button onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-muted/30 transition-colors">
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
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="px-6 pb-6 space-y-2 border-t border-border pt-4">
              {issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  selected={selectedIssues.has(issue.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AiFixPanel({
  content,
  loading,
  error,
  onClose,
}: {
  content: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wand2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Fix Assistant</p>
            <p className="text-gray-400 text-xs">
              {loading ? "Generating fixes…" : error ? "Generation failed" : "Fixes ready — copy and apply"}
            </p>
          </div>
          {loading && <Loader2 className="w-4 h-4 text-primary animate-spin ml-2" />}
        </div>
        <div className="flex items-center gap-2">
          {content && !loading && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy all"}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 p-1.5 rounded-lg transition-all"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="max-h-[600px] overflow-y-auto p-6 prose prose-invert prose-sm max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-h2:text-base prose-h2:mt-6 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2
        prose-p:text-gray-300 prose-p:leading-relaxed
        prose-strong:text-white
        prose-code:text-emerald-400 prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-xl prose-pre:text-sm
        prose-hr:border-gray-800
        prose-li:text-gray-300">
        {error && (
          <div className="text-red-400 flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {content && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        )}
        {loading && !content && (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Analyzing your selected issues and generating precise code fixes…</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SiteAudit() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const { mutate: analyze, data: result, isPending, error, reset } = useAnalyzeSite();

  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [priorityMode, setPriorityMode] = useState<"critical_first" | "user_selected">("critical_first");
  const [aiContent, setAiContent] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const aiPanelRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const fullUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    setUrl(fullUrl);
    setSubmittedUrl(fullUrl);
    reset();
    setSelectedIssues(new Set());
    setAiContent("");
    setAiError(null);
    setAiPanelOpen(false);
    analyze({ data: { url: fullUrl } });
  };

  const toggleSelectIssue = useCallback((id: string) => {
    setSelectedIssues((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = () => {
    if (!result) return;
    const fixableIds = result.issues
      .filter((i: any) => i.severity !== "pass")
      .map((i: any) => i.id);
    setSelectedIssues(new Set(fixableIds));
  };

  const handleClearAll = () => {
    setSelectedIssues(new Set());
  };

  const handleGenerateFixes = async () => {
    if (!result || selectedIssues.size === 0) return;

    const issuesList = result.issues.filter((i: any) => selectedIssues.has(i.id));

    setAiContent("");
    setAiError(null);
    setAiLoading(true);
    setAiPanelOpen(true);

    // Scroll to the AI panel after a short delay
    setTimeout(() => {
      aiPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);

    try {
      const response = await fetch(`${BASE_URL}/api/ai-fix`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.url,
          issues: issuesList,
          priority: priorityMode,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.done) break;
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.content) {
                setAiContent((prev) => prev + parsed.content);
              }
            } catch {
              // ignore malformed lines
            }
          }
        }
      }
    } catch (err: any) {
      setAiError(err.message || "Failed to generate fixes. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const categories = result ? Array.from(new Set(result.issues.map((i: any) => i.category))) : [];
  const overallScore = result
    ? Math.round((result.scores.seo + result.scores.performance + result.scores.security + result.scores.accessibility) / 4)
    : 0;

  const fixableCount = result ? result.issues.filter((i: any) => i.severity !== "pass").length : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Free AI-Powered Site Audit
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Analyze Any Website Instantly</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Enter a URL and get a full audit — SEO, performance, security, accessibility — then let AI generate exact code fixes for you.
            </p>
          </motion.div>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com"
                className="h-13 pl-11 pr-4 text-base rounded-xl border-2 focus-visible:ring-0 focus-visible:border-primary"
                disabled={isPending} />
            </div>
            <Button type="submit" disabled={isPending || !url.trim()}
              className="h-13 px-8 text-base rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 shrink-0">
              {isPending
                ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing…</>
                : <><Search className="w-5 h-5 mr-2" /> Analyze Site</>}
            </Button>
          </motion.form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Loading */}
        <AnimatePresence>
          {isPending && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20 gap-4">
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
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
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
                    <img src={result.favicon} alt="Favicon" className="w-6 h-6 object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{result.title}</p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate block">{result.url}</a>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Analyzed {new Date(result.fetchedAt).toLocaleTimeString()}</span>
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

            {/* AI Actions bar */}
            <div className="bg-gradient-to-r from-gray-950 to-gray-900 rounded-2xl border border-gray-800 p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Wand2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">AI Actions</p>
                    <p className="text-gray-400 text-xs">
                      {selectedIssues.size === 0
                        ? "Select issues below to generate AI-powered code fixes"
                        : `${selectedIssues.size} issue${selectedIssues.size > 1 ? "s" : ""} selected — AI will write exact code fixes for each`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Select All / Clear */}
                  {fixableCount > 0 && (
                    <>
                      {selectedIssues.size < fixableCount ? (
                        <button onClick={handleSelectAll}
                          className="text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all">
                          Select All ({fixableCount})
                        </button>
                      ) : (
                        <button onClick={handleClearAll}
                          className="text-xs font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> Clear
                        </button>
                      )}
                    </>
                  )}

                  {/* Priority toggle */}
                  <button
                    onClick={() => setPriorityMode(p => p === "critical_first" ? "user_selected" : "critical_first")}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
                      priorityMode === "critical_first"
                        ? "bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    {priorityMode === "critical_first" ? "Critical First" : "My Order"}
                  </button>

                  {/* Generate button */}
                  <Button
                    onClick={handleGenerateFixes}
                    disabled={selectedIssues.size === 0 || aiLoading}
                    className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 h-9 rounded-xl shadow-lg shadow-primary/30 disabled:opacity-40"
                  >
                    {aiLoading
                      ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Generating…</>
                      : <><Wand2 className="w-4 h-4 mr-1.5" /> Generate Fixes</>}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Fix Panel */}
            <div ref={aiPanelRef}>
              <AnimatePresence>
                {aiPanelOpen && (
                  <AiFixPanel
                    content={aiContent}
                    loading={aiLoading}
                    error={aiError}
                    onClose={() => { setAiPanelOpen(false); setAiContent(""); setAiError(null); }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Issues by category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-xl">Detailed Findings</h2>
                <p className="text-sm text-muted-foreground">
                  Check issues to add them to AI fix queue
                </p>
              </div>
              {categories.map((cat) => (
                <CategorySection
                  key={cat}
                  category={cat}
                  issues={result.issues.filter((i: any) => i.category === cat)}
                  selectedIssues={selectedIssues}
                  onToggleSelect={toggleSelectIssue}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="bg-primary rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Need Help Implementing These Fixes?</h3>
              <p className="text-white/80 mb-6">Our team can apply every fix above and optimize your site for speed, security, and search rankings.</p>
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
              We'll audit your site for 20+ issues, then let AI generate copy-paste code fixes for whichever problems you want to tackle first.
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto text-sm">
              {Object.entries(CATEGORY_META).slice(0, 4).map(([key, val]) => (
                <div key={key} className="flex flex-col items-center gap-2 p-3 bg-card rounded-xl border border-border">
                  <val.icon className={`w-6 h-6 ${val.color}`} />
                  <span className="font-medium text-foreground">{val.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Wand2 className="w-4 h-4 text-primary" />
              <span>AI-powered fixes — select issues and get exact code to apply</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
