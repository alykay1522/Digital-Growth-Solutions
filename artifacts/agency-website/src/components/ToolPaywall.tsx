import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  CheckCircle2, Clock, Lock, Sparkles, ArrowRight,
  ShieldCheck, Users, Zap, CreditCard, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { GA } from "@/utils/analytics";

interface ToolPaywallProps {
  toolKey: string;
  toolName: string;
  tagline: string;
  price: string;
  priceLabel?: string;
  accentClass?: string;
  iconBgClass?: string;
  features: string[];
  preview?: React.ReactNode;
  usageCount?: number;
  children: React.ReactNode;
}

const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000;

function getUnlockKey(toolKey: string) {
  return `tool_unlock_${toolKey}`;
}

function isUnlocked(toolKey: string): boolean {
  try {
    const raw = localStorage.getItem(getUnlockKey(toolKey));
    if (!raw) return false;
    const { expiresAt } = JSON.parse(raw);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

function setUnlocked(toolKey: string) {
  localStorage.setItem(
    getUnlockKey(toolKey),
    JSON.stringify({ expiresAt: Date.now() + UNLOCK_DURATION_MS })
  );
}

export function ToolPaywall({
  toolKey,
  toolName,
  tagline,
  price,
  priceLabel = "24-hour access",
  accentClass = "text-primary",
  iconBgClass = "bg-primary/10",
  features,
  preview,
  usageCount = 1240,
  children,
}: ToolPaywallProps) {
  const [unlocked, setUnlockedState] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setUnlockedState(isUnlocked(toolKey));
  }, [toolKey]);

  const handleSuccess = (_orderId: string) => {
    setUnlocked(toolKey);
    GA.paymentSuccess(toolKey, parseFloat(price.replace("$", "")));
    setTimeout(() => {
      setPaid(true);
      setUnlockedState(true);
    }, 1200);
  };

  if (unlocked) {
    return <>{children}</>;
  }

  if (paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-border shadow-xl p-10 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-secondary mb-2">You're all set!</h2>
          <p className="text-muted-foreground mb-6">
            Payment confirmed. Your access to <strong>{toolName}</strong> is active for the next 24 hours.
          </p>
          <Button
            onClick={() => setUnlockedState(true)}
            className="w-full h-12 rounded-xl text-base bg-primary hover:bg-primary/90 text-white"
          >
            Open {toolName} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-border pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-5 ${iconBgClass} border-current/20 ${accentClass}`}>
            <Lock className="w-4 h-4" />
            Premium Tool — {price} for 24-hour access
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-secondary mb-3">
            {toolName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-5">
            {tagline}
          </p>
          {/* Social proof */}
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              {usageCount.toLocaleString()}+ businesses used this tool
            </span>
            <span className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              <span className="ml-1">5.0 (avg)</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* PREVIEW PANEL (if provided) */}
        {preview && (
          <div className="relative rounded-2xl overflow-hidden border border-border bg-white shadow-sm">
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/70 backdrop-blur-sm">
              <div className="bg-secondary text-white rounded-2xl px-6 py-4 shadow-2xl text-center max-w-xs">
                <Lock className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="font-bold text-sm mb-1">Unlock to see full output</p>
                <p className="text-white/60 text-xs">Pay once · Access for 24 hours · No account needed</p>
              </div>
            </div>
            <div className="pointer-events-none select-none blur-sm opacity-60 p-4">
              {preview}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* LEFT: FEATURES + TRUST */}
          <div className="space-y-5">

            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-base font-display font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${accentClass}`} />
                What you get with {price}
              </h2>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${accentClass}`} />
                    <span className="text-sm text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, label: "Secure payment", sub: "Processed by PayPal" },
                { icon: Clock, label: "24-hr access", sub: "No recurring charge" },
                { icon: Zap, label: "Instant unlock", sub: "Access in seconds" },
                { icon: CreditCard, label: "Any card accepted", sub: "Visa, MC, Amex" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="bg-white rounded-xl border border-border p-4 flex items-start gap-3">
                  <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-secondary">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Access runs for <strong>24 hours</strong> from the moment your payment clears. No account required, no recurring charges, no subscription.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/audit">
                <Button variant="outline" size="sm" className="rounded-xl text-xs border-primary/30 text-primary hover:bg-primary/5">
                  Try the free Site Audit instead
                </Button>
              </Link>
              <Link href="/roi">
                <Button variant="outline" size="sm" className="rounded-xl text-xs border-border text-muted-foreground hover:text-foreground">
                  Free ROI Calculator
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT: CHECKOUT CARD */}
          <div className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden sticky top-24">
            <div className="px-6 pt-6 pb-5 border-b border-border bg-gradient-to-br from-secondary to-secondary/90 text-white">
              <p className="text-sm font-medium text-white/60 mb-1">{toolName}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold">{price}</span>
                <span className="text-white/60 text-sm">{priceLabel}</span>
              </div>
              <p className="text-white/50 text-xs mt-1.5">One-time payment · No subscription · No account</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-5">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Secure checkout powered by PayPal
              </div>
              <PayPalCheckout
                amount={price.replace("$", "")}
                description={`${toolName} — 24-hour access`}
                onSuccess={handleSuccess}
              />
              <p className="text-xs text-muted-foreground text-center mt-4">
                We never store your card details. All payments are processed securely by PayPal.
              </p>
              <div className="mt-4 pt-4 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Questions? Email us at{" "}
                  <a href="mailto:hello@digitalgrowthsolutionsagency.com" className="text-primary hover:underline">
                    hello@digitalgrowthsolutionsagency.com
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
