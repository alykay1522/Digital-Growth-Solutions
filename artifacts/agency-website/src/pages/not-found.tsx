import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Mail, Search } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";

export default function NotFound() {
  useMeta({
    title: "Page Not Found",
    description: "The page you were looking for doesn't exist. Return to the Digital Growth Solutions Agency homepage.",
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-xl mx-auto">
        <div className="relative mb-8 inline-block">
          <span className="text-[10rem] font-display font-bold text-primary/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4">
          Page not found
        </h1>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="h-12 px-8 rounded-xl gap-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              Back to home
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="h-12 px-8 rounded-xl gap-2 w-full sm:w-auto">
              <Mail className="w-4 h-4" />
              Contact us
            </Button>
          </Link>
          <Link href="/audit">
            <Button variant="ghost" className="h-12 px-8 rounded-xl gap-2 text-primary hover:text-primary hover:bg-primary/10 w-full sm:w-auto">
              Free site audit
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-10">
          Need help? Email us at{" "}
          <a href="mailto:info@digitalgrowthsolutions.org" className="text-primary hover:underline">
            info@digitalgrowthsolutions.org
          </a>
        </p>
      </div>
    </div>
  );
}
