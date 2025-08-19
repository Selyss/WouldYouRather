"use client";

import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Home,
  Plus,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppSidebarProps {
  session: any;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ session, onCollapseChange }: AppSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 hidden h-full border-r border-slate-700 bg-slate-800/90 backdrop-blur-sm transition-all duration-300 ease-in-out md:block ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={`border-b border-slate-700 ${isCollapsed ? "p-3" : "p-6"}`}
          >
            <Link
              href="/"
              className={`flex items-center gap-4 ${isCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`flex flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-lg ${
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                }`}
              >
                <span
                  className={`font-bold text-slate-800 ${isCollapsed ? "text-base" : "text-lg"}`}
                >
                  ?
                </span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="font-serif text-lg font-black text-white">
                    Would You Rather?
                  </h1>
                  <p className="text-xs font-medium text-slate-300">
                    Make your choice & see results
                  </p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 space-y-2 ${isCollapsed ? "p-2" : "p-4"}`}>
            <Link
              href="/"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Home" : ""}
            >
              <Home className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>

            <Link
              href="/categories"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Categories" : ""}
            >
              <Grid3X3 className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Categories</span>}
            </Link>

            {/* <Link
                          href="/leaderboard"
                          className={`flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all ${isCollapsed ? 'justify-center' : ''}`}
                          title={isCollapsed ? "Leaderboard" : ""}
                      >
                          <Trophy className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && <span className="font-medium">Leaderboard</span>}
                      </Link> */}

            {session && (
              <>
                <button
                  onClick={() => router.push("/create")}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Create Question" : ""}
                >
                  <Plus className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">Create Question</span>
                  )}
                </button>

                <Link
                  href="/profile"
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Profile" : ""}
                >
                  <User className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Profile</span>}
                </Link>
              </>
            )}
          </nav>

          {/* Collapse Toggle */}
          <div
            className={`border-t border-slate-700 ${isCollapsed ? "p-2" : "p-4"}`}
          >
            <button
              onClick={() => {
                const newCollapsed = !isCollapsed;
                setIsCollapsed(newCollapsed);
                onCollapseChange?.(newCollapsed);
              }}
              className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-700 bg-slate-800/95 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 transition-all hover:text-white"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Categories */}
          <Link
            href="/categories"
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 transition-all hover:text-white"
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="text-xs font-medium">Categories</span>
          </Link>

          {/* Create (if signed in) */}
          {session && (
            <button
              onClick={() => router.push("/create")}
              className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 transition-all hover:text-white"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">Create</span>
            </button>
          )}

          {/* Profile (if signed in) */}
          {session && (
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 transition-all hover:text-white"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
