import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { Search } from "lucide-react";

export default function AuditAgent() {
  useMeta({ title: "AI Website Audit Agent", description: "Free AI-powered website audit. Get a full SEO, performance, security and conversion analysis in 30 seconds." });

  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const { run, result, isLoading, error } = useAgentStream("audit");

  function handleSubmit() {
    if (!url.trim()) return;
    run({ url: url.trim(), context });
  }

  return (
    <AgentShell
      agentId="audit"
      title="AI Website Audit Agent"
      subtitle="Full SEO, performance, security & conversion audit — with a prioritised fix list."
      icon={<Search className="w-7 h-7" />}
      accentColor="bg-blue-100 text-blue-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Get a Free Professional Audit"
      ctaHref="/contact"
      inputForm={
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="https://yourwebsite.com"
              className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Context (optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. We're a plumbing company in Manchester. Our biggest problem is not getting enquiry form submissions."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>
      }
    />
  );
}
