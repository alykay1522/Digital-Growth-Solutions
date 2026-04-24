import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { Shield } from "lucide-react";

const SITE_TYPES = ["WordPress", "Shopify", "WooCommerce", "Custom HTML/CSS", "Squarespace / Wix / Weebly", "Webflow", "Other"];
const TRAFFIC = ["Under 500/mo", "500–2,000/mo", "2,000–10,000/mo", "10,000+/mo", "Not sure"];
const TECH_LEVELS = ["Non-technical (I need someone to handle everything)", "Basic (I can log into WordPress)", "Intermediate (I can do basic edits)", "Advanced (I'm comfortable with code)"];
const BUDGETS = ["Under $50/mo", "$50–$100/mo", "$100–$200/mo", "Not sure"];

export default function CarePlanAgent() {
  useMeta({ title: "AI Care Plan Agent", description: "Find out which website maintenance plan is right for you. Get a risk assessment and ROI breakdown. Free." });

  const [form, setForm] = useState({ siteType: "", traffic: "", budget: "", lastUpdated: "", techLevel: "", concerns: "" });
  const { run, result, isLoading, error } = useAgentStream("care-plan");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.siteType) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="care-plan"
      title="AI Care Plan Agent"
      subtitle="Find the right maintenance plan for your site — with a risk assessment and cost-vs-risk breakdown."
      icon={<Shield className="w-7 h-7" />}
      accentColor="bg-teal-100 text-teal-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Set Up My Care Plan"
      ctaHref="/pay"
      inputForm={
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Site Type / Platform <span className="text-red-500">*</span></label>
            <select value={form.siteType} onChange={set("siteType")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select platform…</option>
              {SITE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Monthly Traffic</label>
            <select value={form.traffic} onChange={set("traffic")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select…</option>
              {TRAFFIC.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Technical Ability</label>
            <select value={form.techLevel} onChange={set("techLevel")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select…</option>
              {TECH_LEVELS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Monthly Budget</label>
            <select value={form.budget} onChange={set("budget")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select…</option>
              {BUDGETS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Last Updated / Maintained</label>
            <input type="text" value={form.lastUpdated} onChange={set("lastUpdated")} placeholder="e.g. 6 months ago, never, last week" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Main Concerns</label>
            <input type="text" value={form.concerns} onChange={set("concerns")} placeholder="e.g. security, uptime, speed, content updates" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
        </div>
      }
    />
  );
}
