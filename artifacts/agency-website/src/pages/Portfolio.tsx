import React, { useState } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { useGetPortfolio } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

const FALLBACK_PORTFOLIO = [
  {
    id: "1",
    title: "Lumina Fintech",
    description: "Complete digital transformation for a leading financial services provider.",
    category: "WordPress",
    tags: ["Custom Theme", "API Integration", "High Performance"],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    clientName: "Lumina Corp",
    result: "300% increase in lead generation"
  },
  {
    id: "2",
    title: "Aura Commerce",
    description: "Headless Shopify build for a luxury cosmetics brand.",
    category: "eCommerce",
    tags: ["Shopify", "React", "Animations"],
    imageUrl: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&q=80",
    clientName: "Aura Beauty",
    result: "45% boost in mobile conversions"
  },
  {
    id: "3",
    title: "Nexus Dashboard",
    description: "Custom web application for data analytics and reporting.",
    category: "Web App",
    tags: ["React", "Dashboard", "Node.js"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    clientName: "Nexus Data",
    result: "Saved 20hrs/week in reporting"
  },
  {
    id: "4",
    title: "EcoLife Blog",
    description: "High-traffic content platform built on WordPress.",
    category: "WordPress",
    tags: ["SEO", "Custom Plugin", "Publishing"],
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
    clientName: "EcoLife Media",
    result: "1M+ monthly unique visitors"
  }
];

const CATEGORIES = ["All", "WordPress", "eCommerce", "Web App", "Mobile"];

export default function Portfolio() {
  const { data: apiPortfolio, isLoading } = useGetPortfolio();
  const portfolio = apiPortfolio?.length ? apiPortfolio : FALLBACK_PORTFOLIO;
  
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPortfolio = activeCategory === "All" 
    ? portfolio 
    : portfolio.filter(p => p.category === activeCategory);

  return (
    <div className="pt-20">
      <section className="bg-secondary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">Our <span className="text-gradient">Work</span></h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Explore our recent projects and see how we've helped businesses achieve their digital goals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "bg-muted text-muted-foreground hover:bg-secondary/10 hover:text-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredPortfolio.map((project, i) => (
                <AnimatedSection key={project.id} delay={i * 0.1}>
                  <div className="group rounded-2xl overflow-hidden bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium flex items-center gap-2">
                          View Case Study <ArrowUpRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{project.category}</Badge>
                        <span className="text-sm text-muted-foreground font-medium">{project.clientName}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                      <p className="text-muted-foreground mb-6 flex-1">{project.description}</p>
                      
                      <div className="pt-6 border-t border-border mt-auto">
                        <div className="text-sm font-bold text-accent mb-3">Result: {project.result}</div>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium text-secondary/60 bg-muted px-2 py-1 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
          
          {!isLoading && filteredPortfolio.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
