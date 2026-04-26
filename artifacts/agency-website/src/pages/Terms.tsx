import React from "react";
import { useMeta } from "@/hooks/useMeta";

export default function Terms() {
  useMeta({
    title: "Terms of Service — Digital Growth Solutions Agency",
    description: "Terms and conditions governing use of Digital Growth Solutions Agency services.",
  });

  const updated = "19 April 2026";
  const email = "info@digitalgrowthsolutions.org";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-28">
        <h1 className="text-4xl font-display font-bold text-secondary mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {updated}</p>

        <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-8">

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">1. Agreement</h2>
            <p>
              By accessing or using this website or purchasing any service from Digital Growth Solutions Agency ("Agency", "we", "us"), you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">2. Services</h2>
            <p>
              We provide digital agency services including but not limited to: website design and development (WordPress, Shopify, custom), AI automation, eCommerce solutions, and digital tools. The specific deliverables, timeline, and price for each engagement are confirmed in writing before work begins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">3. Payments</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are displayed in USD and are inclusive of any stated taxes.</li>
              <li>Fixed-price packages are payable in advance via PayPal.</li>
              <li>Work begins only after cleared payment is received.</li>
              <li>Premium tool access fees (e.g. Product Sniffer, Site Cloner) are non-refundable once access is granted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">4. Satisfaction guarantee</h2>
            <p>
              For custom project packages, if you are not satisfied with the initial delivery, you may request revisions within 7 days of delivery at no additional charge. After 7 days, or after revisions are accepted, no refunds will be issued. This guarantee does not apply to premium tool purchases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">5. Intellectual property</h2>
            <p>
              Upon full payment, you own the final deliverables produced specifically for your project. We retain the right to showcase completed work in our portfolio unless you request otherwise in writing. All tools, frameworks, and third-party libraries used remain subject to their own licenses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">6. Acceptable use</h2>
            <p>You agree not to use our services or tools to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Violate any applicable laws or regulations.</li>
              <li>Infringe the intellectual property rights of others.</li>
              <li>Scrape, clone, or extract data from websites in violation of their terms of service.</li>
              <li>Transmit spam or any unsolicited communications.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">7. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, our aggregate liability to you for any claim arising out of or in connection with our services is limited to the amount you paid us in the 30 days preceding the claim. We are not liable for indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">8. Warranties disclaimer</h2>
            <p>
              Services are provided "as is" without warranty of any kind beyond those expressly stated in these terms. We do not guarantee specific business outcomes, search engine rankings, or conversion rates from any work delivered.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">9. Governing law</h2>
            <p>
              These terms are governed by applicable law. Any disputes will be resolved by binding arbitration or, if arbitration is unavailable, by the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">10. Changes</h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-display font-bold text-secondary mb-3">11. Contact</h2>
            <p>
              Questions about these terms? Email us at{" "}
              <a href={`mailto:${email}`} className="text-primary hover:underline">{email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
