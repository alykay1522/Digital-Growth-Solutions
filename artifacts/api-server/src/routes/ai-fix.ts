import { Router, type IRouter, type Request, type Response } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

interface SiteIssue {
  id: string;
  category: string;
  severity: "critical" | "warning" | "info" | "pass";
  title: string;
  description: string;
  fix: string;
  value?: string;
}

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2, pass: 3 };

function buildSystemPrompt(url: string): string {
  return `You are a senior web developer and SEO expert providing precise, actionable fixes for website issues found during a site audit.

The site being audited is: ${url}

Your job:
1. For each issue provided, give a SPECIFIC, copy-paste-ready fix — real code (HTML, CSS, JS, server config), not vague advice.
2. Use the exact format below for each issue. Do not skip any.
3. Keep explanations short — developers need code, not lectures.
4. Group related issues when it makes sense (e.g., multiple missing meta tags → one <head> block fix).

FORMAT FOR EACH ISSUE:
---
## [Issue Number]. [Issue Title] (\`[SEVERITY]\`)
**Why it matters:** [1 sentence]
**Fix:**
\`\`\`[language]
[exact code to add/change]
\`\`\`
**Where to apply:** [specific file/location, e.g., "in <head> of every page", "in nginx.conf", "in functions.php for WordPress"]

---

Use real code. Be specific. Prioritize fixes in the order given.`;
}

function buildUserPrompt(issues: SiteIssue[]): string {
  const lines = issues.map((issue, i) => {
    const parts = [
      `${i + 1}. **${issue.title}** [${issue.severity.toUpperCase()}]`,
      `   Category: ${issue.category}`,
      `   Problem: ${issue.description}`,
      `   Suggested fix: ${issue.fix}`,
    ];
    if (issue.value) parts.push(`   Current value: ${issue.value}`);
    return parts.join("\n");
  });

  return `Please generate precise, copy-paste-ready fixes for these ${issues.length} site issues:\n\n${lines.join("\n\n")}`;
}

router.post("/ai-fix", async (req: Request, res: Response) => {
  try {
    const { url, issues, priority } = req.body as {
      url: string;
      issues: SiteIssue[];
      priority?: "critical_first" | "user_selected";
    };

    if (!url || !Array.isArray(issues) || issues.length === 0) {
      res.status(400).json({ error: "url and issues are required" });
      return;
    }

    // Filter out passes, order by priority
    let fixableIssues = issues.filter((i) => i.severity !== "pass");
    if (priority === "critical_first") {
      fixableIssues = [...fixableIssues].sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      );
    }

    if (fixableIssues.length === 0) {
      res.status(400).json({ error: "No fixable issues selected" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: buildSystemPrompt(url) },
        { role: "user", content: buildUserPrompt(fixableIssues) },
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
    const msg = err?.message ?? "AI fix generation failed";
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    }
  }
});

export default router;
