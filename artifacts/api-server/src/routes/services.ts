import { Router, type IRouter } from "express";

const router: IRouter = Router();

const services = [
  {
    id: "wordpress-development",
    title: "WordPress Development",
    description:
      "We build high-performing, fully customized, SEO-optimized, lightning-fast, and secure WordPress websites that captivate visitors and convert them into customers.",
    icon: "Globe",
    category: "WordPress",
    features: [
      "Custom WordPress development from scratch",
      "SEO optimization & Core Web Vitals",
      "Lightning-fast performance",
      "SSL security & hardening",
      "Responsive across all devices",
      "CMS training & documentation",
    ],
  },
  {
    id: "custom-plugins",
    title: "Custom Plugins & Add-Ons",
    description:
      "We create completely custom plugins and add-ons to extend WordPress functionality, integrate third-party software, and deliver a cohesive tech ecosystem.",
    icon: "Puzzle",
    category: "Plugin",
    features: [
      "Custom plugin development",
      "Third-party API integrations",
      "Plugin maintenance & updates",
      "WooCommerce extensions",
      "Content plugin features",
      "Workflow automation tools",
    ],
  },
  {
    id: "theme-customization",
    title: "Theme Customization",
    description:
      "We provide complete theme customization to transform off-the-shelf themes into branded, conversion-optimized experiences — or build themes entirely from scratch.",
    icon: "Paintbrush",
    category: "Theme",
    features: [
      "Custom theme development",
      "Off-the-shelf theme transformation",
      "Brand identity integration",
      "Conversion-optimized design",
      "Page builder customization",
      "Child theme development",
    ],
  },
  {
    id: "mobile-first-design",
    title: "Mobile-First Design",
    description:
      "We develop mobile-first websites so that they look and perform great on all devices. Enhanced front-end design improves user experience across every screen.",
    icon: "Smartphone",
    category: "Mobile",
    features: [
      "Mobile-first development",
      "Responsive design across all devices",
      "Touch-optimized interactions",
      "Performance on mobile networks",
      "Cross-browser compatibility",
      "Progressive Web App (PWA) support",
    ],
  },
  {
    id: "ecommerce-solutions",
    title: "eCommerce Solutions",
    description:
      "From WooCommerce to Shopify, we build powerful online stores that look stunning, perform seamlessly, and help your business grow.",
    icon: "ShoppingCart",
    category: "eCommerce",
    features: [
      "WooCommerce development",
      "Shopify store setup & customization",
      "Payment gateway integration",
      "Inventory management",
      "Order & shipping automation",
      "Conversion optimization",
    ],
  },
  {
    id: "software-app-development",
    title: "Software & App Development",
    description:
      "From custom web applications to mobile apps and complete software solutions, we build digital tools that make your business work smarter.",
    icon: "Code",
    category: "Software",
    features: [
      "Custom web application development",
      "Mobile app development (iOS & Android)",
      "UI/UX design",
      "API development & integration",
      "SaaS product development",
      "Ongoing maintenance & support",
    ],
  },
];

router.get("/services", (_req, res) => {
  res.json(services);
});

export default router;
