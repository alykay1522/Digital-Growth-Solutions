import React, { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Code, FileText, Globe, ShoppingBag, Smartphone, Sparkles, Wand2, Workflow, Zap, CheckCircle2, Star, ClipboardList, Cpu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useGetServices, useGetPortfolio } from "@workspace/api-client-react";
import { useMeta } from "@/hooks/useMeta";

function useCountUp(target: number, trigger: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return count;
}

function AnimatedStat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const count = useCountUp(value, triggered);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    // Safety fallback — always show the number within 2.5s even if observer doesn't fire
    const fallback = setTimeout(() => setTriggered(true), 2500);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-display font-bold text-secondary mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "CEO, Lumina Finance", quote: "Digital Growth Solutions Agency cut our load time from 6s to under 1.5s. Conversion rate jumped 23% within 30 days." },
  { name: "Marcus Webb", role: "Marketing Director, Aura Commerce", quote: "Best investment we made this year. WooCommerce rebuild, cart abandonment dropped 40%." },
  { name: "Priya Sharma", role: "Founder, CoralSkin", quote: "We went from invisible on Google to ranking page one for our key terms in three months." },
  { name: "James Okafor", role: "CTO, FlowDesk", quote: "Their WordPress plugin work saved us from building a $50k custom solution. Built exactly right." },
  { name: "Rachel Torres", role: "Operations, BrightCycle", quote: "The mobile redesign was transformative. Mobile sessions up 65%, bounce rate down 38%." },
  { name: "Daniel Kim", role: "VP Growth, TechLayer", quote: "Three agencies failed before Digital Growth Solutions Agency. They shipped our custom app in 10 weeks, on budget." },
];

export default function Home() {
  useMeta({
    title: "WordPress, Shopify & AI Automation Experts",
    description: "Digital Growth Solutions Agency builds high-converting websites, eCommerce stores, and AI automation systems. Fast delivery, transparent pricing, and results you can measure."
  });

  const { data: servicesData } = useGetServices();
  const { data: portfolioData } = useGetPortfolio();

  // Fallbacks in case backend is unseeded
  const services = servicesData?.length ? servicesData : [
    { id: "1", title: "WordPress Development", description: "High-performing, custom-built, SEO-optimized WordPress websites that rank and convert — delivered in weeks, not months.", icon: "Globe" },
    { id: "2", title: "Shopify & WooCommerce", description: "Beautifully designed eCommerce stores on Shopify or WooCommerce, built to maximize conversions and average order value.", icon: "ShoppingBag" },
    { id: "3", title: "AI Automation", description: "AI-powered workflows that handle enquiries, follow-ups, and repetitive tasks — so your business runs 24/7 without extra headcount.", icon: "Bot" },
  ];

  const portfolio = portfolioData?.length ? portfolioData.slice(0, 2) : [
    { id: "1", title: "Lumina Fintech", category: "WordPress / Custom Theme", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { id: "2", title: "Aura Commerce", category: "Shopify / Headless", imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80" },
  ];

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">AI-Powered Digital Agency</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 backdrop-blur-md border border-accent/40">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-accent text-sm font-semibold">Currently accepting 3 new clients this month</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6">
                Most websites look great.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Ours actually sell.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-3 max-w-2xl">
                WordPress sites, Shopify stores, custom software, and AI automation — all built and delivered for you. You focus on running your business. We handle the rest.
              </p>

              <p className="text-sm text-primary/90 font-semibold mb-5 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                Built for service businesses, online retailers, and B2B brands ready to grow online
              </p>

              <p className="text-sm text-white/50 mb-10 flex items-center gap-2">
                <span className="inline-block w-4 h-0.5 bg-accent rounded" />
                No long-term contracts · Fixed pricing · Satisfaction guaranteed
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/audit">
                  <Button className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                    Audit My Site Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                    See Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - animated counters */}
      <section className="py-12 bg-white relative mx-4 sm:mx-6 lg:mx-auto max-w-6xl rounded-2xl shadow-xl border border-border/50 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <AnimatedStat value={300} suffix="+" label="Projects Delivered" />
          <AnimatedStat value={10} suffix="+" label="Years Experience" />
          <AnimatedStat value={150} suffix="+" label="Happy Clients" />
          <AnimatedStat value={25} suffix="+" label="Team Members" />
        </div>
      </section>

      {/* TECH PARTNER LOGOS */}
      <section className="py-10 bg-white border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-7">
            Platforms & technologies we specialise in
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
            {[
              { label: "WordPress", color: "#21759B" },
              { label: "Shopify", color: "#96BF48" },
              { label: "WooCommerce", color: "#7F54B3" },
              { label: "Cloudflare", color: "#F38020" },
              { label: "Stripe", color: "#635BFF" },
              { label: "PayPal", color: "#003087" },
              { label: "Google", color: "#4285F4" },
              { label: "Meta Ads", color: "#0081FB" },
            ].map(({ label, color }) => (
              <span
                key={label}
                className="text-base font-bold tracking-tight opacity-40 hover:opacity-80 transition-opacity"
                style={{ color }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Simple 3-step process
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">
              From idea to live in weeks — not months
            </h2>
            <p className="text-muted-foreground text-lg">
              Here's exactly what happens after you reach out — no guesswork, no waiting.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary/30 via-accent/50 to-primary/30" />

            {[
              {
                step: "01",
                icon: ClipboardList,
                title: "Tell us what you need",
                description: "Fill in the contact form or pay for a package online. Describe your project, goals, and timeline — no jargon required.",
                color: "bg-primary/10 text-primary",
                accent: "border-primary/20",
              },
              {
                step: "02",
                icon: Cpu,
                title: "AI + our team builds it",
                description: "Our AI-powered pipeline gets to work immediately — planning, designing, and building your project with expert oversight at every step.",
                color: "bg-accent/10 text-accent",
                accent: "border-accent/20",
              },
              {
                step: "03",
                icon: Rocket,
                title: "Review, launch & grow",
                description: "You review the finished work, request any tweaks, then we deploy. Your site goes live fully optimised and ready to convert visitors.",
                color: "bg-green-100 text-green-600",
                accent: "border-green-200",
              },
            ].map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative bg-white rounded-2xl border-2 ${item.accent} p-8 shadow-sm hover:shadow-xl transition-all duration-300`}
                >
                  <div className="absolute -top-4 left-8">
                    <span className="bg-white border border-border text-xs font-bold text-muted-foreground px-3 py-1 rounded-full shadow-sm">
                      Step {item.step}
                    </span>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 mt-2`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact">
              <Button className="h-12 px-8 rounded-xl">
                Start your project today <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* LEAD MAGNET — Free Audit */}
      <section className="py-16 bg-gradient-to-r from-primary to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-semibold mb-5">
              <Zap className="w-4 h-4" />
              Free — No Credit Card Required
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Get your free website audit in 24 hours
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Enter your URL and we'll run an instant AI-powered check — plus a human expert will follow up with a detailed report within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                className="flex-1 h-13 px-5 py-3.5 rounded-xl bg-white/15 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm text-base"
                id="lead-url-input"
              />
              <Link href="/audit">
                <Button
                  className="h-13 px-7 py-3.5 rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-xl shadow-black/10 shrink-0 w-full sm:w-auto"
                  onClick={() => {
                    const input = document.getElementById("lead-url-input") as HTMLInputElement;
                    if (input?.value) {
                      sessionStorage.setItem("auditUrl", input.value);
                    }
                  }}
                >
                  Audit My Site Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <p className="text-white/50 text-xs mt-4">
              Used by 2,000+ businesses · Instant AI results · Human follow-up within 24 hrs
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Pick your weapon.</h2>
            <p className="text-muted-foreground text-lg">From a brand-new website to a complete AI-powered business system — we've built it before and we'll build it for you.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {i === 0 ? <Globe className="w-7 h-7 text-primary" /> :
                     i === 1 ? <ShoppingBag className="w-7 h-7 text-primary" /> :
                     <Bot className="w-7 h-7 text-primary" />}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
                  <Link href="/services" className="inline-flex items-center text-primary font-medium hover:text-secondary transition-colors group/link">
                    Learn more <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services">
              <Button variant="outline" className="rounded-full px-8">View All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="right">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">
                Your competitors have a website.<br />
                <span className="text-primary">You'll have a sales machine.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We don't just build sites — we build systems that attract visitors, convert them into leads, and automate the follow-up. AI does the heavy lifting so you don't have to.
              </p>
              <ul className="space-y-4">
                {[
                  "Pages that load in under 2 seconds — critical for SEO ranking",
                  "Mobile-first design that converts on every screen size",
                  "AI automation that handles enquiries even while you sleep",
                  "Ongoing support — we're still here after launch"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                    <span className="font-medium text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection direction="left" className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[2rem] blur-3xl" />
              {/* startup office workspace professional */}
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80" 
                alt="Digital agency team collaborating on a project"
                loading="lazy"
                decoding="async"
                className="relative z-10 rounded-[2rem] shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl z-20 border border-border">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span className="font-bold text-xl">5.0</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Based on 100+ reviews</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* AI SERVICES TEASER */}
      <section className="py-24 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-5">
              <BrainCircuit className="w-4 h-4 text-accent" />
              New AI Services — 2026
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              AI built into your business,<br className="hidden sm:block" /> not bolted on
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              From automated content pipelines to intelligent chatbots and AI-powered redesigns — we integrate practical AI that actually moves the needle.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {[
              { icon: FileText, label: "AI Content Automation" },
              { icon: Bot, label: "AI Chatbot Installation" },
              { icon: Sparkles, label: "Product Description Gen" },
              { icon: Workflow, label: "AI Workflow Automation" },
              { icon: Wand2, label: "AI-Powered Redesigns" },
            ].map(({ icon: Icon, label }, i) => (
              <AnimatedSection key={label} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-white leading-tight">{label}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services#ai">
              <Button className="h-12 px-8 rounded-xl bg-accent hover:bg-accent/90 text-secondary font-bold shadow-lg shadow-accent/20">
                Explore AI Services <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS GRID */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What our clients say</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary">Real results from real businesses</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.08}>
                <div className="bg-white rounded-2xl border border-border p-7 shadow-sm hover:shadow-md hover:border-primary/20 transition-all h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary leading-none">{t.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEE SECTION */}
      <section className="py-16 bg-white border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[
                { icon: "🔒", title: "Fixed Pricing", body: "You see the price before we start. No hourly surprises, no scope creep charges." },
                { icon: "⚡", title: "7-Day Satisfaction Guarantee", body: "Not happy after the first week? You don't pay. Simple as that." },
                { icon: "🤖", title: "AI-Powered Delivery", body: "AI tools mean faster builds, fewer errors, and more value for the same price." },
              ].map((g) => (
                <div key={g.title} className="flex flex-col items-center">
                  <span className="text-4xl mb-4">{g.icon}</span>
                  <h3 className="font-display font-bold text-secondary text-lg mb-2">{g.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{g.body}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-navy-mesh relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-4">Ready when you are</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Ready to get more clients<br className="hidden sm:block" /> from your website?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Tell us about your project. We'll respond within 24 hours with a clear plan and a fixed price — no surprises, no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="h-14 px-10 text-lg rounded-xl bg-accent hover:bg-accent/90 text-secondary font-bold shadow-xl shadow-accent/25 hover:-translate-y-1 transition-all">
                  Get My Quote in 24 Hours
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/pay">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                  Pay for a Package
                </Button>
              </Link>
            </div>
            <p className="text-white/40 text-sm mt-6">7-day satisfaction guarantee · Fixed pricing · No long-term contracts</p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

