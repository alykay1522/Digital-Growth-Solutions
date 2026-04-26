# Objective
Perform a production-scope security scan across the agency website, API server, DB layer, and shared integrations, prioritizing real exploitable issues over low-value hardening notes.

# Relevant information
- Production application: `artifacts/agency-website` + `artifacts/api-server`.
- Shared DB: `lib/db`.
- High-risk surfaces already identified:
  - Server-side URL fetch features: `/api/analyze`, `/api/clone`, `/api/sniff`, `/api/compare`, `/api/detect-stack`.
  - Payments and monetization: `/api/paypal/*`, `ToolPaywall`, `PayPalCheckout`, `/pay`, `/clone`, `/sniff`.
  - Admin surface: `/admin`, `/api/blog-admin/*`.
  - Content and outbound messaging: blog rendering, email templates, AI/chat/agent streaming.
- `artifacts/mockup-sandbox` is dev-only unless production reachability is shown.
- Existing vulnerability directories appear empty.

# Tasks

### T001: Validate URL-fetch attack surface
- **Blocked By**: []
- **Details**:
  - Review all server routes that fetch user-supplied URLs.
  - Confirm whether SSRF protections are missing, inconsistent, or bypassable.
  - Assess TLS validation choices and redirect handling where they materially increase exploitability.
  - Files: `artifacts/api-server/src/routes/analyze.ts`, `artifacts/api-server/src/routes/clone.ts`, `artifacts/api-server/src/routes/sniff.ts`, `artifacts/api-server/src/routes/compare.ts`, `artifacts/api-server/src/routes/detect-stack.ts`, `artifacts/api-server/src/utils/fetchUrl.ts`, `artifacts/api-server/src/lib/assertSafeUrl.ts`
  - Acceptance: Documented proof-quality conclusion on SSRF exposure and affected routes.

### T002: Validate admin, payment, and premium-access controls
- **Blocked By**: []
- **Details**:
  - Review `/admin`, `/api/blog-admin/*`, PayPal order creation/capture, and the premium tool gating model.
  - Confirm whether payment amounts and entitlements are enforced server-side.
  - Determine whether public users can access paid features without a completed payment.
  - Files: `artifacts/agency-website/src/pages/Admin.tsx`, `artifacts/api-server/src/routes/blog-admin.ts`, `artifacts/api-server/src/routes/paypal.ts`, `artifacts/agency-website/src/components/ToolPaywall.tsx`, `artifacts/agency-website/src/components/PayPalCheckout.tsx`, `artifacts/agency-website/src/pages/Pay.tsx`, `artifacts/api-server/src/routes/clone.ts`, `artifacts/api-server/src/routes/sniff.ts`
  - Acceptance: Confirmed findings or clear ruling-out of broken access control / payment logic issues.

### T003: Validate content, AI, logging, and outbound messaging surfaces
- **Blocked By**: []
- **Details**:
  - Review blog rendering, AI chat/agent routes, logging, and email templates for practical XSS, prompt-to-output abuse with security impact, sensitive data exposure, or staff-targeted content injection.
  - Files: `artifacts/agency-website/src/pages/BlogPost.tsx`, `artifacts/api-server/src/routes/blog.ts`, `artifacts/api-server/src/routes/chat.ts`, `artifacts/api-server/src/routes/agents.ts`, `artifacts/api-server/src/lib/email.ts`, `artifacts/api-server/src/lib/logger.ts`
  - Acceptance: High-confidence determination of whether any impactful disclosure or injection issue exists.
