import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, Bot, Copy, CheckCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface AgentShellProps {
  agentId: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  inputForm: React.ReactNode;
  onSubmit: () => void;
  isLoading: boolean;
  result: string;
  placeholder?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function MarkdownBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-secondary mt-6 mb-2 first:mt-0 flex items-center gap-2">
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h4 key={key++} className="text-base font-semibold text-secondary mt-4 mb-1">
          {line.replace("### ", "")}
        </h4>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <li key={key++} className="ml-4 text-sm text-muted-foreground leading-relaxed list-disc">
          {renderInline(line.replace(/^[-*] /, ""))}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={key++} className="ml-4 text-sm text-muted-foreground leading-relaxed list-decimal">
          {renderInline(line.replace(/^\d+\. /, ""))}
        </li>
      );
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={key++} className="text-sm font-semibold text-secondary mt-2">
          {line.replace(/\*\*/g, "")}
        </p>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1" />);
    } else if (line.trim()) {
      elements.push(
        <p key={key++} className="text-sm text-muted-foreground leading-relaxed">
          {renderInline(line)}
        </p>
      );
    }
  }
  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-secondary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

export function AgentShell({
  agentId,
  title,
  subtitle,
  icon,
  accentColor,
  inputForm,
  onSubmit,
  isLoading,
  result,
  ctaLabel = "Get a Free Strategy Call",
  ctaHref = "/contact",
}: AgentShellProps) {
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link href="/agents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          All AI Agents
        </Link>

        {/* Header */}
        <AnimatedSection>
          <div className="flex items-start gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl ${accentColor} flex items-center justify-center shrink-0`}>
              {icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-secondary">{title}</h1>
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Input card */}
        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              <Bot className="w-4 h-4" />
              Tell the agent what you need
            </div>
            {inputForm}
            <div className="mt-5">
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="h-11 px-6 rounded-xl font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Agent is thinking…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Run Agent
                  </>
                )}
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Result */}
        <AnimatePresence>
          {(isLoading || result) && (
            <motion.div
              ref={resultRef}
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              {/* Result header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-gray-50/60">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-primary animate-pulse" : "bg-green-500"}`} />
                  <span className="text-sm font-semibold text-secondary">
                    {isLoading ? "Generating…" : "Agent Report Ready"}
                  </span>
                </div>
                {result && !isLoading && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>

              {/* Result body */}
              <div className="px-6 py-6">
                {isLoading && !result && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm">Analysing…</span>
                  </div>
                )}
                <div className="prose-sm max-w-none">
                  <MarkdownBlock text={result} />
                </div>
              </div>

              {/* CTA footer */}
              {result && !isLoading && (
                <div className="px-6 py-5 bg-primary/5 border-t border-primary/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Want us to implement these recommendations for you?
                    </p>
                    <Link href={ctaHref}>
                      <Button size="sm" className="rounded-xl shrink-0">
                        {ctaLabel} <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Shared hook for streaming SSE ───────────────────────────────────────────
export function useAgentStream(endpoint: string) {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function run(body: Record<string, unknown>) {
    setResult("");
    setError("");
    setIsLoading(true);

    try {
      const BASE = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
      const res = await fetch(`${BASE}/api/agents/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const json = JSON.parse(line.slice(6));
            if (json.content) setResult((p) => p + json.content);
            if (json.done) { setIsLoading(false); return; }
            if (json.error) throw new Error(json.error);
          } catch {}
        }
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return { run, result, isLoading, error };
}
