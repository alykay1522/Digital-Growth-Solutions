# Threat Model

## Project Overview

This project is a pnpm monorepo for a digital agency website. The production application consists of a React + Vite frontend in `artifacts/agency-website` and an Express 5 API in `artifacts/api-server`, with PostgreSQL/Drizzle in `lib/db`, OpenAI-backed streaming routes, PayPal payments, and Resend email notifications.

Primary users are public website visitors, prospective customers using contact/intake/quote tools, and a small internal admin user accessing `/admin` and `/api/blog-admin/*`. Production scope includes the agency website, API server, shared database layer, and integration packages used by those services. `artifacts/mockup-sandbox` is treated as dev-only and out of scope unless production reachability is demonstrated.

Assumptions for production scans:
- `NODE_ENV` is `production`.
- Replit-managed TLS protects browser-to-server traffic.
- The mockup sandbox is not deployed to production.

## Assets

- **Admin capability** — the shared admin secret used to access `/admin` and `/api/blog-admin/*`, plus the ability to read enquiries and modify blog content.
- **Customer and lead data** — names, email addresses, company names, services requested, project details, and messages submitted through `/api/contact` and AI intake/quote flows.
- **Payment integrity** — correct pricing, package selection, and proof of payment for paid tools and service purchases handled through PayPal routes.
- **Application secrets** — `DATABASE_URL`, `ADMIN_PASSWORD`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `RESEND_API_KEY`, and any OpenAI integration credentials.
- **Outbound network trust** — the server fetches attacker-controlled URLs for analysis, cloning, comparison, sniffing, and stack detection. Those fetch paths can reach sensitive internal resources if not constrained.
- **Outbound email trust** — public workflows can trigger branded emails to the owner and to user-supplied recipient addresses through Resend. Those messages must not become an attacker-controlled phishing channel.
- **Brand and business operations** — published blog content, contact workflows, premium tool access, and outbound email notifications.

## Trust Boundaries

- **Browser → API** — all client input is untrusted, including URLs, chat content, blog admin actions, contact submissions, and payment selections.
- **API → Database** — the API can read and write lead and blog data. Query construction, access control, and error handling must prevent disclosure or tampering.
- **API → External websites** — `/api/analyze`, `/api/clone`, `/api/sniff`, `/api/compare`, and `/api/detect-stack` fetch user-supplied targets. This is the highest-risk SSRF boundary.
- **API → Third-party services** — PayPal, Resend, and OpenAI are trusted only through authenticated server-side calls. Secrets must never cross into client code or logs.
- **Public → Email workflows** — `/api/contact`, `/api/agents/intake`, and `/api/agents/quote` can all trigger branded outbound emails and must treat message content and recipient-facing HTML as hostile input.
- **Public → Admin** — `/admin` and `/api/blog-admin/*` must be enforced server-side; frontend state is not authoritative.
- **Free → Paid features** — premium tools such as `/clone` and `/sniff` must not rely on client-only gating for payment enforcement.
- **Production → Dev-only** — `artifacts/mockup-sandbox` and similar experimentation areas should be ignored unless production routing or deployment evidence exists.

## Scan Anchors

- **Production entry points:** `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, `artifacts/agency-website/src/main.tsx`, `artifacts/agency-website/src/App.tsx`.
- **Highest-risk code areas:** `artifacts/api-server/src/routes/*.ts` for URL-fetching, payments, admin, AI, and public email-triggering endpoints; `artifacts/api-server/src/utils/fetchUrl.ts`; `artifacts/api-server/src/lib/assertSafeUrl.ts`; `artifacts/api-server/src/lib/email.ts`; `artifacts/agency-website/src/components/ToolPaywall.tsx`; `artifacts/agency-website/src/components/PayPalCheckout.tsx`; `artifacts/agency-website/src/pages/Admin.tsx`.
- **Public surfaces:** most `/api/*` routes, including AI, audit, compare, detect-stack, sniff, clone, blog, contact, agent intake/quote, and PayPal endpoints.
- **Authenticated/admin surfaces:** `/admin`, `/api/blog-admin/*`.
- **Dev-only areas:** `artifacts/mockup-sandbox` unless proven reachable in production.

## Threat Categories

### Spoofing

The only administrative boundary is a shared secret checked on `/api/blog-admin/*`. The system must ensure that only holders of a valid admin secret can manage posts or view enquiries, and that public users cannot gain equivalent access through client-side state, cached credentials, or alternate routes.

### Tampering

Public users can submit arbitrary blog content, AI prompts, URLs, payment parameters, and contact payloads. The server must treat all client-submitted prices, entitlements, and URLs as untrusted, recompute security-sensitive decisions server-side, and validate any content that will later be rendered, emailed, or stored.

### Information Disclosure

The API stores lead/contact data and can fetch arbitrary external URLs. The system must prevent server-side URL fetchers from reaching internal services, metadata endpoints, or localhost resources; admin data must never be exposed through public routes; and logs/errors must avoid leaking secrets or sensitive submissions.

### Denial of Service

Several routes trigger expensive network fetches or long-lived AI streams. The service must maintain production-safe rate limiting, request size limits, and timeouts so anonymous traffic cannot exhaust outbound connections, model spend, or server resources.

### Elevation of Privilege

Admin APIs, payment-gated tools, and any premium functionality must be enforced on the server. Public clients must not be able to obtain paid access, perform privileged actions, or pivot from URL-fetch tooling into internal infrastructure by abusing missing authorization or SSRF controls.