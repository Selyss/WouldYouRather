"use client";

import { Grid3X3, Home, Moon, Plus, Sun, User } from "lucide-react";
import { type Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "~/contexts/ThemeContext";

interface AppSidebarProps {
  session: Session | null;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function AppSidebar({ session }: AppSidebarProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();

  // Determine current view based on pathname
  const getCurrentView = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/categories")) return "categories";
    if (pathname === "/create") return "create";
    if (pathname.startsWith("/profile")) return "profile";
    if (pathname === "/leaderboard") return "leaderboard";
    return "home"; // default fallback
  };

  const currentView = getCurrentView();

  const navItems = [
    { id: "home", icon: Home, label: "Home", href: "/" },
    {
      id: "categories",
      icon: Grid3X3,
      label: "Categories",
      href: "/categories",
    },
    { id: "create", icon: Plus, label: "Create", href: "/create" },
    // TODO: Add leaderboard when implemented
    // {
    //   id: "leaderboard",
    //   icon: Trophy,
    //   label: "Leaderboard",
    //   href: "/leaderboard",
    // },
    { id: "profile", icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <>
      {/* Header Navigation */}
      <header className="border-b border-gray-200 bg-white shadow-sm transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <span className="text-lg font-bold text-white">WR</span>
                </div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400">
                  Would You Rather
                </h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden space-x-1 md:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  // Skip create and profile if not signed in
                  if (
                    !session &&
                    (item.id === "create" || item.id === "profile")
                  ) {
                    return null;
                  }

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
                        currentView === item.id
                          ? "bg-blue-100 text-blue-700 shadow-sm dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={toggleDarkMode}
                className="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-gray-200 bg-white shadow-lg transition-colors duration-300 md:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Skip create and profile if not signed in
            if (!session && (item.id === "create" || item.id === "profile")) {
              return null;
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center p-3 transition-colors duration-200 ${
                  currentView === item.id
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-400 dark:text-gray-500"
                }`}
              >
                <Icon size={24} />
                <span className="mt-1 text-xs">{item.label}</span>
              </Link>
            );
          })}

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex flex-col items-center p-3 text-gray-400 transition-colors duration-200 dark:text-gray-500"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            <span className="mt-1 text-xs">Theme</span>
          </button>
        </div>
      </div>
    </>
  );
}
