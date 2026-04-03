import { Router, Request, Response } from "express";
import { getDb } from "../lib/db";

const router = Router();

// GET /blog/posts — list published posts
router.get("/blog/posts", async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const { rows } = await db.query(
      `SELECT id, slug, title, excerpt, published_at, read_time, category,
              cover_image, author_name, author_role, tags
       FROM blog_posts
       WHERE published = true
       ORDER BY published_at DESC`
    );
    return res.json({ posts: rows });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /blog/posts/:slug — single post
router.get("/blog/posts/:slug", async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { rows } = await db.query(
      `SELECT * FROM blog_posts WHERE slug = $1 AND published = true`,
      [req.params.slug]
    );
    if (!rows.length) return res.status(404).json({ error: "Post not found" });
    return res.json({ post: rows[0] });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
