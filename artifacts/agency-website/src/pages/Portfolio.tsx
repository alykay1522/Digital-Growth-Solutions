import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Star, TrendingUp } from "lucide-react";
import { useGetPortfolio } from "@workspace/api-client-react";
import { useMeta } from "@/hooks/useMeta";
import { Skeleton } from "@/components/ui/skeleton";
import { GA } from "@/utils/analytics";

const FALLBACK_PORTFOLIO = [
  {
    id: "1",
    title: "Lumina Fintech",
    description: "Complete digital transformation for a financial services provider — from slow, hard-to-edit WordPress site to a fast, conversion-optimised platform with integrated lead capture.",
    category: "WordPress",
    tags: ["Custom Theme", "Lead Gen", "Performance"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    clientName: "Lumina Corp",
    result: "+300% lead generation",
    metric: "300%",
    metricLabel: "more leads",
    quote: "The ROI was obvious within 30 days. Lead volume tripled.",
    quoteName: "Sarah Chen, CEO",
  },
  {
    id: "2",
    title: "Aura Commerce",
    description: "Headless Shopify build for a luxury cosmetics brand. Custom theme, Klaviyo flows, review system, and loyalty programme — designed to maximise mobile conversion.",
    category: "Shopify",
    tags: ["Shopify", "Headless", "CRO"],
    imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
    clientName: "Aura Beauty",
    result: "+45% mobile conversions",
    metric: "45%",
    metricLabel: "mobile uplift",
    quote: "Best eCommerce build we've had in 8 years of trading.",
    quoteName: "Marcus Webb, Founder",
  },
  {
    id: "3",
    title: "Nexus Dashboard",
    description: "Custom analytics and reporting web app for a data intelligence company. Replaced a mess of spreadsheets with a real-time dashboard that pulls from 12 data sources.",
    category: "Web App",
    tags: ["React", "Node.js", "Real-time Data"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    clientName: "Nexus Data",
    result: "20 hrs/week saved",
    metric: "20hrs",
    metricLabel: "per week saved",
    quote: "Our team actually uses this. That's never happened before.",
    quoteName: "Daniel Kim, CTO",
  },
  {
    id: "4",
    title: "EcoLife Media",
    description: "High-traffic content platform on WordPress. Custom editorial workflow, automated SEO tooling, and a CDN setup that handles 1M+ monthly visitors without breaking a sweat.",
    category: "WordPress",
    tags: ["SEO", "Custom Plugin", "Scale"],
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
    clientName: "EcoLife Media",
    result: "1M+ monthly visitors",
    metric: "1M+",
    metricLabel: "monthly visitors",
    quote: "Organic traffic went from 80k to over a million in 9 months.",
    quoteName: "Rachel Torres, Editor-in-Chief",
  },
  {
    id: "5",
    title: "FlowDesk AI Workflows",
    description: "End-to-end AI automation for a B2B SaaS company. Built lead qualification, onboarding email sequences, and a weekly analytics summary — all running without human intervention.",
    category: "AI",
    tags: ["AI Automation", "Make.com", "OpenAI"],
    imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    clientName: "FlowDesk",
    result: "12 hrs/week reclaimed",
    metric: "12hrs",
    metricLabel: "reclaimed weekly",
    quote: "We stopped hiring for two roles because the automation handles them.",
    quoteName: "James Okafor, CEO",
  },
  {
    id: "6",
    title: "BrightCycle Mobile",
    description: "Full mobile-first redesign of a subscription eCommerce site. Rebuilt the checkout flow, added app-like navigation, and optimised every image for sub-1.5s mobile load times.",
    category: "Shopify",
    tags: ["Mobile-First", "Shopify", "UX"],
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    clientName: "BrightCycle",
    result: "65% more mobile sessions",
    metric: "65%",
    metricLabel: "mobile session lift",
    quote: "Mobile bounce rate dropped 38%. We finally stopped losing mobile visitors.",
    quoteName: "Priya Sharma, Operations",
  },
  {
    id: "7",
    title: "TechLayer Custom Plugin",
    description: "Custom WordPress plugin suite replacing a $50k bespoke SaaS tool. Delivered with full documentation, automated testing, and a clean admin UI the team could operate themselves.",
    category: "WordPress",
    tags: ["Custom Plugin", "PHP", "API"],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    clientName: "TechLayer",
    result: "$50k SaaS cost eliminated",
    metric: "$50k",
    metricLabel: "annual saving",
    quote: "Three agencies couldn't build this. Digital Growth built it in 10 weeks.",
    quoteName: "James K, VP Engineering",
  },
  {
    id: "8",
    title: "CoralSkin SEO & Rebuild",
    description: "Complete WordPress rebuild + SEO overhaul for a skincare brand. New site architecture, keyword-led content strategy, technical SEO, and ongoing monthly care plan.",
    category: "WordPress",
    tags: ["SEO", "WordPress", "Content"],
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    clientName: "CoralSkin",
    result: "Page 1 rankings in 3 months",
    metric: "#1",
    metricLabel: "on target keywords",
    quote: "Invisible on Google to ranking page one for our main terms in three months.",
    quoteName: "Priya Mehta, Founder",
  },
];

const CATEGORIES = ["All", "WordPress", "Shopify", "AI", "Web App"];

const SOCIAL_PROOF = [
  { name: "Sarah Chen", role: "CEO, Lumina Finance", quote: "Lead volume tripled within 30 days of the new site going live. The ROI conversation with my board was easy." },
  { name: "Marcus Webb", role: "Founder, Aura Beauty", quote: "We had 3 agencies quote before them. They were the only ones who actually understood the problem we were trying to solve." },
  { name: "James Okafor", role: "CEO, FlowDesk", quote: "The AI automation work paid for itself in 6 weeks. We haven't looked back." },
];

export default function Portfolio() {
  useMeta({
    title: "Portfolio — Real Work, Real Results",
    description: "Browse our portfolio of WordPress sites, Shopify stores, custom apps, and AI automation projects. Every case study includes measurable business outcomes.",
    path: "/portfolio",
  });

  const { data: apiPortfolio, isLoading } = useGetPortfolio();
  const portfolio = apiPortfolio?.length ? apiPortfolio : FALLBACK_PORTFOLIO;

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPortfolio = activeCategory === "All"
    ? portfolio
    : portfolio.filter((p: any) => p.category === activeCategory);

  return (
    <div className="w-full">

      {/* HERO */}
      <section className="bg-secondary text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6">
              <TrendingUp className="w-4 h-4 text-accent" />
              Real work, real results
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-5 leading-tight">
              300+ projects delivered.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Every one measured.</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              We don't just show you what we built — we show you what it achieved. Explore our work below.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* STAT STRIP */}
      <section className="bg-white border-b border-border py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "300+", label: "Projects delivered" },
            { value: "150+", label: "Happy clients" },
            { value: "10+", label: "Years of experience" },
            { value: "5.0★", label: "Average rating" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-display font-bold text-primary">{value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO GRID */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileTap={{ scale: 0.97 }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white border border-border text-muted-foreground hover:border-primary/30 hover:text-secondary"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              layout
              className="grid md:grid-cols-2 gap-8"
            >
              {filteredPortfolio.map((project: any, i: number) => (
                <AnimatedSection key={project.id} delay={i * 0.07}>
                  <motion.div
                    layout
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="group rounded-2xl overflow-hidden bg-white border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all h-full flex flex-col"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                      {/* Metric badge */}
                      {project.metric && (
                        <div className="absolute top-3 right-3 bg-accent text-secondary text-xs font-bold px-2.5 py-1 rounded-full shadow">
                          {project.metric} {project.metricLabel}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-primary/90 text-white text-xs border-0 hover:bg-primary">
                            {project.category}
                          </Badge>
                          <span className="text-white/70 text-xs">{project.clientName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-7 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                        {project.description}
                      </p>

                      {/* Quote */}
                      {project.quote && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-border/50">
                          <p className="text-xs text-muted-foreground italic leading-relaxed mb-2">"{project.quote}"</p>
                          <p className="text-xs font-bold text-secondary">{project.quoteName}</p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-accent" />
                          <span className="text-sm font-bold text-accent">{project.result}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(project.tags || []).slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-xs font-medium text-secondary/50 bg-muted px-2 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              ))}
            </motion.div>
          )}

          {!isLoading && filteredPortfolio.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found in this category.
            </div>
          )}

        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">From our clients</p>
            <h2 className="text-2xl font-display font-bold text-secondary mt-2">What they say after the project</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {SOCIAL_PROOF.map(({ name, role, quote }) => (
              <AnimatedSection key={name}>
                <div className="bg-gray-50 rounded-2xl border border-border p-6 h-full flex flex-col">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">"{quote}"</p>
                  <div>
                    <p className="text-sm font-bold text-secondary">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Ready to be the next case study?
            </h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              Tell us what you're trying to achieve. We'll tell you what's realistic, what it costs, and how long it takes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold gap-2"
                  onClick={() => GA.ctaClick("portfolio_start_project")}
                >
                  Start your project <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="h-12 px-8 rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white gap-2">
                  See pricing
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
