import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CheckCircle2, Lock, Sparkles, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PayPalCheckout } from "@/components/PayPalCheckout";

interface ToolPaywallProps {
  toolKey: string;
  toolName: string;
  tagline: string;
  price: string;
  priceLabel?: string;
  accentClass?: string;
  iconBgClass?: string;
  features: string[];
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
  children,
}: ToolPaywallProps) {
  const [unlocked, setUnlockedState] = useState(false);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setUnlockedState(isUnlocked(toolKey));
  }, [toolKey]);

  const handleSuccess = (_orderId: string) => {
    setUnlocked(toolKey);
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
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
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
      <div className="bg-white border-b border-border pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-5 ${iconBgClass} border-current/20 ${accentClass}`}>
            <Lock className="w-4 h-4" />
            Premium Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
            {toolName}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tagline}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-lg font-display font-bold text-secondary mb-4 flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${accentClass}`} />
                What you get
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

            <div className="bg-muted/40 rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Access is active for <strong className="text-secondary">24 hours</strong> from the moment your payment clears — no account needed, no recurring charges.</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/audit">
                <Button variant="outline" className="rounded-xl text-sm gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
                  Try the free Site Audit instead
                </Button>
              </Link>
              <Link href="/roi">
                <Button variant="outline" className="rounded-xl text-sm gap-1.5 border-border text-muted-foreground hover:text-foreground">
                  Free ROI Calculator
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-border bg-gradient-to-br from-secondary to-secondary/90 text-white">
              <p className="text-sm font-medium text-white/60 mb-1">{toolName}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold">{price}</span>
                <span className="text-white/60 text-sm">{priceLabel}</span>
              </div>
              <p className="text-white/70 text-xs mt-2">One-time payment · No subscription · No account required</p>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-5 text-center">
                Pay securely with PayPal or any major card.
              </p>
              <PayPalCheckout
                amount={price.replace("$", "")}
                description={`${toolName} — 24-hour access`}
                onSuccess={handleSuccess}
              />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Payments are processed by PayPal. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
