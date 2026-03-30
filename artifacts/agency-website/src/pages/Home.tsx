import React, { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Bot, BrainCircuit, Code, FileText, Smartphone, Sparkles, Wand2, Workflow, Zap, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { useGetServices, useGetPortfolio } from "@workspace/api-client-react";

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
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
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
  { name: "Sarah Chen", role: "CEO, Lumina Finance", quote: "NexaAgency cut our load time from 6s to under 1.5s. Conversion rate jumped 23% within 30 days." },
  { name: "Marcus Webb", role: "Marketing Director, Aura Commerce", quote: "Best investment we made this year. WooCommerce rebuild, cart abandonment dropped 40%." },
  { name: "Priya Sharma", role: "Founder, CoralSkin", quote: "We went from invisible on Google to ranking page one for our key terms in three months." },
  { name: "James Okafor", role: "CTO, FlowDesk", quote: "Their WordPress plugin work saved us from building a $50k custom solution. Built exactly right." },
  { name: "Rachel Torres", role: "Operations, BrightCycle", quote: "The mobile redesign was transformative. Mobile sessions up 65%, bounce rate down 38%." },
  { name: "Daniel Kim", role: "VP Growth, TechLayer", quote: "Three agencies failed before Nexa. They shipped our custom app in 10 weeks, on budget." },
];

export default function Home() {
  const { data: servicesData } = useGetServices();
  const { data: portfolioData } = useGetPortfolio();

  // Fallbacks in case backend is unseeded
  const services = servicesData?.length ? servicesData : [
    { id: "1", title: "WordPress Development", description: "High-performing, fully customized, SEO-optimized, lightning-fast WordPress websites.", icon: "Globe" },
    { id: "2", title: "Custom Plugins", description: "Tailor-made plugins and third-party integrations for a cohesive tech ecosystem.", icon: "Box" },
    { id: "3", title: "eCommerce Solutions", description: "Scalable Shopify and WooCommerce platforms designed to convert visitors.", icon: "ShoppingCart" },
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
            alt="Abstract tech background" 
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Award-winning Digital Agency</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-6">
                We build <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">digital experiences</span> that deliver results.
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                From high-performing WordPress and Shopify sites to custom mobile apps. We blend innovation with practicality to help you work smarter, reach wider, and grow faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm transition-all">
                    View Our Work
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION - animated counters */}
      <section className="py-12 bg-white relative -mt-10 mx-4 sm:mx-6 lg:mx-auto max-w-6xl rounded-2xl shadow-xl border border-border/50 z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <AnimatedStat value={300} suffix="+" label="Projects Delivered" />
          <AnimatedStat value={10} suffix="+" label="Years Experience" />
          <AnimatedStat value={150} suffix="+" label="Happy Clients" />
          <AnimatedStat value={25} suffix="+" label="Team Members" />
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to succeed online</h2>
            <p className="text-muted-foreground text-lg">Technology should make life easier. We provide end-to-end solutions tailored to your business needs.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-2xl shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl hover:border-primary/30 transition-all duration-300 group h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {i === 0 ? <Globe className="w-7 h-7 text-primary" /> : 
                     i === 1 ? <Code className="w-7 h-7 text-primary" /> : 
                     <Smartphone className="w-7 h-7 text-primary" />}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Listen first, plan smart, build right.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're a startup finding your first customers or an established brand ready to scale, we work alongside you to ensure your digital presence not only looks amazing but works hard for your business.
              </p>
              <ul className="space-y-4">
                {[
                  "Lightning-fast & SEO-optimized code",
                  "Mobile-first responsive design across all devices",
                  "Secure and scalable architectures",
                  "Dedicated ongoing support & maintenance"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
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
                alt="Our team working" 
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

      {/* TESTIMONIALS STRIP */}
      <section className="py-16 bg-gray-50 overflow-hidden">
        <style>{`
          @keyframes marquee-slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track { animation: marquee-slide 40s linear infinite; }
          .marquee-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">What our clients say</p>
            <h2 className="text-3xl font-display font-bold text-secondary">Real results from real businesses</h2>
          </AnimatedSection>
        </div>
        <div className="relative">
          <div className="flex gap-5 marquee-track w-max">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="w-72 flex-shrink-0 bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary leading-none">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-navy-mesh relative">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Ready to transform your digital presence?</h2>
            <p className="text-xl text-white/80 mb-10">Let's discuss how we can help your business work smarter, reach wider, and grow faster.</p>
            <Link href="/contact">
              <Button className="h-14 px-10 text-lg rounded-xl bg-accent hover:bg-accent/90 text-secondary font-bold shadow-xl shadow-accent/25 hover:-translate-y-1 transition-all">
                Get a Free Consultation
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}

// Temporary icon components since lucide dynamic import can be tricky in some envs
function Globe(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
}
