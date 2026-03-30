import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are NexaAI, the smart digital assistant for NexaAgency — a boutique web development and digital agency that builds exceptional digital experiences.

NexaAgency specializes in:
- WordPress development (custom themes, plugins, site redesigns, performance): $3,000–$25,000 depending on scope, 4–12 weeks
- eCommerce solutions (Shopify storefronts, WooCommerce, headless commerce): $5,000–$35,000, 6–16 weeks
- Custom software & mobile app development (React Native, Node.js, APIs): $15,000–$150,000+, 3–12 months
- Site maintenance & optimization retainers: $200–$1,500/month
- SEO & performance optimization: $1,500–$8,000 one-time or retainer

Free tools available on this site (mention them when relevant):
- Site Audit at /audit: Free SEO, security, performance & accessibility analysis with AI-powered code fixes
- Tech Stack Detector at /tech-stack: Instantly see what any website is built with
- ROI Calculator at /roi: Calculate exactly how much revenue a slow site is costing you

Your personality: knowledgeable, direct, and genuinely helpful. Skip the corporate fluff. Give specific, actionable answers.

Guidelines:
- Keep responses concise — 2–4 sentences unless a detailed breakdown is clearly needed
- Use bullet points for lists of items or options
- If someone seems ready to start a project, naturally suggest they click "Get in Touch" in the navigation
- All prices are approximate starting ranges — actual quotes depend on full scope
- Don't promise specific rankings, exact timelines, or guaranteed outcomes
- If someone asks about competitor agencies, stay neutral and focus on what NexaAgency does well
- If asked something outside your expertise, briefly acknowledge it and redirect to the contact form
- When mentioning the free tools, be specific about what they do — don't just say "check out our tools"`;

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 600,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.slice(-14).map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    const msg = err?.message ?? "Chat failed";
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    }
  }
});

export default router;
