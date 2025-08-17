"use client";

import { useSession } from "next-auth/react";
import { AppSidebar } from "./app-sidebar";
import { useState, useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Listen for sidebar collapse state changes
    useEffect(() => {
        const handleStorageChange = () => {
            const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
            setIsCollapsed(collapsed);
        };

        // Initial check
        handleStorageChange();

        // Listen for changes
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/5 to-transparent pointer-events-none"></div>
      
          <AppSidebar session={session} onCollapseChange={setIsCollapsed} />
          <main
              className={`flex-1 pb-20 md:pb-0 transition-all duration-300 relative z-10 ${isCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-80'
                  }`}
          >
        {children}
      </main>
    </div>
  );
}
