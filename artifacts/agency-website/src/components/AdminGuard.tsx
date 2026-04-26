import React, { useState, useEffect } from "react";
import { AlertTriangle, Bot, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BASE_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
const SESSION_KEY = "admin_pw";

async function verifyPassword(pw: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/blog-admin/posts`, {
      headers: { "Content-Type": "application/json", "x-admin-password": pw },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "unlocked">("checking");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      verifyPassword(saved).then((ok) => {
        setStatus(ok ? "unlocked" : "locked");
        if (!ok) sessionStorage.removeItem(SESSION_KEY);
      });
    } else {
      setStatus("locked");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyPassword(pw);
    if (ok) {
      sessionStorage.setItem(SESSION_KEY, pw);
      setStatus("unlocked");
    } else {
      setError("Incorrect password.");
    }
    setLoading(false);
  };

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (status === "locked") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-2xl border border-border shadow-xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-display font-bold text-secondary">AI Agents</h1>
            <p className="text-sm text-muted-foreground mt-1">Owner access only — sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="ag-pw" className="text-sm font-semibold text-secondary mb-1.5 block">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="ag-pw"
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="Enter admin password"
                  className="h-11 pr-10"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !pw}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Same password as the admin panel.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
