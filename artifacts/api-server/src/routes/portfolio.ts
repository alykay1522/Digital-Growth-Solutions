import { Router, type IRouter } from "express";

const router: IRouter = Router();

const portfolio = [
  {
    id: "1",
    title: "LuxeStyle eCommerce Store",
    description:
      "A high-end fashion eCommerce store built on WooCommerce with custom product filtering, wishlist functionality, and seamless checkout experience.",
    category: "eCommerce",
    tags: ["WooCommerce", "WordPress", "Custom Plugin", "Payment Integration"],
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    clientName: "LuxeStyle Fashion",
    result: "340% increase in online sales within 6 months",
  },
  {
    id: "2",
    title: "TechPro Corporate Website",
    description:
      "Complete WordPress redesign for a B2B tech company with custom SEO strategy, performance optimization, and lead-generation landing pages.",
    category: "WordPress",
    tags: ["WordPress", "SEO", "Performance", "Lead Generation"],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    clientName: "TechPro Solutions",
    result: "210% increase in organic traffic in 90 days",
  },
  {
    id: "3",
    title: "FitLife Mobile App",
    description:
      "A cross-platform mobile fitness app with workout tracking, nutrition plans, and social community features built with React Native.",
    category: "Mobile",
    tags: ["React Native", "Mobile App", "iOS", "Android"],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    clientName: "FitLife Health",
    result: "50,000+ downloads in first 3 months",
  },
  {
    id: "4",
    title: "RestaurantPro Booking Plugin",
    description:
      "Custom WordPress plugin for restaurant reservation management with SMS/email notifications, Google Calendar sync, and admin dashboard.",
    category: "Plugin",
    tags: ["WordPress Plugin", "Custom Development", "API Integration"],
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    clientName: "RestaurantPro Network",
    result: "Used by 200+ restaurants, saving 15 hrs/week per location",
  },
  {
    id: "5",
    title: "Bloom Boutique Shopify Store",
    description:
      "Bespoke Shopify theme development for a floral boutique with custom animations, gift-wrapping options, and personalized product builder.",
    category: "eCommerce",
    tags: ["Shopify", "Custom Theme", "eCommerce", "UI/UX"],
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88df5691166a?w=800&q=80",
    clientName: "Bloom Boutique",
    result: "Average order value increased by 85%",
  },
  {
    id: "6",
    title: "EduLearn LMS Platform",
    description:
      "Custom Learning Management System built on WordPress with BuddyBoss, custom course builder plugin, certificates, and payment integration.",
    category: "WordPress",
    tags: ["WordPress", "LMS", "Custom Plugin", "BuddyBoss"],
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    clientName: "EduLearn Academy",
    result: "10,000+ students enrolled in first semester",
  },
  {
    id: "7",
    title: "ClarityBank Financial Dashboard",
    description:
      "Secure web application with real-time financial data visualization, user authentication, and automated reporting for a fintech startup.",
    category: "Software",
    tags: ["Web App", "React", "Data Visualization", "Fintech"],
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    clientName: "ClarityBank",
    result: "Reduced reporting time by 70% for 500+ users",
  },
  {
    id: "8",
    title: "Heritage Stays Theme",
    description:
      "Custom WordPress theme for a boutique hotel chain with immersive full-screen imagery, availability calendar, and direct booking engine.",
    category: "Theme",
    tags: ["WordPress Theme", "Custom Design", "Booking System", "Hospitality"],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    clientName: "Heritage Stays Hotels",
    result: "Direct bookings increased by 160%, reducing OTA fees",
  },
];

router.get("/portfolio", (_req, res) => {
  res.json(portfolio);
});

export default router;
