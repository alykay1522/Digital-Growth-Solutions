import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const CATEGORY_COLORS: Record<string, string> = {
  Performance: "bg-amber-100 text-amber-700",
  eCommerce: "bg-blue-100 text-blue-700",
  Security: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Business: "bg-violet-100 text-violet-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              The NexaAgency Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">
              Insights for smarter web decisions
            </h1>
            <p className="text-lg text-muted-foreground">
              Real advice on WordPress, eCommerce, performance, security, and everything in between — written by the engineers who do this work every day.
            </p>
          </AnimatedSection>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured post */}
        <AnimatedSection className="mb-12">
          <Link href={`/blog/${featured.slug}`}>
            <motion.article
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group grid md:grid-cols-2 gap-0 bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      CATEGORY_COLORS[featured.category] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {featured.readTime} min read
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-secondary mb-3 group-hover:text-primary transition-colors leading-tight">
                  {featured.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-secondary">{featured.author.name}</p>
                    <p className="text-xs text-muted-foreground">{featured.author.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          </Link>
        </AnimatedSection>

        {/* Rest of posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group bg-white rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 overflow-hidden cursor-pointer transition-all duration-300 h-full flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          CATEGORY_COLORS[post.category] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readTime} min
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors leading-snug flex-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div>
                        <p className="text-xs font-semibold text-secondary">{post.author.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </motion.article>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
