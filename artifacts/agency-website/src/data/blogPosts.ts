export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: number;
  category: string;
  coverImage: string;
  author: { name: string; role: string };
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-your-wordpress-site-is-slow",
    title: "Why Your WordPress Site Is Slow (And the 7 Fixes That Actually Work)",
    excerpt:
      "Most WordPress sites are slower than they should be — and it's almost never the fault of WordPress itself. Here's exactly what's dragging yours down and how to fix it.",
    publishedAt: "2026-03-20",
    readTime: 8,
    category: "Performance",
    coverImage:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&q=80",
    author: { name: "James Carver", role: "Senior WordPress Engineer" },
    tags: ["WordPress", "Performance", "Core Web Vitals", "Caching"],
    content: `
## The uncomfortable truth about slow WordPress sites

WordPress powers over 43% of the web. It's also blamed for a lot of slow websites — usually unfairly. WordPress out of the box is reasonably fast. What slows it down is what gets layered on top: the wrong host, the wrong plugins, unoptimized images, no caching.

If your site loads in more than 2.5 seconds, you're losing real money. Google found that for every 0.1 second improvement in mobile load times, retail sites see an 8% lift in conversions. Amazon famously calculated that every 100ms costs them 1% in sales.

Here are the seven most common culprits and exactly how to fix each one.

---

## 1. Shared hosting that can't keep up

Cheap shared hosting puts thousands of sites on a single server. When your neighbor's traffic spikes, yours suffers. For any business site doing $100k+ in revenue annually, you shouldn't be on $5/month hosting.

**The fix:** Move to a managed WordPress host. [Kinsta](https://kinsta.com), WP Engine, or Cloudways on top of DigitalOcean will dramatically reduce your TTFB (Time to First Byte). Kinsta's average TTFB is under 100ms. Shared hosting averages 600ms+.

---

## 2. Unoptimized images

Images account for the majority of page weight on most WordPress sites. A single 4MB hero image will tank your performance score.

**The fix:** Run every image through compression before upload, or install [ShortPixel](https://shortpixel.com) or Imagify to auto-compress on upload. Then serve modern formats:

\`\`\`html
<picture>
  <source srcset="hero.webp" type="image/webp">
  <img src="hero.jpg" alt="Hero image" width="1200" height="630" loading="lazy">
</picture>
\`\`\`

Always include \`width\` and \`height\` attributes to prevent layout shift (a Core Web Vitals issue). Add \`loading="lazy"\` to everything below the fold.

---

## 3. Render-blocking JavaScript and CSS

Every script and stylesheet in your \`<head>\` that isn't deferred blocks the browser from rendering your page.

**The fix:** In your theme's \`functions.php\`, defer non-critical scripts:

\`\`\`php
function defer_non_critical_scripts($tag, $handle) {
    $no_defer = ['jquery', 'jquery-core'];
    if (in_array($handle, $no_defer)) return $tag;
    return str_replace(' src', ' defer src', $tag);
}
add_filter('script_loader_tag', 'defer_non_critical_scripts', 10, 2);
\`\`\`

For CSS, inline critical styles and lazy-load the rest. Tools like [Critical](https://github.com/addyosmani/critical) can extract your critical CSS automatically.

---

## 4. No page caching

Without caching, every single page request forces PHP and MySQL to build the page from scratch. On a page getting 1,000 visits per day, that's 1,000 database queries that could be avoided.

**The fix:** Install [WP Rocket](https://wp-rocket.me) (paid, worth every penny) or [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/) (free). Configure page caching, browser caching, and GZIP compression together:

In your \`.htaccess\` (Apache):
\`\`\`apache
# Enable GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
\`\`\`

---

## 5. Plugin bloat

The average WordPress site has 20+ plugins. Many of these load scripts and styles on every page whether they're needed or not. A contact form plugin loading its scripts on your blog posts? Unnecessary.

**The fix:** Audit your plugins. Remove anything unused. For the ones you keep, use [Asset CleanUp](https://wordpress.org/plugins/wp-asset-clean-up/) to prevent plugins from loading their CSS/JS on pages where they're not used.

Run our [free site audit tool](/audit) to see which scripts are adding the most weight to your pages.

---

## 6. No CDN

If your server is in New York and your visitors are in London, every request has to travel the Atlantic and back. A CDN caches your static assets across 200+ global edge locations.

**The fix:** Add Cloudflare's free plan. It takes 5 minutes to set up and will immediately improve load times for international visitors. For more aggressive caching and performance, Cloudflare Pro ($20/month) adds image optimization, minification, and better caching rules.

---

## 7. Running an old PHP version

PHP 7.4 is about twice as fast as PHP 5.6. PHP 8.x is even faster. Many sites are still running on 7.x or older because they never updated.

**The fix:** In your hosting control panel (cPanel, Plesk, or your host's dashboard), switch to PHP 8.1 or 8.2. Test your site first — most modern themes and plugins support PHP 8.x, but some legacy code doesn't.

---

## How to measure your actual speed

Use Google's [PageSpeed Insights](https://pagespeed.web.dev/) to see your Core Web Vitals scores (LCP, CLS, FID). These are what Google uses to rank your site.

Or run our [free site audit](/audit) to get a full breakdown of your performance issues with specific, copy-paste-ready code fixes.

---

## When DIY isn't enough

If you've implemented all of the above and your scores are still suffering, it's likely a deeper architectural issue — database query optimization, server-side rendering strategy, or your theme's code quality.

That's where we come in. We've helped dozens of businesses cut their load times by 60–80% through code-level performance work. [Get in touch](/contact) to discuss what's slowing your specific site down.
`,
  },
  {
    slug: "woocommerce-vs-shopify-2026",
    title: "WooCommerce vs Shopify in 2026: Which Should You Actually Choose?",
    excerpt:
      "Both platforms power billions in eCommerce. But they're built for very different kinds of businesses. Here's how to make the right call — and what happens if you choose wrong.",
    publishedAt: "2026-03-12",
    readTime: 10,
    category: "eCommerce",
    coverImage:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80",
    author: { name: "Priya Mehta", role: "eCommerce Strategist" },
    tags: ["Shopify", "WooCommerce", "eCommerce", "Platform"],
    content: `
## Why this decision matters more than you think

Choosing the wrong eCommerce platform is one of the most expensive mistakes a business can make. Not because either platform is bad, but because they're optimized for fundamentally different use cases. Migrating between them later — rebuilding your product catalog, URL structure, customer data, and integrations — typically costs $15,000–$50,000 and months of lost SEO equity.

Getting it right upfront saves both.

---

## Shopify: What it's built for

Shopify is a hosted, all-in-one solution. You pay a monthly subscription ($39–$399/month for most businesses) and get hosting, security, updates, and a polished admin — all managed for you.

**Shopify wins when:**
- You want to focus on selling, not server management
- You're doing straightforward product catalog + checkout
- You don't need heavy customization of the checkout flow
- You have a small technical team (or none)
- You're growing fast and need reliable infrastructure at scale

**Shopify's actual costs (honest total cost of ownership):**
- Plan: $39–$399/month
- Transaction fees: 0.5–2% (unless on Shopify Payments)
- Apps: most stores need 5–15 apps at $10–$50/month each — add $50–$750/month
- Theme: $150–$400 one-time (or custom: $8,000–$25,000)
- Total realistic TCO for a small store: $500–$1,200/month ongoing

**Shopify's real limitations:**
- Checkout customization is severely restricted (unless on Shopify Plus at $2,300/month)
- URL structure is inflexible — bad for complex SEO strategies
- Every feature beyond basics costs another app subscription
- You own nothing — it's a rental, not an asset

---

## WooCommerce: What it's built for

WooCommerce is an open-source plugin for WordPress. It's free to download, but you own and operate everything: your hosting, your database, your code, your backups.

**WooCommerce wins when:**
- You need deep customization (custom checkout flows, unique product types, complex pricing rules)
- You have (or are willing to hire) WordPress developers
- SEO is a critical acquisition channel — WordPress + WooCommerce is the gold standard for content-driven eCommerce
- You're in a heavily regulated industry (healthcare, finance) where you need full data control
- You have unique business logic that no off-the-shelf app handles

**WooCommerce's actual costs:**
- Hosting: $50–$300/month (managed WordPress)
- Development: $3,000–$30,000 upfront depending on customization
- Plugins: $200–$800/year for quality paid plugins
- Total realistic TCO for a small-medium store: $200–$800/month

**WooCommerce's real limitations:**
- You're responsible for security, updates, and server maintenance (or paying someone to handle it)
- Scaling requires more technical planning
- Quality of "free" plugins varies wildly — some will break your site

---

## The decision framework

**Choose Shopify if:**
- You're launching your first store and need to move fast
- You're doing less than $1M/year and growing predictably
- Your products are standard (variants, SKUs, simple bundles)
- You don't have a technical co-founder or in-house dev

**Choose WooCommerce if:**
- Content marketing is a primary growth channel
- You need custom checkout steps, subscription logic, or complex pricing
- You're in a regulated industry
- You want to own your platform (no monthly rent to Shopify)
- You already run WordPress and want to keep your content and store unified

**The nuanced answer for high-growth stores:** Many businesses start on Shopify for speed and migrate to WooCommerce or a custom headless setup when they hit Shopify's ceiling. Plan your tech evolution accordingly.

---

## What about Shopify Plus, headless, and custom builds?

**Shopify Plus ($2,300+/month):** Only makes sense above $1M/year. Unlocks checkout customization and enterprise integrations.

**Headless eCommerce (Shopify or WooCommerce as backend, React frontend):** Best of both worlds but requires significant development investment ($25,000–$80,000). Best for high-traffic stores where performance is a competitive advantage.

**Custom-built (Laravel, Django, etc.):** Rarely the right answer unless you have genuinely unusual business logic that no existing platform supports.

---

## Get the right recommendation for your business

Every business is different. Use our [ROI calculator](/roi) to understand how much your current site's performance might be costing you — then [talk to us](/contact) about which platform gives you the best path forward.

We've migrated businesses from Shopify to WooCommerce and back again, and we'll tell you honestly which direction your specific situation calls for.
`,
  },
  {
    slug: "wordpress-security-vulnerabilities",
    title: "5 Security Vulnerabilities Killing WordPress Sites (And Exactly How to Fix Each One)",
    excerpt:
      "WordPress powers 43% of the web, which makes it the biggest target for automated attacks. Most successful attacks exploit the same five mistakes. Here's how to close them all.",
    publishedAt: "2026-03-05",
    readTime: 7,
    category: "Security",
    coverImage:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80",
    author: { name: "Marcus Chen", role: "Head of Security & Infrastructure" },
    tags: ["WordPress", "Security", "Hardening", "Best Practices"],
    content: `
## Why WordPress sites get hacked

In 2025, over 70% of hacked WordPress sites were compromised through one of five well-known attack vectors — not sophisticated zero-day exploits. The attackers aren't targeting you specifically. They're running automated scans across millions of sites looking for any of these five open doors.

The good news: closing all five takes less than two hours.

---

## 1. Outdated core, plugins, and themes

This is the #1 cause of WordPress hacks, responsible for over 40% of compromised sites. When a vulnerability is discovered in a plugin, security researchers publish the CVE. Attackers then immediately scan millions of sites for the unpatched version.

**The fix:** Updates should be applied within 24–48 hours of release. Enable auto-updates for WordPress core minor releases:

\`\`\`php
// In wp-config.php
define('WP_AUTO_UPDATE_CORE', true);
\`\`\`

For plugins, enable automatic updates from wp-admin → Plugins → hover any plugin → "Enable auto-updates". Or add this to your theme's \`functions.php\`:

\`\`\`php
add_filter('auto_update_plugin', '__return_true');
add_filter('auto_update_theme', '__return_true');
\`\`\`

Also: remove deactivated plugins and themes. They still get scanned even if not active.

---

## 2. Weak or reused admin passwords

Automated brute-force bots attempt thousands of login combinations per minute. They use credential lists from past data breaches — which almost always include "password123", "admin123", and common patterns.

**The fix:** 
1. Use a 20+ character random password for your admin account (password manager — don't try to remember it)
2. Never reuse passwords across sites
3. Limit login attempts. Add this to your \`.htaccess\` or install Limit Login Attempts Reloaded:

\`\`\`nginx
# If using Nginx, add to server block:
limit_req_zone $binary_remote_addr zone=wp_login:10m rate=5r/m;
limit_req zone=wp_login burst=10 nodelay;
\`\`\`

---

## 3. No two-factor authentication

Even a strong password can be leaked through phishing, a compromised third-party service, or malware on your device. 2FA means a stolen password alone isn't enough to get in.

**The fix:** Install [WP 2FA](https://wordpress.org/plugins/wp-2fa/) (free). Configure it to require 2FA for all administrator and editor accounts. TOTP-based authentication (Google Authenticator, Authy) is more secure than SMS-based.

Also consider moving your login URL away from \`/wp-admin\` and \`/wp-login.php\` — these are constantly probed. WPS Hide Login does this cleanly:

\`\`\`
# After installing WPS Hide Login, set your custom login path
# e.g., yoursite.com/secure-portal-2026
\`\`\`

---

## 4. Using "admin" as your username

When WordPress is installed, the default username is "admin". This means attackers already know half of your login credentials — they just need to guess the password.

**The fix:** Create a new administrator account with a non-obvious username, log in with the new account, then delete the original "admin" account and reassign its content to the new user.

You can also block login attempts with the username "admin" entirely by adding to \`functions.php\`:

\`\`\`php
function block_admin_username($user, $username, $password) {
    if ($username === 'admin') {
        return new WP_Error('invalid_username', 'This username is not allowed.');
    }
    return $user;
}
add_filter('authenticate', 'block_admin_username', 30, 3);
\`\`\`

---

## 5. Exposed configuration and file structure

Your \`wp-config.php\` contains database credentials, secret keys, and debug settings. By default, it's slightly protected, but many server configurations expose it accidentally.

**The fix:** Explicitly deny access to sensitive files in your \`.htaccess\`:

\`\`\`apache
# Block access to wp-config.php
<Files wp-config.php>
    order allow,deny
    deny from all
</Files>

# Block directory browsing
Options -Indexes

# Block access to .htaccess itself
<Files .htaccess>
    order allow,deny
    deny from all
</Files>

# Block XML-RPC if you don't need it (used in DDoS amplification attacks)
<Files xmlrpc.php>
    order allow,deny
    deny from all
</Files>
\`\`\`

Also disable the WordPress file editor in wp-config.php (so an attacker with admin access can't execute code):

\`\`\`php
define('DISALLOW_FILE_EDIT', true);
\`\`\`

---

## After hardening: monitoring

Hardening prevents initial compromise. Monitoring catches anything that slips through. Install [Wordfence](https://wordpress.org/plugins/wordfence/) (free tier is sufficient for most sites) for:
- Malware scanning
- Real-time firewall
- Login security monitoring
- File change detection

Set it to email you immediately if it detects a login from a new country or a file change in your WordPress core.

---

## Run a free security audit

Use our [Site Audit tool](/audit) to instantly check your site's security headers, HTTPS configuration, and other key security signals — no signup required.

If you're concerned about your site's security posture or have just discovered a compromise, [contact us](/contact). We've handled emergency recoveries and security audits for dozens of WordPress businesses.
`,
  },
  {
    slug: "mobile-first-design-2026",
    title: "Mobile-First Design in 2026: Why Your 2019 Website Is Losing You Customers",
    excerpt:
      "60% of your visitors are on mobile. Most websites were designed on a desktop, for desktop. Here's the gap that's costing you leads — and what mobile-first actually means in practice.",
    publishedAt: "2026-02-25",
    readTime: 6,
    category: "Design",
    coverImage:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80",
    author: { name: "Aisha Reynolds", role: "UX/UI Design Lead" },
    tags: ["Mobile", "UX Design", "Core Web Vitals", "Conversion"],
    content: `
## The mobile gap most businesses refuse to see

Open your Google Analytics right now and look at your device breakdown. On most business websites, mobile accounts for 55–70% of all sessions. Yet the vast majority of websites are designed on a MacBook Pro, previewed on a MacBook Pro, and optimized for MacBook Pro users.

Then they wonder why mobile conversion rates are a third of desktop.

This isn't a responsive design problem — most sites have responsive CSS. It's a mobile-first *thinking* problem. Here's what it actually means to design for the device your users are actually using.

---

## The five most common mobile failures

### 1. Text that's technically readable but practically impossible

14px body text looks fine on a 27-inch monitor. On a 6.1-inch iPhone screen held at arm's length, it's an accessibility failure. The minimum comfortable body text size for mobile is 16px. Buttons, labels, and form fields need to follow suit.

**The fix:** In your CSS, set a mobile-first base font size:

\`\`\`css
:root {
  font-size: 16px; /* Never go below this on mobile */
}

body {
  line-height: 1.6; /* Generous line height aids mobile readability */
}

@media (min-width: 768px) {
  :root { font-size: 17px; }
}

@media (min-width: 1200px) {
  :root { font-size: 18px; }
}
\`\`\`

### 2. Tap targets that require surgical precision

Apple's Human Interface Guidelines recommend minimum tap target sizes of 44×44px. Google recommends 48×48px with 8px spacing. The average adult fingertip is 44px wide. When your mobile navigation links are 24px tall and packed tightly together, users will accidentally tap the wrong thing — and leave out of frustration.

**The fix:** Add padding rather than changing visual size:

\`\`\`css
.mobile-nav-link {
  display: block;
  padding: 12px 16px; /* Creates 44px+ tap target without changing visual appearance */
  min-height: 44px;
}
\`\`\`

### 3. Popups and overlays that consume the entire screen

Google penalizes sites that show "intrusive interstitials" on mobile. Beyond the SEO impact, a full-screen email capture popup on mobile immediately after page load is one of the fastest ways to get a visitor to hit back.

**The fix:** Use bottom-sheet banners instead of popups, delay them by at least 30 seconds of engagement, and always make the dismiss action obvious and reachable with one thumb.

### 4. Images that aren't sized for the actual viewport

Serving a 2400×1600px image to a mobile user who will see it at 390×260px wastes their bandwidth, their time, and your server resources. A 3G user in a low-coverage area will wait 8+ seconds for your hero image.

**The fix:** Use the \`srcset\` and \`sizes\` attributes:

\`\`\`html
<img
  src="hero-800.jpg"
  srcset="hero-400.jpg 400w, hero-800.jpg 800w, hero-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 800px"
  alt="Hero image"
  width="1200"
  height="630"
  loading="eager"
/>
\`\`\`

This tells the browser to pick the right image for the user's actual screen and connection.

### 5. Forms that fight the mobile keyboard

Mobile forms that open the number keyboard when you need text, or vice versa, frustrate users. Forms that scroll awkwardly when the keyboard appears lose submissions. Input fields that aren't labeled properly fail mobile accessibility.

**The fix:** Use the right input types:

\`\`\`html
<input type="email" inputmode="email" autocomplete="email" />
<input type="tel" inputmode="tel" autocomplete="tel" />
<input type="text" inputmode="numeric" pattern="[0-9]*" /> <!-- For numeric text fields -->
<input type="number" inputmode="decimal" /> <!-- For prices -->
\`\`\`

---

## What the data actually shows

- **53% of users abandon** a site that takes more than 3 seconds to load on mobile (Google research)
- **Mobile conversion rates are 3.5× lower** than desktop on most eCommerce sites — the gap is almost entirely user experience, not intent
- **LCP (Largest Contentful Paint)** on mobile is typically 1.5–2× slower than desktop for the same site
- Google's mobile-first indexing means your **mobile version is what gets ranked** — desktop is secondary

---

## The mobile-first design process

True mobile-first means designing the smallest screen first, then expanding:

1. Start with a 390px viewport (iPhone 15 width)
2. Design every user flow to work with one thumb
3. Test every form, every modal, every navigation on a real device (not browser dev tools)
4. Run a real mobile performance test: [PageSpeed Insights](https://pagespeed.web.dev/) with mobile mode selected
5. Expand the layout progressively for tablet and desktop

---

## How to audit your mobile experience right now

Use our [Site Audit tool](/audit) to instantly check your site's mobile readiness, including viewport configuration, image optimization, and accessibility scores.

For a deeper mobile UX audit and redesign, [let's talk](/contact). We'll run through your current site on real devices and show you exactly where mobile visitors are dropping off.
`,
  },
  {
    slug: "website-speed-roi-calculation",
    title: "The Real Cost of a Slow Website: A Business Owner's Guide to Performance ROI",
    excerpt:
      "Amazon, Google, and Akamai have all published the data. A 1-second improvement in load time can increase conversions by 7–27%. Here's how to calculate the exact number for your business.",
    publishedAt: "2026-02-14",
    readTime: 7,
    category: "Business",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    author: { name: "Jordan Walsh", role: "Digital Strategy Director" },
    tags: ["Performance", "ROI", "Business Case", "Analytics"],
    content: `
## The numbers that changed how the industry thinks about performance

Three studies, conducted independently, all reached the same conclusion:

- **Amazon:** Every 100ms increase in load time correlates with a 1% decrease in revenue
- **Google:** A 0.1-second improvement in mobile load times leads to an 8% increase in conversions for retail sites
- **Akamai:** A 2-second delay in page load increases bounce rates by 103%
- **Walmart:** Every 1-second improvement to page load increased conversions by 2% and revenue by 1%

These aren't marketing claims. They're the results of A/B tests run across hundreds of millions of sessions. And they apply to your site too.

---

## How to calculate what your slow site is costing you right now

You need three numbers from your analytics:

1. **Monthly visitors** (unique sessions from Google Analytics)
2. **Conversion rate** (percentage of visitors who complete a goal: purchase, lead form, phone call)
3. **Average transaction value** (average order value, or estimated lifetime value per lead)

Then apply this formula:

**Revenue at risk per month = (Monthly visitors) × (Conversion rate) × (Average transaction value) × (Speed improvement multiplier)**

**The speed improvement multiplier:**
- Every 1-second improvement → roughly 7% more conversions (conservative Google estimate)
- Improving from 5s to 2s load time → 27–35% more conversions based on available data

**Example:**
- 15,000 monthly visitors
- 2.5% conversion rate
- $120 average order value
- Current load time: 5 seconds, target: 2 seconds (3-second improvement)

Baseline monthly revenue: 15,000 × 2.5% × $120 = **$45,000/month**
With 21% conversion improvement: $45,000 × 1.21 = **$54,450/month**

**That's $9,450/month — $113,400/year — sitting on the table.**

Use our [ROI Calculator](/roi) to run these numbers for your specific business without doing the math manually.

---

## What your current load time is probably doing to your Google rankings

Google made Core Web Vitals a ranking factor in 2021. Since then, page experience signals — including Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS) — directly influence where you appear in search results.

The threshold scores Google uses:
- **LCP:** Good = under 2.5s, Poor = over 4s
- **INP:** Good = under 200ms, Poor = over 500ms
- **CLS:** Good = under 0.1, Poor = over 0.25

Sites in the "Poor" range for any of these are at a disadvantage in competitive search results, even with excellent content and backlinks. 

Check your current scores at [PageSpeed Insights](https://pagespeed.web.dev/) or run a free audit at [our Site Audit tool](/audit).

---

## The five biggest causes of slow sites (and their real-world impact)

### Unoptimized images
Typically adds 2–8MB to page weight. Fixing image optimization alone usually cuts load time by 1–3 seconds.

### No caching
Without page caching, every visit forces full server processing. With caching, repeat visitors load pages in under 0.5 seconds.

### Render-blocking scripts
Third-party scripts (analytics, chat widgets, ad pixels) that load synchronously can add 1–3 seconds before anything is visible to the user. Each third-party script is a separate DNS lookup, TCP connection, and download.

### Cheap shared hosting
The cheapest hosting has TTFB (Time to First Byte) of 600ms–2 seconds before the page even starts loading. Premium managed hosting brings this down to 80–200ms.

### Outdated PHP / no HTTP/2
PHP 8.x is 3× faster than PHP 5.6. HTTP/2 allows parallel resource loading. If your host hasn't updated, you're paying a performance tax on every request.

---

## Building the business case for your stakeholders

If you're trying to justify a performance optimization project to leadership, here's a one-page structure that works:

**Current state:**
- Current average load time: [X] seconds
- Current conversion rate: [X]%
- Current monthly revenue: $[X]

**Projected state after optimization:**
- Target load time: [X] seconds
- Expected conversion rate lift: [X]% (based on Google research)
- Projected monthly revenue: $[X]
- Annual revenue delta: $[X]

**Investment:**
- One-time optimization work: $[X]
- Payback period: [X] months

**The ROI conversation becomes clear.** A $8,000 performance project that generates $75,000 in additional annual revenue has a 2-month payback and 835% first-year ROI. Very few investments come close to that.

---

## Where to start

1. **Measure:** Run [PageSpeed Insights](https://pagespeed.web.dev/) on your top 5 pages
2. **Quantify:** Use our [ROI Calculator](/roi) to estimate what improving performance is worth to your business
3. **Diagnose:** Run a free [Site Audit](/audit) to see exactly what's causing your speed issues, with specific code fixes
4. **Act:** Tackle the wins in order: images first, then caching, then render-blocking resources, then hosting

If you've done all of that and still need help pushing past a wall, [let's talk](/contact). Performance optimization is one of our core specialties.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
