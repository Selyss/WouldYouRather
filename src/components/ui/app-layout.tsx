"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
      {/* Background overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent dark:from-blue-900/20 dark:via-slate-900/5"></div>

      <AppSidebar session={session} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
    </div>
  );
}
