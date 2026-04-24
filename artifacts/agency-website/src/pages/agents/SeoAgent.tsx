import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { BrainCircuit } from "lucide-react";

export default function SeoAgent() {
  useMeta({ title: "AI SEO Agent", description: "Get a full SEO strategy with target keywords, on-page fixes, content ideas and a 30-day action plan. Free." });

  const [form, setForm] = useState({ url: "", businessType: "", location: "", competitors: "" });
  const { run, result, isLoading, error } = useAgentStream("seo");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.url.trim()) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="seo"
      title="AI SEO Agent"
      subtitle="Get your full SEO strategy: keywords, on-page fixes, content ideas, local SEO tips and a 30-day action plan."
      icon={<BrainCircuit className="w-7 h-7" />}
      accentColor="bg-orange-100 text-orange-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Get SEO Done For You"
      ctaHref="/contact"
      inputForm={
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1.5">Website URL <span className="text-red-500">*</span></label>
            <input type="url" value={form.url} onChange={set("url")} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} placeholder="https://yourwebsite.com" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Business Type</label>
            <input type="text" value={form.businessType} onChange={set("businessType")} placeholder="e.g. Plumber, Clothing boutique, SaaS" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Location / Target Market</label>
            <input type="text" value={form.location} onChange={set("location")} placeholder="e.g. Manchester, UK or USA nationwide" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1.5">Known Competitors (optional)</label>
            <input type="text" value={form.competitors} onChange={set("competitors")} placeholder="e.g. competitor1.com, competitor2.com" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
        </div>
      }
    />
  );
}
