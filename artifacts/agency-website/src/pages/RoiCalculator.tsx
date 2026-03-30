import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  Gauge,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  Info,
} from "lucide-react";

function fmt(n: number, decimals = 0) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(decimals > 0 ? decimals : 0)}K`;
  return `$${n.toFixed(decimals)}`;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
  icon: Icon,
  description,
  color,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  icon: React.ElementType;
  description?: string;
  color: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{label}</p>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        <div className={`text-2xl font-black ${color.replace("bg-", "text-").replace("/20", "").replace("bg-", "text-")}`}>
          {format(value)}
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 appearance-none rounded-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--primary) ${pct}%, #e5e7eb ${pct}%)`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{format(min)}</span>
          <span>{format(max)}</span>
        </div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value, prefix = "", suffix = "", className = "" }: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.span
      key={Math.round(value)}
      initial={{ opacity: 0.5, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {prefix}{value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)}M` : value >= 1_000 ? `${Math.round(value / 1_000)}K` : Math.round(value).toLocaleString()}{suffix}
    </motion.span>
  );
}

const SPEED_IMPACT = [
  { delay: 1, label: "< 1s", convLift: 0, bounceReduction: 0 },
  { delay: 2, label: "1–2s", convLift: 7, bounceReduction: 5 },
  { delay: 3, label: "2–3s", convLift: 13, bounceReduction: 18 },
  { delay: 4, label: "3–5s", convLift: 20, bounceReduction: 32 },
  { delay: 5, label: "5–10s", convLift: 28, bounceReduction: 53 },
];

export default function RoiCalculator() {
  const [visitors, setVisitors] = useState(10_000);
  const [convRate, setConvRate] = useState(2.5);
  const [orderValue, setOrderValue] = useState(85);
  const [loadTime, setLoadTime] = useState(4);
  const [shown, setShown] = useState(true);

  const results = useMemo(() => {
    const currentConversions = (visitors * convRate) / 100;
    const currentRevenue = currentConversions * orderValue;
    const currentAnnual = currentRevenue * 12;

    // Find improvement potential based on load time
    const currentBucket = SPEED_IMPACT.find((s) => loadTime <= s.delay) || SPEED_IMPACT[SPEED_IMPACT.length - 1];
    const convLift = currentBucket.convLift / 100;
    const bounceReduction = currentBucket.bounceReduction / 100;

    const improvedVisitors = visitors * (1 + bounceReduction * 0.15); // bounce reduction brings back some visitors
    const improvedConvRate = convRate * (1 + convLift);
    const improvedConversions = (improvedVisitors * improvedConvRate) / 100;
    const improvedRevenue = improvedConversions * orderValue;
    const improvedAnnual = improvedRevenue * 12;

    const monthlyGain = improvedRevenue - currentRevenue;
    const annualGain = improvedAnnual - currentAnnual;
    const gainPct = currentRevenue > 0 ? ((improvedRevenue - currentRevenue) / currentRevenue) * 100 : 0;

    return {
      currentConversions: Math.round(currentConversions),
      currentRevenue,
      currentAnnual,
      improvedConversions: Math.round(improvedConversions),
      improvedRevenue,
      improvedAnnual,
      monthlyGain,
      annualGain,
      gainPct,
      convLiftPct: currentBucket.convLift,
      bounceReductionPct: currentBucket.bounceReduction,
    };
  }, [visitors, convRate, orderValue, loadTime]);

  const loadLabel = loadTime <= 1 ? "< 1 second" : loadTime <= 2 ? "1–2 seconds" : loadTime <= 3 ? "2–3 seconds" : loadTime <= 5 ? "3–5 seconds" : "5+ seconds";
  const loadColor = loadTime <= 1 ? "text-emerald-600" : loadTime <= 2 ? "text-amber-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Free ROI Calculator
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              How Much Is a Slow Site Costing You?
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every second of load time costs real money. Enter your numbers to see the exact revenue you're leaving on the table — and what optimization is worth to you.
            </p>
          </motion.div>

          {/* Research callout */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            {[
              "Amazon: every 100ms = 1% revenue loss",
              "Google: 0.1s faster → +8% conversions",
              "53% of users abandon sites taking > 3s",
            ].map((s) => (
              <span key={s} className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
                <Info className="w-3 h-3" />{s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Inputs */}
        <div>
          <h2 className="font-bold text-xl mb-4">Your Numbers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <SliderInput
              label="Monthly Visitors"
              value={visitors}
              min={500}
              max={500_000}
              step={500}
              format={(v) => v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : `${v}`}
              onChange={setVisitors}
              icon={Users}
              description="Unique monthly sessions"
              color="bg-violet-500"
            />
            <SliderInput
              label="Conversion Rate"
              value={convRate}
              min={0.1}
              max={20}
              step={0.1}
              format={(v) => `${v.toFixed(1)}%`}
              onChange={setConvRate}
              icon={TrendingUp}
              description="% of visitors who purchase/convert"
              color="bg-blue-500"
            />
            <SliderInput
              label="Average Order Value"
              value={orderValue}
              min={5}
              max={2_000}
              step={5}
              format={(v) => `$${v}`}
              onChange={setOrderValue}
              icon={DollarSign}
              description="Average revenue per conversion"
              color="bg-emerald-500"
            />
            <SliderInput
              label="Current Load Time"
              value={loadTime}
              min={1}
              max={10}
              step={0.5}
              format={(v) => `${v}s`}
              onChange={setLoadTime}
              icon={Gauge}
              description="Time to interactive (seconds)"
              color="bg-amber-500"
            />
          </div>

          {/* Load time context */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Your current load time:</span>
            <span className={`font-bold ${loadColor}`}>{loadLabel}</span>
            {loadTime > 3 && <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">Needs work</span>}
            {loadTime <= 2 && <span className="text-emerald-500 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Good</span>}
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {shown && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

              {/* Monthly comparison */}
              <div>
                <h2 className="font-bold text-xl mb-4">Your Revenue Impact</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Current */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                    <p className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-1">Current (Slow Site)</p>
                    <div className="text-4xl font-black text-red-700 mb-1">
                      <AnimatedNumber value={results.currentRevenue} prefix="$" />
                      <span className="text-lg font-medium text-red-500">/mo</span>
                    </div>
                    <p className="text-sm text-red-600">
                      <AnimatedNumber value={results.currentConversions} className="font-semibold" /> conversions/mo
                    </p>
                    <p className="text-xs text-red-500 mt-2">{convRate.toFixed(1)}% conversion rate · {loadLabel} load</p>
                  </div>

                  {/* Optimized */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                    <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-1">After Optimization</p>
                    <div className="text-4xl font-black text-emerald-700 mb-1">
                      <AnimatedNumber value={results.improvedRevenue} prefix="$" />
                      <span className="text-lg font-medium text-emerald-500">/mo</span>
                    </div>
                    <p className="text-sm text-emerald-600">
                      <AnimatedNumber value={results.improvedConversions} className="font-semibold" /> conversions/mo
                    </p>
                    <p className="text-xs text-emerald-500 mt-2">
                      +{results.convLiftPct}% conv rate · {results.bounceReductionPct}% less bounce
                    </p>
                  </div>
                </div>
              </div>

              {/* Gain highlight */}
              {results.annualGain > 0 && (
                <motion.div
                  key={Math.round(results.annualGain)}
                  initial={{ scale: 0.97, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-primary to-violet-700 rounded-2xl p-8 text-white text-center shadow-2xl shadow-primary/30"
                >
                  <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">Annual Revenue Opportunity</p>
                  <div className="text-6xl sm:text-7xl font-black mb-3">
                    <AnimatedNumber value={results.annualGain} prefix="$" />
                  </div>
                  <p className="text-white/80 text-lg">
                    That's <span className="font-bold text-white">{fmt(results.monthlyGain)}/month</span> you're currently leaving on the table
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm font-semibold">
                    <Zap className="w-4 h-4" />
                    {results.gainPct.toFixed(0)}% revenue increase from speed alone
                  </div>
                </motion.div>
              )}

              {/* Metric bars */}
              <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <h3 className="font-bold text-base">What Changes After Optimization</h3>
                {[
                  { label: "Conversion Rate", before: convRate, after: convRate * (1 + results.convLiftPct / 100), suffix: "%", color: "bg-blue-500" },
                  { label: "Monthly Conversions", before: results.currentConversions, after: results.improvedConversions, suffix: "", color: "bg-violet-500" },
                  { label: "Monthly Revenue", before: results.currentRevenue, after: results.improvedRevenue, suffix: "", prefix: "$", color: "bg-emerald-500" },
                ].map((row) => {
                  const pctImprovement = row.before > 0 ? ((row.after - row.before) / row.before) * 100 : 0;
                  return (
                    <div key={row.label}>
                      <div className="flex items-center justify-between mb-2 text-sm">
                        <span className="font-medium text-foreground">{row.label}</span>
                        <span className="text-emerald-600 font-semibold">+{pctImprovement.toFixed(0)}%</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-14 text-right">Before</span>
                          <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                            <div className="h-full bg-red-300 rounded-full" style={{ width: "50%" }} />
                          </div>
                          <span className="text-xs font-mono text-muted-foreground w-16">
                            {row.prefix || ""}{typeof row.before === "number" && row.before >= 1000 ? `${Math.round(row.before / 1000)}K` : row.before.toFixed(row.suffix === "%" ? 1 : 0)}{row.suffix}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-14 text-right">After</span>
                          <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              key={row.after}
                              initial={{ width: "50%" }}
                              animate={{ width: `${Math.min(90, 50 * (row.after / row.before))}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={`h-full ${row.color} rounded-full`}
                            />
                          </div>
                          <span className="text-xs font-mono text-foreground font-semibold w-16">
                            {row.prefix || ""}{typeof row.after === "number" && row.after >= 1000 ? `${Math.round(row.after / 1000)}K` : row.after.toFixed(row.suffix === "%" ? 1 : 0)}{row.suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sources note */}
              <p className="text-xs text-muted-foreground text-center">
                Estimates based on research by Google, Akamai, and Deloitte. Actual results vary by industry, device, and optimization scope.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-950 to-gray-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Ready to capture that revenue?</h3>
              <p className="text-gray-400 text-sm">
                We specialize in performance optimization — turning slow sites into fast, converting machines.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link href="/audit">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-5 h-11">
                  <Gauge className="w-4 h-4 mr-2" /> Audit My Site
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-5 h-11 shadow-lg shadow-primary/30">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={() => { setVisitors(10_000); setConvRate(2.5); setOrderValue(85); setLoadTime(4); }}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}
