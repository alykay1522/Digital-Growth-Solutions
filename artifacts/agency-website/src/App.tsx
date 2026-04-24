import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { CookieBanner } from "@/components/CookieBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/not-found";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SiteAudit from "./pages/SiteAudit";
import RoiCalculator from "./pages/RoiCalculator";
import TechStack from "./pages/TechStack";
import Compare from "./pages/Compare";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Results from "./pages/Results";
import Sniff from "./pages/Sniff";
import Clone from "./pages/Clone";
import Pricing from "./pages/Pricing";
import Pay from "./pages/Pay";
import Admin from "./pages/Admin";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ShopifyService from "./pages/ShopifyService";
import AIService from "./pages/AIService";
import WebsiteRescue from "./pages/WebsiteRescue";
// AI Agents
import AgentsHub from "./pages/agents/AgentsHub";
import AuditAgent from "./pages/agents/AuditAgent";
import QuoteAgent from "./pages/agents/QuoteAgent";
import SupportAgent from "./pages/agents/SupportAgent";
import IntakeAgent from "./pages/agents/IntakeAgent";
import SeoAgent from "./pages/agents/SeoAgent";
import ContentAgent from "./pages/agents/ContentAgent";
import CarePlanAgent from "./pages/agents/CarePlanAgent";
import RescueAgent from "./pages/agents/RescueAgent";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/audit" component={SiteAudit} />
        <Route path="/roi" component={RoiCalculator} />
        <Route path="/tech-stack" component={TechStack} />
        <Route path="/compare" component={Compare} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/results" component={Results} />
        <Route path="/sniff" component={Sniff} />
        <Route path="/clone" component={Clone} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/pay" component={Pay} />
        <Route path="/admin" component={Admin} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={Terms} />
        <Route path="/services/shopify-development" component={ShopifyService} />
        <Route path="/services/ai-automation" component={AIService} />
        <Route path="/rescue" component={WebsiteRescue} />
        {/* AI Agents */}
        <Route path="/agents" component={AgentsHub} />
        <Route path="/agents/audit" component={AuditAgent} />
        <Route path="/agents/quote" component={QuoteAgent} />
        <Route path="/agents/support" component={SupportAgent} />
        <Route path="/agents/intake" component={IntakeAgent} />
        <Route path="/agents/seo" component={SeoAgent} />
        <Route path="/agents/content" component={ContentAgent} />
        <Route path="/agents/care-plan" component={CarePlanAgent} />
        <Route path="/agents/rescue" component={RescueAgent} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <CookieBanner />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
