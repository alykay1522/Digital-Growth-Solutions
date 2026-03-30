import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  Check,
  Code,
  Globe,
  HelpCircle,
  Layers,
  MessageSquare,
  Minus,
  ShoppingCart,
  Sparkles,
  Star,
  Wand2,
  X,
  Zap,
} from "lucide-react";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for small businesses & landing pages",
    price: "1,499",
    priceNote: "one-time",
    highlight: false,
    icon: Globe,
    color: "text-blue-600",
    bg: "bg-blue-50",
    features: [
      "WordPress or static site",
      "Up to 5 pages",
      "Mobile-responsive design",
      "Basic SEO setup",
      "Contact form integration",
      "Google Analytics setup",
      "30-day support included",
      "1 round of revisions",
    ],
    notIncluded: [
      "Custom plugin development",
      "eCommerce / payments",
      "AI integrations",
    ],
    cta: "Get Started",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For businesses ready to scale their online presence",
    price: "3,999",
    priceNote: "one-time",
    highlight: true,
    badge: "Most Popular",
    icon: Zap,
    color: "text-primary",
    bg: "bg-primary/10",
    features: [
      "WordPress or Shopify / WooCommerce",
      "Up to 20 pages or products",
      "Custom design (not a template)",
      "On-page SEO + site speed tuning",
      "Payment gateway integration",
      "Blog / content hub setup",
      "CRM or email marketing integration",
      "60-day support included",
      "3 rounds of revisions",
    ],
    notIncluded: ["Custom software / web app", "AI automation pipelines"],
    cta: "Start Your Project",
  },
  {
    id: "pro",
    name: "Pro Build",
    tagline: "Full-power custom sites and web applications",
    price: "7,999",
    priceNote: "starting from",
    highlight: false,
    icon: Code,
    color: "text-violet-600",
    bg: "bg-violet-50",
    features: [
      "Fully custom design & development",
      "Unlimited pages / products",
      "Custom plugin or feature development",
      "Advanced SEO & performance audit",
      "Multi-gateway payment setup",
      "Advanced analytics & reporting",
      "Third-party API integrations",
      "Staff training session",
      "90-day priority support",
      "Unlimited revisions",
    ],
    notIncluded: [],
    cta: "Get a Custom Quote",
  },
];

const AI_ADDONS = [
  {
    icon: Bot,
    name: "AI Chatbot",
    price: "From $997",
    period: "setup + $199/mo",
    desc: "Trained on your content — answers questions, qualifies leads, books appointments.",
  },
  {
    icon: Sparkles,
    name: "AI Content Pipeline",
    price: "From $1,499",
    period: "setup + $499/mo",
    desc: "Automated blog posts, product descriptions, and social copy in your brand voice.",
  },
  {
    icon: Wand2,
    name: "AI-Powered Redesign",
    price: "From $2,999",
    period: "one-time",
    desc: "Data-driven layout analysis + full visual redesign built to improve conversions.",
  },
  {
    icon: BrainCircuit,
    name: "Workflow Automation",
    price: "From $1,999",
    period: "setup + $299/mo",
    desc: "Automate lead routing, invoicing, support triage, and internal operations.",
  },
];

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "Starter sites typically ship in 2–3 weeks. Growth builds take 4–6 weeks. Pro builds vary from 6–16 weeks depending on scope. We'll give you a firm timeline before you sign anything.",
  },
  {
    q: "Do I need to pay everything upfront?",
    a: "No. We work on a 50% deposit to start and 50% on launch. For larger Pro builds we can arrange milestone-based payments — we'll discuss this during your kickoff call.",
  },
  {
    q: "What happens after the support period ends?",
    a: "You can move to one of our monthly maintenance retainers (from $299/mo), or just pay-as-you-go for any updates. We never abandon a client — we'll be here whenever you need us.",
  },
  {
    q: "Can I add AI features to an existing Starter or Growth site?",
    a: "Absolutely. Our AI add-ons work on any site we've built, and most also work on existing sites built elsewhere.",
  },
  {
    q: "What's included in eCommerce packages?",
    a: "Product catalog setup, payment gateway configuration, shipping rules, tax settings, abandoned cart recovery, and basic inventory management. Product photography and copywriting are separate.",
  },
  {
    q: "Do you offer refunds if I'm not happy?",
    a: "We do pre-project discovery to define everything in writing. If we build something that doesn't match the agreed scope, we fix it at no charge. We haven't had a refund request in 3 years.",
  },
];

const COMPARISON_FEATURES = [
  { label: "Custom design", starter: true, growth: true, pro: true },
  { label: "Mobile-responsive", starter: true, growth: true, pro: true },
  { label: "SEO setup", starter: "Basic", growth: "Advanced", pro: "Full audit" },
  { label: "eCommerce / payments", starter: false, growth: true, pro: true },
  { label: "Blog / CMS", starter: false, growth: true, pro: true },
  { label: "Custom plugins", starter: false, growth: false, pro: true },
  { label: "API integrations", starter: false, growth: "1 integration", pro: "Unlimited" },
  { label: "Support period", starter: "30 days", growth: "60 days", pro: "90 days" },
  { label: "Revisions", starter: "1 round", growth: "3 rounds", pro: "Unlimited" },
  { label: "AI add-ons eligible", starter: true, growth: true, pro: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-green-500 mx-auto" />;
  if (value === false) return <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />;
  return <span className="text-xs font-medium text-secondary/70">{value}</span>;
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-secondary pr-4">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <X className={`w-5 h-5 shrink-0 ${open ? "text-primary" : "text-muted-foreground/40 rotate-45"}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <BadgeCheck className="w-4 h-4 text-accent" />
              Transparent pricing — no hidden fees
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">
              Simple, honest <span className="text-gradient">pricing</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Every project is scoped before a single line of code is written. These ranges are our starting points — your exact quote will be clear before you commit.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Package cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, i) => {
            const Icon = pkg.icon;
            return (
              <AnimatedSection key={pkg.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative bg-white rounded-3xl border-2 p-8 shadow-lg flex flex-col h-full ${
                    pkg.highlight
                      ? "border-primary shadow-primary/15 shadow-2xl"
                      : "border-border"
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* Icon + name */}
                  <div className={`w-12 h-12 rounded-2xl ${pkg.bg} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${pkg.color}`} />
                  </div>

                  <h2 className="text-2xl font-display font-bold text-secondary mb-1">{pkg.name}</h2>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{pkg.tagline}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-display font-bold text-secondary">
                        ${pkg.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{pkg.priceNote}</p>
                  </div>

                  {/* CTA */}
                  <Link href="/contact">
                    <Button
                      className={`w-full h-12 rounded-xl font-bold mb-8 ${
                        pkg.highlight
                          ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                          : "bg-secondary hover:bg-secondary/90 text-white"
                      }`}
                    >
                      {pkg.cta} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>

                  {/* Features */}
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      What's included
                    </p>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-secondary/80">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {pkg.notIncluded.length > 0 && (
                      <>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                          Not included
                        </p>
                        <ul className="space-y-2">
                          {pkg.notIncluded.map((f) => (
                            <li key={f} className="flex items-start gap-3">
                              <Minus className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                              <span className="text-sm text-muted-foreground/60">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            All prices in USD. Need something bigger or different?{" "}
            <Link href="/contact" className="text-primary font-medium hover:underline">
              Get a custom quote →
            </Link>
          </p>
        </AnimatedSection>
      </section>

      {/* Comparison table */}
      <section className="py-16 bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary mb-2">
              Compare packages
            </h2>
            <p className="text-muted-foreground">Every detail, side by side.</p>
          </AnimatedSection>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-secondary w-1/2">Feature</th>
                  {PACKAGES.map((p) => (
                    <th
                      key={p.id}
                      className={`py-4 px-4 text-sm font-bold text-center ${
                        p.highlight ? "text-primary bg-primary/5" : "text-secondary"
                      }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-border last:border-0 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="py-3.5 px-6 text-sm text-secondary/80">{row.label}</td>
                    {(["starter", "growth", "pro"] as const).map((tier) => (
                      <td
                        key={tier}
                        className={`py-3.5 px-4 text-center ${
                          tier === "growth" ? "bg-primary/5" : ""
                        }`}
                      >
                        <FeatureValue value={(row as any)[tier]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* AI Add-ons */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-5">
              <BrainCircuit className="w-4 h-4 text-accent" />
              Add to any package
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
              AI Add-ons
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Layer intelligent automation onto any site we build — or your existing one.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AI_ADDONS.map((addon, i) => {
              const Icon = addon.icon;
              return (
                <AnimatedSection key={addon.name} delay={i * 0.07}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{addon.name}</h3>
                    <p className="text-accent font-semibold text-sm mb-1">{addon.price}</p>
                    <p className="text-white/40 text-xs mb-3">{addon.period}</p>
                    <p className="text-white/60 text-sm leading-relaxed flex-1">{addon.desc}</p>
                    <Link href="/contact" className="mt-4">
                      <button className="text-sm font-semibold text-accent hover:text-white transition-colors flex items-center gap-1">
                        Add to my project <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary mb-2">
            Common questions
          </h2>
          <p className="text-muted-foreground">If it's not here, ask us — we answer within 4 hours.</p>
        </AnimatedSection>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <AnimatedSection key={faq.q}>
              <FAQ q={faq.q} a={faq.a} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-white border-t border-border text-center px-4">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">
              Not sure which package fits?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tell us about your project in 60 seconds. We'll recommend the right package and give you a specific quote — no sales pressure, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/25">
                  Get a Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/audit">
                <Button variant="outline" className="h-12 px-8 rounded-xl border-border">
                  Try the Free Site Audit First
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
