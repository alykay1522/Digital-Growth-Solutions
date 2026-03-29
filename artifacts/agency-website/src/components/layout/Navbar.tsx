import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                alt="Logo" 
                className={`w-8 h-8 transition-transform duration-300 group-hover:rotate-12 ${!isScrolled && location === '/' ? 'brightness-0 invert' : ''}`}
              />
              <span className={`font-display font-bold text-xl tracking-tight ${!isScrolled && location === '/' ? 'text-white' : 'text-secondary'}`}>
                Nexa<span className="text-primary">Agency</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href 
                      ? "text-primary" 
                      : !isScrolled && location === '/' 
                        ? "text-white/90 hover:text-white" 
                        : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" className="ml-4">
                <Button 
                  className={`rounded-full px-6 transition-all hover:scale-105 hover:shadow-lg ${
                    !isScrolled && location === '/'
                      ? "bg-white text-secondary hover:bg-white/90"
                      : "bg-secondary text-white hover:bg-secondary/90 shadow-primary/20"
                  }`}
                >
                  Get in Touch
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className={`w-6 h-6 ${!isScrolled && location === '/' ? 'text-white' : 'text-secondary'}`} />
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
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-mark.png`} 
                  alt="Logo" 
                  className="w-8 h-8"
                />
                <span className="font-display font-bold text-xl text-secondary">
                  Nexa<span className="text-primary">Agency</span>
                </span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-muted rounded-full">
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>
            <div className="flex flex-col p-6 gap-6 flex-1">
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
