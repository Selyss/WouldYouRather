"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent pointer-events-none"></div>
      
      <AppSidebar session={session} />
      <main className="flex-1 ml-0 md:ml-80 transition-all duration-300 relative z-10">
        {children}
      </main>
    </div>
  );
}
