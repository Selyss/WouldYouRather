"use client";

import { ArrowLeft, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "~/components/ui/app-layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contentPreference, setContentPreference] = useState<
    "ALL" | "SAFE_ONLY" | "ADULT_ONLY"
  >("SAFE_ONLY");
  const [isChangingPreference, setIsChangingPreference] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadContentPreference();
  }, [session, status, router]);

  const loadContentPreference = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch("/api/user/sensitive-content");
      const data = await response.json();
      if (data.contentPreference) {
        setContentPreference(data.contentPreference);
      }
    } catch (error) {
      console.error("Failed to load content preference:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeContentPreference = async (
    newPreference: "ALL" | "SAFE_ONLY" | "ADULT_ONLY",
  ) => {
    if (!session?.user?.id || isChangingPreference) return;

    setIsChangingPreference(true);
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
      setIsChangingPreference(false);
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

  const getPreferenceLabel = (pref: string) => {
    switch (pref) {
      case "ALL":
        return "Mixed Content";
      case "SAFE_ONLY":
        return "Safe Content";
      case "ADULT_ONLY":
        return "18+ Only";
      default:
        return "Safe Content";
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl text-slate-300">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!session) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl text-slate-300">
            Please sign in to access settings.
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-8 p-6">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700/50 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-slate-300" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
        </div>

        {/* Settings Cards */}
        <div className="space-y-6">
          {/* Content Filter */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Content Filter
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Content Preference
                  </label>
                  <select
                    value={contentPreference}
                    onChange={(e) =>
                      changeContentPreference(
                        e.target.value as "ALL" | "SAFE_ONLY" | "ADULT_ONLY",
                      )
                    }
                    disabled={isChangingPreference}
                    className={`w-full max-w-xs rounded-lg border-0 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none ${getPreferenceColor(contentPreference)} text-white ${
                      isChangingPreference
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
                  <p className="mt-2 text-sm text-slate-400">
                    Current setting:{" "}
                    <span className="font-medium text-slate-300">
                      {getPreferenceLabel(contentPreference)}
                    </span>
                  </p>
                </div>
                <div className="text-xs text-slate-500">
                  <p>
                    • <strong>Safe Content:</strong> Family-friendly questions
                    only
                  </p>
                  <p>
                    • <strong>Mixed Content:</strong> All appropriate questions
                    including mature themes
                  </p>
                  <p>
                    • <strong>18+ Only:</strong> Adult content and mature themes
                    only
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardContent className="p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">
                Account Actions
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-700/30 p-4">
                  <div>
                    <h3 className="font-medium text-white">Sign Out</h3>
                    <p className="text-sm text-slate-400">
                      Sign out of your account on this device
                    </p>
                  </div>
                  <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="border-red-600 text-red-400 hover:border-red-500 hover:bg-red-900/20 hover:text-red-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
                <p className="text-xs text-slate-500">
                  You&apos;ll be redirected to the sign-in page after signing
                  out.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
