"use client";

import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Home,
  LogIn,
  LogOut,
  Plus,
  User,
  UserPlus,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AppSidebarProps {
  session: any;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ session, onCollapseChange }: AppSidebarProps) {
  const router = useRouter();
  const [contentPreference, setContentPreference] = useState<
    "ALL" | "SAFE_ONLY" | "ADULT_ONLY"
  >("SAFE_ONLY");
  const [isChanging, setIsChanging] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch user's content preference when signed in
  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/user/sensitive-content")
        .then((res) => res.json())
        .then((data) => {
          if (data.contentPreference) {
            setContentPreference(data.contentPreference);
          }
        })
        .catch(console.error);
    }
  }, [session?.user?.id]);

  const changeContentPreference = async (
    newPreference: "ALL" | "SAFE_ONLY" | "ADULT_ONLY",
  ) => {
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
      case "ALL":
        return "bg-blue-600";
      case "SAFE_ONLY":
        return "bg-green-600";
      case "ADULT_ONLY":
        return "bg-red-600";
      default:
        return "bg-green-600";
    }
  };

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

          {/* User Section */}
          <div
            className={`border-t border-slate-700 ${isCollapsed ? "p-2" : "p-4"}`}
          >
            {session ? (
              <div className="space-y-4">
                {/* User Info */}
                {!isCollapsed ? (
                  <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
                    <User className="h-5 w-5 flex-shrink-0 text-slate-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {session.user.username}
                      </p>
                      <p className="text-xs text-slate-400">Signed in</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-700/50">
                      <User className="h-4 w-4 text-slate-300" />
                    </div>
                  </div>
                )}

                {/* Content Preference */}
                {!isCollapsed && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400">
                      Content Filter
                    </label>
                    <select
                      value={contentPreference}
                      onChange={(e) =>
                        changeContentPreference(
                          e.target.value as "ALL" | "SAFE_ONLY" | "ADULT_ONLY",
                        )
                      }
                      disabled={isChanging}
                      className={`w-full rounded-lg border-0 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none ${getPreferenceColor(contentPreference)} text-white ${
                        isChanging
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <option
                        value="SAFE_ONLY"
                        className="bg-slate-700 text-white"
                      >
                        Safe Content
                      </option>
                      <option value="ALL" className="bg-slate-700 text-white">
                        Mixed Content
                      </option>
                      <option
                        value="ADULT_ONLY"
                        className="bg-slate-700 text-white"
                      >
                        18+ Only
                      </option>
                    </select>
                  </div>
                )}

                {/* Sign Out */}
                <button
                  onClick={() => signOut()}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-red-900/20 hover:text-red-400 ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Sign Out" : ""}
                >
                  <LogOut className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">Sign Out</span>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {!isCollapsed && (
                  <div className="mb-3 px-3 py-2">
                    <p className="mb-1 text-xs text-slate-400">Welcome!</p>
                    <p className="text-xs text-slate-300">
                      Sign in to create questions
                    </p>
                  </div>
                )}

                <button
                  onClick={() => router.push("/auth/signin")}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Sign In" : ""}
                >
                  <LogIn className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Sign In</span>}
                </button>

                <button
                  onClick={() => router.push("/auth/signup")}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white ${isCollapsed ? "justify-center" : ""}`}
                  title={isCollapsed ? "Sign Up" : ""}
                >
                  <UserPlus className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Sign Up</span>}
                </button>
              </div>
            )}
          </div>

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

          {/* User Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-slate-300 transition-all hover:text-white"
          >
            <User className="h-5 w-5" />
            <span className="text-xs font-medium">
              {session ? session.user.username : "Account"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile User Menu Overlay */}
      {showMobileMenu && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed right-4 bottom-16 left-4 z-40 max-h-96 overflow-y-auto rounded-lg border border-slate-700 bg-slate-800/95 backdrop-blur-sm md:hidden">
            <div className="p-4">
              {session ? (
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
                    <User className="h-5 w-5 flex-shrink-0 text-slate-300" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {session.user.username}
                      </p>
                      <p className="text-xs text-slate-400">Signed in</p>
                    </div>
                  </div>

                  {/* Content Preference */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-400">
                      Content Filter
                    </label>
                    <select
                      value={contentPreference}
                      onChange={(e) =>
                        changeContentPreference(
                          e.target.value as "ALL" | "SAFE_ONLY" | "ADULT_ONLY",
                        )
                      }
                      disabled={isChanging}
                      className={`w-full rounded-lg border-0 px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none ${getPreferenceColor(contentPreference)} text-white ${
                        isChanging
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer"
                      }`}
                    >
                      <option
                        value="SAFE_ONLY"
                        className="bg-slate-700 text-white"
                      >
                        Safe Content
                      </option>
                      <option value="ALL" className="bg-slate-700 text-white">
                        Mixed Content
                      </option>
                      <option
                        value="ADULT_ONLY"
                        className="bg-slate-700 text-white"
                      >
                        18+ Only
                      </option>
                    </select>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-red-900/20 hover:text-red-400"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-3 px-3 py-2">
                    <p className="mb-1 text-sm font-medium text-white">
                      Welcome!
                    </p>
                    <p className="text-xs text-slate-300">
                      Sign in to create questions
                    </p>
                  </div>

                  <button
                    onClick={() => router.push("/auth/signin")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
                  >
                    <LogIn className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Sign In</span>
                  </button>

                  <button
                    onClick={() => router.push("/auth/signup")}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
                  >
                    <UserPlus className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
