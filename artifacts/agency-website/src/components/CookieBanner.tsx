import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 200 }}
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 z-[200] sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md"
        >
          <div className="bg-white rounded-2xl border border-border shadow-2xl shadow-black/10 p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-secondary text-sm mb-1">We use cookies</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use strictly necessary cookies to keep the site working, and optional analytics cookies to understand how you use it. No personal data is sold.{" "}
                  <Link href="/privacy" className="text-primary hover:underline font-medium">
                    Privacy Policy
                  </Link>
                </p>
              </div>
              <button
                onClick={decline}
                aria-label="Close cookie banner"
                className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={accept}
                size="sm"
                className="flex-1 rounded-xl h-9 text-xs bg-primary hover:bg-primary/90 text-white"
              >
                Accept all
              </Button>
              <Button
                onClick={decline}
                size="sm"
                variant="outline"
                className="flex-1 rounded-xl h-9 text-xs border-border text-muted-foreground hover:text-foreground"
              >
                Decline optional
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
