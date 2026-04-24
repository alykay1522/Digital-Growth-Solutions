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
  FileText,
  HeartHandshake,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";

const AGENTS = [
  {
    id: "audit",
    title: "AI Website Audit Agent",
    description: "Drop in any URL and get a full audit: SEO, performance, security, accessibility, and a prioritised fix list.",
    icon: Search,
    color: "bg-blue-100 text-blue-600",
    href: "/agents/audit",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~30 sec",
  },
  {
    id: "quote",
    title: "AI Quote Generator",
    description: "Tell us what you need and get a detailed project quote with package recommendation and timeline.",
    icon: FileText,
    color: "bg-violet-100 text-violet-600",
    href: "/agents/quote",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~15 sec",
  },
  {
    id: "support",
    title: "AI Support Agent",
    description: "Have a question about our services, pricing, or process? Chat with our AI support agent 24/7.",
    icon: MessageSquare,
    color: "bg-primary/10 text-primary",
    href: "/agents/support",
    badge: "Live chat",
    badgeColor: "bg-primary/10 text-primary",
    eta: "Instant",
  },
  {
    id: "intake",
    title: "AI Intake & Onboarding",
    description: "Ready to start a project? Fill in the onboarding form and get a full project brief in seconds.",
    icon: HeartHandshake,
    color: "bg-emerald-100 text-emerald-600",
    href: "/agents/intake",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~20 sec",
  },
  {
    id: "seo",
    title: "AI SEO Agent",
    description: "Get a full SEO strategy: target keywords, on-page fixes, content ideas, and a 30-day action plan.",
    icon: BrainCircuit,
    color: "bg-orange-100 text-orange-600",
    href: "/agents/seo",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~30 sec",
  },
  {
    id: "content",
    title: "AI Content Generator",
    description: "Generate homepage copy, about pages, service descriptions, meta tags — ready to paste straight in.",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-600",
    href: "/agents/content",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~20 sec",
  },
  {
    id: "care-plan",
    title: "AI Care Plan Agent",
    description: "Find out which maintenance plan is right for your site. Get a risk assessment and ROI breakdown.",
    icon: Shield,
    color: "bg-teal-100 text-teal-600",
    href: "/agents/care-plan",
    badge: "Free",
    badgeColor: "bg-green-100 text-green-700",
    eta: "~15 sec",
  },
  {
    id: "rescue",
    title: "AI Website Rescue Agent",
    description: "Site broken? Describe the problem and get an instant diagnosis, DIY steps, and a professional fix quote.",
    icon: Wrench,
    color: "bg-red-100 text-red-600",
    href: "/agents/rescue",
    badge: "Emergency",
    badgeColor: "bg-red-100 text-red-600",
    eta: "~15 sec",
  },
];

export default function AgentsHub() {
  useMeta({
    title: "AI Agents — Digital Growth Solutions Agency",
    description: "8 AI-powered agents that audit, quote, support, onboard, optimise, and rescue your website — all free, all instant.",
  });

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-28 pb-16 bg-secondary overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Bot className="w-4 h-4 text-accent" />
              <span className="text-white/80 text-sm font-medium">Powered by GPT-5</span>
              <span className="w-1 h-1 rounded-full bg-white/30 mx-1" />
              <span className="text-accent text-sm font-semibold">8 Agents Available</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight mb-5">
              Your AI-Powered<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Agency Crew
              </span>
            </h1>
            <p className="text-lg text-white/65 max-w-2xl mx-auto leading-relaxed">
              Eight specialist AI agents that audit your site, generate quotes, write content, fix emergencies, and guide you through every step — all free, all instant.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Agents grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AGENTS.map((agent, i) => (
              <AnimatedSection key={agent.id} delay={i * 0.07}>
                <Link href={agent.href}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-2xl border border-border p-6 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 h-full flex flex-col cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center`}>
                        <agent.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${agent.badgeColor}`}>
                        {agent.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-secondary text-base mb-2 leading-tight">{agent.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{agent.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {agent.eta}
                      </span>
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                        Use agent <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary">How the agents work</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { step: "01", icon: "📋", title: "Fill in the form", body: "Each agent has a simple form. No signup, no credit card — just answer a few questions." },
              { step: "02", icon: "🤖", title: "AI gets to work", body: "Our AI analyses your input and generates a detailed, personalised response in seconds." },
              { step: "03", icon: "🚀", title: "Take action", body: "Copy the output, implement it yourself, or let us do it for you at a fixed price." },
            ].map((s) => (
              <AnimatedSection key={s.step}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold mb-3">{s.step}</div>
                  <span className="text-3xl mb-3">{s.icon}</span>
                  <h3 className="font-bold text-secondary mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.body}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Want us to do it all for you?
            </h2>
            <p className="text-white/65 text-lg mb-8">
              The agents give you the intelligence. We do the implementation — fast, at a fixed price.
            </p>
            <Link href="/contact">
              <Button className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-secondary font-bold">
                Book a Free Strategy Call <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
