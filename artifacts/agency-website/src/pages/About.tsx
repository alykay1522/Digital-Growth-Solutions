import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { GA } from "@/utils/analytics";
import {
  ArrowRight, CheckCircle2, Clock, Code2, HeartHandshake,
  Lightbulb, Quote, Star, Target, Users, Zap,
} from "lucide-react";

const TIMELINE = [
  { year: "2014", title: "Started freelancing", desc: "Built our first WordPress sites for local businesses, learning that great design alone doesn't pay the bills — results do." },
  { year: "2017", title: "Went full-time agency", desc: "After consistently delivering measurable growth for clients, we formalised the agency and began hiring specialists in SEO, eCommerce, and performance." },
  { year: "2020", title: "Added Shopify & custom software", desc: "Expanding beyond WordPress to serve DTC brands and scaling eCommerce businesses who needed more than off-the-shelf solutions." },
  { year: "2023", title: "Launched AI automation services", desc: "Early adopters of GPT-powered workflow automation. We now build AI systems that save clients 5–15 hours per week on repetitive tasks." },
  { year: "2026", title: "300+ projects delivered", desc: "A fully remote team serving clients worldwide — with the same principles we started with: transparency, results, and no-nonsense communication." },
];

const DIFFERENTIATORS = [
  { icon: Clock, title: "Fixed pricing. Fixed timelines.", desc: "Every project comes with a clear scope, fixed price, and agreed delivery date. No hourly billing, no scope creep, no nasty surprises." },
  { icon: Zap, title: "AI-assisted, human-supervised", desc: "We use AI to move faster and charge less — but every line of code and every design decision is reviewed by an expert. You get the best of both." },
  { icon: CheckCircle2, title: "We measure what matters", desc: "Not just 'we launched your site.' We track conversion rates, load times, rankings, and revenue — and we report on them." },
  { icon: HeartHandshake, title: "Still here after launch", desc: "Most agencies disappear after delivery. We offer ongoing care plans and stay on hand for questions, fixes, and growth projects." },
];

const PROCESS_STEPS = [
  { step: "01", title: "Discovery call (free)", desc: "We learn about your business, goals, and current challenges. No pitch, just listening." },
  { step: "02", title: "Fixed-price proposal", desc: "You receive a detailed scope, timeline, and fixed price within 24 hours. Nothing ambiguous." },
  { step: "03", title: "Build & review", desc: "We build in sprints with regular check-ins. You review progress and give feedback at every stage." },
  { step: "04", title: "Launch & support", desc: "We deploy your project and provide 30–90 days of post-launch support depending on the package." },
];

export default function About() {
  useMeta({
    title: "About the Agency",
    description: "Digital Growth Solutions Agency is a remote-first digital agency building WordPress sites, Shopify stores, and AI automation systems for businesses worldwide. 300+ projects delivered since 2014.",
    path: "/about",
  });

  return (
    <main className="w-full">

      {/* HERO */}
      <section className="pt-32 pb-20 bg-secondary overflow-hidden relative">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6">
                <Users className="w-4 h-4" />
                About the agency
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-6">
                We build websites that work as hard as you do
              </h1>
              <p className="text-xl text-white/70 leading-relaxed mb-8">
                We're a fully remote digital agency specialising in WordPress, Shopify, and AI automation — built for businesses that care about results, not just aesthetics.
              </p>
              <div className="grid grid-cols-3 gap-5">
                {[
                  { value: "300+", label: "Projects delivered" },
                  { value: "10+", label: "Years experience" },
                  { value: "150+", label: "Happy clients" },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-display font-bold text-primary">{value}</p>
                    <p className="text-white/50 text-sm mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection direction="left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/10 rounded-3xl blur-2xl" />
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=80"
                  alt="Agency team working remotely"
                  loading="lazy"
                  decoding="async"
                  className="relative rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl shadow-xl px-5 py-4 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-secondary">5.0 average rating</p>
                  <p className="text-xs text-muted-foreground">across 150+ client projects</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">Why we started</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <AnimatedSection direction="right">
              <div className="relative">
                <Quote className="w-10 h-10 text-primary/20 absolute -top-2 -left-2" />
                <p className="text-lg text-muted-foreground leading-relaxed mb-5 pl-6">
                  We got tired of seeing businesses pay five-figure invoices to agencies that delivered slow, generic websites and disappeared after handover. The business owner was left with a site they couldn't update, couldn't rank, and couldn't explain to their accountant.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed pl-6">
                  We started this agency with one rule: <strong className="text-secondary">every project must measurably improve our client's business</strong> — not just look good in a portfolio. That rule hasn't changed.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection direction="left">
              <div className="space-y-5">
                {TIMELINE.map(({ year, title, desc }) => (
                  <div key={year} className="flex gap-4">
                    <div className="shrink-0 w-14 text-right">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{year}</span>
                    </div>
                    <div className="border-l-2 border-primary/20 pl-5 pb-5">
                      <p className="font-bold text-secondary mb-1">{title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* WHAT MAKES US DIFFERENT */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">What makes us different</h2>
            <p className="text-muted-foreground text-lg">We've built our agency around the frustrations our clients had with other agencies.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {DIFFERENTIATORS.map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border p-7 h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-secondary mb-2">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl font-display font-bold text-secondary mb-3">How we work</h2>
            <p className="text-muted-foreground text-lg">Simple, transparent, and predictable — every time.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {PROCESS_STEPS.map(({ step, title, desc }, i) => (
              <AnimatedSection key={step} delay={i * 0.1}>
                <div className="flex gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-primary text-sm">{step}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary mb-1">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 bg-secondary text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-3">Our values</h2>
            <p className="text-white/60 text-lg">The principles we hold ourselves to — even when it costs us.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: HeartHandshake, title: "Client first", desc: "Your outcome matters more than our convenience. If something isn't working, we say so early." },
              { icon: Code2, title: "Clean craft", desc: "We write maintainable, documented code. You should be able to hand it to any developer after us." },
              { icon: Lightbulb, title: "Honest advice", desc: "We'll tell you if you don't need what you're asking for. Long-term trust beats a quick invoice." },
              { icon: Target, title: "Results over vanity", desc: "A beautiful site that doesn't convert is a failure. We optimize for business outcomes." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <AnimatedSection key={title} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-full">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL STRIP */}
      <section className="py-16 bg-gray-50 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">What clients say</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Digital Growth Solutions Agency cut our load time from 6s to under 1.5s. Conversion rate jumped 23% within 30 days.", name: "Sarah Chen", role: "CEO, Lumina Finance" },
              { quote: "Three agencies failed before them. They shipped our custom app in 10 weeks, on budget, and stayed in touch throughout.", name: "Daniel Kim", role: "VP Growth, TechLayer" },
              { quote: "The mobile redesign was transformative. Mobile sessions up 65%, bounce rate down 38%. ROI in the first month.", name: "Rachel Torres", role: "Operations, BrightCycle" },
            ].map(({ quote, name, role }) => (
              <AnimatedSection key={name}>
                <div className="bg-white rounded-2xl border border-border p-6 h-full">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4 text-sm">"{quote}"</p>
                  <div>
                    <p className="font-bold text-secondary text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-display font-bold text-secondary mb-4">
              Ready to work with an agency that delivers?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tell us about your project. We'll respond within 24 hours with honest advice and a clear plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  className="h-12 px-8 rounded-xl gap-2"
                  onClick={() => GA.ctaClick("about_get_in_touch")}
                >
                  Get in touch <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outline" className="h-12 px-8 rounded-xl gap-2">
                  View our work
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

    </main>
  );
}
