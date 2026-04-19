import React, { useState } from "react";
import { Link } from "wouter";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { GA } from "@/utils/analytics";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowRight, Bot, BrainCircuit, CheckCircle2, Clock,
  Mail, MessageSquare, Repeat, Star, Workflow, Zap,
  ChevronDown, ChevronUp, BarChart3, Shield,
} from "lucide-react";

const AUTOMATIONS = [
  { icon: Mail, title: "Lead nurture sequences", desc: "AI-written email sequences that follow up with enquiries 24/7, qualify leads, and book calls — without a sales person." },
  { icon: MessageSquare, title: "AI chatbot & live chat", desc: "Trained on your products, services, and FAQs. Handles enquiries, quotes, and bookings. Escalates to humans when needed." },
  { icon: Repeat, title: "Onboarding & follow-up", desc: "Automated onboarding flows for new clients or customers. Progress updates, document requests, and satisfaction checks — all on autopilot." },
  { icon: Workflow, title: "Internal workflow automation", desc: "Connect your tools (CRM, invoicing, project management, email) and eliminate manual data entry. Integrates with Zapier, Make, n8n, and custom APIs." },
  { icon: BarChart3, title: "Reporting & insights", desc: "Automated weekly/monthly reports pulled from your analytics, ads, and CRM — delivered to your inbox without touching a dashboard." },
  { icon: BrainCircuit, title: "Custom AI assistants", desc: "GPT-powered assistants trained on your data — for customer service, internal knowledge bases, proposal generation, or content creation." },
];

const PROCESS = [
  { step: "01", title: "Automation audit", desc: "We map your current workflows, identify the 3–5 highest-ROI automation opportunities, and estimate hours saved per week for each." },
  { step: "02", title: "Blueprint & approval", desc: "You receive a clear automation blueprint — what triggers what, what data moves where, and exactly what the output looks like. No surprises." },
  { step: "03", title: "Build & integrate", desc: "We build the automation using the right tools for your stack — Make, Zapier, n8n, custom APIs, or AI model integrations (OpenAI, Anthropic, etc.)." },
  { step: "04", title: "Test, train & hand over", desc: "Full testing with real data. We train your team on monitoring and adjusting the system, then hand over full documentation." },
];

const FAQS = [
  { q: "Do I need to be technical to use AI automation?", a: "Not at all. We handle all the technical setup. After handover, your team manages the workflows through simple dashboards — no code required." },
  { q: "Which tools do you integrate with?", a: "We integrate with 500+ tools including HubSpot, Salesforce, Mailchimp, Klaviyo, Xero, QuickBooks, Slack, Notion, Google Workspace, Shopify, WooCommerce, and custom APIs." },
  { q: "How much time can automation actually save?", a: "Most clients save 5–15 hours per week on repetitive tasks within the first month. ROI is typically achieved within 2–3 months." },
  { q: "Is my data safe?", a: "Yes. We follow data minimisation principles, use encrypted API connections, and never store your data on third-party servers without your consent. GDPR-compliant by design." },
  { q: "What if the automation breaks or needs updating?", a: "We offer ongoing maintenance plans starting from $99/month. All automations include 30 days of free monitoring and fixes post-launch." },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-secondary">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">{a}</div>
      )}
    </div>
  );
}

export default function AIService() {
  useMeta({
    title: "AI Automation for Small Business",
    description: "AI-powered workflows that handle leads, emails, onboarding, and reporting — so your business runs 24/7 without extra headcount. Built by AI automation experts.",
    path: "/services/ai-automation",
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://digitalgrowthsolutionsagency.com/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://digitalgrowthsolutionsagency.com/services" },
      { "@type": "ListItem", position: 3, name: "AI Automation", item: "https://digitalgrowthsolutionsagency.com/services/ai-automation" },
    ],
  };

  return (
    <main className="w-full">
      <JsonLd id="ai-faq-schema" schema={faqSchema} />
      <JsonLd id="ai-breadcrumb-schema" schema={breadcrumbSchema} />
      {/* HERO */}
      <section className="relative bg-secondary pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-sm font-semibold mb-6">
              <Bot className="w-4 h-4" />
              AI Automation
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              Your business, running<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary">24/7 on autopilot</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mb-8 leading-relaxed">
              We build AI-powered automation systems that handle your repetitive tasks — lead follow-up, onboarding, reporting, customer support — so you can focus on growing the business, not running it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button
                  className="h-14 px-8 text-lg rounded-xl bg-violet-600 hover:bg-violet-500 text-white shadow-xl shadow-violet-500/20 gap-2"
                  onClick={() => GA.ctaClick("ai_hero_start_project")}
                >
                  Book a free automation audit
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/roi">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10"
                  onClick={() => GA.toolLaunch("roi_calculator")}>
                  Calculate your ROI
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: Zap, label: "Live within 2–3 weeks" },
                { icon: Shield, label: "GDPR-compliant by design" },
                { icon: Clock, label: "Save 5–15 hrs/week on average" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
                  <Icon className="w-4 h-4 text-violet-400" />
                  {label}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* AUTOMATION TYPES */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">What we automate</h2>
            <p className="text-muted-foreground text-lg">The most impactful use cases for small and mid-size businesses.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AUTOMATIONS.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.08}>
                <div className="bg-gray-50 rounded-2xl border border-border p-6 h-full hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="font-bold text-secondary mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">How it works</h2>
            <p className="text-muted-foreground text-lg">From audit to live automation — in weeks, not months.</p>
          </AnimatedSection>
          <div className="space-y-6">
            {PROCESS.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border p-7 flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <span className="font-display font-bold text-violet-600">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL + PRICING */}
      <section className="py-20 bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <AnimatedSection direction="right">
              <h2 className="text-3xl font-display font-bold text-secondary mb-6">Pricing guidance</h2>
              <div className="space-y-4">
                {[
                  { name: "Automation Starter", price: "From $997", desc: "1–2 automation flows. Best for: lead nurture, enquiry follow-up, or simple onboarding." },
                  { name: "Automation Growth", price: "From $2,497", desc: "3–6 connected automation flows. Full system with CRM, email, reporting, and chatbot." },
                  { name: "AI-Powered System", price: "From $4,997", desc: "Custom AI assistant + full automation ecosystem. Enterprise-grade, custom integrations." },
                ].map(({ name, price, desc }) => (
                  <div key={name} className="bg-gray-50 rounded-xl border border-border p-5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-secondary">{name}</p>
                      <p className="text-primary font-bold">{price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="inline-block mt-6">
                <Button className="gap-2" onClick={() => GA.ctaClick("ai_pricing_get_quote")}>
                  Get a free automation audit <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimatedSection>
            <AnimatedSection direction="left">
              <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                  <span className="font-bold ml-1">5.0</span>
                </div>
                <blockquote className="text-white/80 text-lg leading-relaxed mb-6">
                  "Their WordPress plugin work saved us from building a $50k custom solution. The AI follow-up system they built now handles 80% of our inbound enquiries automatically. We've not hired anyone new in 8 months."
                </blockquote>
                <div>
                  <p className="font-bold">James Okafor</p>
                  <p className="text-white/50 text-sm">CTO, FlowDesk</p>
                </div>
              </div>
              <div className="mt-6 bg-violet-50 rounded-2xl border border-violet-100 p-5">
                <p className="font-bold text-secondary mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-violet-600" /> Average results within 60 days
                </p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { value: "12hrs", label: "saved per week" },
                    { value: "3×", label: "faster follow-up" },
                    { value: "40%", label: "more conversions" },
                  ].map(({ value, label }) => (
                    <div key={label}>
                      <p className="text-2xl font-display font-bold text-violet-700">{value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-secondary">Frequently asked questions</h2>
          </AnimatedSection>
          <div className="space-y-3">
            {FAQS.map((faq) => <FAQ key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-violet-700 to-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to put your business on autopilot?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Book a free 30-minute automation audit. We'll identify your top 3 automation opportunities and estimate your time and cost savings — no commitment required.
            </p>
            <Link href="/contact">
              <Button
                className="h-14 px-10 text-lg rounded-xl bg-white text-violet-700 hover:bg-white/90 font-bold shadow-xl gap-2"
                onClick={() => GA.ctaClick("ai_cta_bottom")}
              >
                Book your free audit <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
