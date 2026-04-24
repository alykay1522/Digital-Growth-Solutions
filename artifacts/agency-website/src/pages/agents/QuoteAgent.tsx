import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { FileText } from "lucide-react";

const PROJECT_TYPES = ["New Website", "Website Redesign", "eCommerce Store", "AI Automation", "WordPress Plugin", "Shopify Store", "Custom Web App", "Other"];
const BUDGETS = ["Under $500", "$500–$1,000", "$1,000–$2,000", "$2,000–$5,000", "$5,000+", "Not sure yet"];
const TIMELINES = ["ASAP (1–2 weeks)", "1 month", "2–3 months", "Flexible", "Not sure"];

export default function QuoteAgent() {
  useMeta({ title: "AI Quote Generator", description: "Get an instant project quote with package recommendation and timeline. Free, no signup required." });

  const [form, setForm] = useState({ projectType: "", businessType: "", pages: "", features: "", budget: "", timeline: "", notes: "" });
  const { run, result, isLoading, error } = useAgentStream("quote");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.projectType) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="quote"
      title="AI Quote Generator"
      subtitle="Tell us what you need and get a detailed quote with package recommendation, inclusions and timeline."
      icon={<FileText className="w-7 h-7" />}
      accentColor="bg-violet-100 text-violet-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Get a Confirmed Quote"
      ctaHref="/contact"
      inputForm={
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Project Type <span className="text-red-500">*</span></label>
            <select value={form.projectType} onChange={set("projectType")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
              <option value="">Select type…</option>
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Business Type</label>
            <input type="text" value={form.businessType} onChange={set("businessType")} placeholder="e.g. Plumbing company, online clothing store" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Approx. Pages Needed</label>
            <input type="text" value={form.pages} onChange={set("pages")} placeholder="e.g. 5 pages, or 50 products" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Budget Range</label>
            <select value={form.budget} onChange={set("budget")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
              <option value="">Select budget…</option>
              {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Timeline</label>
            <select value={form.timeline} onChange={set("timeline")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
              <option value="">Select timeline…</option>
              {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Key Features Needed</label>
            <input type="text" value={form.features} onChange={set("features")} placeholder="e.g. booking system, payment gateway, blog" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1.5">Anything else we should know?</label>
            <textarea value={form.notes} onChange={set("notes")} placeholder="e.g. I need to match my competitor's site, I have branding ready, I want to go live before Christmas..." rows={2} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
          </div>
        </div>
      }
    />
  );
}
