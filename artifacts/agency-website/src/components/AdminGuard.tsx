import React, { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

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

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (status === "locked") {
    return <Redirect to="/404" />;
  }

  return <>{children}</>;
}
