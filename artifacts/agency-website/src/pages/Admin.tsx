import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  FileText,
  Inbox,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");

function api(path: string, password: string, opts: RequestInit = {}) {
  return fetch(`${BASE_URL}/api${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
      ...(opts.headers || {}),
    },
  });
}

// ── Types ──────────────────────────────────────────────────────────────────

interface Post {
  id: number;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  published_at: string;
  read_time: number;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  author_name?: string;
  author_role?: string;
  tags?: string[];
}

interface Submission {
  id: number;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  submitted_at: string;
}

// ── Login ────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api("/blog-admin/posts", pw);
      if (res.ok) {
        onLogin(pw);
      } else {
        setError("Incorrect password. Check your Replit Secrets for ADMIN_PASSWORD.");
      }
    } catch {
      setError("Could not reach the server. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-border shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-xl font-display font-bold text-secondary">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Digital Growth Solutions Agency</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="pw" className="text-sm font-semibold text-secondary mb-1.5 block">Password</Label>
            <div className="relative">
              <Input
                id="pw"
                type={show ? "text" : "password"}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="h-11 pr-10"
                required
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <Button type="submit" disabled={loading || !pw} className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Post Editor ─────────────────────────────────────────────────────────

function PostEditor({
  post,
  password,
  onSave,
  onClose,
}: {
  post: Post | null;
  password: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const isNew = !post;
  const [form, setForm] = useState({
    slug: post?.slug || "",
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    published_at: post?.published_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    read_time: post?.read_time || 5,
    category: post?.category || "General",
    cover_image: post?.cover_image || "",
    author_name: post?.author_name || "Digital Growth Solutions Agency Team",
    author_role: post?.author_role || "Agency",
    tags: (post?.tags || []).join(", "),
    published: post?.published !== false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    setSaving(true);
    setError("");
    const body = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      read_time: Number(form.read_time),
    };
    try {
      const res = isNew
        ? await api("/blog-admin/posts", password, { method: "POST", body: JSON.stringify(body) })
        : await api(`/blog-admin/posts/${post!.id}`, password, { method: "PUT", body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSave();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: string, opts: { type?: string; rows?: number; placeholder?: string } = {}) => (
    <div>
      <Label className="text-xs font-semibold text-secondary mb-1 block">{label}</Label>
      {opts.rows ? (
        <textarea
          value={(form as any)[key]}
          onChange={(e) => set(key, e.target.value)}
          rows={opts.rows}
          placeholder={opts.placeholder}
          className="w-full border border-border rounded-xl px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      ) : (
        <Input
          type={opts.type || "text"}
          value={(form as any)[key]}
          onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder}
          className="h-10"
        />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-bold text-secondary">{isNew ? "New Post" : "Edit Post"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6 space-y-4">
          {field("Title *", "title", { placeholder: "Post title" })}
          <div>
            <Label className="text-xs font-semibold text-secondary mb-1 block">Slug *</Label>
            <div className="flex gap-2">
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="url-friendly-slug" className="h-10 flex-1" />
              <Button type="button" variant="outline" onClick={() => set("slug", autoSlug(form.title))} className="h-10 text-xs px-3">Auto</Button>
            </div>
          </div>
          {field("Excerpt", "excerpt", { rows: 2, placeholder: "Short preview shown on blog list" })}
          {field("Content (Markdown) *", "content", { rows: 14, placeholder: "## Heading\n\nYour post content here..." })}
          <div className="grid grid-cols-2 gap-4">
            {field("Published Date", "published_at", { type: "date" })}
            {field("Read Time (mins)", "read_time", { type: "number" })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field("Category", "category", { placeholder: "e.g. WordPress, AI" })}
            {field("Tags (comma-separated)", "tags", { placeholder: "WordPress, SEO, Performance" })}
          </div>
          {field("Cover Image URL", "cover_image", { placeholder: "https://images.unsplash.com/..." })}
          <div className="grid grid-cols-2 gap-4">
            {field("Author Name", "author_name")}
            {field("Author Role", "author_role")}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            <Label htmlFor="published" className="text-sm font-medium text-secondary cursor-pointer">Published (visible to visitors)</Label>
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />{error}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={save} disabled={saving || !form.title || !form.slug || !form.content} className="bg-primary hover:bg-primary/90 text-white rounded-xl gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : "Save Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin ───────────────────────────────────────────────────────────

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [tab, setTab] = useState<"posts" | "submissions">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [toast, setToast] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const res = await api("/blog-admin/posts", password);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, [password]);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    const res = await api("/blog-admin/submissions", password);
    const data = await res.json();
    setSubmissions(data.submissions || []);
    setLoading(false);
  }, [password]);

  useEffect(() => {
    if (!password) return;
    sessionStorage.setItem("admin_pw", password);
    if (tab === "posts") loadPosts();
    else loadSubmissions();
  }, [password, tab, loadPosts, loadSubmissions]);

  const deletePost = async (id: number) => {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(id);
    await api(`/blog-admin/posts/${id}`, password, { method: "DELETE" });
    setDeleting(null);
    showToast("Post deleted");
    loadPosts();
  };

  const logout = () => {
    sessionStorage.removeItem("admin_pw");
    setPassword("");
  };

  if (!password) {
    return <LoginScreen onLogin={(pw) => setPassword(pw)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex gap-1">
            {[
              { id: "posts", label: "Blog Posts", icon: FileText },
              { id: "submissions", label: "Enquiries", icon: Inbox },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-secondary hover:bg-muted"}`}
              >
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {tab === "posts" && (
              <Button onClick={() => setEditing("new")} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-4 text-sm gap-1.5">
                <Plus className="w-3.5 h-3.5" />New Post
              </Button>
            )}
            <Button variant="outline" onClick={logout} className="h-9 px-3 rounded-xl text-sm text-muted-foreground gap-1.5">
              <LogOut className="w-3.5 h-3.5" />Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />Loading…
          </div>
        ) : tab === "posts" ? (
          <div className="space-y-3">
            {posts.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No posts yet</p>
                <p className="text-sm mt-1">Click "New Post" to get started</p>
              </div>
            )}
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-border px-5 py-4 flex items-center justify-between gap-4 shadow-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? "bg-green-400" : "bg-amber-400"}`} />
                    <p className="font-semibold text-secondary truncate">{post.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {post.category} · {post.published_at?.slice(0, 10)} · {post.read_time} min read
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setEditing(post)} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                  >
                    {deleting === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <Inbox className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No enquiries yet</p>
                <p className="text-sm mt-1">Contact form submissions will appear here</p>
              </div>
            )}
            {submissions.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-bold text-secondary">{s.name}</p>
                    <p className="text-sm text-primary">{s.email}</p>
                    {s.company && <p className="text-xs text-muted-foreground mt-0.5">{s.company}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    {s.service && <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">{s.service}</span>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(s.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{s.message}</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <a href={`mailto:${s.email}?subject=Re: Your enquiry – Digital Growth Solutions Agency`} className="text-xs font-semibold text-primary hover:underline">Reply via email →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor modal */}
      {editing !== null && (
        <PostEditor
          post={editing === "new" ? null : editing as Post}
          password={password}
          onSave={() => {
            setEditing(null);
            showToast(editing === "new" ? "Post created!" : "Post updated!");
            loadPosts();
          }}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-secondary text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-green-400" />{toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
