import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-3">
            Something went wrong
          </h1>
          <p className="text-white/60 mb-8 leading-relaxed">
            An unexpected error occurred. Our team has been notified. Please try refreshing the page or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh page
            </Button>
            <a href="/">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to home
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
