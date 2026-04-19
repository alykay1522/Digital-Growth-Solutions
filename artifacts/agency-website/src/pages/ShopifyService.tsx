import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { GA } from "@/utils/analytics";
import { JsonLd } from "@/components/JsonLd";
import {
  ArrowRight, CheckCircle2, ShoppingBag, Zap, Star,
  BarChart3, Clock, Shield, Palette, Globe, Truck, CreditCard,
  ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";

const PROCESS = [
  { step: "01", title: "Discovery & Strategy", desc: "We audit your current setup (or brief), map your customer journey, and define the store architecture — product structure, navigation, checkout flow, and conversion goals." },
  { step: "02", title: "Design & Brand Build", desc: "Your Shopify store is designed pixel-by-pixel to match your brand identity. Mobile-first, conversion-optimised layouts with Shopify 2.0 sections." },
  { step: "03", title: "Development & Integrations", desc: "We build the theme, configure apps (reviews, email, loyalty, upsells), connect payment providers, and integrate your fulfilment and inventory systems." },
  { step: "04", title: "Testing & Launch", desc: "Full QA across devices and browsers. We test checkout flows, payment gateways, emails, and speed. Then we launch — and stay on hand for 30 days post-go-live." },
];

const DELIVERABLES = [
  "Custom Shopify theme (2.0 sections-based)",
  "Mobile-optimised, sub-2s load time",
  "Product catalogue setup & import",
  "Payment gateway configuration",
  "Email marketing integration (Klaviyo / Mailchimp)",
  "Abandoned cart recovery flows",
  "Review & social proof app setup",
  "Post-launch 30-day support",
];

const FAQS = [
  { q: "Do I need a Shopify subscription before we start?", a: "Yes — you'll need at minimum a Shopify Basic plan ($29/mo). We can guide you through sign-up and recommend the right plan for your volume." },
  { q: "Can you migrate my existing WooCommerce or BigCommerce store?", a: "Absolutely. We handle full product, order, and customer data migrations with zero downtime using proven migration tools." },
  { q: "How long does a Shopify build take?", a: "A standard store takes 2–4 weeks. Custom theme builds or complex integrations (ERP, wholesale, multi-currency) take 4–8 weeks." },
  { q: "Will my store rank on Google?", a: "Yes — every store we build includes on-page SEO setup: meta titles, descriptions, structured data for products, canonical URLs, and optimised image alt text." },
  { q: "What if I already have a Shopify store and just need improvements?", a: "We offer a Shopify Optimisation package — CRO audit, speed improvements, checkout redesign, and conversion-focused redesigns of key pages." },
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
        <div className="px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ShopifyService() {
  useMeta({
    title: "Shopify Development Agency",
    description: "Expert Shopify store design and development for brands that want to sell more. Custom themes, migrations, integrations, and CRO — built and launched in weeks.",
    path: "/services/shopify-development",
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
      { "@type": "ListItem", position: 3, name: "Shopify Development", item: "https://digitalgrowthsolutionsagency.com/services/shopify-development" },
    ],
  };

  return (
    <main className="w-full">
      <JsonLd id="shopify-faq-schema" schema={faqSchema} />
      <JsonLd id="shopify-breadcrumb-schema" schema={breadcrumbSchema} />
      {/* HERO */}
      <section className="relative bg-secondary pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
              <ShoppingBag className="w-4 h-4" />
              Shopify Development
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-6">
              A Shopify store that actually<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary">converts visitors into buyers</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mb-8 leading-relaxed">
              We build custom Shopify stores for product brands, DTC businesses, and retailers who want more than a template — they want a store that sells around the clock.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button
                  className="h-14 px-8 text-lg rounded-xl bg-green-500 hover:bg-green-400 text-white shadow-xl shadow-green-500/20 gap-2"
                  onClick={() => GA.ctaClick("shopify_hero_start_project")}
                >
                  Start your Shopify project
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10">
                  View pricing
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: Clock, label: "2–4 week delivery" },
                { icon: Shield, label: "30-day post-launch support" },
                { icon: BarChart3, label: "Conversion-first design" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/60 text-sm">
                  <Icon className="w-4 h-4 text-green-400" />
                  {label}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-16 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl font-display font-bold text-secondary">Who this is for</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: ShoppingBag, title: "Product brands", desc: "Launching a physical product line and need a store that handles volume." },
              { icon: Globe, title: "DTC businesses", desc: "Selling direct-to-consumer and want to own your customer data and margins." },
              { icon: Truck, title: "Retailers going online", desc: "Bringing a brick-and-mortar business online for the first time." },
              { icon: CreditCard, title: "WooCommerce migrants", desc: "Tired of plugins and downtime — ready to move to a managed platform." },
            ].map(({ icon: Icon, title, desc }) => (
              <AnimatedSection key={title}>
                <div className="bg-gray-50 rounded-2xl p-5 h-full">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-secondary mb-1">{title}</h3>
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">How we build your store</h2>
            <p className="text-muted-foreground text-lg">A clear, predictable process — no surprises, no delays.</p>
          </AnimatedSection>
          <div className="space-y-6">
            {PROCESS.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border p-7 flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <span className="font-display font-bold text-green-600">{item.step}</span>
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

      {/* DELIVERABLES */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="right">
              <h2 className="text-3xl font-display font-bold text-secondary mb-4">What you get</h2>
              <p className="text-muted-foreground mb-8">Every Shopify project includes a full production-ready store — not a template dump.</p>
              <ul className="space-y-3">
                {DELIVERABLES.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection direction="left">
              <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                  <span className="font-bold ml-1">5.0</span>
                </div>
                <blockquote className="text-white/80 text-lg leading-relaxed mb-6">
                  "They moved our WooCommerce store to Shopify in 3 weeks. Cart abandonment dropped 40%, average order value went up 22%. Best decision we made this year."
                </blockquote>
                <div>
                  <p className="font-bold">Marcus Webb</p>
                  <p className="text-white/50 text-sm">Marketing Director, Aura Commerce</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* PRICING GUIDANCE */}
      <section className="py-20 bg-gray-50 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">Pricing guidance</h2>
            <p className="text-muted-foreground text-lg mb-10">Fixed pricing — no hourly billing, no scope creep surprises.</p>
            <div className="grid sm:grid-cols-3 gap-5 text-left mb-10">
              {[
                { tier: "Starter Store", price: "From $1,497", items: ["Up to 50 products", "Standard theme customisation", "Payment & email setup", "2 revision rounds"] },
                { tier: "Growth Store", price: "From $2,997", items: ["Up to 500 products", "Custom Shopify 2.0 theme", "App integrations (3+)", "Migration from other platforms", "4 revision rounds"] },
                { tier: "Custom / Enterprise", price: "Custom quote", items: ["Unlimited products", "Fully bespoke theme", "ERP / WMS integration", "Multi-currency & markets", "Dedicated project manager"] },
              ].map(({ tier, price, items }) => (
                <div key={tier} className="bg-white rounded-2xl border border-border p-6">
                  <p className="font-display font-bold text-secondary mb-1">{tier}</p>
                  <p className="text-primary font-bold text-xl mb-4">{price}</p>
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Link href="/contact">
              <Button className="h-12 px-8 rounded-xl gap-2" onClick={() => GA.ctaClick("shopify_pricing_get_quote")}>
                Get a free quote <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to build a Shopify store that sells?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Tell us about your products and goals. We'll scope the project and send you a fixed-price proposal within 24 hours.
            </p>
            <Link href="/contact">
              <Button
                className="h-14 px-10 text-lg rounded-xl bg-white text-green-700 hover:bg-white/90 font-bold shadow-xl gap-2"
                onClick={() => GA.ctaClick("shopify_cta_bottom")}
              >
                Start your project <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
