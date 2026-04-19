declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type EventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
};

export function trackEvent(action: string, params?: EventParams) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
}

export const GA = {
  ctaClick: (label: string) =>
    trackEvent("cta_click", { event_category: "engagement", event_label: label }),

  formSubmit: (form: string) =>
    trackEvent("form_submit", { event_category: "conversion", event_label: form }),

  toolLaunch: (tool: string) =>
    trackEvent("tool_launch", { event_category: "tools", event_label: tool }),

  toolUnlock: (tool: string, amount: string) =>
    trackEvent("tool_unlock", { event_category: "revenue", event_label: tool, value: parseFloat(amount) }),

  paymentStart: (package_name: string, amount: string) =>
    trackEvent("payment_start", { event_category: "revenue", event_label: package_name, value: parseFloat(amount) }),

  paymentSuccess: (package_name: string, amount: string) =>
    trackEvent("purchase", { event_category: "revenue", event_label: package_name, value: parseFloat(amount), currency: "USD" }),

  pageView: (page: string) =>
    trackEvent("page_view", { page_title: page }),
};
