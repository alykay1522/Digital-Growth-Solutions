import { Resend } from "resend";

let client: Resend | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function escapeHtmlNl(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function getResend(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

const OWNER = process.env.AGENCY_OWNER_EMAIL || "alyshameade.1522@gmail.com";
const FROM = "Digital Growth Solutions Agency <onboarding@resend.dev>";
const REPLY_TO = "info@digitalgrowthsolutions.org";

export async function sendOwnerNotification(opts: {
  subject: string;
  html: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping owner notification");
    return;
  }
  const resend = getResend();
  const result = await resend.emails.send({
    from: FROM,
    to: OWNER,
    replyTo: REPLY_TO,
    subject: opts.subject,
    html: opts.html,
  });
  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
  console.info(`[email] Owner notification sent — id: ${result.data?.id}`);
}

export async function sendClientAutoReply(opts: {
  to: string;
  name: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = getResend();
  const result = await resend.emails.send({
    from: FROM,
    to: opts.to,
    replyTo: REPLY_TO,
    subject: opts.subject,
    html: opts.html,
  });
  if (result.error) {
    throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
  }
  console.info(`[email] Client auto-reply sent to ${opts.to} — id: ${result.data?.id}`);
}

// ── Email templates ────────────────────────────────────────────────────────

export function contactOwnerHtml(data: {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}): string {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeCompany = data.company ? escapeHtml(data.company) : "";
  const safeService = data.service ? escapeHtml(data.service) : "";
  const safeBudget = data.budget ? escapeHtml(data.budget) : "";
  const safeMessage = escapeHtmlNl(data.message);

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#6c63ff;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">📬 New Enquiry — Digital Growth Solutions Agency</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:600;width:120px;color:#6b7280">Name</td><td style="padding:8px 0">${safeName}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#6c63ff">${safeEmail}</a></td></tr>
      ${safeCompany ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Company</td><td style="padding:8px 0">${safeCompany}</td></tr>` : ""}
      ${safeService ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Service</td><td style="padding:8px 0">${safeService}</td></tr>` : ""}
      ${safeBudget ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Budget</td><td style="padding:8px 0">${safeBudget}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0;font-weight:600;color:#6b7280;font-size:13px;margin-bottom:8px">MESSAGE</p>
      <p style="margin:0;line-height:1.6">${safeMessage}</p>
    </div>
    <div style="margin-top:20px;text-align:center">
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#6c63ff;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Reply to ${safeName}</a>
    </div>
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">Submitted via digitalgrowthsolutionsagency.com contact form</p>
  </div>
</div>`;
}

export function contactClientHtml(name: string): string {
  const safeName = escapeHtml(name);
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#6c63ff;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">We got your message!</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px">Hi <strong>${safeName}</strong>,</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Digital Growth Solutions Agency. Your message has landed safely and one of our team will review it and get back to you <strong>within 24 hours</strong>.</p>
    <p style="margin:0 0 24px;line-height:1.6">If your matter is urgent — for example a site that's down or a broken checkout — please reply to this email marked URGENT and we'll prioritise accordingly.</p>
    <div style="background:#6c63ff;padding:20px 24px;border-radius:10px;margin-bottom:24px">
      <p style="color:#fff;margin:0;font-size:15px;font-weight:600">While you wait…</p>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;line-height:1.5">Run our free <a href="https://digitalgrowthsolutionsagency.com/audit" style="color:#ffd166;font-weight:600">Site Audit</a> to get an instant performance, SEO and security report — no signup needed.</p>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af">— The Digital Growth Solutions Agency Team</p>
  </div>
</div>`;
}

export function intakeOwnerHtml(data: {
  name: string;
  business: string;
  email: string;
  projectType: string;
  description: string;
  goals: string;
  deadline: string;
  budget: string;
  competitors: string;
  brandStyle: string;
}): string {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:8px 0;font-weight:600;width:160px;color:#6b7280;vertical-align:top">${label}</td><td style="padding:8px 0">${value}</td></tr>` : "";

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeBusiness = escapeHtml(data.business);
  const safeProjectType = escapeHtml(data.projectType);
  const safeDeadline = escapeHtml(data.deadline);
  const safeBudget = escapeHtml(data.budget);
  const safeCompetitors = escapeHtml(data.competitors);
  const safeBrandStyle = escapeHtml(data.brandStyle);
  const safeDescription = escapeHtmlNl(data.description);
  const safeGoals = data.goals ? escapeHtmlNl(data.goals) : "";

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#6c63ff;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">📋 New Project Brief — Intake Agent</h2>
    <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px">A visitor just completed the AI Intake form</p>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", safeName)}
      ${row("Email", safeEmail ? `<a href="mailto:${safeEmail}" style="color:#6c63ff">${safeEmail}</a>` : "")}
      ${row("Business", safeBusiness)}
      ${row("Project Type", safeProjectType)}
      ${row("Deadline", safeDeadline)}
      ${row("Budget", safeBudget)}
      ${row("Competitor Sites", safeCompetitors)}
      ${row("Brand Style", safeBrandStyle)}
    </table>
    <div style="margin-top:24px;padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0;font-weight:600;color:#6b7280;font-size:13px;margin-bottom:8px">PROJECT DESCRIPTION</p>
      <p style="margin:0;line-height:1.6">${safeDescription}</p>
    </div>
    ${safeGoals ? `
    <div style="margin-top:16px;padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0;font-weight:600;color:#6b7280;font-size:13px;margin-bottom:8px">GOALS</p>
      <p style="margin:0;line-height:1.6">${safeGoals}</p>
    </div>` : ""}
    ${safeEmail ? `
    <div style="margin-top:20px;text-align:center">
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#6c63ff;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Reply to ${safeName || "Client"}</a>
    </div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">Submitted via digitalgrowthsolutionsagency.com AI Intake Agent</p>
  </div>
</div>`;
}

export function quoteOwnerHtml(data: {
  name: string;
  business: string;
  email: string;
  projectType: string;
  budget: string;
  description: string;
  timeline: string;
}): string {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:8px 0;font-weight:600;width:140px;color:#6b7280">${label}</td><td style="padding:8px 0">${value}</td></tr>` : "";

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeBusiness = escapeHtml(data.business);
  const safeProjectType = escapeHtml(data.projectType);
  const safeBudget = escapeHtml(data.budget);
  const safeTimeline = escapeHtml(data.timeline);
  const safeDescription = data.description ? escapeHtmlNl(data.description) : "";

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#f59e0b;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">💬 New Quote Request — AI Quote Agent</h2>
    <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">A visitor just used the AI Quote Generator</p>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse">
      ${row("Name", safeName)}
      ${row("Email", safeEmail ? `<a href="mailto:${safeEmail}" style="color:#6c63ff">${safeEmail}</a>` : "")}
      ${row("Business", safeBusiness)}
      ${row("Project Type", safeProjectType)}
      ${row("Budget Range", safeBudget)}
      ${row("Timeline", safeTimeline)}
    </table>
    ${safeDescription ? `
    <div style="margin-top:24px;padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0;font-weight:600;color:#6b7280;font-size:13px;margin-bottom:8px">PROJECT DETAILS</p>
      <p style="margin:0;line-height:1.6">${safeDescription}</p>
    </div>` : ""}
    ${safeEmail ? `
    <div style="margin-top:20px;text-align:center">
      <a href="mailto:${safeEmail}" style="display:inline-block;background:#f59e0b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Follow up with ${safeName || "Client"}</a>
    </div>` : ""}
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">Submitted via digitalgrowthsolutionsagency.com AI Quote Agent</p>
  </div>
</div>`;
}

export function paymentOwnerHtml(data: {
  orderId: string;
  amount: string;
  description: string;
  payerName?: string;
  payerEmail?: string;
}): string {
  const safeOrderId = escapeHtml(data.orderId);
  const safeAmount = escapeHtml(data.amount);
  const safeDescription = escapeHtml(data.description);
  const safePayerName = data.payerName ? escapeHtml(data.payerName) : "";
  const safePayerEmail = data.payerEmail ? escapeHtml(data.payerEmail) : "";

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#10b981;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">💰 Payment Received — Digital Growth Solutions Agency</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center">
      <p style="margin:0;font-size:32px;font-weight:700;color:#10b981">$${safeAmount}</p>
      <p style="margin:4px 0 0;color:#065f46;font-size:14px">${safeDescription}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:600;width:130px;color:#6b7280">PayPal Order</td><td style="padding:8px 0;font-size:13px;font-family:monospace">${safeOrderId}</td></tr>
      ${safePayerName ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Payer Name</td><td style="padding:8px 0">${safePayerName}</td></tr>` : ""}
      ${safePayerEmail ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Payer Email</td><td style="padding:8px 0">${safePayerEmail}</td></tr>` : ""}
    </table>
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">Check your PayPal dashboard for full transaction details. Time to deliver!</p>
  </div>
</div>`;
}

export function paymentClientHtml(data: {
  payerName: string;
  amount: string;
  description: string;
  orderId: string;
}): string {
  const safePayerName = escapeHtml(data.payerName);
  const safeAmount = escapeHtml(data.amount);
  const safeDescription = escapeHtml(data.description);
  const safeOrderId = escapeHtml(data.orderId);

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#10b981;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">Payment Confirmed ✓</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px">Hi <strong>${safePayerName}</strong>,</p>
    <p style="margin:0 0 16px;line-height:1.6">Your payment of <strong>$${safeAmount}</strong> for <em>${safeDescription}</em> has been received. You'll also receive a separate confirmation email from PayPal.</p>
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#065f46"><strong>What happens next:</strong> A member of our team will be in touch within <strong>24 hours</strong> to kick things off. If you haven't heard from us within that window, please reply to this email.</p>
    </div>
    <p style="margin:0;font-size:12px;color:#9ca3af">Reference: ${safeOrderId}</p>
    <p style="margin:8px 0 0;font-size:13px;color:#9ca3af">— The Digital Growth Solutions Agency Team</p>
  </div>
</div>`;
}
