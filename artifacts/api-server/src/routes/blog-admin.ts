import { Router, Request, Response } from "express";
import { getDb } from "../lib/db";

const router = Router();

function checkAdminAuth(req: Request, res: Response): boolean {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) {
    res.status(503).json({ error: "Admin not configured" });
    return false;
  }
  const auth = req.headers["x-admin-password"];
  if (auth !== pass) {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
  return true;
}

// GET /blog-admin/posts
router.get("/blog-admin/posts", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  try {
    const db = getDb();
    const { rows } = await db.query(
      "SELECT id, slug, title, category, published, published_at, read_time FROM blog_posts ORDER BY published_at DESC"
    );
    return res.json({ posts: rows });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /blog-admin/posts/:id
router.get("/blog-admin/posts/:id", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  try {
    const db = getDb();
    const { rows } = await db.query("SELECT * FROM blog_posts WHERE id = $1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ post: rows[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /blog-admin/posts
router.post("/blog-admin/posts", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  const {
    slug, title, excerpt, content, published_at, read_time,
    category, cover_image, author_name, author_role, tags, published,
  } = req.body;
  if (!slug || !title || !content) {
    return res.status(400).json({ error: "slug, title, and content are required" });
  }
  try {
    const db = getDb();
    const { rows } = await db.query(
      `INSERT INTO blog_posts
         (slug,title,excerpt,content,published_at,read_time,category,cover_image,author_name,author_role,tags,published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [slug, title, excerpt || "", content, published_at || new Date().toISOString().slice(0, 10),
       read_time || 5, category || "General", cover_image || "",
       author_name || "Digital Growth Solutions Agency Team", author_role || "Agency",
       tags || [], published !== false]
    );
    return res.status(201).json({ post: rows[0] });
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "A post with this slug already exists" });
    return res.status(500).json({ error: err.message });
  }
});

// PUT /blog-admin/posts/:id
router.put("/blog-admin/posts/:id", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  const {
    slug, title, excerpt, content, published_at, read_time,
    category, cover_image, author_name, author_role, tags, published,
  } = req.body;
  try {
    const db = getDb();
    const { rows } = await db.query(
      `UPDATE blog_posts SET
         slug=$1,title=$2,excerpt=$3,content=$4,published_at=$5,read_time=$6,
         category=$7,cover_image=$8,author_name=$9,author_role=$10,tags=$11,
         published=$12,updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [slug, title, excerpt, content, published_at, read_time,
       category, cover_image, author_name, author_role, tags, published, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    return res.json({ post: rows[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /blog-admin/posts/:id
router.delete("/blog-admin/posts/:id", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  try {
    const db = getDb();
    await db.query("DELETE FROM blog_posts WHERE id = $1", [req.params.id]);
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /blog-admin/submissions — view contact form submissions
router.get("/blog-admin/submissions", async (req: Request, res: Response) => {
  if (!checkAdminAuth(req, res)) return;
  try {
    const db = getDb();
    const { rows } = await db.query(
      "SELECT * FROM contact_submissions ORDER BY submitted_at DESC LIMIT 100"
    );
    return res.json({ submissions: rows });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
