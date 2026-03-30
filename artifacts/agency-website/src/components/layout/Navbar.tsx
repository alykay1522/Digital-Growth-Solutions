import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, DollarSign, GitCompare, Layers, Menu, ScanSearch, Scissors, ShoppingBag, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOOLS = [
  {
    href: "/audit",
    label: "Site Audit",
    description: "SEO, security & performance check",
    icon: ScanSearch,
    badge: "Free",
    color: "text-violet-600 bg-violet-50",
  },
  {
    href: "/tech-stack",
    label: "Tech Stack Detector",
    description: "See what any site is built with",
    icon: Layers,
    badge: "Free",
    color: "text-blue-600 bg-blue-50",
  },
  {
    href: "/roi",
    label: "ROI Calculator",
    description: "How much is a slow site costing you?",
    icon: DollarSign,
    badge: "Free",
    color: "text-amber-600 bg-amber-50",
  },
  {
    href: "/compare",
    label: "Competitor Comparison",
    description: "Your site vs any competitor",
    icon: GitCompare,
    badge: "Free",
    color: "text-orange-600 bg-orange-50",
  },
  {
    href: "/sniff",
    label: "Product Sniffer",
    description: "Extract product data from any store",
    icon: ShoppingBag,
    badge: "Free",
    color: "text-pink-600 bg-pink-50",
  },
  {
    href: "/clone",
    label: "Site Cloner",
    description: "Clone any website as a single HTML file",
    icon: Scissors,
    badge: "Free",
    color: "text-violet-600 bg-violet-50",
  },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isOnToolPage = TOOLS.some((t) => location === t.href);
  const isHome = location === "/";
  const onWhite = isScrolled || !isHome;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
  ];

  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location === href
        ? "text-primary"
        : onWhite
        ? "text-muted-foreground"
        : "text-white/90 hover:text-white"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/85 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src={`${import.meta.env.BASE_URL}images/logo-mark.png`}
                alt="Logo"
                className={`w-8 h-8 transition-transform duration-300 group-hover:rotate-12 ${!onWhite ? "brightness-0 invert" : ""}`}
              />
              <span className={`font-display font-bold text-xl tracking-tight ${!onWhite ? "text-white" : "text-secondary"}`}>
                Nexa<span className="text-primary">Agency</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              ))}

              {/* Free Tools dropdown */}
              <div ref={toolsRef} className="relative">
                <button
                  onClick={() => setToolsOpen(!toolsOpen)}
                  className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1 rounded-full border transition-all ${
                    isOnToolPage || toolsOpen
                      ? "bg-primary text-white border-primary"
                      : onWhite
                      ? "text-primary border-primary/40 hover:bg-primary/10 hover:border-primary"
                      : "text-white border-white/40 hover:bg-white/10 hover:border-white/70"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Free Tools
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl border border-border shadow-xl overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        {TOOLS.map((tool) => {
                          const Icon = tool.icon;
                          const active = location === tool.href;
                          return (
                            <Link
                              key={tool.href}
                              href={tool.href}
                              onClick={() => setToolsOpen(false)}
                              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group ${
                                active ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"
                              }`}
                            >
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
                                <Icon className="w-4.5 h-4.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                                    {tool.label}
                                  </span>
                                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                    {tool.badge}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="border-t border-border px-4 py-3 bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center">
                          All tools are completely free — no sign-up required
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/contact" className="ml-4">
                <Button
                  className={`rounded-full px-6 transition-all hover:scale-105 hover:shadow-lg ${
                    !onWhite
                      ? "bg-white text-secondary hover:bg-white/90"
                      : "bg-secondary text-white hover:bg-secondary/90 shadow-primary/20"
                  }`}
                >
                  Get in Touch
                </Button>
              </Link>
            </nav>

            {/* Mobile toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className={`w-6 h-6 ${!onWhite ? "text-white" : "text-secondary"}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border/50">
              <div className="flex items-center gap-2">
                <img src={`${import.meta.env.BASE_URL}images/logo-mark.png`} alt="Logo" className="w-8 h-8" />
                <span className="font-display font-bold text-xl text-secondary">
                  Nexa<span className="text-primary">Agency</span>
                </span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-muted rounded-full">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            <div className="flex flex-col p-6 gap-5 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-display font-semibold transition-colors ${
                    location === link.href ? "text-primary" : "text-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile tools section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Free Tools</p>
                </div>
                <div className="space-y-2 pl-1">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                          location === tool.href
                            ? "border-primary/30 bg-primary/5"
                            : "border-border bg-muted/30 hover:bg-muted"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tool.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${location === tool.href ? "text-primary" : "text-foreground"}`}>
                            {tool.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{tool.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pb-8">
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25">
                    Start a Project
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
