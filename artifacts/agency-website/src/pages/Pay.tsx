import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { useMeta } from "@/hooks/useMeta";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";

const QUICK_PACKAGES = [
  {
    id: "rescue-basic",
    label: "WordPress Emergency Fix",
    description: "Site down, white screen, broken pages",
    amount: "197",
    display: "$197",
  },
  {
    id: "rescue-checkout",
    label: "WooCommerce Checkout Fix",
    description: "Broken checkout or payment errors",
    amount: "247",
    display: "$247",
  },
  {
    id: "rescue-malware",
    label: "Malware Removal",
    description: "Hack cleanup + firewall hardening",
    amount: "297",
    display: "$297",
  },
  {
    id: "speed",
    label: "Site Speed Overhaul",
    description: "Compress, cache, optimise for Core Web Vitals",
    amount: "297",
    display: "$297",
  },
  {
    id: "care-basic",
    label: "Care Basic — 1 Month",
    description: "Updates, backups, uptime monitoring",
    amount: "99",
    display: "$99/mo",
  },
  {
    id: "care-pro",
    label: "Care Pro — 1 Month",
    description: "Everything in Basic + 3 hrs dev time",
    amount: "249",
    display: "$249/mo",
  },
];

type CheckoutItem = { label: string; description: string; amount: string } | null;

export default function Pay() {
  useMeta({ title: "Pay Online", description: "Securely pay for your Digital Growth Solutions Agency service or package online via PayPal. Instant confirmation and automated project kick-off." });
  const [selected, setSelected] = useState<CheckoutItem>(null);
  const [customMode, setCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customReady, setCustomReady] = useState(false);

  const activeItem: CheckoutItem = customMode && customReady
    ? { label: "Custom Invoice Payment", description: customDesc || "Digital Growth Solutions Agency Service", amount: customAmount }
    : selected;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-border pt-12 pb-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-5">
              <Lock className="w-4 h-4" />
              Secure PayPal Checkout
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-3">
              Pay for a Service
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Select a package below, or enter a custom amount if we've sent you a quote. All payments are processed securely through PayPal.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-5 text-xs text-muted-foreground">
              {[
                { icon: ShieldCheck, label: "256-bit SSL encryption" },
                { icon: Lock, label: "Buyer protection included" },
                { icon: Zap, label: "Instant confirmation" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-green-500" />
                  {label}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid gap-6">

          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => { setCustomMode(false); setCustomReady(false); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${!customMode ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
            >
              Quick Packages
            </button>
            <button
              onClick={() => { setCustomMode(true); setSelected(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${customMode ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
            >
              Pay a Custom Invoice
            </button>
          </div>

          {/* Quick packages */}
          <AnimatePresence mode="wait">
            {!customMode && (
              <motion.div
                key="packages"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid sm:grid-cols-2 gap-3"
              >
                {QUICK_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelected(selected?.label === pkg.label ? null : { label: pkg.label, description: pkg.description, amount: pkg.amount })}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${
                      selected?.label === pkg.label
                        ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                        : "border-border bg-white hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-secondary text-sm">{pkg.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{pkg.description}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-base font-bold text-primary">{pkg.display}</span>
                        <div className={`w-5 h-5 rounded-full border-2 mt-1 ml-auto flex items-center justify-center transition-all ${
                          selected?.label === pkg.label ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {selected?.label === pkg.label && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Custom invoice */}
            {customMode && (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl border border-border p-6 shadow-sm"
              >
                <p className="text-sm text-muted-foreground mb-5">
                  If we sent you a quote or invoice, enter the amount and a brief description of what it's for.
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="custom-amount" className="text-sm font-semibold text-secondary mb-1.5 block">
                      Amount (USD) *
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="custom-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setCustomReady(false); }}
                        className="pl-8 h-12"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="custom-desc" className="text-sm font-semibold text-secondary mb-1.5 block">
                      Description *
                    </Label>
                    <Input
                      id="custom-desc"
                      placeholder="e.g. WordPress Rescue Fix – June 2026"
                      value={customDesc}
                      onChange={(e) => { setCustomDesc(e.target.value); setCustomReady(false); }}
                      className="h-12"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (customAmount && parseFloat(customAmount) > 0 && customDesc.trim()) {
                        setCustomReady(true);
                      }
                    }}
                    disabled={!customAmount || parseFloat(customAmount) <= 0 || !customDesc.trim()}
                    className="w-full h-11 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-semibold"
                  >
                    Confirm Amount — Continue to PayPal
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkout panel */}
          <AnimatePresence>
            {activeItem && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-white rounded-2xl border-2 border-primary/30 p-6 shadow-lg shadow-primary/5"
              >
                {/* Summary */}
                <div className="flex items-start justify-between mb-5 pb-5 border-b border-border">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">You're paying for</p>
                    <p className="font-bold text-secondary">{activeItem.label}</p>
                    <p className="text-sm text-muted-foreground">{activeItem.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-2xl font-display font-bold text-primary">${activeItem.amount}</p>
                    <p className="text-xs text-muted-foreground">USD</p>
                  </div>
                </div>

                <PayPalCheckout
                  amount={activeItem.amount}
                  description={`Digital Growth Solutions Agency: ${activeItem.label}`}
                  onSuccess={() => {
                    setSelected(null);
                    setCustomReady(false);
                    setCustomAmount("");
                    setCustomDesc("");
                  }}
                />

                <p className="text-xs text-muted-foreground text-center mt-4">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Secured by PayPal. We never see or store your card details.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help banner */}
          <div className="bg-secondary/5 border border-border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-secondary text-sm mb-0.5">Not sure what to pay?</p>
              <p className="text-xs text-muted-foreground">Get in touch and we'll send you a PayPal invoice directly with the exact amount for your project.</p>
            </div>
            <Link href="/contact" className="shrink-0">
              <Button variant="outline" className="rounded-xl h-10 px-5 text-sm border-border">
                Contact Us <ArrowRight className="ml-2 w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {/* Payment FAQ / Trust */}
          <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-display font-bold text-lg text-secondary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              Payment policy &amp; your guarantee
            </h2>
            <div className="grid sm:grid-cols-2 gap-5 text-sm">
              {[
                {
                  title: "What are these payments for?",
                  body: "These payments cover specific service packages or project deposits as agreed with us. Emergency fixes begin within 2 business hours of payment. Monthly care plans auto-renew each month.",
                },
                {
                  title: "Satisfaction guarantee",
                  body: "If we can't fix the issue for emergency packages, you receive a full refund — no questions asked. For project packages, we work until you're satisfied or issue a pro-rata refund.",
                },
                {
                  title: "Secure & private",
                  body: "All payments are processed by PayPal. We never see, receive, or store your card details. PayPal's Buyer Protection applies to eligible purchases.",
                },
                {
                  title: "Need a VAT invoice?",
                  body: "Email us at hello@digitalgrowthsolutionsagency.com after paying and we'll issue a VAT receipt or formal invoice for your records within 24 hours.",
                },
              ].map(({ title, body }) => (
                <div key={title}>
                  <p className="font-semibold text-secondary mb-1">{title}</p>
                  <p className="text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
