"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AppSidebar } from "./app-sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleStorageChange = () => {
      const collapsed = localStorage.getItem("sidebar-collapsed") === "true";
      setIsCollapsed(collapsed);
    };

    // Initial check
    handleStorageChange();

    // Listen for changes
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
      {/* Background overlay */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent dark:from-blue-900/20 dark:via-slate-900/5"></div>

      <AppSidebar session={session} onCollapseChange={setIsCollapsed} />
      <main
        className={`relative z-10 flex-1 pb-20 transition-all duration-300 md:pb-0 ${
          isCollapsed ? "ml-0 md:ml-16" : "ml-0 md:ml-80"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
