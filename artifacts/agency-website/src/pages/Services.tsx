import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Check,
  Code,
  FileText,
  Globe,
  Layout,
  Palette,
  Server,
  Smartphone,
  Sparkles,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";
import { useGetServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const IconMap: Record<string, React.ElementType> = {
  Code, Globe, Layout, Palette, Server, Smartphone, Zap,
};

const FALLBACK_SERVICES = [
  {
    id: "1",
    title: "WordPress Development",
    description: "High-performing, fully customized, SEO-optimized, lightning-fast WordPress websites that look amazing and perform even better.",
    icon: "Globe",
    category: "Web",
    features: ["SEO Optimization", "Speed & Performance Tuning", "Custom Post Types", "Robust Security"],
  },
  {
    id: "2",
    title: "Custom Plugins & Add-Ons",
    description: "We create completely custom plugins to deliver specialized tools, improve usability, and integrate third-party software.",
    icon: "Code",
    category: "Development",
    features: ["3rd-party API Integration", "Workflow Automation", "Plugin Maintenance", "Feature Extension"],
  },
  {
    id: "3",
    title: "Theme Customization",
    description: "Transform off-the-shelf themes into branded, conversion-optimized experiences, or build custom themes from scratch.",
    icon: "Palette",
    category: "Design",
    features: ["Pixel-perfect Design", "Brand Identity Match", "Custom Layouts", "Animation Integration"],
  },
  {
    id: "4",
    title: "eCommerce Solutions",
    description: "Complete WooCommerce and Shopify solutions to make your digital storefront memorable and efficient.",
    icon: "Layout",
    category: "Commerce",
    features: ["Shopify Development", "WooCommerce Customization", "Payment Gateway Integration", "Inventory Sync"],
  },
  {
    id: "5",
    title: "Mobile-First Design",
    description: "We develop websites so they look and perform great on all devices, providing a seamless user experience.",
    icon: "Smartphone",
    category: "Design",
    features: ["Responsive Layouts", "Touch-friendly UI", "App-like Experience", "Cross-browser Testing"],
  },
  {
    id: "6",
    title: "Software & Web Apps",
    description: "Custom-built applications and software solutions designed to solve complex business problems.",
    icon: "Server",
    category: "Development",
    features: ["React & Node.js", "Database Architecture", "Cloud Hosting", "Admin Dashboards"],
  },
];

const AI_SERVICES = [
  {
    id: "ai-1",
    icon: FileText,
    title: "AI Content Automation",
    description:
      "Stop writing from scratch. We build pipelines that generate on-brand blog posts, product pages, meta descriptions, and social copy — reviewed by humans, scaled by AI.",
    features: [
      "Automated blog & SEO content",
      "On-brand tone & voice training",
      "CMS auto-publishing",
      "Content performance tracking",
    ],
    badge: "Content",
  },
  {
    id: "ai-2",
    icon: Bot,
    title: "AI Chatbot Installation",
    description:
      "Deploy a trained AI assistant on your site that answers questions, qualifies leads, books appointments, and escalates to humans — 24/7, zero extra headcount.",
    features: [
      "Custom knowledge base training",
      "Lead capture & CRM sync",
      "Appointment booking integration",
      "Handoff to live chat",
    ],
    badge: "Chatbots",
  },
  {
    id: "ai-3",
    icon: Sparkles,
    title: "AI Product Description Generation",
    description:
      "Generate hundreds of SEO-optimized, conversion-focused product descriptions in minutes — trained on your brand voice, compliant with your category requirements.",
    features: [
      "Bulk generation from CSV / PIM",
      "SEO keyword integration",
      "Variant-level copy",
      "Shopify & WooCommerce import",
    ],
    badge: "eCommerce",
  },
  {
    id: "ai-4",
    icon: Workflow,
    title: "AI Workflow Automation",
    description:
      "Identify repetitive tasks across your business and replace them with intelligent automations — from lead routing to invoice processing to support ticket triage.",
    features: [
      "Process mapping & audit",
      "N8n / Zapier / custom pipelines",
      "CRM & ERP integration",
      "Exception handling & alerts",
    ],
    badge: "Operations",
  },
  {
    id: "ai-5",
    icon: Wand2,
    title: "AI-Powered Redesigns",
    description:
      "We analyze your existing site with AI — traffic patterns, heatmaps, conversion data — then redesign for performance. Data-driven decisions, not design opinions.",
    features: [
      "Conversion rate analysis",
      "AI layout recommendations",
      "A/B testing setup",
      "Full visual redesign",
    ],
    badge: "Design",
  },
];

export default function Services() {
  useMeta({ title: "Services", description: "WordPress development, Shopify builds, custom software, and AI automation services. Fast delivery, transparent pricing, and expert support from NexaAgency." });
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : FALLBACK_SERVICES;

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-mesh opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive digital solutions — from WordPress and Shopify builds to full AI integration — to help your business work smarter, reach wider, and grow faster.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Core Web Services */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Web & Development
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary">
              Core Services
            </h2>
          </AnimatedSection>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => {
                const IconComponent = IconMap[service.icon] || Code;
                return (
                  <AnimatedSection key={service.id} delay={i * 0.08}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/20 transition-all h-full flex flex-col group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                            {(service as any).category || "Service"}
                          </span>
                          <h3 className="text-xl font-bold text-secondary leading-tight">{service.title}</h3>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-8 leading-relaxed">{service.description}</p>
                      <div className="mt-auto">
                        <h4 className="font-semibold text-xs uppercase tracking-wider text-secondary/50 mb-3">
                          Key Features
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2.5">
                          {(service as any).features?.map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                              <span className="text-sm text-secondary/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* AI Services Section */}
      <section id="ai" className="py-24 bg-secondary relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-5">
              <BrainCircuit className="w-4 h-4 text-accent" />
              New in 2026
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              AI-Powered Services
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              The next competitive advantage isn't a new website. It's intelligent automation layered into your existing operations. We build it.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_SERVICES.map((service, i) => {
              const Icon = service.icon;
              return (
                <AnimatedSection key={service.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/10 hover:border-white/20 transition-all h-full flex flex-col group"
                  >
                    {/* Badge */}
                    <span className="absolute top-5 right-5 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
                      {service.badge}
                    </span>

                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 leading-tight pr-12">
                      {service.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed mb-6 text-sm">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mt-auto mb-6">
                      {service.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span className="text-white/70">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact">
                      <button className="flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-white transition-colors group/btn">
                        Get a quote
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </motion.div>
                </AnimatedSection>
              );
            })}

            {/* AI Audit CTA card */}
            <AnimatedSection delay={AI_SERVICES.length * 0.08}>
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-7 h-full flex flex-col justify-between">
                <div>
                  <BrainCircuit className="w-10 h-10 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">Not sure where AI fits in your business?</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Book a free 30-minute AI Readiness call. We'll map your workflow, identify three quick wins, and show you exactly where automation pays off.
                  </p>
                </div>
                <Link href="/contact" className="mt-6">
                  <Button className="w-full bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-11">
                    Book Free AI Audit
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-white border-t border-border text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Not sure what you need?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Let's talk through your goals — whether it's a new site, a Shopify migration, or an AI workflow. We'll tell you exactly what makes sense.
        </p>
        <Link href="/contact">
          <Button className="h-12 px-8 text-base rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
            Schedule a Free Consultation
          </Button>
        </Link>
      </section>
    </div>
  );
}
