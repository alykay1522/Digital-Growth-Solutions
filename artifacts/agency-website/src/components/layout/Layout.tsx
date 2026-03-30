import React, { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/ChatWidget";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
