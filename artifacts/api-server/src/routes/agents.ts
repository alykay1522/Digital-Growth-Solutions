import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { heavyLimiter } from "../middlewares/rateLimits";
import { sendOwnerNotification, intakeOwnerHtml, quoteOwnerHtml } from "../lib/email";

const router: IRouter = Router();

// ─── Shared SSE streaming helper ─────────────────────────────────────────────
async function streamAgent(
  res: Response,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1200
) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const stream = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
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
}

function handleStreamError(err: any, res: Response) {
  const msg = err?.message ?? "Agent failed";
  if (!res.headersSent) {
    res.status(500).json({ error: msg });
  } else {
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
}

// ─── 1. AI Website Audit Agent ────────────────────────────────────────────────
const AUDIT_SYSTEM = `You are an expert website auditor for Digital Growth Solutions Agency. 
You analyse websites and give a thorough, actionable audit report.

Format your response with these sections using markdown headers (##):
## 🎯 Overall Score
Give a score out of 100 and a one-line verdict.

## 🔴 Critical Issues  
List the most urgent problems that are costing them traffic or revenue. Use bullet points. Be specific.

## 🟡 Warnings
Important improvements that should be addressed soon.

## ✅ What's Working
Acknowledge 2–3 genuine positives if any.

## 🚀 Top 5 Quick Wins
The 5 things they should fix first, in priority order, each with estimated impact.

## 💡 AI-Powered Recommendation
Suggest which Digital Growth Solutions Agency service would help most (Website Rescue, new site, SEO package, etc.) and why.

Be honest, specific, and actionable. Small business owners don't want vague advice — they want to know exactly what to fix.`;

router.post("/audit", heavyLimiter, async (req: Request, res: Response) => {
  try {
    const { url, context } = req.body as { url?: string; context?: string };
    if (!url) { res.status(400).json({ error: "URL required" }); return; }

    const userMessage = `Please audit this website: ${url}
${context ? `Additional context from the owner: ${context}` : ""}

Analyse the URL and provide a complete website audit covering SEO, performance, design, mobile experience, conversion optimisation, and content quality.`;

    await streamAgent(res, AUDIT_SYSTEM, userMessage, 1400);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 2. AI Quote Generator ────────────────────────────────────────────────────
const QUOTE_SYSTEM = `You are a professional web project estimator at Digital Growth Solutions Agency.
Our pricing:
- Starter Site: $495 (3 pages, template, 5 days)
- Business Site: $1,295 (5–7 pages, custom WordPress, SEO)
- eCommerce: $1,995 (Shopify/WooCommerce, 50 products, payment gateway)
- AI Automation: $795 (CRM, chatbot, lead follow-up, booking)
- Pro/Custom: from $3,499 (web apps, complex integrations)
- Care Plans: Basic $49/mo, Pro $99/mo, Elite $149/mo

Format your response with these sections:
## 📋 Project Summary
Summarise what they need in 2–3 sentences.

## 💰 Recommended Package
Name the best-fit package, explain why, and state the price clearly.

## 📦 What's Included
Bullet list of exactly what they get.

## ⚡ Optional Add-ons
2–4 relevant upgrades with prices (e.g., AI Automation $795, Care Plan $49/mo, etc.)

## 📅 Timeline
Realistic delivery timeline.

## 🎯 Total Investment
Show the recommended package price + any add-ons they asked about. Be transparent.

## ✅ Next Steps
Tell them to book a free strategy call at /contact or pay online at /pay.

Be friendly, transparent, and specific. No vague estimates.`;

router.post("/quote", async (req: Request, res: Response) => {
  try {
    const { name, email, projectType, pages, features, budget, timeline, businessType, notes } = req.body as Record<string, string>;
    if (!projectType) { res.status(400).json({ error: "projectType required" }); return; }

    // Fire-and-forget owner notification
    if (projectType) {
      sendOwnerNotification({
        subject: `💬 New Quote Request — ${projectType}${businessType ? ` (${businessType})` : ""}`,
        html: quoteOwnerHtml({
          name: name || "Anonymous",
          business: businessType || "Not provided",
          email: email || "",
          projectType,
          budget: budget || "Not specified",
          description: [features && `Features: ${features}`, notes && `Notes: ${notes}`].filter(Boolean).join("\n") || "Not provided",
          timeline: timeline || "No preference",
        }),
      }).catch((err) => console.error("[email] Quote notification failed:", err));
    }

    const userMessage = `Generate a project quote for this client:
- Project type: ${projectType}
- Business type: ${businessType || "Not specified"}
- Number of pages needed: ${pages || "Not specified"}
- Key features needed: ${features || "Not specified"}
- Budget range: ${budget || "Not specified"}
- Timeline: ${timeline || "No preference"}
- Additional notes: ${notes || "None"}`;

    await streamAgent(res, QUOTE_SYSTEM, userMessage, 1000);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 3. AI Support / FAQ Agent ────────────────────────────────────────────────
const SUPPORT_SYSTEM = `You are a helpful support agent for Digital Growth Solutions Agency.

Our services and pricing:
- Starter Site: $495 — 3 pages, template-based, 5-day turnaround
- Business Site: $1,295 — 5–7 pages, custom WordPress, SEO included
- eCommerce: $1,995 — Shopify or WooCommerce, payment gateway, email automation
- AI Automation: $795 — CRM, chatbot, lead follow-up, booking automation
- Pro/Custom: from $3,499 — fully custom builds
- Monthly Care Plans: Basic $49/mo, Pro $99/mo, Elite $149/mo
- Website Rescue fixes: $97–$497 depending on issue

Free tools: /audit (site audit), /tech-stack (stack detector), /roi (ROI calculator)
Paid tools ($9.99/24hr): /sniff (product sniffer), /clone (site cloner)

Contact: info@digitalgrowthsolutions.org | /contact page for strategy calls

Guidelines:
- Answer questions clearly and directly — no jargon
- For complex questions, suggest booking a strategy call
- Be warm and helpful, like a knowledgeable team member
- If unsure, say so and offer to connect them with the team
- Keep responses concise unless a detailed answer is needed`;

router.post("/support", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: { role: "user" | "assistant"; content: string }[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array required" }); return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 600,
      messages: [
        { role: "system", content: SUPPORT_SYSTEM },
        ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) { handleStreamError(err, res); }
});

// ─── 4. AI Intake & Onboarding Agent ─────────────────────────────────────────
const INTAKE_SYSTEM = `You are an onboarding specialist for Digital Growth Solutions Agency.
Your job is to process a new client intake form and create a professional project brief.

Format your response with these sections:
## 👋 Welcome Brief
Greet them by name/business and summarise their project in 1–2 sentences.

## 🎯 Project Goals
List their stated goals and any implied goals you identified.

## 📋 Recommended Approach
Which package fits best and why. Be specific about technology choices (WordPress vs Shopify, etc.)

## 🗓️ Proposed Timeline
Week-by-week breakdown from kickoff to launch.

## ✅ Next Steps for You (the client)
3–5 things they need to prepare (logo, brand colours, content, domain, etc.)

## 📎 Information We'll Need
List any missing information we'll need before starting.

## 💰 Investment Summary
Recommended package + any add-ons, with total price.

Be warm, professional, and make them feel confident they're in good hands.`;

router.post("/intake", async (req: Request, res: Response) => {
  try {
    const { name, business, email, projectType, description, goals, deadline, budget, competitors, brandStyle } = req.body as Record<string, string>;
    if (!description) { res.status(400).json({ error: "description required" }); return; }

    // Fire-and-forget owner notification with full project brief
    sendOwnerNotification({
      subject: `📋 New Project Brief${name ? ` from ${name}` : ""}${projectType ? ` — ${projectType}` : ""}`,
      html: intakeOwnerHtml({
        name: name || "Anonymous",
        business: business || "Not provided",
        email: email || "",
        projectType: projectType || "Not specified",
        description,
        goals: goals || "",
        deadline: deadline || "Flexible",
        budget: budget || "Not specified",
        competitors: competitors || "",
        brandStyle: brandStyle || "",
      }),
    }).catch((err) => console.error("[email] Intake notification failed:", err));

    const userMessage = `Process this new client intake:
- Name: ${name || "Not provided"}
- Business: ${business || "Not provided"}
- Email: ${email || "Not provided"}
- Project type: ${projectType || "Not specified"}
- Project description: ${description}
- Goals: ${goals || "Not specified"}
- Deadline: ${deadline || "Flexible"}
- Budget: ${budget || "Not specified"}
- Competitor examples: ${competitors || "None provided"}
- Brand style preference: ${brandStyle || "Not specified"}`;

    await streamAgent(res, INTAKE_SYSTEM, userMessage, 1200);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 5. AI SEO Agent ──────────────────────────────────────────────────────────
const SEO_SYSTEM = `You are an expert SEO consultant for Digital Growth Solutions Agency.
You analyse websites and create actionable SEO improvement plans for small businesses.

Format your response with these sections:
## 🔍 SEO Overview
Brief assessment of their current SEO situation.

## 🏆 Target Keywords
Suggest 8–12 realistic target keywords for their niche. Include a mix of:
- Short-tail (high volume, hard to rank)
- Long-tail (lower volume, easier wins)
- Local keywords if applicable

## 📄 On-Page Issues
Specific on-page problems to fix: title tags, meta descriptions, headings, content gaps.

## 🔗 Link Building Opportunities
3–5 practical link-building tactics for a small business.

## 📝 Content Strategy
3–5 blog post or page ideas that could drive organic traffic.

## ⚡ Local SEO (if applicable)
Google Business Profile tips, local citation building, NAP consistency.

## 📊 30-Day Action Plan
Prioritised list of SEO tasks for the next 30 days.

## 💡 Agency Recommendation
Which DGS service would accelerate their SEO results.

Be specific, practical, and focused on quick wins for small businesses.`;

router.post("/seo", heavyLimiter, async (req: Request, res: Response) => {
  try {
    const { url, businessType, location, competitors } = req.body as Record<string, string>;
    if (!url) { res.status(400).json({ error: "URL required" }); return; }

    const userMessage = `Create a comprehensive SEO strategy for:
- Website: ${url}
- Business type: ${businessType || "Not specified"}
- Location/market: ${location || "Not specified"}
- Known competitors: ${competitors || "Not specified"}`;

    await streamAgent(res, SEO_SYSTEM, userMessage, 1400);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 6. AI Content Generator ─────────────────────────────────────────────────
const CONTENT_SYSTEM = `You are a professional copywriter for Digital Growth Solutions Agency, specialising in small business websites.
You write conversion-focused, SEO-optimised content that sounds human and trustworthy.

When generating website content, follow these rules:
- Write for the target audience, not the business owner
- Use clear, plain language — no jargon
- Include the primary keyword naturally in headings
- Write headlines that address a benefit or solve a problem
- Keep paragraphs short (2–4 sentences)
- Use active voice
- Include a clear call to action in every section

Format your response clearly with section headers and the actual copy ready to use.`;

router.post("/content", async (req: Request, res: Response) => {
  try {
    const { contentType, businessName, businessType, location, targetAudience, keywords, tone, notes } = req.body as Record<string, string>;
    if (!contentType || !businessType) {
      res.status(400).json({ error: "contentType and businessType required" }); return;
    }

    const userMessage = `Generate ${contentType} for:
- Business name: ${businessName || "Not specified"}
- Business type: ${businessType}
- Location: ${location || "Not specified"}
- Target audience: ${targetAudience || "General public"}
- Primary keywords: ${keywords || "Not specified"}
- Tone/style: ${tone || "Professional but friendly"}
- Special notes: ${notes || "None"}

Generate complete, ready-to-use copy. Make it compelling and conversion-focused.`;

    await streamAgent(res, CONTENT_SYSTEM, userMessage, 1600);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 7. AI Care Plan Agent ────────────────────────────────────────────────────
const CARE_PLAN_SYSTEM = `You are a website maintenance advisor for Digital Growth Solutions Agency.
You help website owners understand what level of ongoing maintenance and support they need.

Our Care Plans:
- Basic $49/mo: Monthly WordPress/plugin updates, daily backups, uptime monitoring, 1hr support/mo
- Pro $99/mo: Weekly updates, daily backups, security scanning, performance reports, 3hr support/mo, priority response
- Elite $149/mo: On-demand updates, real-time backups, malware removal, SEO monitoring, unlimited support, dedicated manager

Format your response:
## 🎯 Your Recommended Plan
State which plan and explain why it's the right fit.

## 📋 What You're Getting
List the specific features most relevant to their situation.

## ⚠️ Without a Care Plan
Honestly describe the risks they face without maintenance (site down, hacked, slow, Google penalties).

## 💰 Cost vs. Risk Analysis
Frame the monthly cost against the potential cost of problems (lost sales, emergency fix fees, etc.)

## 🆙 When to Upgrade
When they should consider moving to the next tier.

## ✅ Sign Up
Direct them to /pay to set up their plan or /contact for questions.

Be honest and helpful — don't oversell. Match them to the right plan for their actual needs.`;

router.post("/care-plan", async (req: Request, res: Response) => {
  try {
    const { siteType, traffic, budget, lastUpdated, techLevel, concerns } = req.body as Record<string, string>;
    if (!siteType) { res.status(400).json({ error: "siteType required" }); return; }

    const userMessage = `Recommend a care plan for this website owner:
- Site type: ${siteType}
- Monthly traffic: ${traffic || "Unknown"}
- Monthly budget available: ${budget || "Not specified"}
- When was the site last updated/maintained: ${lastUpdated || "Unknown"}
- Owner's technical level: ${techLevel || "Non-technical"}
- Main concerns: ${concerns || "General maintenance"}`;

    await streamAgent(res, CARE_PLAN_SYSTEM, userMessage, 900);
  } catch (err) { handleStreamError(err, res); }
});

// ─── 8. AI Website Rescue Agent ───────────────────────────────────────────────
const RESCUE_SYSTEM = `You are an emergency website repair specialist at Digital Growth Solutions Agency.
You diagnose website problems and tell owners exactly what's wrong and how to fix it.

Format your response:
## 🚨 Diagnosis
What's most likely causing the issue based on their description.

## 🔍 Root Cause Analysis
Explain WHY this happens (in plain English, no jargon).

## 🛠️ DIY First Steps
2–3 things they can try themselves right now (safe, non-destructive steps only).

## ⚡ Professional Fix
Describe what a professional repair involves and our pricing:
- Site down/white screen: $97–$297 (24hr turnaround)
- Checkout/payment issues: $147–$397 (24hr)
- Malware/hack: $197–$497 (48hr)
- Plugin/theme conflict: $97–$247 (24hr)
- Speed issues: $197–$497 (48hr)
- Broken features: $97–$297 (24hr)
- Mobile issues: $147–$347 (48hr)

## ⏱️ Urgency Assessment
How urgent is this on a scale of: Low / Medium / High / Critical — and why.

## ✅ Get Help Now
Tell them to go to /contact with "RESCUE REQUEST" in the subject for priority handling.

Be calm, reassuring, and actionable. They're stressed — your job is to make them feel like it's going to be okay.`;

router.post("/rescue", async (req: Request, res: Response) => {
  try {
    const { problem, platform, symptoms, lastWorked, recentChanges } = req.body as Record<string, string>;
    if (!problem) { res.status(400).json({ error: "problem description required" }); return; }

    const userMessage = `Emergency website diagnosis request:
- Problem description: ${problem}
- Platform/CMS: ${platform || "Unknown"}
- Symptoms: ${symptoms || "Not specified"}
- When did it last work: ${lastWorked || "Unknown"}
- Recent changes made: ${recentChanges || "None known"}

Please diagnose the issue and tell them what to do.`;

    await streamAgent(res, RESCUE_SYSTEM, userMessage, 1000);
  } catch (err) { handleStreamError(err, res); }
});

export default router;
