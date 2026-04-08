import { Resend } from "resend";

let client: Resend | null = null;

function getResend(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

const OWNER = process.env.AGENCY_OWNER_EMAIL || "";
const FROM = "Digital Growth Solutions Agency <onboarding@resend.dev>";

export async function sendOwnerNotification(opts: {
  subject: string;
  html: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: OWNER,
    subject: opts.subject,
    html: opts.html,
  });
}

export async function sendClientAutoReply(opts: {
  to: string;
  name: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const resend = getResend();
  await resend.emails.send({
    from: FROM,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}

// ── Email templates ────────────────────────────────────────────────────────

export function contactOwnerHtml(data: {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#6c63ff;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">New Enquiry — Digital Growth Solutions Agency</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:600;width:120px;color:#6b7280">Name</td><td style="padding:8px 0">${data.name}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#6c63ff">${data.email}</a></td></tr>
      ${data.company ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Company</td><td style="padding:8px 0">${data.company}</td></tr>` : ""}
      ${data.service ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Service</td><td style="padding:8px 0">${data.service}</td></tr>` : ""}
    </table>
    <div style="margin-top:24px;padding:20px;background:#fff;border:1px solid #e5e7eb;border-radius:8px">
      <p style="margin:0;font-weight:600;color:#6b7280;font-size:13px;margin-bottom:8px">MESSAGE</p>
      <p style="margin:0;line-height:1.6">${data.message.replace(/\n/g, "<br>")}</p>
    </div>
    <p style="margin-top:24px;font-size:13px;color:#9ca3af">Submitted via digitalgrowthsolutionsagency.com contact form</p>
  </div>
</div>`;
}

export function contactClientHtml(name: string): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#6c63ff;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">We got your message!</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px">Hi <strong>${name}</strong>,</p>
    <p style="margin:0 0 16px;line-height:1.6">Thank you for reaching out to Digital Growth Solutions Agency. Your message has landed safely and one of our team will review it and get back to you <strong>within 24 hours</strong>.</p>
    <p style="margin:0 0 24px;line-height:1.6">If your matter is urgent — for example a site that's down or a broken checkout — please reply to this email and mark it URGENT and we'll prioritise accordingly.</p>
    <div style="background:#6c63ff;padding:20px 24px;border-radius:10px;margin-bottom:24px">
      <p style="color:#fff;margin:0;font-size:15px;font-weight:600">While you wait…</p>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;line-height:1.5">Run our free <a href="https://digitalgrowthsolutionsagency.com/audit" style="color:#ffd166;font-weight:600">Site Audit</a> to get an instant performance, SEO and security report — no signup needed.</p>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af">— The Digital Growth Solutions Agency Team</p>
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
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#10b981;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">💰 Payment Received — Digital Growth Solutions Agency</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center">
      <p style="margin:0;font-size:32px;font-weight:700;color:#10b981">$${data.amount}</p>
      <p style="margin:4px 0 0;color:#065f46;font-size:14px">${data.description}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:600;width:130px;color:#6b7280">PayPal Order</td><td style="padding:8px 0;font-size:13px;font-family:monospace">${data.orderId}</td></tr>
      ${data.payerName ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Payer Name</td><td style="padding:8px 0">${data.payerName}</td></tr>` : ""}
      ${data.payerEmail ? `<tr><td style="padding:8px 0;font-weight:600;color:#6b7280">Payer Email</td><td style="padding:8px 0">${data.payerEmail}</td></tr>` : ""}
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
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e">
  <div style="background:#10b981;padding:24px 32px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">Payment Confirmed ✓</h2>
  </div>
  <div style="background:#f9f9fc;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
    <p style="margin:0 0 16px">Hi <strong>${data.payerName}</strong>,</p>
    <p style="margin:0 0 16px;line-height:1.6">Your payment of <strong>$${data.amount}</strong> for <em>${data.description}</em> has been received. You'll also receive a separate confirmation email from PayPal.</p>
    <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <p style="margin:0;font-size:13px;color:#065f46"><strong>What happens next:</strong> A member of our team will be in touch within <strong>24 hours</strong> to kick things off. If you haven't heard from us within that window, please reply to this email.</p>
    </div>
    <p style="margin:0;font-size:12px;color:#9ca3af">Reference: ${data.orderId}</p>
    <p style="margin:8px 0 0;font-size:13px;color:#9ca3af">— The Digital Growth Solutions Agency Team</p>
  </div>
</div>`;
}
