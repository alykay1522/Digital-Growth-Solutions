import React from "react";
import { Link, useParams } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Tag } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

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

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">This article doesn't exist or may have moved.</p>
          <Link href="/blog">
            <Button className="rounded-xl">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;
  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative pt-20 bg-secondary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={post.coverImage}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 to-secondary" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link href="/blog">
              <button className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </button>
            </Link>

            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  CATEGORY_COLORS[post.category] || "bg-white/10 text-white"
                }`}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-white/70">
                <Clock className="w-4 h-4" />
                {post.readTime} min read
              </span>
              <span className="text-sm text-white/70">{formatDate(post.publishedAt)}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
                {post.author.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold">{post.author.name}</p>
                <p className="text-xs text-white/70">{post.author.role} · NexaAgency</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cover image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 mb-12">
        <motion.img
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
        />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr,240px] gap-12">
          {/* Article body */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-secondary prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-gray-100 prose-code:text-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-li:text-gray-700 prose-strong:text-secondary prose-hr:border-border"
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </motion.article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Tags */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topics</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 bg-white border border-border rounded-full text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Free tools CTA */}
              <div className="bg-primary rounded-2xl p-5 text-white">
                <BookOpen className="w-6 h-6 mb-3 opacity-80" />
                <h4 className="font-bold mb-2 leading-snug">Free audit tools</h4>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  Check your site's SEO, speed, and security for free — no signup needed.
                </p>
                <Link href="/audit">
                  <button className="w-full bg-white text-primary text-xs font-bold px-3 py-2 rounded-lg hover:bg-white/90 transition-colors">
                    Run Site Audit →
                  </button>
                </Link>
              </div>

              {/* Author */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-sm">
                    {post.author.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-secondary">{post.author.name}</p>
                    <p className="text-xs text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <Link href="/contact">
                  <button className="w-full text-xs text-primary font-medium hover:underline text-left">
                    Work with our team →
                  </button>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Prev / Next */}
        <div className="grid sm:grid-cols-2 gap-4 mt-16 mb-8">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`}>
              <div className="group p-5 bg-gray-50 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous article
                </div>
                <p className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {prevPost.title}
                </p>
              </div>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`}>
              <div className="group p-5 bg-gray-50 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer text-right">
                <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground mb-2">
                  Next article
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors leading-snug line-clamp-2">
                  {nextPost.title}
                </p>
              </div>
            </Link>
          ) : <div />}
        </div>

        {/* Related posts */}
        <div className="pb-20">
          <h3 className="text-xl font-display font-bold text-secondary mb-6">More from the blog</h3>
          <div className="grid sm:grid-cols-2 gap-5">
            {relatedPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="group flex gap-4 p-4 bg-gray-50 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                  <img
                    src={p.coverImage}
                    alt={p.title}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                    <p className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {p.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
