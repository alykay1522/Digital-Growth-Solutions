import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { HeartHandshake } from "lucide-react";

const PROJECT_TYPES = ["New Website", "Website Redesign", "eCommerce Store", "AI Automation Setup", "Custom Web App", "Other"];
const BRAND_STYLES = ["Modern & Minimal", "Bold & Colourful", "Professional / Corporate", "Friendly / Approachable", "Luxury / Premium", "Not sure yet"];

export default function IntakeAgent() {
  useMeta({ title: "AI Intake & Onboarding", description: "Start your project with our AI onboarding agent. Get a full project brief, timeline and checklist in seconds." });

  const [form, setForm] = useState({
    name: "", business: "", email: "", projectType: "",
    description: "", goals: "", deadline: "", budget: "",
    competitors: "", brandStyle: "",
  });
  const { run, result, isLoading, error } = useAgentStream("intake");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.description) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="intake"
      title="AI Intake & Onboarding Agent"
      subtitle="Fill in your project details and get a full brief, timeline, and checklist of what to prepare."
      icon={<HeartHandshake className="w-7 h-7" />}
      accentColor="bg-emerald-100 text-emerald-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Book Your Kickoff Call"
      ctaHref="/contact"
      inputForm={
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Your Name</label>
            <input type="text" value={form.name} onChange={set("name")} placeholder="Jane Smith" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Business Name</label>
            <input type="text" value={form.business} onChange={set("business")} placeholder="Smith Plumbing Ltd" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Email Address</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="jane@smithplumbing.com" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Project Type</label>
            <select value={form.projectType} onChange={set("projectType")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select…</option>
              {PROJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1.5">Project Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={set("description")} placeholder="Describe your project as if talking to a friend. What do you need? What's the problem you're trying to solve?" rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-gray-50/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Goals / Success Criteria</label>
            <input type="text" value={form.goals} onChange={set("goals")} placeholder="e.g. get 10 enquiries/week, rank on Google" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Deadline</label>
            <input type="text" value={form.deadline} onChange={set("deadline")} placeholder="e.g. by end of March, ASAP, flexible" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Budget</label>
            <input type="text" value={form.budget} onChange={set("budget")} placeholder="e.g. around $1,500, under $2,000" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Brand Style Preference</label>
            <select value={form.brandStyle} onChange={set("brandStyle")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select…</option>
              {BRAND_STYLES.map((b) => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-1.5">Competitor / Inspiration Sites (optional)</label>
            <input type="text" value={form.competitors} onChange={set("competitors")} placeholder="e.g. apple.com, stripe.com — sites whose design you like" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
        </div>
      }
    />
  );
}
