"use client";

import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Home,
  Moon,
  Plus,
  Sun,
  User,
} from "lucide-react";
import { type Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTheme } from "~/contexts/ThemeContext";

interface AppSidebarProps {
  session: Session | null;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ session, onCollapseChange }: AppSidebarProps) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 hidden h-full border-r border-gray-200 bg-white backdrop-blur-sm transition-all duration-300 ease-in-out md:block dark:border-slate-700 dark:bg-slate-800/90 ${
          isCollapsed ? "w-16" : "w-80"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={`border-b border-gray-200 dark:border-slate-700 ${isCollapsed ? "p-3" : "p-6"}`}
          >
            <Link
              href="/"
              className={`flex items-center gap-4 ${isCollapsed ? "justify-center" : ""}`}
            >
              <div
                className={`flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg ${
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                }`}
              >
                <span
                  className={`font-bold text-white ${isCollapsed ? "text-base" : "text-lg"}`}
                >
                  WR
                </span>
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-serif text-lg font-black text-transparent dark:from-blue-400 dark:to-purple-400">
                    Would You Rather
                  </h1>
                  <p className="text-xs font-medium text-gray-600 dark:text-slate-300">
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
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? "Home" : ""}
            >
              <Home className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">Home</span>}
            </Link>

            <Link
              href="/categories"
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white ${isCollapsed ? "justify-center" : ""}`}
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
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Create Question" : ""}
                >
                  <Plus className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">Create Question</span>
                  )}
                </button>

                <Link
                  href="/profile"
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-700/50 dark:hover:text-white ${isCollapsed ? "justify-center" : ""}`}
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
            className={`border-t border-gray-200 dark:border-slate-700 ${isCollapsed ? "p-2" : "p-4"} space-y-2`}
          >
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white ${isCollapsed ? "justify-center" : ""}`}
              title={
                isCollapsed
                  ? isDarkMode
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                  : ""
              }
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {!isCollapsed && (
                <span className="font-medium">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                const newCollapsed = !isCollapsed;
                setIsCollapsed(newCollapsed);
                onCollapseChange?.(newCollapsed);
              }}
              className="flex w-full items-center justify-center rounded-lg p-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-700/50 dark:hover:text-white"
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
      <nav className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm md:hidden dark:border-slate-700 dark:bg-slate-800/95">
        <div className="flex items-center justify-around px-4 py-3">
          {/* Home */}
          <Link
            href="/"
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Categories */}
          <Link
            href="/categories"
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
          >
            <Grid3X3 className="h-5 w-5" />
            <span className="text-xs font-medium">Categories</span>
          </Link>

          {/* Create (if signed in) */}
          {session && (
            <button
              onClick={() => router.push("/create")}
              className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
            >
              <Plus className="h-5 w-5" />
              <span className="text-xs font-medium">Create</span>
            </button>
          )}

          {/* Profile (if signed in) */}
          {session && (
            <Link
              href="/profile"
              className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
            >
              <User className="h-5 w-5" />
              <span className="text-xs font-medium">Profile</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 transition-all hover:text-gray-900 dark:text-slate-300 dark:hover:text-white"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="text-xs font-medium">Theme</span>
          </button>
        </div>
      </nav>
    </>
  );
}
