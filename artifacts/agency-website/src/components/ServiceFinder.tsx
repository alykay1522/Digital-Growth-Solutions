import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, X, Check, Globe, ShoppingCart, Bot, Wrench, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: string;
  text: string;
  options: { label: string; value: string; icon?: React.ReactNode }[];
}

const QUESTIONS: Question[] = [
  {
    id: "type",
    text: "What kind of business do you run?",
    options: [
      { label: "Local service (plumber, salon, café, etc.)", value: "local", icon: <Globe className="w-5 h-5" /> },
      { label: "Online shop / eCommerce", value: "ecommerce", icon: <ShoppingCart className="w-5 h-5" /> },
      { label: "B2B / professional services", value: "b2b", icon: <Zap className="w-5 h-5" /> },
      { label: "Tech / SaaS / startup", value: "tech", icon: <Bot className="w-5 h-5" /> },
    ],
  },
  {
    id: "situation",
    text: "What best describes your situation right now?",
    options: [
      { label: "I don't have a website yet", value: "none" },
      { label: "I have a site but it's outdated or slow", value: "old" },
      { label: "My site is broken or been hacked", value: "broken", icon: <Wrench className="w-5 h-5" /> },
      { label: "I want to add a shop or take payments online", value: "ecom" },
      { label: "I want to automate tasks or add AI", value: "ai", icon: <Bot className="w-5 h-5" /> },
    ],
  },
  {
    id: "budget",
    text: "What's your rough budget for this project?",
    options: [
      { label: "Under $500", value: "micro" },
      { label: "$500 – $1,500", value: "starter" },
      { label: "$1,500 – $4,000", value: "growth" },
      { label: "$4,000+", value: "pro" },
    ],
  },
];

interface Recommendation {
  name: string;
  price: string;
  tagline: string;
  href: string;
  color: string;
  bg: string;
  ctaText: string;
}

function getRecommendation(answers: Record<string, string>): Recommendation {
  const { type, situation, budget } = answers;

  if (situation === "broken") {
    return {
      name: "Website Rescue",
      price: "From $97",
      tagline: "Get your site diagnosed and fixed within 24–48 hours.",
      href: "/pricing#rescue",
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
      ctaText: "See Rescue Pricing",
    };
  }

  if (situation === "ai") {
    return {
      name: "AI Automation Package",
      price: "From $997",
      tagline: "AI chatbots, workflow automation, and content pipelines built for your business.",
      href: "/pricing#ai",
      color: "text-violet-600",
      bg: "bg-violet-50 border-violet-200",
      ctaText: "View AI Packages",
    };
  }

  if (budget === "micro" || type === "local") {
    return {
      name: "Local Package",
      price: "$499",
      tagline: "A clean, mobile-friendly 3-page website with Google Business setup. Live in 1–2 weeks.",
      href: "/pricing",
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
      ctaText: "Get Started for $499",
    };
  }

  if (budget === "starter" || situation === "none" || situation === "old") {
    return {
      name: "Starter Package",
      price: "$997",
      tagline: "Up to 8 pages, custom design, SEO setup, and 30-day support. Delivered in 2–3 weeks.",
      href: "/pricing",
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
      ctaText: "See the Starter Package",
    };
  }

  if (budget === "growth" || situation === "ecom" || type === "ecommerce") {
    return {
      name: "Growth Package",
      price: "$2,499",
      tagline: "WordPress or Shopify store, custom design, payment gateway, and 60-day support.",
      href: "/pricing",
      color: "text-primary",
      bg: "bg-primary/5 border-primary/20",
      ctaText: "View Growth Package",
    };
  }

  return {
    name: "Pro Build",
    price: "From $5,999",
    tagline: "Fully custom web app or eCommerce platform — unlimited scope, 90-day support.",
    href: "/pricing",
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
    ctaText: "Get a Custom Quote",
  };
}

interface ServiceFinderProps {
  onClose: () => void;
}

export function ServiceFinder({ onClose }: ServiceFinderProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const question = QUESTIONS[step];
  const totalSteps = QUESTIONS.length;
  const recommendation = done ? getRecommendation(answers) : null;

  function handleAnswer(value: string) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-secondary px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Find the right package</span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {!done && (
            <>
              <div className="flex gap-1.5 mb-3">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-white/20"}`} />
                ))}
              </div>
              <p className="text-white/60 text-xs">Question {step + 1} of {totalSteps}</p>
            </>
          )}
          {done && <p className="text-white/60 text-xs">Here's our recommendation for you</p>}
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-display font-bold text-secondary mb-5">{question.text}</h3>
                <div className="space-y-3">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleAnswer(opt.value)}
                      className="w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      {opt.icon && (
                        <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                          {opt.icon}
                        </span>
                      )}
                      <span className="text-sm font-medium text-secondary group-hover:text-primary transition-colors">{opt.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-display font-bold text-secondary mb-1">We recommend:</h3>
                <div className={`rounded-2xl border p-5 mb-5 ${recommendation!.bg}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className={`text-lg font-display font-bold ${recommendation!.color}`}>{recommendation!.name}</p>
                      <p className="text-2xl font-display font-bold text-secondary mt-0.5">{recommendation!.price}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full ${recommendation!.bg} border flex items-center justify-center`}>
                      <Check className={`w-5 h-5 ${recommendation!.color}`} />
                    </div>
                  </div>
                  <p className="text-sm text-secondary/70 leading-relaxed">{recommendation!.tagline}</p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link href={recommendation!.href} onClick={onClose}>
                    <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                      {recommendation!.ctaText} <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact" onClick={onClose}>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-border font-medium">
                      Ask us a question first
                    </Button>
                  </Link>
                  <button onClick={reset} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-secondary transition-colors mt-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
