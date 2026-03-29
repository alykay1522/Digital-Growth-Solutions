import React from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Code2, HeartHandshake, Lightbulb, Target } from "lucide-react";

export default function About() {
  return (
    <div className="pt-20 bg-white">
      {/* Hero */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection direction="right">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6 leading-tight">
              Technology should make life <span className="text-primary">easier</span>, not more complicated.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We're a passionate team of developers, designers, and problem-solvers who help businesses bring their ideas to life — whether that's through a stunning website, a custom-built application, or a complete eCommerce solution.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Our approach is simple: listen first, plan smart, build right, and deliver results that make a real difference to your bottom line.
            </p>
            <Link href="/contact">
              <Button className="h-12 px-8 text-base rounded-full bg-secondary hover:bg-secondary/90 text-white shadow-lg">
                Meet the Team
              </Button>
            </Link>
          </AnimatedSection>
          
          <AnimatedSection direction="left">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
              <img 
                src={`${import.meta.env.BASE_URL}images/about-team.png`} 
                alt="Our team collaborating" 
                className="w-full h-auto object-cover relative z-0"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection delay={0.1}>
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-border/50 h-full">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold mb-4 font-display">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower businesses with reliable, creative, and results-driven technology solutions. We focus on blending innovation with practicality, so every project we deliver adds real value — helping our clients work smarter, reach wider, and grow faster.
                </p>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-10 rounded-3xl shadow-lg border border-border/50 h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 font-display">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the trusted digital partner for businesses worldwide, recognized for our uncompromising quality, transparent communication, and ability to turn complex technical challenges into elegant, user-friendly solutions.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">Our Core Values</h2>
        </AnimatedSection>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: HeartHandshake, title: "Client First", desc: "Your success is our success. We build relationships, not just software." },
            { icon: Code2, title: "Excellence", desc: "We write clean, scalable code and design pixel-perfect interfaces." },
            { icon: Zap, title: "Innovation", desc: "We stay ahead of the curve to bring you the best modern solutions." },
            { icon: Target, title: "Results Driven", desc: "Everything we do is focused on delivering measurable business impact." }
          ].map((val, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform">
                  <val.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                <p className="text-muted-foreground">{val.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>
    </div>
  );
}
