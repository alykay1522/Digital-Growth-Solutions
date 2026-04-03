import { Router, type IRouter } from "express";
import { SubmitContactBody } from "@workspace/api-zod";
import { getDb } from "../lib/db";
import {
  sendOwnerNotification,
  sendClientAutoReply,
  contactOwnerHtml,
  contactClientHtml,
} from "../lib/email";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid form data",
      details: parsed.error.message,
    });
    return;
  }

  const { name, email, company, service, message } = parsed.data as {
    name: string;
    email: string;
    company?: string;
    service?: string;
    message: string;
  };

  req.log.info({ name, email }, "Contact form submission received");

  // 1. Store in DB
  try {
    const db = getDb();
    await db.query(
      `INSERT INTO contact_submissions (name, email, company, service, message)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, company || null, service || null, message]
    );
  } catch (dbErr) {
    req.log.error(dbErr, "Failed to store contact submission");
  }

  // 2. Notify owner + send auto-reply (fire-and-forget — don't block response)
  Promise.all([
    sendOwnerNotification({
      subject: `New enquiry from ${name}${service ? ` — ${service}` : ""}`,
      html: contactOwnerHtml({ name, email, company, service, message }),
    }),
    sendClientAutoReply({
      to: email,
      name,
      subject: "We received your message — NexaAgency",
      html: contactClientHtml(name),
    }),
  ]).catch((err) => req.log.error(err, "Email send failed"));

  res.json({
    success: true,
    message: `Thank you, ${name}! We've received your message and will get back to you at ${email} within 24 hours.`,
  });
});

export default router;
