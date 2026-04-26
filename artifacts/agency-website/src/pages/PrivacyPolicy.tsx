import React from "react";
import { useMeta } from "@/hooks/useMeta";

export default function PrivacyPolicy() {
  useMeta({
    title: "Privacy Policy — Digital Growth Solutions Agency",
    description: "How Digital Growth Solutions Agency collects, uses, and protects your personal information.",
  });

  const updated = "19 April 2026";
  const email = "info@digitalgrowthsolutions.org";
  const site = "digitalgrowthsolutions.org";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-28">
        <h1 className="text-4xl font-display font-bold text-secondary mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>

        <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-8">

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">1. Who we are</h2>
            <p>
              Digital Growth Solutions Agency ("we", "us", "our") operates the website{" "}
              <a href={`https://${site}`} className="text-primary hover:underline">{site}</a>. This policy explains how we collect and process personal data when you visit our site or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">2. What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact form data</strong> — name, email address, company name, and any message you send us.</li>
              <li><strong>Usage data</strong> — pages visited, time on site, browser/device type (via analytics tools if configured).</li>
              <li><strong>Payment data</strong> — handled entirely by PayPal. We do not store your card details.</li>
              <li><strong>Cookies</strong> — session cookies for site functionality and, if accepted, analytics cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">3. How we use your data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To respond to your enquiries and project requests.</li>
              <li>To deliver services you have paid for.</li>
              <li>To send transactional emails (e.g. payment confirmations, project updates).</li>
              <li>To analyse and improve our website performance (analytics only if you consent).</li>
            </ul>
            <p className="mt-3">We never sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">4. Legal basis for processing</h2>
            <p>
              We process your data on the basis of: (a) your consent when you submit a form or accept cookies; (b) the performance of a contract when delivering services you have purchased; and (c) our legitimate interests in operating and improving our business.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">5. Data retention</h2>
            <p>
              We retain contact form submissions for up to 24 months. Payment records are retained for as long as required by applicable law. Analytics data is retained in accordance with the relevant platform's data retention settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">6. Third-party services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>PayPal</strong> — processes payments securely. Subject to PayPal's own privacy policy.</li>
              <li><strong>Resend</strong> — transactional email delivery. Emails are not stored beyond delivery.</li>
              <li><strong>Google Analytics</strong> — website usage analytics (only active if you consent to cookies).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">7. Your rights</h2>
            <p>Under applicable data protection law you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data ("right to be forgotten").</li>
              <li>Withdraw consent at any time (for consent-based processing).</li>
              <li>Lodge a complaint with a supervisory authority.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">8. Cookies</h2>
            <p>
              We use strictly necessary cookies for site functionality. With your consent, we also use analytics cookies to understand how visitors use the site. You can withdraw consent at any time by clearing your browser cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">9. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The "last updated" date at the top of this page reflects the most recent revision. Continued use of our site after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">10. Contact</h2>
            <p>
              Questions about this policy? Email us at{" "}
              <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
