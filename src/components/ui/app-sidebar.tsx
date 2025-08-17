"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "./button";
import Link from "next/link";
import { Home, Plus, User, Settings, LogOut, LogIn, UserPlus } from "lucide-react";

interface AppSidebarProps {
  session: any;
}

export function AppSidebar({ session }: AppSidebarProps) {
  const router = useRouter();
  const [contentPreference, setContentPreference] = useState<"ALL" | "SAFE_ONLY" | "ADULT_ONLY">("SAFE_ONLY");
  const [isChanging, setIsChanging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch user's content preference when signed in
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/sensitive-content")
        .then(res => res.json())
        .then(data => {
          if (data.contentPreference) {
            setContentPreference(data.contentPreference);
          }
        })
        .catch(console.error);
    }
  }, [session?.user?.id]);

  const changeContentPreference = async (newPreference: "ALL" | "SAFE_ONLY" | "ADULT_ONLY") => {
    if (!session?.user?.id || isChanging) return;
    
    setIsChanging(true);
    try {
      const response = await fetch("/api/user/sensitive-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentPreference: newPreference,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setContentPreference(data.contentPreference);
        
        // Refresh the page to reload questions with new filter
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to change content preference:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const getPreferenceColor = (pref: string) => {
    switch (pref) {
      case "ALL": return "bg-blue-600";
      case "SAFE_ONLY": return "bg-green-600";
      case "ADULT_ONLY": return "bg-red-600";
      default: return "bg-green-600";
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800/90 backdrop-blur-sm border border-slate-700 text-white p-2 rounded-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-800/90 backdrop-blur-sm border-r border-slate-700 transition-all duration-300 ease-in-out z-40 ${
          isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'w-80'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-slate-800 text-lg font-bold">?</span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-serif font-black text-lg text-white">Would You Rather?</h1>
                  <p className="text-slate-300 text-xs font-medium">Make your choice & see results</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>

            {session && (
              <button
                onClick={() => router.push("/create")}
                className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all w-full text-left"
              >
                <Plus className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">Create Question</span>}
              </button>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-700">
            {session ? (
              <div className="space-y-4">
                {/* User Info */}
                {!isCollapsed && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-slate-700/50 rounded-lg">
                    <User className="w-5 h-5 text-slate-300 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {session.user.username}
                      </p>
                      <p className="text-xs text-slate-400">Signed in</p>
                    </div>
                  </div>
                )}

                {/* Content Preference */}
                {!isCollapsed && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 block">Content Filter</label>
                    <select
                      value={contentPreference}
                      onChange={(e) => changeContentPreference(e.target.value as "ALL" | "SAFE_ONLY" | "ADULT_ONLY")}
                      disabled={isChanging}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getPreferenceColor(contentPreference)} text-white ${
                        isChanging ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <option value="SAFE_ONLY" className="bg-slate-700 text-white">Safe Content</option>
                      <option value="ALL" className="bg-slate-700 text-white">Mixed Content</option>
                      <option value="ADULT_ONLY" className="bg-slate-700 text-white">18+ Only</option>
                    </select>
                  </div>
                )}

                {/* Sign Out */}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all w-full text-left"
                >
                  <LogOut className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Sign Out</span>}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {!isCollapsed && (
                  <div className="px-3 py-2 mb-3">
                    <p className="text-xs text-slate-400 mb-1">Welcome!</p>
                    <p className="text-xs text-slate-300">Sign in to create questions</p>
                  </div>
                )}
                
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all w-full text-left"
                >
                  <LogIn className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Sign In</span>}
                </button>

                <button
                  onClick={() => router.push("/auth/signup")}
                  className="flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all w-full text-left"
                >
                  <UserPlus className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Sign Up</span>}
                </button>
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <div className="hidden md:block p-4 border-t border-slate-700">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center justify-center w-full p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all"
            >
              <svg 
                className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
