import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { Wrench } from "lucide-react";

const PLATFORMS = ["WordPress", "Shopify", "WooCommerce", "Webflow", "Squarespace / Wix", "Custom HTML / PHP", "Other / Not sure"];
const LAST_WORKED = ["Just now (minutes ago)", "Today", "Yesterday", "Within the last week", "Over a week ago", "It's never worked properly"];

export default function RescueAgent() {
  useMeta({ title: "AI Website Rescue Agent", description: "Site broken? Get an instant diagnosis, DIY fix steps, and a professional repair quote from our AI rescue agent." });

  const [form, setForm] = useState({ problem: "", platform: "", symptoms: "", lastWorked: "", recentChanges: "" });
  const { run, result, isLoading, error } = useAgentStream("rescue");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.problem.trim()) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="rescue"
      title="AI Website Rescue Agent"
      subtitle="Describe your site problem and get an instant diagnosis, safe DIY steps, and a professional fix quote."
      icon={<Wrench className="w-7 h-7" />}
      accentColor="bg-red-100 text-red-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Get Emergency Help Now"
      ctaHref="/contact"
      inputForm={
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">
              Describe the problem <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.problem}
              onChange={set("problem")}
              placeholder="e.g. My WordPress site shows a white screen. I can't log into the dashboard. It stopped working after I updated a plugin."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Platform / CMS</label>
              <select value={form.platform} onChange={set("platform")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
                <option value="">Select platform…</option>
                {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">When did it last work?</label>
              <select value={form.lastWorked} onChange={set("lastWorked")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
                <option value="">Select…</option>
                {LAST_WORKED.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Specific symptoms</label>
              <input type="text" value={form.symptoms} onChange={set("symptoms")} placeholder="e.g. 500 error, blank page, redirect loop" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Recent changes made</label>
              <input type="text" value={form.recentChanges} onChange={set("recentChanges")} placeholder="e.g. updated plugins, changed theme, added code" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
            </div>
          </div>
        </div>
      }
    />
  );
}
