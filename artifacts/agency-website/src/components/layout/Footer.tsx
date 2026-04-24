import React from "react";
import { Link } from "wouter";
import { Twitter, Linkedin, Instagram, ArrowRight, Mail } from "lucide-react";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

export function Footer() {
  return (
    <footer className="bg-secondary text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2" aria-label="Digital Growth Solutions Agency home">
              <img
                src={`${BASE_URL}/images/logo-mark.png`}
                alt="Digital Growth Solutions Agency logo"
                className="w-8 h-8 brightness-0 invert"
                width={32}
                height={32}
              />
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Digital Growth Solutions<span className="text-primary"> Agency</span>
              </span>
            </Link>
            <p className="text-white/60 leading-relaxed max-w-sm">
              WordPress sites, Shopify stores, custom software, and AI automation for service businesses, online retailers, and B2B brands — built right, on budget, on time.
            </p>
            <p className="text-white/40 text-xs">
              Serving clients worldwide · Remote-first agency
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/digitalgrowthsolutions"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Twitter / X"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Twitter className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com/company/digital-growth-solutions-agency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Linkedin className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com/digitalgrowthsolutionsagency"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Services</h4>
            <ul className="space-y-4">
              {[
                { label: 'WordPress Development', href: '/services' },
                { label: 'Shopify Development', href: '/services/shopify-development' },
                { label: 'AI Automation', href: '/services/ai-automation' },
                { label: 'eCommerce Solutions', href: '/services' },
                { label: 'Mobile-First Design', href: '/services' },
                { label: '🚨 Website Rescue', href: '/rescue' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/60 hover:text-primary transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'AI Agents', href: '/agents' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Pay Online', href: '/pay' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-white/60 hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-lg mb-6 text-white">Get in Touch</h4>
            <ul className="space-y-4 text-white/60">
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                <a href="mailto:hello@digitalgrowthsolutionsagency.com" className="hover:text-white transition-colors text-sm">
                  hello@digitalgrowthsolutionsagency.com
                </a>
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              {[
                "⚡ 24-Hour Response Guarantee",
                "🔒 100% Satisfaction Guarantee",
                "✅ Fixed Pricing — No Surprises",
                "🤖 AI-Powered, Human-Supervised",
              ].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-xs text-white/50 font-medium">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Digital Growth Solutions Agency. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
