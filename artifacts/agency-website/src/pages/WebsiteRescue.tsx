import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  Globe,
  MessageSquare,
  Phone,
  Shield,
  ShoppingCart,
  Smartphone,
  Star,
  Wrench,
  Zap,
} from "lucide-react";

const RESCUE_SERVICES = [
  {
    icon: Zap,
    label: "Site Down / White Screen",
    description:
      "White screen of death, 500 error, or completely blank page. We diagnose and restore your site within 24 hours — guaranteed.",
    price: "$97–$297",
    turnaround: "24 hrs",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    urgency: "Most common emergency",
  },
  {
    icon: ShoppingCart,
    label: "Broken Checkout / Payments",
    description:
      "Checkout not working, payment gateway errors, or cart issues. Every hour this is broken is lost revenue — we fix it fast.",
    price: "$147–$397",
    turnaround: "24 hrs",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    urgency: "High revenue impact",
  },
  {
    icon: Shield,
    label: "Hacked Site / Malware",
    description:
      "Hack cleanup, malware removal, blacklist removal from Google, and firewall hardening so it never happens again.",
    price: "$197–$497",
    turnaround: "48 hrs",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    urgency: "Critical — act immediately",
  },
  {
    icon: Wrench,
    label: "Plugin / Theme Conflict",
    description:
      "Broken after an update? Plugin conflict, theme crash, or a failed migration — isolated and fixed without data loss.",
    price: "$97–$247",
    turnaround: "24 hrs",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    urgency: "Very common",
  },
  {
    icon: Globe,
    label: "Slow Site Speed",
    description:
      "Slow load times destroy SEO rankings and conversions. We compress, cache, and optimise your site for speed.",
    price: "$197–$497",
    turnaround: "48 hrs",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    urgency: "Affects every visitor",
  },
  {
    icon: Code,
    label: "Broken Feature Fix",
    description:
      "Form not sending, gallery broken, map not loading, contact button not working. Scoped fix, flat rate, done.",
    price: "$97–$297",
    turnaround: "24 hrs",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    urgency: "Quick win",
  },
  {
    icon: Smartphone,
    label: "Mobile Layout Issues",
    description:
      "Site looks broken on phones or tablets? We'll fix the responsive design so it works perfectly on every screen size.",
    price: "$147–$347",
    turnaround: "48 hrs",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    urgency: "70% of visitors use mobile",
  },
  {
    icon: Wrench,
    label: "Outdated Theme / Design",
    description:
      "Old theme, outdated design, or just looks unprofessional? We modernise your site without touching your content.",
    price: "$297–$797",
    turnaround: "3–5 days",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    urgency: "Affects trust & conversions",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Contact us right now",
    description:
      "Fill in the form below or email us directly. Describe what's wrong — the more detail the better. We'll confirm receipt within 2 hours.",
    icon: MessageSquare,
    color: "bg-red-100 text-red-600",
  },
  {
    step: "02",
    title: "We diagnose & get to work",
    description:
      "A senior developer is assigned immediately. We diagnose the root cause, fix it properly, and test thoroughly before touching your live site.",
    icon: Wrench,
    color: "bg-blue-100 text-blue-600",
  },
  {
    step: "03",
    title: "All clear — you're back online",
    description:
      "We send you a full report of what was wrong and what we did. Your site is live, tested, and running smoothly.",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Owner, Bella Boutique",
    quote:
      "My Shopify checkout broke on a Friday afternoon. Digital Growth Solutions Agency had it fixed within 3 hours. I would have lost thousands that weekend.",
  },
  {
    name: "Tom Hargreaves",
    role: "Director, Hargreaves Plumbing",
    quote:
      "Site was hacked and showing spam content. They cleaned it up, secured it, and removed us from Google's blacklist in under 48 hours. Absolute lifesavers.",
  },
  {
    name: "Laura Patel",
    role: "Founder, Green Leaf Café",
    quote:
      "WordPress update broke everything. White screen, no access. They restored it from backup and fixed the plugin conflict the same day. Amazing service.",
  },
];

export default function WebsiteRescue() {
  useMeta({
    title: "Website Rescue — Emergency Fixes for Broken Sites",
    description:
      "Site down, hacked, or broken? We fix WordPress, Shopify & WooCommerce emergencies fast. 24–48hr turnaround. Fixed prices from $97.",
  });

  return (
    <div className="w-full">
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-center pt-24 pb-16 overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-secondary to-secondary" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-300 text-sm font-semibold">Emergency Service Available 24/7</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-white/80 text-sm font-medium">Average fix time: under 24 hours</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold text-white leading-[1.05] tracking-tight mb-6">
              Site down? Hacked?<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-accent">
                We Fix It Fast.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-4 max-w-2xl">
              Emergency website repairs for WordPress, Shopify & WooCommerce. Fixed prices, fast turnaround, and a guarantee that the problem stays fixed.
            </p>

            <p className="text-sm text-white/50 mb-10 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-accent rounded" />
              Flat-rate pricing · No hidden charges · Satisfaction guaranteed
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button className="h-14 px-8 text-lg rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/25 hover:-translate-y-1 transition-all">
                  <Phone className="mr-2 w-5 h-5" />
                  Get Emergency Help Now
                </Button>
              </Link>
              <Link href="/pricing#rescue">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 backdrop-blur-sm transition-all"
                >
                  See All Prices
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GUARANTEE BADGE ── */}
      <section className="py-6 bg-red-50 border-y border-red-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
            {[
              { icon: "🛡️", text: "Satisfaction Guarantee — we don't close the ticket until you're happy" },
              { icon: "⚡", text: "24–48 hour turnaround on most issues" },
              { icon: "💰", text: "Fixed pricing — you know the cost before we start" },
            ].map((item) => (
              <div key={item.icon} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <p className="text-sm font-semibold text-red-900">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESCUE SERVICES GRID ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold mb-4">
              <AlertTriangle className="w-4 h-4" />
              What we fix
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">
              Common emergencies we resolve daily
            </h2>
            <p className="text-muted-foreground text-lg">
              Every fix comes with a clear scope, a flat price, and a written summary of what was done.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESCUE_SERVICES.map((service, i) => (
              <AnimatedSection key={service.label} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative bg-white rounded-2xl border-2 ${service.border} p-6 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col`}
                >
                  <div className={`w-12 h-12 rounded-xl ${service.bg} flex items-center justify-center mb-4`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>

                  <div className="mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${service.bg} ${service.color}`}>
                      {service.urgency}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-secondary mt-2 mb-2">{service.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{service.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-sm font-bold text-secondary">{service.price}</p>
                      <p className="text-xs text-muted-foreground">flat rate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{service.turnaround}</p>
                      <p className="text-xs text-muted-foreground">turnaround</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Not sure which fix you need? Just describe the problem and we'll scope it for you.</p>
            <Link href="/contact">
              <Button className="h-12 px-8 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg">
                Describe My Problem <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">
              How the rescue process works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps from "site broken" to "all clear."
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-red-200 via-red-400 to-green-300" />
            {STEPS.map((step, i) => (
              <AnimatedSection key={step.step} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="relative bg-white rounded-2xl border border-border p-8 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="absolute -top-4 left-8">
                    <span className="bg-white border border-border text-xs font-bold text-muted-foreground px-3 py-1 rounded-full shadow-sm">
                      Step {step.step}
                    </span>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center mb-6 mt-2`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-secondary mb-3">
              Businesses we've rescued
            </h2>
            <p className="text-muted-foreground">Real owners, real emergencies, real results.</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div className="bg-gray-50 rounded-2xl border border-border p-7 h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-sm font-bold text-red-600 shrink-0">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-secondary">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-red-300 text-sm font-semibold">Every minute your site is broken costs you money</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Let's get you<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-accent">back online now.</span>
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Describe what's wrong in the contact form. We'll respond within 2 hours with a diagnosis and a fixed price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/contact">
                <Button className="h-14 px-10 text-lg rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-xl hover:-translate-y-1 transition-all">
                  <Phone className="mr-2 w-5 h-5" />
                  Contact Us Now
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-xl border-white/20 text-white hover:bg-white/10 transition-all"
                >
                  View Full Pricing
                </Button>
              </Link>
            </div>
            <p className="text-white/40 text-sm">
              🛡️ Satisfaction guarantee · Fixed pricing · We don't close the ticket until you're happy
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
