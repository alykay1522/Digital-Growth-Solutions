import React, { useState } from "react";
import { AgentShell, useAgentStream } from "@/components/agents/AgentShell";
import { useMeta } from "@/hooks/useMeta";
import { Sparkles } from "lucide-react";

const CONTENT_TYPES = [
  "Homepage hero section", "About Us page", "Services page", "Single service description",
  "Homepage headline + subheadline", "Meta title + meta description", "Blog post intro",
  "Contact page copy", "FAQ section", "Testimonials section intro",
];
const TONES = ["Professional but friendly", "Casual and conversational", "Authoritative and expert", "Bold and direct", "Warm and approachable", "Luxury / Premium"];

export default function ContentAgent() {
  useMeta({ title: "AI Content Generator", description: "Generate homepage copy, about pages, service descriptions and meta tags for your business. Free, instant." });

  const [form, setForm] = useState({ contentType: "", businessName: "", businessType: "", location: "", targetAudience: "", keywords: "", tone: "", notes: "" });
  const { run, result, isLoading, error } = useAgentStream("content");

  function set(k: string) { return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((p) => ({ ...p, [k]: e.target.value })); }

  function handleSubmit() {
    if (!form.contentType || !form.businessType) return;
    run(form);
  }

  return (
    <AgentShell
      agentId="content"
      title="AI Content Generator"
      subtitle="Generate conversion-focused website copy for any page or section — ready to paste straight in."
      icon={<Sparkles className="w-7 h-7" />}
      accentColor="bg-pink-100 text-pink-600"
      isLoading={isLoading}
      result={error ? `Error: ${error}` : result}
      onSubmit={handleSubmit}
      ctaLabel="Let Us Write Your Full Site"
      ctaHref="/contact"
      inputForm={
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Content Type <span className="text-red-500">*</span></label>
            <select value={form.contentType} onChange={set("contentType")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select content type…</option>
              {CONTENT_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Business Type <span className="text-red-500">*</span></label>
            <input type="text" value={form.businessType} onChange={set("businessType")} placeholder="e.g. Plumbing company, Yoga studio" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Business Name (optional)</label>
            <input type="text" value={form.businessName} onChange={set("businessName")} placeholder="e.g. Smith & Sons Plumbing" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={set("location")} placeholder="e.g. Manchester, UK" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Target Audience</label>
            <input type="text" value={form.targetAudience} onChange={set("targetAudience")} placeholder="e.g. Homeowners, small business owners" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Tone / Style</label>
            <select value={form.tone} onChange={set("tone")} className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition">
              <option value="">Select tone…</option>
              {TONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Primary Keywords (optional)</label>
            <input type="text" value={form.keywords} onChange={set("keywords")} placeholder="e.g. emergency plumber Manchester" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Special Notes</label>
            <input type="text" value={form.notes} onChange={set("notes")} placeholder="e.g. mention 24hr callouts, 15 years experience" className="w-full h-11 px-4 rounded-xl border border-border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          </div>
        </div>
      }
    />
  );
}
