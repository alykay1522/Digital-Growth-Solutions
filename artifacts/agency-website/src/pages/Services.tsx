import React from "react";
import { Link } from "wouter";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Check, Code, Globe, Layout, Palette, Server, Smartphone, Zap } from "lucide-react";
import { useGetServices } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

// Map string icons to components
const IconMap: Record<string, React.ElementType> = {
  Code, Globe, Layout, Palette, Server, Smartphone, Zap
};

const FALLBACK_SERVICES = [
  {
    id: "1",
    title: "WordPress Development",
    description: "High-performing, fully customized, SEO-optimized, lightning-fast WordPress websites that look amazing and perform even better.",
    icon: "Globe",
    category: "Web",
    features: ["SEO Optimization", "Speed & Performance Tuning", "Custom Post Types", "Robust Security"]
  },
  {
    id: "2",
    title: "Custom Plugins & Add-Ons",
    description: "We create completely custom Plugins to deliver specialized tools, improve usability, and integrate third-party software.",
    icon: "Code",
    category: "Development",
    features: ["3rd-party API Integration", "Workflow Automation", "Plugin Maintenance", "Feature Extension"]
  },
  {
    id: "3",
    title: "Theme Customization",
    description: "Transform off-the-shelf themes into branded, conversion-optimized experiences, or build custom themes from scratch.",
    icon: "Palette",
    category: "Design",
    features: ["Pixel-perfect Design", "Brand Identity Match", "Custom Layouts", "Animation Integration"]
  },
  {
    id: "4",
    title: "eCommerce Solutions",
    description: "Complete WooCommerce and Shopify solutions to make your digital storefront memorable and efficient.",
    icon: "Layout",
    category: "Commerce",
    features: ["Shopify Development", "WooCommerce Customization", "Payment Gateway Integration", "Inventory Sync"]
  },
  {
    id: "5",
    title: "Mobile-First Design",
    description: "We develop websites so that they look and perform great on all devices, providing a seamless user experience.",
    icon: "Smartphone",
    category: "Design",
    features: ["Responsive Layouts", "Touch-friendly UI", "App-like Experience", "Cross-browser Testing"]
  },
  {
    id: "6",
    title: "Software & Web Apps",
    description: "Custom-built applications and software solutions designed to solve complex business problems.",
    icon: "Server",
    category: "Development",
    features: ["React & Node.js", "Database Architecture", "Cloud Hosting", "Admin Dashboards"]
  }
];

export default function Services() {
  const { data: apiServices, isLoading } = useGetServices();
  const services = apiServices?.length ? apiServices : FALLBACK_SERVICES;

  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-mesh opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">Our <span className="text-gradient">Services</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Comprehensive digital solutions to help your business work smarter, reach wider, and grow faster.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, i) => {
                const IconComponent = IconMap[service.icon] || Code;
                return (
                  <AnimatedSection key={service.id} delay={i * 0.1}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5 border border-border/50 hover:shadow-xl transition-shadow h-full flex flex-col">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold text-secondary">{service.title}</h3>
                      </div>
                      <p className="text-muted-foreground mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="mt-auto">
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-secondary/60 mb-4">Key Features</h4>
                        <ul className="grid sm:grid-cols-2 gap-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-accent shrink-0" />
                              <span className="text-sm font-medium text-secondary/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-border text-center px-4">
        <h2 className="text-3xl font-bold mb-6">Not sure what you need?</h2>
        <p className="text-muted-foreground text-lg mb-8">Let's hop on a call and discuss your business goals.</p>
        <Link href="/contact">
          <Button className="h-12 px-8 text-base rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg">
            Schedule a Consultation
          </Button>
        </Link>
      </section>
    </div>
  );
}
